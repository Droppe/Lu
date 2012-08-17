/**
 * Manages a list of Containers.
 * @class List
 * @extends Switch
 * @require Container
 * @version 0.2.4
 */

var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Switch = require( 'lu/Switch' ),
  Fiber = require( 'Fiber' ),
  List;

List = Switch.extend( function( Switch ){

  var VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
    LIST_TAGS = 'ul, ol, dl',
    defaults = {
      orientation: HORIZONTAL
    };

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
          // noop
      }
    } else {
      // By default, list orientation is "horizontal" and left and right arrows work
      switch( keyCode ){
        case 37: //Left arrow
          List.previous();
          break;
        case 39: //Right arrow
          List.next();
          break;
        default:
      }
    }

    switch( keyCode ){
      case 36: //Home key
        List.first();
        break;
      case 35: //Last key
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

      _.defaults( settings, defaults );

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
       * Gets the selectable items
       * @public
       * @return {Object} a JQuery object-reference to the items
       */
      this.items = function(){
        var $items;

        if( settings.items ){
          if( typeof settings.items === 'string' ){
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

        return $items;
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
        var componentData,
          $item,
          idx;

        //return if no item was passed in.
        if( item === undefined ){
          return this;
        }

        //try to determine the index of the item being selected
        idx = ( typeof item === 'number' ) ? item : undefined;

        //Figure out what to select based on the param passed in.
        if( typeof item === 'number' && item <= this.size() - 1 ){
          $item = $items.eq( item );
        } else if( typeof item === 'string' ){
          $item = $items.filter( item );
          $item = ( $item.size() === 1 ) ? $item.eq( 0 ) : undefined;
        } else if( item instanceof $ && item.size() === 1 ){
          if( item.is( this.$items ) ){
            $item = item;
          }
        }

        //We could not determine which item to select so...
        if( $item === undefined ){
          this.trigger( constants.events.OUT_OF_BOUNDS, [this] );
          return this;
        }

        //Get the index of the item to be selected if we don't have it from above
        if( idx === undefined ) {
          idx = this.$items.index( $item );
        }

        if( idx > this.index() ){
          this.addState( constants.states.FORWARD ).removeState( constants.states.REVERSE );
        } else if( idx < this.index() ){
          this.addState( constants.states.REVERSE ).removeState( constants.states.FORWARD );
        }

        componentData = $item.lu( 'getComponents' ).Container;

        //There is no Container so create one.
        if( !componentData ){
          Lu.map( $item, 'Container', function(){} );
          Lu.execute( $item );
          componentData = $item.lu( 'getComponents' ).Container;
        }

        //Once the item is fully instantiated, select it.
        componentData.deferral.then( function(){
          var current = self.current();

          if( idx === index ){
            return;
          }

          //If there is a currently selected item remove the selected state
          if( current ){
            current.removeState( constants.states.SELECTED );
          }

          Selected = componentData.instance;
          if( idx === index ){
            return;
          } else {
            index = idx;
            Selected.addState( constants.states.SELECTED );
            self.trigger( constants.events.SELECTED, [self] );
          }
        } );

        return this;
      };

      this.$items = this.items();
      this.orientation = settings.orientation;

      this.on( constants.events.SELECT, function( event, component ){
        event.stopPropagation();
        self.select( component.$element.closest( self.$items ) );
      } );

      this.on( constants.events.NEXT, function( event ){
        event.stopPropagation();
        self.next();
      } );

      this.on( constants.events.PREVIOUS, function( event ){
        event.stopPropagation();
        self.previous();
      } );

      this.on( constants.events.FIRST, function( event ){
        event.stopPropagation();
        self.first();
      } );

      this.on( constants.events.LAST, function( event ){
        event.stopPropagation();
        self.last();
      } );

      this.on( constants.events.STATED, function( event, component ){
        event.stopPropagation();
        var current;

        if( !component.$element.is( self.$items ) ){
          return;
        }

        current = self.current();

        if( current ){
          if( component.$element.is( current.$element ) ){
            return;
          }
        }

        if( component.hasState ){
          if( component.hasState( constants.states.SELECTED ) ){
            self.select( component.$element );
          }
        }

      } );

      //TODO: How should we do this? What happens with multiple lists?
      // $( 'body' ).keyup( function( event ){
      //   handleKeyup( event, self );
      // } );
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
        this.trigger( constants.events.OUT_OF_BOUNDS, [ this ] );
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
        this.trigger( constants.events.OUT_OF_BOUNDS, [ this ] );
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
