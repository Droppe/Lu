/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.

  grunt.initConfig( {
    pkg: '<json:package.json>',
    componentPath: 'components',
    meta: {
      banner: '/**' +
      '\n * <%= pkg.name %> version <%= pkg.version %>' +
      '\n * @author <%= pkg.author.name %> <<%= pkg.author.email %>>' +
      '\n * @license' +
      '\n *' +
      '\n * Please thank the contributors:' +
      '\n * https://github.com/linkedin/Lu/graphs/contributors' +
      '\n *' +
      '\n * Copyright (c) 2011,2012 LinkedIn' +
      '\n * All Rights Reserved. Apache Software License 2.0' +
      '\n *' +
      '\n * Licensed under the Apache License, Version 2.0 (the "License");' +
      '\n * you may not use this file except in compliance with the License.' +
      '\n * You may obtain a copy of the License at' +
      '\n *' +
      '\n * http://www.apache.org/licenses/LICENSE-2.0' +
      '\n *' +
      '\n * Unless required by applicable law or agreed to in writing, software' +
      '\n * distributed under the License is distributed on an "AS IS" BASIS,' +
      '\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.' +
      '\n * See the License for the specific language governing permissions and' +
      '\n * limitations under the License.' +
      '\n */'
    },
    lint: {
      files: ['grunt.js', 'scripts/components/**/*.js', 'scripts/*.js']
    },
    qunit: {
      files: [
        'http://localhost:1337/test/abstract/abstract.html',
        'http://localhost:1337/test/lu/lu.html',
        'http://localhost:1337/test/placeholder/placeholder.html',
        'http://localhost:1337/test/$/$.html',
        'http://localhost:1337/test/list/list.html',
        'http://localhost:1337/test/tip/tip.html',
        'http://localhost:1337/test/carousel/carousel.html',
        'http://localhost:1337/test/dropdown/dropdown.html',
        'http://localhost:1337/test/switch/switch.html'
      ]
    },
    concat: {
      config: {
        src: ['<banner>', 'scripts/config.js'],
        dest: 'dist/<%= pkg.version %>/config.js'
      }
    },
    min: {
      core: {
        src: ['<banner>', 'scripts/lu.js'],
        dest: 'dist/<%= pkg.version %>/lu.js'
      },
      mappers: {
        src: ['<banner>', 'scripts/mappers.js'],
        dest: 'dist/<%= pkg.version %>/mappers.js'
      },
      a: {
        src: ['<banner>', 'scripts/<%= componentPath %>/decorators/state.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/decorators/state.js'
      },
      b: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Abstract.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Abstract.js'
      },
      c: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button.js'
      },
      d: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/default.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/default.js'
      },
      e: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/first.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/first.js'
      },
      f: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/last.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/last.js'
      },
      g: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/load.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/load.js'
      },
      h: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/next.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/next.js'
      },
      i: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/pause.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/pause.js'
      },
      j: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/play.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/play.js'
      },
      k: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/previous.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/previous.js'
      },
      l: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/select.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/select.js'
      },
      m: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/state.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/state.js'
      },
      n: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Carousel.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Carousel.js'
      },
      o: {
        src: ['<banner>', 'scripts/<%= componentPath %>/constants.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/constants.js'
      },
      p: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Container.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Container.js'
      },
      q: {
        src: ['<banner>', 'scripts/<%= componentPath %>/helpers.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/helpers.js'
      },
      r: {
        src: ['<banner>', 'scripts/<%= componentPath %>/List.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/List.js'
      },
      s: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Switch.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Switch.js'
      },
      t: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Placeholder.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Placeholder.js'
      },
      u: {
        src: ['<banner>', 'scripts/<%= componentPath %>/FormElement.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/FormElement.js'
      },
      v: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Tip.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Tip.js'
      },
      w: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Tip/decorators/above.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Tip/decorators/above.js'
      },
      x: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Tip/decorators/below.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Tip/decorators/below.js'
      },
      y: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Tip/decorators/left.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Tip/decorators/left.js'
      },
      z: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Tip/decorators/right.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Tip/decorators/right.js'
      }
    },
    jshint: {
      options: {
        "bitwise": true,
        "camelcase": true,
        "curly": true,
        "eqeqeq": true,
        "forin": false,
        "immed": true,
        "indent": 2,
        "latedef": true,
        "newcap": true,
        "noarg": true,
        "noempty": false,
        "nonew": true,
        "plusplus": false,
        "quotmark": "single",
        "regexp": false,
        "undef": true,
        "unused": true,
        "strict": false,
        "trailing": true,
        "asi": false,
        "boss": false,
        "debug": false,
        "eqnull": true,
        "es5": false,
        "esnext": false,
        "evil": true,
        "expr": false,
        "funcscope": false,
        "globalscript": false,
        "iterator": false,
        "lastsemic": false,
        "laxbreak": false,
        "laxcomma": false,
        "loopfunc": false,
        "multistr": true,
        "onecase": false,
        "proto": false,
        "regexdash": false,
        "scripturl": false,
        "smarttabs": false,
        "shadow": true,
        "sub": true,
        "supernew": false,
        "validthis": false,
        "jquery": true,
        "browser": true
      },
      globals: {
        Lu: true,
        module: true,
        require: true,
        Inject: true,
        _: true
      }
    }
  } );

  // Build task.
  grunt.registerTask( 'build', 'lint qunit concat min' );

  // Default task.
  grunt.registerTask( 'default', '' );

};
