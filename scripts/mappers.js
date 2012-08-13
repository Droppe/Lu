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
  } );

  Lu.map( $LastButton, 'Button', function( $element, component ){
    component.settings.action = 'last';
  } );

  Lu.map( $LoadButton, 'Button', function( $element, component ){
    component.settings.action = 'load';
  } );

  Lu.map( $NextButton, 'Button', function( $element, component ){
    component.settings.action = 'next';
  } );

  Lu.map( $PauseButton, 'Button', function( $element, component ){
    component.settings.action = 'pause';
  } );

  Lu.map( $PlayButton, 'Button', function( $element, component ){
    component.settings.action = 'play';
  } );

  Lu.map( $PreviousButton, 'Button', function( $element, component ){
    component.settings.action = 'previous';
  } );

  Lu.map( $SelectButton, 'Button', function( $element, component ){
    component.settings.action = 'select';
  } );

  Lu.map( $StateButton, 'Button', function( $element, component ){
    component.settings.action = 'state';
  } );

  //Switch
  Lu.map( $Switch, 'Switch', function( $element, component ){} );

  //Container
  Lu.map( $Container, 'Container', function( $element, component ){} );

  //List
  Lu.map( $Switch, 'List', function( $element, component ){} );

}() );