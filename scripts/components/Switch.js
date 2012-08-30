/**
* A stateful element
* @class Switch
* @constructor
* @extends Abstract
*/
var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Abstract = require( 'lu/Abstract' ),
  stateDecorator = require( 'lu/decorators/state' ),
  Fiber = require( 'Fiber' ),
  Switch;

Switch = Abstract.extend( function ( base ) {
  var defaults = {};

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
      base.init.call( this, $element, settings );
      Fiber.decorate( this, stateDecorator( settings ) );
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