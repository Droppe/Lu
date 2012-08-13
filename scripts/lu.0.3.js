var Lu;

function getComponents( $element ){
  var components = 'components';
  if( $element.length > 0 ){
    return $element.data( components ) || $element.data( components, {} ).data( components );
  } else {
    throw new Error( '$element is empty.' );
  }
}

window.Lu = new function(){
  this.$mapped = $( [] );
  this.map = function( $element, component, callback ){
    var componentData = getComponents( $element );

    this.$mapped = this.$mapped.add( $element.not( this.$mapped ) );

    if( !componentData[component] ){
      componentData[component] = {
        deferral: $.Deferred(),
        instance: null,
        settings: {}
      };
      callback.call( this, $element, componentData[component] );
    } else {
      throw new Error( 'Component already exists!' );
    }

    return this;
  };
  this.execute = function( $element ){
    var $nodes = $element.find( this.$mapped ),
      deferral = $.Deferred(),
      count;

    if( $element.is( this.$mapped ) ){
      $nodes = $nodes.add( $element );
    }

    count = $nodes.length;

    function execute( $element ){
      var components = getComponents( $element );
      _.each( components, function( component, key ){
        var requirement = 'lu/' + key,
          settings = component.settings;

        require.ensure( [requirement], function( required, module, exports ){
          var Component = require( requirement );

          try {
            component.instance = new Component( $element, settings );
            component.deferral.resolve( component.instance );
          } catch( error ){
            throw new Error( error );
          }

          count -= 1;

          if( count === 0 ){
            deferral.resolve();
          }

        } );
      } );
    }

    _.each( $nodes, function( item, index ){
      execute( $( item ) );
    } );

    return deferral;
  };
}();

function getParents( $element ){
  return $element.parents( Lu.$mapped );
}

function getDescendants( $element ){
  return $element.find( Lu.$mapped );
}

function getChildren( $element ){
  return $element.children( Lu.$mapped );
}

function observe( $element, $observer ){
  var $observers = $element.data( '$observers' );

  if( !$observers ){
    return $element.data( '$observers', $observer );
  }

  $observers.add( $observer.not( $observers ) );
  $element.data( '$observers', $observers );

  return $element;
}

function unobserve( $element, $observer ){
  var $observers = $element.data( '$observers' );

  if( $observers ){
    $observers = $observers.not( $observer );
  }

  $element.data( '$observers', $observers );

  return $element;
}

function notify( $element, event, parameters ){
  var $observers = $element.data( '$observers' );

  if( $observers ){
    _.each( $observers, function( observer, index ){
      var $observer = $( observer ),
        components = getComponents( $observer ),
        deferrals = [];

      _.each( components, function( component, key ){
        var instance = component.instance,
          deferral = component.deferral;

        deferral.done( function(){
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
  $.fn.lu = function(){
    var $this = $( this ),
      parameters = Array.prototype.slice.call( arguments ),
      method = parameters[0];

    parameters[0] = $this;

    switch( method ){
      case 'observe':
        observe.apply( $this, parameters );
        break;
      case 'unobserve':
        unobserve.apply( $this, parameters );
        break;
      case 'notify':
        notify.apply( $this, parameters );
        break;
      case 'getComponents':
        getComponents.apply( $this, parameters );
        break;
      case 'getParents':
        getParents.apply( $this, parameters );
        break;
      case 'getDescendants':
        getDescendants.apply( $this, parameters );
        break;
      case 'getChildren':
        getChildren.apply( $this, parameters );
        break;
      default:
        throw new Error( 'No such method.' );
    }
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