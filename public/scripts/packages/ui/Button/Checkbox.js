var Class = require( '/scripts/libraries/ptclass' ),
  Button = require( 'ui/Button' ),
  Checkbox;

/**
 * Toggles the display of related content to a change event 
 * from a checkbox or other single element.
 * @class Checkbox
 * @constructor
 * @extends Container
 * @requires ptclass, Container
 */
Checkbox = Class.create( Button,  ( function () {

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
        actionCheck: 'select',
        actionUncheck: 'unselect',
        ariaAttrib: 'aria-controls'
      };
            

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
      
      // PRIVILEDGED METHODS
      Checkbox.triggerAction = function () {
        var action = ( isChecked() ) ? settings.actionCheck : settings.actionUncheck;
        _.log("Checkbox", action, $element);
        Checkbox.trigger(action);
      };


      // Initially hide the extra content unless the checkbox is checked
      Checkbox.triggerAction();
 
    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Checkbox;
}