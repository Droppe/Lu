/**
* Contains content and maintains state
* @class Container
* @constructor
* @extends Container
* @version 0.2.4
*/

//The Full path is given do to an error in inject :(
var Container = require( 'lu/Container' ),
  Sticky;

Sticky = Container.extend( function ( Container ) {
  var STUCK_EVENT = 'stuck',
    /**
     * Default configuration values
     * @property defaults
     * @type Object
     * @private
     * @final
     */
     defaults = {};

  return {
    /**
     * Constructor
     * @method init
     * @public
     * @param {Object} $element JQuery object for the element wrapped by
     * the component
     * @param {Object} settings Configuration settings
     */
    init: function( $element, settings ){
      /**
       * Instance of Sticky
       * @property Sticky
       * @type Object
       * @private
       */
      var Sticky = this,
      /**
       * JQuery collection referencing the window object
       * @property $window
       * @type Object
       * @private
       */
      $window = $(window),
      /**
       * Original offset coordinates of the sticky DOM node
       * @property offset
       * @type Object
       * @private
       */
      offset,
      /**
       * Jquery reference to the sticky's parent node
       * @property parent
       * @type Object
       * @private
       */
      $parent,
      parentOffset,
      /**
       * The original CSS styles on the sticky node
       * @property origStyle
       * @type Object
       * @private
       */
      origStyle,
      isFixed = false;

      _.defaults( settings, defaults );

      Container.init.call( Sticky, $element, settings );
    
      origStyle = _.extend({}, $element);
      offset = $element.offset();
      $parent = $element.parent();
      parentOffset = $parent.offset();
    
      /**
       * Handles a scroll event 
       * @method handleScroll
       * @private
       * @param {Event} event JQuery event object
       */
      function handleScroll (event) {
        if ( window.pageYOffset >= offset.top) {
          isFixed = true;
          //$element.css('background', 'inherit').css('position', 'fixed').css('top', parentOffset.top );
          $element.css('background', 'inherit').css('margin-top', $window.scrollTop() + $element.offset().top );
        }
        else if (isFixed){
          //restoreStyles();
          $element.css('margin-top', 0 );
          isFixed = false;
        }
      }

      /**
       * Set all stored styles 
       * @method restoreStyles
       * @private
       * @return {Void}
       */
       function restoreStyles() {
         _.each(origStyle[0].style, function(key, index) {
           var tmp = origStyle[key];
           if (typeof tmp !== "undefined") {
             $element.css(key, origStyle[key]);
           }
         });
       }
      
      
      // === EVENT LISTENERS ===
      $window.scroll(handleScroll);
    }
  };

} );



//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Sticky );
  } else if( module.exports ){
   module.exports = Sticky;
  }
}