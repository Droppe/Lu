var positionLeft = function () {
  
  
  return function( instance ){
    /**
     * Calculates the position of the tip
     * @method calcPosition
     * @param {Object} offset
     * @param {Number} height
     * @param {Number} width
     * @param {Object} settings tip instance settings
     * @private
     */
    instance.calcPosition = function (offset, height, width, settings) {
      return {
        top: offset.top + height / 2 - instance.$tip.height() / 2,
        left: offset.left - instance.$tip.width() - settings.offsetLeft
      };
    };

  };
};

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( positionLeft() );
  } else if( module.exports ){
   module.exports = positionLeft();
  }
}