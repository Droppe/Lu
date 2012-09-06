function execute(){

  var $container = $( '#container' );

  module( 'API Tests', {} );

  asyncTest( 'map', function(){
    expect( 3 );
    Lu.map( $container, 'Abstract', function( $element ){
      ok( this.deferral, 'Deferral setup on component.' );
      ok( this.settings, 'Settings hook available.')
      ok( $element.is( $container ), '$element parameter is correct' );
    } );
    start();
  } );

}
