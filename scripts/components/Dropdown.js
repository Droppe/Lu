/**
 * @class Dropdown
 * @extends Switch
 */

var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Switch  = require( 'lu/Switch' ),
  Dropdown;

Dropdown = Switch.extend( function ( base ) {
  var
    /**
     * Default configuration values
     * @property defaults
     * @type Object
     * @private
     * @final
     */
    defaults = {
      label: '[data-lu="Button:State"]:first-child',
      valueAttr: 'data-lu-value'
    };

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
      var self = this,
          $list = $element.find('[data-lu=List]'),
          component = $list.lu('getComponents').List;

      _.defaults( settings, defaults );
      base.init.call( this, $element, settings );

      self.$label = (!settings.label) ? [] : $element.find(settings.label);
      self.listInstance;
      self.isIgnoreTrigger = false;
      self.initialIndex = 0;

      component.deferral.then(function(){
        self.listInstance = component.instance;

        self.listInstance.on( constants.events.SELECTED, function( event, component ){
          if( !self.isIgnoreTrigger ){
            self.update();
          }
          
          self.isIgnoreTrigger = false;
        });
      });

      self.on( constants.events.STATE, function( event, state ){
        if( state === constants.states.ACTIVE ){
          self.initialIndex = self.listInstance.index();
        }
      });

      // key events
      self.$element.on('keydown', function( event ){
        var $target = $(event.target),
            state = self.getState()[0],
            key = event.keyCode,
            keyUp = 38,
            keyDown = 40,
            keyEnter = 13,
            keyEscape = 27;

        // ignore event if not delegated from button
        if( !$target.is($element) && !$target.is('[data-lu=Button:State]') ){
          return;
        }

        switch(key){
          case keyUp:
            self.handleArrowKey(-1, state);
            break;
          case keyDown:
            self.handleArrowKey(1, state);
            break;
          case keyEnter:
            // kill the default enter key behavior on buttons
            event.preventDefault();
            self.handleEnterKey(state);
            break;
          case keyEscape:
            self.reset();
            break;
        }
      });

      // collapse dropdown on outside click
      $(document).on('click', function( event ){
        var $target = $(event.target);

        if( !$target.closest($element).length ){
          self.reset();
        }
      });
    },

    expand: function(){
      this.setState( constants.states.ACTIVE );
    },

    collapse: function(){
      this.setState( constants.states.INACTIVE );
    },

    reset: function(){
      this.isIgnoreTrigger = true;
      this.listInstance.select( self.initialIndex );
      this.collapse();
    },

    update: function(){
      var $element = this.listInstance.current().$element,
          $button = $element.find('[data-lu="Button:Select"]');

      this.updateLabel( $button );
      this.collapse();
    },

    updateLabel: function( $element ){
      if( this.$label.length && $element.length ){
        this.$label.html( $element.html() );
      }
    },

    updateValue: function( value ){

    },

    handleArrowKey: function( direction, state ){
      var list = this.listInstance;

      this.isIgnoreTrigger = true;

      // expand dropdown if inactive
      if( state === constants.states.INACTIVE ){
        this.expand();
      }else{
        // up
        if( direction < 0 ){
          list.hasPrevious() ? list.previous() : list.last();

        // down
        }else if( direction > 0 ){
          list.hasNext() ? list.next() : list.first();
        }
      }
    },

    handleEnterKey: function( state ){
      if( state === constants.states.ACTIVE ){
        this.update();
      }else if( state === constants.states.INACTIVE ){
        this.expand();
      }
    }
  };

} );

// TODO: notify, settings, observe

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Dropdown );
  } else if( module.exports ){
   module.exports = Dropdown;
  }
}
