function leftDecorator(settings) {

  return function( base ) {
    var self = this;

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