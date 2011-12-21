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
       * The namespace used in all event bindings
       * See http://docs.jquery.com/Namespaced_Events.
       * @property namespace
       * @private
       * @type {Object}
       */
      namespace,
      adapt;

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      $observe = $( settings.observe );
      //Reverse Notification
      //$notify = $( settings.notify ).add( $element.athena( 'getDescendants' ) );
      $notify = $( settings.notify );

      if( $observe.length ) {
        $observe.athena( 'observe', $element );
      }

      //Register elements passed in notify as observers
      if( $notify.length ) {
        $element.athena( 'observe', $notify );
      }

      namespace = settings.namespace;

      //adapt = settings.adapt;

      // if( adapt ) {
      //   if( typeof adapt === 'string' ) {
      //     adapt = adapt.split( ' ' );
      //   }
      //   if( typeof adapt[0] === 'string' ) {
      //     on( adapt[0], function() {
      //       var $this = $( this ),
      //         parameters = Array.prototype.slice.call( arguments ),
      //         $observers;
      // 
      //       //$observers = $this.data( 'athena-controls' )[ '$observers' ];
      //       //$observers = $element.athena( 'getParent' ).athena( 'getControl' );
      //       //console.log( $element.athena( 'getParent' ) );
      //       //$element.athena( 'getParent' ).trigger( 'hello' );
      //       //$observers.trigger( adapt[1] );
      // 
      //     } );
      //   }
      // }

      if( !namespace ) {
        namespace = $element.athena( 'getParent', function( index, item ) {
          var control = $( item ).athena( 'getControl' ),
            namespace;

          if ( !control ) {
            return false;
          }

          namespace = control.getNamespace();

          if( namespace ) {
            return true;
          };

          return false;

        } );

        if( namespace.length > 0 ) {
          namespace = namespace.athena( 'getControl' ).getNamespace();
        }

      }

      // PRIVATE METHODS
      function on() {
        var parameters = Array.prototype.slice.call( arguments );
        if( namespace ) {
          parameters[0] = parameters[0].split( ' ' );
          _.each( parameters[0], function( item, index ) {
            parameters[0][index] = item + '.' + namespace;
          } );
          parameters[0] = parameters[0].join( ' ' );
        }

        return $element.on.apply( $element, parameters );
      }

      function one() {
        var parameters = Array.prototype.slice.call( arguments );

        if( namespace ) {
          parameters[0] = parameters[0].split( ' ' );
          _.each( parameters[0], function( item, index ) {
            parameters[0][index] = item + '.' + namespace;
          } );
          parameters[0] = parameters[0].join( ' ' );
        }
        return $element.one.apply( $element, parameters );
      }

      function trigger() {
        var parameters = Array.prototype.slice.call( arguments );
        return $element.trigger.apply( $element, parameters );
      }

      function off() {
        var parameters = Array.prototype.slice.call( arguments );
        if( namespace ) {
          parameters[0] = parameters[0].split( ' ' );
          _.each( parameters[0], function( item, index ) {
            parameters[0][index] = item + '.' + namespace;
          } );
          parameters[0] = parameters[0].join( ' ' );
        }
        return $element.off.apply( $element, parameters );
      }

      // PRIVILEGED METHODS

      /**
       * Creates an event listener for a type
       * @method on
       * @public
       */
      Abstract.on = on;

      /**
       * Creates an event listener for a type, fires exactly once.
       * @method one
       * @public
       */
      Abstract.one = one;

      /**
       * Unbinds event listeners of a type
       * @method off
       * @public
       */
      Abstract.off = off;

      /**
       * Fires a custom event 
       * @method trigger
       * @public
       */
      Abstract.trigger = trigger;

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

      /**
       * Gets the current namspace
       * @method getNamespace
       * @public
       * @return namespace
       */
      Abstract.getNamespace = function(){
        return namespace;
      };

      /**
       * Sets the namespace
       * @method setNamespace
       * @public
       * @param {String} value the new namespace
       * @return namespace
       */
      Abstract.setNamespace = function( value ){
        namespace = value;
        return namespace;
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