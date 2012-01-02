_.explodeURL = function ( url ) {
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

};


_.each( "assert count debug dir dirxml error group groupCollapsed groupEnd info log profile profileEnd time timeEnd trace warn".split(" "), function ( type ) {

  if ( typeof _[type] === "undefined" ) {

    _[type] = function () {
      var parameters = Array.prototype.slice.call( arguments );
      if ( window.LU_CONFIG && window.LU_CONFIG.debug && console && !!console[type] ) {
        _[type] = function () {
          parmaeters = parameters.push( ' ! LU ! ' );
          return console[type].apply( this, parameters );
        };
      }
      else {
        _[type] = function () {};
      }

      //_[type].apply( this, arguments );
    };

  }
  
} );


