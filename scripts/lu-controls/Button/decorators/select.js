var constants = require( 'lu/constants' );

/**
 * Decorates the Button to listen for the 'selected' event and
 * to disable itself if the associated $item is selected.
 * Additionally, the Button will fire a 'select' event on the
 * 'on' event as specified in the configuration. This event
 * is triggered with a 'item' parameter.
 * @method select
 * @private
 */
function selectDecorator( settings ){

  return function( base ){
    var self = this,
      $items;

    controls = $element.attr( 'aria-controls' );

    if( $element.is( 'a' ) && !controls ){
      controls = _.explodeURL( $element.attr( 'href' ) ).fragment;
    }

    if( item === undefined ){
      if( controls && controls !== '' ){
        item = '#' + controls;
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

    self.on( Constants.events.SELECTED, function( event, Component ){
      var $item;

      event.stopPropagation();

      if( typeof item === 'number' ){
        $item = Component.$items.eq( item );
      } else if( typeof item === 'string' ){
        $item = Component.$items.filter( item );
      } else if( item instanceof $ ){
        $item = item;
      }

      if( Component.current ){
        if( Component.current().is( $item ) ){
          self.disable();
        } else {
          self.enable();
        }
      }
    } );

    this.on( settings.on, function( event ){
      if( self.$element.is( 'a' ) ){
        self.trigger( constants.events.SELECT, [item] );
      }
    } );
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( selectDecorator );
  } else if( module.exports ){
    module.exports = selectDecorator;
  }
}