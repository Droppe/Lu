/**
 * Toggles the display of related content to a change event from a grouping of radio buttons.
 * @class RadioButton
 * @constructor
 * @extends FormSelect
 * @requires class
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance 
 * @version 0.0.0
 */
var Class = require( 'class' ),
  FormSelect = require( 'scripts/lu-controls/FormSelect' ),
  RadioButton;

RadioButton = Class.extend( function (FormSelect) {

  // RETURN METHODS OBJECT
  return {
    /**
     * PTClass constructor 
     * @method initialize
     * @public
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */    
    init: function ( $element, settings ) {

      // PRIVATE INSTANCE PROPERTIES

      /**
       * Instance of Reveal
       * @property Reveal
       * @type Object
       * @private
       */
      var RadioButton = this,
      
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
        ariaAttrib: 'aria-controls'
      };

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );
        
      /**
       * Determines the ids of any other components to notify
       * based on the "aria-controls" attribute.
       * @method getNotifyIds
       * @private
       * @return {Array} The list of element ids.
       */      
      function getNotifyIds() {
        var ids = [];
        $( 'input[type="radio"][name="' + $element.attr("name") + '"]', $element.closest("form") ).each( function(index, item) {
          var id = $(item).attr(defaults.ariaAttrib);
          if ( id ) {
            ids.push( "#" + id );
          }
        });
        _.log( 'Radio.getNotifyIds', ids );
        return ids;
      }

      // Get the notify target(s) from the config or from the ARIA-controls attribute
      settings.notify = settings.notify || getNotifyIds().join();
       
      // CALL THE PARENT'S CONSTRUCTOR
      FormSelect.call.init( this, $element, settings );
      
      // PRIVILEDGED METHODS
      /**
       * Fires a custom event on the element bound to this instance 
       * @method triggerAction
       * @public
       * @return {Void}
       */
      RadioButton.triggerAction = function () {
        var action = settings.action,
        item = $('input:[type="radio"][name="' + $element.attr("name") + '"]:checked', $element.closest("form")).attr(settings.ariaAttrib) || "--";

        _.log("Radio.triggerAction", "$element", $element, settings.notify);
        RadioButton.trigger(settings.action, item);
      };

      RadioButton.triggerAction();

      RadioButton.on(settings.on, function (event) {
        event.stopPropagation();
        RadioButton.triggerAction();
      });
    }
  };  
});

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( RadioButton );
  } else if( module.exports ) {
    module.exports = RadioButton; 
  }
}