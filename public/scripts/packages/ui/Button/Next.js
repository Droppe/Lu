var Class = li.require( 'libraries/ptclass' ),
  Button = li.require( 'ui/Button' ),
  NextButton;

/**
 * Representation of a button element preconfigured with a 'next' event
 * @class NextButton
 * @constructor
 * @extends Button
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
NextButton  = Class.create( Button, ( (function(){

  /**
   * Default configuration values
   * @property defaults
   * @type Object
   * @private
   * @final
   */
   var defaults = {
     action: 'next'
   },
   /**
    * Configuration values
    * @property onfig
    * @private
    * @type {Object}
    */
   config,
   /**
    * Instance of Button
    * @property Button
    * @type Object
    * @private
    */
   self;

   // Return methods object
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
       self = this;
       // Mix the defaults into the settings values
       config = _.defaults( settings, defaults );
   
       // Call the parent's constructor
       $super( $element, config );
     }
  };
  
})() ));

// Export to Athena Framework
if( typeof module !== 'undefined' && module.exports ) {
  module.exports = NextButton;
}