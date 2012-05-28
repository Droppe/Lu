/**
 * Manages a list of Containers.
 * @class List
 * @constructor
 * @extends Abstract
 * @require Container
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 * @version 0.2.4
 */

var Switch = require( '/scripts/lu-controls/Switch' ),
  Container = require( '/scripts/lu-controls/Container' ),
  transitionDecorator = require( '/scripts/lu-decorators/Transition' ),
  List;

List = Switch.extend( function( Abstract ){

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
    defaults = {
      orientation: HORIZONTAL,
      index: 0
    };

  function contain( $item ){
    return lu.create( $item, ['Container'], { 'Container': {} } );
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
    init: function( $element, settings ){
      var List = this,
        Selected,
        Previous,
        $items;

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
          $items = $element.children( 'ul, ol' ).first().children();
        }
      }

      if( !$items ){
        $items = $element.children();
      }

      _.defaults( settings, defaults );

      Abstract.init.call( this, $element, settings );

      List.select = function( item ){
        var Container,
          $item,
          $items = this.$items,
          controls = 'lu-controls',
          index;

        if( item === undefined || item === null ){
          return List;
        }

        if( typeof item === 'number' ){
          $item = $items.eq( item );
        } else if ( typeof item === 'string' ){
          $item = $items.filter( item );
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

          Container = lu.getControl( $item, 'Container' );

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
    add: function( $item ){
      this.$items = this.$items.add( $item );
      this.$items.parent().append( $item );
      return this;
    },
    remove: function( $item ){
      $( $( $item ), this.$items ).remove();
      this.$items = this.$items.not( $item );
      return this;
    },
    next: function(){
      if( this.hasNext() ){
        this.select( this.index + 1 );
      } else {
        this.trigger( OUT_OF_BOUNDS_EVENT, [ this.$element, 'next' ] );
      }
      return this;
    },
    previous: function(){
      if( this.hasPrevious() ){
        this.select( this.index - 1 );
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
      return ( this.index < this.size() - 1 );
    },
    hasPrevious: function(){
      return ( this.index > 0 );
    },
    current: function(){
      return this.$items.eq( this.index );
    },
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
