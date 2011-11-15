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
    myList,
    defaults = {
      panels: ".panel",
      items: $( '.panel > li' )
    };

  settings = _.extend( defaults, settings );

  myList = new List( $element, settings );


/*
  Carousel.next = function () {
    var index = myList.index(),
      size = myList.size,
      next = index + 1;
      
    if (next >= size) {
      myList.first();
    }
    else {
      myList.select(index + 1);
    }
  };
  
  Carousel.previous = function () {
    var index = Carousel.selectedIndex,
      size = myList.size,
      next = index - 1;
      
    if (next < 0) {
      myList.last();
    }
    else {
      myList.select(next);
    }
  };
  
  Carousel.first = function () {
    myList.select(0);
  };
  
  Carousel.last = function () {
    myList.select(Carousel.size - 1);    
  };
  
  
  // Observes these custom events
  $element.on('next', function (event) {
    Carousel.next();
    event.stopPropagation();
  });

  $element.on('previous', function (event) {
    Carousel.previous();
    event.stopPropagation();
  });
*/

} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Carousel;
}