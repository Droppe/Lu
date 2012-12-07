/**
 * Positions a Tip to the right of the decorated element.
 * @class rightDecorator
 * @uses Tip
 */

function rightDecorator(settings) {

  return function( base ) {
    var self = this;

  /**
   * Gets the position of the tip
   * @method calcPosition
   * @param {Number} offset The offset value
   * @param {Number} height The height value
   * @param {Number} width The width value
   * @param {Object} settings The instance's settings object containing config values
   * @return {Object} position And object containing a top and left
   * @private
   */  
    this.calcPosition = function(offset, height, width, settings) {
      return {
        top: offset.top + height / 2 - self.$tip.outerHeight() / 2,
        left: offset.left + width + settings.offsetLeft
      };
    };
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( rightDecorator );
  } else if( module.exports ){
    module.exports = rightDecorator;
  }
}