function belowDecorator(settings) {

  return function( base ) {
    var self = this;

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