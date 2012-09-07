function execute(){
  var $lu = $( '#lu' ),
    $observer = $( '#observer' );

  asyncTest( 'observe', function(){
    expect( 1 );
    $lu.lu( 'observe', $observer )
    ok( $lu.data( '$observers' ).is( $observer ), '$observer is successfully added' );
    start();
  } );

  //  asyncTest( 'unobserve', function(){
  //   expect( 1 );
  //   ok( false );
  //   start();
  // } );

  // asyncTest( 'notify', function(){
  //   expect( 1 );
  //   ok( false );
  //   start();
  // } );

  // asyncTest( 'getComponents', function(){
  //   expect( 1 );
  //   ok( false );
  //   start();
  // } );

  // asyncTest( 'getParents', function(){
  //   expect( 1 );
  //   ok( false );
  //   start();
  // } );

  // asyncTest( 'getDescendants', function(){
  //   expect( 1 );
  //   ok( false );
  //   start();
  // } );

  // asyncTest( 'getChildren', function(){
  //   expect( 1 );
  //   ok( false );
  //   start();
  // } );

}
