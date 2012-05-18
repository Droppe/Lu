/**
* Contains content and maintains state
* @class Container
* @constructor
* @extends Abstract
* @version 0.2.4
*/

//The Full path is given do to an error in inject :(
var Abstract = require( '/scripts/lu-controls/Abstract' ),
  stateDecorator = require( '/scripts/lu-decorators/State' ),
  Container;

Container = Abstract.extend( function ( Abstract ) {
  var STATE_EVENT = 'state',
    STATED_EVENT = 'stated',
    UPDATE_EVENT = 'update',
    UPDATED_EVENT = 'updated',
    LOAD_EVENT = 'load',
    LOADING_STATE = 'loading',
    LOADED_STATE = 'loaded',
    ERRED_STATE = 'erred',
    /**
     * Default configuration values
     * @property defaults
     * @type Object
     * @private
     * @final
     */
    defaults = {
      /**
       * The default state or states to be applied to the Container.
       * This can be an Array of strings or comma-delimited string
       * representing multiple states.
       * It can also be a string representing a single state
       * @property states
       * @type {String|Array}
       * @default null
       */
      states: null,
      content: null,
      /**
       * A URL to be used as a content source.
       * @property url
       * @type {String}
       * @default null
       */
      url: null,
      /**
       * A CSS selctor for an element to be used as a content source.
       * @property selector
       * @type {String}
       * @default null
       */
      selector: null,
      /**
       * Set to true if the content should be loaded in an iframe
       * @property frame
       * @type {Boolean}
       * @default false
       */
      frame: false,
      /**
       * When true the $element's height is set to the content height.
       * @property autoHeight
       * @type {Boolean}
       * @default false
       */
      autoHeight: false,
      /**
       * When true the $element's width is set to the content width.
       * @property autoWidth
       * @type {Boolean}
       * @default false
       */
      autoWidth: false,
      /**
       * A selector that specifies a target within the Container to inject content.
       * @property target
       * @type {String}
       * @default null
       */
      target: null
    };

  return {
    /**
     * Constructor
     * @method init
     * @public
     * @param {Object} $element JQuery object for the element wrapped by
     * the component
     * @param {Object} settings Configuration settings
     */
    init: function( $element, settings ){
      /**
       * Instance of Container
       * @property Container
       * @type Object
       * @private
       */
      var Container = this,
        /**
         * The content of the container
         * @property content
         * @type String
         * @private
         */
        content,
        /**
         * A jquery object to inject content into
         * @property target
         * @type {Object}
         * @private
         */
        $target,
        /**
         * A cache to store the height and width of the $element
         * @property cache
         * @type Object
         * @private
         */
        cache = {},
        target;

      _.defaults( settings, defaults );

      Abstract.init.call( this, $element, settings );
      Container.decorate( stateDecorator );

      target = settings.target;

      if( target ){
        $target = $element.find( target );
      } else {
        $target = $element;
      }

      /**
       * Loads content and then triggers an update event. Called on load event.
       * @method load
       * @private
       * @param {String} url The URL to load
       * @param {String} method the method to be used when inserting content
       * @return {Object} Container
       */
      function load( event, url, method ){
        var explodedURL = _.explodeURL( url ),
          content;

        event.stopPropagation();

        if( arguments.length === 1 ){
          url = $( event.target ).attr( 'href' );
        } else if( arguments.length === 2 && !_.isURL( url ) && !explodedURL.fragment && !explodedURL.path && !explodedURL.extension ){
          method = url;
          url = $( event.target ).attr( 'href' );
          explodedURL = undefined;
        }

        explodedURL = explodedURL || _.explodeURL( url );

        if( !explodedURL.authority && !explodedURL.path && !explodedURL.extension && explodedURL.fragment ){
          content = $( '#' + explodedURL.fragment ).html();
          return Container.trigger( UPDATE_EVENT, content, method );
        }

        if( settings.frame === true ){
          content = '<iframe src="' + url + '"></iframe>';
          return Container.trigger( UPDATE_EVENT, content, method );
        }

        Container.removeState( LOADED_STATE );
        Container.addState( LOADING_STATE );

        if (url) {
          $.ajax( {
            url: url,
            success: function( data, textStatus, jXHR ){
              var content;

              if( settings.selector ){
                content = $( data ).find( settings.selector ).html();
              } else if( explodedURL.fragment ){
                content = $( data ).find( '#' + explodedURL.fragment ).html() || data;
              } else {
                content = data;
              }

              Container.removeState( LOADING_STATE );
              Container.trigger( UPDATE_EVENT, content, method );
              Container.addState( LOADED_STATE );
            },
            failure: function(){
             Container.removeState( LOADING_STATE ).addState( ERRED_STATE );
            }
          } );
        }

        return Container;
      }

      /**
       * Updates content on an update event
       * @method update
       * @private
       * @param {Object} event The jQuery Event object
       * @param {String} content The content to set
       * @param {String} method The method to use for setting the content.
       * This can specified as 'prepend' or 'append'. If theese are not
       * specified the content is replaced.
       * @return {Function} Container.setState
       */
      function update( event, content, method ){
        event.stopPropagation();
        switch( method ){
          case 'append':
            Container.appendContent( content );
            break;
          case 'prepend':
            Container.prependContent( content );
            break;
          default:
            Container.setContent( content );
            break;
        }
      }

      /**
       * Returns the computed height of the Container; result has no units
       * @method getHeight
       * @public
       * @return {Integer} Computed height of the Container (result drops units)
       */
      Container.getHeight = function(){
        var height = cache.height = cache.height || $element.height();
        return height;
      };

      /**
       * Sets the height of the Container.
       * @method setHeight
       * @param {Integer} value The height in pixels to set
       * @public
       * @return {Object} Container
       */
      Container.setHeight = function( value ){
        cache.height = value;
        $element.height( value );
        return Container;
      };

      /**
       * Returns the computed width of the Container; result has no units
       * @method getHeight
       * @public
       * @return {Integer} Computed height of the Container (result drops units)
       */
      Container.getWidth = function(){
        var width = cache.width = cache.width || $element.width();
        return width;
      };

      /**
       * Sets the width of the Container
       * @method setWidth
       * @param {Integer} value The width in pixels to set
       * @public
       * @return {Object} Container
       */
      Container.setWidth = function( value ){
        cache.width = value;
        $element.width( value );
        return Container;
      };

      /**
       * Returns the contents of the Container
       * @method getContent
       * @public
       * @return {Array} contents
       */
      Container.getContent = function(){
        return content;
      };

      /**
       * Sets the content of the Container replacing current content
       * @method setContent
       * param {String} value The content to set.
       * @public
       * @return {Object} Container
       */
      Container.setContent = function( value ){
        content = value;
        $target.html( content );

        if( settings.autoHeight ){
          delete cache.height;
          Container.setHeight( Container.getHeight() );
        }

        if( settings.autoWidth ){
          delete cache.width;
          Container.setWidth( Container.getWidth() );
        }

        Container.trigger( UPDATED_EVENT, $element );
        return Container;
      };

      /**
       * Appends content to the Container
       * @method appendContent
       * param {String} value The content to append.
       * @public
       * @return {Function} Container.setContent
       */
      Container.appendContent = function( value ){
        return Container.setContent( content + value );
      };

      /**
       * Prepend content to the Container
       * @method prepend Content
       * param {String} value The content to prepend.
       * @public
       * @return {Function} Container.setContent
       */
      Container.prependContent = function( value ){
        return Container.setContent( value + content );
      };

      if( settings.url ){
        //Load content from url
        Container.trigger( 'load' );
      } else {
        //Store the $elements content
        content = $element.html();
      }

      //sets the height of the container automagically if autoHeight is set to true.
      if( settings.autoHeight ){
        Container.setHeight( Container.getHeight() );
      }

      //sets the width of the container automagically if autoHeight is set to true.
      if( settings.autoWidth ){
        Container.setWidth( Container.getWidth() );
      }

      //Bind update event to update
      Container.on( UPDATE_EVENT, update );

      //Bind load event to load
      Container.on( LOAD_EVENT, load );
    }
  };
} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Container );
  } else if( module.exports ){
   module.exports = Container;
  }
}