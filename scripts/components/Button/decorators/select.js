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
    var self = this;

    this.on( constants.events.SELECTED, function( event, Component ){
      event.stopPropagation();
      if( Component.$items && Component.current ){
        if( self.$element.closest( Component.$items ).is( Component.current().$element ) ){
          self.disable();
        } else if( self.$element.is( 'button' ) ) {
          if( $( '#' + self.$element.attr( 'aria-controls' ) ).is( Component.current().$element ) ){
            self.disable();
          } else {
            self.enable();
          }
        } else if( self.$element.is( 'a' ) ) {
          if( $( self.$element.attr( 'href' ) ).is( Component.current().$element ) ){
            self.disable();
          } else {
            self.enable();
          }
        }
      } else {
        self.enable();
      }
    } );


    this.$element.on( settings.on, function( event ){
      if( self.$element.is( 'a' ) ){
        self.$element.focus();
      }
      self.trigger( constants.events.SELECT, [self] );
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