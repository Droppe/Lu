/**
 * Tooltip class
 * @class Tip
 * @constructor
 * @extends Abstract
 * @require Container
 * @version 0.1.4
 */
var Abstract = require( 'lu/Abstract' ),
  Container = require( 'lu/Container' ),
  Tip;

Tip = Abstract.extend( function (Abstract){

  //Observed events
  var HIDE_EVENT = 'hide',
      SHOW_EVENT = 'show',
      //Stateful published events
      HIDDEN_EVENT = 'hidden',
      SHOWN_EVENT = 'shown',
  
  // OTHER CONSTANTS
      CLASS = 'class',
      TRUE = true,
      FALSE = false,
      DECORATORS_PATH = 'lu/Tip/position',
      
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
         * Can also be passed in via Lu's auto-param ("__param__") as "Tip:Above", etc.
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
        template: '<div class="lu-tip" role="tooltip"><div class="lu-arrow"></div><div class="lu-content"><!-- CONTENT PLACEHOLDER --></div></div>',
        
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
     * Tip constructor 
     * @method init
     * @public
     * @param {Object} $element JQuery collection containing the related element.
     * @param {Object} settings Configuration settings
     */
    init: function ( $element, settings ){

      /**
       * Instance of Tip
       * @property Tip
       * @type Object
       * @private
       */
      var Tip = this,

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
         * A reference to the tip's Container instance.
         * @property TipContainer
         * @type Object
         * @private
         */
        TipContainer,

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

      if (settings['__params__']) {
        settings.placement = settings['__params__'][0] || settings.placement;       
      }
      
    
      //MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      Abstract.init.call( this, $element, settings );

      href = settings.url || $element.attr( 'href' );

      $tip = renderTip();
      styleTip();
      TipContainer = new Container( $tip, {
        target: '.lu-content',
        frame: settings.frame,
        notify: $element
      });


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
       * @method renderTip
       * @private
       * @param {String} content The content to inject into the tip
       * @return {Object} A JQuery collection that references the tip
       */
      function renderTip(content) {
        return $(settings.template);
      }
      
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

      /**
       * Show the tip
       * @method show
       * @return {Void}
       */
      Tip.show = function(){

        TipContainer.one( 'mouseenter.lu.tip', function( event ){
          stuck = TRUE;
        } );

        TipContainer.one( 'mouseleave.lu.tip', function( event ){
          stuck = FALSE;
          Tip.hide();
        } );
        
        if( rendered === FALSE ){
          TipContainer.trigger("load", href);
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
      Tip.hide = function(){
        var timeout;
        if( rendered === TRUE ){
          timeout = window.setTimeout( function(){
            if( !stuck || !settings.interactive ){
              $tip.hide();
              window.clearTimeout( timeout );
              Tip.trigger( HIDDEN_EVENT, [Tip, TipContainer] );
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
          elHeight = $element.outerHeight(),
          elWidth = $element.outerWidth();

        if( position === undefined || cache === false ){
          position = Tip.calcPosition(elOffset, elHeight, elWidth, settings);
        }
        return position;
      }

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
            width = $element.outerWidth(),
            height = $element.outerHeight();

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
            Tip.hide();
          }

        } );

        Tip.show();
      }

      // === Event Listeners ===
      Tip.on( 'mouseenter', mouseenterEvent);
      
      Tip.on( 'focus', function( event ){
        event.stopPropagation();
        Tip.on( 'blur.lu.tip', function( event ){
          event.stopPropagation();
          Tip.off( 'blur.lu.tip' );
          Tip.hide();
        } );
      
        Tip.show();
      
      } );

      // === APPEND TIP TO DOM FOLLOWING UPDATE EVENT ===
      Tip.on('updated', function(event) {
        event.stopPropagation();
        append();
        $tip.css( getPosition(false, settings) );
        rendered = TRUE;
        Tip.trigger( SHOWN_EVENT, [Tip, TipContainer] );
      });

      //Listen to these events from other controls
      Tip.on( HIDE_EVENT, function( event ){
        event.stopPropagation();
        Tip.hide();
      } );
      Tip.on( SHOW_EVENT, function( event ){
        event.stopPropagation();
        Tip.show();
      } );

      // PUBLIC ACCESS
      Tip.$tip = $tip;
      Tip.position = position;
      
      // Decorate based on placement option
      switch (settings.placement) {
        case "top":
        case "above":
          decorators.push(DECORATORS_PATH + 'Above');
          break;
        case "bottom":  
        case "below":
          decorators.push(DECORATORS_PATH + 'Below');
          break;
        case "left":
          decorators.push(DECORATORS_PATH + 'Left');
          break;
        case "right":
          // same as default
        default:
          decorators.push(DECORATORS_PATH + 'Right');
      }
      
      require.ensure( decorators, function ( require, module, exports ) {
        _.each( decorators, function ( decorator, index ) {
          Tip.decorate(require( decorator ) );
        });
      });
      
    }
  };

});

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Tip );
  } else if( module.exports ){
   module.exports = Tip; 
  }
}
