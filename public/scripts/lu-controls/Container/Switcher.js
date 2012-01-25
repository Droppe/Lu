/**
 * Representation of a stateful button element
 * @class Switcher
 * @constructor
 * @extends Container
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
var Class = require( 'class' ),
  Container = require( 'lu/Container' ),
  Switcher;

Switcher = Class.create( Container,  ( function () {

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
       * Instance of Switcher
       * @property Switcher
       * @type Object
       * @private
       */     
      var Switcher = this,

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
       * The buttons within the Switcher container
       * @property buttons
       * @type Object
       */
      $buttons =[];
     
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
      
      states = settings.states;


      // PRIVATE METHODS
      /**
       * Inits the switcher 
       * @method init
       * @private
       * @return {Void
       */
      function init () {
        $buttons = $(settings.buttonTag, $element);
        $buttons.first().attr(DISABLED, DISABLED); 
      };
      
      // PRIVILEGED METHODS
      /**
       * Sets the state of the switch 
       * @method toggleState
       * @public
       * @param {Object} $btn The button that was clicked
       * @return {Object} The Switcher instance (for chaining)
       */
      Switcher.toggleState = function ($btn) {
        _.log("Switcher.toggleState", "$element:", $element, "$btn:", $btn);
        var index, 
          state;
        
        if ( $btn.length ) {
          index = $buttons.index($btn);
          state = (states) ? states[index] : null;
          $btn.attr(DISABLED, DISABLED);
          $buttons.not($btn).removeAttr(DISABLED);
          Switcher.trigger( settings.action, [  state ] );
        }
        
        return Switcher;
      };
      

      init();
      Switcher.toggleState($buttons.first());
            
      // Listen for button events
      Switcher.on( settings.on, settings.buttonTag, function ( event ) {
        event.stopPropagation();
        Switcher.toggleState( $(event.target) );
      });

      // Responding to external events
      Switcher.on( settings.on, function ( event, item ) {
        event.preventDefault();
        item = (item > 0 ) ? item - 1 : 0;
        Switcher.toggleState($buttons.eq(item));
      });
       
    }
  };
}() ));


//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Switcher );
  } else if( module.exports ) {
   module.exports = Switcher; 
  }
}
