var Class = require( '/scripts/libraries/ptclass' ),
  Button = require( 'ui/Button' ),
  FormSelect;
  

/**
 * Toggles the display of related content to a change event from a grouping of radio buttons.
 * @class RadioButton
 * @constructor
 * @extends Button
 * @require ptclass, Button
 */
FormSelect = Class.create( Button,  ( function () {

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
       * Instance of Reveal
       * @property Reveal
       * @type Object
       * @private
       */
      var FormSelect = this,
      
      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {
        on: 'change',
        action: 'select'
      };

      
      function getNotifyIds() {
        var ids = [];
        $("option", $element).each( function(index, item) {
          var id = $(item).attr("aria-controls");
          if (id) {
            ids.push( "#" +  id);
          }
        });
        return ids;
      }

      // Get the notify target(s) from the config or from the ARIA-controls attribute
      settings.notify = settings.notify || getNotifyIds().join();
      
      _.log("settings.notify:", settings.notify);
      
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );
        
      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      // PRIVILEDGED METHODS
      FormSelect.triggerAction = function () {
        var action = settings.action,
          item;
        
        // Find the selected option's content ID
        item = $("option:selected", $element).attr("aria-controls");

        _.log("FormSelect.triggerAction", action, $element, "item:", item);
        
        $element.trigger(action, [item]);
      };

    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = FormSelect;
}