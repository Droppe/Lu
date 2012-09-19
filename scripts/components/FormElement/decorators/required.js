function requiredDecorator( settings ) {

  return function( base ){
    var self = this;

    this.addValidator('required', function() {
      if( self.$element.val().length === 0 ){
        return { success: false, message: i18n.FormElement.decorators.required.error };
      } else {
        return { success: true };
      }
    });
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( requiredDecorator );
  } else if( module.exports ){
    module.exports = requiredDecorator;
  }
}