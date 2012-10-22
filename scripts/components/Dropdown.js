var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Switch = require( 'lu/Switch' ),
  Dropdown;

/**
 * Dropdown Lu control
 * @class Dropdown
 * @extends Switch
 * @constructor
 */
Dropdown = Switch.extend( function ( base ) {
  var LIST_ATTR = '[data-lu=List]',
    KEY_EVT = 'keydown',
    KEY_ENTER = 13,
    KEY_ESCAPE = 27,
    KEY_UP = 38,
    KEY_DOWN = 40,
    BUTTON_STATE = '[data-lu="Button:State"]',
    BUTTON_SELECT = '[data-lu="Button:Select"]',
    TIMER_MS = 250,
    isIgnoredTrigger = false,
    listInitialIndex = 0,
    $listBtn = [],

    /**
     * Default configuration values
     * @property defaults
     * @private
     * @type {Object}
     * @final
     */
    defaults = {
      /**
       * A selector that matches button element to display selected element text
       * @property label
       * @type {String}
       */
      label: BUTTON_STATE + ':first-child',
      /**
       * The attribute that contains selected element's value
       * @property valueAttr
       * @type {String}
       */
      valueAttr: 'data-lu-value'
    };

  /**
   * Arrow key handler
   * @method handleArrowKey
   * @private
   * @param {Number} direction Specifies which list element to select. -1 for previous item, 1 for next list item
   * @param {String} state Dropdown element's current state
   */
  function handleArrowKey( direction, state ){
    var list = this.listInstance;

    isIgnoredTrigger = true;

    // expand dropdown if inactive
    if( state === constants.states.INACTIVE ){
      this.expand();
    }else{
      // up
      if( direction < 0 ){
        if( list.hasPrevious() ){
          list.previous();
        }else{
          list.last();
        }

      // down
      }else if( direction > 0 ){
        if( list.hasNext() ){
          list.next();
        }else{
          list.first();
        }
      }
    }
  }

  /**
   * Enter key handler
   * @method handleEnterKey
   * @private
   * @param {String} state Dropdown element's current state
   */
  function handleEnterKey( state ){
    if( state === constants.states.ACTIVE ){
      update.call( this, true );
    }else if( state === constants.states.INACTIVE ){
      this.expand();
    }
  }

  /**
   * Key manager
   * @method handleKeyEvents
   * @private
   * @param {Object} evt Event object
   */
  function handleKeyEvents( evt ){
    var $target = $(evt.target),
      key = evt.keyCode,
      state = this.getState()[0];

    if( !$target.is( this.$element ) && !$target.is( BUTTON_STATE ) ){
      return;
    }

    switch( key ){
      case KEY_UP:
        handleArrowKey.call( this, -1, state );
        break;

      case KEY_DOWN:
        handleArrowKey.call( this, 1, state );
        break;

      case KEY_ENTER:
        evt.preventDefault();
        handleEnterKey.call( this, state );
        break;

      case KEY_ESCAPE:
        this.resetList();
        break;
    }
  }

  /**
   * Actions after item has been selected from list
   * @method update
   * @private
   * @param {Boolean} fromKey Is the caller a key handler?
   */
  function update( fromKey ){
    var href;

    updateLabel.call( this );
    this.collapse();

    // follow link if triggered by enter key
    if( fromKey && $listBtn.is( 'a' ) ){
      href = $listBtn.attr( 'href' );
      window.location.href = href;
    }
  }

  /**
   * Updates dropwdown label with text from list item
   * @method updateLabel
   * @private
   */
  function updateLabel(){
    if( this.$label.length > 0 && $listBtn.length > 0 ){
      this.$label.html( $listBtn.html() );
    }
  }

  // RETURN METHODS OBJECT
  return {
    /**
     * Class constructor
     * @method initialize
     * @public
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */
    init: function ( $element, settings ){
      var $list = $element.find( LIST_ATTR ),
        listComponent,
        timer,
        self = this;

      _.defaults( settings, defaults );
      base.init.call( this, $element, settings );

      if( $list.length < 1 ){
        return;
      }

      listComponent = $list.lu('getComponents').List;

      self.$stateButton = $element.find( BUTTON_STATE );
      self.$label = ( typeof settings.label !== 'undefined' && settings.label !== false ) ? $element.find( settings.label ) : [];
      self.valueAttr = settings.valueAttr;

      // get reference of list component instance
      listComponent.deferral.then( function(){
        self.listInstance = listComponent.instance;

        self.listInstance.on( constants.events.SELECTED, function( evt, component ){
          $listBtn = self.listInstance.current().$element.find( BUTTON_SELECT );

          // prevent label update on arrow key events
          if( !isIgnoredTrigger ){
            update.call( self );
          }
          
          isIgnoredTrigger = false;
        } );
      } );

      // stated event handler on dropdown
      self.on( constants.events.STATED, function( evt, obj ){
        var state = self.getState()[0];

        if( state === constants.states.ACTIVE ){
          listInitialIndex = self.listInstance.index();
        }
      } );

      // keydown event handler
      self.$element.on( KEY_EVT, function(){
        handleKeyEvents.apply( self, arguments );
      } );

      // force collapse when dropdown loses focus
      self.$element.on( 'focusin', function( evt ){
        var $tget = $( evt.target );

        if( $tget.closest( self.$element ) ){
          clearTimeout( timer );
        }
      } );

      self.$element.on( 'focusout', function( evt ){
        timer = setTimeout( function(){
          self.resetList();
        }, TIMER_MS );
      } );
    },

    /**
     * Sets dropdown to expanded state
     * @method expand
     * @public
     */
    expand: function(){
      this.setState( constants.states.ACTIVE );
    },

    /**
     * Sets dropdown to collapsed state
     * @method collapse
     * @public
     */
    collapse: function(){
      this.setState( constants.states.INACTIVE );
    },

    /**
     * Reset list to original state when no selections are made
     * @method resetList
     * @public
     */
    resetList: function(){
      isIgnoredTrigger = true;

      this.listInstance.select( listInitialIndex );
      this.collapse();
    },

    /**
     * Get the dropdown's selected value
     * @method getValue
     * @public
     * @return {String} value Selected value
     */
    getValue: function(){
      var value = '';

      if( typeof $listBtn.attr( this.valueAttr ) !== 'undefined' ){
        value = $listBtn.attr( this.valueAttr );
      }

      return value;
    }
  };

} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Dropdown );
  } else if( module.exports ){
   module.exports = Dropdown;
  }
}
