/**
* Form Element control
* @class FormElement
* @constructor
* @extends Abstract
*/

var Abstract = require( 'lu/Abstract' ),
    FormElement;

FormElement = Abstract.extend( function ( base ) {
  var defaults = {};

  return {
    init: function ( $element, settings ) {
      /**
      * Instance of FormElement
      * @property FormElement
      * @type Object
      * @private
      */
      var FormElement = this;
      _.defaults( settings, defaults );
      base.init.call( FormElement, $element, settings );
    }
  };
} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( FormElement );
  } else if( module.exports ){
   module.exports = FormElement;
  }
}
