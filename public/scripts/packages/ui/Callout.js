var id = 'ui/Callout',
	Abstract = require( 'ui/Abstract' ),
	Callout;

Callout = Abstract.extend( function ( element, settings ){
	var Callout = this,
		defaults = {};

	settings = _.extend( defaults, settings );

	element.data( id, this );

} );

// EXPORT TO ATHENA FRAMEWORK
if( module && module.exports ) {
  module.exports = Callout;
}