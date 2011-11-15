var id = 'ui:Button:Next',
  Class = li.require( 'libraries/ptclass' ),
  Abstract = li.require( 'ui/Abstract' ),
  Button = li.require( 'ui/Button' ),
  NextButton;

/**
 * Representation of a button element
 * @class PauseButton
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
NextButton = Class.create( {
  initialize: function ( $element, settings ){
    /**
     * Instance of NextButton
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
      action: 'next'
    };

    settings = _.extend( defaults, settings );

    return new Button( $element, settings );
  }
} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = NextButton;
}

