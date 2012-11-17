/**
 * Positions a Tip to the left of the decorated element.
 * @class leftDecorator
 * @uses Tip
 */

function leftDecorator(settings) {

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
        left: offset.left - self.$tip.outerWidth() - settings.offsetLeft
      };
    };
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( leftDecorator );
  } else if( module.exports ){
    module.exports = leftDecorator;
  }
}