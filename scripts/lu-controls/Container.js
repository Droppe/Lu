
/**
 * 
 * @class Container
 * @constructor
 * @extends Abstract
 * @requires ptclass
 * @version 0.1.3
 */

var Class = require( 'class' ),
  Abstract = require( 'lu/Abstract' ),
  Container;

Container = Class.create( Abstract, ( function(){
  var STATE_EVENT = 'state',
    STATED_EVENT = 'stated',
    STATE_FLAG_PREFIX = 'lu-state-',
    UPDATE_EVENT = 'update',
    UPDATED_EVENT = 'updated',
    LOAD_EVENT = 'load',
    LOADING_STATE = 'loading',
    LOADED_STATE = 'loaded',
    ERRED_STATE = 'erred';

  return {
    /**
     * PTClass constructor 
     * @method initialize
     * @public
     * @param {Object} $super Pointer to superclass constructor
     * @param {Object} $element JQuery object for the element wrapped by
     * the component
     * @param {Object} settings Configuration settings
     */
    initialize: function( $super, $element, settings ){
      /**
       * Instance of Container
       * @property Container
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
          /**
           * The default state or states to be applied to the Container.
           * This can be an Array of strings or comma delimeted string
           * representing multiple states.
           * It can also be a string representing a single state
           * @property states
           * @type {String|Array}
           * @default null
           */
          states: null,
          /**
           * The default state or states to be applied to the Container.
           * This can be an Array of strings or comma delimeted string
           * representing multiple states. It can also be a string
           * representing a single state.
           * @property content
           * @type {String}
           * @default null
           */
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
          autoWidth: false
        },
        /**
         * The content of the container
         * @property content
         * @type String
         * @private
         */
        content,
        /**
         * A cache to store the height and width of the $element
         * @property cache
         * @type Object
         * @private
         */
        cache = {},
        /**
         * An array of string representing the current state(s)
         * @property states
         * @type Array
         * @private
         */
        states = [];

      //MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      //Normalize states to array
      if( settings.states ){
        if( typeof settings.states === 'string' ){
          //states can be a comma deliminated string
          states = states.split( ',' );
        } else if( _.isArray( settings.states ) ){
          //yea! it's somthing we can work with!
          states = settings.states;
        }
      }

      //CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      /**
       * Add Classes representing the current states to $element and remove
       * invalid states
       * @method applyStates
       * @private
       * @event
       * @param {Object} event The jQuery Event object
       * @param {Array} states an array of states to set
       * @return {Function} Container.setState
       */
      function applyStates(){
        var removed = [],
          classes = [];

        _.each( $element.attr( 'class' ).split( ' ' ), function( clss, index ){
          if( clss.indexOf( STATE_FLAG_PREFIX ) > -1 ){
            removed.push( clss );
          }
        } );

        _.each( states, function( clss, index ){
          classes.push( STATE_FLAG_PREFIX + clss );
        } );

        $element.removeClass( removed.join( ' ' ) ).addClass( classes.join( ' ' ) );
      }

      /**
       * Loads content and then triggers an update event. Called on load event.
       * @method load
       * @private
       * @event
       * @param {String} url The URL to load
       * @param {String} method the method to be used when inserting content
       * @return {Object} Container
       */
      function load( event, url, method ){
        var explodedURL = _.explodeURL( url ),
          content;

        if( arguments.length === 1 ){
          url = $( event.target ).attr( 'href' );
        } else if( arguments.length === 2 && !_.isURL( url ) && !explodedURL.fragment ){
          method = url;
          url = $( event.target ).attr( 'href' );
          explodedURL = undefined;
        }

        explodedURL = explodedURL || _.explodeURL( url );

        if( !explodedURL.authority && explodedURL.fragment ){
          content = $( '#' + explodedURL.fragment ).html();
          return Container.trigger( UPDATE_EVENT, content, method );
        }

        if( settings.frame === true ){
          content = '<iframe src="' + url + '"></iframe>';
          return Container.trigger( UPDATE_EVENT, content, method );
        }

        Container.addState( LOADING_STATE );
        $.ajax( {
          url: url,
          success: function( data, textStatus, jXHR ){
            var content;

            if( settings.selector ){
              content = $( data ).find( settings.selector ).html;
            } else {
              content = data;
            }

            return Container.trigger( UPDATE_EVENT, content, method );

            Container.removeState( LOADING_STATE );
            Container.addState( LOADED_STATE );
          },
          failure: function(){
            Container.removeState( LOADING_STATE );
            Container.addState( ERRED_STATE );
          }
        } );
        return Container;
      }

      /**
       * Calls Container.setState on a state event 
       * @method state
       * @private
       * @event
       * @param {Object} event The jQuery Event object
       * @param {Array} states an array of states to set
       * @return {Function} Container.setState
       */
      function state( event, states ){
        return Container.setState( states );
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
        var width = cache.width = cache.width ||$element.width();
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
<<<<<<< HEAD
       * Returns the state(s) of the Container
       * @method getState
       * @public
       * @return {Array} an Array of strings representing the state(s)
       */
      Container.getState = function(){
        return states;
      };

      /**
       * Sets the state(s) of the Container replacing other states
       * @method setState
       * @param {Array|String} value This can be an Array of strings or comma
       * delimeted string representing multiple states. It can also be
       * a string representing a single state
       * @public
       * @return {Object} Container
       */
      Container.setState = function( value ){
        if( typeof value === 'string' ){
          value = value.split( ',' ).sort();
        }

        value = value.sort();
        states = states.sort();

        if( _.isEqual( value, states ) ){
          return Container;
        }

        states = value;

        applyStates();
        Container.trigger( STATED_EVENT, $element, states );

        return Container;
      };

      /**
       * Adds a state or states to the Container
       * @method addState
       * @param {Array|String} value This can be an Array of strings or comma
       * delimeted string representing multiple states. It can also be
       * a string representing a single state
       * @public
       * @return {Object} Container
       */
      Container.addState = function( value ){
        if( typeof value === 'string' ){
          value = value.split( ',' );
        }
        if( _.difference( value, states ).length > 0 ){
          states = _.union( states, value );
          applyStates();
          Container.trigger( STATED_EVENT, $element, states );
        }
        return Container;
      };

      /**
       * Removes the state(s) from the Container
       * @method addState
       * @param {Array|String} value This can be an Array of strings or comma
       * delimeted string representing multiple states. It can also be
       * a string representing a single state
       * @public
       * @return {Object} Container
       */
      Container.removeState = function( value ){
        var difference;
        if( typeof value === 'string' ){
          value = value.split( ',' );
        }

        difference = _.difference( states, value );

        if( difference.length > 0 ){
          states = difference;
          applyStates();
          Container.trigger( STATED_EVENT, $element, states );
        }

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
        $element.html( content );

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

      //Populate initial content
      if( settings.url ){
        //Load content from url
        Container.trigger( 'load' );
      } else {
        //Store the $elements content
        content = $element.html();
      }

      //Sets default states specified in the class attribute
      _.each( $element.attr( 'class' ).split( ' ' ), function( clss, index ){
        if( clss.indexOf( STATE_FLAG_PREFIX ) > -1 ){
          Container.addState( clss.replace( STATE_FLAG_PREFIX, '' ) );
        }
      } );

      //sets the height of the container automagically if autoHeight is set to true.
      if( settings.autoHeight ){
        Container.setHeight( Container.getHeight() );
      }

      //sets the width of the container automagically if autoHeight is set to true.
      if( settings.autoWidth ){
        Container.setWidth( Container.getWidth() );
      }

      //Bind state event to state
      Container.on( STATE_EVENT, state );

      //Bind update event to update
      Container.on( UPDATE_EVENT, update );

      //Bind load event to load
      Container.on( LOAD_EVENT, load );

    }
  };
}() ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Container );
  } else if( module.exports ){
   module.exports = Container; 
  }
}
