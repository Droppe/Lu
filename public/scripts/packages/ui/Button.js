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
Button = Class.create( Abstract, ( function() {

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
    initialize: function( $super, $element, settings ) {
      // PRIVATE

      // PRIVATE INSTANCE PROPERTIES
      /**
       * Instance of Button
       * @property Button
       * @type Object
       * @private
       */
      var Button = this,

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
         * Item used as a parameter for selected events
         * @property item
         * @type  String | Number
         * @private
         */
        item,

        /**
         * 
         * @property index
         * @type Number
         * @private
         */
        index,

        /**
         * 
         * @property states
         * @type Array
         * @private
         */
        states,

         /**
          * Custom event name
          * @property action
          * @type Object
          * @private
          */
        action,

         /**
          * Flag to denote whether the button component is a <button> or <a>
          * @property isAnchor 
          * @type Boolean 
          * @private
          */
        isAnchor = $element.is( 'a' );


      item = settings.item;
      states = settings.states;

      if( states && !settings.index ) {
        settings.index = 0;
      }
      index = settings.index;

      action = settings.action;

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      // PRIVATE METHODS

      /**
       * Setups accessibility for the button.  If the button is a "link" then it will have an ARIA role of button and 
       * will be selectable by the space bar.  
       * @method setupAlly 
       * @private
       * @return {Void}
       */
      function setupAlly() {
        var ARIA_ROLE = "role";
        if ( isAnchor ) {
          // If "role" exists, do nothing... 
          if ( !$element.attr( ARIA_ROLE ) ) {
            $element.attr( ARIA_ROLE, 'button' );
          }

          $element.on( 'keyup', function( event ) { 
            // Pressed space bar
            if ( event.keyCode === 32 ) {   
              $element.trigger( settings.on );
            } 
          } );
        }  
      }

      Button.triggerAction = function () {
        var parameters = [];
      
        // For accessibility we focus on the link.
        if ( isAnchor ) {
          $element.focus();  
        }

        switch( action ) {
          case 'select':
            if( item || item === 0 ) {
              parameters.push( item );
            }
            break;
          case 'switch':
            if( states && index !== undefined ) {
              if ( index < states.length - 1 ) {
                index += 1;
              } else {
                index = 0;
              }
              parameters.push( states[index] );
            }
            break;
          default:
        }

        Button.trigger( action, parameters ); 
      };

      // EVENT BINDINGS
      $element.on( settings.on, function( event ) {
        event.preventDefault();
        
        // For accessibility we focus on the link.
        if ( isAnchor ) {
          $element.focus();  
        }

        Button.triggerAction();

      } );

      // Setup accessibility - ally 
      setupAlly();

    }
  };

}() ) );

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Button );
  } else if( module.exports ) {
    module.exports = Button; 
  }
}