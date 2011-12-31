//mixins for underscore.
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
  console: function() {
    return {
      error: window.console.debug || function() {},
      warning: window.console.warning || function() {},
      info: window.console.info || function() {},
      debug: window.console.debug || function() {},
      log: window.console.log || function() {}
    }
  }
} );


// _.mixin( {
//   console: function() {

//   }
// };