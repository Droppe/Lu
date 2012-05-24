function transitionDecorator(){

  var TRANSITION_PREFIX = 'lu-transition-',
    SUPPORTS_TRANSITION,
    TRANSITIONED_EVENT,
    TRANSITION_STYLE;

  ( function(){
    var body = document.body || document.documentElement,
      style = body.style,
      support = style.transition !== undefined ||
        style.WebkitTransition !== undefined ||
        style.MozTransition !== undefined ||
        style.MsTransition !== undefined ||
        style.OTransition !== undefined;

    if( support !== undefined ){
      SUPPORTS_TRANSITION = true;
      TRANSITION_STYLE = support;
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
    $element.removeClass( removed.join( ' ' ) ).trigger( TRANSITIONED_EVENT );
  }

  return function( instance ){
    var transitioning = false;
    console.log( instance );
    if( SUPPORTS_TRANSITION ){
      _.each( instance, function( item, key ){
        var cache;
        if( typeof item === 'function' ){
          cache = item;
          instance[key] = function(){
            if( transitioning ){
              return;
            } else {
              cache.apply( instance, arguments );
            }
          };
        }
      } );
    }

    instance.startTransition = function( vectors ){
      var transition;

      if( SUPPORTS_TRANSITION ){
        transition = this.style[TRANSITION_STYLE];

        if( transitioning ){
          instance.stopTransition();
        }

        instance.$element.addClass( vectors.join( ' ' ) ).one( TRANSITIONED_EVENT, function(){
          instance.stopTransition();
        } );

        transitioning = true;
      }
      return instance;
    };

    instance.stopTransition = function( vectors ){
      if( transitioning && SUPPORTS_TRANSITION ){
        kill( instance.$element );
        transitioning = false;
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