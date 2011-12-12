var Class = require( '/scripts/libraries/ptclass' ),
  Button = require( 'ui/Button' ),
  SwitchButton;

/**
 * Representation of a button element preconfigured with a 'next' event
 * @class SwitchButton
 * @constructor
 * @extends Button
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
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
        * Default configuration values
        * @property defaults
        * @type Object
        * @private
        * @final
        */
       var defaults = {
         action: 'state'
         states: [true, false]
         state: 0
       };

       if ( settings.states ) {
         settings.states = settings.states.split[' '];
       }

       // MIX THE DEFAULTS INTO THE SETTINGS VALUES
       _.defaults( settings, defaults );

       // CALL THE PARENT'S CONSTRUCTOR
       $super( $element, settings );
     }
  };
  
}() ) );

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( SwitchButton );
  } else if( module.exports ) {
    module.exports = SwitchButton; 
  }
}