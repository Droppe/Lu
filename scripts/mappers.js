//This file contains default mappings for Lu.
( function(){

  var $scope = $( window.LU_CONFIG.scope ),
    $lu = $scope.find( '[data-lu]' ).add( $scope.filter( '[data-lu]' ) ),
    //Buttons
    $buttons = $lu.find( 'a, button, input' ).filter( '[data-lu*=Button]' ),
    $defaultButton = $buttons.filter( '[data-lu~=Button]' ),
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

    //console.info( 'Scope:', $scope );
    //console.info( 'Number of Lu nodes:', $lu.length );

  //Buttons
  Lu.map( $defaultButton, 'Button', function( $element, component ){
    component.hasDependencies = true;
  } );

  Lu.map( $firstButton, 'Button', function( $element, component ){
    component.settings.action = 'first';
    component.key = 'Button:First';
    component.hasDependencies = true;
  } );
  Lu.map( $lastButton, 'Button', function( $element, component ){
    component.settings.action = 'last';
    component.key = 'Button:Last';
    component.hasDependencies = true;
  } );
  Lu.map( $loadButton, 'Button', function( $element, component ){
    component.settings.action = 'load';
    component.key = 'Button:Load';
    component.hasDependencies = true;
  } );
  Lu.map( $nextButton, 'Button', function( $element, component ){
    component.settings.action = 'next';
    component.key = 'Button:Next';
    component.hasDependencies = true;
  } );
  Lu.map( $pauseButton, 'Button', function( $element, component ){
    component.settings.action = 'pause';
    component.key = 'Button:Pause';
    component.hasDependencies = true;
  } );
  Lu.map( $playButton, 'Button', function( $element, component ){
    component.settings.action = 'play';
    component.key = 'Button:Play';
    component.hasDependencies = true;
  } );
  Lu.map( $previousButton, 'Button', function( $element, component ){
    component.settings.action = 'previous';
    component.key = 'Button:Previous';
    component.hasDependencies = true;
  } );
  Lu.map( $selectButton, 'Button', function( $element, component ){
    component.settings.action = 'select';
    component.key = 'Button:Select';
    component.hasDependencies = true;
  } );
  Lu.map( $stateButton, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.key = 'Button:State';
    component.hasDependencies = true;
  } );
  Lu.map( $stateButtonAdd, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'add';
    component.key = 'Button:State:Add';
    component.hasDependencies = true;
  } );
  Lu.map( $stateButtonRemove, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'remove';
    component.key = 'Button:State:Remove';
    component.hasDependencies = true;
  } );
  Lu.map( $stateButtonReset, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'reset';
    component.key = 'Button:State:Reset';
    component.hasDependencies = true;
  } );
  Lu.map( $stateButtonClear, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'clear';
    component.key = 'Button:State:Clear';
    component.hasDependencies = true;
  } );

  //Switch
  Lu.map( $switch, 'Switch', function( $element, component ){} );

  //Container
  Lu.map( $container, 'Container', function( $element, component ){} );

  //List
  Lu.map( $list, 'List', function( $element, component ){} );

  //Carousel
  Lu.map( $carousel, 'Carousel', function( $element, component ){} );

}() );