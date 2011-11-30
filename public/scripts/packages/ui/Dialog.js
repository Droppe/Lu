var Class = require( '/scripts/libraries/ptclass' ),
  Abstract = require( 'ui/Abstract' ),
  Dialog;

/**
 * Representation of a Dialog
 * @class Dialog
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
Dialog = Class.create( Abstract,  ( function () {

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
         autoOpen: false,
         resizable: false
       };
       
       // MIX THE DEFAULTS INTO THE SETTINGS VALUES
       _.defaults( settings, defaults );

       // CALL THE PARENT'S CONSTRUCTOR
       $super( $element, settings );

     	 $element.dialog(settings);
     	 $element.on('open', function() {
     	   $(this).dialog('open');
       });
    	 $element.on('close', function() {
         $(this).dialog('close');
       });
     }
  };
  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Dialog;
}