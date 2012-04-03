/**
 * Loader is a Container that knows how to get fresh content via AJAX.
 * @class Loader
 * @constructor
 * @extends Container
 * @requires ptclass
 */ 
var Class = require( 'class' ),
  Container = require( 'lu/Container' ),
  Loader;

//TODO: Loader should take a $jquery object, a selector, a string, or a source;

Loader = Class.create( Container, ( function () {

  // GLOBAL STATICS

  var LOADED_EVENT = 'loaded',
    LOADING_EVENT = 'loading',
    ERROR_EVENT = 'error',
    LOADING_CSS = 'lu-loading';

  // RETURN METHODS OBJECT
  return {
    /**
     * PTClass constructor 
     * @method initialize
     * @public
     * @param {Object} $super Pointer to superclass constructor
     * @param {Object} $element JQuery object for the element wrapped 
     * by the component
     * @param {Object} settings Configuration settings
     */    
    initialize: function ( $super, $element, settings ){
      // PRIVATE INSTANCE PROPERTIES
      /**
       * Instance of Button
       * @property Button
       * @type Object
       * @private
       */
      var Loader = this,
        /**
         * Default configuration values for all instances
         * @property defaults
         * @type Object
         * @private
         * @final
         */
        defaults = {
          /**
           * URL to call for fresh content.
           * @property sourceURL
           * @type {String}
           * @default ''
           */
          url: ''
        };

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );


      // === PRIVILEDGED METHODS ===
      
      /**
       * Loads the content into the specified node
       * @method load
       * @public
       * @param {String} url XHR source for the content to load.  If none
       * provided, look for an href on the target anchor tag.
       * @return {Object} The Loader instance
       */
      Loader.load = function ( url ) {
        var expURL,
          fragment,
          content;


        if (url) {

          Loader.trigger( LOADING_EVENT );
          $element.addClass( LOADING_CSS );

          expURL = _.explodeURL(url);
          fragment = expURL.fragment;

          $.ajax( {
            url: url,
            success: function ( data, textStatus, jXHR ) {
              if( fragment ) {
                content = $( data ).find( '#' + fragment);
              } else {
                content = data;
              }
              Loader.inject( content );
            },
            failure: function () {
              Loader.trigger(ERROR_EVENT);
              // Handle this gracefully?
              $element.removeClass( LOADING_CSS );
            }
          } );
        }
            
        return Loader;
      };

      // === EVENT BINDINGS ===
      
      Loader.on( 'load', function( event, url ) {
          
        if( !url ) {
          url = settings.url || $( event.target ).attr( 'href' ); 
        }
        event.stopPropagation();
        event.preventDefault();
        Loader.load( url );
      } );

    }
  };

}() ));

//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ) {
    module.setExports( Loader );
  } else if( module.exports ) {
   module.exports = Loader; 
  }
}
