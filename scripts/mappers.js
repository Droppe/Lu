//This file contains default mappings for Lu.
( function(){

  var
    //Buttons
    $DefaultButton = $( '[data-lu~=Button]' ),
    $FirstButton = $( '[data-lu~=\'Button:First\']' ),
    $LastButton = $( '[data-lu~=\'Button:Last\']' ),
    $LoadButton = $( '[data-lu~=\'Button:Load\']' ),
    $NextButton = $( '[data-lu~=\'Button:Next\']' ),
    $PauseButton = $( '[data-lu~=\'Button:Pause\']' ),
    $PlayButton = $( '[data-lu~=\'Button:Play\']' ),
    $PreviousButton = $( '[data-lu~=\'Button:Previous\']' ),
    $SelectButton = $( '[data-lu~=\'Button:Select\']' ),
    $StateButton = $( '[data-lu~=\'Button:State\']' ),
    $StateButtonAdd = $( '[data-lu~=\'Button:State:Add\']' ),
    $StateButtonRemove = $( '[data-lu~=\'Button:State:Remove\']' ),
    $StateButtonClear = $( '[data-lu~=\'Button:State:Clear\']' ),
    $StateButtonReset = $( '[data-lu~=\'Button:State:Reset\']' ),
    $StateButtonRemove = $( '[data-lu~=\'Button:State:Remove\']' ),
    //Switch
    $Switch = $( '[data-lu~=Switch]' ),
    //Container
    $Container = $( '[data-lu~=Container]' ),
    //List
    $List = $( '[data-lu~=List]' ),
    //Carousel
    $Carousel = $( '[data-lu~=Carousel]' );

  //Buttons
  Lu.map( $DefaultButton, 'Button', function( $element, component ){
    component.hasDependencies = true;
  } );

  Lu.map( $FirstButton, 'Button', function( $element, component ){
    component.settings.action = 'first';
    component.key = 'Button:First';
    component.hasDependencies = true;
  } );
  Lu.map( $LastButton, 'Button', function( $element, component ){
    component.settings.action = 'last';
    component.key = 'Button:Last';
    component.hasDependencies = true;
  } );
  Lu.map( $LoadButton, 'Button', function( $element, component ){
    component.settings.action = 'load';
    component.key = 'Button:Load';
    component.hasDependencies = true;
  } );
  Lu.map( $NextButton, 'Button', function( $element, component ){
    component.settings.action = 'next';
    component.key = 'Button:Next';
    component.hasDependencies = true;
  } );
  Lu.map( $PauseButton, 'Button', function( $element, component ){
    component.settings.action = 'pause';
    component.key = 'Button:Pause';
    component.hasDependencies = true;
  } );
  Lu.map( $PlayButton, 'Button', function( $element, component ){
    component.settings.action = 'play';
    component.key = 'Button:Play';
    component.hasDependencies = true;
  } );
  Lu.map( $PreviousButton, 'Button', function( $element, component ){
    component.settings.action = 'previous';
    component.key = 'Button:Previous';
    component.hasDependencies = true;
  } );
  Lu.map( $SelectButton, 'Button', function( $element, component ){
    component.settings.action = 'select';
    component.key = 'Button:Select';
    component.hasDependencies = true;
  } );
  Lu.map( $StateButton, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.key = 'Button:State';
    component.hasDependencies = true;
  } );
  Lu.map( $StateButtonAdd, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'add';
    component.key = 'Button:State:Add';
    component.hasDependencies = true;
  } );
  Lu.map( $StateButtonRemove, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'remove';
    component.key = 'Button:State:Remove';
    component.hasDependencies = true;
  } );
  Lu.map( $StateButtonReset, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'reset';
    component.key = 'Button:State:Reset';
    component.hasDependencies = true;
  } );
  Lu.map( $StateButtonClear, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'clear';
    component.key = 'Button:State:Clear';
    component.hasDependencies = true;
  } );

  //Switch
  Lu.map( $Switch, 'Switch', function( $element, component ){} );

  //Container
  Lu.map( $Container, 'Container', function( $element, component ){} );

  //List
  Lu.map( $List, 'List', function( $element, component ){} );

  //Carousel
  Lu.map( $Carousel, 'Carousel', function( $element, component ){} );

}() );