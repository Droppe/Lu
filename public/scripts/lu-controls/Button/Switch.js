/**
 * Representation of a button element preconfigured with a 'switch' event
 * @class SwitchButton
 * @constructor
 * @extends Button
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance 
 */
var Class = require( 'class' ),
  Button = require( 'lu/Button' ),
  SwitchButton;

SwitchButton = Class.create( Button, ( function () {

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
       * Instance of Button
       * @property Button
       * @type Object
       * @private
      */
      var SwitchButton = this,
        /**
        * Default configuration values
        * @property defaults
        * @type Object
        * @private
        * @final
        */
        defaults = {
          action: 'switch'
        },
        states;

        if( typeof settings.states === 'string' ) {
          settings.states = settings.states.split( ' ' );
        }

        states = settings.states;

        // MIX THE DEFAULTS INTO THE SETTINGS VALUES
        _.defaults( settings, defaults );

        // CALL THE PARENT'S CONSTRUCTOR
        $super( $element, settings );

        SwitchButton.on( 'switched', function( event, $subject, state, meta ) {
          event.stopPropagation();
          if( states ) {
           if( states.length === 1 && _.indexOf( states, state ) !== -1 ) {
             SwitchButton.disable();
           } else {
             SwitchButton.enable();
           }
          }
        } );

     }
  };

}() ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( SwitchButton );
  } else if( module.exports ) {
    module.exports = SwitchButton; 
  }
}