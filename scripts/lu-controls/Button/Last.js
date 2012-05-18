/**
 * Representation of a button element preconfigured with a 'next' event
 * @class LastButton
 * @constructor
 * @extends Button
 * @require class
 * @version 0.1.0
 */

var Class = require( 'class' ),
  Button = require( '/scripts/lu-controls/Button' ),
  LastButton;

LastButton = Class.extend( function (Button){

  var MAXED_EVENT = 'maxed',
    SELECTED_EVENT = 'selected';

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
      * Instance of LastButton
      * @type Object
      * @private
      */
      var LastButton = this,
       /**
        * Default configuration values
        * @property defaults
        * @type Object
        * @private
        * @final
        */
        defaults = {
         action: 'last'
       };

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      Button.init.call( this, $element, settings );

      LastButton.on( SELECTED_EVENT, function( event, $subject, $item, index  ){
        event.stopPropagation();
        LastButton.enable();
      } );

      LastButton.on( MAXED_EVENT, function( event ){
        event.stopPropagation();
        LastButton.disable();
      } );

    }
 };
  
});

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( LastButton );
  } else if( module.exports ){
   module.exports = LastButton; 
  }
}
