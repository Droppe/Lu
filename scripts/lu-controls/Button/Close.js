
var Class = require( 'class' ),
  Button = require( 'lu/Button' ),
  CloseButton;

/**
 * Representation of a button element preconfigured with a 'next' event
 * @class CloseButton
 * @constructor
 * @extends Button
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 * @version 0.1
 */
CloseButton = Class.create( Button,  ( function () {

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
         action: 'close'
       };
       
       // MIX THE DEFAULTS INTO THE SETTINGS VALUES
       _.defaults( settings, defaults );
   
       // CALL THE PARENT'S CONSTRUCTOR
       $super( $element, settings );
     }
  };
  
}() ));

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( CloseButton );
  } else if( module.exports ) {
   module.exports = CloseButton; 
  }
}
