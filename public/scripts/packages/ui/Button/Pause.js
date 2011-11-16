var id = 'ui:Button:Pause',
  Class = li.require( 'libraries/ptclass' ),
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
PauseButton =  Class.create( {
   initialize: function( $element, settings ) {
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
        action: 'pause'
      };

    settings = _.extend( defaults, settings );
    $super( $element, settings );

  }

} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = PauseButton;
}

