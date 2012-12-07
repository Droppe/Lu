/**
 * Positions a Tip above the decorated element.
 * @class aboveDecorator
 * @uses Tip
 */


function aboveDecorator(settings) {

  return function( base ){
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
        top: offset.top - self.$tip.outerHeight() - settings.offsetTop,
        left: offset.left + width / 2 - self.$tip.outerWidth() / 2 - settings.offsetLeft
      };
    };
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( aboveDecorator );
  } else if( module.exports ){
    module.exports = aboveDecorator;
  }
}