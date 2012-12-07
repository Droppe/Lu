var constants = require( 'lu/constants' );

/**
 * Decorates the Button to listen for the 'stated' event and
 * to disable itself if loading has occurred.
 * Additionally, the Button will fire a load event on the
 * 'on' event as specified in the configuration. This event
 * is triggered with a 'url' parameter.
 * @class loadDecorator
 * @uses Button
 */
function loadDecorator( settings ){

  return function( base ){
    var self = this,
      defaults = {
        loadOnce: true
      };

    _.defaults( settings, defaults );

    self.on( constants.events.STATED, function( event, Component ){
      event.stopPropagation();
      
      // The config value "settings.loadOnce" can stop/allow additional loading...
      if( settings.loadOnce && Component.hasState( constants.states.LOADED ) ){
        self.disable();
      }
    } );

  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( loadDecorator );
  } else if( module.exports ){
    module.exports = loadDecorator;
  }
}