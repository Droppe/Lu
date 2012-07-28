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
        $items = lu.getParent( $element ).$items;
        if( $items ){
          item = $element.closest( $items );
        }
      }
    }

    instance.on( Constants.events.SELECTED, function( event, List ){
      var $item;
      event.stopPropagation();

      if( typeof item === 'number' ){
        $item = List.$items.eq( item );
      } else if( typeof item === 'string' ){
        $item = List.$items.filter( item );
      } else if( item instanceof $ ){
        $item = item;
      }

      if( List.current().is( $item ) ){
        instance.disable();
      } else {
        instance.enable();
      }
    } );

    instance.on( on, function( event ){
      focus( $element );
      instance.trigger( 'select', [item] );
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