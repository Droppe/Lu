var Class = require( '/scripts/libraries/ptclass' ),
    Abstract = require( 'ui/Abstract' ),
    Dialog;

/**
 * Representation of a Dialog
 * @class Dialog
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
Dialog = Class.create( Abstract,  ( function () {

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
    initialize: function ( $super, $element, settings ) {

      /**
      * Default configuration values
      * @property defaults
      * @type Object
      * @private
      * @final
      */
      var defaults = {
        autoOpen: false,
        resizable: false
      },
      /**
      * jQuery UI Dependencies
      * @property dependencies
      * @type Array
      * @private
      */
      dependencies;

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
      
      // CREATE DEPENDENCIES ARRAY
      dependencies = [
        'jquery.ui.core',
        'jquery.ui.widget',
        'jquery.ui.mouse',
        'jquery.ui.position'
      ];      
      if (settings.draggable) {
        dependencies.push('jquery.ui.draggable');
      }
      if (settings.resizable) {
        dependencies.push('jquery.ui.resizable');
      }
      dependencies.push('jquery.ui.dialog');

      require.ensure(
        dependencies,
        function() {
          $element.dialog(settings);
          $element.on('open', function() {
            $(this).dialog('open');
          });
          $element.on('close', function() {
            $(this).dialog('close');
          });
        }
      );
      
    }
  };
  
}() ));

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ) {
    module.setExports( Dialog );
  } else if( module.exports ) {
   module.exports = Dialog; 
  }
}