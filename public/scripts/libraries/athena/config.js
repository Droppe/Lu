/**
 * Athena config
 * @class config
 */
( function() {

  if( typeof window.require === 'function' ) {
    if( typeof window.require.addRule === 'function' ) {
      //jQuery
      window.require.addRule( 'jquery', {
        path: '/scripts/libraries/jquery-1.7.js',
        pointcuts: {
          after: function() {
            module.setExports( jQuery.noConflict() );
            delete window[ 'jquery' ];
          }
        }
      });
      //Athena
      window.require.addRule( 'athena', {
        path: '/scripts/libraries/athena/athena.js'
      } );
      //Athena Controls
      window.require.addRule( /^athena\//, {
        path: function( module ) {
          module = module.replace( 'athena/', '' );
          return '/scripts/libraries/athena/controls/' + module + '.js';
        }
      } );
      // jQuery UI
      // This pattern is good for anything matching require('jquery.ui.draggable')
      window.require.addRule( /^jquery\.ui/, {
        path: function( module ) {
          return ['/scripts/libraries/jquery-ui-1.8.16', module].join( '/' ) + '.js';
        }
      } );
      //Extracted Class Lib from prototype see: https://github.com/Jakobo/PTClass
      window.require.addRule( 'class', {
        path: '/scripts/libraries/ptclass.js'
      } );
    }
  }

} () );