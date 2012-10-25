/**
 * Manages a list of Containers.
 * @class self
 * @extends Switch
 */

var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Switch = require( 'lu/Switch' ),
  List;

List = Switch.extend( function( base ){

  var SELECTED = constants.statePrefix + constants.states.SELECTED,
    LIST_TAGS = 'ul, ol, dl',

    defaults = {
      index: undefined
    };

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

      base.init.call( this, $element, settings );

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
       * @return {Object} self
       */
      this.select = function( item ){
        var component,
          componentData,
          $item,
          idx;

        //this is a temp fix until the mutator can tell the list about new items
        this.$items = this.items();

        //return if no item was passed in.
        if( item === undefined ){
          return this;
        }

        //try to determine the index of the item being selected
        idx = ( typeof item === 'number' ) ? item : undefined;

        //Figure out what to select based on the param passed in.
        if( typeof item === 'number' && item <= this.size() - 1 ){
          $item = this.$items.eq( item );
        } else if( typeof item === 'string' ){
          $item = this.$items.filter( item );
          $item = ( $item.size() === 1 ) ? $item : undefined;
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

        _.each( $item.lu( 'getComponents' ), function( comp, key ){
          var instance;
          if( !component ){
            instance = comp.instance;
            if( instance ){
              if( typeof instance.removeState === 'function' && typeof instance.addState === 'function' ){
                component = comp;
              }
            }
          }
        } );

        //an acceptable component was not found.
        if( !component ){
          //Taking this out for now...
          //Lu.map( $item, 'Switch', function(){} );
          //Lu.execute( $item );
          component = $item.lu( 'getComponents' ).Switch;
        }


        //Once the item is fully instantiated, select it.
        component.deferral.then( function( Switch ){
          var current = self.current();

          //If there is a currently selected item remove the selected state
          if( current ){
            current.removeState( constants.states.SELECTED );
          } else {
            self.$items.filter( '.' + SELECTED ).not( Switch.$element ).removeClass( SELECTED );
          }

          Selected = Switch;
          index = idx;
          Selected.addState( constants.states.SELECTED );
          self.trigger( constants.events.SELECTED, [self] );
        } );

        return this;
      };

      this.$items = this.items();

      index = settings.index;
      if( index === undefined ){
        var $selected = this.$items.filter('.' + SELECTED );
        index = this.$items.index( $selected );
        if( index === -1 ){
          index = 0;
        }
      }

      //Automatically select an item during init
      self.select( index );

      this.on( constants.events.SELECT, function( event, component ){
        event.stopPropagation();

        var $element = component.$element,
          controls = $element.attr( 'aria-controls' ),
          href,
          $item;

        if( !controls ){
          href = $element.attr( 'href' );
          if( href ){
            controls = helpers.parseUri( href ).anchor;
          }
        }

        if( controls ){
          $item = $( '#' + controls );
          if( $item.is( self.$items ) ){
            self.select( $item );
          } else {
            self.select( component.$element.closest( self.$items ) );
          }
        } else {
          self.select( component.$element.closest( self.$items ) );
        }
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

    },

    /**
     * adds a new item to $element
     * @method append
     * @public
     * @param {Array} A jQuery Collection of $items to append
     * @return {Object} self
     */
    add: function( $item ){
      this.$items.parent().append( $item );
      this.$items = this.items();
      return this;
    },

    /**
     * Removes an item from $element
     * @method remove
     * @public
     * @param {Array} A jQuery Collection of $items to remove
     * @return {Object} self
     */
    remove: function( $item ){
      $( $( $item ), this.$items ).remove();
      this.$items = this.items();
      return this;
    },
    /**
     * Selects the next item in the list.
     * @method next
     * @public
     * @return {Object} self
     */
    next: function(){
      if( this.hasNext() ){
        this.select( this.index() + 1 );
      } else {
        this.trigger( constants.events.OUT_OF_BOUNDS, [this] );
      }
      return this;
    },
    /**
     * Selects the previous item in the list.
     * @method previous
     * @public
     * @return {Object} self
     */
    previous: function(){
      if( this.hasPrevious() ){
        this.select( this.index() - 1 );
      } else {
        this.trigger( constants.events.OUT_OF_BOUNDS, [this] );
      }
      return this;
    },
    /**
     * Selects the last item in the list.
     * @method last
     * @public
     * @return {Object} self
     */
    last: function(){
      this.select( this.$items.eq( this.size() - 1 ) );
      return this;
    },
    /**
     * Selects the first item in the list.
     * @method first
     * @public
     * @return {Object} self
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
