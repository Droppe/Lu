/**
 * Representation of a button element preconfigured with a 'play' event
 * @class PlayButton
 * @constructor
 * @extends Button
 * @version 0.1.0
 */

var Button = require( '/scripts/lu-controls/Button' ),
  PlayButton;

PlayButton = Button.extend( function (Button) {
  var PLAYING_EVENT = 'playing',
    PAUSED_EVENT = 'paused';

  // RETURN METHODS OBJECT
  return {
   /**
    * Class constructor 
    * @method init
    * @public
    * @param {Object} $element JQuery object for the element wrapped by the component
    * @param {Object} settings Configuration settings
    */
    init: function ( $element, settings ){

      // PRIVATE INSTANCE PROPERTIES
      /**
       * Instance of PlayButton
       * @property PlayButton
       * @type Object
       * @private
       */
      var PlayButton = this,
        /**
        * Default configuration values
        * @property defaults
        * @type Object
        * @private
        * @final
        */
        defaults = {
         action: 'play'
        };

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      Button.init.call( this, $element, settings );

      PlayButton.on( PLAYING_EVENT, function( event ){
        event.stopImmediatePropagation();
        PlayButton.disable();
      } );

      PlayButton.on( PAUSED_EVENT, function( event ){
        event.stopImmediatePropagation();
        PlayButton.enable();
      } );

    }

  };

});

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( PlayButton );
  } else if( module.exports ){
   module.exports = PlayButton; 
  }
}