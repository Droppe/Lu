/**
 * Representation of a button element preconfigured with a 'next' event
 * @class NextButton
 * @constructor
 * @extends Button
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 * @version 0.1
 */

var Class = require( 'class' ),
  Button = require( 'lu/Button' ),
  PreviousButton;

PreviousButton = Class.create( Button, ( function () {

  var FLOORED_EVENT = 'floored',
      SELECTED_EVENT = 'selected',
      PLAYING_EVENT = 'playing',
      PAUSED_EVENT = 'paused',
      TRANSITIONING_EVENT = 'transitioning',
      TRANSITIONED_EVENT = 'transitioned';

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
     /**
      * Instance of PreviousButton
      * @property Button
      * @type Object
      * @private
      */
      var PreviousButton = this,
       // PRIVATE INSTANCE PROPERTIES

       /**
        * Default configuration values
        * @property defaults
        * @type Object
        * @private
        * @final
        */
       defaults = {
         action: 'previous'
       },
       playing = false;

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      PreviousButton.on( SELECTED_EVENT, function( event ) {
        event.stopPropagation();
        PreviousButton.enable();
      } );

      PreviousButton.on( FLOORED_EVENT, function( event, $subject ) {
        event.stopPropagation();
        var Control = $subject.lu( 'getControl' );

        if( !Control.hasPrevious() ) {
          PreviousButton.disable();
        }

      } );

      PreviousButton.on( TRANSITIONED_EVENT, function( event, $subject ) {
        event.stopPropagation();
        PreviousButton.enable();
      } );

      PreviousButton.on( TRANSITIONING_EVENT, function( event, $subject ) {
        event.stopPropagation();
        if( playing ) {
          PreviousButton.disable();
        }
      } );

      PreviousButton.on( 'paused', function( event, $subject ) {
        event.stopPropagation();
        playing = false;
        PreviousButton.enable();
      } );

      PreviousButton.on( 'playing', function( event, $subject ) {
        event.stopPropagation();
        playing = true;
        PreviousButton.disable();
      } );

    }
  };
  
}() ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( PreviousButton );
  } else if( module.exports ) {
   module.exports = PreviousButton; 
  }
}