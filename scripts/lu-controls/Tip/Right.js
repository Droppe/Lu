/**
 * Tooltip class
 * @class RightTip
 * @constructor
 * @extends Tip
 * @version 0.0.0
 */
var Tip = require( '/scripts/lu-controls/Tip' ),
  RightTip;

RightTip = Tip.extend( function (Tip) {

   return {
     init: function ( $element, settings ){

       var defaults = {
         placement: 'right'
       };

       _.defaults( settings, defaults );
       Tip.init.call( this, $element, settings );
     }
  };

} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( RightTip );
  } else if( module.exports ){
   module.exports = RightTip; 
  }
}
