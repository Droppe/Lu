//mixins for underscore.
( function luUnderscoreMixins(){
  var cnsl = window.console;

  function doit( method, args ){
    if( cnsl ){
      if( typeof cnsl[method] === 'function' ){
        return cnsl[method].apply( cnsl, Array.prototype.slice.call( args ) );
      } else if ( typeof cnsl[method] === 'object' ){
        return Function.prototype.call.call( cnsl[method], cnsl, Array.prototype.slice.call( args ) );
      }
    }
  }

  _.mixin( {
    explodeURL: function ( url ){
      var regexp = /^(([^:\/\?#]+):)?(\/\/([^\/\?#]*))?([^\.\?#]*)(\.([^\?#]*))?(\?([^#]*))?(#(.*))?/,
        exploded = regexp.exec( url ),
        urlFragments = {
          scheme: exploded[2],
          authority: exploded[4],
          path: exploded[5],
          extension: exploded[7],
          query: {},
          fragment: exploded[11]
        },
        queryPieces = exploded[9],
        i,
        j,
        chunk;

      if( queryPieces ){

        queryPieces = queryPieces.split( '&' );

        for( j = queryPieces.length; i < j; i += 1 ){
          chunk = queryPieces[i].split( '=' );
          urlFragments.query[chunk[0]] = chunk[1];
        }
      }

      return urlFragments;
    },
    isURL: function( value ){
      var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
      return regexp.test( value );
    },
    //Facade for console.log
    log: function(){
      return doit( 'log', arguments );
    },
    //Facade for console.debug
    debug: function(){
      return doit( 'debug', arguments );
    },
    //Facade for console.info
    info: function(){
      return doit( 'info', arguments );
    },
    //Facade for console.warn
    warn: function(){
      return doit( 'warn', arguments );
    },
    //Facade for console.error
    error: function(){
      return doit( 'error', arguments );
    },
    wait: function( milliseconds ){
      milliseconds += new Date().getTime();
      while( new Date() < milliseconds ){}
    },
    trim: (function () {
      console.log('first');
      if (typeof String.prototype.trim === 'function') {
        return function (input) {
          return input.trim();
        };
      }
      else {
        return function (input) {
          return input.replace(/^\s+|\s+$/g, '');
        };
      }
    }())
  } );
}() );