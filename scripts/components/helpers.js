var helpers = {},
  //thanks to Gruber: http://daringfireball.net/2010/07/improved_regex_for_matching_urls
  urlRegExp = /\b((?:[a-z][\w\-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;


//Facade for the browser's developer console
//Does not break if no developer console exists
helpers.console = ( function(){
  var slice = Array.prototype.slice,
    windowConsole = window.console,
    debug = window.LU_CONFIG.debug;

  function consolas( method, args ){
    if( windowConsole ){
      if( typeof windowConsole[method] === 'function' ){
        return windowConsole[method].apply( windowConsole, slice.call( args ) );
      } else if ( typeof windowConsole[method] === 'object' ){
        return Function.prototype.call.call( windowConsole[method], windowConsole, slice.call( args ) );
      }
    }
  }

  function emptyFunction(){}

  if( debug === false ){

    return {
      error: emptyFunction,
      warn: emptyFunction,
      info: emptyFunction,
      debug: emptyFunction,
      log: emptyFunction
    };
  }

  return {
    error: function(){
      if( debug >= 1 ){
        return _.error( arguments );
      }
    },
    warn: function(){
      if( debug >= 2 ){
        return consolas( 'warn', arguments );
      }
    },
    info: function(){
      if( debug >= 3 ){
        return consolas( 'info', arguments );
      }
    },
    debug: function(){
      if( debug >= 4 ){
        return consolas( 'debug', arguments );
      }
    },
    log: function(){
      if( debug >= 5 ){
        return consolas( 'log', arguments );
      }
    }
  };
}() );

//check to see if passed in value is a url.
helpers.isUrl = function( url ){
  return urlRegExp.test( url );
};

// Based on parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
function parseUri( str ){
  var o = parseUri.options,
    m = o.parser[o.strictMode ? 'strict' : 'loose'].exec( str ),
    uri = {},
    i = 14;

  while( i > 0 ){
    i -= 1;
    uri[o.key[i]] = m[i] || '';
  }

  uri[o.q.name] = {};
  uri[o.key[12]].replace( o.q.parser, function( $0, $1, $2 ){
    if( $1 ){
      uri[o.q.name][$1] = $2;
    }
  } );

  return uri;
}

parseUri.options = {
  strictMode: false,
  key: [ 'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

helpers.parseUri = parseUri;

//Trim
helpers.trim = ( function () {
  if( typeof String.prototype.trim === 'function' ) {
    return function( input ){
      return input.trim();
    };
  } else {
    return function( input ) {
      return input.replace( /^\s+|\s+$/g, '' );
    };
  }
}() );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( helpers );
  } else if( module.exports ){
    module.exports = helpers;
  }
}