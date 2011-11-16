var id = 'ui:Button:Select',
  Class = li.require( 'libraries/ptclass' ),
  Abstract = li.require( 'ui/Abstract' ),
  Button = li.require( 'ui/Button' ),
  SelectButton;

/**
 * Representation of a button element
 * @class Select
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
Select =  Class.create( Button, {
   initialize: function( $super, $element, settings ) {
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
    $super( $element, settings );

  }
} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Select;
}