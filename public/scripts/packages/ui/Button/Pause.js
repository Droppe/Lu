var id = 'ui:Button:Pause',
  Abstract = li.require( 'ui/Abstract' ),
  Button = li.require( 'ui/Button' ),
  NextButton;

/**
 * Representation of a button element
 * @class NextButton
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
NextButton = Abstract.extend( function ( $element, settings ){
/**
 * Instance of Next
 * @property NextButton
 * @type Object
 */
  var NextButton = this,
    /**
     * Default configuration values
     * @property defaults
     * @type Object
     */
    defaults = {
      on: 'click',
      action: 'pause'
    };

  settings = _.extend( defaults, settings );

  return new Button( $element, settings );

} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = NextButton;
}

