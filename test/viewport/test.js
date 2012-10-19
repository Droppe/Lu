function execute(){
  var PagingList = $( '#list-paging' ).lu( 'getComponent', 'List' ),
    SlidingList = $( '#list-sliding' ).lu( 'getComponent', 'List' ),
    PagingCarousel = $( '#carousel-paging' ).lu( 'getComponent', 'Carousel' ),
    SlidingCarousel = $( '#carousel-sliding' ).lu( 'getComponent', 'Carousel' );

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
      start();
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
      start();
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
      start();
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
      start();
    });
  } );
}
