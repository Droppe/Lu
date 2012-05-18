/**
 * Tooltip class
 * @class BelowTip
 * @constructor
 * @extends Tip
 * @requires class
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 * @version 0.0.0
 */
var Class = require( 'class' ),
  Tip = require( '/scripts/lu-controls/Tip' ),
  BelowTip;

BelowTip = Class.extend( function (Tip){

   return {
     init: function ( $element, settings ){

       var defaults = {
         placement: 'below'
       };

       _.defaults( settings, defaults );

       Tip.init.call( this, $element, settings );
     }
  };

} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( BelowTip );
  } else if( module.exports ){
   module.exports = BelowTip; 
  }
}
