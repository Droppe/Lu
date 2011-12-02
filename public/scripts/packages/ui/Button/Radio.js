var Class = require( '/scripts/libraries/ptclass' ),
  Checkbox = require( 'ui/Button/Checkbox' ),
  RadioButton;
  

/**
 * Toggles the display of related content to a change event from a grouping of radio buttons.
 * @class RadioButton
 * @constructor
 * @extends Button
 * @require ptclass, Button
 */
RadioButton = Class.create( Checkbox,  ( function () {

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
        on: 'change',
        action: 'select'
      };

      
      settings.item = 3;
      
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );
        
      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      // PRIVILEDGED METHODS
      RadioButton.triggerAction = function () {
        var action = settings.action,
          // 'item' is used if the radio buttons are in a ui:List
          item = $( 'li', $element.closest( 'ul, ol' ) ).index( $element.closest( 'li' )[ 0 ] ) || '0';

        _.log("RadioButton", action, $element);
        
        // Trigger 'unselect' on all the similar radio buttons
        $( 'input:radio[name="'+ $element.attr("name") + '"]', $element.closest("form") ).each( function(index, item) {
          $(item).trigger("unselect");
        } );

        RadioButton.trigger(action, item);
      };

      // Auto trigger the default-checked radio button
      
      $( 'input:radio[name="'+ $element.attr("name") + '"]:checked', $element.closest("form") ).trigger(settings.on);

    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = RadioButton;
}