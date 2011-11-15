var nStatic = require("node-static"),
    path = require("path"),
    Seq = require("seq"),
    fs = require("fs"),
    http = require("http"),
    sys = require("sys"),
    port = 3000,
    fileServer = new nStatic.Server( path.normalize("" + __dirname + "/public" ));
// start server on port 3000

http.createServer(function(request, response) {
  fileServer.serve( request, response, function(err, result) {
    sys.log( request.url );
  } );
}).listen( port );

sys.log( 'Server listening on port ' + port );