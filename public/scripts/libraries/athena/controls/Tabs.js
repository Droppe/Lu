/**
 * The Tabs component is a subclass of Abstract and consists of a tablist, tabs and tabpanels.
 * @class Tabs
 * @constructor
 * @extends Abstract
 * @requires ptclass
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 */
var Class = require( 'class' ),
  Abstract = require( 'athena/Abstract' ),
  Tabs;

Tabs = Class.create( Abstract, ( function () {

  var SELECT_EVENT = 'select',
    SELECTED_EVENT = 'selected',
    ARIA_TAB = 'tab',
    ARIA_ROLE = 'role',
    ARIA_TABLIST = 'tablist',
    ARIA_TABPANEL = 'tabpanel',
    ARIA_PRESENTATION = 'presentation';

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
       * Instance of Tabs
       * @property Tabs
       * @type Object
       * @private
       */
      var Tabs = this,

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
          tabList: '[data-athena="List"]:first-child',

          /**
           * A selector scoped to the $element that matches tabpanels
           * @property tabPanels
           * @type String
           * @private
           * @final
           */
          tabPanels: '[data-athena="Container"]'
        },

        /**
         * JQuery object for the set of tabs
         * @property $tabList
         * @type Object
         * @private
         */
        $tabList,

        /**
         * JQuery object for the set of tab panels
         * @property $tabPanels
         * @type Object
         * @private
         */
        $tabPanels;

      /**
       * Initializes the Tab control with ARIA attributes.
       * Sets "role" to "tablist", "presentation" and "tab".
       * @method initARIARoles
       * @private
       * @return {Void}
       */
      function initARIARoles() {
        var $items = $tabList.children( 'li' );

        // Set ARIA role for "tablist"
        if ( !$tabList.attr( ARIA_ROLE ) ) {
          $tabList.attr( ARIA_ROLE, ARIA_TABLIST );
        }

        // Set ARIA role for "tabpanel"
        if ( !$tabPanels.attr( ARIA_ROLE ) ) {
          $tabPanels.attr( ARIA_ROLE, ARIA_TABPANEL );
        }

        if ( $items.length > 0 ) {
          $items.each( function( index, node ) {
            var $kids,
              $node = $( node );

            // Each link has ARIA role "presentation"
            if ( !$node.attr( ARIA_ROLE ) ) {
              $node.attr( ARIA_ROLE, ARIA_PRESENTATION );
            }

            $kids = $node.children( 'a' );

            if ( $kids.length > 0 ) {
              // Get the first link and give it role "menuitem"
              if ( !$( $kids[0] ).attr( ARIA_ROLE ) ) {
                $( $kids[0] ).attr( ARIA_ROLE, ARIA_TAB );
              }
            }

          } );
        }
      }

      /**
       * Initializes the tab component
       * @method tabInit
       * @private
       * @return {Void}
       */
      function tabInit() {
        // Get references to tablist, tabpanels and the current tab
        $tabPanels = $( settings.tabPanels, $element );
        $tabList = $( settings.tabList, $element );
        _.log("Tabs.tabInit", $tabPanels, $tabList);
        initARIARoles();
      }

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      // Initialize a bunch of stuff for the tabs!
      tabInit();

      /**
       * Syncs the appropriate panel with the selected tab
       * @method handleTabSelect
       * @private
       * @param {Integer} item Index representing the panel
       * @return {Void} Description
       */
      
      function handleTabSelect( item ) {
        _.log("Tabs.handleTabSelect", item);
        //Tabs.trigger('select', item);
        $tabPanels.trigger('select', item);
      }

      // Attach event listeners
      Tabs.on( SELECTED_EVENT, '[data-athena*="List"]', function (event, item) {
        _.log("Tabs.on", $element, event, item);
        event.stopPropagation();
        item = $(item);
        handleTabSelect( $tabPanels.eq(item.index()) );
      });

    }

  };

}() ) );

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ) {
    module.setExports( Tabs );
  } else if( module.exports ) {
   module.exports = Tabs;
  }
}