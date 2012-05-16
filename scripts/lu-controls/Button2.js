var Class = require( 'class' ),
  Abstract = require( '/scripts/lu-controls/Abstract' ),
  ButtonFactory,
  Button;

ButtonFactory = Class.extend( function( Class ){
  var DISABLED = 'disabled',
    HAS_A18_ATTRS = 'button, input',
    DISABLED_STATE = DISABLED,
    STATED_EVENT = 'stated',
    LOADED_STATE = 'loaded',
    MAXED_STATE = 'maxed',
    SELECTED_STATE = 'selected',
    FLOORED_STATE = 'floored',
    TRANSITIONING_STATE = 'transitioning',
    TRANSITIONED_STATE = 'transitioned',
    PLAYING_STATE = 'playing',
    PAUSED_STATE = 'paused',
    buttonDecorators,
    defaults = {
      on: 'click'
    },
    stateDefaults = {
      states: ['on','off'],
      index: 0
    };

  function normalizeStates( states ){
    if( states ){
      if( typeof states === 'string' ){
        states = states.replace( ' ', '' ).split( ',' );
      }
    }
    return states;
  }

  function focus( $element ){
    if( $element.is( 'a' ) ){
      $element.focus();
    }
  }

  function applyRoleAttr( $element ){
    var role = 'role';
    if ( !$element.attr( role ) ){
      $element.attr( role, 'button' );
    }
  }

  function bindSpaceBar( $element, on ){
    $element.on( 'keyup', function( event ){
      if( event.keyCode === 32 ){
        Button.trigger( on );
      }
    } );
  }

  Button = Abstract.extend( function( Abstract ){
    return {
      init: function( $element, settings ){
        var Button = this;

        Abstract.init.call( this, $element, settings );

        if( $element.is( 'a' ) ){
          applyRoleAttr( $element );
        }

        bindSpaceBar( $element, settings.on );
      },
      disable: function(){
        var $element = this.element;
        if( $element.is( HAS_A18_ATTRS ) ){
          $element.prop( DISABLED, true );
        }
        $element.addClass( DISABLED_STATE );
      },
      enable: function(){
        var $element = this.element;
        if( $element.is( HAS_A18_ATTRS ) ){
          $element.removeProp( DISABLED );
        }
        $element.removeClass( DISABLED_STATE );
      }
    };
  } );

  buttonDecorators = {
    dflt: function( on, command ){
      return function( Button ){
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          if( command !== undefined ){
            Button.trigger( command );
          }
        } );
      };
    },
    first: function( on ){
      return function( Button ){
        Button.on( SELECTED_STATE, function( event ){
         event.stopPropagation();
         Button.enable();
        } );
        Button.on( STATED_EVENT, function( event, $subject, state ){
          event.stopPropagation();
          if( state === FLOORED_STATE ){
            Button.disable();
          }
        } );
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          Button.trigger( 'first' );
        } );
      };
    },
    last: function( on ){
      return function( Button ){
        Button.on( SELECTED_STATE, function( event ){
          event.stopPropagation();
          Button.enable();
        } );
        Button.on( STATED_EVENT, function( event, $subject, state ){
          event.stopPropagation();
          if( state === MAXED_STATE ){
            Button.disable();
          }
        } );
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          Button.trigger( 'last' );
        } );
      };
    },
    load: function( on ){
      return function( Button ){
        Button.on( STATED_EVENT, function( event, $subject, state ){
          event.stopPropagation();
          if( state === LOADED_STATE ){
            Button.disable();
          }
        } );
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          Button.trigger( 'load' );
        } );
      };
    },
    next: function( on ){
      return function( Button ){
        var playing = false;
        Button.on( SELECTED_STATE, function( event ){
          event.stopPropagation();
          if( !playing ){
            Button.enable();
          }
        } );
        Button.on( MAXED_STATE, function( event, $subject ){
          event.stopPropagation();
          var Control = $subject.lu( 'getControl' );
          if( !Control.hasNext() ){
            Button.disable();
          }
        } );
        Button.on( TRANSITIONED_STATE, function( event, $subject ){
          event.stopPropagation();
          Button.enable();
        } );
        Button.on( TRANSITIONING_STATE, function( event, $subject ){
          event.stopPropagation();
          if( playing ){
            Button.disable();
          }
        } );
        Button.on( PAUSED_STATE, function( event, $subject ){
          event.stopPropagation();
          playing = false;
        } );
        Button.on( PLAYING_STATE, function( event, $subject ){
          event.stopPropagation();
          playing = true;
        } );
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          Button.trigger( 'next' );
        } );
      };
    },
    pause: function( on ){
      return function( Button ){
        var paused = false;
        Button.on( PLAYING_STATE, function( event, $subject ){
          event.stopPropagation();
          Button.enable();
          paused = false;
        } );
        Button.on( PAUSED_STATE, function( event, $subject ){
          event.stopPropagation();
          Button.disable();
          paused = true;
        } );
        Button.on( TRANSITIONED_STATE, function( event, $subject ){
          event.stopPropagation();
          if( !paused ){
           Button.enable();
          }
        } );
        Button.on( TRANSITIONING_STATE, function( event, $subject ){
          event.stopPropagation();
          Button.disable();
        } );
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          Button.trigger( 'pause' );
        } );
      };
    },
    play: function( on ){
      return function( Button ){
        var paused = false;
        Button.on( PAUSED_STATE, function( event, $subject ){
          event.stopPropagation();
          Button.enable();
          paused = true;
        } );
        Button.on( PLAYING_STATE, function( event, $subject ){
          event.stopPropagation();
          Button.disable();
          paused = false;
        } );
        Button.on( TRANSITIONED_STATE, function( event, $subject ){
          event.stopPropagation();
          if( !paused ){
           Button.enable();
          }
        } );
        Button.on( TRANSITIONING_STATE, function( event, $subject ){
          event.stopPropagation();
          Button.disable();
        } );
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          Button.trigger( 'play' );
        } );
      };
    },
    previous: function( on ){
      return function( Button ){
        var playing = false;
        Button.on( SELECTED_STATE, function( event ){
          event.stopPropagation();
          if( !playing ){
            Button.enable();
          }
        } );
        Button.on( FLOORED_STATE, function( event, $subject ){
          event.stopPropagation();
          var Control = $subject.lu( 'getControl' );
          if( !Control.hasPrevious() ){
            Button.disable();
          }
        } );
        Button.on( TRANSITIONED_STATE, function( event, $subject ){
          event.stopPropagation();
          Button.enable();
        } );
        Button.on( TRANSITIONING_STATE, function( event, $subject ){
          event.stopPropagation();
          if( playing ){
            Button.disable();
          }
        } );
        Button.on( PAUSED_STATE, function( event, $subject ){
          event.stopPropagation();
          playing = false;
        } );
        Button.on( PLAYING_STATE, function( event, $subject ){
          event.stopPropagation();
          playing = true;
        } );
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          Button.trigger( 'previous' );
        } );
      };
    },
    select: function( on, item ){
      return function( Button ){
        // Button.on( SELECTED_STATE, function( event, $subject, $item, index ){
        //   event.stopPropagation();
        //   if( $item.is( item ) ){
        //     Button.disable();
        //   } else {
        //     Button.enable();
        //   }
        // } );
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          Button.trigger( 'select', item );
        } );
      };
    },
    state: function( on, states, index ){
      index = index || 0;
      _.log( states );
      function state(){
        if( index === undefined ){
          index = 0;
        }

        if( index < states.length - 1 ){
          index += 1;
        } else {
          index = 0;
        }
      }
      return function( Button ){
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          state();
          Button.trigger( 'state', states[index] );
        } );
      };
    }
  };

  return {
    create: function( $element, settings ){
      var command = settings.action || ( settings.__params__ ) ? settings.__params__.shift() : undefined,
        params = settings.__params__,
        decorator = buttonDecorators[command] || buttonDecorators.dflt,
        controls;

      switch( command ){
        case 'state':

          settings.action = command;

          _.defaults( settings, stateDefaults, defaults );

          if( settings.states ){
            settings.states = normalizeStates( settings.states );
          } else if( params ){
            settings.states = params;
          }

          decorator = decorator( settings.on, settings.states, settings.index );
          break;
        case 'select':
          if( !settings.item && settings.item !== 0 ){
            if( $element.is( HAS_A18_ATTRS ) ){
              controls = $element.attr( 'aria-controls' );
            } else if ( $element.is( 'a' ) ){
              controls = _.explodeURL( $element.attr( 'href' ) ).fragment;
            }
            if( controls && controls !== '' ){
              settings.item = $( '#' + controls );
            } else {
              if( params[0] || params[0] === 0 ){
                settings.item = params[0];
              } else {
                settings.item = $( '> li', $element.closest( 'ul, ol' ) ).index( $element.closest( 'li' ) );
              }
            }
          }
          _.defaults( settings, defaults );
          decorator = decorator( settings.on, settings.item );
          break;
        default:
          _.defaults( settings, defaults );
          decorator = decorator( settings.on, command );
      }

      return ( new Button( $element, settings ) ).decorate( decorator );
    }
  };
} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( new ButtonFactory().create );
  } else if( module.exports ){
   module.exports = new ButtonFactory().create;
  }
}





