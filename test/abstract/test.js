Lu.map( $( '[data-lu~=Abstract]' ), 'Abstract', function(){} );

function execute(){
  var Abstract,
    Observer,
    $abstract = $( '#abstract-test' ),
    $observer = $( '#funk-and-waggle' ),
    hongKong = 'phooey';

  Abstract = $abstract.lu( 'getComponents' ).Abstract.instance;
  Observer = $observer.lu( 'getComponents' ).Abstract.instance;

  asyncTest( 'trigger', function(){
    expect( 1 );
    Abstract.one( hongKong, function(){
      ok( true, 'Event is successfully triggered.' );
    } ).trigger( hongKong );
    start();
  } );

  asyncTest( 'on', function(){
    var success = false;

    expect( 1 );

    Abstract.on( hongKong, function(){
      success = ( _.indexOf( Abstract.events(), 'lu:' + hongKong ) > -1 );
      Abstract.off( hongKong );
    } ).trigger( hongKong );

    ok( success , 'Event is successfully bound.' );
    start();
  } );

  asyncTest( 'one', function(){
    var success = false;

    expect( 1 );

    Abstract.one( hongKong, function(){
      success = ( _.indexOf( Abstract.events(), 'lu:' + hongKong ) === -1 );
      ok( success , 'Event is successfully unbound.' );
    } ).trigger( hongKong );
    start();
  } );

  asyncTest( 'off', function(){
    var success = false;

    expect( 2 );

    Abstract.on( hongKong, function(){
      success = ( _.indexOf( Abstract.events(), 'lu:' + hongKong ) > -1 );
      ok( success , 'Event is successfully bound.' );
      Abstract.off( hongKong );
      success = ( _.indexOf( Abstract.events(), 'lu:' + hongKong ) === -1 );
      ok( success , 'Event is successfully unbound.' );
    } ).trigger( hongKong );
    start();
  } );

  asyncTest( 'observe', function(){
    var success;
    expect( 1 );
    Observer.one( hongKong, function(){
      success = true;
      ok( success, 'observation successful' );
    } );
    Observer.observe( $abstract );
    Abstract.trigger( hongKong );
    Observer.unobserve( $observer );
    start();
  } );

  asyncTest( 'unobserve', function(){
    var success = false;
    expect( 2 );
    Observer.on( hongKong, function(){
      success = true;
      ok( success, 'observation successful' );
    } );

    Observer.observe( $abstract );
    Abstract.trigger( hongKong );
    Observer.unobserve( $abstract );

    success = false;
    Abstract.trigger( hongKong );
    Abstract.off( hongKong );

    ok( !success, 'unobservation successful' );
    start();
  } );
}
