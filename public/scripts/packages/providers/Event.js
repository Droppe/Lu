var Class = li.require( 'libraries/ptclass' ),
  EventProvider;

/**
 * EventProvider library
 * @class EventProvider
 * @constructor
 * @requires ['libraries/jquery', 'libraries/ptclass']
 * @param {Object} settings Configuration options for this instance
 */
EventProvider = Class( {
  initialize: function ( settings ){

  /**
   * EventProvider instance
   * @property EventProvider
   * @private
   * @type {Object}
   */
    var EventProvider = this,
    /**
     * Default configuration values
     * @property defaults
     * @private
     * @type {Object}
     */
      defaults = {
        /**
         * A selector used in creating a Jquery collection to proxie events
         * @property proxy
         * @type {String}
         */
        proxy: ''
      },
      /**
       * A jQuery collection to proxy events
       * @property proxy
       * @private
       * @type {Array}
       */
      $proxy,
      /**
       * A cache of $proxy event methods
       * @property cache
       * @private
       * @type {Object}
       */
      cache = {};

    settings = _.extend( defaults, settings );

    $proxy = $( settings.proxy );

    cache.on = $proxy.on;
    cache.off = $proxy.off;
    cache.trigger = $proxy.trigger;

    /**
     * Creates an event listener. See: http://api.jquery.com/on/
     * @method on
     * @public
     */
    EventProvider.on = function ( events, selector, data, handler ) {
      return ( function() {
        cache.on.apply( $proxy, [events, selector, data, handler] );
        return EventProvider;
      }() );
    };

    /**
     * Removes a event listeners of type. See: http://api.jquery.com/off/
     * @method off
     * @public
     */
    EventProvider.off = function() {
      return proxy.off = ( function( events, selector, handler ) {
        cache.off.apply( settings.proxy, [events, selector, handler] );
        return EventProvider;
      }() );
    };

    /**
     * Fires an event. Also triggers additional ":before" and ":after" events for the given event. See: http://api.jquery.com/trigger/
     * @method trigger
     * @public
     * @param {String} type The event type
     * @param {Array} parameters Arguments passed on to the callback function.
     */
    EventProvider.trigger = function( type, parameters ) {
      return ( function() {
        cache.trigger.apply( $proxy, [type + ':before', parameters] );
        cache.trigger.apply( $proxy, [type, parameters] );
        cache.trigger.apply( $proxy, [type + ':after', parameters] );
        return EventProvider;
      }() );
    };
  }
} );

// EXPORT TO ATHENA FRAMEWORK
Athena.exports(module, EventProvider);
