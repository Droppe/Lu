var nodeStatic = require( 'node-static' ),
	path = require( 'path' ),
	http = require( 'http' ),
	util = require( 'util' ),
	url = require( 'url' ),
	spawn = require( 'child_process' ).spawn,
	argv = require( 'optimist' ).argv,
	fs = require('fs'),
	port = 80,
	fileServer = new nodeStatic.Server( path.normalize( __dirname ) ),

	UNIT_TESTS_DIR = 'test/unit-tests/',

	browserSession,

	app,
	unitTests = [],

	Browsers = {
		Chrome: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
		Firefox: '/Applications/Firefox.app/Contents/MacOS/firefox'
	};

tester = {
	init: function(files) {
		tester.createServer();
		tester.prepareUnitTests(files);
		tester.startSocketIOListener();
		tester.openBrowser();
	},
	createServer: function() {
		app = http.createServer( function( request, response ) {

			var path = url.parse( request.url ).pathname;

			if ( path === '/test/getTests' ) {

				response.writeHead(200, { 'Content-type': 'application.json '});
				response.write(JSON.stringify(unitTests))
				response.end();

			} else {

				fileServer.serve( request, response, function( error, result ) {
					if (error) {
						console.log(error);
						util.log( request.url );
					}
				} );

			}

		} ).listen( port );
	},
	prepareUnitTests: function(files) {
		if ( files && files.length > 0 ) {
			unitTests = files;
			return;
		}
		unitTests = argv._.length > 0 ? argv._ : fs.readdirSync( path.normalize( __dirname + '/' + UNIT_TESTS_DIR) );
	},
	startSocketIOListener: function() {
		var filesLeft = 0,

			testResult = {
				files: 0,
				failed: 0,
				passed: 0,
				total: 0,
				details: []
			};

		function onUnitTestExecuting( file ) {
			console.log('\n');
			console.log('Executing ' + color('cyan', file));
		}

		function onUnitTestComplete( data ) {
		  	filesLeft--;
		  	testResult.failed += data.failed;
		  	testResult.passed += data.passed;
		  	testResult.total += data.total;

			console.log( util.format('total: %s, passed: %s, failed: %s', data.total, data.passed, data.failed ) );
			if ( data.failed > 0 ) {
				console.log( color( 'red', 'Failures:' ) );
				data.failedTests.forEach(function(test, index) {
					console.log(util.format( '(%d) %s: %s, %s: %s, %s: %s', index+1, color('grey', 'module'), test.module, color('grey', 'test'), test.name, color('grey', 'details'), test.message ) );
				});	
			}

		    if ( filesLeft === 0 ) {
		    	console.log( '\nTest complete!' );
		    	console.log( util.format( 'total: %s, passed: %s, failed: %s \n', testResult.total, testResult.passed, testResult.failed ) );

		    	testResult.failed = 0;

		    	browserSession.kill();
		    }
		}

		function onSocketConnection( socket ) {
		  filesLeft = unitTests.length;
		  socket.on('executing', onUnitTestExecuting);
		  socket.on('done', onUnitTestComplete);
		}

		io = require( 'socket.io' ).listen( app ),
		io.sockets.on( 'connection', onSocketConnection );
	},
	openBrowser: function() {
		browserSession = spawn( Browsers.Firefox, ['http://localhost/test/index.html'] );
	}
}

var color = (function () {
	var clrs = {
			red   : '\033[31m',
			green : '\033[32m',
			blue  : '\033[34m',
			cyan  : '\033[36m',
			grey  : '\033[90m',
	    },
	    reset = '\033[0m';

    return function(c, str) {
		return clrs[c] + str + reset;
	}
})();

tester.init();

exports.tester = tester;