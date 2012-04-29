var path = require( 'path' ),
	http = require( 'http' ),
	util = require( 'util' ),
	nodeStatic = require( 'node-static' ),
	aq = require('aq'),
	app,
	port = 8001,
	fileServer = new nodeStatic.Server( path.normalize( __dirname ) );

app = http.createServer( function( request, response ) {

	fileServer.serve( request, response, function( error, result ) { } );

} ).listen( port );

util.log( 'Server listening on port ' + port );

(function start() {
	var options = {
			log: true,
			testFolder: 'unit-tests',
			dir: path.normalize(__dirname + '/test/unit-tests/'),
			page: '/test/index.html'
		};

	aq = aq.listen(app, options);

	aq.on('test-executing', function(data) {
		//console.log('SERVER::TEST::EXECUTING', data);
	});

	aq.on('test-done', function(data) {
		//console.log('SERVER::TEST::DONE', data);
	});

	aq.on('done', function(data) {
		//console.log('done', data);
	});

})();