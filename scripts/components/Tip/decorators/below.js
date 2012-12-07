/**
 * Positions a Tip below the decorated element.
 * @class belowDecorator
 * @uses Tip
 */

function belowDecorator(settings) {

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
        top: offset.top + height + settings.offsetTop,
        left: offset.left + width / 2 - self.$tip.outerWidth() / 2 - settings.offsetLeft
      };
    };
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( belowDecorator );
  } else if( module.exports ){
    module.exports = belowDecorator;
  }
}