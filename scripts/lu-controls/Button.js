var Abstract = require( '/scripts/lu-controls/Abstract' ),
  stateDecorator = require( '/scripts/lu-decorators/State' ),
  Button;

Button = Abstract.extend( function( Abstract ){
  var DISABLED = 'disabled',
    HAS_A18_ATTRS = 'button, input',
    DISABLED_STATE = DISABLED,
    STATED_EVENT = 'stated',
    SELECTED_EVENT = 'selected',
    LOADED_STATE = 'loaded',
    MAXED_STATE = 'maxed',
    SELECTED_STATE = SELECTED_EVENT,
    FLOORED_STATE = 'floored',
    TRANSITIONING_STATE = 'transitioning',
    TRANSITIONED_STATE = 'transitioned',
    PLAYING_STATE = 'playing',
    PAUSED_STATE = 'paused',
    commandDecorators,
    defaults = {
      on: 'click'
    };

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

  commandDecorators = {
    first: function( Button, settings ){
      var on = settings.on;
      return function( Button ){
        Button.on( SELECTED_EVENT, function( event, Control ){
          event.stopPropagation();
          if( Control.index === 0 ){
            Button.disable();
          } else {
            Button.enable();
          }
        } );
      };
    },
    last: function( Button, settings ){
      var on = settings.on;
      return function( Button ){
        Button.on( SELECTED_EVENT, function( event, Control ){
          event.stopPropagation();
          if( Control.index === Control.size() - 1 ){
            Button.disable();
          } else {
            Button.enable();
          }
        } );
      };
    },
    load: function( Button, settings ){
      var on = settings.on;
      return function( Button ){
        Button.on( STATED_EVENT, function( event, $subject, states ){
          event.stopPropagation();
          if( _.indexOf( states, LOADED_STATE ) > -1 ){
            Button.disable();
          }
        } );
      };
    },
    next: function( Button, settings ){
      var on = settings.on;
      return function( Button ){
        Button.on( SELECTED_EVENT, function( event, Control, item ){
          event.stopPropagation();
          if( Control.hasNext() ){
            Button.enable();
          } else {
            Button.disable();
          }
        } );
      };
    },
    pause: function( Button, settings ){
      var on = settings.on;
      return function( Button ){
        var playing = true;
        Button.on( STATED_EVENT, function( event, $subject, states ){
          event.stopPropagation();
          if( _.indexOf( states, PAUSED_STATE ) > -1 ){
            Button.disable();
            playing = false;
          }
          if( _.indexOf( states, PLAYING_STATE ) > -1 ){
            Button.enable();
            playing = true;
          }
        } );
      };
    },
    play: function( Button, settings ){
      var on = settings.on;
      return function( Button ){
        var playing = true;
        Button.on( STATED_EVENT, function( event, $subject, states ){
          event.stopPropagation();
          if( _.indexOf( states, PAUSED_STATE ) > -1 ){
            Button.enable();
            playing = false;
          }
          if( _.indexOf( states, PLAYING_STATE ) > -1 ){
            Button.disable();
            playing = true;
          }
        } );
      };
    },
    previous: function( Button, settings ){
      var on = settings.on;
      return function( Button ){
        Button.on( SELECTED_EVENT, function( event, Control, item ){
          event.stopPropagation();
          if( Control.hasPrevious() ){
            Button.enable();
          } else {
            Button.disable();
          }
        } );
      };
    },
    select: function( Button, settings ){
      var $element = Button.$element,
        item = settings.item,
        on = settings.on,
        controls,
        __params__ = settings.__params__;

      if( $element.is( HAS_A18_ATTRS ) ){
        controls = $element.attr( 'aria-controls' );
      } else if ( $element.is( 'a' ) ){
        controls = _.explodeURL( $element.attr( 'href' ) ).fragment;
      }

      if( item === undefined ){
        if( controls && controls !== '' ){
          item = '#' + controls;
        } else if( __params__ ){
          item = __params__.shift();
        } else {
          item = $( '> li', $element.closest( 'ul, ol' ) ).index( $element.closest( 'li' ) );
        }
      }

      return function( Button ){
        Button.on( SELECTED_EVENT, function( event, List ){
          var $item;
          event.stopPropagation();

          if( typeof item === 'number' ){
            $item = List.$items.eq( item );
          } else if ( typeof item === 'string' ){
            $item = List.$items.filter( item );
          }
          if( List.current().is( $item ) ){
            Button.disable();
          } else {
            Button.enable();
          }
        } );
        Button.on( on, function( event ){
          console.log( 'select', item );
          event.preventDefault();
          focus( Button.$element );
          Button.trigger( 'select', item );
        } );
      };
    },
    state: function( Button, settings ){
      var on = settings.on,
        states = settings.states,
        index = settings.index || 0,
        __params__ = settings.__params__;

      function normalize( states ){
        if( states ){
          if( typeof states === 'string' ){
            states = states.replace( ' ', '' ).split( ',' );
          }
        }
        return states;
      }

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

      if( states ){
        states = normalize( states );
      } else if( __params__ ){
        states = __params__;
      }

      return function( Button ){
        Button.on( on, function( event ){
          event.preventDefault();
          focus( Button.$element );
          state();
          console.log( states[index] );
          Button.trigger( 'state', states[index] );
        } );
      };
    }
  };

  return {
    init: function( $element, settings ){
      var Button = this,
        command = settings.action || ( settings.__params__ ) ? settings.__params__.shift() : undefined,
        decorators = [ stateDecorator ];

      function defaultDecorator( Button, settings ){
        var on = settings.on,
          command = settings.action;

        return function( Button ){
          Button.on( on, function( event ){
            event.preventDefault();
            focus( Button.$element );
            if( command !== undefined ){
              Button.trigger( command );
            }
          } );
        };
      }

      settings.action = command;

      Abstract.init.call( this, $element, settings );

      switch( command ){
        case 'state':
          decorators.push( commandDecorators[command]( Button, _.defaults( settings, defaults ) ) );
          break;
        case 'select':
          decorators.push( commandDecorators[command]( Button, _.defaults( settings, defaults ) ) );
          break;
        case 'first':
          _.defaults( settings, defaults );
          decorators.push( defaultDecorator( Button, settings ) );
          decorators.push( commandDecorators[command]( Button, settings ) );
          break;
        case 'last':
          _.defaults( settings, defaults );
          decorators.push( defaultDecorator( Button, settings ) );
          decorators.push( commandDecorators[command]( Button, settings ) );
          break;
        case 'previous':
          _.defaults( settings, defaults );
          decorators.push( defaultDecorator( Button, settings ) );
          decorators.push( commandDecorators[command]( Button, settings ) );
          break;
        case 'next':
          _.defaults( settings, defaults );
          decorators.push( defaultDecorator( Button, settings ) );
          decorators.push( commandDecorators[command]( Button, settings ) );
          break;
        case 'play':
          _.defaults( settings, defaults );
          decorators.push( defaultDecorator( Button, settings ) );
          decorators.push( commandDecorators[command]( Button, settings ) );
          break;
        case 'pause':
          _.defaults( settings, defaults );
          decorators.push( defaultDecorator( Button, settings ) );
          decorators.push( commandDecorators[command]( Button, settings ) );
          break;
        case 'load':
          _.defaults( settings, defaults );
          decorators.push( defaultDecorator( Button, settings ) );
          decorators.push( commandDecorators[command]( Button, settings ) );
          break;
        default:
          decorators.push( defaultDecorator( Button, _.defaults( settings, defaults ) ) );
      }

      //Decorators for buttons should be separated into other files,
      //somthing like the below should be possible.
      // require.ensure( [command], function( require, module, exports ){
      //   var req = require,
      //     decorator = ( req( command ) )( Button, settings );
      //  Button.decorate.apply( this, decorators );
      // } );

      Button.decorate.apply( this, decorators );

      if( $element.is( 'a' ) ){
        applyRoleAttr( $element );
      }
      bindSpaceBar( $element, settings.on );
    },
    disable: function(){
      var $element = this.$element;
      if( $element.is( HAS_A18_ATTRS ) ){
        $element.prop( DISABLED, true );
      }
      this.addState( DISABLED_STATE );
      return this;
    },
    enable: function(){
      var $element = this.$element;
      if( $element.is( HAS_A18_ATTRS ) ){
        $element.removeProp( DISABLED );
      }
      this.removeState( DISABLED_STATE );
      return this;
    }
  };

} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Button );
  } else if( module.exports ){
   module.exports = Button;
  }
}