var constants = require( 'lu/constants' );

function stateDecorator( settings ){

  //Normalize states into an array.
  function normalize( states ){
    if( states ){
      if( typeof states === 'string' ){
        states = states.replace( ' ', '' ).split( ',' );
      }
    }
    return states;
  }

  //Correct the index
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
      states = [],
      method = settings.method,
      index = settings.index || 0,
      initialState = [];

    if( method !== 'reset' || method !== 'clear' ){
      states = normalize( settings.states ) || [constants.states.ACTIVE, constants.states.INACTIVE];
    }

    this.$element.on( settings.on, _.throttle( function( event ){
      if( self.$element.is( 'a' ) ){
        self.$element.focus();
      }
      index = state( states, index );
      self.trigger( constants.events.STATE, [states[index], method] );
    }, settings.throttle ) );

    this.one( constants.events.STATED, function( event, Component ){
      initialState = Component.getState();
    } );

    this.on( constants.events.STATED, function( event, Component ){
      var intersection;
      if( self.$element.is( Component.$element ) ){
        return;
      }

      switch( method ){
        case 'add':
          if( Component.hasState( states[index] ) && states.length === 1 ){
            self.disable();
          } else {
            self.enable();
          }
          break;
        case 'remove':
          if( !Component.hasState( states[index] ) && states.length === 1 ){
            self.disable();
          } else {
            self.enable();
          }
          break;
        case 'clear':
          if( Component.getState().length === 0 ){
            self.disable();
          } else {
            self.enable();
          }
          break;
        case 'reset':
          if( _.difference( initialState, Component.getState() ).length === 0 ){
            self.disable();
          } else {
            self.enable();
          }
          break;
        default:
          intersection = _.intersection( states, Component.getState() );
          if( states.length === 1 ) {
            if( Component.hasState( states[index] ) && states.length === 1 ){
              self.disable();
            } else {
              self.enable();
            }
          } else if( states.length > 1 ){
            if( intersection.length === states.length ){
              self.disable();
            } else {
              self.enable();
            }
            if( intersection.length === 1 ){
              index = _.indexOf( states, intersection[0] );
            }

          } else {
            self.enable();
          }
      }

    } );
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( stateDecorator );
  } else if( module.exports ){
    module.exports = stateDecorator;
  }
}