var Fs = require( 'fs' ),
    Path = require( 'path' ),
    Util = require( 'util' ),
    Readline = require( 'readline' ),
    Compiler = require( './compiler' ),
    args = require( 'optimist' ).usage('Usage: $0 -x [num] -y [num]').argv,
    common = require( './common' ),
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
    }
    return function(runner) {
      runners[runner] = true;
      //TODO: this check is a bit rigid
      if( runners['copy'] && runners['compile'] && runners['lu-config'] ) {
        build.runDone();
      }
    }
  }() ),
  runDone: function() {
    //TODO: process other cmdline options (like --zip)
    console.log( 'Build is done.' );
    process.exit( 0 );
  },
  runTests: function() {
    //TODO: creates tests
  },
  makeDocs: function() {
    //TODO: creates docs
  },
  copy: function( from, to, callback ) {
    //copies a read stream to write stream.
    Util.pump( Fs.createReadStream( from ), Fs.createWriteStream( to ), callback );
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
      copyCount = 0,
      version = parseFloat( questions.version ),
      outputPath = Path.normalize( questions.path || '../bin' ),
      scriptsPath = Fs.realpathSync( '../scripts' ),
      compilation_level = common.compilation_levels[questions.compilation_level];
      
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
  
  //compile lu.js
  Compiler.compile( code, compilation_level, function( compiledSrc ) {
    Fs.writeFileSync( outputPath + '/lu.js', compiledSrc, 'utf-8' );
    build.isRunDone( 'compile' );
  } );
  
  //process and copy lu-config.js
  build.copy( scriptsPath + '/lu-config.js', outputPath + '/lu-config.js', function() {
    build.isRunDone( 'lu-config' );
  } );
  
  //copy specified version of Lu controls to output path
  function isCopyDone() {
    ( --copyCount === 0 ) && build.isRunDone( 'copy' );
  }

  for( var control in luControls ) {
    if( luControls.hasOwnProperty( control ) && ( ( version === 'dev' && isNaN( luControls[control] ) ) || luControls[control] <= version ) ){
      var filename = Path.basename( control ),
          controlTo = outputPath + '/lu-controls/' + filename;
      
      //inc the amount of controls we're copying
      copyCount ++;
      //copies a control (as a read stream) to the output path (as a write stream).)
      build.copy( control, controlTo, isCopyDone );   
    }

  }
}


//MAIN ENTRY POINT
build.init();