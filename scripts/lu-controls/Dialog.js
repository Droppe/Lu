/**
 * Representation of a Dialog
 * @class Dialog
 * @constructor
 * @extends Abstract
 * @require class
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 * @version 0.0.0
 */
var Class = require( 'class' ),
    Abstract = require( '/scripts/lu-controls/Abstract' ),
    Dialog;

Dialog = Class.extend( function (Abstract) {

  //Observed events 
  var OPEN_EVENT = 'open',
      CLOSE_EVENT = 'close',
      //Stateful published events
      OPENED_EVENT = 'opened',
      CLOSED_EVENT = 'closed';

  return {

    /**
     * Class constructor 
     * @method init
     * @public
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */    
    init: function ( $element, settings ){

      var Dialog = this,
        defaults = {},
        open = false;

      //MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      Abstract.call.init( this,$element, settings );

      /**
       * Open the dialog
       * @method open
       */
        Dialog.open = function(){
          if( open === false ){
            $element.addClass( 'lu-dialog-open' );
            open = true;
            Dialog.trigger( OPENED_EVENT, Dialog );
          }
        };

        /**
         * Close the dialog
         * @method close
         */
        Dialog.close = function(){
          if( open === true ){
            $element.removeClass( 'lu-dialog-open' );
            open = false;
            Dialog.trigger( CLOSED_EVENT, Dialog );
          }
        };

        //Listen to theese events from other controls
        Dialog.on( CLOSE_EVENT, function( event ){
          event.stopPropagation();
          Dialog.close();
        } );

        Dialog.on( OPEN_EVENT, function( event ){
          event.stopPropagation();
          Dialog.open();
        } );

    }

  };

});

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Dialog );
  } else if( module.exports ){
   module.exports = Dialog; 
  }
}