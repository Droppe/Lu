var Class = require( 'class' ),
  Abstract = require( 'athena/Abstract' ),
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
        $tabPanels;

      /**
       * Initializes the Tab control with ARIA attributes.
       * Sets "role" to "tablist", "presentation" and "tab". 
       * @private
       * @return {Void}
       */
      function initARIARoles() {
        var $items = $tabList.children( 'li' );

        // Set ARIA role for "tablist"
        if ( !$tabList.attr( ARIA_ROLE ) ) { 
          //$tabList.attr( ARIA_ROLE, ARIA_TABLIST );
        }

        // Set ARIA role for "tabpanel"
        if ( !$tabPanels.attr( ARIA_ROLE ) ) {
          //$tabPanels.attr( ARIA_ROLE, ARIA_TABPANEL );
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
       * @param {Object} settings - Object literal containing settings which have been merged with default settings 
       * @private
       * @return {Void}
       */
      function tabInit( settings ) {
        // Get references to tablist, tabpanels and the current tab
        $tabPanels = $( settings.tabPanels, $element ).athena( 'getControl', 'List' );
        $tabList = $( settings.tabList, $element ).athena( 'getControl', 'List' );
        //initARIARoles();
      }

      /**
       * Handles the tab select.  Fires the "select" event to the tab panels and passes the selected element
       * @param {Event} event - Athena event
       * @param {Object} item - JQuery DOM element
       * @method selectTabHandler 
       * @private
       * @return {Void}
       */
      function selectTabHandler( event, item ) {
        //$tabPanels.trigger( SELECT_EVENT, [ item ] );
      }

      /**
       * Handles the selected tab event.  Fires the "select" event to the tab panels and an index in an array 
       * @param {Event} event - Athena event
       * @param {Object} item - JQuery DOM element
       * @method selectedTabHandler 
       * @private
       * @return {Void}
       */
      function selectedTabHandler( event, item ) {
        // Get the parent and the children
        var items = item.parent().children(),
          // Get the index of the item
          index = items.index(item);

        // Fire the select with the index value
        //$tabPanels.trigger( SELECT_EVENT, [index] );
      };

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // Initialize a bunch of stuff for the tabs!
      tabInit( settings );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
      
      // Attach event listeners
      $tabsList.on( SELECTED_EVENT, function( event, item, index ) {
        //$tabPanels.trigger( SELECT_EVENT );
      } );
      //Tabs.on( SELECTED_EVENT, selectedTabHandler );

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