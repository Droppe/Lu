/**
 * Toggles the display of related content to a change event from a grouping of radio buttons.
 * @class Container
 * @constructor
 * @extends Abstract
 * @requires ptclass
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance  
 */
var Class = require( 'class' ),
  Abstract = require( 'athena/Abstract' ),
  Container;

Container = Class.create( Abstract,  ( function () {

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
       * Instance of Reveal
       * @property Reveal
       * @type Object
       * @private
       */
      var Container = this,
      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {
        // CSS
        hiddenClassName: "athena-hidden",
        selectedClassName: "athena-selected",
        // EVENTS
        onHide: "hide unselect",
        onShow: "show select",
        actionHide: "hidden",
        actionShow: "shown"
      },

      /**
       * JQuery DOM reference to the parent of the Container
       * @property $parent 
       * @type Object 
       * @private
       */
      $parent,

      /**
       * JQuery DOM reference to the "content" of the Container
       * Defined by the "class" content
       * @property $content 
       * @type Object 
       * @private
       */
      $content,

      /**
       * Classname for the hidden class from config
       * @property hiddenClass
       * @type String
       * @private
       */
      hiddenClass,

      /**
       * Classname for the selected class from config
       * @property selectedClass
       * @type String
       * @private
       */
      selectedClass,

      /**
       * Reference to an instance of the Loader control
       * @property loader 
       * @type Object 
       * @private
       */
      loader,

      /**
       * Denotes whether the Container has dynamically loaded the data/content
       * @property loaded 
       * @type Boolean 
       * @private
       */
      loaded = false,
     
      // Private methods
      // Event handlers
      /**
       * The "show"/"select" event handler
       * @method onShowHandler 
       * @param {Object} event - JQuery event
       * @param {String|Object} item - The ID or JQuery object for the selected container.
       * @private
       * @return {Void} 
       */
      onShowHandler = function( event, item ){
        _.log("Container.onShowHandler()", $element, event, item);
        event.stopPropagation();        
        
        var ok = true;

        if (loader && !loaded) {
          loader.trigger( 'load', [ settings.uri ] );
        }
                     
        // item can be an integer or an object
        if (item) {
          // Show the item if the selected container equals this instance
          if (typeof item === "string" && item === $element.attr("id")) {
            ok = true;
          } 
          else if ( $element.is($(item)) ) {
            ok = true;
          }
          else {
            ok = false;
          }
        }

        // show() unless item is specified.  Otherwise, if the selected container 
        // matches this instance, show(), else hide().
        if (ok) {
          Container.show();
        } else {
          Container.hide();
        }

      },


      /**
       * The "hide"/"unselect" event handler
       * @method onHideHandler 
       * @param {Object} event - JQuery event
       * @private
       * @return {Void} 
       */
      onHideHandler = function( event ){
        _.log("Container.onHideHandler()", event);

        event.stopPropagation();
        Container.hide();

      },

      /**
       * Binds all events for the Container 
       * @method bindEvents 
       * @private
       * @return {Void} 
       */
      bindEvents = function() {
        _.log("Container.bindEvents()");

        // Show
        Container.on( settings.onShow, onShowHandler);

        // Hide
        Container.on( settings.onHide, onHideHandler);
      },

      /**
       * If the settings.uri exists, initialize the URI for the data loader.
       * @method initializeURI 
       * @private
       * @return {Void} 
       */
      initializeURI = function() {
        _.log("Container.initializeURI()");

        if( settings.uri ) {
          $content = $element.find( '.content' );

          if ($content) {
            require.ensure( ['athena/Loader'], function() {
              // Loader is the class!!! 
              var Loader = require( 'athena/Loader' );
              loader = new Loader( $content, {} );
              loader.on( 'loaded', function( event ) {
                // Set flag so we don't make another request!
                loaded = true;
              } );
            } );
          }
        }
      },

      /**
       * Gets the closest $parent of the Container if the $parent is a Athena object ( has the attribute "data-athena" )
       * and is not the <body> 
       * @method getAthenaParent
       * @private
       * @return {Object} $parent - JDOM reference to the parent of the Container
       */
      getAthenaParent = function() {
        _.log("Container.getAthenaParent()");

        var $parent,
            $parents = $element.parents("[data-athena]").not("body");

        if ($parents.length > 0) {
          $parent = $parents.eq(0); 
        }

        return $parent;
      },

      /**
       * Passes a given event to the given node
       * @method passEventToChild
       * @param {Object} event - Event reference
       * @param {Integer/Object} child - JDOM reference to a node element 
       * @private
       * @return {Void}
       */
      passEventToChild = function( event, child ) {
          _.log( "Container.passEventToChild", $element, event, child );

          event.stopPropagation();

          var $localChild,
              items = $parent.children(),
              elementIndex = items.index( $element );


          // Check to see if item is a Object or integer
          if ( typeof child === "number" ) {
            if ( items.length > 0 ) {
              $localChild = $( items[child] );
            }
          } else {
            $localChild = $( child ); 
          }

          // We test so we don't go nuts triggering each child!
          // Only when the $element is the same as the child do
          // we fire the event
          if ( $localChild && elementIndex === child ) {
            // The event made into a JQuery Event
            $element.trigger( jQuery.Event( event ) );
          }
      };
                  
      // PRIVILEGED METHODS
      /**
       * Hides the related content.
       * @method hide
       * @public
       * @return {Void}
       */
      Container.hide = function () {
        _.log("Container.hide", $element);
        $element.addClass(hiddenClass);
        $element.removeClass(selectedClass);
        Container.trigger(settings.actionHide);
      };

      /**
       * Shows the related content.
       * @method show
       * @public
       * @return {Void}
       */
      Container.show = function () {
        _.log("Container.show", $element);
        $element.addClass(selectedClass);
        $element.removeClass(hiddenClass);
        Container.trigger(settings.actionShow);
      };

      /**
       * Returns the computed height of the Container; result has no units
       * @method getHeight 
       * @public
       * @return {Integer} Computed height of the Container
       */
      Container.getHeight = function() {
        _.log("Container.getHeight()");
        return $element.height();
      };

      /**
       * Returns the computed width of the Container; result has no units
       * @method getWidth
       * @public
       * @return {Integer} Computed width of the Container
       */
      Container.getWidth = function() {
        _.log("Container.getWidth()");
        return $element.width();
      };

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      // Get a reference to the parent
      $parent = getAthenaParent();

      hiddenClass = settings.hiddenClassName;
      selectedClass = settings.selectedClassName;

      // Initialize URI 
      initializeURI();
      
      // EVENT BINDINGS
      bindEvents();

    }
  };  
}() ));

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Container );
  } else if( module.exports ) {
   module.exports = Container; 
  }
}
