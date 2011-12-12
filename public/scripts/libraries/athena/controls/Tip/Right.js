var Class = require( 'class' ),
  Tip = require( 'athena/Tip' ),
  RightTip;

RightTip = Class.create( Tip, ( function () {

   return {
     initialize: function ( $super, $element, settings ) {

       var defaults = {
         placement: 'right'
       };

       _.defaults( settings, defaults );
       $super( $element, settings );
     }
  };

}() ));

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( RightTip );
  } else if( module.exports ) {
   module.exports = RightTip; 
  }
}
