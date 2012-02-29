var Spawn = require('child_process').exec,
    gitRoot = '../';

exports.compilation_levels = ['ADVANCED_OPTIMIZATIONS','SIMPLE_OPTIMIZATIONS','WHITESPACE_ONLY'];
exports.versions = ['dev'];
exports.filetoVersion = {};
exports.versionsFound = false;
exports.root = gitRoot;
    
(function findVersions() {
  Spawn( 'git rev-parse --show-toplevel', function(err, root) {
    exports.root = gitRoot = root.trim();
    Spawn( 'git grep "@version" ' + gitRoot + '/scripts', function(err, stdout) {
      var lines = stdout.trim().split(/\n/);
      lines.forEach(function(line) {
      
        var sections = line.split(/^([^:]+):/),
            file = sections && sections[1],
            versionNum = sections[2] && sections[2].match(/@version ([0-9]*\.[0-9]+|[0-9]+)$/),
            version = versionNum ? versionNum[1] : 'dev';
          
        if (exports.versions.indexOf(version) === -1) exports.versions.push(version);
      
        exports.filetoVersion[file] = parseFloat(version); //parseFloat('dev') === NaN and is intended.

      });
      
      exports.versionsFound = true;
    });  
  });
}());

exports.questions = {
  "compilation_level": function() {
    return {
      "question": "What level of compilation should we use (default: 2)? 1) ADVANCED_OPTIMIZATIONS 2) SIMPLE_OPTIMIZATIONS 3) WHITESPACE_ONLY + pretty_print",
      "answer":/^[1-3]$/,
      "help":"We run your code through Closure Compiler, so, if you're going straight to prod choose a smaller, more optmized option. Or if you'll be debugging try the pretty_print option."
    }
  },
  "path":  function() {
    return {
      "question": "Where should we output Lu to (default: " + gitRoot + "/bin)?",
      "answer": /.*/,
      "help": "Once we get a few more answers from you we'll run the code through a compiler and save it for you. We'll default to saving in the bin directory relative to where this script is running, but, we might want it else where."
    }
  },
  "underscore_mixins":  function() {
    return {
      "question": "Include Lu underscore mixins (default: y)? y/n",
      "answer": /^(y|n)?$/,
      "help": "TBD"
    }
  },
  "use_ptclass":  function() {
    return {
      "question": "Include ptClass (default: y)? y/n",
      "answer": /^(y|n)?$/,
      "help": "TBD"
    }
  },
  "version" : function() {
    return {
      question: 'What version of Lu controls would you like to use? Vaild versions are: ' + exports.versions.join(', '),
      answer: function( response ) {
        return exports.versions.indexOf( response.trim() ) > -1;
      },
      help: 'We\'ll copy over a version of Lu that is no higher than the version you specify for this question.'
    }
  }
}