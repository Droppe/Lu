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
  
  // GLOBAL STATICS
  

  // RETURN METHODS OBJECT  
  return {
    /**
     * Class constructor 
     * @method initialize
     * @public
     * @param {Object} $element JQuery object for DOM node wrapped by this component
     * @param {Object} settings Custom settings for this component
     */    
    initialize: function($element, settings) {

      // PRIVATE INSTANCE PROPERTIES

      /**
        * Instance of Abstract
        * @property self
        * @type Object
        * @private
        */      
      var self = this,
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
       * The namespace that all events will be fired into and listed for in. 
       * See http://docs.jquery.com/Namespaced_Events.
       * @property namespace
       * @private
       * @type {String}
       */
      namespace = '';


      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      if( settings.namespace ) {
        namespace = '.' + settings.namespace;
      }

      $notify = $( settings.notify );
      $observe = $( settings.observe );

      //Observe elements passed into $observe
      $observe.observe( $element );

      //Regiser elements passed in notify as observers
      $element.observe( $notify );
      
      
      // PRIVATE METHODS
      // n/a
      
      // PRIVILEGED METHODS
      
      /**
       * Gets the JQuery object of the key DOM element
       * for the component
       * @method getElement
       * @public
       * @return Object
       */
      self.getElement = function () {
        return $element;
      };

      /**
       * Gets the namespace 
       * @method getNamespace
       * @public
       * @return String
       */
      self.getNamespace = function () {
        return namespace;
      };

      /**
       * Gets a safe copy of the settings object
       * @method getSettings
       * @public
       * @return Object
       */
      self.getSettings = function () {
        return _.clone(settings);
      };
      
    },
    /**
     * Creates an event listener for a type
     * @method on
     * @public
     * @param {String} type The type of event
     * @param {Function} handler The callback function
     */
    on: function( type, handler ) {
      return this.getElement().on( type + namespace, handler );
    },

    /**
     * Unbinds event listeners of a type
     * @method off
     * @public
     * @param {String} type The type of event
     */
    off: function( type ) {
      return this.getElement().off( type + namespace );
    },

    /**
     * Fires a custom event 
     * @method trigger
     * @public
     * @param {String} type The type of event
     * @param {Array} parameters Extra arguments to pass through to the subscribed event handler
     */
    trigger: function( type, parameters ) {
      var node = this.getElement(),
        namespace = this.getNamespace();
      
      node.trigger( type + namespace + ':before', parameters );
      node.trigger( type + namespace, parameters );
      node.trigger( type + namespace + ':after', parameters );
      return node;
    },
    
    /**
     * Observe events
     * @method observe
     * @public
     * @param {Array} $observer A jQuery collection to be added to the observers list
     */
    observe: function( $observer ) {
      var node = this.getElement();
      
      return node.observe( $observer );
    },

    /**
     * Cease observation of events
     * @method unobserve
     * @public
     * @param {Array} $subscriber A jQuery collection to unsubscribe
     */
    unobserve: function( $observer ) {
      var node = this.getElement();
      
      return node.unobserve( $observer );
    },

    /**
     * Gets a static setting
     * @method getSetting
     * @public
     * @param {String} key The name of the setting
     * @return String
     */
    getSetting: function( key ) {
      var result,
        settings = this.getSettings();

      if ( key ) {
        if ( settings.key ) {
          result = settings.key;
        } else {
          Athena.error( 'The setting ' + key + ' does not exist in ', settings );
        }
      } else {
        result = settings;
      }
    
      return result;
    }
  };

}() ));

// Export to Athena Framework
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Abstract;
}
