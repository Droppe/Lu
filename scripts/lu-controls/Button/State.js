var Class = require( 'class' ),
  Button = require( 'lu/Button' ),
  StateButton;

/**
 * Representation of a button element preconfigured with a 'state' event
 * @class StateButton
 * @constructor
 * @extends Button
 * @version 0.1.3
 */
StateButton = Class.create( Button, ( function (){

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
         action: 'state',
         states: ['off', 'on'],
         index: 0
       };

      //Normalize states to array
      if( settings.states ){
        if( typeof settings.states === 'string' ){
          //states can be a comma deliminated string
          states = states.split( ',' );
        } else if( _.isArray( settings.states ) ){
          //yea! it's somthing we can work with!
          states = settings.states;
        }
      }

       // MIX THE DEFAULTS INTO THE SETTINGS VALUES
       _.defaults( settings, defaults );

       // CALL THE PARENT'S CONSTRUCTOR
       $super( $element, settings );
     }
  };
  
}() ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( StateButton );
  } else if( module.exports ) {
   module.exports = StateButton; 
  }
}
