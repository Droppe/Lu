var Class = li.require( 'libraries/ptclass' ),
	List = li.require( 'ui/List' ),
	Carousel;

/**
 * Description
 * @class Carousel
 * @constructor
 * @extends List
 * @param {HTMLElement} $element The JQuery node representing the Carousel's container
 * @param {Object} settings Configuration properties
 */
Carousel = Class.create( List, ( function(){
  
  
    // Private Static Attributes

    /**
     * Default configuration values
     * @property defaults
     * @type Object
     */
     var defaults = {};
     

    // Return methods object
    return {
      initialize: function ( $super, $element, settings ){
        
        defaults = {
          items: $("li", $element)
        };

        // Private attributes
        var node = $element;

        // Public attributes
        this.node = node;

        _.defaults( settings, defaults );

        // Call the parent's initialize method with the new config via '$super'
        $super( $element, settings );
      },
      /**
       * Selects the next item in the list. 
       * @method next
       * @public
       * @return {Void}
       */
      next: function() {
        _.log("next: " + this.node.id);
        if (this.hasNext()) {
          this.select( this.index() + 1);
        }
        else {
          this.first();
        }
      },
    /**
     * Selects the previous item in the list. 
     * @method previous
     * @public
     * @return {Void}
     */  
    previous: function() {
      if (this.hasPrevious()) {
        this.select( this.index() - 1);
      }
      else {
        this.last();
      }
    }
  });

  // for Athena
  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = Carousel;
  }

})();  
