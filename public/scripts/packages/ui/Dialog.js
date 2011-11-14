var id = 'ui/Dialog',
	Abstract = li.require( 'ui/Dialog' ),
	Callout;

Dialog = Abstract.extend( function ( element, settings ){
	var Dialog = this,
		defaults = {};

	settings = _.extend( defaults, settings );

	element.data( id, this );

} );

if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = Dialog;
}