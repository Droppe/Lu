var positionLeft = function () {
  
  
  return function( instance ){
    /**
     * Calculates the position of the tip
     * @method calcPosition
     * @param {Object} offset jQuery object of the element's current coordinates
     * @param {Number} height element outer height
     * @param {Number} width
     * @param {Object} settings tip instance settings
     * @private
     */
    instance.calcPosition = function (offset, height, width, settings) {
      return {
        top: offset.top + height / 2 - instance.$tip.outerHeight() / 2,
        left: offset.left - instance.$tip.outerWidth() - settings.offsetLeft
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