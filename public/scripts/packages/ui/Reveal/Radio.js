var Class = require( '/scripts/libraries/ptclass' ),
  Reveal = require( 'ui/Reveal' ),
  RadioReveal;

/**
 * Toggles the display of related content to a change event from a grouping of radio buttons.
 * @class RevealSelect
 * @constructor
 * @extends Reveal
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
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
        return $( _.values(targetNodes).join(",") );
      };


    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = RadioReveal;
}