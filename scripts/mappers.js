( function(){

  /**
   * Mappers are used to store a scope of a DOM tree
   * to map and a registry of mappers to execute
   * @class Mapper
   * @constructor
   */
  Lu.Mapper = function(){
    var scope = window.LU_CONFIG.scope || document;
    this.$scope = undefined;
    this.maps = [];
    this.setScope( scope );
  }

  /**
   * Sets the scope to use when mapping components to nodes
   * @public
   * @method setScoped
   * @param {*} scope This can be an HTML Element, 
   * an array of elements, a selector string or a jquery object
   * @return this
   */
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

  /**
   * Gets a jquery object containing all Lu decorated nodes
   * @public
   * @method setScoped
   * @return a jquery object
   */
  Lu.Mapper.prototype.getScope = function(){
    return this.$scope;
  };

  /**
   * Registers a mapper to be executed later
   * @public
   * @method register
   * @param {Function} map A function mapper to be called
   * @return this
   */
  Lu.Mapper.prototype.register = function( map ){
    this.maps.unshift( map );
    return this;
  };

  /**
   * Executes all registered maps
   * @public
   * @method execute
   * @return this
   */
  Lu.Mapper.prototype.execute = function(){
    _.each( this.maps, function( item, index ){
      item.call();
    } );
  };


  //Create a new Mapper to contain default mappings for Lu.
  var Mapper = new Lu.Mapper();

  //Generic Mappers
  _.each( ['Switch', 'List', 'Carousel', 'Container'], function( id, index ){
    Mapper.register( function(){
      Lu.map( _.filter( Mapper.$scope, function( item, index ){
        return ( item.getAttribute( 'data-lu' ).indexOf( id ) > -1 );
      } ), id );
    } );
  } );

  //Select Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:Select' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'select';
      this.key = 'Button:Select';
      this.hasDependencies = true;
    } );
  } );

  //First Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:First' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'first';
      this.key = 'Button:First';
      this.hasDependencies = true;
    } );
  } );

  //Last Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:Last' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'last';
      this.key = 'Button:Last';
      this.hasDependencies = true;
    } );
  } );

  //Load Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:Load' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'load';
      this.key = 'Button:Load';
      this.hasDependencies = true;
    } );
  } );

  //First Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:First' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'first';
      this.key = 'Button:First';
      this.hasDependencies = true;
    } );
  } );

  //Next Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:Next' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'next';
      this.key = 'Button:Next';
      this.hasDependencies = true;
    } );
  } );

  //Pause Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:Pause' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'pause';
      this.key = 'Button:Pause';
      this.hasDependencies = true;
    } );
  } );

  //Play Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:Play' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'play';
      this.key = 'Button:Play';
      this.hasDependencies = true;
    } );
  } );

  //Previous Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:Previous' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'previous';
      this.key = 'Button:Previous';
      this.hasDependencies = true;
    } );
  } );

  //State Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:State' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'state';
      this.key = 'Button:State';
      this.hasDependencies = true;
    } );
  } );

  //State Button
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Button:State' ) > -1 );
    } ), 'Button', function(){
      this.settings.action = 'state';
      this.key = 'Button:State';
      this.hasDependencies = true;
    } );
  } );
  //console.time( 'Mappers Execution Timer' );
  //Execute Default Mappers
  Mapper.execute();
  //console.timeEnd( 'Mappers Execution Timer' );

}() );