/**
* Button
* @class Button
* @constructor
* @extends Abstract
* @version 0.2.4
*/

var Switch = require( '/scripts/lu-controls/Switch' ),
  Button;

Button = Switch.extend( function( Abstract ){
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

  function bindSpaceBar( Button, $element, on ){
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
      var on = settings.on,
        $element = Button.$element,
        isAnchor = $element.is( 'a' ),
        url = settings.url || $element.attr( 'href' );


      return function( Button ){
        Button.on( STATED_EVENT, function( event, $subject, states ){
          event.stopPropagation();
          if( _.indexOf( states, LOADED_STATE ) > -1 ){
            Button.disable();
          }
        } );
        Button.on( on, function( event ){
          if( isAnchor && !settings.url ){
            event.preventDefault();
          }
          focus( $element );
          if( command !== undefined ){
            Button.trigger( 'load', [url] );
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
        __params__ = settings.__params__,
        List;

      if( $element.is( HAS_A18_ATTRS ) ){
        controls = $element.attr( 'aria-controls' );
      } else if ( $element.is( 'a' ) ){
        controls = _.explodeURL( $element.attr( 'href' ) ).fragment;
      }

      if( item === undefined ){
        if( controls && controls !== '' ){
          item = '#' + controls;
        } else if( __params__.length > 0 ){
          item = __params__.shift();
        } else {
          item = $element.closest( lu.getControl( $element.closest( '[data-lu=List]' ) ).$items );
        }
      }

      return function( Button ){
        Button.on( SELECTED_EVENT, function( event, List ){
          var $item;
          event.stopPropagation();

          if( typeof item === 'number' ){
            $item = List.$items.eq( item );
          } else if( typeof item === 'string' ){
            $item = List.$items.filter( item );
          } else if( item instanceof $ ){
            $item = item;
          }

          if( List.current().is( $item ) ){
            Button.disable();
          } else {
            Button.enable();
          }
        } );
        Button.on( on, function( event ){
          focus( Button.$element );
          Button.trigger( 'select', [item] );
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
          focus( Button.$element );
          state();
          Button.trigger( 'state', states[index] );
        } );
      };
    }
  };

  function defaultDecorator( Button, settings ){
    var on = settings.on,
      command = settings.action,
      $element = Button.$element;

    return function( Button ){
      Button.on( on, function( event ){
        focus( $element );
        if( command !== undefined ){
          Button.trigger( command );
        }
      } );
    };
  }

  return {
    init: function( $element, settings ){
      var Button = this,
        command = settings.action || ( settings.__params__ ) ? settings.__params__.shift() : undefined,
        decorators = [];

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

      bindSpaceBar( Button, $element, settings.on );
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