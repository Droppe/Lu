var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Switch = require( 'lu/Switch' ),
  Dropdown;

/**
 * Dropdown Lu Control
 * Experimental feature, subject to change
 * @class Dropdown
 * @extends Switch
 * @constructor
 * @version 0.1.0 experimental
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
    listPrevIndex = 0,
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
       * A selector that matches the button element that will display the selected list item's text.
       * Specify Boolean false for no label.
       * @property label
       * @type {Mixed}
       */
      label: BUTTON_STATE + ':first-child',
      /**
       * The attribute that contains selected element's value.
       * If attribute doesn't exist, list item's text will be used as value.
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

    // expand dropdown if inactive
    if( state === constants.states.INACTIVE ){
      this.expand();
    }else{
      isIgnoredTrigger = true;

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
        resetList.call( this );
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
    var href,
      index = this.listInstance.index();

    $listBtn = this.listInstance.current().$element.find( BUTTON_SELECT );

    setLabel.call( this );

    if( index !== listPrevIndex ){
      listPrevIndex = index;
      this.trigger( constants.events.UPDATED, this );
    }

    this.collapse();

    // follow link if triggered by enter key
    if( fromKey && $listBtn.is( 'a' ) ){
      var instance = $listBtn.lu('getComponent', 'Button'),
        settings = instance.settings;

      if( 'preventDefault' in settings && !settings.preventDefault ){
        window.location.href = $listBtn.attr('href');
      }
    }
  }

  /**
   * Updates dropwdown label with text from list item
   * @method setLabel
   * @private
   */
  function setLabel(){
    if( this.$label.length > 0 && $listBtn.length > 0 ){
      this.$label.html( $listBtn.html() );
    }
  }

  /**
   * Reset list to original state when no selections are made
   * @method resetList
   * @private
   */
  function resetList(){
    isIgnoredTrigger = true;

    this.listInstance.select( listPrevIndex );
    this.collapse();
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
      self.$label = ( typeof settings.label !== 'undefined' || settings.label !== false ) ? $element.find( settings.label ) : [];
      self.valueAttr = settings.valueAttr;

      // get reference of list component instance
      listComponent.deferral.then( function(){
        self.listInstance = listComponent.instance;
        listPrevIndex = self.listInstance.index();

        self.listInstance.on( constants.events.SELECTED, function( evt, component ){
          // prevent updates on arrow key events
          if( !isIgnoredTrigger ){
            update.call( self );
          }
          
          isIgnoredTrigger = false;
        } );
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
          resetList.call( self );
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
     * Get the dropdown's selected value
     * @method getValue
     * @public
     * @return {String} value Selected value
     */
    getValue: function(){
      var value = '';

      if( typeof $listBtn.attr( this.valueAttr ) !== 'undefined' ){
        value = $listBtn.attr( this.valueAttr );
      }else{
        value = $listBtn.text();
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
