/**
 * A representation of a stateful list
 * @class List
 * @constructor
 * @require ptclass
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 * @version 0.1.0
 */

var Container = require( '/scripts/lu-controls/Container' ),
  StateDecorator = require( '/scripts/lu-decorators/State' ),
  List;

  var NEXT_EVENT = 'next',
    LAST_EVENT = 'last',
    FIRST_EVENT = 'first',
    PREVIOUS_EVENT = 'previous',
    SELECT_EVENT = 'select',
    SELECTED_EVENT = 'selected',
    OUT_OF_BOUNDS_EVENT = 'out-of-bounds',
    PAUSED_STATE = 'paused',
    PLAYING_STATE = 'playing',
    FLOORED_STATE = 'floored',
    MAXED_STATE = 'maxed',
    TRANSITIONING_STATE = 'transitioning',
    TRANSITIONED_STATE = 'transitioned',
    SELECTED_STATE = 'selected',
    TRANSITIONING_IN_STATE = 'transitioning-in',
    TRANSITIONING_OUT_STATE = 'transitioning-out',
    FORWARD_STATE = 'forward',
    REVERSE_STATE = 'reverse',
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
    defaults = {
      orientation: HORIZONTAL
    };

List = Container.extend( function( Container ){

  function createContainer( $item, settings ){
      var Control = lu.getControl( $item, 'Container' );

    if( !Control ){
      lu.create( $item, ['Container'], settings );
    }

    return $item;
  }

  return {
    init: function( $element, settings ){
      var List = this,
        $items;

      Container.init.call( this, $element, settings );

      if( settings.items ){
        if( typeof settings.items === 'string' ){
          $items = $element.children( settings.items );
        } else {
          $items = settings.items;
        }
      } else {
        if( $element.is( 'ul, ol' ) ){
          $items = $element.children();
        } else {
          $items = $element.find( 'ul, ol' ).first().children();
        }
      }

      _.each( $items, function( item, index ){
        createContainer( $( item ) );
      } );

      List.on( SELECT_EVENT, function( event, item ){
        event.stopPropagation();
        List.removeState( [REVERSE_STATE, FORWARD_STATE] ).select( item );
      } );
      List.on( NEXT_EVENT, function( event ){
        event.stopPropagation();
        List.removeState( REVERSE_STATE ).addState( FORWARD_STATE ).next();
      } );
      List.on( PREVIOUS_EVENT, function( event ){
        event.stopPropagation();
        List.removeState( FORWARD_STATE ).addState( REVERSE_STATE ).previous();
      } );
      List.on( FIRST_EVENT, function( event ){
        event.stopPropagation();
        List.removeState( [REVERSE_STATE, FORWARD_STATE] ).first();
      } );
      List.on( LAST_EVENT, function( event ){
        event.stopPropagation();
        List.removeState( [REVERSE_STATE, FORWARD_STATE] ).last();
      } );

      List.$items = $items;
    },
    select: function( item ){
      var List = this,
        Container,
        Previous,
        $items = this.$items,
        $item,
        $previous;

      if( item === undefined || item === null ){
        return List;
      }

      if( typeof item === 'number' ){ // Item is an index number
        $item = $items.eq( item );
      } else if ( typeof item === 'string' ){ // Item is a string/CSS selector
        $item = $items.filter( item );
      } else { // Item is a JQuery object
        $item = item;
      }

      if( $item.is( $items ) ){
        _.each( $items, function( item, index ){
          var $item = $( item ),
            Container = lu.getControl( $item , 'Container' );
          if( Container.hasState( SELECTED_STATE ) ){
            $previous = $item;
            Previous = Container;
          }
          Container.removeState( SELECTED_STATE );
        } );

        Container = lu.getControl( $item , 'Container' )
        Container.addState( SELECTED_STATE );

        if( $.support.transitionEnd ){
          Container.removeState( [TRANSITIONING_IN_STATE, TRANSITIONING_OUT_STATE] );

          Previous.removeState( TRANSITIONING_IN_STATE ).addState( TRANSITIONING_OUT_STATE );
          Container.removeState( TRANSITIONING_OUT_STATE ).addState( TRANSITIONING_IN_STATE );

          Container.one( $.support.transitionEnd.event, function( event ){
            Previous.removeState( [TRANSITIONING_IN_STATE, TRANSITIONING_OUT_STATE] );
            Container.removeState( [TRANSITIONING_IN_STATE, TRANSITIONING_OUT_STATE] );
          } );
        }

        if( !this.hasPrevious() ){
          this.addState( FLOORED_STATE );
        } else {
          this.removeState( FLOORED_STATE );
        }

        if( !this.hasNext() ){
          this.addState( MAXED_STATE );
        } else {
          this.removeState( MAXED_STATE );
        }

      } else {
        List.trigger( OUT_OF_BOUNDS_EVENT, [this.$element] );
      }
    },
    append: function( $item ){
      this.$items.parent().append( createContainer( $item ) );
      return List;
    },
    remove: function( $item ){
      $( $item, List.$items ).remove();
      return List;
    },
    next: function(){
      if( this.hasNext() ){
        this.select( this.index() + 1 );
      } else {
        this.trigger( OUT_OF_BOUNDS_EVENT, [ this.$element, 'next' ] );
      }
      return this;
    },
    previous: function(){
      if( this.hasPrevious() ){
        this.select( this.index() - 1 );
      } else {
        this.trigger( OUT_OF_BOUNDS_EVENT, [ this.$element, 'previous' ] );
      }
      return this;
    },
    last: function(){
      this.select( this.$items.eq( this.size() - 1 ) );
      return this;
    },
    first: function(){
      this.select( 0 );
      return this;
    },
    hasNext: function(){
      return ( this.index() < this.size() - 1 );
    },
    hasPrevious: function(){
      return ( this.index() > 0 );
    },
    index: function(){
      return this.$items.index( this.$items.filter( function( index, item ){
        return lu.getControl( $( item ), 'Container' ).hasState( 'selected' );
      } ) );
    },
    current: function(){
      return this.$items.eq( this.index() );
    },
    items: function(){
      return this.$items;
    },
    size: function(){
      return this.$items.length;
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
