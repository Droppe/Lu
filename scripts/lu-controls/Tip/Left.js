/**
 * Tooltip class
 * @class LeftTip
 * @constructor
 * @extends Tip
 * @requires class
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 * @version 0.0.0
 */
var Class = require( 'class' ),
  Tip = require( '/scripts/lu-controls/Tip' ),
  LeftTip;

LeftTip = Class.extend( function(Tip) {

   return {
     init: function ( $element, settings ){

       var defaults = {
         placement: 'left'
       };

       _.defaults( settings, defaults );

       Tip.init.call( this, $element, settings );
     }
  };

} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( LeftTip );
  } else if( module.exports ){
   module.exports = LeftTip; 
  }
}