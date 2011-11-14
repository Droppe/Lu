var id = 'ui:Button:Previous',
  Abstract = li.require( 'ui/Abstract' ),
  Button = li.require( 'ui/Button' ),
  PreviousButton;

/**
 * Representation of a button element
 * @class PreviousButton
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
PreviousButton = Abstract.extend( function ( $element, settings ){
/**
 * Instance of PreviousButton
 * @property PreviousButton
 * @type Object
 */
  var PreviousButton = this,
    /**
     * Default configuration values
     * @property defaults
     * @type Object
     */
    defaults = {
      on: 'click',
      action: 'previous'
    };

  settings = _.extend( defaults, settings );

  return new Button( $element, settings );

} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = PreviousButton;
}

