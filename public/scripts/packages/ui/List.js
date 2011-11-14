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
      selectFlag: 'selected'
    },
    $items;

  settings = _.extend( defaults, settings );

  if ( settings.items ) {
    if( typeof settings.items === 'string' ) {
      $items = $( settings.items );
    } else {
      $items = settings.items;
    }
  } else {
    $items = $element.children();
  }

  List.select = function ( item ) {
    var $item;
    if( typeof item === 'number' ) {
      $item = $items.eq( item );
    } else {
      $item = item;
    }
    if( $item.hasClass( settings.selectFlag ) === false ) {
      var $last = $items.filter( '.' + settings.selectFlag );
      $last.removeClass( settings.selectFlag );
      $item.addClass( settings.selectFlag );

      List.trigger( 'selected', [$item, List.index()] );
    }
  }
  List.next = function() {
    if( List.hasNext() ) {
      return List.select( $items.eq( List.index() + 1 ) );
    } else {
      return List.select( $items.eq( List.index() ) );
    }
  }
  List.previous = function() {
    if( List.hasPrevious() ) {
      return List.select( $items.eq( List.index() - 1 ) );
    } else {
      return List.select( $items.eq( List.index() ) );
    }
  }
  List.last = function() {
    return List.select( $items.eq( $items.length - 1 ) );
  }
  List.first = function() {
    return List.select( 0 );
  }

  List.hasNext = function() {
    return ( List.index() < $items.length - 1);
  }
  List.hasPrevious = function() {
    return ( List.index() > 0 );
  }
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
  }
  List.current = function() {
    return $items.eq( List.index() );
  }
  List.items = function() {
    return $items;
  }

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
