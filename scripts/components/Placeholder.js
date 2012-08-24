/**
* Placeholder form control
* @class Placeholder
* @constructor
* @extends FormElement
*/

var FormElement = require( 'lu/FormElement' ),
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
          PLACEHOLDER_CLASS,
          placeholderText = $element.attr( 'placeholder' );

      // Exit early if placeholder is supported natively.
      if ( hasPlaceholder ) {
        return;
      }

      _.defaults( settings, defaults );
      base.init.call( Placeholder, $element, settings );
      PLACEHOLDER_CLASS = settings.placeholderClass;
      $element.addClass( PLACEHOLDER_CLASS );
      $element.val( placeholderText );

      function clear () {
        if ( $element.hasClass( PLACEHOLDER_CLASS ) ) {
          $element.val('');
          $element.removeClass( PLACEHOLDER_CLASS );
        }
      }

      function show () {
        if ( $element.val() === '' ) {
          $element.addClass( PLACEHOLDER_CLASS );
          $element.val( placeholderText );
        }
      }

      Placeholder.on( 'focus', function ( evt ) {
        clear();
      } );

      Placeholder.on( 'blur', function ( evt ) {
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
