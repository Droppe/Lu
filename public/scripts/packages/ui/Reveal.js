var Class = require( '/scripts/libraries/ptclass' ),
  Abstract = require( 'ui/Abstract' ),
  Reveal;

/**
 * Toggles the display of related content to a change event 
 * from a checkbox or other single element.
 * @class Reveal
 * @constructor
 * @extends Abstract
 * @requires ptclass, Abstract
 */
Reveal = Class.create( Abstract,  ( function () {

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
        on: 'change',
        className: 'hidden',
        hideEvent: "unselected",
        showEvent: "selected"        
      },
      /**
       * The CSS class that Reveal uses to toggle the related-content display
       * @property revealClass
       * @type String
       * @private
       */
      revealClass,
      /**
       * The CSS selector for the node(s) for the content to be revealed
       * @property targetNodes
       * @private
       * @type String
       */
      targetNodesSelector,
      /**
       * Don't hide the related content on page load if the element
       * is already checked or selected
       * @property dontHide
       * @type Boolean
       */
      dontHide = ( $('input:checked', $element.parent()).length > 0);
            
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      targetNodesSelector = settings.targetNode;
      revealClass = settings.className;

      // PRIVILEGED METHODS

      /**
       * Calculates the target node based on whether a single
       * target or a mapping of targets is specified in the
       * configuration
       * @method getRevealTargets
       * @public
       * @return {Object} A JQuery object referencing the desired target content node
       */
      Reveal.getRevealTargets = function () {
        return $(targetNodesSelector);
      };

      /**
       * Toggles the display of the related content by
       * adding/removing the hidden class on the content's containing element.
       * @method toggle
       * @public
       * @return {Void}
       */
      Reveal.toggle = function () {        
        Reveal.getRevealTargets().toggleClass(revealClass);
        Reveal.trigger(settings.showEvent);
      };

      /**
       * Hides the related content.
       * @method hide
       * @public
       * @return {Void}
       */
      Reveal.hide = function () {
        Reveal.getRevealTargets().addClass(revealClass);
        Reveal.trigger(settings.hideEvent);
      };

      /**
       * Shows the related content.
       * @method show
       * @public
       * @return {Void}
       */
      Reveal.show = function () {
        Reveal.getRevealTargets().removeClass(revealClass);
        Reveal.trigger(settings.showEvent);
      };
 
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