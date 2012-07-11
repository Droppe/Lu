/**
 * Manages a list of Containers.
 * @class List
 * @extends Switch
 * @require Container
 * @version 0.2.4
 */

var Switch = require( 'lu/Switch' ),
  Container = require( 'lu/Container' ),
  List;

List = Switch.extend( function( Switch ){

  var NEXT_EVENT = 'next',
    LAST_EVENT = 'last',
    FIRST_EVENT = 'first',
    PREVIOUS_EVENT = 'previous',
    SELECT_EVENT = 'select',
    KEYUP_EVENT = 'keyup',
    SELECTED_EVENT = 'selected',
    OUT_OF_BOUNDS_EVENT = 'out-of-bounds',
    STATED_EVENT = 'stated',
    PLAYING_STATE = 'playing',
    FLOORED_STATE = 'floored',
    MAXED_STATE = 'maxed',
    SELECTED_STATE = 'selected',
    FORWARD_STATE = 'forward',
    REVERSE_STATE = 'reverse',
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
    LIST_TAGS = 'ul, ol, dl',
    STRING = 'string',
    CONTAINER = 'Container',
    defaults = {
      orientation: HORIZONTAL,
      index: 0
    };

  function contain( $item ){
    return lu.create( $item, [CONTAINER], { 'Container': {} } );
  }

  /**
   * Handles the keyup event and looks for keycodes 37, 38, 39 and 40.  These correspond to left, up, right and down
   * arrows.Left and up correspond to action "previous" and right and next correspond to "next".
   * @method handleKeyup
   * @private
   * @param {Event} event An event object
   * @param {Object} List the list control to handle
   * @return {Void}
   */
  function keyup( event, List ){
    var keyCode = event.keyCode,
      item = $( event.target );

    // A "vertical" list orentation means that the up and down arrow keys work
    if( List.orientation === VERTICAL ){
      switch ( keyCode ){
        case 38: // Up arrow
          List.previous();
          break;
        case 40: // Down arrow
          List.next();
        default:
      }
    } else {
      // By default, list orientation is "horizontal" and left and right arrows work
      switch( keyCode ){
        case 37: // Left arrow
          List.previous();
          break;
        case 39: // Right arrow
          List.next();
          break;
        default:
      }
    }

    switch( keyCode ){
      case 36: // Home key
        List.first();
        break;
      case 35: // Last key
        List.last();
        break;
      default:
    }
  }

  return {
    /**
     * @constructor
     * @method init
     * @public
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */
    init: function( $element, settings ){
      var List = this,
        Selected,
        Previous,
        $items;

      if( settings.items ){
        if( typeof settings.items === STRING ){
          $items = $element.children( settings.items );
        } else {
          $items = settings.items;
        }
      } else {
        if( $element.is( LIST_TAGS ) ){
          $items = $element.children();
        } else {
          $items = $element.children( LIST_TAGS ).first().children();
        }
      }

      if( !$items ){
        $items = $element.children();
      }

      _.defaults( settings, defaults );

      Switch.init.call( this, $element, settings );

      /**
       * Select an item in the list
       * @method select
       * @public
       * @param {Integer|String|Object} item The index of the item to 
       * select, a css selector, or a JQuery collection containing the item.
       * @return {Object} List
       */
      List.select = function( item ){
        var Container,
          $item,
          $items = List.$items,
          controls = 'lu-controls',
          index;

        if( item === undefined || item === null ){
          return List;
        }

        if( typeof item === 'number' ){
          $item = $items.eq( item );
        } else if ( typeof item === STRING ){          
          $item = $items.filter( function(index){
            // Is the selected item one of the list elements?
            if ($items[index] === item) {
              return true;
            }
            // Or is the selected item contained by one of the list elements?
            else {
              return ( $.contains($items[index], $(item)[0]) );
            }
            return false;
          } );
        } else if( item instanceof $ ){
          $item = item;
        } else {
          return List;
        }

        if( $item.is( this.$items ) ){
          Container = $item.data( controls );

          if( !Container ){
            contain( $item );
          }

          Container = $item.data( controls ).Deferred;

          if( Container.state() === 'pending' ){
            Container.done( function(){
              List.select( $item );
            } );
            return List;
          }

          Container = lu.getControl( $item, CONTAINER );

          if( Container.hasState( SELECTED_STATE ) ){
            Selected = Container;
            List.trigger( SELECTED_EVENT, [ List, Container ] );
            return List;
          }

          if( Selected ){
            if( Container.$element.is( Selected.$element ) ){
              return List;
            }
            Previous = Selected;
            Previous.removeState( SELECTED_STATE );
          }

          Container.addState( SELECTED_STATE );
          Selected = Container;

          index = $items.index( $item );

          if( index > List.index ){
            List.addState( FORWARD_STATE ).removeState( REVERSE_STATE );
          } else {
            List.addState( REVERSE_STATE ).removeState( FORWARD_STATE );
          }

          List.index = index;
          List.trigger( SELECTED_EVENT, [ List, Container ] );

        } else {
          List.trigger( OUT_OF_BOUNDS_EVENT, List );
        }
        return List;
      };

      List.index = 0;
      List.$items = $items;
      List.orientation = settings.orientation;

      List.on( SELECT_EVENT, function( event, item ){
        event.stopPropagation();
        List.select( item );
      } );

      List.on( NEXT_EVENT, function( event ){
        event.stopPropagation();
        List.next();
      } );

      List.on( PREVIOUS_EVENT, function( event ){
        event.stopPropagation();
        List.previous();
      } );

      List.on( FIRST_EVENT, function( event ){
        event.stopPropagation();
        List.first();
      } );

      List.on( LAST_EVENT, function( event ){
        event.stopPropagation();
        List.last();
      } );

      List.on( STATED_EVENT, function( event, Control ){
        var $stated = Control.$element;

        if( $stated.is( $element ) ){
          return;
        }

        event.stopPropagation();

        if( !Selected ){
          Selected = Control;
          List.select( $stated );
          return;
        }

        if( Control.hasState( SELECTED_STATE ) && !$stated.is( Selected.$element ) ){
          List.select( $stated );
        }
      } );

      $( 'body' ).keyup( function( event ){
        keyup( event, List );
      } );
    },
    /**
     * adds a new item to $element
     * @method append
     * @public
     * @param {Array} A jQuery Collection of $items to append
     * @return {Object} List
     */
    add: function( $item ){
      this.$items = this.$items.add( $item );
      this.$items.parent().append( $item );
      return this;
    },
    /**
     * Removes an item from $element
     * @method remove
     * @public
     * @param {Array} A jQuery Collection of $items to remove
     * @return {Object} List
     */
    remove: function( $item ){
      $( $( $item ), this.$items ).remove();
      this.$items = this.$items.not( $item );
      return this;
    },
    /**
     * Selects the next item in the list.
     * @method next
     * @public
     * @return {Object} List
     */
    next: function(){
      if( this.hasNext() ){
        this.select( this.index + 1 );
      } else {
        this.trigger( OUT_OF_BOUNDS_EVENT, [ this.$element, NEXT_EVENT ] );
      }
      return this;
    },
    /**
     * Selects the previous item in the list.
     * @method previous
     * @public
     * @return {Object} List
     */
    previous: function(){
      if( this.hasPrevious() ){
        this.select( this.index - 1 );
      } else {
        this.trigger( OUT_OF_BOUNDS_EVENT, [ this.$element, PREVIOUS_EVENT ] );
      }
      return this;
    },
    /**
     * Selects the last item in the list.
     * @method last
     * @public
     * @return {Object} List
     */
    last: function(){
      this.select( this.$items.eq( this.size() - 1 ) );
      return this;
    },
    /**
     * Selects the first item in the list.
     * @method first
     * @public
     * @return {Object} List
     */
    first: function(){
      this.select( 0 );
      return this;
    },
    /**
     * Determines if there are any higher-index items in the list.
     * @method hasNext
     * @public
     * @return {Boolean} true if not at the last item in the list
     */
    hasNext: function(){
      return ( this.index < this.size() - 1 );
    },
    /**
     * Determines if there are any lower-index items in the list.
     * @method hasPrevious
     * @public
     * @return {Boolean} true if not at the first item in the list
     */
    hasPrevious: function(){
      return ( this.index > 0 );
    },
    /**
     * Returns the currently-selected item.
     * @method current
     * @public
     * @return {Object} JQuery object-reference to the selected item
     */
    current: function(){
      return this.$items.eq( this.index );
    },
    /**
     * Returns the number of items in the list.
     * @method size
     * @public
     * @return {Number} The number of items in the list
     */
    size: function(){
      return this.$items.size();
    }
  };
} );

if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( List );
  } else if( module.exports ){
   module.exports = List;
  }
}
