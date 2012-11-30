function execute(){
  var Switch = $( '#switch' ).lu( 'getComponents' ).Switch.instance,
    $setFunkyButton = $( '#set-funky-button' ),
    $setColdButton = $( '#set-cold-button' ),
    $toggleFunkyColdButton = $( '#toggle-funky-cold-button' ),
    $addMedinaButton = $( '#add-medina-button' ),
    $removeFunkyButton = $( '#remove-funky-button' ),
    $clearButton = $( '#clear-button' ),
    $resetButton = $( '#reset-button' ),
    funky = 'lu-state-funky',
    cold = 'lu-state-cold',
    medina = 'lu-state-medina';

  QUnit.module( 'Initial State' );

  QUnit.asyncTest( 'initialState', function(){
    expect( 1 );
    ok( Switch.$element.hasClass( funky ), 'Switch correctly sets state based on markup.' );
    start();
  } );

  QUnit.module( 'API Tests' );

  QUnit.asyncTest( 'setState', function(){
    expect( 4 );
    ok( Switch.setState( 'funky' ), 'Setting initial state.' );
    ok( Switch.setState( 'cold' ), 'Setting new state.' );
    ok( Switch.$element.hasClass( cold ), 'New state is added.' );
    ok( !Switch.$element.hasClass( funky ), 'Initial state is removed.' );
    start();
  } );

  QUnit.asyncTest( 'addState', function(){
    expect( 4 );
    ok( Switch.setState( 'cold' ), 'Setting initial state.' );
    ok( Switch.addState( 'medina' ), 'Adding new state.' );
    ok( Switch.$element.hasClass( medina ), 'New state is added.' );
    ok( Switch.$element.hasClass( cold ), 'Initial state remains.' );
    start();
  } );

  QUnit.asyncTest( 'removeState', function(){
    expect( 5 );
    ok( Switch.setState( 'cold' ), 'Setting initial state.' );
    ok( Switch.addState( 'medina' ), 'Adding second state.' );
    ok( Switch.removeState( 'cold' ), 'Removing state.' );
    ok( !Switch.$element.hasClass( cold ), 'Initial state removed.' );
    ok( Switch.$element.hasClass( medina ), 'Second state remains.' );
    start();
  } );

  QUnit.asyncTest( 'hasState', function(){
    expect( 3 );
    ok( Switch.setState( 'medina' ), 'Setting state' );
    ok( Switch.hasState( 'medina' ) === true, 'Switch says it has state.' );
    ok( Switch.$element.hasClass( medina ), 'Switch really has state.' );
    start();
  } );

  QUnit.asyncTest( 'getState', function(){
    expect( 5 );
    ok( Switch.setState( 'funky' ), 'Setting first state.' );
    ok( Switch.addState( 'cold' ), 'Adding second state.' );
    ok( Switch.addState( 'medina' ), 'Adding third state.' );
    ok( _.intersection(Switch.getState(), ['funky','cold','medina']).length === 3, 'Got all of the switches states.' );
    ok( _.difference(Switch.getState(), ['funky','cold','medina']).length === 0, 'And no additional values.' );
    start();
  } );

  QUnit.asyncTest( 'clear', function(){
    expect( 5 );
    ok( Switch.setState( 'funky' ), 'Setting first state.' );
    ok( Switch.addState( 'cold' ), 'Adding second state.' );
    ok( Switch.clear(), 'Clearing states.' );
    ok( !Switch.$element.hasClass( funky ), 'First state cleared.' );
    ok( !Switch.$element.hasClass( cold ), 'Second state cleared.' );
    start();
  } );

  QUnit.asyncTest( 'reset', function(){
    expect( 2 );
    ok( Switch.reset() );
    ok( Switch.$element.hasClass( funky ), 'State reset.' );
    start();
  } );

  /*
  QUnit.module( 'Button Tests' );

  QUnit.asyncTest( 'set state using button', function(){
    expect( 5 );
    ok( Switch.setState( 'funky' ), 'Setting initial state' );
    ok( Switch.removeState( 'funky' ), 'Removing state in preparation for set' );
    ok( !Switch.hasState( 'funky' ), 'Confirming state removed' );
    ok( $setFunkyButton.click(), 'Setting state with button' );
    ok( Switch.hasState( 'funky' ), 'Confirming state has been added by button' );
    start();
  } );

  QUnit.asyncTest( 'toggle state using button', function(){
    expect( 4 );
    ok( Switch.setState( 'funky' ), 'Setting first state' );
    ok( $toggleFunkyColdButton.click(), 'Toggling state using button' );
    ok( Switch.hasState( 'cold' ), 'Confirming second state added' );
    ok( !Switch.hasState( 'funky' ), 'Confirming first state removed' );
    start();
  } );

  QUnit.asyncTest( 'add state using button', function(){
    expect( 4 );
    ok( Switch.setState( 'cold' ), 'Setting first state' );
    ok( $addMedinaButton.click(), 'Adding second state with button' );
    ok( Switch.hasState( 'cold' ), 'Confirming first state still set' );
    ok( Switch.hasState( 'medina' ), 'Confirming second state added' );
    start();
  } );

  QUnit.asyncTest( 'remove state using button', function(){
    expect( 3 );
    ok( Switch.setState( 'funky' ), 'Setting initial state' );
    ok( $removeFunkyButton.click(), 'Removing state with button' );
    ok( !Switch.hasState( 'funky' ), 'Confirming state removed' );
    start();
  } );

  QUnit.asyncTest( 'clear states using button', function(){
    expect( 7 );
    ok( Switch.setState( 'funky' ), 'Setting first state' );
    ok( Switch.addState( 'cold' ), 'Setting second state' );
    ok( Switch.addState( 'medina' ), 'Setting third state' );
    ok( $clearButton.click(), 'Clearing states with button' );
    ok( !Switch.hasState( 'funky' ), 'Confirming first state cleared' );
    ok( !Switch.hasState( 'cold' ), 'Confirming second state cleared' );
    ok( !Switch.hasState( 'medina' ), 'Confirming third state cleared' );
    start();
  } );

  QUnit.asyncTest( 'reset state using button', function(){
    expect( 3 );
    ok( $setColdButton.click(), 'Setting alternative state with button' ); //Needs to be set with button to activate remove button in actual browsers
    ok( $resetButton.click(), 'Resetting initial state with button' );
    ok( Switch.hasState( 'funky' ), 'Confirming initial state restored' );
    start();
  } );
*/
}
