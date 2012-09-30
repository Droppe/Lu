function asyncDecorator(settings) {

  return function( base ){
    var self = this;

    this.submitForm = function( event ) {
      event.preventDefault();

      // do ajax submission

      return false;
    };
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( asyncDecorator );
  } else if( module.exports ){
    module.exports = asyncDecorator;
  }
}