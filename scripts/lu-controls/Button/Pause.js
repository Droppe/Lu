/**
 * Representation of a button element preconfigured with a 'pause' event
 * @class PauseButton
 * @constructor
 * @extends Button
 * @requires ptclass
 * @version 0.1.0
 */

var Class = require( 'class' ),
  Button = require( 'lu/Button' ),
  PauseButton;

PauseButton = Class.create( Button, ( function (){

  var PLAYING_EVENT = 'playing',
    PAUSED_EVENT = 'paused',
    TRANSITIONING_EVENT = 'transitioning',
    TRANSITIONED_EVENT = 'transitioned';

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
     initialize: function ( $super, $element, settings ){

       // PRIVATE INSTANCE PROPERTIES
       /**
        * Instance of PlayButton
        * @property PlayButton
        * @type Object
        * @private
        */
       var PauseButton = this,
         /**
          * Default configuration values
          * @property defaults
          * @type Object
          * @private
          * @final
          */
         defaults = {
           action: 'pause'
         },
         paused = false;
       
       // MIX THE DEFAULTS INTO THE SETTINGS VALUES
       _.defaults( settings, defaults );
   
       // CALL THE PARENT'S CONSTRUCTOR
       $super( $element, settings );

       PauseButton.on( PLAYING_EVENT, function( event ){
         event.stopPropagation();
         PauseButton.enable();
         paused = false;
       } );

       PauseButton.on( PAUSED_EVENT, function( event ){
         event.stopPropagation();
         PauseButton.disable();
         paused = true;
         
       } );
       PauseButton.on( TRANSITIONED_EVENT, function( event, $subject ){
         event.stopPropagation();
         if( !paused ){
           PauseButton.enable();
         }
       } );
       PauseButton.on( TRANSITIONING_EVENT, function( event, $subject ){
         event.stopPropagation();
         PauseButton.disable();
       } );

     }
  };
  
}() ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( PauseButton );
  } else if( module.exports ){
   module.exports = PauseButton; 
  }
}