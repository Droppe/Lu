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
     * Used to determine the position of the tip
     * @private
     * @method getPosition
     * @param {Boolean} cache Uses the cached position by default or if set to true.
     * @return {Object} position And object containing a top and left
     */
    instance.getPosition = function ( cache, settings ){
      var elOffset = instance.$element.offset(),
        elHeight = instance.$element.height(),
        elWidth = instance.$element.width();

      if( position === undefined || cache === false ){
        position = {
	        top: elOffset.top + elHeight / 2 - instance.$tip.height() / 2,
          left: elOffset.left + elWidth + settings.offsetLeft
        };
      }
      return position;
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