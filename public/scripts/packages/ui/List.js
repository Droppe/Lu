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
List =  Class.create( Abstract, ( (function(){

  // Private attributes
  /**
   * Instance of Button
   * @property Button
   * @type Object
   * @private
   */  
  var self,
  /**
   * Configuration values
   * @property onfig
   * @private
   * @type {Object}
   */
  config,
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
     selectFlag: 'selected'
  },
  /**
   * JQuery collection of like items in the list
   * @property $items
   * @type Object
   * @private
   */
  $items;  
  
  // Return methods object 
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
      self = this;
      
      // Mix the defaults into the settings values
      config = _.defaults( settings, defaults );
      
      //Scan for items from the provided selector, or default to the children of the container.
      if ( config.items ) {
        if( typeof config.items === 'string' ) {
          $items =  $element.children( config.items ).children();
        } else {
          $items = config.items.children();
        }
      } else {
        $items = $element.children();
      }

      // Call the parent's constructor
      $super( $element, config );
      
      // Event bindings
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
     * Append a new item to $element
     * @method append
     * @public
     * @param {Array} A jQuery Collection of $items to append
     * @return {Object} List
     */  
    append: function ( $item ) {
      $items.parent().append( $item );
      return self;
    },
    /**
     * Removes an item from $element
     * @method remove
     * @public
     * @param {Array} A jQuery Collection of $items to remove
     * @return {Object} List
     */  
    remove: function ( $item ) {
      $( $item, $items.parent() ).remove();
      return self;
    },
    /**
     * Select an item in the list
     * @method select
     * @public
     * @param {Integer|Object} item The index of the item to select, or a JQuery instance of the item.
     * @return {Object} List
     */  
    select: function ( item ) {
      var $item;

      if( typeof item === 'number' ) {
        $item = $items.eq( item );
      } else {
        $item = item;
      }

      if( $item.hasClass( config.selectFlag ) === false ) {
        $items.filter( '.' + config.selectFlag ).removeClass( config.selectFlag );
        self.trigger( 'selected', [$item.addClass( config.selectFlag ), self.index()] );
      }
      return self;
    },
    /**
     * Selects the next item in the list. 
     * @method next
     * @public
     * @return {Object} List
     */
    next: function() {
      var increment = 0;
      if(  self.hasNext() ) {
        increment = 1;
      } else {
         self.trigger( 'max' );
      }
      self.select( $items.eq( self.index() + increment ) );
      return self;
    },
    /**
     * Selects the previous item in the list. 
     * @method previous
     * @public
     * @return {Object} List
     */  
    previous: function() {
      var decrement = 0;
      if( self.hasPrevious() ) {
        decrement = 1;
      } else {
         self.trigger( 'min' );
      }
      self.select( $items.eq( self.index() - decrement ) );
      return self;
    },
    /**
     * Selects the last item in the list. 
     * @method last
     * @public
     * @return {Object} List
     */  
    last: function() {
      self.select( $items.eq( $items.length - 1 ) );
      return self;
    },
    /**
     * Selects the first item in the list. 
     * @method first
     * @public
     * @return {Object} List
     */  
    first: function() {
      self.select( 0 );
      return self;
    },    
    /**
     * Determines if there are any higher-index items in the list.
     * @method hasNext
     * @public
     * @return {Boolean} true if not at the last item in the list
     */
    hasNext: function() {
      return ( self.index() < $items.length - 1);
    },
    /**
     * Determines if there are any lower-index items in the list.
     * @method hasPrevious
     * @public
     * @return {Boolean} true if not at the first item in the list
     */
    hasPrevious: function() {
      return ( self.index() > 0 );
    },
    /**
     * Returns the index of the selected item.
     * @method index
     * @public
     * @return {Number} The index of the selected item
     */
    index: function() {
      var ndx = -1;
      _.each( $items, function( item, index ) {
        var $item = $( item );
        if( $item.hasClass( config.selectFlag ) ) {
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
      return $items.eq( self.index() );
    },
    /**
     * Returns the array of list items. 
     * @method items
     * @public
     * @return {Array} The array of list items
     */  
    items: function() {
      return $items;
    },
    /**
     * Returns the number of items in the list. 
     * @method size
     * @public
     * @return {Number} The number of items in the list
     */
    size: function() {
      return $items.length;
    }
  };

})() ));


// Export to Athena Framework
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = List;
}
