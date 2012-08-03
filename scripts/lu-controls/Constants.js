var Constants = {
  HAS_A18_ATTRS : 'button, input',
  DISABLED: 'disabled',

  events: {
    SELECTED : 'selected',
    STATED : 'stated'
  },

  states: {
    SELECTED : 'selected',
    DISABLED : 'disabled',
    LOADED : 'loaded',
    MAXED : 'maxed',
    FLOORED : 'floored',
    TRANSITIONING : 'transitioning',
    TRANSITIONED : 'transitioned',
    PLAYING : 'playing',
    PAUSED : 'paused'
  }

};

  //Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Constants );
  } else if( module.exports ){
    module.exports = Constants;
  }
}