var constants = require( 'lu/constants' );

function placeholderDecorator(settings) {

  return function( base ){
    var self = this,
        $element = this.$element,
        hasPlaceholder = !!( 'placeholder' in document.createElement( 'input' ) && 'placeholder' in document.createElement( 'textarea' ) ),
        placeholderText = $element.attr( 'placeholder' ),
        PLACEHOLDER_STATE = constants.states.PLACEHOLDER;

    function clear( event ){
      if( self.hasState( PLACEHOLDER_STATE ) ){
        $element.val('');
        self.removeState( PLACEHOLDER_STATE );
      }
    }

    function show( event ){
      if( $element.val() === '' ){
        $element.val( placeholderText );
        self.addState( PLACEHOLDER_STATE );
      }
    }

    function handleFocus( event ){
      var range;

      if( self.hasState( PLACEHOLDER_STATE ) ){
        // Prevent default prevents the placeholder text from being highlighted on tab focus
        event.preventDefault();
        if( $element[0].createTextRange ){
          range = $element[0].createTextRange();
          range.moveat( 'character', 0 );
          range.movend( 'character', 0 );
        }else if( $element[0].setSelectionRange ){
          $element[0].setSelectionRange( 0, 0 );
        }
      }
    }

    if( !hasPlaceholder ){
      // setup event listeners
      $element.on( 'keydown', clear );
      $element.on( 'focus', handleFocus );
      $element.on( 'blur', show );

      this.on( constants.events.FORM_SUBMIT, function( event, component ){
        clear();
      } );

      // Preserve text on reload and back
      if( $element.val() === placeholderText ){
        $element.val( '' );
      }
      show();
    }

  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( placeholderDecorator );
  } else if( module.exports ){
    module.exports = placeholderDecorator;
  }
}