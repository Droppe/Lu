var Class = require( '/scripts/libraries/ptclass' ),
  Container = require( 'ui/Container' ),
  Switch;

/**
 * Representation of a stateful button element
 * @class Switch
 * @constructor
 * @extends Container
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
Switch = Class.create( Container,  ( function () {

  var DISABLED = "disabled";

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
       * Instance of Switch
       * @property Switch
       * @type Object
       * @private
       */     
      var Switch = this,

      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {
        buttonTag: "button",
        on: "click select change",
        action: "switch"
      },
      /**
       * An array of objects representing available states f
       * or the switch instance, passed on through the published event.
       * @property states
       * @type Array
       */
      states = [],
      /**
       * The buttons within the Switch container
       * @property buttons
       * @type Object
       */
      $buttons =[];
     
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
      
      states = settings.states;

      /**
       * Sets the state of the switch 
       * @method toggleState
       * @public
       * @param {Object} $btn The button that was clicked
       * @return {Object} The Switch instance (for chaining)
       */
      Switch.toggleState = function ($btn) {
        var index, state;
        
        if ( $btn.length ) {
          index = $buttons.index($btn);
          state = (states) ? states[index] : null;
          _.log("Switch.toggleState", $btn, state);
          $btn.attr(DISABLED, DISABLED);
          $buttons.not($btn).removeAttr(DISABLED);
          Switch.trigger( settings.action, [  state ] );
        }
        
        return Switch;
      };
      
      Switch.init = function () {
        $buttons = $(settings.buttonTag, $element);
        $buttons.first().attr(DISABLED, DISABLED); 
      };

      Switch.init();
      Switch.toggleState($buttons.first());
            
      // Listen for button events
      $element.on( settings.on, settings.buttonTag, function ( event ) {
        event.stopPropagation();
        Switch.toggleState( $(event.target) );
      });

      // Responding to external events
      $element.on( settings.on, function ( event, item ) {
        event.preventDefault();
        item = (item > 0 ) ? item - 1 : 0;
        Switch.toggleState($buttons.eq(item));
      });
       
    }
  };
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Switch;
}
