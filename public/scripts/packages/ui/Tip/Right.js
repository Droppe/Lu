var Class = require( '/scripts/libraries/ptclass' ),
  Tip = require( 'ui/Tip' ),
  BelowTip;

BelowTip = Class.create( Tip, ( function () {

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

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = BelowTip;
}
