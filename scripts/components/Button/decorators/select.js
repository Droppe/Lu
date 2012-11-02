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
      isAnchor = self.$element.is( 'a' ),
      isButton = self.$element.is( 'button' ),
      $controls;

    if( isAnchor ){
      $controls = $( self.$element.attr( 'href' ) );
    } else if( isButton ){
      $controls = $( '#' + self.$element.attr( 'aria-controls' ) );
    }

    this.on( constants.events.SELECTED, function( event, Component ){
      event.stopPropagation();
      if( Component.$items && Component.current ){
        if( $controls.is( Component.$items ) ){
          if( $controls.is( Component.current().$element ) ){
            self.disable();
          } else {
            self.enable();
          }
        } else {
          if( self.$element.closest( Component.$items ).is( Component.current().$element ) ){
            self.disable();
          } else {
            self.enable();
          }
        }
      } else {
        self.enable();
      }

    } );

    this.$element.on( settings.on, _.throttle( function( event ){
      if( settings.preventDefault ){
        event.preventDefault();
      }
      if( self.$element.is( 'a' ) ){
        self.$element.focus();
      }
      self.trigger( constants.events.SELECT, [self] );
    }, settings.throttle ) );
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