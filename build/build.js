var path = require( 'path' );
var tasks = require( './tasks' );
var bu = require( './util' );

var defaultOutput = path.resolve( './bin' );

// optimist
var optimist = require( 'optimist' )
    .usage( 'lu command tool.\nUsage: $0 [task]' )
    .alias( 'help', 'h' )
    .describe( 'help', 'show this message' )

    // from build task
    .describe( 'buildOutput', 'output directory for your build' )
    .default( 'buildOutput', defaultOutput )
    .describe( 'buildWithoutUnderscore', 'disable the underscore.js mixins' )
    .default( 'buildWithoutUnderscore', false )
    .describe( 'buildWithoutClass', 'disable the ptclass include' )
    .default( 'buildWithoutClass', false );

var argv = optimist.argv;
var argv_ = argv._;

function done() {
  console.log("TASK COMPLETE");
}

switch( argv_[0] ) {
  case 'build':
    tasks.build(argv, done);
    break;
  case 'test':
    require( '../test-server' );
    break;
  case 'docs':
    console.log("DOCS Command Unavailable: Not Implemented");
    break;
  default:
    optimist.showHelp();
}
