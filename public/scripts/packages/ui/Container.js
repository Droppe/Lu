var Class = require( '/scripts/libraries/ptclass' ),
  Abstract = require( 'ui/Abstract' ),
  Container;

/**
 * Toggles the display of related content to a change event from a grouping of radio buttons.
 * @class RadioReveal
 * @constructor
 * @extends Abstract
 * @require ptclass, Abstract
 */
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
        className: "hidden",
        // EVENTS
        onHide: "hide unselect",
        onShow: "show select",
        actionHide: "hide",
        actionShow: "show"
      },
      /**
       * Classname for the hidden class from config
       * @property hiddenClass
       * @type String
       * @private
       */
      hiddenClass;
                  
      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      hiddenClass = settings.className;


      // PRIVILEGED METHODS

      /**
       * Hides the related content.
       * @method hide
       * @public
       * @return {Void}
       */
      Container.hide = function () {
        $element.addClass(hiddenClass);
        Container.trigger(settings.hiddenEvent);
      };

      /**
       * Shows the related content.
       * @method show
       * @public
       * @return {Void}
       */
      Container.show = function () {
        $element.removeClass(hiddenClass);
        Container.trigger(settings.shownEvent);
      };


      // EVENT BINDINGS
      
      // show
      $element.on( settings.onShow, function( event, item ){
        _.log("Container", settings.onShow, $element);
        event.stopPropagation();        
        
        var ok = true;
        
        if (item) {
          if ( typeof item === "string" && item !== $element.attr("id")) {
            ok = false;
          } 
        }
        
        if (ok) {
          Container.show();
        } else {
          Container.hide();
        }
        
      } );

      // hide
      $element.on( settings.onHide, function( event, item ){
        _.log("Container", settings.onHide, $element);
        event.stopPropagation();
        Container.hide();
      } );

    }
  };  
}() ));

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = Container;
}