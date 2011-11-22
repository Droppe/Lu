var Class = li.require("libraries/ptclass"),
  Abstract = li.require("ui/Abstract"),
  Tabs;

/**
 * The Tabs component is a subclass of Abstract and consists of a tablist, tabs and tabpanels.
 * @class Tabs 
 * @constructor
 * @extends Abstract 
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 */
  Tabs =  Class.create( Abstract,  ( function () {

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

      // PRIVATE
      // Constants
      var SELECT_EVT = "select",

      // INSTANCE PROPERTIES
      
      /**
       * Instance of Tabs 
       * @property Tabs 
       * @type Object
       * @private
       */  
      tabs = this,

      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {

        /**
         * A selector scoped to the $element that matches the tablist 
         * @property tabList
         * @type String
         * @private
         * @final
         */
        tabList: '.tab-list',

        /**
         * A selector scoped to the $element that matches tabpanels 
         * @property tabPanels 
         * @type String
         * @private
         * @final
         */
        tabPanels: '.tab-panels'
      },

      /**
       * A JDOM reference to a tablist 
       * @property $tabList
       * @type Object
       * @private
       */
      $tabList,

      /**
       * The collection of tab panels for tabs 
       * @property $tabPanels
       * @type Object
       * @private
       */
      $tabPanels,

      /**
       * Initializes the tab component
       * @method tabInit 
       * @param {Object} settings - Object literal containing settings which have been merged with default settings 
       * @private
       * @return {Void}
       */
      tabInit = function(settings) {
        // Get references to tablist, tabpanels and the current tab
        $tabPanels = $($element.children( settings.tabPanels ));

        $tabList = $($element.children(settings.tabList)); 
      },

      /**
       * Handles the tab select.  Fires the "select" event to the tab panels and passes the selected element
       * @param {Event} event - Athena event
       * @param {Object} item - JQuery DOM element
       * @method selectTabHandler 
       * @private
       * @return {Void}
       */
      selectTabHandler = function(event, item) {
        $tabPanels.trigger(SELECT_EVT, [item]);
      };

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // Initialize a bunch of stuff for the tabs!
      tabInit(settings);

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
      
      // Attach event listeners
      $tabList.on(SELECT_EVT, selectTabHandler);
    }
  };
}() ));

// EXPORT TO ATHENA FRAMEWORK
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Tabs;
}
