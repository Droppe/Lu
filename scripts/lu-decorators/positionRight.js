var positionRight = function () {
  
  /**
   * The cached position of the tip
   * @property position
   * @type Object
   * @private
   */
  var position;
  
  
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
        left: offset.left + width + settings.offsetLeft
      };
      
    };
    

  };
};

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( positionRight() );
  } else if( module.exports ){
   module.exports = positionRight();
  }
}