/**
 * Lu's main class
 * @class Lu
 * @constructor
 * @require inject
 * @param {Object} settings Configuration properties for this instance
 */
var Lu = function(){
  var self = this;

  /**
   * Loads and instantiates components.
   * @public
   * @static
   * @method execute
   * @param {Object} $element a jQuery collection
   * @return {Object} The executed element (allows chaining)
   */
  this.execute = function( $element ){
    var $nodes = $element,
      deferral = $.Deferred(),
      requirements = [],
      count;

    /**
     * Instantiates a control with selected element.
     * @method execute
     * @private
     * @param {Array} $node A jQuery collection with the selected elements.
     * @param {String} key The name of the Control.
     * @param {Function} Control The Control's constructor.
     * @return {Void}
     */
    function execute( $element ){
      var components = $element.lu( 'getComponents' );

      //no components were found so there is nothing to do
      if( components.length === 0 ){
        deferral.resolve();
      }
      _.each( components, function( component, key ){
        var requirement = 'lu/' + key,
          settings = component.settings;

        if( _.indexOf( requirements, requirement ) === -1 ){
          requirements.push( requirement );
        }

        count -= 1;

        deferral.then( function( required, module, exports ){
          var Component = require( requirement ),
            dependenciesResolved = false;

          if( component.hasDependencies ){
            $element.one( 'lu:dependencies-resolved', function( event, instance ){
              event.stopPropagation();
              dependenciesResolved = true;
            } );
          }

          component.instance = new Component( $element, settings );

          if( dependenciesResolved ){
            component.deferral.resolve( component.instance );
          } else if( !dependenciesResolved && component.hasDependencies ){
            component.instance.one( 'dependencies-resolved', function( event, instance ){
              event.stopPropagation();
              component.deferral.resolve( component.instance );
            } );
          } else {
            component.deferral.resolve( component.instance );
          }

        } );

        if( count === 0 ){
          require.ensure( requirements, function( required, module, exports ){
            deferral.resolve( required, module, exports );
          } );
        }

      } );
    }

    if( $element.data( 'mapped' ) ){
      $nodes = $nodes.add( $element );
    }

    count = $nodes.length;

    _.each( $nodes, function( item, index ){
      execute( $( item ) );
    } );

    return deferral;
  };
};

Lu = window.Lu = new Lu();

/**
 * Returns a components object containing all components mapped to a node.
 * Available through $.lu jQuery plug-in.
 * @method getComponents
 * @private
 * @static
 * @param {Object} $element a jQuery collection
 * @return {Object} The Lu components associated with the given element
 */
function getComponents( $element ){
  var components = 'components';
  if( $element.length > 0 ){
    return $element.data( components ) || $element.data( components, {} ).data( components );
  } else {
    return {};
  }
}

/**
 * Returns a component.
 * Available through $.lu jQuery plug-in.
 * @method getComponents
 * @private
 * @static
 * @param {Object} $element a jQuery collection
 * @param {String} $element the components key
 * @return {Object} The Lu component associated with the given element
 */
function getComponent( $element, key ){
  var components = $element.lu( 'getComponents' );
  return components[key];
}

/**
 * Gets the mapped parents of the passed in $element.
 * Available through $.lu jQuery plug-in.
 * @method getParents
 * @public
 * @static
 * @param {Object} $element a jQuery collection
 * @return {Object} A jQuery collection representing the parents
 */
function getParents( $element ){
  return $element.parents().filter( Lu.$mapped );
}

/**
 * Gets the mapped descendants of the passed in $element. Available through $.lu jQuery plug-in.
 * @method getDescendants
 * @public
 * @static
 * @param {Object} $element a jQuery collection
 * @return {Object} A Jquery collection of the descendants
 */
function getDescendants( $element ){
  return $element.find( Lu.$mapped );
}

/**
 * Gets the mapped children of the passed in $element. Available through $.lu jQuery plug-in.
 * @method getChildren
 * @public
 * @static
 * @param {Object} $element a jQuery collection
 * @return {Object} A jQuery collection of the children
 */
function getChildren( $element ){
  return $element.children( Lu.$mapped );
}

/**
 * Add an $observer to an $element. Observers are added in $.data as $observers.
 * Available through $.lu jQuery plug-in.
 * @public
 * @static
 * @method observe
 * @param {Object} $element a jQuery collection
 * @param {Object} $observer a jQuery collection
 * @return {Object} The target element (allows chaining)
 */
function observe( $element, $observer ){
  var $observers = $element.data( '$observers' );

  if( !$observers ){
    return $element.data( '$observers', $observer );
  }

  $observers = $observers.add( $observer.not( $observers ) );
  $element.data( '$observers', $observers );

  return $element;
}

/**
 * Remove an observer from an $element. Available through $.lu jQuery plug-in.
 * @public
 * @static
 * @method unobserve
 * @param {Object} $element a jQuery collection
 * @param {Object} $observer a jQuery collection
 * @return {Object} The target element (allows chaining)
 */
function unobserve( $element, $observer ){
  var $observers = $element.data( '$observers' );

  if( $observers ){
    $observers = $observers.not( $observer );
  }

  $element.data( '$observers', $observers );

  return $element;
}

/**
 * Notifies observers of events. Available through $.lu jQuery plug-in.
 * @public
 * @static
 * @method notify
 * @param {Object} $element a jQuery collection
 * @param {string} event the event type
 * @param {Array} $element extra arguments associated with the event
 * @return {Object} The target element (allows chaining)
 */
function notify( $element, event, parameters ){
  var $observers = $element.data( '$observers' );

  if( $observers ){
    _.each( $observers, function( observer, index ){
      var $observer = $( observer ),
        components = $observer.lu( 'getComponents' ),
        deferrals = [];
      _.each( components, function( component, key ){
        var deferral = component.deferral;
        deferral.then( function(){
          var instance = component.instance;
          if( _.indexOf( instance.events(), event ) > -1 ){
            instance.trigger.call( instance, new $.Event( event, { target: $element } ), parameters );
          }
        } );

      } );

    } );
  }
  return $element;
}

( function( $ ){
  //Bind utility methods to jQuery as a plug-in
  $.fn.lu = function(){
    var $this = $( this ),
      parameters = Array.prototype.slice.call( arguments ),
      method = parameters[0],
      retrn;

    parameters[0] = $this;

    switch( method ){
      case 'observe':
        retrn = observe.apply( $this, parameters );
        break;
      case 'unobserve':
        retrn = unobserve.apply( $this, parameters );
        break;
      case 'notify':
        retrn = notify.apply( $this, parameters );
        break;
      case 'getComponents':
        retrn = getComponents.apply( $this, parameters );
        break;
     case 'getComponent':
        retrn = getComponent.apply( $this, parameters );
        break;
      case 'getParents':
        retrn = getParents.apply( $this, parameters );
        break;
      case 'getDescendants':
        retrn = getDescendants.apply( $this, parameters );
        break;
      case 'getChildren':
        retrn = getChildren.apply( $this, parameters );
        break;
      default:
        throw new Error( 'No such method.' );
    }

    return retrn;
  };
}( window.jQuery ) );


//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Lu );
  } else if( module.exports ){
    module.exports = Lu;
  }
}

//Don't do Gilligan's Island if you want to be a serious actress!