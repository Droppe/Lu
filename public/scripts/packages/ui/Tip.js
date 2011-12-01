var Class = require( '/scripts/libraries/ptclass' ),
  Abstract = require( 'ui/Abstract' ),
  Tip;

Tip =  Class.create( Abstract,  ( function () {

  // RETURN METHODS OBJECT 
  return {
    initialize: function ( $super, $element, settings ) {
      var Tip = this,
        defaults = {
            delay: 300,
            placement: 'above',
            offsetTop: 0,
            offsetLeft: 0,
            template: '<div class="tip"><div class="arrow"></div><div class="content"><%= content %></div></div>'
        },
        open = false,
        $body = $( 'body' ),
        $tip,
        position;

      if( settings.content === undefined ) {
        settings.content = $element.attr( 'title' );
        $element.removeAttr( 'title' );
      }

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      $tip = $( _.template( settings.template, { content: settings.content } ) ).addClass( settings.placement );

      Tip.show = function() {
        if( open === false ) {
          
          $body.append( $tip );

          if( position === undefined ) {

            switch ( settings.placement ) {
              case 'below':
                position = {
                  top: $element.offset().top + $element.height() + settings.offsetTop,
                  left: $element.offset().left + $element.width() / 2 - $tip.width() / 2 - settings.offsetLeft
                };
                break;
              case 'above': 
                position = {
                  top: $element.offset().top - $tip.height() - settings.offsetTop,
                  left: $element.offset().left + $element.width() / 2 - $tip.width() / 2 - settings.offsetLeft
                };
                break;
              case 'left':
                position = {
                  top: $element.offset().top + $element.height() / 2 - $tip.height() / 2,
                  left: $element.offset().left - $tip.width() - settings.offsetLeft
                };
                break;
              case 'right':
                position = {
                  top: $element.offset().top + $element.height() / 2 - $tip.height() / 2,
                  left: $element.offset().left + $element.width() + settings.offsetLeft
                };
                break;
            };

          }

          $tip.css( position );
          open = true;

        }

      };
      Tip.hide = function() {
        if( open === true ) {
          $tip.remove();
          open = false;
        }
      };

      $element.hover( function( event ) {
        event.stopPropagation();
        Tip.show();
      }, function( event ) {
        event.stopPropagation();
        Tip.hide();
      } );
      $element.on( 'focus', function( event ) {
        event.stopPropagation();
        Tip.show();
      } );
      $element.on( 'blur', function( event ) {
        event.stopPropagation();
        Tip.hide();
      } );

    }
  };
}() ) );

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Tip;
}