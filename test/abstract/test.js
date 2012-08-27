Lu.map( $( '[data-lu~=Abstract]' ), 'Abstract', function(){} );

function execute(){
  var Abstract,
    Observer,
    $abstract = $( '#abstract-test' ),
    $observer = $( '#funk-and-waggle' ),
    hongKong = 'phooey';

  Abstract = $abstract.lu( 'getComponents' ).Abstract.instance;
  Observer = $observer.lu( 'getComponents' ).Abstract.instance;

  test( 'trigger', function(){
    expect( 1 );
    Abstract.one( hongKong, function(){
      ok( true , 'Event is successfully triggered.' );
    } ).trigger( hongKong );
  } );

  test( 'on', function(){
    var success = false;

    expect( 1 );

    Abstract.on( hongKong, function(){
      success = ( _.indexOf( Abstract.events(), 'lu:' + hongKong ) > -1 );
      Abstract.off( hongKong );
    } ).trigger( hongKong );

    ok( success , 'Event is successfully bound.' );
  } );

  test( 'one', function(){
    var success = false;

    expect( 1 );

    Abstract.one( hongKong, function(){
      success = ( _.indexOf( Abstract.events(), 'lu:' + hongKong ) === -1 );
      ok( success , 'Event is successfully unbound.' );
    } ).trigger( hongKong );
  } );

  test( 'off', function(){
    var success = false;

    expect( 2 );

    Abstract.on( hongKong, function(){
      success = ( _.indexOf( Abstract.events(), 'lu:' + hongKong ) > -1 );
      ok( success , 'Event is successfully bound.' );
      Abstract.off( hongKong );
      success = ( _.indexOf( Abstract.events(), 'lu:' + hongKong ) === -1 );
      ok( success , 'Event is successfully unbound.' );
    } ).trigger( hongKong );
  } );

  test( 'observe', function(){
    var success;
    expect( 1 );
    Abstract.one( hongKong, function(){
      success = true;
      ok( success, 'observation successful' );
    } );
    Abstract.observe( $observer );
    Observer.trigger( 'lu:' + hongKong );
    Abstract.unobserve( $observer );
  } );

  test( 'unobserve', function(){
    var success = false;
    expect( 2 );
    Abstract.on( hongKong, function(){
      success = true;
      ok( success, 'observation successful' );
    } );

    Abstract.observe( $observer );
    Observer.trigger( hongKong );

    Abstract.unobserve( $observer );

    success = false;
    Observer.trigger( hongKong );
    Abstract.off( hongKong );

    ok( !success, 'unobservation successful' );
  } );
}
