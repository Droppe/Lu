var id = 'ui/Carousel',
  Class = li.require( 'libraries/ptclass' ),
  List = li.require( 'ui/List' ),
  Carousel;

/**
 * Description
 * @class Carousel
 * @constructor
 * @param {HTMLElement} $element The JQuery node representing the Carousel's container
 * @param {Object} settings Configuration properties
 */
Carousel = Class.create( List, ( function CarouselFactory() {

  var defaults = {
      repeat: -1,
      autoplay: true,
      delay: 3000,
      items: '.items li'
    };

  return {
    initialize: function( $super, $element, settings ) {
      var Carousel = this,
        repeat = settings.repeat,
        playing = false;

      settings = _.extend( defaults, settings );

      $super( $element, settings );

      Carousel.pause = function() {
        if( playing ) {
          playing = false;
          Carousel.trigger( 'paused' );
        }
        return Carousel;
      };
      Carousel.play = function() {
        var index;
        if( playing === false ) {
          repeat = settings.repeat;
          playing = true;
          index = Carousel.index();
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

      if( settings.autoplay ) {
        Carousel.play();
      }

      Carousel.on( 'max', function( event ) {
        event.stopPropagation();
        if( playing && repeat >= -1 ) {
          repeat -= 1;
          Carousel.first();
        } else if ( playing && repeat <= -1 ){
          Carousel.pause();
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