/**
 * Toggles the display of related content to some select action on a checkbox, radio button, or select dropdown.
 * @class Reveal
 * @constructor
 * @extends SelectButton
 * @requires class
 */
var SelectButton = require( '/scripts/lu-controls/Button/Select' ),
  Reveal;

Reveal = SelectButton.extend( function (SelectButton) {

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
        className: 'hidden'
      },
      /**
       * The CSS class that Reveal uses to toggle the related-content display
       * @property revealClass
       * @type String
       * @private
       */
      revealClass,
      targetNode,
      /**
       * The node for the revealed content's container
       * @property revealTarget
       * @private
       * @type Object
       */
      revealTarget,
      /**
       * The set of grouped radio buttons or select options
       * @property revealGroup
       * @type Object
       */
      revealGroup = [],
      /**
       * The number of items in the revealGroup
       * @property revealGroupLength
       * @type Int
       */
      revealGroupLength = [],      
      /**
       * Don't hide the related content on page load if the element
       * is already checked or selected
       * @property dontHide
       * @type Boolean
       */
      dontHide = ( $('input:checkbox:checked, select option:selected, input:radio:checked', $element.parent()).length > 0);
            
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      SelectButton.init.call( this, $element, settings );

      targetNode = settings.targetNode;
      _.log("TARGETNODE:", targetNode);
      
      // TBD...
      revealClass = settings.className;
      revealGroup = ( function () {
        var $parentForm = $element.closest("form");
        if (typeof targetNode === "string") {
          return $('input:radio[name="' + $element.attr("name") + '"]', $parentForm).not($element);
        }
        else {
          return $( _.values(targetNode).join(","), $parentForm ).not(targetNode[$element.val()]);
        }
      }());
        
        
      revealGroupLength = revealGroup.length;


      // PRIVILEGED METHODS

      /**
       * Calculates the target node based on whether a single
       * target or a mapping of targets is specified in the
       * configuration
       * @method getRevealTarget
       * @public
       * @return {Object} A JQuery object referencing the desired target content node
       */
      Reveal.getRevealTarget = ( function () {
        if (typeof targetNode === "string") {
          return function () {
            return $(targetNode);
          };
        }
        else {
          return function () {
            return $(targetNode[$element.val()]);
          };
        }
      }() );


      /**
       * Toggles the display of the related content by
       * adding/removing the hidden class on the component's key element.
       * @method toggle
       * @public
       * @return {Void}
       */
      Reveal.toggle = function () {
        Reveal.getRevealTarget().toggleClass(revealClass);
      };

      /**
       * Hides the related content.
       * @method hide
       * @public
       * @return {Void}
       */
      Reveal.hide = function () {
        Reveal.getRevealTarget().addClass(revealClass);
      };

      /**
       * Shows the related content.
       * @method show
       * @public
       * @return {Void}
       */
      Reveal.show = function () {
        Reveal.getRevealTarget().removeClass(revealClass);
      };
 
      // EVENT BINDINGS
      $element.on( settings.on, function( event ){
        Reveal.toggle();
        // For radio buttons
        if (revealGroupLength) {
          // TODO: Do this, or add the items in revealGroup to the observers list for custom eventing?          
          revealGroup.each(function(count, obj) {
            $(obj).data("controls")["lu/Reveal"].hide();
          });
        }
      } );

      // Initially hide the extra content unless the radio/checkbox/selection is active
      if (dontHide) {
        Reveal.toggle();
      }
 
    }
  };  
} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Reveal );
  } else if( module.exports ) {
   module.exports = Reveal; 
  }
}
