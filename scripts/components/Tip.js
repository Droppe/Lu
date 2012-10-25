/**
 * Tooltip class
 * @class Tip
 * @constructor
 * @extends Abstract
 * @require Container
 * @version 0.1.4
 */
var constants = require( 'lu/constants' ),
  Abstract = require( 'lu/Abstract' ),
  Container = require( 'lu/Container' ),
  Fiber = require( 'Fiber' ),
  Tip;

Tip = Abstract.extend( function (Abstract){

  // === STATIC VARIABLES ===
  var CLASS = 'class',
      TRUE = true,
      FALSE = false,
      root = 'lu/Tip/decorators/',
      decorators = {
        above: root + 'above',
        below: root + 'below',
        left: root + 'left',
        right: root + 'right'
      },
      /**
       * Default configuration values for all Tip instances
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {

        /**
         * The time in milliseconds before before the Tip hides after the user has stopped interacting with it.
         * @property delay
         * @type Number
         * @private
         */
        delay: 300,

        /**
         * The placement of the tip. Valid options are "above"/"below"/"right/"left"
         * @property placement
         * @type String
         * @private
         * @default right
         */
        placement: 'right',

        /**
         * The number of pixels from the top of the element the tip will be positioned at.
         * @property offsetTop
         * @type Number
         * @private
         */
        offsetTop: 0,

        /**
         * The number of pixels from the left of the element the tip will be positioned at.
         * @property offsetTop
         * @type Number
         * @private
         */
        offsetLeft: 0,

        /**
         * An underscore template to be used in generating the tip. (see: http://documentcloud.github.com/underscore/)
         * @property template
         * @type String
         * @private
         */
        template: _.template('<div class="<%= className %>" role="tooltip" tabindex="-1"><!-- CONTENT PLACEHOLDER --></div>'),

        /**
         * Class name to be applied to tooltips outermost div
         * @property className
         * @type String
         * @private
         */
        className: 'tooltip',

        /**
         * CSS styles for the Tip
         * @property style
         * @type String
         * @private
         */
        style: '',

        /**
         * If set to true the tip will remain open until the mouse has left the tip.
         * @property interactive
         * @type Boolean
         * @private
         * @default true
         */
        interactive: TRUE,

        /**
         * The buffer in pixels around the element to be used in determing if the user has stopped
         * interacting with the tip
         * @property threshold
         * @type Number
         * @private
         * @default 10
         */
        threshold: 10
      };

  return {

    init: function ( $element, settings ){

      // === INSTANCE VARIABLES ===
      var self = this,

        /**
         * An indicator of whether or not the tip has been rendered.
         * @property rendered
         * @type Boolean
         * @private
         */
        rendered = FALSE,

        /**
         * A jQuery collection that references the document.
         * @property $document
         * @type jQuery Object
         * @private
         */
        $document = $( document ),

        /**
         * A jQuery collection that references the tip node.
         * @property $tip
         * @type jQuery Object
         * @private
         */
        $tip,

        /**
         * A reference to the tip's Container instance.
         * @property TipContainer
         * @type Object
         * @private
         */
        TipContainer,

        /**
         * A URL from the Tip's anchor tag
         * @property href
         * @type String
         * @private
         */
        href,

        /**
         * An indicator of whether or not the tip should remain open
         * @property stuck
         * @type Boolean
         * @private
         */
        stuck,

        /**
         * Whether the element is an input or not
         * @property isInput
         * @type Boolean
         * @private
         */
        isInput = ($element[0].tagName.toLowerCase() === 'input'),

        /**
         * Array of decorators to apply to a Tip instance
         * @property requirements
         * @type Array
         * @private
         */
        requirements = [],
        decorator;


      // === INITIALIZE ===
      _.defaults( settings, defaults );
      Abstract.init.call( this, $element, settings );
      href = settings.url || $element.attr( 'href' );
      $tip = $(settings.template({ className: settings.className }));

      /**
       * Transfer the styles from the target to the tip if style is not specified
       * @method styleTip
       * @public
       * @return {Void}
       */
      function styleTip() {
        var placement = settings.placement,
          style = settings.style;
          
        if( placement && style ){
          $tip.addClass( placement + ' ' + style );
        } else {
          if( $element.attr( CLASS ) ){
            $tip.addClass( placement + ' ' + $element.attr( CLASS ) );
          } else {
            $tip.addClass( placement );
          }
        }
      }

      styleTip();

      TipContainer = new Container( $tip, {
        frame: settings.frame,
        notify: $element
      });

      // === PRIVATE ===
      /**
       * Appends the Tip to the body
       * @method append
       * @private
       * @return {Void}
       */
      function append() {
        $( 'body' ).append( $tip );
      }

      /**
       * Function to run on mouseenter. Must be named so we can pass it specifically to jQuery's off.
       * @private
       * @method handleMouseEnter
       * @param {Objct} event jQuery event object
       * @return {Void}
       */
      function handleMouseEnter ( event ){
        event.stopPropagation();

        //set up a listener on the document to be used in determing if the user has moused out of the threshold
        $document.on( 'mousemove.lu.tip', handleMouseMove );
        self.show();
      }

      /**
       * Function to run on mousemove.
       * @private
       * @method handleMouseMove
       * @param {Objct} event jQuery event object
       * @return {Void}
       */
      function handleMouseMove ( event ){
        event.stopPropagation();
        var pageX = event.pageX || 0,
          pageY = event.pageY || 0,
          elLeft = $element.offset().left,
          elTop = $element.offset().top,
          elWidth = $element.outerWidth(),
          elHeight = $element.outerHeight(),
          tipLeft = $tip.offset().left,
          tipTop = $tip.offset().top,
          tipWidth = $tip.outerWidth(),
          tipHeight = $tip.outerHeight();

        /**
         * Returns true if the mouse is outside the threshold area
         * @private
         * @method isMouseOutside
         */
        function isMouseOutside(){
          var outLeft  = (pageX < (elLeft - settings.threshold - settings.offsetLeft)) && (pageX < (tipLeft - settings.threshold - settings.offsetLeft)),
              outRight = (pageX > (elLeft + elWidth + settings.threshold + settings.offsetLeft)) && (pageX > (tipLeft + tipWidth + settings.threshold + settings.offsetLeft)),
              outAbove = (pageY < (elTop - settings.threshold - settings.offsetTop)) && (pageY < (tipTop - settings.threshold - settings.offsetTop)),
              outBelow = (pageY > (elTop + elHeight + settings.threshold + settings.offsetTop)) && (pageY > (tipTop + tipHeight + settings.threshold + settings.offsetTop));

          return ( ( outLeft || outRight ) || ( outAbove || outBelow ) );
        }

        if( isMouseOutside() ){
          $document.off( 'mouseenter', handleMouseEnter );
          $document.off( 'mousemove.lu.tip', handleMouseMove );
          self.hide();
        }
      }

      /**
       * Function to run on focus.
       * @private
       * @method handleFocus
       * @param {Objct} event jQuery event object
       * @return {Void}
       */
      function handleFocus( event ){
        event.stopPropagation();

        $element.on( 'blur.lu.tip', function( event ){
          event.stopPropagation();
          $element.off( 'blur.lu.tip' );
          self.hide();
        } );

        self.show();
      }

      // === PUBLIC ===
      this.$tip = $tip;

      /**
       * Show the tip
       * @method show
       * @return {Void}
       */
      this.show = function(){
        if( rendered === FALSE ){
          TipContainer.trigger( 'load', href );
        } else {
          $tip.css( self.getPosition() );
          $tip.show();
          // use setting focus on active tip to enforce one tip at a time
          if( !isInput ) {
            $tip.focus();
          }
        }
      };

      /**
       * Hide the tip
       * @method hide
       * @return {Void}
       */
      this.hide = function(){
        var timeout;
        if( rendered === TRUE ){
          timeout = window.setTimeout( function(){
            if( !stuck || !settings.interactive ){
              $tip.hide();
              window.clearTimeout( timeout );
            }
          }, settings.delay );
        }
      };

      /**
       * Gets the position of the tip
       * @method getPosition
       * @return {Object} position And object containing a top and left
       * @private
       */
      this.getPosition = function(){
        var elOffset = $element.offset(),
          elHeight = $element.outerHeight(),
          elWidth = $element.outerWidth();

        return self.calcPosition( elOffset, elHeight, elWidth, settings );
      };

      // === LU EVENT LISTENERS ===
      this.on( constants.events.SHOW, function( event ){
        event.stopPropagation();
        self.show();
      } );

      this.on( constants.events.HIDE, function( event ){
        event.stopPropagation();
        self.hide();
      } );

      // Append tip to DOM after container is updated (loaded)
      TipContainer.on( constants.events.UPDATED, function(event) {
        event.stopPropagation();
        append();
        rendered = TRUE;
        self.trigger( constants.events.SHOW, [self] );
      } );

      // === DOM EVENT LISTENERS ===
      if( !isInput ) {
        $element.on( 'mouseenter', handleMouseEnter );
      } else {
        $element.on( 'focus', handleFocus );
      }
      // use losing focus on tip to enforce one tip at a time
      $tip.on( 'blur', self.hide );

      // === DECORATION ===
      switch( settings.placement ){
        case 'Above':
          requirements.push( decorators.above );
          break;
        case 'Below':
          requirements.push( decorators.below );
          break;
        case 'Left':
          requirements.push( decorators.left );
          break;
        case 'Right':
          requirements.push( decorators.right );
          break;
        default:
          requirements.push( decorators.right );
      }

      require.ensure( requirements, function( require, module, exports ){
        _.each( requirements, function( decorator, index ){
          decorator = require( decorator )( settings );
          Fiber.decorate( self, decorator );
        } );
        self.trigger( 'dependencies-resolved' );
      } );

    }
  };

});

// Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Tip );
  } else if( module.exports ){
   module.exports = Tip;
  }
}
