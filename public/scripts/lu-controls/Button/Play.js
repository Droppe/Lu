/**
 * Representation of a button element preconfigured with a 'play' event
 * @class NextButton
 * @constructor
 * @extends Button
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
var Class = require( 'class' ),
  Button = require( 'lu/Button' ),
  PlayButton;

PlayButton = Class.create( Button, ( function () {
  var PLAYING_EVENT = 'playing',
    PAUSED_EVENT = 'paused';

  // RETURN METHODS OBJECT
  return {
   /**
    * PTClass constructor 
    * @method initialize
    * @public
    * @param {Object} $super Pointer to superclass constructor
    * @param {Object} $element JQuery object for the element wrapped by the component
    * @param {Object} settings Configuration settings
    */
    initialize: function ( $super, $element, settings ) {

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
      $super( $element, settings );

      PlayButton.on( PLAYING_EVENT, function( event ) {
        event.stopImmediatePropagation();
        PlayButton.disable();
      } );

      PlayButton.on( PAUSED_EVENT, function( event ) {
        event.stopImmediatePropagation();
        PlayButton.enable();
      } );

    }

  };

}() ) );

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( PlayButton );
  } else if( module.exports ) {
   module.exports = PlayButton; 
  }
}