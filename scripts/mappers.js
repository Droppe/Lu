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
  };

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
  var Mapper = Lu.DefaultMapper = new Lu.Mapper();

  //Generic Mappers
  _.each( ['Switch', 'List', 'Carousel', 'Container', 'Button'], function( id, index ){
    Mapper.register( function(){
      Lu.map( _.filter( Mapper.$scope, function( item, index ){
        return ( item.getAttribute( 'data-lu' ).indexOf( id ) > -1 );
      } ), id );
    } );
  } );

  // Coalesce the Viewport decorator for List/Carousel into one mapper function.
  Mapper.register( function () {
    var components = ['List', 'Carousel'];
    var decorator = 'Viewport';
    _.each(components, function (component) {
      var key = component + ':' + decorator;
      Lu.map(_.filter(Mapper.$scope, function (item) {
        return ( item.getAttribute('data-lu').indexOf(key) > -1 );
      }), component, function () {
        this.hasDependencies = true;
        // Default configs
        this.settings.viewport = {
          mode:'sliding',
          pageSize:5,
          threshold:0.8,
          previewSize:0.25
        };
      });
    });
  });

  // Coalesce the buttons into one mapper function, because we care about performance,
  // saving bytes, and abhor redundancy.
  _.each( ['select', 'first', 'last', 'next', 'previous', 'load', 'play', 'pause', 'state'], function( action ) {

    Mapper.register( function(){
      var key = 'Button:' + action.charAt( 0 ).toUpperCase() + action.substring( 1 );
      Lu.map( _.filter( Mapper.$scope, function( item ){
        return ( item.getAttribute( 'data-lu' ).indexOf( key ) > -1 );
      } ), 'Button', function(){
        this.settings.action = action;
        this.key = key;
        this.hasDependencies = true;
      } );
    } );
  } );


  Mapper.register( function(){
    var key = 'Tip';
    Lu.map( _.filter( Mapper.$scope, function( item ){
      return ( _.indexOf( item.getAttribute( 'data-lu' ).split( ' ' ), key ) > -1 );
    } ), 'Tip', function(){
      this.settings.placement = 'Right';
      this.key = key;
      this.hasDependencies = true;
    } );
  } );

  _.each( ['Above', 'Below', 'Left', 'Right'], function( placement ) {
    Mapper.register( function(){
      var key = 'Tip:' + placement;
      Lu.map( _.filter( Mapper.$scope, function( item ){
        return ( _.indexOf( item.getAttribute( 'data-lu' ).split( ' ' ), key ) > -1 );
      } ), 'Tip', function(){
        this.settings.placement = placement;
        this.key = key;
        this.hasDependencies = true;
      } );
    } );
  } );

  //Placeholder
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Placeholder' ) > -1 &&
             ( item.nodeName === 'INPUT' || item.nodeName === 'TEXTAREA' ) &&
             item.getAttribute( 'placeholder' ) );
    } ), 'Placeholder' );
  } );

  //Dropdown
  Mapper.register( function(){
    Lu.map( _.filter( Mapper.$scope, function( item, index ){
      return ( item.getAttribute( 'data-lu' ).indexOf( 'Dropdown' ) > -1 );
    } ), 'Dropdown' );
  } );

  //Execute Default Mappers
  Mapper.execute();

}() );
