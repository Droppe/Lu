var id = 'ui/Dropdown',
	Abstract = li.require( 'ui/Abstract' ),
	Callout;

Dropdown = Abstract.extend( function ( element, settings ){
	var Dropdown = this,
		defaults = {};

	settings = _.extend( defaults, settings );

	element.data( id, this );

} );

if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = Dropdown;
}