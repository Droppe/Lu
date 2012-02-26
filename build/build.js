/**
LU BUILD SCRIPT:

-bundle:
  lu-underscore-mixins
  ptClass
  
-min/dev
-flag for controls (what "version" of controls to bring in; e.g. --version=1.2 would pull in versions no higher than 1.2)
-build docs
-run tests


//args to run via a config file

*/

var Fs = require('fs'),
    Path = require('path'),
    Util = require('util'),
    Readline = require('readline'),
    Compiler = require('./compiler'),
    Ee = new (require('events').EventEmitter),
    Args = require('optimist').argv,
    common = require('./common'),
    questions = common.questions,
    luControls = common.filetoVersion;
   
Ee.on('question', function() {
  var cmdline = Readline.createInterface(process.stdin, process.stdout, null),
      order = Object.keys(questions).reverse();//['compilation_level', 'other'];

  (function prompt(k) {
    var key = k || order.pop(),
        question = questions[key] && questions[key]();

    if (question) {
      cmdline.question(question.question + '\n', function(response) {
        var isAnswered = typeof(question.answer) === 'function' ? question.answer(response) : question.answer.test(response);

        if (isAnswered) {
          questions[key] = response;
          prompt();
        }else {
          if (response === "help") console.log(question.help + '\n');
          else console.log('Sorry I didn\'t understand your response. Try again.');
          prompt(key);
        }

      });
    }else {
      Ee.emit('isQuestioned');
    }

  }());
}); 
Ee.on('isQuestioned', function() {
  var code = [],
      compilation_level = ['ADVANCED_OPTIMIZATIONS','SIMPLE_OPTIMIZATIONS','WHITESPACE_ONLY'][questions.compilation_level],
      version = parseFloat(questions.version),
      outputPath = Path.normalize(questions.path || '../bin/'),
      scriptsPath = Fs.realpathSync('../scripts');
      
  if (isNaN(version)) version = 'dev';

  //VERIFY OUTPUT PATH EXISTS
  if (!Path.existsSync(outputPath)){
    Fs.mkdirSync(outputPath, 0777)
  }
  if (!Path.existsSync(outputPath + '/lu-controls')){
    Fs.mkdirSync(outputPath + '/lu-controls', 0777)
  }

  //CONCAT LU.JS
  if (questions.use_ptclass === 'y' || questions.use_ptclass === '') {
    code.push(Fs.readFileSync(scriptsPath + '/libraries/ptclass.js').toString());
  }
  if (questions.underscore_mixins === 'y' || questions.underscore_mixins === '') {
    code.push(Fs.readFileSync(scriptsPath + '/libraries/lu-underscore-mixins.js').toString());
  }
  
  code.push(Fs.readFileSync(scriptsPath + '/lu.js').toString());
  
  //COMPILE LU.JS
  Compiler.compile(code, compilation_level, function(compiledSrc) {
    Fs.writeFileSync(outputPath + '/lu.js', compiledSrc, 'utf-8');
  });
  
  //COPY LU CONTROLS
  var copyIsDone = false,
      copyCount = 0,
      isDone = function() {
        return --copyCount === 0;
      };
  for (var control in luControls) {
    if (luControls.hasOwnProperty(control) && (luControls[control] <= version || (version === 'dev' && isNaN(luControls[control])))) {
      var filename = Path.basename(control);
      copyCount++;
      Util.pump(
        Fs.createReadStream(control),
        Fs.createWriteStream(outputPath + '/lu-controls/' + filename),
        function() {
          if (isDone()) console.log("DONE COPYING");
        }
      )
    }
  }
  
  
});


//MAIN ENTRY POINT
if (Args.build) {
  Ee.emit('question');
}else if (Args.docs) {
  Ee.emit('buildDocs');
}else if (Args.test) {
  Ee.emit('runTests');
}