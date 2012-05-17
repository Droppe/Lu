/**
 * Representation of a button element preconfigured with a 'next' event
 * @class LoadButton
 * @constructor
 * @extends Button
 * @require class
 * @version 0.0.0
 */

var Class = require( 'class' ),
  Button = require( '/scripts/lu-controls/Button' ),
  LoadButton;


LoadButton = Class.extend( function (Button) {

   // RETURN METHODS OBJECT
   return {
     /**
      * PTClass constructor 
      * @method init
      * @public
      * @param {Object} $element JQuery object for the element wrapped by the component
      * @param {Object} settings Configuration settings
      */    
     init: function ( $element, settings ){

       // PRIVATE INSTANCE PROPERTIES

       /**
        * Default configuration values
        * @property defaults
        * @type Object
        * @private
        * @final
        */
       var defaults = {
         action: 'load'
       };
       
       // MIX THE DEFAULTS INTO THE SETTINGS VALUES
       _.defaults( settings, defaults );
   
       // CALL THE PARENT'S CONSTRUCTOR
       Button.call.init( this, $element, settings );
     }
  };
  
});

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( LoadButton );
  } else if( module.exports ){
   module.exports = LoadButton; 
  }
}