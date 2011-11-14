var id = 'ui/Tabs',
	Abstract = li.require( 'ui/Tabs' ),
	Callout;

Tabs = Abstract.extend( function ( element, settings ){
	var Tabs = this,
		defaults = {};

	settings = _.extend( defaults, settings );

	element.data( id, this );

} );

if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = Tabs;
}