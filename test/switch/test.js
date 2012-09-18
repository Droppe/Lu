function execute(){
  var Switch = $( '#switch' ).lu( 'getComponents' ).Switch.instance,
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
    ok( Switch.setState( funky ), 'Setting first state.' );
    ok( Switch.addState( cold ), 'Adding second state.' );
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
}
