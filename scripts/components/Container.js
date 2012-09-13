var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Switch = require( 'lu/Switch' ),
  Fiber = require( 'Fiber' ),
  Container;

/**
* Contains content and maintains state
* @class Container
* @constructor
* @extends Abstract
* @version 0.2.4
*/

Container = Switch.extend( function ( base ) {
  /**
   * Default configuration values
   * @property defaults
   * @type Object
   * @private
   * @final
   */
  var defaults = {
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
      var self = this,
        /**
         * The content of the container
         * @property content
         * @type String
         * @private
         */
        content,
        target;

      _.defaults( settings, defaults );

      base.init.call( this, $element, settings );

      /**
       * A cache to store the height and width of the $element
       * @property cache
       * @type Object
       * @public
       */
      this.cache = {};

      /**
       * A jquery object to inject content into
       * @property target
       * @type {Object}
       * @public
       */
      this.$target = null;

      target = settings.target;

      if( target ){
        this.$target = $element.find( target );
      } else {
        this.$target = $element;
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
        var isUrl = helpers.isUrl( url ),
          $target = $( event.target ),
          content;

        event.stopPropagation();

        if( !isUrl ){
          if( $target.is( 'a' ) ){
            url = $target.attr( 'href' );
          }

          if( !url && arguments.length > 1 ){
            method = url;
          }
        }

        if( url.indexOf( '#' ) === 0 ){
          content = $( url ).html();
          return self.trigger( constants.events.UPDATE, [content] );
        }

        if( settings.frame === true ){
          content = '<iframe src="' + url + '"></iframe>';
          return this.trigger( constants.events.UPDATED, [self] );
        }

        this.removeState( constants.states.LOADED );
        this.addState( constants.states.LOADING );

        $.ajax( {
          url: url,
          success: function( data, textStatus, jXHR ){
            var content,
              anchor = helpers.parseUri( url ).anchor;

            if( settings.selector ){
              content = $( data ).find( settings.selector ).html();
            } else if( anchor ){
              content = $( data ).find( '#' + anchor ).html() || data;
            } else {
              content = data;
            }

            self.removeState( constants.states.LOADING );
            self.addState( constants.states.LOADED );
            self.trigger( constants.events.UPDATED, [self] );
          },
          failure: function(){
           self.removeState( constants.states.LOADING ).addState( constants.states.ERRED );
          }
        } );

        return this;
      }

      /*
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
            self.appendContent( content );
            break;
          case 'prepend':
            self.prependContent( content );
            break;
          default:
            self.setContent( content );
            break;
        }
      }

      /**
       * Returns the contents of the Container
       * @method getContent
       * @public
       * @return {Array} contents
       */
      this.getContent = function(){
        return content;
      };

      /**
       * Sets the content of the Container replacing current content
       * @method setContent
       * param {String} value The content to set.
       * @public
       * @return {Object} Container
       */
      this.setContent = function( value ){
        content = value;
        this.$target.html( content );

        if( settings.autoHeight ){
          delete this.cache.height;
          this.setHeight( this.getHeight() );
        }

        if( settings.autoWidth ){
          delete this.cache.width;
          this.setWidth( this.getWidth() );
        }

        this.trigger( constants.events.UPDATED, $element );
        return this;
      };

      /**
       * Appends content to the Container
       * @method appendContent
       * param {String} value The content to append.
       * @public
       * @return {Function} Container.setContent
       */
      this.appendContent = function( value ){
        return this.setContent( content + value );
      };

      /**
       * Prepend content to the Container
       * @method prepend Content
       * param {String} value The content to prepend.
       * @public
       * @return {Function} this.setContent
       */
      this.prependContent = function( value ){
        return this.setContent( value + content );
      };

      if( settings.url ){
        //Load content from url
        this.trigger( constants.events.LOAD );
      } else {
        //Store the $elements content
        content = $element.html();
      }

      //sets the height of the container automagically if autoHeight is set to true.
      if( settings.autoHeight ){
        this.setHeight( this.getHeight() );
      }

      //sets the width of the container automagically if autoHeight is set to true.
      if( settings.autoWidth ){
        this.setWidth( this.getWidth() );
      }

      // //Bind update event to update
      this.on( constants.events.UPDATE, update );

      //Bind load event to load
      this.on( constants.events.LOAD, load );
    },
    /**
     * Returns the computed height of the Container; result has no units
     * @method getHeight
     * @public
     * @return {Integer} Computed height of the Container (result drops units)
     */
    getHeight: function(){
      var height = this.cache.height,
          $target = this.$target;

      if( !height ){
        if( $target ){
          height = $target.height();
        } else {
          height = this.$element.height();
        }
        this.cache.height = height;
      }
      return height;
    },
    /**
     * Sets the height of the Container.
     * @method setHeight
     * @param {Integer} value The height in pixels to set
     * @public
     * @return {Object} Container
     */
    setHeight: function( value ){
      var $target = this.$target;

      this.cache.height = value;
      if( $target ){
        $target.height( value );
      } else {
        this.$element.height( value );
      }
      return this;
    },
    /**
     * Returns the computed width of the Container; result has no units
     * @method getHeight
     * @public
     * @return {Integer} Computed height of the Container (result drops units)
     */
    getWidth: function(){
      var width = this.cache.width,
          $target = this.$target;

      if( !width ) {
        if( $target ){
          width = $target.width();
        } else {
          width = this.$element.width();
        }
        this.cache.width = width;
      }
      return width;
    },
    /**
     * Sets the width of the Container
     * @method setWidth
     * @param {Integer} value The width in pixels to set
     * @public
     * @return {Object} Container
     */
    setWidth: function( value ){
      var $target = this.$target;

      this.cache.width = value;
      if( $target ){
        $target.width( value );
      } else {
        this.$element.width( value );
      }
      return this;
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