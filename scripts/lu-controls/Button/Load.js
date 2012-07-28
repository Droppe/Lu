var Constants = require( 'lu/Constants' );

/**
 * Decorates the Button to listen for the 'stated' event and
 * to disable itself if loading has occurred.
 * Additionally, the Button will fire a load event on the
 * 'on' event as specified in the configuration. This event
 * is triggered with a 'url' parameter.
 * @method load
 * @private
 */
function loadDecorator() {

  function focus( $element ){
    if( $element.is( 'a' ) ){
      $element.focus();
    }
  }

  return function( base, settings ){
    var instance = this,
      on = settings.on,
      $element = instance.$element,
      isAnchor = $element.is( 'a' ),
      url = settings.url || $element.attr( 'href' );

    instance.on( Constants.events.STATED, function( event, $subject, states ){
      event.stopPropagation();
      if( _.indexOf( states, Constants.states.LOADED ) > -1 ){
        instance.disable();
      }
    } );

    instance.on( on, function( event ){
      if( isAnchor && !settings.url ){
        event.preventDefault();
      }
      focus( $element );
      instance.trigger( 'load', [url] );
    } );

  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( loadDecorator() );
  } else if( module.exports ){
    module.exports = loadDecorator();
  }
}