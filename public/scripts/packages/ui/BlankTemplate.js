var Class = require( '/scripts/libraries/ptclass' ),
  Abstract = require( 'ui/Abstract' ),
  BlankTemplate;

/**
 * Representation of a BlankTemplate
 * @class BlankTemplate
 * @constructor
 * @extends Abstract
 * @requires ptclass, Abstract
 */
BlankTemplate = Class.create( Abstract, ( function () {

  // GLOBAL STATICS
  var abc = 123;

  // RETURN METHODS OBJECT
  return {
    /**
     * PTClass constructor 
     * @method initialize
     * @public
     * @param {Object} $super Pointer to superclass constructor
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */    
    initialize: function( $super, $element, settings ) {

      // PRIVATE INSTANCE PROPERTIES

      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      var defaults = {
        // Default values go here
      },
      /**
       * Instance of BlankTemplate
       * @property BlankTemplate
       * @type Object
       * @private
       */
      BlankTemplate = this;

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // PUT YOUR CONSTRUCTOR'S SETUP CODE HERE -- ANYTHING THAT CHANGES THE SETTINGS

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      // PRIVATE METHODS

      /**
       * A private method 
       * @method foo
       * @private
       * @param {Type} Name Description
       */
      function foo( param ) {
        // Your code here
      }

      // PRIVILEGED METHODS

      /**
       * A privileged method
       * @method bar
       * @public
       * @param {Type} Name Description
       */
      BlankTemplate.bar = function( param ) {
        // Your code here
      };

      // EVENT BINDINGS
      $element.on( settings.on, function( event ){
        // Your code here
      } );

    },
    // PUBLIC METHODS
    anotherMethod: function( $super ) {
     // Your code here
     // Call the parent method
     $super();       
    }
  };
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = BlankTemplate;
}
