/**
 * Decorates the Button to listen for
 * the 'on' event and trigger the 'action' event
 * as specified in the configuration.
 * @method next
 * @private
 */
function defaultDecorator() {
console.log( 'HELLO' );
  function focus( $element ){
    if( $element.is( 'a' ) ){
      $element.focus();
    }
  }

  return function( base, settings ){

    console.log( 'NAME CLASS "BEEF GYRO"' );

    var instance = this,
      on = settings.on,
      command = settings.action,
      $element = instance.$element;

    console.log( on );

    instance.on( on, function( event ){
      focus( $element );
      if( command !== undefined ){
        console.log( 'command :: ', command );
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