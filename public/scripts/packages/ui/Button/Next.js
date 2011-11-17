var id = 'ui:Button:Next',
  Class = li.require( 'libraries/ptclass' ),
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
NextButton = Class.create( Button, {
  initialize: function( $super, $element, settings ) {
    /**
     * Instance of NextButton
     * @property NextButton
     * @type Object
     */
    var NextButton,
      /**
       * Default configuration values
       * @property defaults
       * @type Object
       */
      defaults = {
        action: 'next'
      };

    settings = _.extend( defaults, settings );
    $super( $element, settings );

  }
} );

if( typeof module !== 'undefined' && module.exports ) {
  module.exports = NextButton;
}