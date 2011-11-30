var Class = require( '/scripts/libraries/ptclass' ),
  Abstract = require( 'ui/Abstract' ),
  Callout;

Callout =  Class.create( Abstract,  ( function () {

  // RETURN METHODS OBJECT 
  return {
    initialize: function ( $super, $element, settings ) {
      var Callout = this,
        defaults = {
            delay: 300,
            position: 'above',
            offset: 0,
            action: 'focus',
            html: '<div class="callout"><%= title %></div>'
        },
        open = false,
        $callout;

      if( settings.title === undefined ) {
        settings.title = $element.attr( 'title' );
      }

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      $callout = $( _.template( settings.html, { title: settings.title } ) );

      console.log( $callout );
      Callout.show = function() {
        if( open === true ) {
          
        }
      };
      Callout.hide = function() {
        if( open === true ) {

        }
      };
      Callout.toggle = function() {
        if( open === true ) {
          Callout.hide();
        } else {
          Callout.show();
        }
      }

      switch( settings.method ) {
        case 'hover':
          $element.on( 'hover', function() {
              event.stopPropagation();
              Callout.show();
            }, function( event ) {
              event.stopPropagation();
              Callout.hide();
            }
          );
          break;
        case 'click':
          $element.on( 'click', function( event ) {
            event.preventDefault();
            event.stopPropagation();
            Callout.toggle();
          } );
          break;
        case 'focus':
          $element.on( 'focus', function( event ) {
            event.stopPropagation();
            Callout.show();
          } );
          $element.on( 'blur', function( event ) {
            Callout.hide();
          } );
          break;
        default:
          break;
      };

    }
  };
}() ) );

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Callout;
}