var Class = require( 'class' ),
  Abstract = require( 'lu/Abstract' ),
  Button;

/**
 * Representation of a button element
 * @class Button
 * @constructor
 * @extends Abstract
 * @requires ptclass, Abstract
 * @version 0.1
 */ 
Button = Class.create( Abstract, ( function() {

  // CONSTANTS
  var CLICK = 'click',
    DISABLED = 'disabled',
    LU_DISABLED = 'lu-disabled',
    ARIA_ROLE = 'role',
    BUTTON_INPUT = 'button, input';

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
          on: CLICK
        },

        /**
         * Item used as a parameter for selected events
         * @property item
         * @type String | Number
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
          * Flag to denote whether the button component is a button or anchor element
          * @property isAnchor 
          * @type Boolean 
          * @private
          */
        isAnchor = $element.is( 'a' );


      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      item = settings.item;
      states = settings.states;

      if( states && !settings.index ) {
        settings.index = 0;
      }

      index = settings.index;

      action = settings.action;


      // PRIVATE METHODS

      /**
       * Setups accessibility for the button.  If the button is a "link" then it will have an ARIA role of button and 
       * will be selectable by the space bar.  
       * @method setupAlly 
       * @private
       * @return {Void}
       */
      function setupAlly() {
        
        if ( isAnchor ) {
          // If "role" exists, do nothing... 
          if ( !$element.attr( ARIA_ROLE ) ) {
            $element.attr( ARIA_ROLE, 'button' );
          }

          $element.on( 'keyup', function( event ) { 
            // Pressed space bar
            if ( event.keyCode === 32 ) {   
              Button.trigger( settings.on );
            } 
          } );
        }  
      }

      /**
       * Disables the Button by adding a disabled attribute (inputs and buttons only) and the class lu-disabled
       * @method disable 
       * @private
       * @return {Void}
       */
      Button.disable = function() {
        if( $element.is( BUTTON_INPUT ) ) {
          $element.prop( DISABLED, true );
        }
        $element.addClass( LU_DISABLED );
      };

      /**
       * Enables the Button by removing a disabled attribute (inputs and buttons only) and the class lu-disabled
       * @method disable 
       * @private
       * @return {Void}
       */
      Button.enable = function() {
        if( $element.is( BUTTON_INPUT ) ) {
          $element.removeProp( DISABLED );
        }
        $element.removeClass( LU_DISABLED );
      };

      // EVENT BINDINGS
      Button.on( settings.on, function( event ) {
        event.preventDefault();

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
        if( action !== undefined ) {
          Button.trigger( action, parameters ); 
        }
      } );

      // Setup accessibility - ally 
      setupAlly();
      Button.enable();

    }
  };

}() ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Button );
  } else if( module.exports ) {
    module.exports = Button; 
  }
}