/**
 * Toggles the display of related content to a change event 
 * from a checkbox or other single element.
 * @class Checkbox
 * @constructor
 * @extends Abstract
 * @requires ptclass
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance 
 * @version 0.0.0
 */
var Class = require( 'class' ),
  Abstract = require( 'lu/Abstract' ),
  Checkbox;

Checkbox = Class.create( Abstract,  ( function () {

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
       * Instance of Checkbox
       * @property Checkbox
       * @type Object
       * @private
       */
      var Checkbox = this,
      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {
        on: 'change',
        action: 'select',
        actionCheck: 'select',
        actionUncheck: 'unselect',
        ariaAttrib: 'aria-controls',
        states: ['unchecked', 'checked']
      },
      /**
       * Describes the current state of the checkbox
       * @property checkedState
       * @type String
       */
      checkedState;


      // Get the notify target from the config or from the ARIA-controls attribute
      settings.notify = settings.notify || ( "#" + $element.attr(defaults.ariaAttrib) );
            
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      // PRIVATE METHODS

      /**
       * Is the Checkbox checked?
       * @method isChecked
       * @private
       * @return {Boolean} True if element is checked
       */
      function isChecked() {
        return !!( $element.prop("checked") );
      };

      Checkbox.disable = function() {
        $element
         .prop( 'disabled', true )
         .addClass( 'lu-disabled' );
      };

      Checkbox.enable = function() {
        $element
         .removeProp( 'disabled' )
         .removeClass( 'lu-disabled' );
      };
      
      // PRIVILEGED METHODS
      Checkbox.triggerAction = function () {
        var action = settings.actionUncheck,
          index = 0;
        
        if ( isChecked() ) {
         action = settings.actionCheck;
         index = 1;
        }

        checkedState = settings.states[index];

        settings.action = ( isChecked() ) ? settings.actionUnCheck : settings.action;

        
        _.log("Checkbox", action, checkedState, $element);
        Checkbox.trigger(action);
      };


      // Initially hide the extra content unless the checkbox is checked
      Checkbox.triggerAction();
      
      // EVENT LISTENERS
      Checkbox.on(settings.on, function(event) {
        event.stopPropagation();
        Checkbox.triggerAction();
      });
      
 
    }
  };  
}() ));

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Checkbox );
  } else if( module.exports ) {
    module.exports = Checkbox; 
  }
}