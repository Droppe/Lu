var Class = require( '/scripts/libraries/ptclass' ),
  RadioReveal = require( 'ui/Reveal/Radio' ),
  SelectReveal;

/**
 * Toggles the display of related content to a change event from a grouping of select options.
 * @class SelectReveal
 * @constructor
 * @extends Reveal
 * @requires ptclass, Reveal:Radio
 */
SelectReveal = Class.create( RadioReveal,  ( function () {

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
      var SelectReveal = this,
      
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

      /**
       * Toggles the display of the selected related content by
       * adding/removing the hidden class on the contents' containing elements.
       * @method toggle
       * @public
       * @return {Void}
       */
      SelectReveal.toggle = function () {
        SelectReveal.hide();
        $(targetNodes[$element.val()]).removeClass(settings.className);
        
      };
      
      SelectReveal.toggle();
    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = SelectReveal;
}