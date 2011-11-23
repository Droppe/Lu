var id = 'ui/Callout',
	Abstract = require( 'ui/Abstract' ),
	Callout;

Callout = Abstract.extend( function ( element, settings ){
	var Callout = this,
		defaults = {};

	settings = _.extend( defaults, settings );

	element.data( id, this );

} );

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Callout;
}