var Constants = require( 'lu/Constants' ),
  Class = require( 'class' ),
  DefaultDecorator = require( 'lu/Button/Default' );

/**
 * Decorates the Button to listen for the 'stated' event and
 * to disable itself if the control is playing. This is used in
 * conjunction with the default decorator.
 * @method play
 * @private
 */
function playDecorator() {

  return function( base, settings ){
    var instance = this,
      playing = true;

    Class.decorate( instance, DefaultDecorator, settings );

    instance.on( Constants.events.STATED, function( event, $subject, states ){
      event.stopPropagation();
      if( _.indexOf( states, Constants.states.PAUSED ) > -1 ){
        instance.enable();
        playing = false;
      }
      if( _.indexOf( states, Constants.states.PLAYING ) > -1 ){
        instance.disable();
        playing = true;
      }
    } );
  };

}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( playDecorator() );
  } else if( module.exports ){
    module.exports = playDecorator();
  }
}