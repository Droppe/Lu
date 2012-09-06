var constants = require( 'lu/constants' );

/**
 * @method first
 * @private
 */
function windowDecorator( settings ) {

  return function( base ){
    var self = this;

    var slidingWindow = this.$element;

    var pageSize = 3;
    var currentOffset = 0;
    
    function getPageWidth() {
      var pageWidth = getItemWidth() * pageSize;
      return pageWidth;
    }
    
    function getPageIndex() {
        return currentOffset/getPageWidth();
    }
    
    function getItemWidth() {
        return $('#list li').outerWidth(true);
    }
    
    function getNumTotalItems() {
        return $('#list li').size();
    }
    
    function getNumRightItems() {
        return getNumTotalItems() - getPageIndex()*pageSize - pageSize;               
    }
    
    function getNumLeftItems() {
        return getPageIndex()*pageSize;       
    }
    
    function changeButtonState() {
        
        if(getNumRightItems() === 0)
            $('#next').attr('disabled', '');
        else
            $('#next').removeAttr('disabled');
        
        if(getNumLeftItems() === 0)
            $('#previous').attr('disabled', '');
        else
            $('#previous').removeAttr('disabled');
    }

    function slide(direction) {
        
        if (direction === 'next' && getNumRightItems() >= pageSize) {
           var pageWidth = getPageWidth();
           currentOffset += pageWidth; 
     
           self.select(self.index() + pageSize);
        } else if (direction === 'next' && getNumRightItems() > 0 && getNumRightItems() < pageSize) { 
          var nextIdx =  parseInt(getNumRightItems()) + parseInt(self.index());
           currentOffset += getNumRightItems()*getItemWidth();
           
           self.select(nextIdx);         
        } else if (direction === 'previous' && getNumLeftItems() >= pageSize) {
           currentOffset -= getPageWidth();

           self.select(self.index() - pageSize);
        } else if (direction === 'previous' && getNumLeftItems() > 0 && getNumLeftItems() < pageSize) {
           var prevIdx = self.index() - getNumLeftItems();
           currentOffset -= getNumLeftItems()*getItemWidth();
           console.log('Num item left: ' + getNumLeftItems());
           self.select(prevIdx);
        }
        
        changeButtonState();
               
        $('#list:not(:animated)').animate({right: currentOffset}, 500);
    };
    
    changeButtonState();
    $(slidingWindow).width(getPageWidth());
    $("#nextPage").click(function(){slide('next');});
    $("#previousPage").click(function(){slide('previous');});
    
    self.on( constants.events.NEXT, function( event, Component ){
      event.stopPropagation();
      console.log('NEXT');
      slide('next');
    } );

    self.on( constants.events.PREVIOUS, function( event, Component ){
      event.stopPropagation();
      console.log('PREVIOUS');
      slide('previous');
    } );

    self.next = function() {};
    self.previous = function() {};
  };

}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( windowDecorator );
  } else if( module.exports ){
    module.exports = windowDecorator;
  }
}
