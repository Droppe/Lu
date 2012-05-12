/**
 * Representation of a button element preconfigured with a 'next' event, also allows repeating events
 * @class NextRepeat
 * @constructor
 * @extends ButtonNext
 * @require ptclass
 * @version 0.0.0
 */

var Class = require( 'class' ),
  NextButton = require( 'lu/Button/Next' ),
  NextRepeatButton;

NextRepeatButton = Class.create( NextButton, ( function () {

  var REPEAT_INTERVAL = 1000,
     PREVIOUS_EVENT = "previous",
     NEXT_EVENT = "next",
     MAXED_EVENT = 'maxed';
     
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
      * Instance of NextRepeatButton
      * @property Button
      * @type Object
      * @private
      */
      var NextRepeatButton = this,

       /**
        * Default configuration values
        * @property defaults
        * @type Object
        * @private
        * @final
        */
        defaults = {
          repeatInterval: REPEAT_INTERVAL,
          onPrevious: PREVIOUS_EVENT,
          onNext: NEXT_EVENT,
          action: 'selected'
        },
        /**
         * Repeat timer
         * @property timer
         * @type object
         * @private
         */
        timer,
        item;

     // MIX THE DEFAULTS INTO THE SETTINGS VALUES
     _.defaults( settings, defaults );

     // CALL THE PARENT'S CONSTRUCTOR
     $super( $element, settings );

     item = settings.item || null;

     NextRepeatButton.on( "click", function( event ) {
       event.stopPropagation();
       if (!timer) {
         timer = window.setInterval( function() {
           NextRepeatButton.trigger(settings.action, [item]);
         }, settings.repeatInterval);         
       }
     } );

     NextRepeatButton.on( settings.onPrevious, function( event ) {
       event.stopPropagation();
       if (timer) {
         _.log("NextRepeat", "clearing timer", timer);
         window.clearInterval(timer);
         timer = null;
       }
     } );

   }
  };
  
}() ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( NextRepeatButton );
  } else if( module.exports ) {
   module.exports = NextRepeatButton; 
  }
}
