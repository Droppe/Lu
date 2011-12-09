var Class = require( '/scripts/libraries/ptclass' ),
  Abstract = require( 'ui/Abstract' ),
  List;

/**
 * A representation of a stateful list
 * @class List
 * @constructor
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 */
List =  Class.create( Abstract, ( function () {

  // PRIVATE CONSTANTS
  var NEXT = 'next',
    LAST = 'last',
    FIRST = 'first',
    PREVIOUS = 'previous',
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal';

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
          * The CSS class that designates a selected list item
          * @property selectFlag
          * @default 'selected'
          * @type String
          * @final
         */
         selectFlag: 'selected',

         /**
          * Denotes the behavior of left, right, top and down arrow keys.
          * @property direction 
          * @default 'horizontal'
          * @type String
          * @final
         */
         direction: HORIZONTAL
      },
      /**
       * JQuery collection of like items in the list
       * @property $items
       * @type Object
       * @private
       */
      $items,
     
      /**
       * Handles the keyup event and looks for keycodes 37, 38, 39 and 40.  These correspond to left, up, right and down
       * arrows.  Left and up correspond to action "previous" and right and next correspond to "next". 
       * @method handleKeyup
       * @private
       * @param {Event} event An event object
       * @param {Object} item An object or a number
       * @return {Void}
       */  
      handleKeyup = function(event) {
        var keyCode = event.keyCode,
            item = $(event.target);

        // A "vertical" list direction means that the up and down arrow keys work
        if (settings.direction === VERTICAL) {  
          switch (keyCode) {
            case 38: // Up arrow
              List.trigger(PREVIOUS, item);
              break;
            case 40: // Down arrow 
              List.trigger(NEXT, item);
            default:
              break;
          }
        } else {
          // By default, list direction is "horizontal" and left and right arrows work 
          switch (keyCode) {
            case 37: // Left arrow
              List.trigger(PREVIOUS, item);
              break;
            case 39: // Right arrow
              List.trigger(NEXT, item);
            default:
              break;
          }
        }

        switch (keyCode) {
          case 36: // Home key
            List.trigger(FIRST, item);
            break;
          case 35: // Last key
            List.trigger(LAST, item);
          default:
            break;
        }
      };


      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      //Scan for items from the provided selector, or default to the children of the container.
      if ( settings.items ) {
        if( typeof settings.items === 'string' ) {
          $items =  $element.children( settings.items ).children();
        } else {
          $items = settings.items.children();
        }
      } else {
        $items = $element.children();
      }

      // PRIVATE METHODS
      // n/a


      // PRIVILEGED METHODS

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
       * @param {Integer|Object} item The index of the item to select, or a JQuery instance of the item.
       * @return {Object} List
       */  
      List.select = function( item ) {

        var $item,
            $links;

        // item can be an integer and 0 is falsy!
        if (item === 0 || item) {

          if( typeof item === 'number' || typeof item === 'string') {
            $item = $items.eq( item );
          } else {
            $item = $(item);
          }

          if( $item.hasClass( settings.selectFlag ) === false ) {

            // Not selected 
            // aria-selected applies to the link _not_ the list item!!!
            $items.filter( '.' + settings.selectFlag ).removeClass( settings.selectFlag );
            // Set all links under $items to be aria-selected false
            $items.find( 'a' ).attr( 'aria-selected', 'false' );

            $links = $item.find( 'a' );

            if ($links.length > 0) {
              // Set aria-selected for the first link to "true"
              $links.eq(0).attr( 'aria-selected', 'true' );
            }
            
            // Selected
            $element.trigger( 'selected', [$item.addClass( settings.selectFlag ), this.index()] );
          }

          // Set focus to the item that you've selected
          // We do this for a11y
          $item.attr( 'tabindex', '-1' ).focus();
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
        var increment = 0;
        if(  List.hasNext() ) {
          increment = 1;
        } else {
           List.trigger( 'max' );
        }
        List.select( $items.eq( List.index() + increment ) );

        return List;
      };

      /**
       * Selects the previous item in the list. 
       * @method previous
       * @public
       * @return {Object} List
       */  
      List.previous = function() {
        var decrement = 0;

        if( List.hasPrevious() ) {
          decrement = 1;
        } else {
           List.trigger( 'min' );
        }

        List.select( $items.eq( this.index() - decrement ) );
        return this;
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
        var ndx = -1;
        _.each( $items, function( item, index ) {
          var $item = $( item );
          if( $item.hasClass( settings.selectFlag ) ) {
            ndx = index;
            return;
          }
        } );
        return ndx;
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
      $element.on( 'select', function( event, item ) {
        event.stopPropagation();
        List.select( item );
      } );
      $element.on( NEXT, function( event, item ) {
        event.stopPropagation();
        List.next();
      } );
      $element.on( PREVIOUS, function( event, item ) {
        event.stopPropagation();
        List.previous();
      } );
      $element.on( FIRST, function( event, item ) {
        event.stopPropagation();
        List.first();
      } );
      $element.on( LAST, function( event, item ) {
        event.stopPropagation();
        List.last();
      } );
      $element.on('keyup', handleKeyup);

    }
  };

}() ));


//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = List;
}
