( function(){

  var Mapper = function(){
    
  }

  Mapper.register( function(){
    var $switch = _.filter( this.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Switch' ) !== -1 ) ? true : false;
    } );
    Lu.map( $switch, 'Switch', function( $element ){} );
  } );

  // Mapper.register( function(){
  //   var ButtonMapper,
  //     $scope = _.filter( this.$scope, function( item, index ){
  //     var nodeName = item.nodeName;
  //     if( nodeName === 'A' || nodeName === 'BUTTON' || nodeName === 'INPUT' ){
  //       return item.getAttribute( 'data-lu' ).indexOf( 'Button' ) !== -1 ) ? true : false;
  //     }
  //     return false;
  //   }

  //   Mappers.
  //   Lu.map( $stateButton, 'Button', function( $element ){
  //     this.settings.action = 'state';
  //     this.key = 'Button:State';
  //     this.hasDependencies = true;
  //   } );

  // } );

  // var $stateButton =  $buttons.filter( function( index, item ){
  //   return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:State' ) !== -1 ) ? true : false;
  // } );

}() );