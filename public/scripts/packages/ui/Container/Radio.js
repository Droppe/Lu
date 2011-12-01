var Class = require( '/scripts/libraries/ptclass' ),
  Reveal = require( 'ui/Reveal' ),
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
      },
      /**
       * The map of nodes for the revealed contents' containers
       * @property targetNodes
       * @private
       * @type String
       */
      targetNodes;
            
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
      
      targetNodes = settings.targetNode; 

      // PRIVILEGED METHODS
      /**
       * Calculates the target node from the mapping of targets specified in the
       * configuration
       * @method getRevealTarget
       * @public
       * @return {Object} A JQuery object referencing the desired target content node
       */
      RadioReveal.getRevealTargets = function () {
        // Join the values of the config hash into a CSS selector
        return $( _.values(targetNodes).join(",") );
      };

      /**
       * Toggles the display of the selected related content by
       * adding/removing the hidden class on the contents' containing elements.
       * @method toggle
       * @public
       * @return {Void}
       */
      RadioReveal.toggle = function () {
        RadioReveal.hide();
        $(targetNodes[$('input[type="radio"]:checked', $element).val()]).removeClass(settings.className);
        
      };
      
      RadioReveal.toggle();
    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = RadioReveal;
}