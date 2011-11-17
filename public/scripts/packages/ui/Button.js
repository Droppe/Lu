var Class = li.require( 'libraries/ptclass' ),
  Abstract = li.require( 'ui/Abstract' ),
  Button;

/**
 * Representation of a button element
 * @class Button
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 * @requires ptclass, Abstract
 */ 
Button = Class.create( Abstract, ( (function(){

  // Private attributes

  /**
   * Default configuration values
   * @property defaults
   * @type Object
   * @private
   * @final
   */
   var defaults = {
     on: 'click'
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
   self,
   /**
    * Custom event name
    * @property action
    * @type Object
    * @private
    */
   action,
   /**
    * Target item used in event data
    * @property action
    * @type Object
    * @private
    */
   item;
   

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

       // Try to figure out what to select...
       if( action === 'select' ) {
         if( config.item ) {
           item = ( typeof config.item === 'number' ) ? config.item : $( config.item );
         } else {
           item = $( 'li', $element.closest( 'ul, ol' ) ).index( $element.closest( 'li' )[ 0 ] );
         }
       }

       action = settings.action;

       // Call the parent's constructor
       $super( $element, config );
       
       // Event bindings
       $element.on( config.on, function ( event ) {
         if( item ) {
           self.trigger( action, [ item ] );
           _.log("Button " + action);
         } else {
           self.trigger( action );
           _.log("Button " + action);
         }
       } );       
       
     }
   };

})() ));

// Export to Athena Framework
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Button;
}

