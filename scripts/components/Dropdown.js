var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Switch  = require( 'lu/Switch' ),
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
      isIgnoredTrigger = false,

    /**
     * Default configuration values
     * @property defaults
     * @private
     * @type {Object}
     * @final
     */
    defaults = {
      label: BUTTON_STATE + ':first-child',
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
      this.update();
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
      var $list = $element.find(LIST_ATTR),
          listComponent,
          self = this;

      _.defaults( settings, defaults );
      base.init.call( this, $element, settings );

      if( $list.length < 1 ){
        return;
      }

      listComponent = $list.lu('getComponents').List;

      self.settings = settings;
      self.$label = ( typeof settings.label !== 'undefined' && settings.label !== false ) ? $element.find( settings.label ) : [];
      self.$observers = $(settings.notify);
      self.listInitialIndex = 0;

      self.$observers = self.$observers.add( self.$element.find('input[type="hidden"], select') );

      // get reference of list component instance
      listComponent.deferral.then( function(){
        self.listInstance = listComponent.instance;

        self.listInstance.on( constants.events.SELECTED, function( event, component ){
          // prevent label update on arrow key events
          if( !isIgnoredTrigger ){
            self.update();
          }
          
          isIgnoredTrigger = false;
        } );
      } );

      // stated event handler
      self.on( constants.events.STATE, function( event, state ){
        if( state === constants.states.ACTIVE ){
          self.listInitialIndex = self.listInstance.index();
        }
      } );

      // keydown event handler
      self.$element.on( KEY_EVT, function(){
        handleKeyEvents.apply( self, arguments );
      } );

      // collapse dropdown on outside click
      $(document).on( 'click', function( event ){
        var $target = $(event.target);

        if( !$target.closest($element).length ){
          self.resetList();
        }
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
     * @method resetList
     * @public
     */
    resetList: function(){
      isIgnoredTrigger = true;

      this.listInstance.select( this.listInitialIndex );
      this.collapse();
    },

    /**
     * Updates dropdown label and form element value
     * @method update
     * @public
     */
    update: function(){
      var $element = this.listInstance.current().$element,
          $button = $element.find(BUTTON_SELECT),
          value = '';

      this.updateLabel( $button );

      if( this.settings.valueAttr && typeof $button.attr(this.settings.valueAttr) !== 'undefined' ){
        value = $button.attr( this.settings.valueAttr );
        this.updateValue( value );
      }

      this.collapse();
    },

    /**
     * Updates dropwdown label
     * @method updateLabel
     * @public
     * @param {Object} $element List element's selected button
     */
    updateLabel: function( $element ){
      if( this.$label.length > 0 && $element.length > 0 ){
        this.$label.html( $element.html() );
      }
    },

    /**
     * Updates form element's value
     * @method updateValue
     * @public
     * @param {String} value List element's selected value
     */
    updateValue: function( value ){
      this.$observers.val( value );
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
