//Use this file to configure lu and paths

( function() {

  var PATH_TO_LU = '/scripts/lu.js',
    PATH_TO_LU_CONTROLS = '/scripts/lu-controls/',
    PATH_TO_PTCLASS = '/scripts/libraries/ptclass.js',
    PATH_TO_JSON2 = '/scripts/libraries/json2.js',
    PATH_TO_CLASS = '/scripts/libraries/class.js',
    //log (>=5), debug (>=4),info (>=3), warn (>=2), error (>=1)
    DEBUG = 0;


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
      window.require.addRule( 'ptclass', {
        path: PATH_TO_PTCLASS
      } );

      window.require.addRule( 'class', {
        path: PATH_TO_CLASS
      } );

      //JSON2
      window.require.addRule( 'JSON', {
        path: PATH_TO_JSON2
      } );

    }

  }

} () );