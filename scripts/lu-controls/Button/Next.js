var Class = require( 'class' ),
  Button = require( 'lu/Button' ),
  NextButton;

/**
 * Representation of a button element preconfigured with a 'next' event
 * @class NextButton
 * @constructor
 * @extends Button
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
NextButton = Class.create( Button, ( function () {

  var MAXED_EVENT = 'maxed',
    SELECTED_EVENT = 'selected',
    TRANSITIONING_EVENT = 'transitioning',
    TRANSITIONED_EVENT = 'transitioned',
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
       * Instance of NextButton
       * @property Button
       * @type Object
       * @private
       */
       var NextButton = this,

        /**
         * Default configuration values
         * @property defaults
         * @type Object
         * @private
         * @final
         */
         defaults = {
           action: 'next'
         },
         playing = false;

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      NextButton.on( SELECTED_EVENT, function( event ) {
        event.stopPropagation();
        if( !playing ) {
          NextButton.enable();
        }
      } );

      NextButton.on( MAXED_EVENT, function( event, $subject ) {
        event.stopPropagation();
        var Control = $subject.lu( 'getControl' );
        if( !Control.hasNext() ) {
          NextButton.disable();
        }
      } );

      NextButton.on( TRANSITIONED_EVENT, function( event, $subject ) {
        event.stopPropagation();
        NextButton.enable();
      } );

      NextButton.on( TRANSITIONING_EVENT, function( event, $subject ) {
        event.stopPropagation();
        if( playing ) {
          NextButton.disable();
        }
      } );

      NextButton.on( 'paused', function( event, $subject ) {
        event.stopPropagation();
        playing = false;
        NextButton.enable();
      } );

      NextButton.on( 'playing', function( event, $subject ) {
        event.stopPropagation();
        playing = true;
        NextButton.disable();
      } );

    }
  };
}() ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( NextButton );
  } else if( module.exports ) {
   module.exports = NextButton; 
  }
}
