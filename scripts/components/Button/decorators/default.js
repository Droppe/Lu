/**
 * Decorates the Button to listen for
 * the 'on' event and trigger the 'action' event
 * as specified in the configuration.
 * @private
 */

function DefaultDecorator( settings ){
  return function( base ){
    var self = this;
    self.$element.on( settings.on, _.throttle( function( event ){
      if( !self.$element.is( 'button' ) ){
        self.$element.focus();
      }
      if( settings.action !== undefined ){
        // this trigger should send params
        self.trigger( settings.action, [self] );
      }
    }, settings.throttle ) );
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( DefaultDecorator );
  } else if( module.exports ){
    module.exports = DefaultDecorator;
  }
}