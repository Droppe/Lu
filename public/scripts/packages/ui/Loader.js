var Class = require( '/scripts/libraries/ptclass' ),
  Abstract = require( 'ui/Abstract' ),
  Loader;

/**
 * Representation of a Loader
 * @class Loader
 * @constructor
 * @extends Abstract
 */ 
Loader = Class.create( Abstract, ( function () {

  // GLOBAL STATICS

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
           * @property loadingFlag css flag to be added to loader when loading
           * @type Object
           * @private
           */
          loadingFlag: 'loading',
          /**
           * Method to be used when populating target nodes content. Expects: replace || append || prepend
           * @property method 
           * @type {String}
           */
          method: 'replace'
        },
        /**
         * The node that the content is put into
         * @property content
         * @type Object
         * @private
         */
        $node;

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      $node = ( settings.node ) ? $( settings.node ) : $element;

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      /**
       * Loads the content into the specified node
       * @method load
       * @public
       * @param {String} url an Indicator for the content to load. This can be a hash (#id), a remote url or a url with a hash.
       * @return {Object} The Loader instance
       */
      Loader.load = function ( uri ) {
        var node = _.explodeURL( uri );
          $content;

        Loader.trigger( 'loading' );
        $element.addClass( settings.loadingFlag );

        function inject( content ) {
          switch( settings.method ) {
            case 'prepend':
              $node.prepend( content );
              break;
            case 'append':
              $node.append( content );
              break;
            default:
              $node.html( content );
              break;
          }
          $element.removeClass( settings.loadingFlag );
        }

        if ( node.path === '' ) {
          $content = $('#' + fragment ).html().execute();
          inject( $content );
        } else {
          $.ajax( {
            url: uri,
            success: function ( data, textStatus, jXHR ) {
              if( node.fragment ) {
                $content = $( $( data ).find( '#' + node.fragment ).html() ).execute();
                inject( $content );
              } else {
                $content = $( data ).execute();
                inject( $content );
              }
            }
          } );
        }
        Loader.trigger( 'loaded' );
        return Loader;
      };

      //Event Bindings
      Loader.on( 'load', function( event ) {
        var uri;
        if( !settings.uri ) {
          uri = $( event.target ).attr( 'href' ); 
        } else {
          uri = settings.uri;
        }
        event.stopPropagation();
        event.preventDefault();
        Loader.load( uri );
      } );

    }
  };

}() ));

// Export to Athena Framework
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Loader;
}
