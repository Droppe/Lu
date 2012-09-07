var constants = require( 'lu/constants' );

/**
 * Decorates the Button to listen for the 'selected' event and
 * to intelligently disable or enable itself
 * based upon the item selected. This is used in
 * conjunction with the default decorator
 * @method first
 * @private
 */
function firstDecorator( settings ) {

  return function( base ){
    var self = this;

    this.on( constants.events.SELECTED, function( event, Component ){
      event.stopPropagation();
      if( Component.index() === 0 ){
        self.disable();
      } else {
        self.enable();
      }
    } );
  };

}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( firstDecorator );
  } else if( module.exports ){
    module.exports = firstDecorator;
  }
}