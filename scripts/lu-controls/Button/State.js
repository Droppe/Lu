/**
 * Representation of a button element preconfigured with a 'state' event
 * @class StateButton
 * @constructor
 * @extends Button
 * @requires class
 * @version 0.1.3
 */

var Class = require( 'class' ),
  Button = require( '/scripts/lu-controls/Button' ),
  StateButton;

StateButton = Class.extend( function (Button) {

   // RETURN METHODS OBJECT
   return {
     /**
      * Class constructor
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
         action: 'state',
         states: ['off', 'on'],
         index: 0
       },
       states;

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
       Button.init.call( this, $element, settings );
     }
  };

});

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( StateButton );
  } else if( module.exports ){
   module.exports = StateButton;
  }
}
