/**
 * A representation of a stateful list
 * @class List
 * @constructor
 * @extends Abstract
 * @requires ptclass
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 */
var Class = require( 'class' ),
  Abstract = require( 'athena/Abstract' ),
  List;

List =  Class.create( Abstract, ( function () {

  //CONSTANTS
  var NEXT_EVENT = 'next',
    LAST_EVENT = 'last',
    FIRST_EVENT = 'first',
    PAUSED_EVENT = 'paused',
    PLAYING_EVENT = 'playing',
    PREVIOUS_EVENT = 'previous',
    FLOORED_EVENT = 'floored',
    MAXED_EVENT = 'maxed',
    SELECT_EVENT = 'select',
    SELECTED_EVENT = 'selected',
    OUT_OF_BOUNDS_EVENT = 'out-of-bounds',
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
    SELECTED_FLAG = 'athena-selected',
    ITEMS_FLAG = 'athena-carousel-items';

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
       * Instance of Button
       * @property Button
       * @type Object
       * @private
       */  
      var List = this,

        /**
         * Default configuration values
         * @property defaults
         * @type Object
         * @private
         * @final
         */
        defaults = {

           /**
            * Denotes the behavior of left, right, top and down arrow keys.
            * @property direction 
            * @default 'horizontal'
            * @type String
            * @final
           */
           orientation: HORIZONTAL
        },
        /**
         * JQuery collection of like items in the list
         * @property $items
         * @type Object
         * @private
         */
        $items,
        /**
         * A boolean flag denoting that the list is "autoplaying"; this occurs for Carousel.  Why is it in List, then?
         * Um...
         *
         * @property autoPlay
         * @type Boolean 
         * @private
         */
        autoPlay = false;

      /**
       * Handles the keyup event and looks for keycodes 37, 38, 39 and 40.  These correspond to left, up, right and down
       * arrows.  Left and up correspond to action "previous" and right and next correspond to "next". 
       * @method handleKeyup
       * @private
       * @param {Event} event An event object
       * @param {Object} item An object or a number
       * @return {Void}
       */  
      function handleKeyup( event ) {
        var keyCode = event.keyCode,
            item = $( event.target );

        // A "vertical" list orentation means that the up and down arrow keys work
        if ( settings.orientation === VERTICAL ) {  
          switch ( keyCode ) {
            case 38: // Up arrow
              List.previous();
              break;
            case 40: // Down arrow 
              List.next();
            default:
              break;
          }
        } else {
          // By default, list orientation is "horizontal" and left and right arrows work 
          switch ( keyCode ) {
            case 37: // Left arrow
              List.previous();
              break;
            case 39: // Right arrow
              List.next();
            default:
              break;
          }
        }

        switch ( keyCode ) {
          case 36: // Home key
            List.first();
            break;
          case 35: // Last key
            List.last();
          default:
            break;
        }

      }

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      //Scan for items from the provided selector, or default to the children of the container.
      if ( settings.items ) {
        if( typeof settings.items === 'string' ) {
          $items = $element.children( settings.items );
        } else {
          $items = settings.items;
        }
      } else {
        if( $element.is( ITEMS_FLAG ) ) {
          $items = $element.children();
        } else {
          $items = $element.find(  '.' + ITEMS_FLAG ).children();
        }
        if( $items.length === 0 ) {
          if( $element.is( 'ul, ol' ) ) {
            $items = $element.addClass( '.' + ITEMS_FLAG ).children();
          } else {
            $items = $element.find( 'ul, ol' ).first().addClass( ITEMS_FLAG ).children();
          }
        }
      }


      /**
       * Append a new item to $element
       * @method append
       * @public
       * @param {Array} A jQuery Collection of $items to append
       * @return {Object} List
       */  
      List.append = function( $item ) {
        $items.parent().append( $item );
        return List;
      };

      /**
       * Removes an item from $element
       * @method remove
       * @public
       * @param {Array} A jQuery Collection of $items to remove
       * @return {Object} List
       */  
      List.remove = function( $item ) {
        $( $item, $items ).remove();
        return List;
      };

      /**
       * Select an item in the list
       * @method select
       * @public
       * @param {Integer|String|Object} item The index of the item to select, a css selector, or a JQuery collection containting the item.
       * @return {Object} List
       */  
      List.select = function( item ) {
        var $item,
          $links;

console.log( item );

        if ( item !== undefined ) {

          // Item is an index number
          if( typeof item === 'number' ) {
            $item = $items.eq( item );
            console.log( $item );
          }
          // Item is a string/CSS selector
          else if ( typeof item === 'string' )
            $item = $items.filter( item );
          // Item is a JQuery object
          else {
            $item = item;
          }

          if( $item.is( $items ) ) {

            if( $item.hasClass( SELECTED_FLAG ) === false ) {

              // Not selected
              // aria-selected applies to the link _not_ the list item!!!
              $items.filter( '.' + SELECTED_FLAG ).removeClass( SELECTED_FLAG );
              // Set all links under $items to be aria-selected false
              $items.find( 'a' ).attr( 'aria-selected', 'false' );

              $links = $item.find( 'a' );

              if ( $links.length > 0 ) {
                // Set aria-selected for the first link to "true"
                $links.eq( 0 ).attr( 'aria-selected', 'true' );
              }

              $item.addClass( SELECTED_FLAG );

              if( !List.hasPrevious() ) {
                List.trigger( FLOORED_EVENT, [ $element ] );
              }

              if( !List.hasNext() ) {
                List.trigger( MAXED_EVENT, [ $element ] );
              }

              // Set focus to the item that you've selected
              // We do this for a11y
              if ( !autoPlay ) {
                // We set focus when we're not auto playing.
                // Setting focus when auto playing moves the page and that's a bad baby!
                $item.attr( 'tabindex', '-1' ).focus();
              }

              List.trigger( SELECTED_EVENT, [ $item, List.index() ] );

            }

          }

        } else {

          List.trigger( OUT_OF_BOUNDS_EVENT );

        }

        return List;
      };

      /**
       * Selects the next item in the list.
       * @method next
       * @public
       * @return {Object} List
       */
      List.next = function() {
        if( List.hasNext() ) {
          List.select( List.index() + 1 );
        } else {
          List.trigger( OUT_OF_BOUNDS_EVENT + '.' + NEXT_EVENT );
        }
        return List;
      };

      /**
       * Selects the previous item in the list. 
       * @method previous
       * @public
       * @return {Object} List
       */  
      List.previous = function() {
        if( List.hasPrevious() ) {
          List.select( List.index() - 1 );
        } else {
          List.trigger( OUT_OF_BOUNDS_EVENT + '.' + PREVIOUS_EVENT );
        }
        return List;
      };

      /**
       * Selects the last item in the list. 
       * @method last
       * @public
       * @return {Object} List
       */
      List.last = function() {
        List.select( $items.eq( List.size() - 1 ) );
        return List;
      };

      /**
       * Selects the first item in the list. 
       * @method first
       * @public
       * @return {Object} List
       */  
      List.first = function() {
        List.select( 0 );
        return List;
      };

      /**
       * Determines if there are any higher-index items in the list.
       * @method hasNext
       * @public
       * @return {Boolean} true if not at the last item in the list
       */
      List.hasNext = function() {
        return ( List.index() < List.size() - 1 );
      };

      /**
       * Determines if there are any lower-index items in the list.
       * @method hasPrevious
       * @public
       * @return {Boolean} true if not at the first item in the list
       */
      List.hasPrevious = function() {
        return ( List.index() > 0 );
      };

      /**
       * Returns the index of the selected item.
       * @method index
       * @public
       * @return {Number} The index of the selected item
       */
      List.index = function() {
        return $items.index( $items.filter( '.' + SELECTED_FLAG ) );
      };

      /**
       * Returns the currently-selected item.
       * @method current
       * @public
       * @return {Object} JQuery object-reference to the selected item
       */  
      List.current = function() {
        return $items.eq( List.index() );
      };

      /**
       * Returns the array of list items. 
       * @method items
       * @public
       * @return {Array} The array of list items
       */  
      List.items = function() {
        return $items;
      };

      /**
       * Returns the number of items in the list. 
       * @method size
       * @public
       * @return {Number} The number of items in the list
       */
      List.size = function() {
        return $items.length;
      };

      // EVENT BINDINGS
      List.on( SELECT_EVENT, function( event, item ) {
        event.stopPropagation();
        
        // Check for number (list index)
        // Check for string (CSS Selector)
        if ( _.isNumber( item ) || _.isString( item ) ) {
          List.select( item );
        }
        // Check for JQuery object
        else if ( _.isObject( item ) ) {

          // We need to ensure that [item] is a descendant of our List
          item = $element.find( item );
          
          // Now check for empty JQuery object
          if ( item.length < 1) {
            item = $( event.target ).closest( 'li' ).index();
          }

          List.select( item );

        }
        
      } );
      List.on( NEXT_EVENT, function( event ) {
        event.stopPropagation();
        List.next();
      } );
      List.on( PREVIOUS_EVENT, function( event ) {
        event.stopPropagation();
        List.previous();
      } );
      List.on( FIRST_EVENT, function( event ) {
        event.stopPropagation();
        List.first();
      } );
      List.on( LAST_EVENT, function( event ) {
        event.stopPropagation();
        List.last();
      } );
      List.on( PLAYING_EVENT, function( event ) {
        event.stopPropagation();
        autoPlay = true;
      } );
      List.on( PAUSED_EVENT, function( event ) {
        event.stopPropagation();
        autoPlay = false;
      } );
      List.on( 'keyup', handleKeyup );

    }

  };

}() ) );


//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( List );
  } else if( module.exports ) {
   module.exports = List; 
  }
}
