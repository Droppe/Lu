var Class = require( 'class' ),
  Abstract = require( 'athena/Abstract' ),
  Dropdown;

/**
 * The Dropdown component is a subclass of Abstract.
 * @class Tabs 
 * @constructor
 * @extends Abstract 
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 */
Dropdown =  Class.create( Abstract,  ( function () {

  // Constants
  var KEYUP_EVENT = 'keyup',
    SELECT_EVENT = 'select',
    SELECTED_EVENT = 'selected',
    // ARIA roles
    ARIA_ROLE = 'role',
    ARIA_MENU = 'menu',
    ARIA_MENUITEM = 'menuitem',
    ARIA_HASPOPUP = 'aria-haspopup',
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
      // PRIVATE
      // INSTANCE PROPERTIES
      
      /**
       * Instance of Dropdown 
       * @property Dropdown 
       * @type Object
       * @private
       */  
      var Dropdown = this,

      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {

        /**
         * The "name" for the selected item when form submitted
         * @property submitName 
         * @type String 
         * @private
         * @final
         */
        submitName: 'submitName',

        /**
         * Flag that denotes whether to update the selected item.  By default, update selected item. 
         * @property updateSelectedItem 
         * @type Boolean 
         * @private
         * @final
         */
        updateSelectedItem: true,

        /**
         * A selector scoped to the $element that matches the selectedItem 
         * @property selectedItem 
         * @type String
         * @private
         * @final
         */
        selectedItem: 'athena-selected-item',

        /**
         * A selector scoped to the $element that matches the list of select elements 
         * @property dropDownList 
         * @type String
         * @private
         * @final
         */
        dropDownList: 'athena-dropdown-list'

      },

      /**
       * A JDOM reference to the selected item outside of the select list 
       * @property $selectedItem 
       * @type Object
       * @private
       */
      $selectedItem,

      /**
       * The collection of select items 
       * @property $dropDownList 
       * @type Object
       * @private
       */
      $dropDownList,

      /**
       * JQuery DOM reference to the hidden input field.  Undefined
       * when the Styled Dropdown control isn't in a form.
       * @property $hiddenInput
       * @type Object
       * @private
       */
      $hiddenInput;

      /**
       * Initializes the Droplist control with ARIA attributes.
       * Sets "role" to "menu", "menuitem" and "has-popup."
       * @private
       * @return {Void}
       */
      function initARIARoles() {
        var $items = $dropDownList.children( 'li' );

        // The menu has ARIA role "menu" and set "aria-haspopup"
        if ( !$dropDownList.attr( ARIA_ROLE ) ) {
          $dropDownList.attr( ARIA_ROLE, ARIA_MENU ).attr( ARIA_HASPOPUP, 'true' );
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
              if ( !$($kids[0] ).attr( ARIA_ROLE ) ) {
                $( $kids[0] ).attr( ARIA_ROLE, ARIA_MENUITEM );
              }
            }
          } );
        }
      }

      /**
       * Initializes the Dropdown component
       * @method DropdownInit 
       * @param {Object} settings - Object literal containing settings which have been merged with default settings 
       * @private
       * @return {Void}
       */
      function DropdownInit( settings ) {
        var $parentForm = $element.parents( 'form' );

        // Get references to the styled dropdown selected item and the dropdown list
        $selectedItem = $( $element.children( '.' + settings.selectedItem ) );
        $dropDownList = $( $element.children( '.' + settings.dropDownList ) );

        // Setup ARIA roles
        initARIARoles();

        if ( $parentForm.length === 1 ) {
          // If we're inside a form - only one parent form -, create hidden input field
          // Only one selection _not_ multiple yet...
          // Ok... this is suppose to be efficient...
          $hiddenInput = $( "<input type='hidden' name='" + settings.submitName + "' value='" + $selectedItem.html() + "' />" ).appendTo( $( $parentForm[0] ) );
        }
      }

      /**
       * Handles the list element select.  Fires the "select" event to the selected item and passes the selected element
       * @param {Event} event - Athena event
       * @param {Object} item - JQuery DOM element
       * @method selectDropdownHandler
       * @private
       * @return {Void}
       */
      function selectDropdownHandler( event, item ) {
        $selectedItem.trigger( SELECT_EVENT, [item] );
      }

      /**
       * Finds a collection of links that match a link and it's descendant classNameQuery 
       * @param {Object} $ul - JQuery DOM reference to a list ( ul, ol or dd ) 
       * @param {String} classNameQuery - CSS class query to search for (ex. ".athena-item" )
       * @method findAthenaItems
       * @private
       * @return {Collection} Collection of JQuery DOM link elements
       */
      function findAthenaItems( $ul, classNameQuery ) {
        var $elements;

        if ( $ul ) {
          // Find the link in a list and find the "athena-item" class and if that's not 
          // there, get the JQuery DOM element for the <a>. 
          $elements = $ul.find( 'a ' + classNameQuery );

          if ( $elements.length === 0 ) {
            $elements = $ul.find( 'a' );
          }
        }

        return $elements; 
      }

      /**
       * Handles the selected element.  Updates the selected element to be the new selected item.  The "selected item" 
       * is the innerHTML of the link or the one with class .athena-item.
       * @param {Event} event - Athena event
       * @param {Object} item - JQuery DOM element
       * @method selectItemHandler 
       * @private
       * @return {Void}
       */
      function selectItemHandler( event, item ) {
        var $elements = findAthenaItems( $dropDownList, '.athena-item' ),
            $link;

        // If item is -1 then we don't know what value we've selected from the list
        if ( item > -1 ) {
          if ( $elements ) {
            $link = $( $elements.get( item ) );
          }

          if ( $link && settings.updateSelectedItem ) {
            $selectedItem.html( $link.html() );
          }

          if ( $link && $hiddenInput ) {
            // If it exists, update the hidden input field!
            $hiddenInput.attr( 'value', $link.html() );
          }

          // Hide the drop down list
          $dropDownList.hide();

          // Set focus on the selected item
          setFocus( $selectedItem );

        } else {
          $dropDownList.toggle();
        }
      }
    
      /**
       * Handler for the selected droplist item.  The handler triggers a "selected" event to the selectedItem.
       * @param {Event} event - Athena event
       * @param {Object} item - JQuery DOM element
       * @method selectDropdownHandler 
       * @private
       * @return {Void}
       */
      function selectedDropdownHandler( event, item, index ) {
        $selectedItem.trigger( SELECTED_EVENT, [item, index] );
      }
    
      /**
       * The "selected" element handler for the selected item.  Looks for the title or the name
       * which will display in the selected item.
       * @param {Event} event - Athena event
       * @param {Object} item - JQuery DOM element
       * @param {Integer} index - Index of the selected item 
       * @method selectedItemHandler
       * @private
       * @return {Void}
       */
      function selectedItemHandler( event, item, index ) {
        var $item = $( item ), 
            itemName;

        // This returns one element
        itemName = findAthenaItems( $item, '.athena-item' ).html(); 

        if ( itemName ) {
          // Update the selected item if we're suppose to
          if ( settings.updateSelectedItem ) {
            $selectedItem.html( itemName );
          }

          // If there's a hidden input, update the value!
          if ( $hiddenInput ) {
            $hiddenInput.attr( 'value', itemName );
          }
        }
      }

      /**
       * Handles the keyup event and looks for keycodes 38 and 40.  These correspond to 
       * up and down arrows.  
       * @method handleKeyup
       * @private
       * @param {Event} event An event object
       * @param {Object} item An object or a number
       * @return {Void}
       */  
      function handleKeyup( event, item ) {
        var keyCode = event.keyCode,
            $item = $( event.target ),
            list =  $dropDownList.athena( 'getControl', 'List' );

        switch ( keyCode ) {
          case 27: // Escape
            $dropDownList.hide();
            break;

          case 38: // Up arrow
            list.previous();
            break;

          case 40: // Down arrow 
            list.next();
          default:
            break;
        }

        // Maintain focus on the selected item
        setFocus( $selectedItem );
      }

      /**
       * Handles the keyup event when a list element has focus and looks for keycodes 13 and 32.  
       * These correspond to enter and the space key.  
       * @method handleKeyupDropDownList 
       * @private
       * @param {Event} event An event object
       * @param {Object} item An object or a number
       * @return {Void}
       */  
      function handleKeyupDropDownList( event, item ) {
        var keyCode = event.keyCode;

        switch ( keyCode ) {
          case 13: // Enter
          case 27: // Escape
          case 32: // Space bar
            $dropDownList.hide();
            setFocus( $selectedItem );
          default:
            break;
        }
      }

      /**
       * Sets focus to a JQuery DOM node
       * @method setFocus 
       * @private
       * @param {Object} $jNode JQuery DOM node reference
       * @return {Void}
       */  
      function setFocus( $jNode ) {
        if ( $jNode ) {
          $jNode.attr( 'tabindex', '0' );
          $jNode.focus();
        }
      }

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // Initialize a bunch of stuff for the Dropdown component!
      DropdownInit( settings );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
     
      // Attach event listeners
      // Dropdown list
      $dropDownList.on( SELECT_EVENT, selectDropdownHandler );
      $dropDownList.on( KEYUP_EVENT, handleKeyupDropDownList );
      $dropDownList.on( SELECTED_EVENT, selectedDropdownHandler );

      // Selected item window
      $selectedItem.on( KEYUP_EVENT, handleKeyup );
      $selectedItem.on( SELECT_EVENT, selectItemHandler ); 
      $selectedItem.on( SELECTED_EVENT, selectedItemHandler ); 
    }
  };
}() ) );

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Dropdown );
  } else if( module.exports ) {
   module.exports = Dropdown; 
  }
}
