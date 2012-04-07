/**
 * Loader is a Container that knows how to get fresh content via AJAX.
 * @class Loader
 * @constructor
 * @extends Container
 * @requires ptclass
 * @version 1.0.0
 */ 
var Class = require( 'class' ),
  Container = require( 'lu/Container' ),
  Loader;

Loader = Class.create( Container, ( function () {

  // === GLOBAL CONSTANTS ===

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
          sourceURL: ''
        },
        /**
         * Object containing details about the URL of 
         * the parent page
         * @property pageURL
         * @type Object
         * @private
         */
        pageURL;


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
          content,
          height,
          width;


        if (url) {

          Loader.trigger( LOADING_EVENT );
          $element.addClass( LOADING_CSS );

          pageURL = pageURL || _.explodeURL(window.location.href);
          expURL = _.explodeURL(url);
          fragment = expURL.fragment;

          if (pageURL.authority === expURL.authority) {
            $.ajax( {
              url: url,
              success: function ( data, textStatus, jXHR ) {
                
                if( fragment ) {
                  content = $( data ).find( '#' + fragment);
                } else {
                  content = data;
                }
                Loader.inject( content );
                $element.removeClass( LOADING_CSS );                
              },
              failure: function () {
                
                Loader.trigger(ERROR_EVENT);
                // Handle this gracefully?
                $element.removeClass( LOADING_CSS );
              }
            } );            
          }
          else {
            settings.method = "replace";
            height = "100%";
            width = "100%";
            Loader.inject('<iframe src="' + url + '" height="' + height + '" width="' +  width + '"></iframe>');
            $element.removeClass( LOADING_CSS );
          }
        }
            
        return Loader;
      };
      

      /**
        * Content setter for Loader
        * @method setContent
        * @public
        * @param {Object} event JQuery event object
        * @param {String} url The content to load into the Loader
        * @return {Object} The Loader instance, for chaining
        */
       Loader.setContent = function ( event, url ) {

         if( !url ) {
           url = settings.sourceURL || $( event.target ).attr( 'href' ); 
         }

         Loader.load( url );
         return Loader;

       };      
       
      // === EVENT BINDINGS ===
      // n/a
      
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
