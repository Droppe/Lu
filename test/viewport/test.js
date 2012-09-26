function execute(){
  var PagingList = $( '#list-paging' ).lu( 'getComponent', 'List' ).instance,
    SlidingList = $( '#list-sliding' ).lu( 'getComponent', 'List' ).instance,
    PagingCarousel = $( '#carousel-paging' ).lu( 'getComponent', 'Carousel' ).instance,
    SlidingCarousel = $( '#carousel-sliding' ).lu( 'getComponent', 'Carousel' ).instance;

  QUnit.module( 'List Viewport Decorator Test' );

  QUnit.asyncTest( 'paging', function(){
    PagingList.trigger('next');
    ok(PagingList.index() === 5);
    PagingList.trigger('next');
    ok(PagingList.index() === 9);
    ok(PagingList.hasNext() === false);
    PagingList.trigger('previous');
    ok(PagingList.index() === 4);
    PagingList.trigger('previous');
    ok(PagingList.index() === 0);
    ok(PagingList.hasPrevious() === false);
    start();
  } );

  QUnit.asyncTest( 'sliding', function(){
    ok(SlidingList.hasPrevious() === false);
    SlidingList.trigger('next');
    ok(SlidingList.index() === 1);
    SlidingList.select(4);
    ok(SlidingList.index() === 4);
    SlidingList.select(13);
    ok(SlidingList.hasNext() === false);
    SlidingList.trigger('previous');
    ok(SlidingList.index() === 12);
    ok(SlidingList.hasNext() === true);
    ok(SlidingList.hasPrevious() === true);
    start();
  } );

  QUnit.module( 'Carousel Viewport Decorator Test' );

  QUnit.asyncTest( 'paging', function(){
    PagingCarousel.trigger('next');
    ok(PagingCarousel.index() === 5);
    PagingCarousel.trigger('next');
    ok(PagingCarousel.index() === 9);
    ok(PagingCarousel.hasNext() === true);
    PagingCarousel.trigger('next');
    ok(PagingCarousel.index() === 0);
    ok(PagingCarousel.hasPrevious() === true);
    PagingCarousel.trigger('previous');
    ok(PagingCarousel.index() === 9);
    start();
  } );

  QUnit.asyncTest( 'sliding', function(){
    SlidingCarousel.trigger('next');
    ok(SlidingCarousel.index() === 1);
    SlidingCarousel.select(4);
    ok(SlidingCarousel.index() === 4);
    SlidingCarousel.select(13);
    ok(SlidingCarousel.hasNext() === true);
    SlidingCarousel.trigger('next');
    ok(SlidingCarousel.index() === 0);
    ok(SlidingCarousel.hasPrevious() === true);
    SlidingCarousel.trigger('previous');
    ok(SlidingCarousel.index() == 13);
    start();
  } );
}
