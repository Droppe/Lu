var nodeStatic = require( 'node-static' ),
  path = require( 'path' ),
  http = require( 'http' ),
  util = require( 'util' ),
  port = 1337,
  fileServer = new nodeStatic.Server( path.normalize( __dirname ) );

http.createServer( function( request, response ) {

  fileServer.serve( request, response, function( error, result ) {
    util.log( request.url );
  } );

} ).listen( port );

util.log( 'The Lu server is running. Point your browser to http://localhost:' + port + '/examples/index.html' );