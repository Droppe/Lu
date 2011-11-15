var id = 'ui/Carousel',
	List = li.require( 'ui/List' ),
	Carousel;

/**
 * Description
 * @class Carousel
 * @constructor
 * @param {HTMLElement} $element The JQuery node representing the Carousel's container
 * @param {Object} settings Configuration properties
 */
Carousel = List.extend( function ( $element, settings ){
	var Carousel = this,
		defaults = {
		  items: $("li", $element)
		};
  
	settings = _.extend( defaults, settings );
  
  if ( settings.items ) {
    Carousel.setItems(settings.items);
  }
  
});

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Carousel;
}