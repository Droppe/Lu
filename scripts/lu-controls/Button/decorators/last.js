var constants = require( 'lu/constants' );

/**
 * Decorates the Button to listen for the 'selected' event and
 * to intelligently disable or enable itself
 * based upon the item selected. This is used in
 * conjunction with the default decorator
 * @method last
 * @private
 */
function lastDecorator( settings ) {

  return function( base ){
    var self = this;

    self.on( constants.events.SELECTED, function( event, Control ){
      event.stopPropagation();
      if( Control.index === Control.size() - 1 ){
        instance.disable();
      } else {
        instance.enable();
      }
    } );
  };

}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( lastDecorator );
  } else if( module.exports ){
   module.exports = lastDecorator;
  }
}