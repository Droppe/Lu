var constants = require( 'lu/constants' );

/**
 * Decorates the Button to listen for the 'selected' event and
 * to intelligently disable or enable itself based upon
 * the control having a next item. This is used in
 * conjunction with the default decorator.
 * @method next
 * @private
 */
function nextDecorator( settings ){

  return function( base ){
    var self = this;

    instance.on( Constants.events.SELECTED, function( event, Control ){
      event.stopPropagation();
      if( Control.hasNext() ){
        instance.enable();
      } else {
        instance.disable();
      }
    } );
  };

}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( nextDecorator );
  } else if( module.exports ){
    module.exports = nextDecorator;
  }
}