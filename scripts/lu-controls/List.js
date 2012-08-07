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

/**
 * Instantiates Container objects on list items.
 * @param  {Object} $item  A JQuery collection referencing a list item to create a Container on
 * @return {Object} Promise 
 */
  function contain( $item ){
    return $.Deferred( function( dfd ){
      lu.create( $item, [CONTAINER], { CONTAINER: {} } );
      // $item.data( 'luControls' ).Deferred.done( function() {
      //   dfd.resolve( $item );
      // } );
    } ).promise();
  }

  /**
   * Handles the keyup event and looks for keycodes 37, 38, 39 and 40.  These correspond to left, up, right and down
   * arrows.  Left and up correspond to action "previous" and right and next correspond to "next".
   * @method handleKeyup
   * @private
   * @param {Event} event An event object
   * @param {Object} List the list control to handle
   * @return {Void}
   */
  function handleKeyup( event, List ){
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
          break;
        default:
          // no op
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
      var self = this,
        Selected,
        Previous,
        $items,
        index;

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

      index = settings.index;

      Switch.init.call( this, $element, settings );

      /**
       * gets the 0 based index of the selected item.
       * @method index
       * @public
       * @return {Number} index
       */
      this.index = function(){
        return index;
      };

      /**
       * Returns the currently-selected Container.
       * @method current
       * @public
       * @return {Object} JQuery object-reference to the selected item
       */
      this.current = function(){
        return Selected;
      };

      /**
       * Select an item in the list
       * @method select
       * @public
       * @param {Integer|String|Object} item The index of the item to 
       * select, a css selector, or a JQuery collection containing the item.
       * @return {Object} List
       */
      this.select = function( item ){
        var Container,
          $item,
          idx;

        //return if no item was passed in.
        if( item === undefined ){
          return this;
        }

        console.log( 'W))T' );

        //try to determine the index of the item being selected
        idx = ( typeof item === 'number' ) ? item : undefined;

        // if we can get the index above and it is already selected - everything is already done!
        // if( idx === index ){
        //   return this;
        // }

        //Figure out what to select based on the param passed in.
        if( typeof item === 'number' && item <= this.size() - 1 ){
          $item = $items.eq( item );
        } else if( typeof item === 'string' ){
          $item = $items.filter( item );
          $item = ( $item.size() === 1 ) ? $item.eq( 0 ) : undefined;
        } else if( item instanceof $ && item.size() === 1 && item.is( $items ) ){
          $item = item;
        }

        //We could not determine which item to select so...
        if( $item === undefined ){
          this.trigger( OUT_OF_BOUNDS_EVENT, [this] );
          return this;
        }

        //Get the index of the item to be selected if we don't have it from above
        if( idx === undefined ) {
          idx = $items.index( $item );
        }

        if( idx > this.index() ){
          this.addState( FORWARD_STATE ).removeState( REVERSE_STATE );
        } else if( idx < this.index() ){
          this.addState( REVERSE_STATE ).removeState( FORWARD_STATE );
        }

        //Grab the deferred object
        Deferred = $item.data( 'luControls' ).Deferred;

        //Get the item's Container
        Container = lu.getControl( $item, 'Container' );

        console.log( 'Container', Container, $item );
        //There is no Container so create one.
        // if( !Container ){
        //   contain( $item );
        // }

        // Once the item is fully instantiated, select it.
        Deferred.done( function(){
          var current = self.current();
          //If there is a currently selected item remove the selected state
          if( current ){
            current.removeState( SELECTED_STATE );
          }
          Selected = Container;
          if( idx === index ){
            return;
          } else {
            index = idx;
            Selected.addState( SELECTED_STATE );
            self.trigger( SELECTED_EVENT, [self] );
          }
        } );

        return this;
      }

      this.$items = $items;
      this.orientation = settings.orientation;

      this.on( SELECT_EVENT, function( event, item ){
        event.stopPropagation();
        self.select( item );
      } );

      this.on( NEXT_EVENT, function( event ){
        event.stopPropagation();
        self.next();
      } );

      this.on( PREVIOUS_EVENT, function( event ){
        event.stopPropagation();
        self.previous();
      } );

      this.on( FIRST_EVENT, function( event ){
        event.stopPropagation();
        self.first();
      } );

      this.on( LAST_EVENT, function( event ){
        event.stopPropagation();
        self.last();
      } );

      this.on( STATED_EVENT, function( event, Control ){
        console.log( 'Stated Event Received', event, Control );
        event.stopPropagation();
        if( Control.hasState ){
          if( Control.hasState( SELECTED_STATE ) ){
            console.log( 'we should select something' );
            self.select( Control.$element );
          }
        }

      } );

      $( 'body' ).keyup( function( event ){
        handleKeyup( event, self );
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
        this.select( this.index() + 1 );
      } else {
        this.trigger( OUT_OF_BOUNDS_EVENT, [ this ] );
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
        this.select( this.index() - 1 );
      } else {
        this.trigger( OUT_OF_BOUNDS_EVENT, [ this ] );
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
      return ( this.index() < this.size() - 1 );
    },
    /**
     * Determines if there are any lower-index items in the list.
     * @method hasPrevious
     * @public
     * @return {Boolean} true if not at the first item in the list
     */
    hasPrevious: function(){
      return ( this.index() > 0 );
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
