var id = 'ui:Button:Select',
  Abstract = li.require( 'ui/Abstract' ),
  Select;

/**
 * Representation of a button element
 * @class Select
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
Select = Abstract.extend( function ( $element, settings ){
/**
 * Instance of Select
 * @property Select
 * @type Object
 */
  var Select = this,
    /**
     * Default configuration values
     * @property defaults
     * @type Object
     */
    defaults = {
      on: 'click',
      action: 'select'
    },
    item;

  settings = _.extend( defaults, settings );

  if( settings.item ) {
    item = ( typeof settings.item === 'number' ) ? settings.item : $( settings.item );
  } else {
    item = $( 'li', $element.closest( 'ul, ol' ) ).index( $element.closest( 'li' )[ 0 ] );
  }

  $element.on( settings.on, function ( event ) {
    Select.trigger( settings.action, [ item ] );
  } );

} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Select;
}

