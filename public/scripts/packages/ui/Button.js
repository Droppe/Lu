var Class = require( '/scripts/libraries/ptclass' ),
  Abstract = require( 'ui/Abstract' ),
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
Button = Class.create( Abstract, ( function () {

  // GLOBAL STATICS

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
      // PRIVATE
      // Constants
      var ARIA_ROLE = "role",

      // PRIVATE INSTANCE PROPERTIES
      /**
       * Instance of Button
       * @property Button
       * @type Object
       * @private
       */
      Button = this,
      /**
       * Default configuration values for all instances
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {
        on: 'click'
      },
      /**
       * Target item used in event data
       * @property action
       * @type Object
       * @private
       */
      item,

       /**
        * Custom event name
        * @property action
        * @type Object
        * @private
        */
      action,

       /**
        * Flag to denote whether the button component is a <button> or <a>
        * @property isLink 
        * @type Boolean 
        * @private
        */
      isLink = false;
    
       
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      action = settings.action;

      // Try to figure out what to select...
      if( action === 'select' ) {
        if( settings.item ) {
          item = ( typeof settings.item === 'number' ) ? settings.item : $( settings.item );
        } else {
          item = $( 'li', $element.closest( 'ul, ol' ) ).index( $element.closest( 'li' )[ 0 ] ) || '0';
        }
      }

      // PRIVATE METHODS

      /**
       * Setups accessibility for the button.  If the button is a "link" then it will have an ARIA role of button and 
       * will be selectable by the space bar.  
       * @method setupAlly 
       * @private
       * @return {Void}
       */
      function setupAlly() {
        // If it's a link give it ARIA role button
        isLink = $element.is("a"); 
        if (isLink) {

          // If "role" exists, do nothing... 
          if (!$element.attr(ARIA_ROLE)) {
            $element.attr(ARIA_ROLE, "button");
          }

          $element.on("keyup", function(e) { 
              // Pressed space bar
              if (e.keyCode === 32) {   
                Button.triggerAction(action, item);
              } 
          });
        }  
      }
      
      // PRIVILEDGED METHODS
      
      /**
       * Fires an event with the action and associated object/number
       * @method triggerAction
       * @param {String} action - ex. "select", "next", "prev"
       * @param {Object|Number} item - Normally an object but can be a number
       * @private
       * @return {Void}
       */
      Button.triggerAction = function (action, item) {
        _.log("Button", action, $element);

        if( item || item === 0 ) {
          Button.trigger( action, [ item ] );
        } else {
          Button.trigger( action );
        }
      };

      // EVENT BINDINGS
      $element.on( settings.on, function ( event ) {

        event.preventDefault();
        // Oh, overloading the item!  The item can be a number or an Object
        // When it's a number - like index 0 - it's falsy unless we test it!
        Button.triggerAction(action, item);

        // For accessibility.  When a link behaves as a button, we prevent the default behavior - i.e. link out -
        // and set focus on the link.
        if (isLink) {
          $element.focus();
        }
      } );
      
      
      // Setup accessibility - ally 
      setupAlly();
      
    }
  };

}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Button;
}
