/**
 * A representation of an accordion UI element
 * @class Accordion
 * @constructor
 * @extends List
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance 
 * @version dev
 */
var Class = require( 'class' ),
  List = require( 'lu/List' ),
  Accordion;

Accordion =  Class.create( List, ( function (){

  //CONSTANTS
  var HIDDEN_CSS = "lu-hidden",
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
    initialize: function ( $super, $element, settings ){

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
          notify: '[data-lu*="Container"]'
        },
        /**
         * JQuery collection of accordion toggle-buttons in the list
         * @property $buttons
         * @type Object
         * @private
         */
        $buttons,
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
      $buttons = $('[data-lu*="Button:Select"]', $element);
      
      $last = $panels.not("." + HIDDEN_CSS).eq(0);
        
      Accordion.on("select", function (event, item){
        _.log("Accordion.on", $element, event, item);
        event.stopPropagation();
        
        if ( !item.is($last) ){
          $panels.trigger(HIDE);
          $last = item.trigger(SHOW);
        }
        else if ( item.hasClass(HIDDEN_CSS) ){
          $panels.trigger(HIDE);
          $last = item.trigger(SHOW);
        }
        else {
          $panels.trigger(HIDE);
          // "null" out the item to force the buttons to all become enabled
          item = $([]);
        }

        $buttons.trigger("selected", [item]);

      });
        
    }

  };

}() ) );


//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Accordion );
  } else if( module.exports ){
   module.exports = Accordion; 
  }
}
