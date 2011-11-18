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
List =  Class.create( Abstract, ( function () {

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
     initialize: function ( $super, $element, settings ){

       // PRIVATE INSTANCE PROPERTIES
      
      /**
       * Instance of Button
       * @property Button
       * @type Object
       * @private
       */  
      var self = this,
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


      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
      
      //Scan for items from the provided selector, or default to the children of the container.
      if ( settings.items ) {
        if( typeof config.items === 'string' ) {
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
       * Gets JQuery collection of like items in the list
       * @method Name
       * @public|private
       * @param {Type} Name Description
       */
      self.getItems = function () {
        return _.clone($items);
      };
      
      // EVENT BINDINGS
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
      this.getItems().parent().append( $item );
      return this;
    },
    /**
     * Removes an item from $element
     * @method remove
     * @public
     * @param {Array} A jQuery Collection of $items to remove
     * @return {Object} List
     */  
    remove: function ( $item ) {
      $( $item, this.getItems().parent() ).remove();
      return this;
    },
    /**
     * Select an item in the list
     * @method select
     * @public
     * @param {Integer|Object} item The index of the item to select, or a JQuery instance of the item.
     * @return {Object} List
     */  
    select: function ( item ) {
      var $item,
        settings = this.getSetting(),
        $items = this.getItems();

      if( typeof item === 'number' ) {
        $item = $items.eq( item );
      } else {
        $item = item;
      }

      if( $item.hasClass( settings.selectFlag ) === false ) {
        $items.filter( '.' + settings.selectFlag ).removeClass( settings.selectFlag );
        this.trigger( 'selected', [$item.addClass( settings.selectFlag ), this.index()] );
      }
      return this;
    },
    /**
     * Selects the next item in the list. 
     * @method next
     * @public
     * @return {Object} List
     */
    next: function() {
      var increment = 0;
      if(  this.hasNext() ) {
        increment = 1;
      } else {
         this.trigger( 'max' );
      }
      this.select( this.getItems().eq( this.index() + increment ) );
      
      return this;
    },
    /**
     * Selects the previous item in the list. 
     * @method previous
     * @public
     * @return {Object} List
     */  
    previous: function() {
      var decrement = 0;

      if( this.hasPrevious() ) {
        decrement = 1;
      } else {
         this.trigger( 'min' );
      }
      
      this.select( this.getItems().eq( this.index() - decrement ) );
      return this;
    },
    /**
     * Selects the last item in the list. 
     * @method last
     * @public
     * @return {Object} List
     */  
    last: function() {
      var items = this.getItems();
      
      this.select( items.eq( items.length - 1 ) );
      return this;
    },
    /**
     * Selects the first item in the list. 
     * @method first
     * @public
     * @return {Object} List
     */  
    first: function() {
      this.select( 0 );
      return this;
    },    
    /**
     * Determines if there are any higher-index items in the list.
     * @method hasNext
     * @public
     * @return {Boolean} true if not at the last item in the list
     */
    hasNext: function() {
      return ( this.index() < this.getItems().length - 1);
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
      var that = this,
        ndx = -1;
      _.each( that.getItems(), function( item, index ) {
        var $item = $( item );
        if( $item.hasClass( that.getSetting().selectFlag ) ) {
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
      return this.getItems().eq( this.index() );
    },
    /**
     * Returns the array of list items. 
     * @method items
     * @public
     * @return {Array} The array of list items
     */  
    items: function() {
      return this.getItems();
    },
    /**
     * Returns the number of items in the list. 
     * @method size
     * @public
     * @return {Number} The number of items in the list
     */
    size: function() {
      return this.getItems().length;
    }
  };

}() ));


// Export to Athena Framework
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = List;
}
