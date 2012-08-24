var accordionDecorator = function () {
  
  var SELECTED_STATE = 'selected';
  
  return function( instance ){

    /**
     * Handles the core list-item selection within a list
     * @method selectEngine
     * @private
     * @param {Number} index The current List index
     * @param {Object} $item JQuery collection for the selected list item
     * @param {Object} Container The item's Container instance
     * @param {Object} Selected The current-selected Container instance
     * @param {Object} Previous The previously selected Container instance
     * @return {Array} Array containing the new index, selected item, 
     * newly-selected Container, and previously-selected Container
     */
    instance.selectEngine = function (index, $item, Container, Selected, Previous) {

      

      if ( Container === Selected ) {
        Container.removeState( SELECTED_STATE );
      }
      else {
        Container.addState( SELECTED_STATE );        
      }

      Previous = Selected;
      Selected = Container;

      index = this.$items.index( $item );

      return [index, $item, Selected, Previous];
    };

  };
};

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( accordionDecorator() );
  } else if( module.exports ){
   module.exports = accordionDecorator();
  }
}