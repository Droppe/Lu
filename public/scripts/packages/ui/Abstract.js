var Class = li.require( 'libraries/ptclass' ),
  Abstract;

/**
 * The base component class all other UI components inherit from.
 * @class Abstract
 * @constructor
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
Abstract = Class.create( ( function() {

  /**
   * Default settings values
   * @property defaults
   * @private
   * @type {Object}
   */
  var defaults = {
    /**
     * A selector that matches nodes to observe
     * @property observe
     * @type {String}
     */
    observe: '',
    /**
     * A selector that matches nodes to notify of events
     * @property notify
     * @type {String}
     */
    notify: '',
    /**
     * When false, events are prevented from bubbling up the DOM tree
     * @property bubble
     * @type {Boolean}
     * @default true
     */
    bubble: true
  };

  return {
    initialize: function ( $element, settings ) {
    
      // Protected attributes
    
      /**
       * A jQuery collection that is observed for events
       * @property $observe
       * @private
       * @type {Array}
       */
      var $observe,
      /**
       * A jQuery collection that is notified of events
       * @property subscribe
       * @private
       * @type {Array}
       */
      $notify;      
    
      // Public attributes, though intended to be hidden (hence "__" prefix).

      /**
       * Configuration values
       * @property __config
       * @private
       * @type {Object}
       */
      this.__config;

      /**
       * The element wrapped by the component.
       * @property __$node
       * @private
       * type {Object}
       */
      this.__$node;

      /**
       * The namespace that all events will be fired into and listed for in. 
       * See http://docs.jquery.com/Namespaced_Events.
       * @property __namespace
       * @private
       * @type {String}
       */
      this.__namespace = '';


      // Setup
      this.__$node = $element;
      this.__config = _.extend( defaults, settings );

      if( this.__config.namespace ) {
        this.__namespace = '.' + this.__config.namespace;
      }

      $notify = $( this.__config.notify );
      $observe = $( this.__config.observe );

      //Observe elements passed into $observe
      $observe.observe( this.__$node );

      //Regiser elements passed in notify as observers
      this.__$node.observe( $notify );
    },
  
    /**
     * Creates an event listener for a type
     * @method on
     * @public
     * @param {String} type The type of event
     * @param {Function} handler The callback function
     */
    on: function( type, handler ) {
      return this.__$node.on( type + this.__namespace, handler );
    },
  
    /**
     * Unbinds event listeners of a type
     * @method off
     * @public
     * @param {String} type The type of event
     */
    off: function( type ) {
      return this.__$node.off( type + this.__namespace );
    },

    /**
     * Fires a custom event 
     * @method trigger
     * @public
     * @param {String} type The type of event
     * @param {Aarray} parameters Extra arguments to pass through to the subscribed event handler
     */
    trigger: function( type, parameters ) {
      return this.__$node.trigger( type + this.__namespace, parameters );
    },

    /**
     * Observe events
     * @method observe
     * @public
     * @param {Array} $observer A jQuery collection to be added to the observers list
     */
    observe: function( $observer ) {
      return this.__$node.observe( $observer );
    },

    /**
     * Cease observation of events
     * @method unobserve
     * @public
     * @param {Array} $subscriber A jQuery collection to unsubscribe
     */
    unobserve: function( $observer ) {
      return this.__$node.unobserve( $observer );
    },

    /**
     * Gets a static setting
     * @method getSetting
     * @public
     * @param {String} key The name of the setting
     */
    getSetting: function( key ) {
      var result;

      if ( key ) {
        if ( this.__config.key ) {
          result = this.__config.key;
        } else {
          Athena.error( 'The setting ' + key + ' does not exist in ', this.__config );
        }
      } else {
        result = this.__config;
      }
    
      return result;
    }
  };
} )() );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Abstract;
}
