var id = 'ui:Abstract',
  klass = li.require( 'libraries/klass' ),
  EventProvider = li.require( 'providers/Event' ),
  Abstract;

/**
 * The base component class all other UI components inherit from.
 * @class Abstract
 * @constructor
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
Abstract = klass( function ( $element, settings ){

  /**
   * Instance of Abstract class
   * @property Abstrance
   * @type {Object}
   */
  var Abstract = this,
    /**
     * Instance of EventProvider
     * @property Event
     * @type {Object}
     */
    Event,
    /**
     * Default configuration values
     * @property defaults
     * @private
     * @type {Object}
     */
    defaults = {
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
    },
    /**
     * A jQuery collection that is observed for events
     * @property $publishTo
     * @private
     * @type {Array}
     */
    $observe,
    /**
     * A jQuery collection that is notified of events
     * @property subscribe
     * @private
     * @type {Array}
     */
    $notify,
    /**
     * The namespace that all events will be fired into and listed for in. See http://docs.jquery.com/Namespaced_Events.
     * @property namespace
     * @type {String}
     */
    namespace = '';

  settings = _.extend( defaults, settings );

  if( settings.namespace ) {
    namespace = '.' + settings.namespace;
  }

  $notify = $( settings.notify );
  $observe = $( settings.observe );

  Event = new EventProvider( {
    proxy: $element
  } );

  /**
   * Trigger events for observers (nodes matching notify setting) 
   * @private
   * @method notify
   * @param {String} type The type of custom event to trigger
   * @param {Array} parameters Arguments passed through to the observer's callback function
   */
  function notify( type, parameters ) {
    _.each( $notify, function( observer, index ) {
      $( observer ).trigger( type + namespace, parameters );
    } );
  }

  //Start observing nodes passed in observe setting
  $observe.observe( $element );

  /**
   * Creates an event listener for a type
   * @method on
   * @public
   * @param {String} type The type of event
   * @param {Function} handler The callback function
   */
  Abstract.on = function( type, handler ) {
    return Event.on( type + namespace, function( event ) {
      if( settings.bubble === false ) {
        event.stopPropagation();
      }
      handler.apply( arguments );
    } );
  };

  /**
   * Unbinds event listeners of a type
   * @method off
   * @public
   * @param {String} type The type of event
   */
  Abstract.off = function( type ) {
    return Event.off( type + namespace );
  };

  /**
   * Fires a custom event 
   * @method trigger
   * @public
   * @param {String} type The type of event
   * @param {Aarray} parameters Extra arguments to pass through to the subscribed event handler
   */
  Abstract.trigger = function( type, parameters ) {
    notify( type + namespace, parameters );
    return Event.trigger( type + namespace, parameters );
  };

  /**
   * Observe events
   * @method observe
   * @public
   * @param {Array} $observer A jQuery collection to be added to the observers list
   */
  Abstract.observe = function( $observer ) {
    $observers.add( $observer );
  };

  /**
   * Cease observation of events
   * @method unobserve
   * @public
   * @param {Array} $subscriber A jQuery collection to unsubscribe
   */
  Abstract.unobserve = function( $observer ) {
    $observers = _.reject( function( item, index ) {
      return $observers.is( $( item ) );
    } );
  };

  /**
   * Gets a static setting
   * @method getSetting
   * @public
   * @param {String} key The name of the setting
   */
  Abstract.getSetting = function( key ) {
    if( key ) {
      if( settings.key ) {
        return settings.key;
      } else {
        Athena.error( 'The setting ' + key + ' does not exist in ', settings );
      }
    } else {
      return settings;
    }
  };

} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Abstract;
}
