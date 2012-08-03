var Constants = require( 'lu/Constants' );

/**
 * Decorates the Button to listen for the 'selected' event and
 * to disable itself if the associated $item is selected.
 * Additionally, the Button will fire a 'select' event on the
 * 'on' event as specified in the configuration. This event
 * is triggered with a 'item' parameter.
 * @method select
 * @private
 */
function selectDecorator() {

  function focus( $element ){
    if( $element.is( 'a' ) ){
      $element.focus();
    }
  }

  return function( base, settings ){
    console.log( 'select init' );
    var instance = this,
      $element = instance.$element,
      item = settings.item,
      on = settings.on,
      controls,
      __params__ = settings.__params__,
      $items;

    if( $element.is( Constants.HAS_A18_ATTRS ) ){
      controls = $element.attr( 'aria-controls' );
    } else if ( $element.is( 'a' ) ){
      controls = _.explodeURL( $element.attr( 'href' ) ).fragment;
    }

    if( item === undefined ){
      if( controls && controls !== '' ){
        item = '#' + controls;
      } else if( __params__.length > 0 ){
        item = __params__.shift();
      } else {
        //get Control logic needs to be rewritten to be a bit smarter (something like)
        $items = lu.getParent( $element, function( item, index ){
          var Control = lu.getControl( $( item ) ); //this assumes that there is one control that is on the item :(
          if( Control.$items ){
            return true;
          }
          return false;
        } );
      }
    }

    instance.on( Constants.events.SELECTED, function( event, Control ){
      var $item;

      event.stopPropagation();

      if( typeof item === 'number' ){
        $item = Control.$items.eq( item );
      } else if( typeof item === 'string' ){
        $item = Control.$items.filter( item );
      } else if( item instanceof $ ){
        $item = item;
      }

      console.log( $item );

      if( Control.current ){
          if( Control.current().is( $item ) ){
          instance.disable();
        } else {
          instance.enable();
        }
      }

    } );

    instance.on( on, function( event ){
      focus( $element );
      console.log( 'HELLS YEAH', item );
      instance.trigger( Constants.events.SELECT, [item] );
    } );
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( selectDecorator() );
  } else if( module.exports ){
    module.exports = selectDecorator();
  }
}