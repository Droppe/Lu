var path = require( 'path' );
var fs = require( 'fs' );
var util = require( 'util' );
var Uglify = require( 'uglify-js' );
var exec = require( 'child_process' ).exec;
var Seq = require( 'seq' );
var glob = require( 'glob' );

var bu = require( '../util' );

function processDirectory( options, cb ) {
  var inDir = options.inDir;
  var outDir = options.outDir;
  var header = options.header;

  Seq()
  .seq(function() {
    bu.mkdirpSync( outDir );
    this.ok();
  })
  .seq(function() {
    glob( inDir+'/**/*.js', this );
  })
  .flatten()
  .parEach(function(filePath) {
    var nextFile = this;
    // for each file, uglify, attach header, place in output/lu-controls
    Seq()
    .par(function() {
      bu.grab( header, this );
    })
    .par(function() {
      bu.grabAndUglify( filePath, this );
    })
    .seq(function() {
      bu.concat( arguments, this );
    })
    .seq(function(file) {
      var target = filePath.replace(inDir, outDir);
      bu.mkdirpSync( path.dirname(target) );
      bu.write( target, file, this );
    })
    .seq(function() {
      nextFile();
    });
  })
  .seq(function() {
    // all files processed
    cb();
  });
}

module.exports = function( options, cb ) {
  // options.buildOutput
  // options.buildWithoutUnderscore
  // options.buildWithoutClass

  var outputDirectory = path.resolve( options.buildOutput );
  var inputDirectory = path.resolve( './scripts/' );
  var headerFile = path.resolve( './scripts/header.js' );

  var controlsInDirectory = path.resolve( inputDirectory, 'lu-controls' );
  var controlsOutDirectory = path.resolve( outputDirectory, 'lu-controls' );

  var decoratorsInDirectory = path.resolve( inputDirectory, 'lu-decorators' );
  var decoratorsOutDirectory = path.resolve( outputDirectory, 'lu-decorators' );

  Seq()
  .seq(function() {
    // create the output directory if it doesn't exist
    bu.mkdirpSync( outputDirectory );
    this.ok();
  })
  .seq(function() {
    // process the directory attaching headers and whatnot
    // lu-controls
    processDirectory( {
      inDir: controlsInDirectory,
      outDir: controlsOutDirectory,
      header: headerFile
    }, this );
  })
  .seq(function() {
    // read the scripts/lu-decorators dir
    // for each file, uglify, attach header, place in output/lu-decorators
    processDirectory( {
      inDir: decoratorsInDirectory,
      outDir: decoratorsOutDirectory,
      header: headerFile
    }, this );
  })
  .seq(function() {
    // copy lu-config to output dir
    bu.copy( path.resolve(inputDirectory, 'lu-config.js'), path.resolve(outputDirectory, 'lu-config.js'), this );
  })
  .seq(function() {
    var next = this;
    // assemble main Lu file
    // include underscore mixins if enabled
    // place into output directory
    Seq()
    .par(function() {
      bu.grab( path.resolve(inputDirectory, 'lu.js'), this );
    })
    .par(function() {
      if ( options.buildWithoutUnderscore ) {
        this.ok("");
      }
      else {
        bu.grab( path.resolve(inputDirectory, 'lu-underscore-mixins.js'), this );
      }
    })
    .par(function() {
      if ( options.buildWithoutClass ) {
        this.ok("");
      }
      else {
        bu.grab( path.resolve(inputDirectory, './libraries/class.js'), this );
      }
    })
    .seq(function() {
      bu.concat(arguments, this);
    })
    .par(function() {
      bu.grab( path.resolve(inputDirectory, 'header.js'), this );
    })
    .par(function(file) {
      bu.uglify(file, this);
    })
    .seq(function() {
      bu.concat(arguments, this);
    })
    .seq(function(file) {
      bu.write( path.resolve(outputDirectory, 'lu.js'), file, this);
    })
    .seq(function() {
      next();
    })
  })
  .seq(function() {
    cb();
  })
}