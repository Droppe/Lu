/**
 * Tooltip class
 * @class RightTip
 * @constructor
 * @extends Tip
 * @requires ptclass
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 */
var Class = require( 'class' ),
  Tip = require( 'lu/Tip' ),
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
