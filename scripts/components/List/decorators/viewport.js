var constants = require('lu/constants'),
  Carousel = require('lu/Carousel');

/**
 * Applies a viewport to a List or Carousel.
 * @private
 */
function viewportDecorator(settings) {

  return function (base) {
    var self = this,
      slidingWindow = settings.viewport.slidingWindow ? $( settings.viewport.slidingWindow ) : this.$element,
      viewportStartIndex = 0,
      // Settings
      pageSize = settings.viewport.pageSize || 1, // number of elements to show in the viewport
      slidingThreshold = settings.viewport.slidingThreshold || pageSize, // how far from the edge to trigger scrolling
      mode = settings.viewport.mode || 'paging', // or sliding
      previewSize = settings.viewport.previewSize || 0, // how much of the next element to reveal
      animationSpeed = settings.viewport.animationSpeed || 500;

    // Check if settings are reasonable
    if (pageSize <= 0) {
      pageSize = 1;
    }

    if (slidingThreshold > pageSize) {
      slidingThreshold = pageSize;
    } else if (slidingThreshold < 0) {
      slidingThreshold = 0;
    }

    if (previewSize > 0.5) {
      previewSize = 0.5;
    } else if (previewSize < 0) {
      previewSize = 0;
    }

    function getPageWidth() {
      return getItemWidth() * pageSize;
    }

    function getItemWidth() {
      return slidingWindow.find('li').outerWidth(true);
    }

    // Ensures the proper width of the viewport.
    $(slidingWindow).width(getPageWidth() + 2 * previewSize * getItemWidth());

    function pageRight() {
      var currentIndex = self.index(),
        size = self.size(),
        nextPageIndex = currentIndex + pageSize;

      if (nextPageIndex >= size) {
        nextPageIndex = 0;
      } else if (size - nextPageIndex < pageSize) {
        // Compensate for when the last page does not contain a full page of elements.
        // Only scroll over the remaining elements.
        nextPageIndex -= pageSize - (size - nextPageIndex);
      }

      self.select(nextPageIndex);
      slideToIndex(nextPageIndex);
    }

    function pageLeft() {
      var currentIndex = self.index(),
        size = self.size(),
        prevPageIndex = currentIndex - pageSize;

      if (prevPageIndex + pageSize === 0) {
        prevPageIndex = size - pageSize;
      } else if (prevPageIndex < 0) {
        prevPageIndex = 0;
      }

      self.select(prevPageIndex);
      slideToIndex(prevPageIndex);
    }

    function slideToSelected() {
      var currentIndex = self.index(),
        midpoint = Math.floor(viewportStartIndex + pageSize / 2);

      if (currentIndex === 0) {
        viewportStartIndex = 0;
      } else if (currentIndex === self.size() - 1) {
        // On last page, slide the viewport to the beginning of the last page
        viewportStartIndex = self.size() - pageSize;
      } else {
        // Slide back/forth and place the currently selected element in the middle of the viewport
        if (currentIndex >= viewportStartIndex + slidingThreshold) {
          viewportStartIndex += Math.abs(currentIndex - midpoint);

          if (viewportStartIndex > self.size() - pageSize) {
            viewportStartIndex = self.size() - pageSize;
          }
        } else if (currentIndex < viewportStartIndex + pageSize - slidingThreshold) {
          viewportStartIndex -= Math.abs(currentIndex - midpoint);

          if (viewportStartIndex < 0) {
            viewportStartIndex = 0;
          }
        } else {
          return;
        }
      }

      slideToIndex(viewportStartIndex);
    }

    function slideToIndex(index) {
      var position;

      if (index === 0) {
        // at the beginning
        position = 0;
      } else if (index >= self.size() - pageSize) {
        // on last page
        position = index * getItemWidth() - 2 * previewSize * getItemWidth();
      } else {
        // in the middle
        position = index * getItemWidth() - previewSize * getItemWidth();
      }

      slidingWindow.find('ul').animate({right: position}, animationSpeed);
    }

    self.on(constants.events.SELECTED, function (event, Component) {
      if (mode === "sliding") {
        slideToSelected();
      } 
   });

    if (mode === "paging") {
      // In paging mode, the next/previous events will cause scrolling one page at a time
      self.next = function () {
        pageRight();
      };
      self.previous = function () {
        pageLeft();
      };
      if (!(self instanceof Carousel)) {
        // If this a List, then hasNext will return if it has a next page or not
        self.hasNext = function () {
          return (this.index() + pageSize < this.size());
        };
      }
    }
  };

}

//Export to Common JS Loader
if (typeof module !== 'undefined') {
  if (typeof module.setExports === 'function') {
    module.setExports(viewportDecorator);
  } else if (module.exports) {
    module.exports = viewportDecorator;
  }
}
