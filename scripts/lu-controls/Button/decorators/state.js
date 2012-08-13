var constants = require( 'lu/constants' );

function stateDecorator( settings ){

  function normalize( states ){
    if( states ){
      if( typeof states === 'string' ){
        states = states.replace( ' ', '' ).split( ',' );
      }
    }
    return states;
  }

  function state( states, index ){
    if( index === undefined ){
      index = 0;
    }

    if( index < states.length - 1 ){
      index += 1;
    } else {
      index = 0;
    }
    return index;
  }

  return function( base ){
    var self = this,
      states = normalize( settings.states ) || [ constants.states.ACTIVE, constants.states.INACTIVE ],
      index = settings.index || 0;

    this.on( settings.on, function( event ){
      if( self.$element.is( 'a' ) ){
        self.$element.focus();
      }
      index = state( states, index );
      self.trigger( constants.events.STATE, states[index] )
    } );
  }

}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( stateDecorator );
  } else if( module.exports ){
    module.exports = stateDecorator;
  }
}