var Class = require( '/scripts/libraries/ptclass' ),
  Reveal = require( 'ui/Container/Reveal' ),
  RadioReveal;

/**
 * Toggles the display of related content to a change event from a grouping of radio buttons.
 * @class RadioReveal
 * @constructor
 * @extends Reveal
 * @require ptclass, Reveal
 */
RadioReveal = Class.create( Reveal,  ( function () {

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
      var RadioReveal = this,
      
      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {
      };

      
      // Get the notify target from the config or from the ARIA-controls attribute
      //settings.notify = settings.notify || ( "#" + $element.attr("aria-controls") );
      if (!settings.notify) {
        settings.notify = "#" + $element.attr("aria-controls") ;
      }

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );
        
      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );



      // PRIVILEGED METHODS

      /**
        * Toggles the display of the related content by
        * adding/removing the hidden class on the content's containing element.
        * @method toggle
        * @public
        * @return {Void}
        */
      RadioReveal.toggle = function () {
        _.log("Radio", $element, settings.showEvent, settings.notify);
        // Fire 'selected' 
        RadioReveal.trigger(settings.showEvent);
        // Fire 'unselected'
        $('input[type="radio"][name="' + $element.attr("name") + '"]', $element.closest("form")).not($element).trigger(settings.hideEvent);
       };
    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = RadioReveal;
}