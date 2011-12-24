/**
 * Representation of a button element preconfigured with a 'next' event
 * @class NextButton
 * @constructor
 * @extends Button
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
var Class = require( 'class' ),
  Button = require( 'athena/Button' ),
  PreviousButton;

PreviousButton = Class.create( Button, ( function () {

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
     /**
      * Instance of PreviousButton
      * @property Button
      * @type Object
      * @private
      */
      var PreviousButton = this,
       // PRIVATE INSTANCE PROPERTIES

       /**
        * Default configuration values
        * @property defaults
        * @type Object
        * @private
        * @final
        */
       defaults = {
         action: 'previous'
       };

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      PreviousButton.on( FLOORED_EVENT, function( event, $subject ) {
        _.log("PreviousButton.on", $element, event, $subject);

        var Control = $subject.athena( 'getControl' );

        if( !Control.hasPrevious() ) {
          PreviousButton.disable();
        }

      } );


    }
  };
  
}() ) );

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( PreviousButton );
  } else if( module.exports ) {
   module.exports = PreviousButton; 
  }
}