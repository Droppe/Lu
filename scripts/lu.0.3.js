var Lu;

function getComponents( $element ){

  var components = 'components';
  if( $element.length > 0 ){
    return $element.data( components ) || $element.data( components, {} ).data( components );
  } else {
    return {};
  }
}

window.Lu = new function(){
  var self = this;
  this.$mapped = $( [] );
  this.map = function( $element, component, callback ){
    _.each( $element, function( item, index ){
      var $element = $( item ),
        componentData = getComponents( $element ),
        settings,
        configuration,
        key;

      self.$mapped = self.$mapped.add( $element.not( self.$mapped ) );

      if( !componentData[component] ){

        componentData[component] = {
          deferral: $.Deferred(),
          settings: {}
        };

      } else {
        _.extend( componentData[component].settings, {} );
      }

      callback.call( self, $element, componentData[component] );

      key = componentData[component].key || component;

      try {
        configuration = ( function(){ return eval( '( function(){ return ' + $element.data( 'luConfig' ) + '; }() );' ); }()[key] || {} );
      } catch( error ){
        configuration = {};
      }

      componentData[component].settings = _.extend( componentData[component].settings, configuration );
    } );
  };
  this.execute = function( $element ){
    var $nodes = $element.find( this.$mapped ),
      deferral = $.Deferred(),
      requirements = [],
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

        requirements.push( requirement );

        count -= 1;

        deferral.then( function( required, module, exports ){

          var Component = require( requirement );

          try {
            console.log( 'IN', requirement );
            component.instance = new Component( $element, settings );
            console.log( 'OUT', requirement );
            component.deferral.resolve( component.instance );
          } catch( error ){
            throw new Error( 'Component could not be instantiated.' );
          }
        } );

        if( count === 0 ){
          require.ensure( requirements, function( required, module, exports ){
            deferral.resolve( required, module, exports );
          } );
        }
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