var id = 'ui:List',
  Abstract = li.require( 'ui/Abstract' ),
  List;

/**
 * A representation of a stateful list
 * @class List
 * @constructor
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 */
List = Abstract.extend( function ( $element, settings ){
  var List = this,
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
    $items;

  settings = _.extend( defaults, settings );

  /* 
   * Scan for items from the provided selector,
   * or default to the children of the container.
   * TODO: This code is problematic for any classes that extend List, 
   * because we can't overwrite these settings within the subclass.
   * Will ptklass fix this, since we'll be able to call super()?
   */
  if ( settings.items ) {
    if( typeof settings.items === 'string' ) {
      $items = $( settings.items );
    } else {
      $items = settings.items;
    }
  } else {
    $items = $element.children();
  }

  /**
   * Select an item in the list
   * @method selectItem
   * @public
   * @param {Integer|Object} item The index of the item to select, or a JQuery instance of the item.
   * @return {Void}
   */  
  List.select = function ( item ) {
    var $item, 
      $last;
      
    if( typeof item === 'number' ) {
      $item = $items.eq( item );
    } else {
      $item = item;
    }
    
    if( $item.hasClass( settings.selectFlag ) === false ) {
      $last = $items.filter( '.' + settings.selectFlag );
      $last.removeClass( settings.selectFlag );
      $item.addClass( settings.selectFlag );

      List.trigger( 'selected', [$item, List.index()] );
    }
    
  };
  
  /**
   * Selects the next item in the list. 
   * @method next
   * @public
   * @return {Void}
   */
  List.next = function() {
    var x = ( List.hasNext() ) ? 1 : 0;
    
    List.select( $items.eq( List.index() + x ) );
  };

  /**
   * Selects the previous item in the list. 
   * @method previous
   * @public
   * @return {Void}
   */  
  List.previous = function() {
    var x = ( List.hasPrevious() ) ? 1 : 0;
    
    List.select( $items.eq( List.index() - x ) );
  };
  
  /**
   * Selects the last item in the list. 
   * @method last
   * @public
   * @return {Void}
   */  
  List.last = function() {
    List.select( $items.eq( $items.length - 1 ) );
  };
  
  /**
   * Selects the first item in the list. 
   * @method first
   * @public
   * @return {Void}
   */  
  List.first = function() {
    List.select( 0 );
  };

  /**
   * Determines if there are any higher-index items in the list.
   * @method hasNext
   * @public
   * @return {Boolean} true if not at the last item in the list
   */
  List.hasNext = function() {
    return ( List.index() < $items.length - 1);
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
   * Sets the array of list items. 
   * @method setItems
   * @public
   * @param {Array} $newItems An array of JQuery objects representing the new list of items.
   * @return {Void}
   */  
  List.setItems = function($newItems) {
    $items = $newItems;
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


  // Subscribe to custom events
  $element.on( 'select', function( event, item ) {
    event.stopPropagation();
    List.select( item );
  } );
  $element.on( 'next', function( event, item ) {
    event.stopPropagation();
    List.next();
  } );
  $element.on( 'previous', function( event, item ) {
    event.stopPropagation();
    List.previous();
  } );
  $element.on( 'first', function( event, item ) {
    event.stopPropagation();
    List.first();
  } );
  $element.on( 'last', function( event, item ) {
    event.stopPropagation();
    List.last();
  } );
  

} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = List;
}
