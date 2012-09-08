function execute(){
  var $lu = $( '#lu' ),
    $observer = $( '#observer' ),
    $parent = $( '#parent' ),
    $deep = $( '#deep' ),
    Switch = $lu.lu( 'getComponents' ).Switch.instance,
    Observer = $observer.lu( 'getComponents' ).Switch.instance,
    evently = 'KIRdoubleLOS';

  asyncTest( 'observe', function(){
    expect( 1 );
    $lu.lu( 'observe', $observer );
    ok( $lu.data( '$observers' ).is( $observer ), '$observer is successfully added' );
    start();
  } );

  asyncTest( 'unobserve', function(){
    expect( 1 );
    $lu.lu( 'unobserve', $observer );
    ok( !$lu.data( '$observers' ).is( $observer ), '$observer is successfully removed' );
    start();
  } );

  asyncTest( 'notify', function(){
    expect( 1 );
    $lu.lu( 'observe', $observer );
    Observer.one( evently, function(){
      ok( true, 'Notification Successful' );
    } )
    Switch.trigger( evently );
    start();
  } );

  asyncTest( 'getComponents', function(){
    expect(  );
    ok( typeof $lu.lu( 'getComponents' ) === 'object', 'Component is an object.' );
    ok( $lu.lu( 'getComponents' ).Switch, 'Component is defined.' );
    ok( $lu.lu( 'getComponents' ).Foo === undefined, 'Component is not defined.' );
    start();
  } );

  asyncTest( 'getComponent', function(){
    expect( 2 );
    ok( $lu.lu( 'getComponent', 'Switch' ), 'Component is defined.' );
    ok( $lu.lu( 'getComponent', 'Foo' ) === undefined, 'Component is not defined.' );
    start();
  } );

  asyncTest( 'getParents', function(){
    expect( 2 );
    ok( $lu.lu( 'getParents' ).length === 1, 'The correct number of parents are found.' );
    ok( $lu.lu( 'getParents' ).is( $parent ), 'The parent nodes mapped are returned' );
    start();
  } );

  asyncTest( 'getDescendants', function(){
    expect( 3 );
    ok( $lu.lu( 'getDescendants' ).length === 1, 'The correct number of descendants are found.' );
    ok( $parent.lu( 'getDescendants' ).length === 3, 'The correct number of descendants are found.' );
    ok( $parent.lu( 'getDescendants' ).is( $lu ) && $parent.lu( 'getDescendants' ).is( $deep ) && $parent.lu( 'getDescendants' ).is( $observer ), 'The mapped descendant nodes are returned' );
    start();
  } );

  asyncTest( 'getChildren', function(){
    expect( 3 );
    ok( $lu.lu( 'getChildren' ).length === 1, 'The correct number of children are found.' );
    ok( $parent.lu( 'getChildren' ).length === 2, 'The correct number of children are found.' );
    ok( $parent.lu( 'getChildren' ).is( $lu ) && $parent.lu( 'getDescendants' ).is( $observer ), 'The mapped descendant nodes are returned' );
    start();
  } );

}
