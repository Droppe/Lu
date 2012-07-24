( function() {

  var PATH_TO_LU_CONTROLS = '/scripts/lu-controls/',
    PATH_TO_CLASS = '/scripts/libraries/class.js';

  if( typeof window.require === 'function' ) {

    if( typeof window.Inject.addRule === 'function' ) {
      window.Inject.addRule( /^lu\//, {
        path: function( module ) {
          module = module.replace( 'lu/', '' );
          return PATH_TO_LU_CONTROLS + module + '.js';
        }
      } );

      window.Inject.addRule( 'class', {
        path: PATH_TO_CLASS
      } );
    }
  }

} () );