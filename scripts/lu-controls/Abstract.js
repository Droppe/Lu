var Class = require( 'class' ),
  Abstract;

/**
 * The base component class all other UI components inherit from.
 * @class Abstract
 * @constructor
 * @require ptclass
 * @version 0.1.0
 */
Abstract = Class.extend( function( base ){
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
  };

  /**
   * Adds an event, or a string of joined events to the eventStore
   * @method addEventToStorage
   * @private
   * @param {String} event The event(s) to add
   * @param {String} method The method (ex: 'on', 'one')
   */
  function addToEventStore( event, method ){
    var eventStore = this.eventStore;
    _.each( event.trim().split( /\s+/g ), function( item ){
      eventStore[item] = { method: method };
    } );
  }

  /**
   * Removes an event, or a string of joined events from the eventStore
   * @method removeEventFromStorage
   * @private
   * @param {String} event The event(s) to remove
   */
  function removeFromEventStore( event ){
    var eventStore = this.eventStore;
    _.each( event.trim().split( /\s+/g ), function( item ){
      if ( eventStore[event] ){
        delete eventStore[event];
      }
    } );
  }

  return {
    /**
     * Class constructor
     * @method init
     * @public
     * @param {Object} $element JQuery object for DOM node wrapped by this component
     * @param {Object} settings Custom settings for this component
     */
    init: function( $element, settings ){
      //Set up observers and notifiers
      var $observe = $( settings.observe ),
          $notify = $( settings.notify );

      _.defaults( settings, defaults );

      //Reverse Notification
      $notify = $notify.add( $element.lu( 'getDescendants' ) );

      if( $observe.length ){
        this.observe( $observe );
      }

      if( $notify.length ){
        $element.lu( 'observe', $notify );
      }

      this.$element = $element;
      this.eventStore = {};
    },
    /**
     * Creates an event listener for a type
     * @method on
     * @public
     */
    on: function(){
      addToEventStore.call( this, arguments[0], 'on' );
      this.$element.on.apply( this.$element, arguments );
      return this;
    },
    /**
     * Creates an event listener for a type, fires exactly once.
     * @method one
     * @public
     */
    one: function(){
      addToEventStore.call( this, arguments[0], 'one' );
      this.$element.one.apply( this.$element, arguments );
      return this;
    },
    /**
     * Unbinds event listeners of a type
     * @method off
     * @public
     */
    off: function() {
      removeFromEventStore.call( this, arguments[0] );
      this.$element.off.apply( this.$element, arguments );
      return this;
    },
    /**
     * Fires a custom event
     * @method trigger
     * @public
     */
    trigger: function( event, parameters ){
      var store = this.eventStore[ event ];

      lu.notify( this.$element, event, parameters );

      if( store && store.method === 'one' ){
        removeFromEventStore.call( this, event );
      }

      this.$element.trigger.call( this.$element, event, parameters );
      return this;
    },
    /**
     * Observe events from $observer
     * @method observe
     * @private
     * @param {Array} $observer A jQuery collection to be observed
     */
    observe: function( $observer ){
      lu.observe( $observer, this.$element );
      return this;
    },
    /**
     * Unobserve events from $observer
     * @method unobserve
     * @private
     * @param {Array} $observer A jQuery collection to be unobserved
     */
    unobserve: function( $observer ){
      lu.unobserve($observer, this.$element );
      return this;
    },
    /**
     * Returns and array of events the control is listening too
     * @public
     * @return events list
     */
    events: function(){
      return _.keys( this.eventStore );
    }
  };
} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Abstract );
  } else if( module.exports ){
    module.exports = Abstract;
  }
}