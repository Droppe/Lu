//This file contains default mappings for Lu.
( function(){

  console.time( 'Mappers Execution Timer' );
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
    $StateButtonToggle = $( '[data-lu~=\'Button:State:Toggle\']' ),
    $StateButtonClear = $( '[data-lu~=\'Button:State:Clear\']' ),
    $StateButtonReset = $( '[data-lu~=\'Button:State:Reset\']' ),
    $StateButtonRemove = $( '[data-lu~=\'Button:State:Remove\']' ),
    //Switch
    $Switch = $( '[data-lu~=Switch]' ),
    //Container
    $Container = $( '[data-lu~=Container]' ),
    //List
    $List = $( '[data-lu~=List]' );

  //Buttons
  Lu.map( $DefaultButton, 'Button', function( $element, component ){} );

  Lu.map( $FirstButton, 'Button', function( $element, component ){
    component.settings.action = 'first';
    component.key = 'Button:First';
  } );
  Lu.map( $LastButton, 'Button', function( $element, component ){
    component.settings.action = 'last';
    component.key = 'Button:Last';
  } );
  Lu.map( $LoadButton, 'Button', function( $element, component ){
    component.settings.action = 'load';
    component.key = 'Button:Load';
  } );
  Lu.map( $NextButton, 'Button', function( $element, component ){
    component.settings.action = 'next';
    component.key = 'Button:Next';
  } );
  Lu.map( $PauseButton, 'Button', function( $element, component ){
    component.settings.action = 'pause';
    component.key = 'Button:Pause';
  } );
  Lu.map( $PlayButton, 'Button', function( $element, component ){
    component.settings.action = 'play';
    component.key = 'Button:Play';
  } );
  Lu.map( $PreviousButton, 'Button', function( $element, component ){
    component.settings.action = 'previous';
    component.key = 'Button:Previous';
  } );
  Lu.map( $SelectButton, 'Button', function( $element, component ){
    component.settings.action = 'select';
    component.key = 'Button:Select';
  } );
  Lu.map( $StateButton, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.key = 'Button:State';
  } );
  Lu.map( $StateButtonAdd, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'add';
    component.key = 'Button:State:Add';
  } );
  Lu.map( $StateButtonRemove, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'remove';
    component.key = 'Button:State:Remove';
  } );
  Lu.map( $StateButtonToggle, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'toggle';
    component.key = 'Button:State:Toggle';
  } );
  Lu.map( $StateButtonReset, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'reset';
    component.key = 'Button:State:Reset';
  } );
  Lu.map( $StateButtonClear, 'Button', function( $element, component ){
    component.settings.action = 'state';
    component.settings.method = 'clear';
    component.key = 'Button:State:Clear';
  } );

  //Switch
  Lu.map( $Switch, 'Switch', function( $element, component ){} );

  //Container
  Lu.map( $Container, 'Container', function( $element, component ){} );

  //List
  Lu.map( $List, 'List', function( $element, component ){} );

  console.timeEnd( 'Mappers Execution Timer' );

}() );