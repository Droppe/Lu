var Class = li.require( 'libraries/ptclass' ),
  Abstract = li.require( 'ui/Abstract' ),
  List;

/**
 * A representation of a stateful list
 * @class List
 * @constructor
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 */
List = Class.create( Abstract, ( function() {

  var defaults = {
      /**
   	   * The CSS class that designates a selected list item
   	   * @property selectFlag
   	   * @default 'selected'
   	   * @type String
   	   * @final
    	 */
      selectFlag: 'selected'
    };
    
  return {
    initialize: function ( $super, $element, settings ){

      var self = this,
        cItems,
        config = _.extend( defaults, settings );
      
      $super($element, config );

      /* 
       * Scan for items from the provided selector,
       * or default to the children of the container.
       */
      cItems = config.items;
      
      if ( cItems ) {
        if( typeof cItems === 'string' ) {
          self.$items = $( cItems );
        } else {
          self.$items = cItems;
        }
      } else {
        self.$items = $element.children();
      }
      
      // event listeners
      $element.on( 'select', function( event, item ) {
        event.stopPropagation();
        self.select( item );
      } );
      $element.on( 'next', function( event, item ) {
        event.stopPropagation();
        self.next();
      } );
      $element.on( 'previous', function( event, item ) {
        event.stopPropagation();
        self.previous();
      } );
      $element.on( 'first', function( event, item ) {
        event.stopPropagation();
        self.first();
      } );
      $element.on( 'last', function( event, item ) {
        event.stopPropagation();
        self.last();
      } );
      
    },
    
    /**
     * Select an item in the list
     * @method selectItem
     * @public
     * @param {Integer|Object} item The index of the item to select, or a JQuery instance of the item.
     * @return {Void}
     */  
    select: function ( item ) {
      var $item, 
        $last;
      
      if( typeof item === 'number' ) {
        $item = this.$items.eq( item );
      } else {
        $item = item;
      }
    
      if( $item.hasClass( this.__config.selectFlag ) === false ) {
        $last = this.$items.filter( '.' + this.__config.selectFlag );
        $last.removeClass( this.__config.selectFlag );
        $item.addClass( this.__config.selectFlag );
        this.trigger( 'selected', [$item, this.index()] );
      }
    
    },
  
    /**
     * Selects the next item in the list. 
     * @method next
     * @public
     * @return {Void}
     */
    next: function() {
      var x = ( this.hasNext() ) ? 1 : 0;
      this.select( this.$items.eq( this.index() + x ) );
    },

    /**
     * Selects the previous item in the list. 
     * @method previous
     * @public
     * @return {Void}
     */  
    previous: function() {
      var x = ( this.hasPrevious() ) ? 1 : 0;    
      this.select( this.$items.eq( this.index() - x ) );
    },
  
    /**
     * Selects the last item in the list. 
     * @method last
     * @public
     * @return {Void}
     */  
    last: function() {
      this.select( this.$items.eq( this.$items.length - 1 ) );
    },
  
    /**
     * Selects the first item in the list. 
     * @method first
     * @public
     * @return {Void}
     */  
    first: function() {
      this.select( 0 );
    },

    /**
     * Determines if there are any higher-index items in the list.
     * @method hasNext
     * @public
     * @return {Boolean} true if not at the last item in the list
     */
    hasNext: function() {
      return ( this.index() < this.$items.length - 1);
    },
  
    /**
     * Determines if there are any lower-index items in the list.
     * @method hasPrevious
     * @public
     * @return {Boolean} true if not at the first item in the list
     */
    hasPrevious: function() {
      return ( this.index() > 0 );
    },
  
    /**
     * Returns the index of the selected item.
     * @method index
     * @public
     * @return {Number} The index of the selected item
     */
    index: function() {
      var ndx = -1;
      _.each( this.$items, function( item, index ) {
        var $item = $( item );
        if( $item.hasClass( this.__config.selectFlag ) ) {
          ndx = index;
          return;
        }
      } );
      return ndx;
    },

    /**
     * Returns the currently-selected item.
     * @method current
     * @public
     * @return {Object} JQuery object-reference to the selected item
     */  
    current: function() {
      return this.$items.eq( this.index() );
    },

    /**
     * Returns the array of list items. 
     * @method items
     * @public
     * @return {Array} The array of list items
     */  
    items: function() {
      return this.$items;
    },

    /**
     * Sets the array of list items. 
     * @method setItems
     * @public
     * @param {Array} $newItems An array of JQuery objects representing the new list of items.
     * @return {Void}
     */  
    setItems: function($newItems) {
      this.$items = $newItems;
    },

    /**
     * Returns the number of items in the list. 
     * @method size
     * @public
     * @return {Number} The number of items in the list
     */
    size: function() {
      return this.$items.length;
    }
    
  };
  
})() );


if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = List;
}
