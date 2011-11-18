var id = 'ui:Button:Pause',
  Class = li.require( 'libraries/ptclass' ),
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
PreviousButton =  Class.create( Button, {
   initialize: function( $super, $element, settings ) {
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
        action: 'previous'
      };

    settings = _.extend( settings, defaults );
    $super( $element, settings );

  }
} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = PreviousButton;
}

