var positionAbove = function () {
  
  
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

        top: offset.top - instance.$tip.height() - settings.offsetTop,
        left: offset.left + width / 2 - instance.$tip.width() / 2 - settings.offsetLeft

      };
    };
    
  };
};

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( positionAbove() );
  } else if( module.exports ){
   module.exports = positionAbove();
  }
}