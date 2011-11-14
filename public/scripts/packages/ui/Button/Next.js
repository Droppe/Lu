var id = 'ui:Button:Next',
  Abstract = li.require( 'ui/Abstract' ),
  Button = li.require( 'ui/Button' ),
  PauseButton;

/**
 * Representation of a button element
 * @class PauseButton
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
PauseButton = Abstract.extend( function ( $element, settings ){
/**
 * Instance of PauseButton
 * @property PauseButton
 * @type Object
 */
  var PauseButton = this,
    /**
     * Default configuration values
     * @property defaults
     * @type Object
     */
    defaults = {
      on: 'click',
      action: 'next'
    };

  settings = _.extend( defaults, settings );

  return new Button( $element, settings );

} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = PauseButton;
}

