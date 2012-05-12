var Class = require( 'Risk' ),
  Abstract;


Abstract = Class.extend( function( base ){

    function on(){}
    function one(){}
    function trigger(){}
    function params(){}
    function addToEventStorage(){}
    function removeFromEventStorage(){}
    function observe(){}
    function unobserve(){}

    init: function( $element, settings ){
      this.$element = $element;
      this.eventStorage = {};
      this.namespace;
    }
  };
}() );

Abstract.prototype.on = function(){};
Abstract.prototype.one = function(){};
Abstract.prototype.trigger = function(){};
Abstract.prototype.observe = function(){};
Abstract.prototype.unobserve = function(){};
Abstract.prototype.setNamespace = function(){};
Abstract.prototype.getNamespace = function(){};

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Abstract );
  } else if( module.exports ){
    module.exports = Abstract;
  }
}