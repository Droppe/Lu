function execute(){
  var Carousel = $( '#A' ).lu( 'getComponent', 'Carousel' ).instance,
    selected = 'lu-state-selected';

  QUnit.module( 'API Tests' );

  QUnit.asyncTest( 'play', function(){
    Carousel.pause();
    ok( Carousel.play );
    ok( Carousel.play().hasState( 'playing' ), 'The Carousel is playing' );
    start();
  } );

  QUnit.asyncTest( 'pause', function(){
    Carousel.play();
    ok( Carousel.pause );
    ok( Carousel.pause().hasState( 'paused' ), 'The Carousel is paused' );
    start();
  } );

  QUnit.asyncTest( 'hasNext', function(){
    expect( 2 );
    ok( Carousel.hasNext );
    ok( Carousel.hasNext() );
    start();
  } );

  QUnit.asyncTest( 'hasPrevious', function(){
    expect( 2 );
    ok( Carousel.hasPrevious );
    ok( Carousel.hasPrevious() );
    start();
  } );

  QUnit.asyncTest( 'next', function(){
    expect( 4 );
    Carousel.select( 0 );
    ok( Carousel.next );
    ok( Carousel.next().index() === 1 );
    ok( Carousel.next().index() === 2 );
    ok( Carousel.next().index() === 0 );
    start();
  } );

  QUnit.asyncTest( 'previous', function(){
    expect( 4 )
    Carousel.select( 2 );
    ok( Carousel.previous );
    ok( Carousel.previous().index() === 1 );
    ok( Carousel.previous().index() === 0 );
    ok( Carousel.previous().index() === 2 );
    start();
  } );

  QUnit.module( 'Event Tests' );

  QUnit.asyncTest( 'play', function(){
    expect( 1 );
    Carousel.pause();
    Carousel.trigger( 'play' );
    ok( Carousel.hasState( 'playing' ), 'event handled correctly' );
    start();
  } );

  QUnit.asyncTest( 'pause', function(){
    expect( 1 );
    Carousel.play();
    Carousel.trigger( 'pause' );
    ok( Carousel.hasState( 'paused' ), 'event handled correctly' );
    start();
  } );

  QUnit.asyncTest( 'next', function(){
    expect( 1 );
    Carousel.play();
    Carousel.trigger( 'pause' );
    ok( Carousel.hasState( 'paused' ), 'event handled correctly' );
    start();
  } );

  QUnit.asyncTest( 'previous', function(){
    expect( 1 );
    Carousel.play();
    Carousel.trigger( 'pause' );
    ok( Carousel.hasState( 'paused' ), 'event handled correctly' );
    start();
  } );

  QUnit.asyncTest( 'first', function(){
    expect( 1 );
    Carousel.play();
    Carousel.trigger( 'pause' );
    ok( Carousel.hasState( 'paused' ), 'event handled correctly' );
    start();
  } );

  QUnit.asyncTest( 'last', function(){
    expect( 1 );
    Carousel.play();
    Carousel.trigger( 'pause' );
    ok( Carousel.hasState( 'paused' ), 'event handled correctly' );
    start();
  } );

  QUnit.asyncTest( 'select', function(){
    expect( 1 );
    Carousel.play();
    Carousel.trigger( 'pause' );
    ok( Carousel.hasState( 'paused' ), 'event handled correctly' );
    start();
  } );

  QUnit.module( 'Statefulness' );

  QUnit.asyncTest( 'playing', function(){
    expect( 1 );
    ok( Carousel.pause().play().hasState( 'playing' ), 'correct state applied' );
    start();
  } );

  QUnit.asyncTest( 'paused', function(){
    expect( 1 );
    ok( Carousel.play().pause().hasState( 'paused' ), 'correct state applied' );
    start();
  } );

}
