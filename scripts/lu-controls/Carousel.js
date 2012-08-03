/**
 * @class Carousel
 * @extends List
 */

var List = require( 'lu/List' ),
  Carousel;

Carousel =  List.extend( function ( base ) {

  var PLAY_EVENT = 'play',
    PAUSE_EVENT = 'pause',
    FIRST_EVENT = 'first',
    LAST_EVENT = 'last',
    SELECT_EVENT = 'select',
    PREVIOUS_EVENT = 'previous',
    NEXT_EVENT = 'next',
    OUT_OF_BOUNDS_EVENT = 'out-of-bounds',
    PLAYING_STATE = 'playing',
    PAUSED_STATE = 'paused',

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
      autoplay: false,
      /**
       * The time in milliseconds to remain on an item while playing
       * @property delay
       * @type Number
       * @private
       * @final
       */
      delay: 3000
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
      var self = this;
      _.defaults( settings, defaults );
      base.init.call( this, $element, settings );

     /**
       * Plays the Carousel
       * @method play
       * @privileged
       * @return {Object} Carousel
       */
      this.play = function(){
        if( !this.hasState( PLAYING_STATE ) ){
          ( function recurse( ){
            playTimer = window.setTimeout( function(){
              if( !self.hasState( PLAYING_STATE ) ){
                self.next();
                recurse();
              }
            }, settings.delay );
          }() );
          this.setState( PLAYING_STATE );
        }
        return this;
      };

      this.on( PLAY_EVENT, function( event ){
        event.stopPropagation();
        self.play();
      } );

      this.on( [PAUSE_EVENT, NEXT_EVENT, PREVIOUS_EVENT, FIRST_EVENT, LAST_EVENT, SELECT_EVENT].join( ' ' ), function( event, item ){
        event.stopPropagation();
        self.pause();
      } );

      // this.on( OUT_OF_BOUNDS_EVENT + '.' + NEXT_EVENT, function( event ){
      //   var controls;

      //   event.stopPropagation();

      //   self.next();

      //   controls = self.current().lu( 'getControls' );
      //   _.each( controls, function( item, index ){
      //     if ( typeof item.first === 'function' ){
      //       item.first();
      //     }
      //   } );
      // } );

      // this.on( OUT_OF_BOUNDS_EVENT + '.' + PREVIOUS_EVENT, function( event ){
      //   var controls;

      //   event.stopPropagation();

      //   self.previous();

      //   controls = self.current().lu( 'getControls' );
      //   _.each( controls, function( item, index ){
      //     if ( typeof item.last === 'function' ){
      //       item.last();
      //     }
      //   } );
      // } );

      // Play if autoplay is true in settings
      if( settings.autoplay ){
        this.play();
      } else {
        this.pause();
      }

    },

    /**
     * Pauses the Carousel
     * @method pause
     * @public
     * @return {Object} Carousel
     */
    pause: function(){
      if( !this.hasState( PAUSED_STATE ) ){
        window.clearTimeout( playTimer );
        this.setState( PAUSED_STATE );
      }
      return this;
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
