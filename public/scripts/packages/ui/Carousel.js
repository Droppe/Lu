var id = 'ui/Carousel',
  Abstract = li.require( 'ui/Abstract' ),
  List = li.require( 'ui/List' ),
  Carousel;

/**
 * Description
 * @class Carousel
 * @constructor
 * @param {HTMLElement} element The DOM node representing the Carousel's container
 * @param {Object} settings Configuration properties
 */
Carousel = Abstract.extend( function ( $element, settings ){
  var Carousel = this,
    defaults = {
      pannels: '.pannel'
    };

  settings = _.extend( defaults, settings );

  settings.items = $( '.pannel > li' );

  return new List( $element, settings );

} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Carousel;
}