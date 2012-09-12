function execute(){
  var ListA = $( '#A' ).lu( 'getComponent', 'List' ).instance,
    ListB = $( '#B' ).lu( 'getComponent', 'List' ).instance,
    ListC = $( '#C' ).lu( 'getComponent', 'List' ).instance,
    Watcher = $( '#watcher' ).lu( 'getComponent', 'Abstract' ).instance,
    selected = 'lu-state-selected';

  QUnit.module( 'Initial State' );

  QUnit.asyncTest( 'initialState', function(){
    expect( 6 );
    ok( ListA.current().$element.hasClass( selected ), 'ListA correctly sets state based on markup.' );
    ok( ListA.$items.index( ListA.current().$element ) === 0, 'ListA correctly sets index based on markup.' );
    ok( ListB.current().$element.hasClass( selected ), 'ListB correctly sets state based on markup.' );
    ok( ListB.$items.index( ListB.current().$element ) === 1, 'ListB correctly sets index based on markup.' );
    ok( ListC.current().$element.hasClass( selected ), 'ListC correctly sets state based on markup.' );
    ok( ListC.$items.index( ListC.current().$element ) === 2, 'ListC correctly sets index based on markup.' );
    start();
  } );

  QUnit.module( 'API Tests' );

  QUnit.asyncTest( 'index', function(){
    var index = ListA.$items.index( ListA.current().$element );
    expect( 2 );
    ok( ListA.index );
    ok( index === ListA.index(), 'Index is correct.' );
    start();
  } );

  QUnit.asyncTest( 'items', function(){
    expect( 3 );
    ok( ListA.items );
    ok( ListA.items() instanceof $ );
    ok( ListA.items().size() === 3 );
    start();
  } );

  QUnit.asyncTest( 'current', function(){
    expect( 3 );
    ok( ListA.current );
    ok( ListA.current() );
    ok( ListA.current().$element.hasClass( selected ) );
    start();
  } );

  QUnit.asyncTest( 'select', function(){
    expect( 7 );
    ok( ListA.select );
    ListA.select( 1 );
    ok( ListA.$items.index( ListA.current().$element ) === 1, 'ListA correctly selects item given an index.' );
    ok( ListA.current().$element.hasClass( selected ), 'ListA correctly applies selected state to selected item.' );
    ListA.select( '#A .larry' );
    ok( ListA.$items.index( ListA.current().$element ) === 0, 'ListA correctly selects item given a selector.' );
    ok( ListA.current().$element.hasClass( selected ), 'ListA correctly applies selected state to selected item.' );
    ListA.select( $( '#A .curly' ) );
    ok( ListA.$items.index( ListA.current().$element ) === 2, 'ListA correctly selects item given a jquery object.' );
    ok( ListA.current().$element.hasClass( selected ), 'ListA correctly applies selected state to selected item.' );
    start();
  } );

  QUnit.asyncTest( 'add', function(){
    var $shemp = $( '<li class="shemp">Shemp</li>' );
    expect( 2 );
    ok( ListB.add );
    ListB.add( $shemp );
    ok( ListB.$items.index( $shemp ) !== -1, 'item is correctly appended to ListB $items' );
    start();
  } );

  QUnit.asyncTest( 'remove', function(){
    var $curly = $( '#B .curly' );
    expect( 3 );
    ok( ListB.remove );
    ListB.remove( $curly );
    ok( ListB.$items.index( $curly ) === -1, 'item is correctly removed from ListB $items' );
    ok( true, 'R.I.P Jerome Lester \"Jerry\" Horwitz' );
    start();
  } );

  QUnit.asyncTest( 'first', function(){
    expect( 2 );
    ok( ListC.first );
    ListC.first();
    ok( ListC.current().$element.html() === 'Larry', 'ListC correctly sets selected item.' );
    start();
  } );

  QUnit.asyncTest( 'last', function(){
    expect( 2 );
    ok( ListC.last );
    ListC.last();
    ok( ListC.current().$element.html() === 'Curly', 'ListC correctly sets selected item.' );
    start();
  } );

  QUnit.asyncTest( 'previous', function(){
    expect( 3 );
    ListC.last();
    ok( ListC.previous );
    ListC.previous();
    ok( ListC.current().$element.html() === 'Moe', 'ListC correctly sets selected item.' );
    ok( ListC.index() === 1, 'ListC correctly sets index' );
    start();
  } );

  QUnit.asyncTest( 'next', function(){
    expect( 3 );
    ListC.first();
    ok( ListC.next );
    ListC.next();
    ok( ListC.current().$element.html() === 'Moe', 'ListC correctly sets selected item.' );
    ok( ListC.index() === 1, 'ListC correctly sets index' );
    start();
  } );

  QUnit.asyncTest( 'hasNext', function(){
    expect( 4 );
    ok( ListC.hasNext );
    ListC.last();
    ok( !ListC.hasNext(), 'ListC does not have a next item.' );
    ListC.previous();
    ok( ListC.hasNext(), 'ListC has a next item.' );
    ListC.previous();
    ok( ListC.hasNext(), 'ListC has a next item.' );
    start();
  } );

  QUnit.asyncTest( 'hasPrevious', function(){
    expect( 4 );
    ok( ListC.hasPrevious );
    ListC.first();
    ok( !ListC.hasPrevious(), 'ListC does not have a previous item.' );
    ListC.previous();
    ok( ListC.hasNext(), 'ListC has a next item.' );
    ListC.previous();
    ok( ListC.hasNext(), 'ListC has a next item.' );
    start();
  } );

  QUnit.asyncTest( 'size', function(){
    expect( 2 );
    ok( ListB.size );
    ok( ListB.size() === 3 );
    start();
  } );

  QUnit.module( 'Event Tests' );

  QUnit.asyncTest( 'outofbounds', function(){
    var index = ListA.$items.index( ListA.current().$element );
    expect( 5 );
    Watcher.one( 'out_of_bounds', function(){
      ok( true, 'event triggered when calling .next when hasNext returns false' );
    } );
    ListA.last().next();
    Watcher.one( 'out_of_bounds', function(){
      ok( true, 'event triggered when calling .previous when hasPrevious returns false' );
    } );
    ListA.first().previous();
    Watcher.one( 'out_of_bounds', function(){
      ok( true, 'event triggered when trying to select an index that only an idiot would select' );
    } );
    ListA.select( 8008135 );
    Watcher.one( 'out_of_bounds', function(){
      ok( true, 'event triggered when trying to select an index that only a zenmaster would select' );
    } );
    ListA.select( $( '#Im-the-illest-M.Fer-from-here-to-gardenia' ) );
    ListA.select( 8008135 );
    Watcher.one( 'out_of_bounds', function(){
      ok( true, 'event triggered when trying to select an index that only an ... would select' );
    } );
    ListA.select( '#Im-the-illest-M.Fer-from-here-to-gardenia' );
    start();
  } );

  QUnit.asyncTest( 'next', function(){
    expect( 1 );
    ok( ListA.first().trigger( 'next' ).index() === 1, 'event handled correctly' );
    start();
  } );

  QUnit.asyncTest( 'previous', function(){
    expect( 1 );
    ok( ListA.last().trigger( 'previous' ).index() === 1, 'event handled correctly' );
    start();
  } );

  QUnit.asyncTest( 'first', function(){
    expect( 1 );
    ok( ListA.last().trigger( 'first' ).index() === 0, 'event handled correctly' );
    start();
  } );

  QUnit.asyncTest( 'last', function(){
    expect( 1 );
    ok( ListA.first().trigger( 'last' ).index() === 2, 'event handled correctly' );
    start();
  } );

  QUnit.asyncTest( 'state', function(){
    expect( 1 );
    var first = ListA.first().current();
    ListA.next();
    first.setState( 'selected' );
    ok( ListA.index() === 0, 'event handled correctly' );
    start();
  } );

  QUnit.module( 'Statefulness' );

  QUnit.asyncTest( 'forward', function(){
    expect( 1 );
    ok( ListA.first().next().hasState( 'forward' ), 'correct state applied' );
    start();
  } );

  QUnit.asyncTest( 'reverse', function(){
    expect( 1 );
    ok( ListA.last().previous().hasState( 'reverse' ), 'correct state applied' );
    start();
  } );

}
