/**
 * Representation of a button element preconfigured with a 'next' event
 * @class NextButton
 * @constructor
 * @extends Button
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
var Class = require( 'class' ),
  Button = require( 'athena/Button' ),
  NextButton;

NextButton = Class.create( Button, ( function () {

  var MAXED_EVENT = 'maxed',
    SELECTED_EVENT = 'selected';

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
        };

     // MIX THE DEFAULTS INTO THE SETTINGS VALUES
     _.defaults( settings, defaults );

     // CALL THE PARENT'S CONSTRUCTOR
     $super( $element, settings );

     NextButton.on( SELECTED_EVENT, function( event ) {
       NextButton.enable();
     } );

     NextButton.on( MAXED_EVENT, function( event, $subject ) {
       var Control = $subject.athena( 'getControl' );
       if( !Control.hasNext() ) {
         NextButton.disable();
       }
     } );

   }
  };
  
}() ) );

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( NextButton );
  } else if( module.exports ) {
   module.exports = NextButton; 
  }
}
