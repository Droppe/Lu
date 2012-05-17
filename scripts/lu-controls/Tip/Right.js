/**
 * Tooltip class
 * @class RightTip
 * @constructor
 * @extends Tip
 * @requires class
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 * @version 0.0.0
 */
var Class = require( 'class' ),
  Tip = require( '/scripts/lu-controls/Tip' ),
  RightTip;

RightTip = Class.extend( function (Tip) {

   return {
     init: function ( $element, settings ){

       var defaults = {
         placement: 'right'
       };

       _.defaults( settings, defaults );
       Tip.call.init( this, $element, settings );
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
