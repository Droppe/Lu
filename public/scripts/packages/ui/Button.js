var Class = li.require( 'libraries/ptclass' ),
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
Button = Class.create( Abstract, ( function(){
  
  // Private Static Attributes

  /**
   * Default configuration values
   * @property defaults
   * @type Object
   */
   var defaults = {
     on: 'click'
   };

  // Return methods object
  return {
    initialize: function ( $super, $element, settings ){
      /**
       * Instance of Button
       * @property Button
       * @type Object
       */
      var Button = this,
      /**
       * Custom event name
       * @property action
       * @type Object
       */
      action,
      /**
       * Target item used in event data
       * @property action
       * @type Object
       */
      item;

      _.defaults( settings, defaults );

      action = settings.action;

      //try to figure out what to select...
      if( action === 'select' ) {
        if( settings.item ) {
          item = ( typeof settings.item === 'number' ) ? settings.item : $( settings.item );
        } else {
          item = $( 'li', $element.closest( 'ul, ol' ) ).index( $element.closest( 'li' )[ 0 ] );
        }
      }

      $super( $element, settings );

      $element.on( settings.on, function ( event ) {
        if( item ) {
          Button.trigger( action, [ item ] );
          _.log("Button " + action);
        } else {
          Button.trigger( action );
          _.log("Button " + action);
        }
      } );
    } 
  };
} ) );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Button;
}

