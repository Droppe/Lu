/**
 * Representation of a Mask
 * @class Mask
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 * @version 0.0.0
 */
var Abstract = require( '/scripts/lu-controls/Abstract' ),
    Mask;

Mask = Abstract.extend( function (Abstract) {

  //Observed events 
  var SHOW_EVENT = 'show',
      HIDE_EVENT = 'hide',
      //Stateful published events
      SHOWN_EVENT = 'shown',
      HIDDEN_EVENT = 'hidden';

  return {
    /**
     * Constructor
     * @method init
     * @public
     * @param {Object} $element JQuery object for the element wrapped by
     * the component
     * @param {Object} settings Configuration settings
     */
    init: function ( $element, settings ){

      var Mask = this,
        defaults = {
          container: 'body'
        },
        shown,
        $container;

      //MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      Abstract.init.call( this, $element, settings );

      $container = $( settings.container );
      /**
       * Show the mask
       * @method open
       */
        Mask.show = function(){
          if( shown !== true ){
            $container.prepend( $element );
            $element.removeClass( 'lu-mask-hidden' ).addClass( 'lu-mask-shown' );
            shown = true;
            Mask.trigger( SHOWN_EVENT, Mask );
          }
        };

        /**
         * Hide the mask
         * @method close
         */
        Mask.hide = function(){
          if( shown !== false ){
            $( 'body' ).append(  $element );
            $element.removeClass( 'lu-mask-shown' ).addClass( 'lu-mask-hidden' );
            shown = false;
            Mask.trigger( HIDDEN_EVENT, Mask );
          }
        };

        //Listen to theese events from other controls
        Mask.on( settings.hide, function( event ){
          event.stopPropagation();
          Mask.hide();
        } );

        Mask.on( settings.show, function( event ){
          event.stopPropagation();
          Mask.show();
        } );

        Mask.hide();
    }

  };

});

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Mask );
  } else if( module.exports ){
   module.exports = Mask; 
  }
}