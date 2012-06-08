( function() {

  var PATH_TO_LU_CONTROLS = '/scripts/lu-controls/',
    PATH_TO_CLASS = '/scripts/libraries/class.js';

  if( typeof window.require === 'function' ) {

    if( typeof window.require.addRule === 'function' ) {
      window.require.addRule( /^lu\//, {
        path: function( module ) {
          module = module.replace( 'lu/', '' );
          return PATH_TO_LU_CONTROLS + module + '.js';
        }
      } );

      window.require.addRule( 'class', {
        path: PATH_TO_CLASS
      } );
    }
  }

} () );