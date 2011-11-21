var Class = li.require( 'libraries/ptclass' ),
  Abstract = li.require( 'ui/Abstract' ),
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
      var SELECTED_CSSQ = "selected",

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
        tabPanels: '.tab-panels',

        /**
         * The CSS class that designates a selected panel
         * @property selectFlag
         * @default 'selected'
         * @type String
         * @final
         * @private
        */
        activeFlag: 'active'
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
       * A JDOM reference to the selected tab 
       * @property $currentTab
       * @type Object
       * @private
       */
      $currentTab,
    
      /**
       * Given a tab, returns the panel ID
       * @method getPanelId 
       * @param {Object} tab - a JDOM reference to the tab element
       * @private
       * @return {String} panel ID 
       */
      getPanelId = function(tab) {
        // Boo! Use a regex!
        // REFACTOR this crap oliver!
        var children = tab.children(),
            $link = children ? $(children[0]) : null,
            panelId = $link ? $link.attr("href") : null,
            start = panelId ? panelId.indexOf("#") + 1 : null;

        if (start) {
          panelId = panelId.substring(start);
        }

        return panelId;
      },

      /**
       * Initializes the tab component 
       * @method tabInit 
       * @param {Object} settings - Object literal containing settings which have been merged with default settings 
       * @private
       * @return {Void}
       */
      tabInit = function(settings) {
        // Get references to tablist, tabpanels and the current tab
        $tabList = $element.children(settings.tabList).children();
        $tabPanels = $element.children( settings.tabPanels ).children();
        $currentTab = $tabList.siblings(".selected"); 

        // Hide the panels that aren't selected
        hidePanels(getPanelId($currentTab));
      },

      /**
       * Hides panels which aren't equal to the exclude ID
       * @method hidePanels 
       * @param {String} exclude - ID of the tab panel to exclude
       * @private
       * @return {Void}
       */
      hidePanels = function(exclude) {
        var $listElement = $(".tab-panels li");

        if ($listElement) {
          // Iterate through each panel and if the ID isn't excluded, hide
          $listElement.each(function() {
            var $element = $(this);

            if (this.id !== exclude) {
              $element.attr("style", "display:none");  
            } else {
              // Hmmmmmmm... it's probably better to do this with a class because we're removing the whole
              // damn style here!
              $element.removeAttr("style");  
            }

          });            
        }
      },

      /**
       * Handles the tab click.  Changes the currentTab to the new tab by removing and adding
       * the class name "selected"
       * @method selectHandler 
       * @private
       * @return {Void}
       */
      selectHandler = function(event) {

        var tabPanel,
            // Convert to JQuery element
            clickedTab = $(event.target.parentNode);

        $currentTab.removeClass(SELECTED_CSSQ);
        clickedTab.addClass(SELECTED_CSSQ);
        $currentTab = clickedTab;

        hidePanels(getPanelId($currentTab));
      };

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // Initialize a bunch of stuff for the tabs!
      tabInit(settings);

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
      
      // PRIVILEGED METHODS
      // Nada!
      
      // EVENT BINDINGS
      tabs.on("select", selectHandler);
    }
  };
}() ));

// EXPORT TO ATHENA FRAMEWORK
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Tabs;
}
