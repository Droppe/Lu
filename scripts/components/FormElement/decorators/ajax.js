function ajaxDecorator( settings ) {

  return function( base ){
    var self = this;

    this.addValidator('ajax', function() {
      $.getJSON( settings.ajaxValidatorUrl, function( data ){
        return data;
      } );
    } );
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( ajaxDecorator );
  } else if( module.exports ){
    module.exports = ajaxDecorator;
  }
}