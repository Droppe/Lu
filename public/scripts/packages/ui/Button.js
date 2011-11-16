var id = 'ui:Button',
  Class = li.require( 'libraries/ptclass' ),
  Abstract = li.require( 'ui/Abstract' ),
  Button;

/**
 * Representation of a button element
 * @class Button
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */ 
Button = Class.create(Abstract, {
  initialize: function ($super, $element, settings){

    /**
     * Instance of Button
     * @property Button
     * @type Object
     */
    var Button = this,
    /**
     * Default configuration values
     * @property defaults
     * @type Object
     */
    defaults = {
      on: 'click'
    },
    /**
     * Custom event name
     * @property action
     * @type Object
     */
    action;

    settings = _.extend( defaults, settings );
    $super($element, settings );



    action = settings.action;

    $element.on( settings.on, function ( event ) {
      Button.trigger( action );
      _.log("Button " + event.type + " " + action);
    } );
  }
  
} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Button;
}

