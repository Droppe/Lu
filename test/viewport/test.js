function execute(){
  var PagingList = $( '#list-paging' ).lu( 'getComponent', 'List' ),
    PagingListPrevButton = $( '#list-paging-prev'),
    PagingListNextButton = $( '#list-paging-next'),
    SlidingList = $( '#list-sliding' ).lu( 'getComponent', 'List' ),
    SlidingListPrevButton = $( '#list-sliding-prev'),
    SlidingListNextButton = $( '#list-sliding-next'),
    PagingCarousel = $( '#carousel-paging' ).lu( 'getComponent', 'Carousel' ),
    PagingCarouselPrevButton = $( '#carousel-paging-prev'),
    PagingCarouselNextButton = $( '#carousel-paging-next'),
    SlidingCarousel = $( '#carousel-sliding' ).lu( 'getComponent', 'Carousel' ),
    SlidingCarouselPrevButton = $( '#carousel-sliding-prev'),
    SlidingCarouselNextButton = $( '#carousel-sliding-next');

  QUnit.module( 'List Viewport Decorator Test' );

  QUnit.asyncTest( 'paging', function(){
    PagingList.ready(function () {
      PagingList.instance.trigger('next');
      ok(PagingList.instance.index() === 5);
      PagingList.instance.trigger('next');
      ok(PagingList.instance.index() === 9);
      ok(PagingList.instance.hasNext() === false);
      PagingList.instance.trigger('previous');
      ok(PagingList.instance.index() === 4);
      PagingList.instance.trigger('previous');
      ok(PagingList.instance.index() === 0);
      ok(PagingList.instance.hasPrevious() === false);

      PagingListNextButton.lu('getComponent','Button').ready(function() {
        PagingList.instance.select(0);
        PagingListNextButton.click();
        ok(PagingList.instance.index() === 5);
      }); 
      PagingListPrevButton.lu('getComponent','Button').ready(function() {
        PagingList.instance.select(5);
        PagingListPrevButton.click();
        ok(PagingList.instance.index() === 0);
        start(); 
      });   
  });

    
  } );

  QUnit.asyncTest( 'sliding', function(){
    SlidingList.ready(function () {
      ok(SlidingList.instance.hasPrevious() === false);
      SlidingList.instance.trigger('next');
      ok(SlidingList.instance.index() === 1);
      SlidingList.instance.select(4);
      ok(SlidingList.instance.index() === 4);
      SlidingList.instance.select(13);
      ok(SlidingList.instance.hasNext() === false);
      SlidingList.instance.trigger('previous');
      ok(SlidingList.instance.index() === 12);
      ok(SlidingList.instance.hasNext() === true);
      ok(SlidingList.instance.hasPrevious() === true);

      SlidingListNextButton.lu('getComponent','Button').ready(function() {
        SlidingList.instance.select(0);
        SlidingListNextButton.click();
        ok(SlidingList.instance.index() === 1);
      }); 
      SlidingListPrevButton.lu('getComponent','Button').ready(function() {
        SlidingList.instance.select(1);
        SlidingListPrevButton.click();
        ok(SlidingList.instance.index() === 0); 
        start(); 
      }); 
    });
  } );

  QUnit.module( 'Carousel Viewport Decorator Test' );

  QUnit.asyncTest( 'paging', function(){
    PagingCarousel.ready(function() {
      PagingCarousel.instance.trigger('next');
      ok(PagingCarousel.instance.index() === 5);
      PagingCarousel.instance.trigger('next');
      ok(PagingCarousel.instance.index() === 9);
      ok(PagingCarousel.instance.hasNext() === true);
      PagingCarousel.instance.trigger('next');
      ok(PagingCarousel.instance.index() === 0);
      ok(PagingCarousel.instance.hasPrevious() === true);
      PagingCarousel.instance.trigger('previous');
      ok(PagingCarousel.instance.index() === 9);

      PagingCarouselNextButton.lu('getComponent','Button').ready(function() {
        PagingCarousel.instance.select(0);
        PagingCarouselPrevButton.click();
        ok(PagingCarousel.instance.index() === 9);
      }); 
      PagingCarouselPrevButton.lu('getComponent','Button').ready(function() {
        PagingCarousel.instance.select(9);
        PagingCarouselNextButton.click();
        ok(PagingCarousel.instance.index() === 0);
        start(); 
      }); 
    });
  } );

  QUnit.asyncTest( 'sliding', function(){
    SlidingCarousel.ready(function() {
      SlidingCarousel.instance.trigger('next');
      ok(SlidingCarousel.instance.index() === 1);
      SlidingCarousel.instance.select(4);
      ok(SlidingCarousel.instance.index() === 4);
      SlidingCarousel.instance.select(13);
      ok(SlidingCarousel.instance.hasNext() === true);
      SlidingCarousel.instance.trigger('next');
      ok(SlidingCarousel.instance.index() === 0);
      ok(SlidingCarousel.instance.hasPrevious() === true);
      SlidingCarousel.instance.trigger('previous');
      ok(SlidingCarousel.instance.index() == 13);
      
      SlidingCarouselNextButton.lu('getComponent','Button').ready(function() {
        SlidingCarousel.instance.select(0);
        SlidingCarouselPrevButton.click();
        ok(SlidingCarousel.instance.index() === 13);
      }); 
      SlidingCarouselPrevButton.lu('getComponent','Button').ready(function() {
        SlidingCarousel.instance.select(13);
        SlidingCarouselNextButton.click();
        ok(SlidingCarousel.instance.index() === 0);
        start(); 
      }); 
    });
  } );
}
