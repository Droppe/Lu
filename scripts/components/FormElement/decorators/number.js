function numberDecorator( settings ) {

  return function( base ){
    var self = this;

    this.addValidator('number', function() {
      if( isNaN( self.$element.val()-0 ) ){
        return { success: false, message: i18n.FormElement.decorators.number.nan };
      } else {
        return { success: true };
      }
    });
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( numberDecorator );
  } else if( module.exports ){
    module.exports = numberDecorator;
  }
}