var Class = require( '/scripts/libraries/ptclass' ),
  Reveal = require( 'ui/Reveal' ),
  Container;

/**
 * Toggles the display of related content to a change event from a grouping of radio buttons.
 * @class RadioReveal
 * @constructor
 * @extends Reveal
 * @require ptclass, Reveal
 */
Container = Class.create( Reveal,  ( function () {

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

      // PRIVATE INSTANCE PROPERTIES

      /**
       * Instance of Reveal
       * @property Reveal
       * @type Object
       * @private
       */
      var Container = this,
      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {
      },      
      /**
       * Classname for the hidden class from config
       * @property hiddenClass
       * @type String
       */
      hiddenClass;
                  
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      hiddenClass = settings.className;

      // EVENT BINDINGS
      $element.on( settings.showEvent, function( event ){
        _.log(settings.showEvent, $element);
        $element.toggleClass(hiddenClass);
      } );


    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Container;
}