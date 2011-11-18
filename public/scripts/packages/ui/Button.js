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
 * @requires ptclass, Abstract
 */ 
Button = Class.create( Abstract, ( function () {

  // GLOBAL STATICS

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
    initialize: function ( $super, $element, settings ){

      // PRIVATE INSTANCE PROPERTIES

      /**
       * Default configuration values for all instances
       * @property globalDefaults
       * @type Object
       * @private
       * @final
       */
      var defaults = {
        on: 'click'
      },
      /**
       * Instance of Button
       * @property Button
       * @type Object
       * @private
       */
      self,
      /**
       * Target item used in event data
       * @property action
       * @type Object
       * @private
       */
      item,
       /**
        * Custom event name
        * @property action
        * @type Object
        * @private
        */
      action;
       
       
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // Try to figure out what to select...
      if( action === 'select' ) {
        if( settings.item ) {
          item = ( typeof settings.item === 'number' ) ? settings.item : $( settings.item );
        } else {
          item = $( 'li', $element.closest( 'ul, ol' ) ).index( $element.closest( 'li' )[ 0 ] );
        }
      }

      action = settings.action;

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
       
      // EVENT BINDINGS
      $element.on( settings.on, function ( event ) {
        if( item ) {
          $element.trigger( action, [ item ] );
          _.log("Button " + action);
        } else {
          $element.trigger( action );
          _.log("Button " + action);
        }
      } );
    }
  };

}() ));

// Export to Athena Framework
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Button;
}

