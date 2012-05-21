/**
* A stateful element
* @class Switch
* @constructor
* @extends Abstract
* @version 0.2.4
*/

//The Full path is given do to an error in inject :(
var Abstract = require( '/scripts/lu-controls/Abstract' ),
  stateDecorator = require( '/scripts/lu-decorators/State' ),
  Switch;

Switch = Abstract.extend( function ( Abstract ) {
    defaults = {};

  return {
    /**
     * Constructor
     * @method init
     * @public
     * @param {Object} $element JQuery object for the element wrapped by
     * the component
     * @param {Object} settings Configuration settings
     */
    init: function( $element, settings ){
      _.defaults( settings, defaults );

      Abstract.init.call( this, $element, settings );
      this.decorate( stateDecorator );
    }
  };
} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Switch );
  } else if( module.exports ){
   module.exports = Switch;
  }
}