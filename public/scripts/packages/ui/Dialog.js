var id = 'ui/Dialog',
	Abstract = require( 'ui/Dialog' ),
	Callout;

Dialog = Abstract.extend( function ( element, settings ){
	var Dialog = this,
		defaults = {};

	settings = _.extend( defaults, settings );

	element.data( id, this );

} );

// EXPORT TO ATHENA FRAMEWORK
Athena.exports(module, Dialog);