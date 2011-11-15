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
   
  //Since we can't call super(), we need to overwrite the List's items 
  if ( settings.items ) {
    Carousel.setItems(settings.items);
  }
  
  
  /**
   * Selects the next item in the list. 
   * @method next
   * @public
   * @return {Void}
   */
  Carousel.next = function() {
    if (Carousel.hasNext()) {
      Carousel.select( Carousel.index() + 1);
    }
    else {
      Carousel.first();
    }
  };

  /**
   * Selects the previous item in the list. 
   * @method previous
   * @public
   * @return {Void}
   */  
   Carousel.previous = function() {
     if (Carousel.hasPrevious()) {
       Carousel.select( Carousel.index() - 1);
     }
     else {
       Carousel.last();
     }
   };
  
  
});

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Carousel;
}