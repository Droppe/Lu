var Class = require( 'class' ),
  List = require( 'athena/List' ),
  Accordion;

/**
 * A representation of an accordion UI element
 * @class Accordion
 * @constructor
 * @extends List
 */
Accordion =  Class.create( List, ( function () {

  //CONSTANTS
  var HIDDEN_CSS = "athena-hidden",
    HIDE = "hide",
    SHOW = "show";

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
          notify: '[data-athena*="Container"]'
        },
        /**
         * JQuery collection of like items in the list
         * @property $panels
         * @type Object
         * @private
         */
        $panels,
        /**
         * The last-selected panel
         * @property $last
         * @type Object
         */
        $last;


      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      $panels = $(settings.notify, $element);
      
      $last = $panels.not("." + HIDDEN_CSS).eq(0);
        
      $element.on("select", function (event, item) {
        event.stopPropagation();
        
        if ( !item.is($last) ) {
          $panels.trigger(HIDE);
          $last = item.trigger(SHOW);          
        }
        else if ( item.hasClass(HIDDEN_CSS) ) {
          $panels.trigger(HIDE);
          $last = item.trigger(SHOW);
        }
        else {
          $panels.trigger(HIDE);
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
