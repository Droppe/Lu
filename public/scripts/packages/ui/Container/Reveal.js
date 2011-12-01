var Class = require( '/scripts/libraries/ptclass' ),
  Container = require( 'ui/Container' ),
  Reveal;

/**
 * Toggles the display of related content to a change event 
 * from a checkbox or other single element.
 * @class Reveal
 * @constructor
 * @extends Container
 * @requires ptclass, Container
 */
Reveal = Class.create( Container,  ( function () {

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
      var Reveal = this,
      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {
        on: 'change'
      },
      /**
       * The CSS class that Reveal uses to toggle the related-content display
       * @property revealClass
       * @type String
       * @private
       */
      revealClass,
      /**
       * Don't hide the related content on page load if the element
       * is already checked or selected
       * @property dontHide
       * @type Boolean
       */
      dontHide = !!( $element.attr('checked') );
            

      // Get the notify target from the config or from the ARIA-controls attribute
      settings.notify = settings.notify || ( "#" + $element.attr("aria-controls") );
            
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      revealClass = settings.className;
      

      // PRIVILEGED METHODS


      /**
       * Toggles the display of the related content by
       * adding/removing the hidden class on the content's containing element.
       * @method toggle
       * @public
       * @return {Void}
       */
      Reveal.toggle = function () {
        if ( $element.attr('checked') ) {
          Reveal.trigger(settings.showEvent);
        }
        else {
          Reveal.trigger(settings.hideEvent);
        }
      };

      // Overwrite these for this subclass since we don't need their events to trigger
      Reveal.show = Reveal.hide = function () {};
 
      // EVENT BINDINGS
      $element.on( settings.on, function( event ){
        Reveal.toggle();
      } );

      // Initially hide the extra content unless the checkbox is checked
      if (dontHide) {
        Reveal.toggle();
      }
 
    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Reveal;
}