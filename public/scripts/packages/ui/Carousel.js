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
Carousel =  Class.create( List, ( (function(){

  // Private attributes
  /**
   * Instance of Button
   * @property Button
   * @type Object
   * @private
   */  
  var self,
  /**
   * Configuration values
   * @property onfig
   * @private
   * @type {Object}
   */
  config,
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
  playing = false;
  ;  
  
  // Return methods object 
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
      var $pannels;

      self = this;      
      repeat = settings.repeat;
      
      // Mix the defaults into the settings values
      config = _.defaults( settings, defaults );

      $pannels = $element.children( settings.pannels ).children();

      if( $pannels.length > 0 ) {
        settings.items = $pannels.children( settings.items );
      }
      
      // Call the parent's constructor
      $super( $element, config );
      
      //play if autoplay was true in settings
      if( config.autoplay ) {
        self.play();
      }
      
      // Event bindings
      self.on( 'selected', function( event, $item ) {
         var $pannel = $item.closest( $pannels );
         if( $pannel.hasClass( config.activeFlag ) === false ) {
           $pannels.removeClass( config.activeFlag );
           $pannel.addClass( config.activeFlag );
         }
       } );
       
       self.on( 'max', function( event ) {
         event.stopPropagation();
         if( playing && repeat !== 0 ) {
           repeat -= 1;
           self.first();
         } else if ( playing && repeat < 0 ){
           self.first();
         } else {
           self.first();
         }
       } );
       
       self.on( 'min', function( event ) {
         event.stopPropagation();
         self.last();
       } );
       
       self.on( 'play', function( event ) {
         event.stopPropagation();
         self.play();
       } );
       
       self.on( 'pause', function( event ) {
         event.stopPropagation();
         self.pause();
       } );      
    },
    /**
     * Pauses the Carousel when playing
     * @method pause
     * @public
     */
    pause: function() {
      if( playing ) {
        playing = false;
        self.trigger( 'paused' );
      }
      return self;
    },
    /**
     * Plays the Carousel when paused
     * @method play
     * @public
     */
    play: function() {
      if( playing === false ) {
        repeat = config.repeat;
        playing = true;
        ( function recurse() {
          window.setTimeout( function() {
            if( playing ) {
              self.next();
              recurse();
            }
          }, config.delay );
        }() );
        self.trigger( 'playing' );
      }
      return self;
    }
      
  };

})() ));


// Export to Athena Framework
if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = Carousel;
}
