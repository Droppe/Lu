/**
 * Toggles the display of related content to a change event 
 * from a checkbox or other single element.
 * @class Checkbox
 * @constructor
 * @extends Abstract
 * @version 0.0.0
 */

 var Abstract = require( '/scripts/lu-controls/Abstract' ),
   Checkbox;

Checkbox = Abstract.extend( function (Abstract) { 

  // RETURN METHODS OBJECT
  return {
    /**
     * Checkbox constructor 
     * @method init
     * @public
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */    
    init: function ( $element, settings ) {


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
      Abstract.init.call( this, $element, settings );

      // === PRIVATE METHODS ===

      /**
       * Is the Checkbox checked?
       * @method isChecked
       * @private
       * @return {Boolean} True if element is checked
       */
      function isChecked() {
        return !!( $element.prop("checked") );
      };


      // === PRIVILEDGED METHODS ===
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
      
      Checkbox.triggerAction = function () {
        var action = settings.actionUncheck,
          index = 0;
        
        if ( isChecked() ) {
         action = settings.actionCheck;
         index = 1;
        }

        checkedState = settings.states[index];

        settings.action = ( isChecked() ) ? settings.actionUncheck : action;
        
        _.log("Checkbox", action, checkedState, $element);
        Checkbox.trigger(settings.action, checkedState);
      };

      // Initially hide the extra content unless the checkbox is checked
      Checkbox.triggerAction();
      
      // === EVENT LISTENERS ===
      Checkbox.on(settings.on, function(event) {
        event.stopPropagation();
        Checkbox.triggerAction();
      });
      
 
    }
  };
});

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Checkbox );
  } else if( module.exports ) {
    module.exports = Checkbox; 
  }
}


