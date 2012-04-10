
var Class = require( 'class' ),
  Abstract = require( 'lu/Abstract' ),
  Switcher;

/**
 * @class Switcher
 * @constructor
 * @extends Abstract
 * @version 0.1.2
 */

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
        defaults = {
          /**
           * Which state of those defined to initialize to
           * @property start
           * @type {String}
           * @default null
           */
          start: null, 
          /**
           * An array of states to set during initialization
           * @property states
           * @type Array
           * @default { on: 'on', off: 'off' }
           */
          states: { on: 'on', off: 'off' }
        },
        /**
         * A registry of states avaliable for the switcher to switch to.
         * @property states
         * @type Object
         */
        states = {},
        /**
         * An array of the current active states.
         * @property states
         * @type Array
         */
        state = [],
        /**
         * Meta data attached to the passed in from the switch event an out via the switched event.
         * @property meta
         * @type Object
         */
        meta = {};

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      //Normalize settings so that everything is a map
      //First turn strings into arrays
      if( typeof settings.states === 'string' ) {
        settings.states = settings.states.split( ',' );
      }

      //Then arrays into objects
      if( _.isArray( settings.states ) ) {
        _.each( settings.states, function( item, index ) {
          states[item] = item;
        } );
      } else {
        states = settings.states;
      }

      /**
        * Registers a state in the states registry
        * @method addState
        * @public
        */
      Switcher.addState = function( key, meta ) {
        if( states[key] ) {
          states[key] = _.extend( states[key], meta );
        } else {
          states[key] = meta;
        }
      };

      /**
        * Removes a state in the states registry
        * @method removeState
        * @public
        */
      Switcher.removeState = function( key, meta ) {
        if( states[key] ) {
          delete states[key];
        }
      };

      /**
        * Get an array of the current states
        * @method getState
        * @public
        * @return state An array containing the current states
        */
      Switcher.getState = function() {
        return state;
      };

      /**
        * Gets the meta data associated with the current states
        * @method getMeta
        * @public
        * @return meta associated meta data
        */
      Switcher.getMeta = function( key ) {
        if( states[key] ) {
          return states[key];
        }
      };

      /**
        * Sets the current state or states
        * @method setState
        * @public
        * @param {Array} an array containing the keys of the state(s) to set
        */
      Switcher.setState = function( keys ) {
        var validStates = _.keys( states );

        if( typeof keys === 'string' ) {
          keys = keys.split( ' ' );
        }

        keys = keys.sort();

        if( state.join( ' ' ) !== keys.join( ' ' ) ) {
          if( state.length > 0 ){
            //Remove States
            _.each( state, function( key, index ){
              $element.removeClass( 'lu-switch-' + key );
            } );
            state = [];
          }

          meta = {};

          _.each( keys, function( key, index ) {
            if( _.indexOf( validStates, key ) > -1 ) {
              state.push( key );
              meta[key] = states[key];
              $element.addClass( 'lu-switch-' + key );
            }
          } );
          Switcher.trigger( SWITCHED_EVENT, [$element, state, meta] );
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

      //allows for a inital state to be set in settings
      if( settings.start ){
        Switcher.setState( settings.start );
      } else {
        Switcher.setState( [_.keys( states )[0]] );
      }

    }
  };
}() ) );


//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Switcher );
  } else if( module.exports ) {
   module.exports = Switcher; 
  }
}
