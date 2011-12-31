/**
 * Representation of a stateful button element
 * @class Switcher
 * @constructor
 * @extends Container
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
var Class = require( 'class' ),
  Abstract = require( 'lu/Abstract' ),
  Switcher;

Switcher = Class.create( Abstract,  ( function () {

  var SWITCH_EVENT = 'switch',
    SWITCHED_EVENT = 'switched';

  // RETURN METHODS OBJECT
  return {
    /**
     * PTClass constructor 
     * @method initialize
     * @public
     * @param {Object} $super Pointer to superclass constructor
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */    
    initialize: function ( $super, $element, settings ) {

      // PRIVATE INSTANCE PROPERTIES

      /**
       * Instance of Switcher
       * @property Switcher
       * @type Object
       * @private
       */     
      var Switcher = this,

        /**
         * Default configuration values
         * @property defaults
         * @type Object
         * @private
         * @final
         */
        defaults = {},
        /**
         * An array of objects representing available states f
         * or the switch instance, passed on through the published event.
         * @property states
         * @type Array
         */
        states = {},
        state,
        meta;


      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );
      
      settings.states = settings.states || { on: 'on', off: 'off' };

      if( typeof settings.states === 'string' ) {
        settings.states = settings.states.split( ' ' );
      }

      if( _.isArray( settings.states ) ) {
        _.each( settings.states, function( item, index ) {
          states[item] = item;
        } );
      } else {
        states = settings.states;
      }

      Switcher.addState = function( key, meta ) {
        if( states[key] ) {
          states[key] = _.extend( states[key], meta );
        } else {
          states[key] = meta;
        }
      };

      Switcher.removeState = function( key, meta ) {
        if( states[key] ) {
          delete states[key];
        }
      };

      Switcher.getState = function() {
        return state;
      };

      Switcher.getMeta = function( key ) {
        if( states[key] ) {
          return states[key];
        }
      };

      Switcher.setState = function( key ) {
        if( states[key] ) {
          $element.removeClass( 'lu-switch-' + state );
          state = key;
          meta = states[key];
          $element.addClass( 'lu-switch-' + state );
          Switcher.trigger( 'switched', [$element, state, meta] );
        }
      };

      Switcher.on( SWITCH_EVENT, function( event, value ) {
        var keys,
          index;

        if( !value ) {
          keys = _.keys( states );
          index = _.indexOf( keys, state );
          value = ( index < keys.length - 1 ) ? keys[index + 1] : keys[0];
        }

        Switcher.setState( value );

      } );

      if( !settings.start ) {
        Switcher.setState( _.keys( states )[0] );
      } else {
        Switcher.setState( settings.start );
      }

    }
  };
}() ));


//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Switcher );
  } else if( module.exports ) {
   module.exports = Switcher; 
  }
}
