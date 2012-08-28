/**
* Placeholder form control
* @class Placeholder
* @constructor
* @extends FormElement
*/

var FormElement = require( 'lu/FormElement' ),
    helpers = require( 'lu/helpers' ),
    StateDecorator = require( 'lu/decorators/state' ),
    Fiber = require( 'Fiber' ),
    Placeholder;

Placeholder = FormElement.extend( function ( base ) {
  var hasPlaceholder = !!( 'placeholder' in document.createElement( 'input' ) && 'placeholder' in document.createElement( 'textarea' ) ),

      defaults = {
        placeholderClass: 'placeholder-visible'
      };


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
      Fiber.decorate( Placeholder, StateDecorator( settings ) );
      PLACEHOLDER_STATE = settings.placeholderClass;
      Placeholder.addState( PLACEHOLDER_STATE );
      $element.val( placeholderText );

      function clear () {
        if ( Placeholder.hasState( PLACEHOLDER_STATE ) ) {
          $element.val('');
          Placeholder.clear();
        }
      }

      function show () {
        if ( $element.val() === '' ) {
          $element.val( placeholderText );
          Placeholder.setState( PLACEHOLDER_STATE );
        }
      }

      $element.on( 'focus', function ( evt ) {
        clear();
      } );

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
