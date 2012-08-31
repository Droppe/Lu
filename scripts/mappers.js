//This file contains default mappings for Lu.
$( function(){

  //console.time( 'Selectors Execution Timer' );
  var $scope = $( window.LU_CONFIG.scope ),
    $lu = $scope.find( '[data-lu]' ).add( $scope.filter( '[data-lu]' ) ),
    //Buttons
    $buttons = $lu.find( 'a, button, input' ).filter( '[data-lu*=Button]' ),
    $firstButton = $buttons.filter( '[data-lu~=\'Button:First\']' ),
    $lastButton = $buttons.filter( '[data-lu~=\'Button:Last\']' ),
    $loadButton = $buttons.filter( '[data-lu~=\'Button:Load\']' ),
    $nextButton = $buttons.filter( '[data-lu~=\'Button:Next\']' ),
    $pauseButton = $buttons.filter( '[data-lu~=\'Button:Pause\']' ),
    $playButton = $buttons.filter( '[data-lu~=\'Button:Play\']' ),
    $previousButton = $buttons.filter( '[data-lu~=\'Button:Previous\']' ),
    $selectButton = $buttons.filter( '[data-lu~=\'Button:Select\']' ),
    $stateButton = $buttons.filter( '[data-lu~=\'Button:State\']' ),
    $stateButtonAdd = $buttons.filter( '[data-lu~=\'Button:State:Add\']' ),
    $stateButtonRemove = $buttons.filter( '[data-lu~=\'Button:State:Remove\']' ),
    $stateButtonClear = $buttons.filter( '[data-lu~=\'Button:State:Clear\']' ),
    $stateButtonReset = $buttons.filter( '[data-lu~=\'Button:State:Reset\']' ),
    //Switch
    $switch = $lu.filter( '[data-lu~=Switch]' ),
    //Container
    $container = $lu.filter( '[data-lu~=Container]' ),
    //List
    $list = $lu.filter( '[data-lu~=List]' ),
    //Carousel
    $carousel = $lu.filter( '[data-lu~=Carousel]' );

  // console.timeEnd( 'Selectors Execution Timer' );

  // console.time( 'Mappers Execution Timer' );
  // console.profile();
  //Buttons
  Lu.map( $firstButton, 'Button', function( $element ){
    this.settings.action = 'first';
    this.key = 'Button:First';
    this.hasDependencies = true;
  } );
  Lu.map( $lastButton, 'Button', function( $element ){
    this.settings.action = 'last';
    this.key = 'Button:Last';
    this.hasDependencies = true;
  } );
  Lu.map( $loadButton, 'Button', function( $element ){
    this.settings.action = 'load';
    this.key = 'Button:Load';
    this.hasDependencies = true;
  } );
  Lu.map( $nextButton, 'Button', function( $element ){
    this.settings.action = 'next';
    this.key = 'Button:Next';
    this.hasDependencies = true;
  } );
  Lu.map( $pauseButton, 'Button', function( $element ){
    this.settings.action = 'pause';
    this.key = 'Button:Pause';
    this.hasDependencies = true;
  } );
  Lu.map( $playButton, 'Button', function( $element ){
    this.settings.action = 'play';
    this.key = 'Button:Play';
    this.hasDependencies = true;
  } );
  Lu.map( $previousButton, 'Button', function( $element ){
    this.settings.action = 'previous';
    this.key = 'Button:Previous';
    this.hasDependencies = true;
  } );
  Lu.map( $selectButton, 'Button', function( $element ){
    this.settings.action = 'select';
    this.key = 'Button:Select';
    this.hasDependencies = true;
  } );
  Lu.map( $stateButton, 'Button', function( $element ){
    this.settings.action = 'state';
    this.key = 'Button:State';
    this.hasDependencies = true;
  } );
  Lu.map( $stateButtonAdd, 'Button', function( $element ){
    this.settings.action = 'state';
    this.settings.method = 'add';
    this.key = 'Button:State:Add';
    this.hasDependencies = true;
  } );
  Lu.map( $stateButtonRemove, 'Button', function( $element ){
    this.settings.action = 'state';
    this.settings.method = 'remove';
    this.key = 'Button:State:Remove';
    this.hasDependencies = true;
  } );
  Lu.map( $stateButtonReset, 'Button', function( $element ){
    this.settings.action = 'state';
    this.settings.method = 'reset';
    this.key = 'Button:State:Reset';
    this.hasDependencies = true;
  } );
  Lu.map( $stateButtonClear, 'Button', function( $element ){
    this.settings.action = 'state';
    this.settings.method = 'clear';
    this.key = 'Button:State:Clear';
    this.hasDependencies = true;
  } );

  //Switch
  Lu.map( $switch, 'Switch', function( $element ){} );

  //Container
  Lu.map( $container, 'Container', function( $element ){} );

  //List
  Lu.map( $list, 'List', function( $element ){} );

  //Carousel
  Lu.map( $carousel, 'Carousel', function( $element ){} );
  // console.profileEnd();
  // console.timeEnd( 'Mappers Execution Timer' );
} );