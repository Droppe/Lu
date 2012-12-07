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
      '\n *' + 
      '\n */'
    },
    lint: {
      files: ['grunt.js', 'scripts/components/**/*.js', 'scripts/*.js']
    },
    yuidoc: {
      compile: {
        "name": "The Lu Component API",
        "description": "Lu Component API Documentation",
        "logo": "http://use.lu/images/logo.png",
        "version": "0.3.x",
        "url": "http://github.com/linkedin/Lu",
        "options": {
          "paths": "scripts",
          "exclude": "scripts/libraries", 
          "outdir": "./docs/yuidoc"
        }
      }
    },
    qunit: {
      files: [
        'http://localhost:1337/test/abstract/abstract.html',
        'http://localhost:1337/test/lu/lu.html',
         'http://localhost:1337/test/placeholder/placeholder.html',
        'http://localhost:1337/test/$/$.html',
        'http://localhost:1337/test/list/list.html',
        //'http://localhost:1337/test/tip/tip.html',
        'http://localhost:1337/test/carousel/carousel.html',
        'http://localhost:1337/test/dropdown/dropdown.html',
        'http://localhost:1337/test/switch/switch.html',
        'http://localhost:1337/test/viewport/viewport.html'
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
      StateDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/decorators/state.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/decorators/state.js'
      },
      AbstractComponent: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Abstract.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Abstract.js'
      },
      ButtonComponent: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button.js'
      },
      DefaultButtonDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/default.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/default.js'
      },
      FirstButtonDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/first.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/first.js'
      },
      LastButtonDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/last.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/last.js'
      },
      LoadButtonDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/load.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/load.js'
      },
      NextButtonDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/next.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/next.js'
      },
      PauseButtonDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/pause.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/pause.js'
      },
      PlayButtonDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/play.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/play.js'
      },
      PreviousButtonDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/previous.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/previous.js'
      },
      SelectButtonDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/select.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/select.js'
      },
      StateButtonDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Button/decorators/state.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Button/decorators/state.js'
      },
      CarouselComponent: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Carousel.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Carousel.js'
      },
      constants: {
        src: ['<banner>', 'scripts/<%= componentPath %>/constants.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/constants.js'
      },
      ContainerComponent: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Container.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Container.js'
      },
      helpers: {
        src: ['<banner>', 'scripts/<%= componentPath %>/helpers.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/helpers.js'
      },
      ListComponent: {
        src: ['<banner>', 'scripts/<%= componentPath %>/List.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/List.js'
      },
      SwitchComponent: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Switch.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Switch.js'
      },
      PlaceholderComponent: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Placeholder.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Placeholder.js'
      },
      FormElementComponent: {
        src: ['<banner>', 'scripts/<%= componentPath %>/FormElement.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/FormElement.js'
      },
      TipComponent: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Tip.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Tip.js'
      },
      AboveTipDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Tip/decorators/above.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Tip/decorators/above.js'
      },
      BelowTipDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Tip/decorators/below.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Tip/decorators/below.js'
      },
      LeftTipDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Tip/decorators/left.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Tip/decorators/left.js'
      },
      RightTipDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Tip/decorators/right.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Tip/decorators/right.js'
      },
      ViewportListDecorator: {
        src: ['<banner>', 'scripts/<%= componentPath %>/List/decorators/viewport.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/List/decorators/viewport.js'
      },
      DropdownComponent: {
        src: ['<banner>', 'scripts/<%= componentPath %>/Dropdown.js'],
        dest: 'dist/<%= pkg.version %>/<%= componentPath %>/Dropdown.js'
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


  // Generate docs
  grunt.loadNpmTasks('grunt-contrib-yuidoc');

  // Default task.
  grunt.registerTask( 'default', '' );

};
