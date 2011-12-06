var Class = require( '/scripts/libraries/ptclass' ),
  Abstract = require( 'ui/Abstract' ),
  Tip;

/**
 * The Tip Class
 * @class Tip
 * @extends Abstract
 */

Tip =  Class.create( Abstract,  ( function () {

  var HIDE_EVENT = 'hide',
    HIDDEN_EVENT = 'hidden',
    SHOW_EVENT = 'show',
    SHOWN_EVENT = 'shown';

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
             * The time in ms before the tip hides after the user leaves the tip
             * @property delay
             * @type Number
             * @private
             */
            delay: 300,

            /**
             * The placement of the tip 
             * @property delay
             * @type Number
             * @private
             */
            placement: 'above',
            offsetTop: 0,
            offsetLeft: 0,
            template: '<div class="tip"><div class="arrow"></div><div class="content"><%= content %></div></div>',
            sticky: true,
            threshold: 10
        },
        shown = false,
        $document = $( document ),
        $tip,
        $content,
        position,
        title,
        delay,
        sticky;

      if( settings.content === undefined ) {
        title = $element.attr( 'title' );
        if( title !== undefined ) {
          $element.removeAttr( 'title' );
          settings.content = title; 
        }
      }

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      $tip = $( _.template( settings.template, { content: settings.content } ) );

      if( settings.style ) {
        $tip.addClass( settings.placement + ' ' + settings.style );
      } else {
        $tip.addClass( settings.placement + ' ' + $element.attr( 'class' ) );
      }

      function getPosition( cache ) {
        if( position === undefined || cache === false ) {

          switch ( settings.placement ) {
            case 'below':
              position = {
                top: $element.offset().top + $element.height() + settings.offsetTop,
                left: $element.offset().left + $element.width() / 2 - $tip.width() / 2 - settings.offsetLeft
              };
              break;
            case 'above': 
              position = {
                top: $element.offset().top - $tip.height() - settings.offsetTop,
                left: $element.offset().left + $element.width() / 2 - $tip.width() / 2 - settings.offsetLeft
              };
              break;
            case 'left':
              position = {
                top: $element.offset().top + $element.height() / 2 - $tip.height() / 2,
                left: $element.offset().left - $tip.width() - settings.offsetLeft
              };
              break;
            case 'right':
              position = {
                top: $element.offset().top + $element.height() / 2 - $tip.height() / 2,
                left: $element.offset().left + $element.width() + settings.offsetLeft
              };
              break;
          };

        }
        return position;
      }

      if( settings.uri ) {
        $content = $tip.find( '.content' );
        require.ensure( ['ui/Loader'], function() {
          var Loader = require( 'ui/Loader' );
          Loader = new Loader( $content, {} );
          Loader.on( 'loaded', function( event ) {
            $tip.css( getPosition( false ) );
          } );
          $element.on( 'shown', function( event ) {
            Loader.trigger( 'load', [ settings.uri ] );
          } );
        } );
      }

      Tip.show = function() {
        if( shown === false ) {
          $( 'body' ).append( $tip );
          $tip.css( getPosition() );

          $tip.on( 'mouseenter.athena.tip', function( event ) {
            sticky = true;
          } );

          $tip.on( 'mouseleave.athena.tip', function( event ) {
            sticky = false;
            Tip.hide();
          } );

          shown = true;
          $element.trigger( SHOWN_EVENT, $tip );
        }
      };
      Tip.hide = function() {
        if( shown === true ) {
          delay = window.setTimeout( function() {
            if( !sticky ) {
              $tip.off( 'mouseenter.athena.tip' );
              $tip.off( 'mouseleave.athena.tip' );
              $tip.remove();
              shown = false;
              $element.trigger( HIDDEN_EVENT, $tip );
            }
          }, settings.delay );
        }
      };

      $element.on( 'mouseenter', function( event ) {
        event.stopPropagation();
        $document.on( 'mousemove.athena.tip', function( event ) {
          var clientX = event.clientX,
            clientY = event.clientY,
            left = $element.offset().left,
            top = $element.offset().top,
            width = $element.width(),
            height = $element.height();

          function isMouseInside() {
            if( clientX < left - settings.threshold - settings.offsetLeft ) {
              return false;
            } else if( clientY < top - settings.threshold - settings.offsetTop ) {
              return false;
            } else if ( clientX > left + width + settings.threshold + settings.offsetLeft ) {
              return false;
            } else if ( clientY > top + height + settings.threshold + settings.offsetTop ) {
              return false;
            }
            return true;
          }

          if( !isMouseInside() ) {
            Tip.hide();
            $document.off( 'mousemove.athena.tip' );
          }

        } );
        Tip.show();
      } );
      $element.on( 'focus.athena.tip', function( event ) {
        event.stopPropagation();

        $element.on( 'blur.athena.tip', function( event ) {
          event.stopPropagation();
          $element.off( 'blur.athena.tip' );
          Tip.hide();
        } );

        Tip.show();

      } );
      $element.on( HIDE_EVENT, function( event ) {
        event.stopPropagation();
        Tip.hide();
      } );
      $element.on( SHOW_EVENT, function( event ) {
        event.stopPropagation();
        Tip.show();
      } );

    }
  };

}() ) );

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Tip;
}