/**
 * Lu config
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
      //Lu
      window.require.addRule( 'lu', {
        path: '/scripts/libraries/lu/lu.js'
      } );
      //Lu Controls
      window.require.addRule( /^lu\//, {
        path: function( module ) {
          module = module.replace( 'lu/', '' );
          return '/scripts/libraries/lu/controls/' + module + '.js';
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