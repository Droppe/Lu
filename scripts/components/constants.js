
var constants = {
  HAS_A18_ATTRS: 'button, input',
  DISABLED: 'disabled',
  events: {
    SELECTED: 'selected',
    SELECT: 'select',
    STATED: 'stated',
    STATE: 'state',
    UPDATED: 'updated',
    UPDATE: 'update',
    LOAD: 'load',
    OUT_OF_BOUNDS: 'out_of_bounds',
    NEXT: 'next',
    PREVIOUS: 'previous',
    FIRST: 'first',
    LAST: 'last',
    PLAY: 'play',
    PAUSED: 'paused'
  },
  statePrefix: 'lu-state-',
  states: {
    STATE: 'state',
    STATED: 'stated',
    SELECTED: 'selected',
    DISABLED: 'disabled',
    LOADING: 'loading',
    LOADED: 'loaded',
    MAXED: 'maxed',
    FLOORED: 'floored',
    TRANSITIONING: 'transitioning',
    TRANSITIONED: 'transitioned',
    PLAYING: 'playing',
    PAUSED: 'paused',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ERRED: 'erred',
    REVERSE: 'reverse',
    FOWARD: 'FOWARD'
  }
};

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( constants );
  } else if( module.exports ){
    module.exports = constants;
  }
}