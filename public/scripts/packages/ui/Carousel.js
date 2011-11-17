var id = 'ui/Carousel',
  Class = li.require( 'libraries/ptclass' ),
  List = li.require( 'ui/List' ),
  Carousel;

/**
 * The Carousel Class
 * @class Carousel
 * @param {HTMLElement} $element The JQuery node representing the Carousel's container
 * @param {Object} settings Configuration properties
 */
Carousel = Class.create( List, ( function CarouselFactory() {
  /**
   * Private static defaults for all instaces of Carousel
   * @property defaults
   * @type Object
   */
  var defaults = {
      /**
       * Number of times to cycle through carousel items when playing, set to -1 to repeat forever
       * @property repeat
       * @type Number
       */
      repeat: -1,
      /**
       * Automatically calls play on instantiation if set to true
       * @property repeat
       * @type Boolean
       */
      autoplay: true,
      /**
       * The time in milliseconds to remain on an item while playing
       * @property delay
       * @type Number
       */
      delay: 3000,
      /**
       * A selector scoped to the $element that matches carousel pannels
       * @property repeat
       * @type String
       */
      pannels: '.pannels',
      /**
       * A selector scoped to the $element that matches carousel items
       * @property repeat
       * @type String
       */
      items: '.items',
      /**
       * The CSS class that designates a selected pannel
       * @property selectFlag
       * @default 'selected'
       * @type String
       * @final
      */
      activeFlag: 'active'
    };

  return {
    /**
     * The Carousel's constructor
     * @param {Function} $super A refference to initialize on the super class
     * @param {HTMLElement} $element The JQuery node representing the Carousel's container
     * @param {Object} settings Configuration properties
     * @constructor
     * @method initialize
     * @public
     */
    initialize: function( $super, $element, settings ) {
      var Carousel = this,
        repeat = settings.repeat,
        playing = false,
        $pannels;

      settings = _.extend( defaults, settings );

      $pannels = $element.children( settings.pannels ).children();

      if( $pannels.length > 0 ) {
        settings.items = $pannels.children( settings.items );
      }
      $super( $element, settings );

      
      /**
       * Pauses the Carousel when playing
       * @method pause
       * @public
       */
      Carousel.pause = function() {
        if( playing ) {
          playing = false;
          Carousel.trigger( 'paused' );
        }
        return Carousel;
      };

      /**
       * Plays the Carousel when paused
       * @method play
       * @public
       */
      Carousel.play = function() {
        if( playing === false ) {
          repeat = settings.repeat;
          playing = true;
          ( function recurse() {
            window.setTimeout( function() {
              if( playing ) {
                Carousel.next();
                recurse();
              }
            }, settings.delay );
          }() );
          Carousel.trigger( 'playing' );
        }
        return Carousel;
      };

      //play if autoplay was true in settings
      if( settings.autoplay ) {
        Carousel.play();
      }

      //Event Handlers
      Carousel.on( 'selected', function( event, $item ) {
        var $pannel = $item.closest( $pannels );
        if( $pannel.hasClass( settings.activeFlag ) === false ) {
          $pannels.removeClass( settings.activeFlag )
          $pannel.addClass( settings.activeFlag )
        }
      } );
      Carousel.on( 'max', function( event ) {
        event.stopPropagation();
        if( playing && repeat !== 0 ) {
          repeat -= 1;
          Carousel.first();
        } else if ( playing && repeat < 0 ){
          Carousel.first();
        } else {
          Carousel.first();
        }
      } );
      Carousel.on( 'min', function( event ) {
        event.stopPropagation();
        Carousel.last();
      } );
      Carousel.on( 'play', function( event ) {
        event.stopPropagation();
        Carousel.play();
      } );
      Carousel.on( 'pause', function( event ) {
        event.stopPropagation();
        Carousel.pause();
      } );

    }
  };

}() ) );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Carousel;
}