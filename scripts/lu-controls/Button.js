/**
* Button
* @class Button
* @constructor
* @extends Switch
* @version 0.2.4
*/

var Class = require( 'class' ),
  Switch = require( 'lu/Switch' ),
  Constants = require( 'lu/Constants' ),
  Button;

Button = Switch.extend( function( base ){
  var defaults = {
      on: 'click'
    };

  /**
   * Sets the focus on the $element
   * @method bindSpaceBar
   * @private
   */
  function focus( $element ){
    if( $element.is( 'a' ) ){
      $element.focus();
    }
  }

  /**
   * Used for binding the space bar to the
   * Button's 'on' event as specified in the
   * configuration.
   * @method bindSpaceBar
   * @private
   */
  function bindSpaceBar( Button, on ){
    Button.$element.on( 'keyup', function( event ){
      if( event.keyCode === 32 ){
        Button.trigger( on );
      }
    } );
  }

  return {
    /**
     * Class constructor
     * @method initialize
     * @pulic
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */
    init: function( $element, settings ){
      //console.log( 'Button INIT' );
      var Button = this,
        command = settings.action || ( settings.__params__ ) ? settings.__params__.shift() : undefined,
        decorators = [],
        decorator;

      settings.action = command;

      base.init.call( this, $element, settings );

      //Applies a decorator based on the command given
      _.defaults( settings, defaults );

      console.log( 'COMMAND', command );

      if( command ){
        // Somewhat nasty right now.
        decorators = [ 'lu/Button/' + command.charAt( 0 ).toUpperCase() + command.substr( 1 ) ];
      } else {
        decorators = [ 'lu/Button/Default' ];
      }

      require.ensure( decorators, function( require, module, exports ){
          _.each( decorators, function( path, index ){
            try {
              decorator = require( path );
            } catch( e ){
              decorator = require( 'lu/Button/Default' );
            }
            Class.decorate( Button, decorator, settings );
          } );
      } );

      //binds the spacebar to the on event
      bindSpaceBar( Button, settings.on );
    },

    /**
     * Adds a disabled state to the Button
     * as well as adding the prop disabled if
     * it is a button or input element.
     * @method disable
     * @public
     */
    disable: function(){
      var $element = this.$element;
      if( $element.is( Constants.HAS_A18_ATTRS ) ){
        $element.prop( Constants.DISABLED, true );
      }
      this.addState( Constants.states.DISABLED );
      return this;
    },

    /**
     * Removes the disabled state from the Button
     * as well the prop disabled if
     * it is a button or input element.
     * @method enable
     * @public
     */
    enable: function(){
      var $element = this.$element;
      $element.removeProp( Constants.DISABLED );
      this.removeState( Constants.states.DISABLED );
      return this;
    }
  };
} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Button );
  } else if( module.exports ){
   module.exports = Button;
  }
}