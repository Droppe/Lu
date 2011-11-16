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
Carousel = Class.create(List, {
  initalize: function ( $super, $element, settings ){
  	var Carousel = this,
  		defaults = {
  		  items: $("li", $element)
  		};
      
      
    settings = _.extend( defaults, settings );
    $super($element, settings );
  
    console.dir(settings);
  
  
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
  
   } 
});

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Carousel;
}