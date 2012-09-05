//This file contains default mappings for Lu.
$( function(){

  Lu.Mapper = function(){
    var scope = window.LU_CONFIG.scope || document;
    this.$scope = undefined;
    this.maps = [];
    this.setScope( scope );
  }

  Lu.Mapper.prototype.setScope = function( scope ){
    var $scope;

    function filter( item, index ){
      var lu = item.getAttribute( 'data-lu' );
      return ( lu !== null && lu !== '' );
    }

    if( scope instanceof $ ){
      $scope = scope.find( '[data-lu]' ).add( _.filter( scope, filter ) );
    } else if( scope.getElementsByTagName ){
      $scope = $( _.filter( scope.getElementsByTagName( '*' ), filter ) );
    } else {
      $scope = $( scope );
      $scope = $scope.find( '[data-lu]' ).add( _.filter( $scope, filter ) );
    }

    this.$scope = $scope;
    return this;
  };

  Lu.Mapper.prototype.getScope = function(){
    return this.$scope;
  };

  Lu.Mapper.prototype.register = function( map ){
    this.maps.unshift( map );
    return this;
  };

  Lu.Mapper.prototype.execute = function( map ){
    _.each( this.maps, function( item, index ){
      item.call();
    } );
  };

  var Mapper,
    ids = ['Switch', 'List', 'Carousel', 'Container', 'Button:State'];

  Mapper = new Lu.Mapper();

  _.each( ids, function( id, index ){
    Mapper.register( function(){
      Lu.map( _.filter( Mapper.$scope, function( item, index ){
        return ( item.getAttribute( 'data-lu' ).indexOf( id ) > -1 );
      } ), id );
    } );
  } );

  Mapper.execute();

} );