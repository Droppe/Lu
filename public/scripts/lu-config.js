//Use this file to configure lu and paths

( function() {

  var PATH_TO_LU = '/scripts/lu.js',
    PATH_TO_LU_CONTROLS = '/scripts/lu-controls/',
    PATH_TO_PTCLASS = '/scripts/libraries/ptclass.js',
    PATH_TO_JSON2 = '/scripts/libraries/json2.js',
    DEBUG = 2;

  window.lu_debug = DEBUG;

  if( typeof window.require === 'function' ) {

    if( typeof window.require.addRule === 'function' ) {

      //Lu
      window.require.addRule( 'lu', {
        path: PATH_TO_LU,
        before: function() {
          window.lu_debug = DEBUG;
        }
      } );

      //Lu Controls
      window.require.addRule( /^lu\//, {
        path: function( module ) {
          module = module.replace( 'lu/', '' );
          return PATH_TO_LU_CONTROLS + module + '.js';
        }
      } );

      //Extracted Class Lib from prototype see: https://github.com/Jakobo/PTClass
      window.require.addRule( 'class', {
        path: PATH_TO_PTCLASS
      } );

      //JSON2
      window.require.addRule( 'JSON', {
        path: PATH_TO_JSON2
      } );

    }

  }

} () );