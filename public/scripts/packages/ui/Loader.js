var id = 'ui/Loader',
	Abstract = li.require( 'ui/Abstract' ),
	Loader;

/**
 * A generic component which handles XHR requests to fetch new content.
 * @class Loader
 * @constructor
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
Loader = Abstract.extend( function ( element, settings ){
  /**
   * Instance of Loader
   * @property Loader
   * @type Object
   */
	var Loader = this,
  /**
   * Default configuration values
   * @property defaults
   * @type Object
   */
	defaults = {
		event: 'click',
			parameters: []
		},
	/**
	 * The custom event to broadcast
	 * @property out
	 * @type Object
	 */
	out;

	settings = _.extend( defaults, settings );

	out =  settings.out;

	element.bind( settings.event, function ( event ) {
		Loader.send( out );
	} );

} );

if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = Loader;
}