var Class = li.require( 'libraries/ptclass' ),
  Abstract;

/**
 * The base component class all other UI components inherit from.
 * @class Abstract
 * @constructor
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
Abstract = Class.create( (function() {

  /**
   * Default configuration values
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
    notify: ''
  },
  /**
   * A jQuery collection that is observed for events
   * @property $observe
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
   * Configuration values
   * @property onfig
   * @private
   * @type {Object}
   */
  config,  
  /**
   * The element wrapped by the component.
   * @property $node
   * @private
   * type {Object}
   */
  $node,
  /**
   * The namespace that all events will be fired into and listed for in. 
   * See http://docs.jquery.com/Namespaced_Events.
   * @property namespace
   * @private
   * @type {String}
   */
  namespace = '';
  
  return {
    /**
     * Class constructor 
     * @method initialize
     * @public
     * @param {Object} $element JQuery object for DOM node wrapped by this component
     * @param {Object} settings Custom settings for this component
     */    
    initialize: function($element, settings) {

      // Setup
      $node = $element;
      
      config = _.defaults( settings, defaults );

      if( config.namespace ) {
        namespace = '.' + config.namespace;
      }

      $notify = $( config.notify );
      $observe = $( config.observe );

      //Observe elements passed into $observe
      $observe.observe( $node );

      //Regiser elements passed in notify as observers
      $node.observe( $notify );
      
    },
    /**
     * Creates an event listener for a type
     * @method on
     * @public
     * @param {String} type The type of event
     * @param {Function} handler The callback function
     */
    on: function( type, handler ) {
      return $node.on( type + namespace, handler );
    },

    /**
     * Unbinds event listeners of a type
     * @method off
     * @public
     * @param {String} type The type of event
     */
    off: function( type ) {
      return $node.off( type + namespace );
    },

    /**
     * Fires a custom event 
     * @method trigger
     * @public
     * @param {String} type The type of event
     * @param {Array} parameters Extra arguments to pass through to the subscribed event handler
     */
    trigger: function( type, parameters ) {
      $element.trigger( type + namespace + ':before', parameters );
      $element.trigger( type + namespace, parameters );
      $element.trigger( type + namespace + ':after', parameters );
      return $element;
    },
    
    /**
     * Observe events
     * @method observe
     * @public
     * @param {Array} $observer A jQuery collection to be added to the observers list
     */
    observe: function( $observer ) {
      return $node.observe( $observer );
    },

    /**
     * Cease observation of events
     * @method unobserve
     * @public
     * @param {Array} $subscriber A jQuery collection to unsubscribe
     */
    unobserve: function( $observer ) {
      return $node.unobserve( $observer );
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
        if ( config.key ) {
          result = config.key;
        } else {
          Athena.error( 'The setting ' + key + ' does not exist in ', config );
        }
      } else {
        result = config;
      }
    
      return result;
    }
  };

} )() );

// Export to Athena Framework
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Abstract;
}
