/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.

  grunt.initConfig( {
    pkg: '<json:package.json>',
    componentPath: 'components',
    meta: {
      banner: '/**' +
      '\n * <%= pkg.name %> version <%= pkg.version %>' +
      '\n * @author <%= pkg.author %>' +
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
        'http://localhost:1337/test/lu/lu.html'
      ]
    },
    concat: {
      config: {
        src: ['<banner>', 'scripts/config.js'],
        dest: 'dist/config.js'
      }
    },
    //This needs to be re-written to look at the incoming file path
    min: {
      core: {
        src: ['<banner>', 'scripts/lu.js'],
        dest: 'dist/lu.' + '<%= pkg.version %>' + '.min.js'
      },
      mappers: {
        src: ['<banner>', 'scripts/mappers.js'],
        dest: 'dist/mappers.js'
      },
      a: {
        src: ['<banner>', 'scripts/<%= componentPath %>/decorators/state.js'],
        dest: 'dist/<%= componentPath %>/decorators/state.js'
      },
      b: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Abstract.js'],
        dest: 'dist/<%= componentPath %>/Abstract.js'
      },
      c: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button.js'],
        dest: 'dist/<%= componentPath %>/Button.js'
      },
      d: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/default.js'],
        dest: 'dist/<%= componentPath %>/Button/decorators/default.js'
      },
      e: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/first.js'],
        dest: 'dist/<%= componentPath %>/Button/decorators/first.js'
      },
      f: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/last.js'],
        dest: 'dist/<%= componentPath %>/Button/decorators/last.js'
      },
      g: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/load.js'],
        dest: 'dist/<%= componentPath %>/Button/decorators/load.js'
      },
      h: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/next.js'],
        dest: 'dist/<%= componentPath %>/Button/decorators/next.js'
      },
      i: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/pause.js'],
        dest: 'dist/<%= componentPath %>/Button/decorators/pause.js'
      },
      j: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/play.js'],
        dest: 'dist/<%= componentPath %>/Button/decorators/play.js'
      },
      k: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/previous.js'],
        dest: 'dist/<%= componentPath %>/Button/decorators/previous.js'
      },
      l: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/select.js'],
        dest: 'dist/<%= componentPath %>/Button/decorators/select.js'
      },
      m: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/state.js'],
        dest: 'dist/<%= componentPath %>/Button/decorators/state.js'
      },
      n: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Carousel.js'],
        dest: 'dist/<%= componentPath %>/Carousel.js'
      },
      o: {
        src: ['<banner>', 'scripts/<%= componentPath %>/constants.js'],
        dest: 'dist/<%= componentPath %>/constants.js'
      },
      p: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Container.js'],
        dest: 'dist/<%= componentPath %>/Container.js'
      },
      q: {
        src: ['<banner>', 'scripts/<%= componentPath %>/helpers.js'],
        dest: 'dist/<%= componentPath %>/helpers.js'
      },
      r: {
        src: ['<banner>', 'scripts/<%= componentPath %>/List.js'],
        dest: 'dist/<%= componentPath %>/List.js'
      },
      s: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Switch.js'],
        dest: 'dist/<%= componentPath %>/Switch.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        indent: 2,
        unused: true,
        quotmark: 'single',
        trailing: true,
        evil: true,
        jquery: true
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
  grunt.registerTask( 'build', 'lint concat min' );

  // Default task.
  grunt.registerTask( 'default', '' );

};
