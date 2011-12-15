var Class = require( 'class' ),
  Button = require( 'athena/Button' ),
  SelectButton;

/**
 * Representation of a button element preconfigured with a 'next' event
 * @class SelectButton
 * @constructor
 * @extends Button
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
SelectButton = Class.create( Button, ( function () {

  var SELECTED_EVENT = 'selected';
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
      * Instance of PlayButton
      * @property PlayButton
      * @type Object
      * @private
      */
     var SelectButton = this,
     /**
      * Default configuration values
      * @property defaults
      * @type Object
      * @private
      * @final
      */
      defaults = {
        action: 'select'
      },
      controls;

     if( !settings.item && settings.item !== 0 ) {
       if( $element.is( 'button' ) ) {
         controls = $element.attr( 'aria-controls' );
       } else if ( $element.is( 'a' ) ) {
         controls = _.explodeURL( $element.attr( 'href' ) ).fragment;
       }
       if( controls ) {
         settings.item = $( '#' + controls );
       } else {
         settings.item = $( 'li', $element.closest( 'ul, ol' ) ).index( $element.closest( 'li' ) );
       }
     }

     // MIX THE DEFAULTS INTO THE SETTINGS VALUES
     _.defaults( settings, defaults );

     // CALL THE PARENT'S CONSTRUCTOR
     $super( $element, settings );

     SelectButton.on( SELECTED_EVENT, function( event, item, index ) {
       event.stopPropagation();
       _.log("Button::Select", item, index);
       if( item.is( settings.item ) || index === settings.item ) {
         SelectButton.disable();
       } else {
         SelectButton.enable();
       }
     } );
   }
  };
  
}() ) );

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( SelectButton );
  } else if( module.exports ) {
   module.exports = SelectButton; 
  }
}