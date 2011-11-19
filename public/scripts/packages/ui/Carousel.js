var Class = li.require( 'libraries/ptclass' ),
  List = li.require( 'ui/List' ),
  Carousel;

/**
 * A representation of a stateful list
 * @class List
 * @constructor
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance
 */
Carousel =  Class.create( List, ( function() {

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
       * Instance of Carousel
       * @property Carousel
       * @type Object
       * @private
       */  
      var Carousel = this,
      /**
       * Default configuration values
       * @property defaults
       * @type Object
       * @private
       * @final
       */
      defaults = {
        /**
         * Number of times to cycle through carousel items when playing, set to -1 to repeat forever
         * @property repeat
         * @type Number
         * @private
         */
        repeat: -1,
        /**
         * Automatically calls play on instantiation if set to true
         * @property repeat
         * @type Boolean
         * @private
         * @final
         */
        autoplay: true,
        /**
         * The time in milliseconds to remain on an item while playing
         * @property delay
         * @type Number
         * @private
         * @final
         */
        delay: 3000,
        /**
         * A selector scoped to the $element that matches carousel pannels
         * @property repeat
         * @type String
         * @private
         * @final
         */
        pannels: '.pannels',
        /**
         * A selector scoped to the $element that matches carousel items
         * @property repeat
         * @type String
         * @private
         * @final
         */
        items: '.items',
        /**
         * The CSS class that designates a selected pannel
         * @property selectFlag
         * @default 'selected'
         * @type String
         * @final
         * @private
        */
        activeFlag: 'active'
      },
      /**
       * Integer value signalling whether the carousel is set to repeat
       * @property repeat
       * @type Type Number
       * @private
       */
      repeat,
      /**
       * Flag signalling the playing state of the carousel
       * @property playing
       * @type Boolean
       * @default false
       * @private
       */
      playing = false,
      /**
       * The collection of panels in the carousel
       * @property $pannels
       * @type Object
       * @private
       */
      $pannels;

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      repeat = settings.repeat;

      $pannels = $element.children( settings.pannels ).children();

      if( $pannels.length > 0 ) {
        settings.items = $pannels.children( settings.items );
      }

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      // PRIVILEGED METHODS
     /**
       * Plays the Carousel when paused
       * @method play
       * @public
       * @return {Object} The Carousel instance
       */
      Carousel.play = function() {
        if( playing === false ) {
          repeat = settings.repeat;
          playing = true;
          ( function recurse() {
            window.setTimeout( function() {
              if( playing ) {
                Carousel.next();
                recurse();
              }
            }, settings.delay );
          }() );
          Carousel.trigger( 'playing' );
        }
        return Carousel;
      };

      /**
       * Pauses the Carousel when playing
       * @method pause
       * @public
       * @return {Object} The Carousel instance
       */
      Carousel.pause = function() {
        if( playing ) {
          playing = false;
          Carousel.trigger( 'paused' );
        }
        return Carousel;
      };

      // EVENT BINDINGS
      Carousel.on( 'selected', function( event, $item ) {
         var $pannel = $item.closest( $pannels );
         if( $pannel.hasClass( settings.activeFlag ) === false ) {
           $pannels.removeClass( settings.activeFlag );
           $pannel.addClass( settings.activeFlag );
         }
      } );
      Carousel.on( 'max', function( event ) {
       event.stopPropagation();
       if( playing && repeat !== 0 ) {
         repeat -= 1;
         Carousel.first();
       } else if ( playing && repeat < 0 ){
         Carousel.first();
       } else {
         Carousel.first();
       }
      } );
      Carousel.on( 'min', function( event ) {
       event.stopPropagation();
       Carousel.last();
      } );
      Carousel.on( 'play', function( event ) {
       event.stopPropagation();
       Carousel.play();
      } );
      Carousel.on( 'pause next previous first last select', function( event, item ) {
        event.stopPropagation();
        Carousel.pause();
      } );

      // Play if autoplay was true in settings
      if( settings.autoplay ) {
        Carousel.play();
      }
    }
  };

}() ));


// EXPORT TO ATHENA FRAMEWORK
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Carousel;
}
