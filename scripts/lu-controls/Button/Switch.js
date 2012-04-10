/**
* Representation of a button element preconfigured with a 'switch' event
* @class SwitchButton
* @constructor
* @extends Button
* @requires ptclass
* @param {HTMLElement} element The HTML element surrounded by the control
* @param {Object} settings Configuration properties for this instance
* @version 0.1
*/
var Class = require( 'class' ),
  Button = require( 'lu/Button' ),
  SwitchButton;

SwitchButton = Class.create( Button, ( function () {

  var SWITCH_EVENT = 'switch',
    SWITCHED_EVENT = 'switched';

  // RETURN METHODS OBJECT
  return {
   /**
    * PTClass constructor
    * @method initialize
    * @public
    * @param {Object} $super Pointer to superclass constructor
    * @param {Object} $element JQuery object for the element wrapped by the component
    * @param {Object} settings Configuration settings
    */

    initialize: function ( $super, $element, settings ) {
      
      // PRIVATE INSTANCE PROPERTIES
      /**
       * Instance of Button
       * @property Button
       * @type Object
       * @private
       */
       var SwitchButton = this,
        /**
         * Default configuration values
         * @property defaults
         * @type Object
         * @private
         * @final
         */
        defaults = {
          action: 'switch'
        },
        states;
      
      if( typeof settings.states === 'string' ){
        settings.states = settings.states.split( ',' );
      }
      
      states = settings.states;
      
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );
      
      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      SwitchButton.on( SWITCHED_EVENT, function( event, $subject, state, meta ){
        var switches = [];
        _.each( state, function( item, index ) {
          item = item.split( ' ' );
          _.each( item, function( item, index ){
            $element.removeClass( 'lu-switch-' + item );
            if( _.indexOf( states, item ) !== -1 ){
              switches.push( item );
            }
          } );
        } );

        if( states.length === 1 && switches.length === 1 ){
          SwitchButton.disable();
        } else {
          SwitchButton.enable();
        }

        event.stopPropagation();

      } );

    }

  };

}() ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( SwitchButton );
  } else if( module.exports ) {
    module.exports = SwitchButton;
  }
}
