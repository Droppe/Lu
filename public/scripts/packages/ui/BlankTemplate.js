var Class = li.require( 'libraries/ptclass' ),
  Abstract = li.require( 'ui/Abstract' ),
  BlankTemplate;

/**
 * Representation of a BlankTemplate
 * @class BlankTemplate
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 * @requires ptclass, Abstract
 */ 
BlankTemplate = Class.create( Abstract, ( (function(){

  // Private attributes

  /**
   * Default configuration values
   * @property defaults
   * @type Object
   * @private
   * @final
   */
   var defaults = {
     
     // Default values go here
     
   },
   /**
    * Configuration values
    * @property config
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
     initialize: function ( $super, $element, settings ) {
       self = this;

       // Mix the defaults into the settings values
       config = _.defaults( settings, defaults );

       // Put your constructor's setup code here

       // Call the parent's constructor
       $super( $element, config );
       
       // Event bindings
       $element.on( config.on, function ( event ) {
        // Your code here
       } );       
       
     },
     anotherMethod: function ( $super, $element, settings ) {
       // Your code here
     }
   };

})() ));

// Export to Athena Framework
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = BlankTemplate;
}

