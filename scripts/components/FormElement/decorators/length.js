function lengthDecorator( settings ) {

  return function( base ){
    var self = this;

    this.addValidator('length', function() {
      var length = self.$element.val().length;

      // do not check length if the field is empty, use required decorator if you want this behavior
      if( length > 0 ){
        if( length < settings.minimumLength ){
          return { success: false, message: i18n.FormElement.decorators.length.under };
        }else if( length > settings.maximumLength ){
          return { success: false, message: i18n.FormElement.decorators.length.over };
        }else{
          return { success: true };
        }
      }else{
        return { success: true };
      }
    } );
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( lengthDecorator );
  } else if( module.exports ){
    module.exports = lengthDecorator;
  }
}