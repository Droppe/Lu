var Class = require( '/scripts/libraries/ptclass' ),
  List = require( 'ui/List' ),
  Accordion;

/**
 * A representation of an accordion UI element
 * @class Accordion
 * @constructor
 * @extends List
 */
Accordion =  Class.create( List, ( function () {

  //CONSTANTS

  //RETURN METHODS OBJECT 
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
       * Instance of Accordion
       * @property Accordion
       * @type Object
       * @private
       */  
      var Accordion = this,

        /**
         * Default configuration values
         * @property defaults
         * @type Object
         * @private
         * @final
         */
        defaults = {
          orientation: 'horizontal',
          notify: '[data-athena="ui:Container"]'
        },
        /**
         * JQuery collection of like items in the list
         * @property $panels
         * @type Object
         * @private
         */
        $panels,
        $last;


      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      $panels = $(settings.notify, $element);
        
      $element.on("select", function (event, item) {
        event.stopPropagation();
        $panels.trigger("hide");
        
        _.log("YOJIMG100", item.is($last) );
        
        if ( item.is($last) ) {
          if ( item.data("open") ) {
            $last = item.trigger("hide").data("open", false);
          }
          else {
            $last = item.trigger("show").data("open", true);
          }
        } 
        else {
          $last = item.trigger("show").data("open", true);
        }

      });

    }

  };

}() ));


//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Accordion );
  } else if( module.exports ) {
   module.exports = Accordion; 
  }
}
