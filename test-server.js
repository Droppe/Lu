var nodeStatic = require( 'node-static' ),
	path = require( 'path' ),
	http = require( 'http' ),
	util = require( 'util' ),
	url = require( 'url' ),
	spawn = require( 'child_process' ).spawn,
	fs = require('fs'),

	config = require('./test/config'),

	argv = require( 'optimist' )
		.alias('b', {
			alias: 'browser',
			default: 'all',
			describe: 'browser(s) to run tests in'
		})
		.boolean('k', {
			alias: 'keep',
			default: false,
			describe: 'keep browser(s) open'
		})
		.argv,

	port = 8000,
	fileServer = new nodeStatic.Server( path.normalize( __dirname ) ),

	UNIT_TESTS_DIR = 'test/unit-tests/',

	browserSession,

	app,
	unitTests = [],
	browserIndex = 0,

	options = {
		keepBrowserOpen: false,
		browser: null
	};

tester = {
	init: function() {
		
		(function computeOptions() {
			console.log('ARGS', argv);

			if (argv.k) {
				options.keepBrowserOpen = true;
			}

			if (!argv.b || argv.b === 'all') {
				options.browser = [];
				for (var key in config.browsers) {
					options.browser.push(config.browsers[key]);
				}
			} else if (argv.b) {
				options.browser = [config.browsers[argv.b]];
			}
		})();

		tester.createServer();
		tester.prepareUnitTests();
		tester.startSocketIOListener();
		tester.startNextBrowserSession();
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
	prepareUnitTests: function() {
		unitTests = argv._.length > 0 ? argv._ : fs.readdirSync( path.normalize( __dirname + '/' + UNIT_TESTS_DIR) );
	},
	startSocketIOListener: function() {
		var filesLeft = 0,
			unitTestResult;

		function resetUnitTestsResult() {
			unitTestResult = {
				files: 0,
				failed: 0,
				passed: 0,
				total: 0,
				details: []
			};
		};

		resetUnitTestsResult();

		function onUnitTestExecuting( file ) {
			console.log('\nExecuting ' + color('cyan', file));
		}

		function onUnitTestComplete( data ) {

			// Increment the test result values
		  	unitTestResult.failed += data.failed;
		  	unitTestResult.passed += data.passed;
		  	unitTestResult.total += data.total;

			console.log( util.format('total: %s, passed: %s, failed: %s', data.total, data.passed, data.failed ) );

			// Print the failures
			if ( data.failed > 0 ) {
				console.log( color( 'red', 'Failures:' ) );
				data.failedTests.forEach(function(test, index) {
					console.log(util.format( '(%d) %s: %s, %s: %s, %s: %s', index+1, color('grey', 'module'), test.module, color('grey', 'test'), test.name, color('grey', 'details'), test.message ) );
				});	
			}

			// Print the total result of all unit tests: total, passed, failed
			filesLeft--;
		    if ( filesLeft === 0 ) {
		    	console.log( '\nTest complete!' );
		    	console.log( util.format( 'total: %s, passed: %s, failed: %s \n', unitTestResult.total, unitTestResult.passed, unitTestResult.failed ) );

		    	resetUnitTestsResult();

		    	tester.startNextBrowserSession();
		    }

		    
		}

		function onSocketConnection( socket ) {
		  filesLeft = unitTests.length;
		  socket.on('executing', onUnitTestExecuting);
		  socket.on('done', onUnitTestComplete);
		}

		io = require( 'socket.io' ).listen( app ),
		io.set('log level', -1);
		io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
		io.sockets.on( 'connection', onSocketConnection );
	},
	startNextBrowserSession: function() {
		if (browserSession/* && !options.keepBrowserOpen */) {
    		browserSession.kill();
		}

		// If we've completed running all the unit tests through all the specified
		// browsers, we're done
		if (browserIndex === options.browser.length) {
			console.log('\nAll unit tests have run.')
			return;
		}

		console.log('\n=================================')
		console.log(options.browser[browserIndex]);

		// Open the next browser session
		browserSession = spawn('open', ['-a', options.browser[browserIndex], 'http://localhost:8000/test/index.html'] );
		browserIndex++;
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

exports.start  = tester.init