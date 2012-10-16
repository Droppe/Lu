/**
* Placeholder form control
* @class Placeholder
* @constructor
* @extends FormElement
*/

var FormElement = require( 'lu/FormElement' ),
    helpers = require( 'lu/helpers' ),
    constants = require( 'lu/constants' ),
    stateDecorator = require( 'lu/decorators/state' ),
    Fiber = require( 'Fiber' ),
    Placeholder;

Placeholder = FormElement.extend( function ( base ) {
  var hasPlaceholder = !!( 'placeholder' in document.createElement( 'input' ) && 'placeholder' in document.createElement( 'textarea' ) ),

      defaults = {};


  return {
    init: function ( $element, settings ) {
      var Placeholder = this,
          form = $element[0].form,
          PLACEHOLDER_STATE,
          placeholderText = $element.attr( 'placeholder' );

      // Exit early if placeholder is supported natively.
      if ( hasPlaceholder ) {
        return;
      }

      _.defaults( settings, defaults );
      base.init.call( Placeholder, $element, settings );
      Fiber.decorate( Placeholder, stateDecorator( settings ) );
      PLACEHOLDER_STATE = constants.states.PLACEHOLDER;

      function clear () {
        if ( Placeholder.hasState( PLACEHOLDER_STATE ) ) {
          $element.val('');
          Placeholder.removeState( PLACEHOLDER_STATE );
        }
      }

      function show () {
        if ( $element.val() === '' ) {
          $element.val( placeholderText );
          Placeholder.addState( PLACEHOLDER_STATE );
        }
      }

      // Preserve text on reload and back
      if ( $element.val() === placeholderText ) {
        $element.val( '' );
      }
      show();

      $element.on( 'keydown', function ( evt ) {
        clear();
      } );

      $element.on( 'focus click', function ( evt ) {
        var range, element;
        if ( Placeholder.hasState( PLACEHOLDER_STATE ) ) {
          // Prevent default prevents the placeholder text from being highlighted on tab focus
          evt.preventDefault();
          element = $element[0];
          // Handle cursor placement in Firefox 3 and IE 9
          if ( element.setSelectionRange ) {
            element.setSelectionRange( 0, 0);
          // Handle cursor placement in IE7 and 8 (and technically 9 if we hadn't already handled it)
          } else if ( element.createTextRange ) {
            range = element.createTextRange();
            if ( range.collapse && range.select ) {
              range.collapse( true );
              range.select();
            }
          }
        }
      });

      $element.on( 'blur', function ( evt ) {
        show();
      } );

      if ( form ) {
        $( form ).on( 'submit', function ( evt ) {
          clear();
        } );
      }

    }
  };
} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Placeholder );
  } else if( module.exports ){
   module.exports = Placeholder;
  }
}
