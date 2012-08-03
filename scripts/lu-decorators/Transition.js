function transitionDecorator(){

  var TRANSITION_PREFIX = 'lu-transition-',
    SUPPORTS_TRANSITION,
    TRANSITIONED_EVENT,
    TRANSITION_STYLE;

  /**
  * Check for CSS <transition> support
  */
  ( function () {
    var style = (document.body || document.documentElement).style,
        props = ['transition', 'WebkitTransition', 'MozTransition', 'msTransition', 'OTransition'],
        i;

    for ( i in props ) {
        if ( style[ props[i] ] !== undefined ) {
            SUPPORTS_TRANSITION = true;
            TRANSITION_STYLE = props[i];
            break;
        }
    }
  }() );

  ( function(){
    if( SUPPORTS_TRANSITION ){
      if( $.browser.webkit ){
        TRANSITIONED_EVENT = "webkitTransitionEnd";
      } else if( $.browser.mozilla ){
        TRANSITIONED_EVENT = "transitionend";
      } else if( $.browser.opera ){
        TRANSITIONED_EVENT = "oTransitionEnd";
      } else {
        TRANSITIONED_EVENT = "TransitionEnd";
      }
    }
  }() );

  function transition( $element, vectors ){
    $element.addClass( vectors );
  }

  function kill( $element ){
    var removed = [],
      classes = [],
      classAttr = $element.attr( 'class' ) || '';

    _.each( classAttr.split( ' ' ), function( clss, index ){
      if( clss.indexOf( TRANSITION_PREFIX ) > -1 ){
        removed.push( clss );
      }
    } );
    $element.removeClass( removed.join( ' ' ) );
  }

  return function( instance ){
    var transitioning = false,
      resolving = false,
      queue = [],
      callback;

    if( SUPPORTS_TRANSITION ){
      _.each( instance, function( item, key ){
        var cache;
        if( typeof item === 'function' ){
          cache = item;
          instance[key] = function(){
            if( transitioning ){
              queue.push( { instance: instance, fn: key, args: arguments } );
              return instance;
            } else {
              return cache.apply( instance, arguments );
            }
          };
        }
      } );
    }

    instance.startTransition = function( vectors, fn ){
      var transition;
      if( SUPPORTS_TRANSITION && !transitioning && !resolving ){
        transition = this.$element.get(0).style[TRANSITION_STYLE];

        if( _.isArray( vectors ) ){
          _.each( vectors, function( vector, index ){
            vectors[index] = TRANSITION_PREFIX + vector;
          } );
          instance.$element.addClass( vectors.join( ' ' ) ).one( TRANSITIONED_EVENT, function( event ){
            instance.stopTransition();
          } );
        }
        if( typeof fn === 'function' ){
          callback = fn;
        }
        transitioning = true;
      }
      return instance;
    };

    instance.stopTransition = function(){
      if( transitioning ){

        resolving = true;

        ( function resolve(){
          var item;
          while( queue.length > 0 ){
            item = queue.shift();
            instance[item.fn].apply( item.instance, item.args );
          }
        }() );

        resolving = false;

        kill( instance.$element );
        transitioning = false;

        if( callback ){
          callback();
          callback = undefined;
        }

      }
      return instance;
    };
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( transitionDecorator() );
  } else if( module.exports ){
   module.exports = transitionDecorator();
  }
}