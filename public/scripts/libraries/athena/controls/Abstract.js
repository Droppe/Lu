var Class = require( 'class' ),
  Abstract;

/**
 * The base component class all other UI components inherit from.
 * @class Abstract
 * @constructor
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
Abstract = Class.create( ( function() {

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
    initialize: function( $element, settings ) {

      // PRIVATE INSTANCE PROPERTIES

      /**
        * Instance of Abstract
        * @property Abstract
        * @type Object
        * @private
        */
      var Abstract = this,
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
      if( $observe.length > 0 ) {
        console.log( 'WTF' );
        $observe.athena( 'observe', $element );
      }
      //Register elements passed in notify as observers
      if( $notify.length > 0 ) {
        $element.athena( 'observe', $notify );
      }
      // PRIVATE METHODS

      // PRIVILEGED METHODS

      /**
       * Creates an event listener for a type
       * @method on
       * @public
       * @param {String} type The type of event
       * @param {Function} handler The callback function
       */
      Abstract.on = function( type, handler ) {
        return $element.on( type + namespace, handler );
      };

      /**
       * Unbinds event listeners of a type
       * @method off
       * @public
       * @param {String} type The type of event
       */
      Abstract.off = function( type ) {
        return $element.off( type + namespace );
      };

      /**
       * Fires a custom event 
       * @method trigger
       * @public
       * @param {String} type The type of event
       * @param {Array} parameters Extra arguments to pass through to the subscribed event handler
       */
      Abstract.trigger = function( type, parameters ) {
        $element.trigger( type + namespace + ':before', parameters );
        $element.trigger( type + namespace, parameters );
        $element.trigger( type + namespace + ':after', parameters );
        return $element;
      };

      /**
       * Observe events
       * @method observe
       * @public
       * @param {Array} $observer A jQuery collection to be added to the observers list
       */
      Abstract.observe = function( $observer ) {
        return $element.athena( 'observe', $observer );
      };

      /**
       * Cease observation of events
       * @method unobserve
       * @public
       * @param {Array} $subscriber A jQuery collection to unsubscribe
       */
      Abstract.unobserve = function( $observer ) {
        return $element.athena( 'unobserve', $observer );
      };

    }
  };
}() ) );

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Abstract );
  } else if( module.exports ) {
    module.exports = Abstract; 
  }
}