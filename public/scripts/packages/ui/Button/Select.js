var Class = li.require( 'libraries/ptclass' ),
  Button = li.require( 'ui/Button' ),
  SelectButton;

/**
 * Representation of a button element preconfigured with a 'next' event
 * @class SelectButton
 * @constructor
 * @extends Button
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
SelectButton = Class.create( Button,  ( function () {

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
         action: 'select'
       };
       
       // MIX THE DEFAULTS INTO THE SETTINGS VALUES
       _.defaults( settings, defaults );
   
       // CALL THE PARENT'S CONSTRUCTOR
       $super( $element, settings );
     }
  };
  
}() ));

// EXPORT TO ATHENA FRAMEWORK
Athena.exports(module, SelectButton);