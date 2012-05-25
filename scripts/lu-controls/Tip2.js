/**
 * Tooltip class
 * @class Tip2
 * @constructor
 * @extends Abstract
 * @require Container
 * @version 0.0.1
 */


var Abstract = require( '/scripts/lu-controls/Abstract' ),
  Container = require( '/scripts/lu-controls/Container' ),
  Tip2;

Tip2 = Abstract.extend( function (Abstract){

  //Observed events s
  var HIDE_EVENT = 'hide',
      SHOW_EVENT = 'show',
      //Stateful published events
      HIDDEN_EVENT = 'hidden',
      SHOWN_EVENT = 'shown',
  
  // OTHER CONSTANTS
      CLASS = 'class',
      TRUE = true,
      FALSE = false,
      
      /**
       * Default configuration values for all Tip2 instances
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {

        /**
         * The time in milliseconds before before the Tip2 hides after the user has stopped interacting with it.
         * @property delay
         * @type Number
         * @private
         */
        delay: 300,

        /**
         * The placement of the tip. above || below || right || left
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
        template: '<div class="lu-tip"><div class="lu-arrow"></div><div class="lu-content"><%= content %></div></div>',
        
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

    /**
     * Tip2 constructor 
     * @method init
     * @public
     * @param {Object} $element JQuery collection containing the related element.
     * @param {Object} settings Configuration settings
     */
    init: function ( $element, settings ){

      /**
       * Instance of Tip2
       * @property Tip
       * @type Object
       * @private
       */
      var Tip2 = this,

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
         * @type Object
         * @private
         */
        $document = $( document ),

        /**
         * A jQuery collection that references the tip node.
         * @property $tip
         * @type Object
         * @private
         */
        $tip,

        /**
         * A jQuery collection that references the tip's content.
         * @property $content
         * @type Object
         * @private
         */
        $content,

        /**
         * The cached position of the tip
         * @property position
         * @type Object
         * @private
         */
        position,

        /**
         * A CSS selector used to access local content for the tip
         * @property contentSelector
         * @type String
         * @private
         */
        contentSelector,

        /**
         * A URL from the Tip's anchor tag
         * @property href
         * @type String
         * @private
         */
        href,

        /**
         * The derived content used in the tip
         * @property content
         * @type Object
         * @private
         */
        content,

        /**
         * An indicator of whether or not the tip should remain open
         * @property stuck
         * @type Object
         * @private
         */
        stuck,
        
        /**
         * Array of decorators to apply to a Tip instance
         * @property decorators
         * @type Array
         */
        decorators = [];

    
      //MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      Abstract.init.call( this, $element, settings );

      /**
       * Appends the Tip to the document 
       * @method append
       * @private
       * @return {Void}
       */
      function append() {
        $( 'body' ).append( $tip );        
      }
          
      /**
       * Renders the content and the template to create the tip 
       * @method render
       * @private
       * @param {String} content The content to inject into the tip
       * @return {Object} A JQuery collection that references the tip
       */
      function render(content) {
        return $( _.template( settings.template, { content: content } ) );
      }
      

      // TODO: replace this with Container instance
      // if the HREF is a relative URL, use that as the content node ID
      href = $element.attr( 'href' );

      if ( href && (/^#\S+/).test(href) ) {
        content = $( href ).html();
      }

      //Instantiate the tip
      $tip = render(content);

      //transfer the styles from the target to the tip if style is not specified
      if( settings.style ){
        $tip.addClass( settings.placement + ' ' + settings.style );
      } else {
        if( $element.attr( CLASS ) ){
          $tip.addClass( settings.placement + ' ' + $element.attr( CLASS ) );
        } else {
          $tip.addClass( settings.placement );
        }
      }

      /**
       * Show the tip
       * @method show
       * @return {Void}
       */
      Tip2.show = function(){
        if( rendered === FALSE ){
          append();
          $tip.css( getPosition(null, settings) );

          $tip.on( 'mouseenter.lu.tip', function( event ){
            stuck = TRUE;
          } );

          $tip.on( 'mouseleave.lu.tip', function( event ){
            stuck = FALSE;
            Tip2.hide();
          } );

          rendered = TRUE;
          Tip2.trigger( SHOWN_EVENT, $tip );
        }
        else {
          $tip.show();
        }
      };

      /**
       * Hide the tip
       * @method hide
       * @return {Void}
       */
      Tip2.hide = function(){
        var timeout;
        if( rendered === TRUE ){
          timeout = window.setTimeout( function(){
            if( !stuck || !settings.interactive ){
              $tip.off( 'mouseenter.lu.tip' );
              $tip.off( 'mouseleave.lu.tip' );
              $tip.remove();
              rendered = FALSE;
              window.clearTimeout( timeout );
              Tip2.trigger( HIDDEN_EVENT, $tip );
            }
          }, settings.delay );
        }
      };
      
      /**
       * Gets the position of the tip
       * @method getPosition
       * @param {Boolean} cache Uses the cached position by default or if set to true.
       * @return {Object} position And object containing a top and left
       * @private
       */
      function getPosition( cache, settings ){
        var elOffset = $element.offset(),
          elHeight = $element.height(),
          elWidth = $element.width();

        if( position === undefined || cache === false ){
          position = Tip2.calcPosition(elOffset, elHeight, elWidth, settings);
        }
        return position;
      }

      /**
       * Calculates the position of the tip
       * @method calcPosition
       * @param {Object} offset
       * @param {Number} height
       * @param {Number} width
       * @param {Object} settings tip instance settings
       * @private
       */
      Tip2.XcalcPosition = function (offset, height, width, settings) {
        return {
	        top: offset.top + height / 2 - Tip2.$tip.height() / 2,
          left: offset.left + width + settings.offsetLeft
        };
        
      };

      /**
       * Function to run on mouseenter. Must be named so we can pass it specifically to jQuery's off.
       * @private
       * @method mouseenterEvent
       * @param {Objct} event jQuery event object
       * @return {Void}
       */
      function mouseenterEvent ( event ){
        //set up a listener on the document to be used in determing if the user has moused out of the threshold
        event.stopPropagation();
        
        $document.on( 'mousemove.lu.tip', function( event ){

          event.stopPropagation();
          var pageX = event.pageX,
            pageY = event.pageY,
            left = $element.offset().left,
            top = $element.offset().top,
            width = $element.width(),
            height = $element.height();

          /**
           * Returns true if the mouse is within the threshold area
           * @private
           * @method isMouseInside
           */
          function isMouseInside(){
            var result = TRUE;
            if( pageX < left - settings.threshold - settings.offsetLeft ){
              result = FALSE;
            } else if( pageY < top - settings.threshold - settings.offsetTop ){
              result = FALSE;
            } else if ( pageX > left + width + settings.threshold + settings.offsetLeft ){
              result = FALSE;
            } else if ( pageY > top + height + settings.threshold + settings.offsetTop ){
              result = FALSE;
            }
            return result;
          }

          if( !isMouseInside() ){
            $document.off( 'mouseenter', mouseenterEvent );
            $document.off( 'mousemove.lu.tip' );
            Tip2.hide();
          }

        } );

        Tip2.show();
      }

      //Event Listeners
      Tip2.on( 'mouseenter', mouseenterEvent);
      
      Tip2.on( 'focus', function( event ){
        event.stopPropagation();
          Tip2.on( 'blur.lu.tip', function( event ){
          event.stopPropagation();
          Tip2.off( 'blur.lu.tip' );          
          Tip2.hide();
        } );
      
        Tip2.show();
      
      } );

      //Listen to these events from other controls
      Tip2.on( HIDE_EVENT, function( event ){
        event.stopPropagation();
        Tip2.hide();
      } );
      Tip2.on( SHOW_EVENT, function( event ){
        event.stopPropagation();
        Tip2.show();
      } );

      // PUBLIC ACCESS
      Tip2.$element = $element;
      Tip2.$tip = $tip;
      Tip2.position = position;
      
      // Decorate based on placement option
      switch (settings.placement) {
        case "top":
        case "above":
          decorators.push("/scripts/lu-decorators/positionAbove");
          break;
        case "bottom":  
        case "below":
          decorators.push("/scripts/lu-decorators/positionBelow");
          break;
        case "left":
          decorators.push("/scripts/lu-decorators/positionLeft");
          break;
        case "right":
          // same as default
        default:
          decorators.push("/scripts/lu-decorators/positionRight");
      }
      
      
      require.ensure( decorators, function ( require, module, exports ) {
        _.each( decorators, function ( decorator, index ) {
          Tip2.decorate(require( decorator ) );
        });
      });
    }
  };

});

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Tip2 );
  } else if( module.exports ){
   module.exports = Tip2; 
  }
}
