
var Class = require( 'class' ),
  Button = require( 'lu/Button' ),
  FirstButton;

/**
 * Representation of a button element preconfigured with a 'next' event
 * @class FirstButton
 * @constructor
 * @extends Button
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 * @version 0.1
 */
FirstButton = Class.create( Button,  ( function () {

  var FLOORED_EVENT = 'floored',
    SELECTED_EVENT = 'selected';

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
      * Instance of LastButton
      * @type Object
      * @private
      */
      var FirstButton = this,
        /**
         * Default configuration values
         * @property defaults
         * @type Object
         * @private
         * @final
         */
        defaults = {
          action: 'first'
        },
        $item;

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      FirstButton.on( SELECTED_EVENT, function( event, $subject, $item, index  ) {
        event.stopPropagation();
        FirstButton.enable();
      } );

      FirstButton.on( FLOORED_EVENT, function( event ) {
       event.stopPropagation();
       FirstButton.disable();
      } );

   }
  };
  
}() ));

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( FirstButton );
  } else if( module.exports ) {
   module.exports = FirstButton; 
  }
}
