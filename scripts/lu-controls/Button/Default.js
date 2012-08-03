/**
 * Decorates the Button to listen for
 * the 'on' event and trigger the 'action' event
 * as specified in the configuration.
 * @method next
 * @private
 */
function defaultDecorator() {
  function focus( $element ){
    if( $element.is( 'a' ) ){
      $element.focus();
    }
  }

  return function( base, settings ){
    var instance = this,
      on = settings.on,
      command = settings.action,
      $element = instance.$element;

    instance.on( on, function( event ){
      focus( $element );
      if( command !== undefined ){
        instance.trigger( command );
      }
    } );

  };
}

  //Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( defaultDecorator() );
  } else if( module.exports ){
    module.exports = defaultDecorator();
  }
}