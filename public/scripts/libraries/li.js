/**
 * Athena Core Javascript Library
 *
 * JSLint Settings:
 * jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true,
 * plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true,
 * immed: true, devel: true
 */

/*****************************************************************************
  Internet Information Superhighway 2.0 v5
*****************************************************************************/

// 'use strict';

( function( window, document, undefined ) {

/**
 * Module namespace
 * @property li
 * @type Object
 */
  var li = {},
  /**
   * List of JS files
   * @property modules
   * @type Array
   */
    modules = [],

  /**
   * Object containing meta data for each module
   * @property packages
   * @type Object
   */
  packages = {},
  /**
   * A hash-map of Resource Loaders
   * @property loaders
   * @type Object
   */
  loaders = {};

  //Allow resource sharing across *.linkedin.com,
  //This should be factored out via proxy.
  if( document.domain.match( 'linkedin.com' ) ) {
    document.domain = 'linkedin.com';
  }

  /**
   * Global configuration object
   * @property ENV_CONFIG
   * @type Object
   */
  window.ENV_CONFIG = ENV_CONFIG || {};

  // merge external and local global configs
  li.environment = _.extend( {
    debug: false,
    baseUri: ''
  }, ENV_CONFIG );

  /**
   * Stores packages in Local Storage if available 
   * @method cacheScript
   * @private
   * @param {String} id The package id
   */
  function cacheScript( id ) {
    var pckg,
      key;

    if( Modernizr.localstorage && li.environment.debug === false ) {
      pckg = packages[id];
      key = pckg.id + pckg.version;
      localStorage[key] = pckg.__script;
    }
  }
  
  /**
   * Executes/evals code.
   * @method evalScript
   * @private
   * @param {String} code The code to evaluate
   */
  function evalScript( code ) {
  
    if ( window.execScript ) {
      window.execScript( code );
    } else {
      /* 
        window.eval.call compresses the JS code into a single line,
        making it hard to debug.  Normal eval seems to work OK though.
      */
      if (li.environment.debug) {
        eval(code);
      }
      else {
        window.eval.call( window, code );
      }
    }
    
  }

  /**
   * Class to manage javascript dependencies
   * @class Require
   * @constructor
   * @param {Arra} ids The list of package ids to load.
   * @param {Function} callback The callback function to execute after loading is complete. 
   */
  function Require( ids, callback ) {
    var required = [],
      interfaces = ids,
      request;

    /**
     * Dynamically loads a script file 
     * @method getScript
     * @private
     * @param {String} id The identity key for the script
     */
    function getScript( id ) {
      var pckg = packages[id],
        key,
        loader = new ResourceLoader();

      /**
       * Loads an external resource
       * @class ResourceLoader
       * @constructor
       * @for Require
       */
      function ResourceLoader(){
        var ResourceLoader = this;

        /**
         * Generates a globally-unique identifer
         * @method guid
         * @private
         * @return {String} The id 
         */
        function guid() {
          function S4() {
            return ( ( ( 1 + Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 );
          }
          return ( S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4() );
        }

        /**
         * The id of the resource loader instance
         * @property id
         * @type String
         */
        ResourceLoader.id = guid();

        // Add this instance into the map of loaders
        loaders[ResourceLoader.id] = ResourceLoader;

        /**
         * Caches and evaluates the loaded script file. 
         * @method proxyEventHandler
         * @private
         * @param {Object} response The data returned from loading the script via XHR
         */
        ResourceLoader.proxyEventHandler = function( response ) {
          pckg.__script = response;
          cacheScript( pckg.id );
          resolve( pckg.id );
        };
        
        /**
         * Description 
         * @method Name
         * @public|private
         * @param {Type} Name Description
         */
        
        
        ResourceLoader.load = function( url ){
          ( function recurse() {
            if( window.getResource ) {
              window.getResource( ResourceLoader.id, url );
            } else {
              window.setTimeout( recurse, 1 );
            }
          }() );
        };
        
      }

      function resolve( id ) {
        var i,
          code;

        for( i in packages ) {
          packages[i].requires = _.reject( packages[i].requires, function ( item ) {
            return ( item === id );
          } );
        }

        required = _.reject( required, function( item, index ) {
          if( packages[item].requires.length === 0 && packages[item].__script ) {
            if( li.environment.debug ) {
              // The @ sourceURL forces Firebug to display the filename instead of a generic sequence number on the eval'd code.
              code = ( '( function () {\n' + packages[item].__script + '\nconsole.log(\'Module "' + item + '" ready.\' );\n}() );//@ sourceURL=' + packages[item].path );
            } else {
              code = ( '( function () {\n' + packages[item].__script + '\n}() );' );
            }
          
            try {
              evalScript( code );
            } catch ( e ) {
              console.error( 'Module ', item, ' could not be loaded.\n', e );
              return false;
            }
          
            if( module.exports !== true ) {
              eval( packages[item].__namespace + ' = module.exports;' );
              module.exports = true;
            }
          
            return true;
          
          } else {
            return false;
          }
        } );

        if( required.length === 0 ) {
          applyCallback( callback );
        }

      }

      if( Modernizr.localstorage && li.environment.debug === false ) {
        key = pckg.id + pckg.version;
        if( localStorage[key] ) {
          pckg.__script = localStorage[key];
          resolve( pckg.id );
          return;
        }
      }

      loader.load( pckg.path );

      return;

    }
    function require( ids ) {
      _.each( ids, function( item, index ) {

        var pckg = packages[item],
          requirements,
          namespaces = item.split( '/' ),
          namespace = 'li',
          context = li;

        _.each( namespaces, function( item, index ) {

          if( context[namespaces[index]] === undefined ) {
            context[namespaces[index]] = {};
          }

          context = context[namespaces[index]];
          namespace += '[\'' + namespaces[index] + '\']';

        } );

        if( !pckg ) {
          console.error( 'The Module with id ' + item + ' is not defined.' );
          return;
        }

        if( !pckg.__required ) {
          pckg.__required = true;
          pckg.__namespace = namespace;
          requirements = pckg.requires;

          ( function recurse( requirements ) {
            if( requirements.length > 0 ) {
              _.each( requirements, function( item, index ) {
                recurse( packages[item].requires );
                if( _.indexOf( pckg.requires, item ) === -1 ) {
                  pckg.requires.push( item );
                }
              } );
            }
          }( requirements ) );

          getScript( pckg.id );

        }

      } );
    }
    function applyCallback( callback ) {
      _.each( interfaces, function( item, index ) {
        interfaces[ index ] = eval( packages[item].__namespace );
      } );
      callback.apply( this, interfaces );
    }

    this.execute = function() {
      ( function gather( ids ) {
        _.each( ids, function( item, index ) {
          if (packages[item]) {
            gather( packages[ item ].requires );
          }
          
          if( _.indexOf( modules, item ) === -1 ) {
            required.push( item );
            modules.push( item );
          }
        } );
      }( ids ) );

      if( required.length > 0 ) {
        require( required );
      }
    };

  }

  li.define = function( definitions ){
    _.each( definitions, function( item, index ) {
      packages[item.id] = {
        id: item.id,
        version: item.version,
        requires: item.requires || [],
        path: item.path || li.environment.baseUri + item.id + '.js'
      };
    } );
  };
  
  li.require = function( ids, callback ){
    var pckg;
    if( typeof ids === 'string' ){
      pckg = packages[ids];
      return eval( pckg.__namespace );
    }
    new Require( ids, callback ).execute();
    return false;
  };
  
  li.proxyEventHandler = function ( event ) {
    var parameters = event.data.split( '&response=' ),
      response,
      key;

    response = parameters[1];
    key = parameters[0].split( '?key=' )[1];

    loaders[key].proxyEventHandler( response );

  };

  //CommonJS
  window.module = { exports: true };

  //Expose li, module to global scope
  window.li = li;

}( this, this.document ) );

( function DependancyTree(){

  li.define( [
    {
      id: 'libraries/klass',
      version: '1.0',
      path: '/scripts/libraries/klass.js'
    }, {
        id: 'libraries/athena',
        version: '0.0.1',
        path: '/scripts/libraries/athena-0.0.1.js',
        requires: ['libraries/klass']
    }, {
      id: 'providers/Event',
      version: '0.0.1',
      path: '/scripts/packages/providers/Event.js',
      requires: ['libraries/klass']
    }, {
      id: 'ui/Abstract',
      version: '0.0.1',
      path: '/scripts/packages/ui/Abstract.js',
      requires: ['libraries/klass', 'providers/Event']
    }, {
      id: 'ui/Button',
      version: '0.0.1',
      path: '/scripts/packages/ui/Button.js',
      requires: ['ui/Abstract']
    }, {
      id: 'ui/List',
      version: '0.0.1',
      path: '/scripts/packages/ui/List.js',
      requires: ['ui/Abstract']
    }, {
      id: 'ui/Carousel',
      version: '0.0.1',
      path: '/scripts/packages/ui/Carousel.js',
      requires: ['ui/Abstract', 'ui/List']
    }, {
      id: 'ui/Button/Next',
      version: '0.0.1',
      path: '/scripts/packages/ui/Button/Next.js',
      requires: ['ui/Button']
    }, {
      id: 'ui/Button/Previous',
      version: '0.0.1',
      path: '/scripts/packages/ui/Button/Previous.js',
      requires: ['ui/Button']
    }, {
      id: 'ui/Button/Select',
      version: '0.0.1',
      path: '/scripts/packages/ui/Button/Select.js',
      requires: ['ui/Abstract', 'ui/Button']
    }, {
      id: 'ui/Button/Play',
      version: '0.0.1',
      path: '/scripts/packages/ui/Button/Play.js',
      requires: ['ui/Button']
    }, {
      id: 'ui/Button/Pause',
      version: '0.0.1',
      path: '/scripts/packages/ui/Button/Pause.js',
      requires: ['ui/Button']
    }
  ] );

}() );