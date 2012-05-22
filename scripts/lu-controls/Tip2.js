/**
 * Tooltip class
 * @class Tip2
 * @constructor
 * @extends Button
 * @require Container
 * @version 0.0.1
 
 Tip extends Button
 Tip settings, container, hover
 Tip manages a Container
 Tip is decorated by Above, Below, Left, Right
 
 Tip.show() wraps Container.set()
 
 
 
 +++
 
 
 List - mgr of containers
 Tab - mgr of Lists
 Tip - mgr of a Container
 Tip extends Btn
 
 
 */


var Button = require( '/scripts/lu-controls/Button' ),
  //Container = require( '/scripts/lu-controls/Container' ),
  positionRight = require('/scripts/lu-decorators/positionRight'),
  positionLeft = require('/scripts/lu-decorators/positionLeft'),
  positionAbove = require('/scripts/lu-decorators/positionAbove'), 
  positionBelow = require('/scripts/lu-decorators/positionBelow'),    
  Tip2;

Tip2 = Button.extend( function (Button){

  //Observed events s
  var HIDE_EVENT = 'hide',
      SHOW_EVENT = 'show',
      //Stateful published events
      HIDDEN_EVENT = 'hidden',
      SHOWN_EVENT = 'shown',
  
  // OTHER CONSTANTS
      CLASS = 'class';

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
         * Default configuration values for all Tip2 instances
         * @property defaults
         * @type Object
         * @private
         * @final
         */
        defaults = {

          /**
           * Selector for in-page content
           * @property contentSelector
           * @type String
           * @private
           */
          contentSelector: "",

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
           * @property sticky
           * @type Boolean
           * @private
           */
          sticky: true,

          /**
           * The buffer in pixels around the element to be used in determing if the user has stopped 
           * interacting with the tip
           * @property threshold
           * @type Number
           * @private
           */
          threshold: 10
        },

        /**
         * An indicator of whether or not the tip has been rendered.
         * @property rendered
         * @type Boolean
         * @private
         */
        rendered = false,

        /**
         * A jQuery collection that references the document.
         * @property $document
         * @type Object
         * @private
         */
        $document = $( document ),

        /**
         * A jQuery collection that references the the tip node.
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
         * Array of decorators to apply to this instance
         * @property decorators
         * @type Array
         */
        decorators = [];

    
      //MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      Button.init.call( this, $element, settings );

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

          
      /**
       * Used to determine the position of the tip
       * @private
       * @method getPosition
       * @param {Boolean} cache Uses the cached position by default or if set to true.
       * @return {Object} position And object containing a top and left
       */
/*
      Tip2.getPosition = function ( cache, settings ){
        var elOffset = $element.offset(),
          elHeight = $element.height(),
          elWidth = $element.width();

        if( !position || !cache ){
          position = {
            top: elOffset.top + elHeight / 2 - $tip.height() / 2,
            left: elOffset.left + elWidth + settings.offsetLeft
          };
        }
        return position;
      };
*/
      
      // If a content ID is specified in the config use that, else
      // if the HREF is a relative URL, use that as the content node ID

      contentSelector = settings.contentSelector;
      href = $element.attr( 'href' );

      if( contentSelector ){
        content = $(contentSelector).html();
      }
      else if ( href && (/^#\S+/).test(href) ) {
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
        if( rendered === false ){
          append();
          $tip.css( Tip2.getPosition(null, settings) );

          $tip.on( 'mouseenter.lu.tip', function( event ){
            stuck = true;
          } );

          $tip.on( 'mouseleave.lu.tip', function( event ){
            stuck = false;
            Tip2.hide();
          } );

          rendered = true;
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
        if( rendered === true ){
          timeout = window.setTimeout( function(){
            if( !stuck || !settings.sticky ){
              $tip.off( 'mouseenter.lu.tip' );
              $tip.off( 'mouseleave.lu.tip' );
              $tip.remove();
              rendered = false;
              window.clearTimeout( timeout );
              Tip2.trigger( HIDDEN_EVENT, $tip );
            }
          }, settings.delay );
        }
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
            var result = true;
            if( pageX < left - settings.threshold - settings.offsetLeft ){
              result = false;
            } else if( pageY < top - settings.threshold - settings.offsetTop ){
              result = false;
            } else if ( pageX > left + width + settings.threshold + settings.offsetLeft ){
              result = false;
            } else if ( pageY > top + height + settings.threshold + settings.offsetTop ){
              result = false;
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
      
      // Decorate based on placement option
      switch (settings.placement) {
        case "above":
          //Tip2.decorate( positionAbove );
          decorators.push( positionAbove );
          break;
        case "below":
          //Tip2.decorate( positionBelow );  
          decorators.push( positionBelow );
          break;
        case "left":
          //Tip2.decorate( positionLeft );
          decorators.push( positionLeft );
          break;
        case "right":
          // same as default
        default:
          //Tip2.decorate( positionRight );
          decorators.push( positionRight );
      }
      
      Tip2.decorate.apply(Tip2, decorators );
      
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
