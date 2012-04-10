/**
 * Toggles the display of related content to a change event from a grouping of radio buttons.
 * @class Container
 * @constructor
 * @extends Abstract
 * @requires ptclass
 * @version 0.1
 */
var Class = require( 'class' ),
  Abstract = require( 'lu/Abstract' ),
  Container;

Container = Class.create( Abstract,  ( function (){

  // === GLOBAL STATICS ===
  var CONTENT_LOAD_EVENT = 'load',
    CONTENT_LOADED_EVENT = 'loaded',
    CONTNR_HIDE_EVENT = 'close hide unselect',
    CONTNR_SHOW_EVENT = 'open show select';


  // === RETURN METHODS OBJECT ===
  return {
    /**
     * PTClass constructor 
     * @method initialize
     * @public
     * @param {Object} $super Pointer to superclass constructor
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */    
    initialize: function( $super, $element, settings ){
      // PRIVATE INSTANCE PROPERTIES

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
        // CSS
        hiddenClassName: 'lu-hidden',
        selectedClassName: 'lu-selected',
        // EVENTS
        onHide: CONTNR_HIDE_EVENT,
        onShow: CONTNR_SHOW_EVENT,
        onLoad: CONTENT_LOAD_EVENT,
        actionHide: 'hidden',
        actionShow: 'shown',
        /**
         * DOM node to source for fresh content.  Can be a CSS selector or 
         * a JQuery object.
         * @property sourceNode
         * @type {String|Object}
         * @default ''
         */
        sourceNode: '',
        /**
         * Text to inject as fresh content.
         * @property sourceText
         * @type {String}
         * @default ''
         */
        sourceText: '',
        /**
         * Method to be used when populating target nodes content. 
         * Expects: replace || append || prepend
         * @property method 
         * @type {String}
         * @default append
         */
        method: 'append'
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
      selectedClass;

     
      // === PRIVATE METHODS ===

      /**
       * Gets the closest $parent of the Container if the $parent is a Lu object ( has the attribute "data-lu" )
       * and is not the <body> 
       * @method getLuParent
       * @private
       * @return {Object} $parent - JDOM reference to the parent of the Container
       */
      //can we use lu.getParent here?
      function getLuParent(){
        var $parent,
            $parents = $element.parents("[data-lu]").not("body");

        if ( $parents.length > 0 ){
          $parent = $parents.eq( 0 ); 
        }

        return $parent;

      }
                  
      // === PRIVILEDGED METHODS ===
 
      /**
       * Hides the Container.
       * @method hide
       * @public
       * @return {Object} The container instance, for chaining
       */
      Container.hide = function(){
        //_.log("Container.hide", $element);
        $element.addClass(hiddenClass);
        $element.removeClass(selectedClass);
        Container.trigger(settings.actionHide);
        return Container;
      };

      /**
       * Shows the Container.
       * @method show
       * @public
       * @return {Object} The container instance, for chaining
       */
      Container.show = function () {
        //_.log("Container.show", $element);
        $element.addClass(selectedClass);
        $element.removeClass(hiddenClass);
        Container.trigger(settings.actionShow);
        return Container;
      };

      /**
       * Returns the computed height of the Container; result has no units
       * @method getHeight 
       * @public
       * @return {Integer} Computed height of the Container (result drops units)
       */
      Container.getHeight = function() {
        //_.log("Container.getHeight()");
        return $element.height();
      };

      /**
       * Returns the computed width of the Container; result has no units
       * @method getWidth
       * @public
       * @return {Integer} Computed width of the Container (result drops units)
       */
      Container.getWidth = function() {
        //_.log("Container.getWidth()");
        return $element.width();
      };

      /**
       * Injects string content into the Container using the 
       * configured setting (prepend/append/replace)
       * @method inject
       * @public
       * @param {String} content 
       * @return {Object} The Container instance, for chaining
       */      
      Container.inject = function ( content ) {
        var type;
        
        if( content ){        
          switch( settings.method ){
            case 'prepend':
              type = 'prepend';
              break;
            case 'append':
              type = 'append';
              break;
            default:
              type = 'html';
              break;
          }
          $element[type]( content );
          Container.trigger( CONTENT_LOADED_EVENT );
        }
        return Container;
      };

      /**
       * Loads the specified content into the Container
       * @method setContent
       * @public
       * @param {Object|String} content JQuery object to source the content from, 
       * or text string to use as new content.
       * @return {Object} The Container instance
       */
      Container.setContent = function( event, content ){
        var data;

        if( !content ){
          content = settings.sourceText || $( settings.sourceNode );
        }
        
        if( typeof content === 'object' ) {
          data = content.html();
        } else if( typeof content === 'string' ){
          data = content;
        }
        
        if( data ){
          Container.inject( data );
        }

        return Container;
      };
      
  

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      // Get a reference to the parent
      $parent = getLuParent();

      hiddenClass = settings.hiddenClassName;
      selectedClass = settings.selectedClassName;

      
      // === EVENT BINDINGS ===
      
      // Show
      Container.on( settings.onShow, function ( event, item ) {
        event.preventDefault();
        event.stopPropagation();        
        
        var ok = true;
                     
        // item can be an integer or an object
        if( item ){
          // Show the item if the selected container equals this instance
          if( typeof item === 'string' && item === $element.attr( 'id' ) ){
            ok = true;
          } else if( $element.is( $( item ) ) ){
            ok = true;
          } else {
            ok = false;
          }
        }

        // show() unless item is specified.  Otherwise, if the selected container 
        // matches this instance, show(), else hide().
        if( ok ){
          Container.show();
        } else{
          Container.hide();
        }

      } );

      // Hide
      Container.on( settings.onHide, function( event ){
        event.preventDefault();
        event.stopPropagation();
        Container.hide();
      } );

      // Load
      Container.on( settings.onLoad, function ( event, content ){
        event.preventDefault();
        event.stopPropagation();
        Container.setContent(event, content);
      } );

    }
  };

}() ) );
//Export to Common JS Loader
if( typeof module !== 'undefined' ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( Container );
  } else if( module.exports ) {
   module.exports = Container; 
  }
}
