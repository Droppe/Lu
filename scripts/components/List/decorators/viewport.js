var constants = require( 'lu/constants' ),
  Carousel = require( 'lu/Carousel' );

/**
 * @method first
 * @private
 */
function viewportDecorator( settings ) {

  return function( base ){
    var self = this;
    var slidingWindow = this.$element;
    var windowStart = 0;
    var pageSize = settings.viewport.pageSize || 1;
    var windowStartIndex = 0;
    var threshold = Math.floor(pageSize*(settings.viewport.threshold || 1));
    var mode = settings.viewport.mode || 'paging';
    var previewSize = settings.viewport.previewSize || '0';
    
    $(slidingWindow).width(getPageWidth() + 2*previewSize*getItemWidth());

    function pageRight() {
      var currentIndex = self.index();
      var size = self.size();
      var nextPageIndex = currentIndex + pageSize;

      if(nextPageIndex === size) {
          nextPageIndex = 0;
      }
      else if(size - nextPageIndex < pageSize) {
          nextPageIndex -= pageSize - (size - nextPageIndex);
      }
 
      self.select(nextPageIndex);
      slideToIndex(nextPageIndex);
    }

    function pageLeft() {
      var currentIndex = self.index();
      var size = self.size();
      var prevPageIndex = currentIndex - pageSize;
      
      if(prevPageIndex + pageSize === 0) {
          prevPageIndex = size - pageSize;
      }      
      else if(prevPageIndex < 0) {
          prevPageIndex = 0;

      }

      self.select(prevPageIndex);
      slideToIndex(prevPageIndex);
    }

    function slideToSelected() {
      var currentIndex = self.index();
      var midpoint = Math.floor(windowStartIndex + pageSize/2);

        if(currentIndex === 0) {
          windowStartIndex = 0;
        }
        else if(currentIndex === self.size() - 1) {
          windowStartIndex = self.size() - pageSize;
        }
        else {
          if(currentIndex >= windowStartIndex + threshold) {
            windowStartIndex += Math.abs(currentIndex - midpoint);

            if(windowStartIndex > self.size() - pageSize) {
              windowStartIndex = self.size() - pageSize;
            }
          }
          else if(currentIndex < windowStartIndex + pageSize - threshold) {
            windowStartIndex -= Math.abs(currentIndex - midpoint)

            if(windowStartIndex < 0) {
              windowStartIndex = 0;
            }
          }
          else
            return;
        }

        slideToIndex(windowStartIndex);
    }
    
    function getPageWidth() {
      var pageWidth = getItemWidth() * pageSize;
      return pageWidth;
    }
    
    function getItemWidth() {
      return slidingWindow.find('li').outerWidth(true);
    }
    
    function slideToIndex(index) {
      if (index === 0) {
        slidingWindow.find('ul').animate({right: index*getItemWidth()}, 500);
      } else if (index >= self.size() - pageSize) {
        slidingWindow.find('ul').animate({right: index*getItemWidth() - 2*previewSize*getItemWidth()}, 500);
      } else {
        slidingWindow.find('ul').animate({right: index*getItemWidth() - previewSize*getItemWidth()}, 500);

      }
    }

    self.on( constants.events.SELECTED, function( event, Component ){
      event.stopPropagation();
      if(mode === "sliding") {
        slideToSelected();
      }
    } ); 

    if(mode === "paging") {
      self.next = function() {
        pageRight();
      };
      self.previous = function() {
        pageLeft();
      };
      if (!(self instanceof Carousel)) {
        self.hasNext = function() {
          return ( this.index() + pageSize < this.size() ); 
        };
      }
    }
  };

}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( viewportDecorator );
  } else if( module.exports ){
    module.exports = viewportDecorator;
  }
}
