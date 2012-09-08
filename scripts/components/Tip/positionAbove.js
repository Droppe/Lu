var positionAbove = function () {

  
  return function( instance ){

    /**
     * Calculates the position of the tip
     * @method calcPosition
     * @param {Object} offset jQuery object of the element's current coordinates
     * @param {Number} height element outer height
     * @param {Number} width element outer width
     * @param {Object} settings tip instance settings
     * @private
     */
    instance.calcPosition = function (offset, height, width, settings) {
      return {

        top: offset.top - instance.$tip.outerHeight() - settings.offsetTop,
        left: offset.left + width / 2 - instance.$tip.outerWidth() / 2 - settings.offsetLeft

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
