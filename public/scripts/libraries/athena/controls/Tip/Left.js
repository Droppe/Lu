var Class = require( 'class' ),
  Tip = require( 'athena/Tip' ),
  LeftTip;

LeftTip = Class.create( Tip, ( function () {

   return {
     initialize: function ( $super, $element, settings ) {

       var defaults = {
         placement: 'left'
       };

       _.defaults( settings, defaults );

       $super( $element, settings );
     }
  };

}() ));

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( LeftTip );
  } else if( module.exports ) {
   module.exports = LeftTip; 
  }
}