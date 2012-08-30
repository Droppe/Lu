function execute(){

  var $container = $( '#container' );

  module( 'API Tests', {} );

  test( 'map', function(){
    Lu.map( $container, function( $element ){
      expect( 4 );
      ok( this.deferral, 'Deferral setup on component.' );
      ok( this.settings, 'Settings hook available.')
      ok( $element.is( $container ), '$element parameter is correct' );
      ok( $element.is( Lu.$mapped ), '$element is properly mapped.' );
    } );
  } );

}
