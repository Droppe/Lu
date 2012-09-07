var constants = require( 'lu/constants' );

/**
 * Decorates the Button to listen for the 'stated' event and
 * to disable itself if the control is paused. This is used in
 * conjunction with the default decorator.
 * @method pause
 * @private
 */
function pauseDecorator( settings ) {
  return function( base ){
    var self = this;

    this.on( constants.events.STATED, function( event, Component ){
      event.stopPropagation();
      if( Component.hasState( constants.states.PAUSED ) ){
        self.disable();
      }
      if( Component.hasState( constants.states.PLAYING ) ){
        self.enable();
      }
    } );
  };

}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( pauseDecorator );
  } else if( module.exports ){
    module.exports = pauseDecorator;
  }
}