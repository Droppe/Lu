var Class = require( '/scripts/libraries/ptclass' ),
  Switch = require( 'ui/Button/Switch' ),
  MultiSwitch;

/**
 * Representation of a stateful button element
 * @class MultiSwitch
 * @constructor
 * @extends Switch
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
MultiSwitch = Class.create( Switch,  ( function () {

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
         states: [
          {
            state: "OFF",
            label: "off",
            className: "athena-switch-off"
          }, 
          {
            state: "ON",
            label: "on",
            className: "athena-switch-on"
          },
          {
            state: "ON2",
            label: "on2",
            className: "athena-switch-on2"
          }
          
         ]
       };
       
       // MIX THE DEFAULTS INTO THE SETTINGS VALUES
       _.defaults( settings, defaults );
   
       // CALL THE PARENT'S CONSTRUCTOR
       $super( $element, settings );
       
     }
  };
  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = MultiSwitch;
}
