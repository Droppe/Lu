/**
* Button
* @class Button
* @constructor
* @extends Switch
*/

var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Switch = require( 'lu/Switch' ),
  Fiber = require( 'Fiber' ),
  Button;

Button = Switch.extend( function( base ){
  var defaults = {
      on: 'click',
      /**
       * The time in milliseconds in which to throttle events.
       * Events will only be triggred once per throttle time.
       * This is useful when timing complex css transitions.
       * @property throttle
       * @type {Number}
       */
      throttle: 100,
      /**
       * By default the default is prevented setting this to true
       * allows the hash to be updated and urls to resolve
       * @property preventDefault
       * @type {Number}
       */
      preventDefault: true
    },
    root = 'lu/Button/decorators/',
    decorators = {
      first: root + 'first',
      last: root + 'last',
      load: root + 'load',
      next: root + 'next',
      pause: root + 'pause',
      play: root + 'play',
      previous: root + 'previous',
      select: root + 'select',
      state: root + 'state',
      def: root + 'default'
    };

  /**
   * Used for binding the space bar to the
   * Button's 'on' event as specified in the
   * configuration.
   * @method bindSpaceBar
   * @private
   */
  function bindSpaceBar( instance, on ){
    instance.$element.on( 'keyup', function( event ){
      if( event.keyCode === 32 ){
        instance.trigger( on );
      }
    } );
  }

  return {
    /**
     * Class constructor
     * @method initialize
     * @public
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */
    init: function( $element, settings ){

      var self = this,
        action,
        requirements = [],
        decorator;

      _.defaults( settings, defaults );

      base.init.call( this, $element, settings );

      action = settings.action;

      if( action !== undefined ){
        switch( action ){
          case 'first':
            requirements.push( decorators.first );
            requirements.push( decorators.def );
            break;
          case 'last':
            requirements.push( decorators.last );
            requirements.push( decorators.def );
            break;
          case 'load':
            requirements.push( decorators.load );
            requirements.push( decorators.def );
            break;
          case 'next':
            requirements.push( decorators.next );
            requirements.push( decorators.def );
            break;
          case 'pause':
            requirements.push( decorators.pause );
            requirements.push( decorators.def );
            break;
          case 'play':
            requirements.push( decorators.play );
            requirements.push( decorators.def );
            break;
          case 'previous':
            requirements.push( decorators.previous );
            requirements.push( decorators.def );
            break;
          case 'select':
            requirements.push( decorators.select );
            break;
          case 'state':
            requirements.push( decorators.state );
            break;
          default:
            throw new Error( 'Button decorator "' + action + '" does not exist!' );
        }
      } else {
        requirements.push( decorators.def );
      }

      require.ensure( requirements, function( require, module, exports ){
        _.each( requirements, function( decorator, index ){
          decorator = require( decorator )( settings );
          Fiber.decorate( self, decorator );
          self.decorators.push(decorator);
        } );
        self.trigger( 'dependencies-resolved' );
      } );

      //binds the space-bar to the on event
      bindSpaceBar( this, settings.on );

      /**
       * Gets the url for the button -- either from the config setting or from the HREF
       * @method getUrl
       * @public
       * @return {String} The URL for the button
       */
       self.getUrl = function() {
        return settings.url || $element.attr('href');
      };

    },

    /**
     * Adds a disabled state to the Button
     * as well as adding the prop disabled if
     * it is a button or input element.
     * @method disable
     * @public
     * @return {Object} The Button instance
     */
    disable: function(){
      var $element = this.$element;
      this.addState( constants.states.DISABLED );
      if( $element.is( constants.HAS_A18_ATTRS ) ){
        $element.prop( constants.DISABLED, true );
      }
      return this;
    },

    /**
     * Removes the disabled state from the Button
     * as well the prop disabled if
     * it is a button or input element.
     * @method enable
     * @public
     * @return {Object} The Button instance
     */
    enable: function(){
      var $element = this.$element;
      this.removeState( constants.states.DISABLED );
      if( $element.is( constants.HAS_A18_ATTRS ) ){
        $element.prop( constants.DISABLED, false );
      }
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