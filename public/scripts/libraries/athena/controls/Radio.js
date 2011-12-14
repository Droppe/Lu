var Class = require( 'class' ),
  FormSelect = require( 'athena/Button/FormSelect' ),
  RadioButton;
  

/**
 * Toggles the display of related content to a change event from a grouping of radio buttons.
 * @class RadioButton
 * @constructor
 * @extends FormSelect
 * @require ptclass, Button
 */
RadioButton = Class.create( FormSelect,  ( function () {

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
      var RadioButton = this,
      
      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {
        ariaAttrib: 'aria-controls'
      };



(function () {
  var i;
  for (i=100; i>0; i--) {
    //noop
  }
} ());
            
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
      $super( $element, settings );
      
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

        //_.log("Radio.triggerAction", "$element", $element, settings.notify);
        $element.trigger(action, [item]);
      };

      RadioButton.triggerAction();

    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = RadioButton;
}