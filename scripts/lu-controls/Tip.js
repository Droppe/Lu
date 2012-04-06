/**
 * Tooltip class
 * @class Tip
 * @constructor
 * @extends Loader
 * @requires ptclass
 */
var Class = require( 'class' ),
  Loader = require( 'lu/Loader' ),
  Tip;

Tip =  Class.create( Loader,  ( function () {

  //Observed events 
  var HIDE_EVENT = 'hide',
      SHOW_EVENT = 'show',
      //Stateful published events
      HIDDEN_EVENT = 'hidden',
      SHOWN_EVENT = 'shown',
  
  // OTHER CONSTANTS
      TITLE = 'title',
      CLASS = 'class';

  return {

    /**
     * Tip constructor 
     * @method initialize
     * @public
     * @param {Object} $super Pointer to superclass constructor
     * @param {Object} $element JQuery collection containing the related element.
     * @param {Object} settings Configuration settings
     */
    initialize: function ( $super, $element, settings ) {

      /**
       * Instance of Tip
       * @property Tip
       * @type Object
       * @private
       */
      var Tip = this,

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
             * The placement of the tip. above || below || right || left
             * @property placement
             * @type String
             * @private
             */
            placement: 'above',

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
            template: '<div class="tip"><div class="arrow"></div><div class="content"><%= content %></div></div>',

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
         * An indicator of whether or not the tip is currently shown.
         * @property shown
         * @type Boolean
         * @private
         */
        shown = false,

        /**
         * A jQuery collection that references the document.
         * @property $document
         * @type Object
         * @private
         */
        $document = $( document ),

        /**
         * A jQuery collection that references the the tip.
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
        stuck;

      //Use the title as content id if content not provide in settings
      if( settings.content === undefined ) {
        content = $element.attr( TITLE );
        if( content !== undefined ) {
          $element.removeAttr( TITLE );
          settings.content = content; 
        }
      }

      //MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      $super( $element, settings );

      //Instantiate the tip
      $tip = $( _.template( settings.template, { content: settings.content } ) );

      //transfer the styles from the target to the tip if style is not specified
      if( settings.style ) {
        $tip.addClass( settings.placement + ' ' + settings.style );
      } else {
        if( $element.attr( CLASS ) ) {
          $tip.addClass( settings.placement + ' ' + $element.attr( CLASS ) );
        } else {
          $tip.addClass( settings.placement );
        }
      }


      /**
       * Used to determine the position of the tip
       * @private
       * @method getPosition
       * @param cache {Boolean} Uses the cached position by default or if set to true.
       * @returns position {Object} And object containing a top and left
       */
      function getPosition( cache ) {
        var elOffset = $element.offset(),
          elHeight = $element.height(),
          elWidth = $element.width();

        if( position === undefined || cache === false ) {

          switch ( settings.placement ) {
            case 'below':
              position = {
                top: elOffset.top + elHeight + settings.offsetTop,
                left: elOffset.left + elWidth / 2 - $tip.width() / 2 - settings.offsetLeft
              };
              break;
            case 'above': 
              position = {
                top: elOffset.top - $tip.height() - settings.offsetTop,
                left: elOffset.left + elWidth / 2 - $tip.width() / 2 - settings.offsetLeft
              };
              break;
            case 'left':
              position = {
                top: elOffset.top + elHeight / 2 - $tip.height() / 2,
                left: elOffset.left - $tip.width() - settings.offsetLeft
              };
              break;
            case 'right':
              position = {
                top: elOffset.top + elHeight / 2 - $tip.height() / 2,
                left: elOffset.left + elWidth + settings.offsetLeft
              };
              break;
          }

        }
        return position;
      }

      //require the Loader and set up listeners if a uri was specifed
      if( settings.uri ) {
        $content = $tip.find( '.content' );
        require.ensure( ['lu/Loader'], function( require, module, exports ) {
          var id = 'lu/Loader',
            Loader;

          Loader = require( id );
          Loader = new Loader( $content, {} );

         Loader.on( 'loaded', function( event ) {
           $tip.css( getPosition( false ) );
         } );
         $element.one( SHOWN_EVENT, function( event ) {
           Loader.trigger( 'load', [ settings.uri ] );
         } );

        } );
      }

      /**
       * Show the tip
       * @privelaged
       * @method show
       */
      Tip.show = function() {
        if( shown === false ) {
          $( 'body' ).append( $tip );
          $tip.css( getPosition() );

          $tip.on( 'mouseenter.lu.tip', function( event ) {
            stuck = true;
          } );

          $tip.on( 'mouseleave.lu.tip', function( event ) {
            stuck = false;
            Tip.hide();
          } );

          shown = true;
          $element.trigger( SHOWN_EVENT, $tip );
        }
      };

      /**
       * Hide the tip
       * @privelaged
       * @method hide
       */
      Tip.hide = function() {
        var timeout;
        if( shown === true ) {
          timeout = window.setTimeout( function() {
            if( !stuck || !settings.sticky ) {
              $tip.off( 'mouseenter.lu.tip' );
              $tip.off( 'mouseleave.lu.tip' );
              $tip.remove();
              shown = false;
              window.clearTimeout( timeout );
              Tip.trigger( HIDDEN_EVENT, $tip );
            }
          }, settings.delay );
        }
      };

      /**
       * Function to run on mouseenter. Must be named so we can pass it specifically to jQuery's off.
       * @private
       * @method mouseenterEvent
       */
      function mouseenterEvent ( event ) {
        //set up a listener on the document to be used in determing if the user has moused out of the threshold
        $document.on( 'mousemove.lu.tip', function( event ) {
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
          function isMouseInside() {
            var result = true;
            if( pageX < left - settings.threshold - settings.offsetLeft ) {
              result = false;
            } else if( pageY < top - settings.threshold - settings.offsetTop ) {
              result = false;
            } else if ( pageX > left + width + settings.threshold + settings.offsetLeft ) {
              result = false;
            } else if ( pageY > top + height + settings.threshold + settings.offsetTop ) {
              result = false;
            }
            return result;
          }

          if( !isMouseInside() ) {
            $document.off( 'mouseenter', mouseenterEvent );
            $document.off( 'mousemove.lu.tip' );
            Tip.hide();
          }

        } );
        Tip.show();
      }

      //Event Listeners
      Tip.on( 'mouseenter', mouseenterEvent);
      
      Tip.on( 'focus', function( event ) {
        event.stopPropagation();
        $element.on( 'blur.lu.tip', function( event ) {
          event.stopPropagation();
          $element.off( 'blur.lu.tip' );
          Tip.hide();
        } );
      
        Tip.show();
      
      } );

      //Listen to these events from other controls
      Tip.on( HIDE_EVENT, function( event ) {
        event.stopPropagation();
        Tip.hide();
      } );
      Tip.on( SHOW_EVENT, function( event ) {
        event.stopPropagation();
        Tip.show();
      } );

    }
  };

}() ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Tip );
  } else if( module.exports ) {
   module.exports = Tip; 
  }
}
