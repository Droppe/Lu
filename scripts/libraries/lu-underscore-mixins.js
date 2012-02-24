//mixins for underscore.
( function luUnderscoreMixins () {
  var consl = window.console;
  _.mixin( {
    explodeURL: function ( url ) {
      var regexp = /^(([^:\/\?#]+):)?(\/\/([^\/\?#]*))?([^\.\?#]*)(\.([^\?#]*))?(\?([^#]*))?(#(.*))?/,
        exploded = regexp.exec( url ),
        urlFragments = {
          scheme: exploded[2],
          authority: exploded[4],
          path: exploded[5],
          extension: exploded[7],
          query: {},
          fragment: exploded[11]
        },
        queryPieces = exploded[9],
        i,
        j,
        chunk;

      if ( queryPieces ) {

        queryPieces = queryPieces.split( '&' );

        for ( j = queryPieces.length; i < j; i += 1 ) {
          chunk = queryPieces[i].split( '=' );
          urlFragments.query[chunk[0]] = chunk[1];
        }
      }

      return urlFragments;

    },
    //Facade for console.log
    log: function() {
      if ( consl ) {
        return console.log.apply( console,  arguments );
      }
    },
    //Facade for console.debug
    debug: function() {
      if ( consl ) {
        return console.debug.apply( console,  arguments );
      }
    },
    //Facade for console.info
    info: function() {
      if ( consl ) {
        return console.info.apply( console,  arguments );
      }
    },
    //Facade for console.warn
    warn: function() {
      if ( consl ) {
        return console.warn.apply( console,  arguments );
      }
    },
    //Facade for console.error
    error: function() {
      if ( consl ) {
        return console.error.apply( console,  arguments );
      }
    }
  } );
}() );