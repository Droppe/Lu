var Fs = require( 'fs' ),
    Path = require( 'path' ),
    Util = require( 'util' ),
    Readline = require( 'readline' ),
    Compiler = new (require( './compiler' ))( {type: 'jar'} ),
    args = require( 'optimist' ).argv,
    common = require( './common' ),
    //tester = require( '../test-server' ),
    questions = common.questions,
    luControls = common.filetoVersion,
    build;
    
build = {
  init: function() {
    if( args.build ) {
      build.startBuild();
    } else if( args.docs ) {
      build.makeDocs();
    } else if( args.test ) {
      build.runTests();
    }
    
  },
  startBuild: function() {
    //TODO lookup build answers from a passed in json file
    askBuildQuestions();
  },
  run: function() {
    parseBuildAnswers();
  },
  isRunDone: (function() {
    var runners = {
      'copy': false,
      'compile': false,
      'lu-config': false
    },
    failures = [];
    return function(runner, failed) {
      if (failed) {
        failures.push(runner);
      }
      runners[runner] = true;
      //TODO: this check is a bit rigid
      if( runners['copy'] && runners['compile'] && runners['lu-config'] ) {
        build.runDone(failures);
      }
    }
  }() ),
  runDone: function(failures) {
    var failed = !!failures.length;
    if (failed) {
      console.error( 'Build finished, but, with failures.' );
      console.error( 'Failed modules: ', failures);
      process.exit( -1 );
    }else {
      //TODO: process other cmdline options (like --zip)
      console.log( 'Build is done.' );
      process.exit( 0 );
    }
  },
  runTests: function() {
    console.log('Running tests');  
    tester.start();
  },
  makeDocs: function() {
    //TODO: creates docs
  },
  copy: function( from, to, callback ) {
    
    //verify directory structure exists
    var dir = Path.dirname(Path.resolve(to)),
        relativePath =  Path.relative('/', dir),
        names = relativePath.split('/');
    names.forEach(function(currDir, i) {
      var dir = names.slice(0, i).concat(currDir),
          path ='/' + dir.join('/');
          
      if (path && !Path.existsSync(path)) {
        Fs.mkdirSync(path);
      }
    });
    
    if (Path.existsSync(from)) {
      //copies a read stream to write stream.
      Util.pump( Fs.createReadStream( from ), Fs.createWriteStream( to ), callback );
    }else {
      //assumes `from` is a string to be written to `to`
      Fs.writeFile(to, from, callback);
    }
  }
};

function askBuildQuestions() {
  var cmdline = Readline.createInterface( process.stdin, process.stdout, null ),
      order = Object.keys( questions ).reverse();//['compilation_level', 'other'];
    
  ( function prompt( k ) {
    var key = k || order.pop(),
        question = questions[key] && questions[key]();
        
    if ( !question ) {
     return build.run(); 
    }

    cmdline.question( question.question + '\n', function( response ) {
      var isAnswered = typeof(question.answer) === 'function' ? question.answer( response ) : question.answer.test( response );
      if ( isAnswered ) {
        questions[key] = response;
        prompt();
      } else {
        if ( response === 'help' ) {
          console.log( question.help + '\n' );
        } else {
          console.log( 'Sorry I didn\'t understand your response. Try again.');
        } 
        prompt(key);
      }

    } );

  }() );

}

function parseBuildAnswers() {
  var code = [],
      srcCode = '',
      copyCount = 0,
      root = common.root,
      version = parseFloat( questions.version ),
      outputPath = Path.normalize( questions.path || (root + '/bin') ),
      scriptsPath = Fs.realpathSync( root + '/scripts' ),
      compilation_level = common.compilation_levels[ questions.compilation_level - 1 ];
      
  if ( isNaN( version ) ) version = 'dev';

  //verify output path exists
  if ( !Path.existsSync( outputPath ) ){
    Fs.mkdirSync( outputPath, 0777 )
  }
  //verify path for Lu controls exist
  if ( !Path.existsSync( outputPath + '/lu-controls' ) ){
    Fs.mkdirSync(outputPath + '/lu-controls', 0777 )
  }

  //concat lu.js together
  if( questions.use_ptclass === 'y' || questions.use_ptclass === '' ) {
    code.push( Fs.readFileSync( scriptsPath + '/libraries/ptclass.js' ).toString() );
  }

  if( questions.underscore_mixins === 'y' || questions.underscore_mixins === '' ) {
    code.push( Fs.readFileSync( scriptsPath + '/lu-underscore-mixins.js' ).toString() );
  }
  
  code.push( Fs.readFileSync( scriptsPath + '/lu.js' ).toString() );
  
  srcCode = code.join('\n');
  
  //compile lu.js
  Compiler.compile( srcCode, compilation_level, function( error, compiledSrc ) {
    if (error) {
      //there was an error compiling. Default to writing uncompile source
      compiledSrc = srcCode;
    }
    
    Fs.writeFileSync( outputPath + '/lu.js', compiledSrc, 'utf-8' );//TODO: turn this in to a build.copy call
    
    build.isRunDone( 'compile', !!error );
  } );
  
  //process and copy lu-config.js
  build.copy( scriptsPath + '/lu-config.js', outputPath + '/lu-config.js', function(error) {
    build.isRunDone( 'lu-config', !!error );
  } );
  
  //copy specified version of Lu controls to output path
  function isCopyDone() {
    ( --copyCount === 0 ) && build.isRunDone( 'copy' );
  }

  for( var control in luControls ) {
    if( luControls.hasOwnProperty( control ) && ( ( version === 'dev' && isNaN( luControls[control] ) ) || luControls[control] <= version ) ){
      var filename = Path.relative(root + '/scripts/lu-controls/', control),
          controlTo = outputPath + '/lu-controls/' + filename;
      
      //inc the amount of controls we're copying
      copyCount ++;
      
      //compile first, then copy
      Compiler.compile( Fs.readFileSync( control ), compilation_level, function( controlTo, error, compiledControl) {
        
        //copies a control (as a read stream) to the output path (as a write stream).)
        //if error, copy the uncompile source.
        if (error) {
          compiledControl = control;
        }
        build.copy( compiledControl, controlTo, isCopyDone ); 
        
      }.bind(null, controlTo));
    }

  }
}


//MAIN ENTRY POINT
build.init();
