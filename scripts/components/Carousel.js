/**
 * @class Carousel
 * @extends List
 */

var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  List = require( 'lu/List' ),
  Carousel;

Carousel =  List.extend( function ( base ) {
  var
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
      delay: 3000
    };

  // RETURN METHODS OBJECT
  return {
    /**
     * Class constructor
     * @method initialize
     * @public
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */
    init: function ( $element, settings ){
      var self = this,
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
         * The calculated time in milliseconds to remain on an item while playing
         * @property delay
         * @type Number
         * @private
         * @final
         */
        delay,
        /**
         * Timer which handles the playing of the carousel
         * @property playTimer
         * @type Object
         * @private
         */
        playTimer;

      _.defaults( settings, defaults );
      base.init.call( this, $element, settings );

      repeat = settings.repeat;
      delay = settings.delay;

     /**
       * Plays the Carousel
       * @method play
       * @privileged
       * @return {Object} Carousel
       */
      this.play = function(){
        if( !this.hasState( constants.states.PLAYING ) ){
          ( function recurse(){
            playTimer = window.setTimeout( function(){
              if( self.hasState( constants.states.PLAYING ) ){
                self.next();
                if( repeat !== 0 ){
                  repeat -= 1;
                  recurse();
                } else {
                  self.pause();
                }
              }
            }, delay );
          }() );
          this.setState( constants.states.PLAYING );
        }
        return this;
      };

      /**
       * Pauses the Carousel
       * @method pause
       * @public
       * @return {Object} Carousel
       */
      this.pause = function(){
        if( !this.hasState( constants.states.PAUSED ) ){
          repeat = settings.repeat;
          window.clearTimeout( playTimer );
          this.setState( constants.states.PAUSED );
        }
        return this;
      };

      this.on( constants.events.PLAY, function( event ){
        event.stopPropagation();
        self.play();
      } );

      _.each( [constants.events.PAUSE, constants.events.NEXT, constants.events.PREVIOUS,
            constants.events.FIRST, constants.events.LAST,
            constants.events.SELECT], function( event ){
        self.on( event, function( event, item ){
          event.stopPropagation();
          self.pause();
        } );
      } );

      // Play if autoplay is true in settings
      if( settings.autoplay ){
        this.play();
      } else {
        this.pause();
      }
    },

    /**
     * Carousels wrap, so they always have next
     * @method hasNext
     * @public
     * @return {Boolean} true
     */
    hasNext: function(){
      return true;
    },

    /**
     * Carousels wrap, so they always have previous
     * @method hasPrevious
     * @public
     * @return {Boolean} true
     */
    hasPrevious: function(){
      return true;
    },

    /**
     * Selects the next item in the Carousel.
     * @method next
     * @public
     * @return {Object} Carousel
     */
    next: function(){
      if( this.index() + 1 === this.size() ){
        this.first();
      } else {
        this.select( this.index() + 1 );
      }
      return this;
    },

    /**
     * Selects the previous item in the Carousel.
     * @method previous
     * @public
     * @return {Object} Carousel
     */
    previous: function(){
      if( this.index() === 0 ){
        this.last();
      } else {
        this.select( this.index() - 1 );
      }
      return this;
    }
  };

} );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Carousel );
  } else if( module.exports ){
   module.exports = Carousel;
  }
}
