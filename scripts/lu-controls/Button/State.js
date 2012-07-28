function stateDecorator() {

  function focus( $element ){
    if( $element.is( 'a' ) ){
      $element.focus();
    }
  }

  function normalize( states ){
    if( states ){
      if( typeof states === 'string' ){
        states = states.replace( ' ', '' ).split( ',' );
      }
    }
    return states;
  }

  function state(states, index){
    if( index === undefined ){
      index = 0;
    }

    if( index < states.length - 1 ){
      index += 1;
    } else {
      index = 0;
    }
  }

  return function( base, settings ){

    var on = settings.on,
      instance = this,
      states = settings.states,
      index = settings.index || 0,
      __params__ = settings.__params__;

    if( states ){
      states = normalize( states );
    } else if( __params__ ){
      states = __params__;
    }

    instance.on( on, function( event ){
      focus( instance.$element );
      index = state(states, index);
      instance.trigger( 'state', states[index] );
    } );

  };

}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( stateDecorator() );
  } else if( module.exports ){
    module.exports = stateDecorator();
  }
}