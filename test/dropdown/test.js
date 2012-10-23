function execute(){
  var $A = $( '#A' ),
      DropdownA = $A.lu( 'getComponent', 'Dropdown' ).instance,
      $btnA = DropdownA.$stateButton,
      label = 'Choose...',
      aState = 'active',
      iState = 'inactive';

  DropdownA.one( 'stated', function( evt, instance ){
    if( instance.$element[0] === $A[0] ){

      QUnit.module( 'Initial State' );

      QUnit.asyncTest( 'initialState', function(){
        expect( 3 );

        ok( DropdownA.getState()[0] === iState, 'Initial state is inactive.' );
        ok( DropdownA.listInstance.index() === 0, 'Initial selected item is at index 0.' );
        ok( $btnA.text() === label, 'Initial label is text is Choose...' );

        start();
      } );


      QUnit.module( 'API Tests' );

      QUnit.asyncTest( 'expand', function(){
        expect( 3 );

        ok( DropdownA.expand );
        DropdownA.expand();
        ok( DropdownA.getState()[0] === aState, 'DropdownA has active state.' );
        ok( $A.hasClass( 'lu-state-active' ), 'DropdownA is currently expanded.' );

        DropdownA.collapse();
        start();
      } );

      QUnit.asyncTest( 'collapse', function(){
        expect( 3 );

        DropdownA.expand();
        ok( DropdownA.collapse );
        DropdownA.collapse();
        ok( DropdownA.getState()[0] === iState, 'DropdownA has inactive state.' );
        ok( $A.hasClass( 'lu-state-inactive' ), 'DropdownA is currently collapsed.' );

        start();
      } );

      QUnit.asyncTest( 'resetList', function(){
        expect( 3 );

        ok( DropdownA.resetList );
        DropdownA.expand();

        DropdownA.listInstance.select( 2 );
        ok( DropdownA.listInstance.index() === 2, 'Dropdown should have 3rd list item selected at index 2.' );

        DropdownA.resetList();

        ok( DropdownA.listInstance.index() === 0, 'DropdownA was successfully reset.' );
        DropdownA.collapse();

        start();
      } );

      QUnit.asyncTest( 'getValue', function(){
        expect( 3 );

        ok( DropdownA.getValue );
        DropdownA.listInstance.select( 3 );
        ok( DropdownA.listInstance.index() === 3, 'DropdownA should have the 4th list item selected at index 3.' );
        ok( DropdownA.getValue() === 'D', 'DropdownA has the value of D.' );
        DropdownA.listInstance.select( 0 );

        start();
      } );


      QUnit.module( 'Event Tests' );

      QUnit.asyncTest( 'State Button Active State', function(){
        expect( 2 );

        ok( DropdownA.getState()[0] === iState, 'DropdownA initial state is inactive.' );
        DropdownA.one( 'stated', function(){
          ok( DropdownA.getState()[0] === aState, 'DropdownA is active after State Button click.' );
          DropdownA.collapse();
          start();
        } );
        
        $btnA.trigger( 'click' );
      } );

      QUnit.asyncTest( 'State Button Inactive State', function(){
        expect( 2 );

        DropdownA.expand();
        ok( DropdownA.getState()[0] === aState, 'DropdownA initial state is active.' );

        DropdownA.one( 'stated', function(){
          ok( DropdownA.getState()[0] === iState, 'DropdownA is inactive after State Button click.' );
          start();
        } );
        
        $btnA.trigger( 'click' );
      } );

      QUnit.asyncTest( 'Enter Key State', function(){
        var event = $.Event( 'keydown' );
        event.keyCode = 13;

        expect( 2 );
        ok( DropdownA.getState()[0] === iState, 'DropdownA initial state is collapsed.' );

        DropdownA.one( 'stated', function(){
          ok( DropdownA.getState()[0] === aState, 'Enter key expands dropdown.' );
          DropdownA.collapse();
          start();
        } );
        
        $A.trigger( event );
      } );

      QUnit.asyncTest( 'Arrow Key Up State', function(){
        var event = $.Event( 'keydown' );
        event.keyCode = 38;

        expect( 2 );
        ok( DropdownA.getState()[0] === iState, 'DropdownA initial state is collapsed.' );

        DropdownA.one( 'stated', function(){
          ok( DropdownA.getState()[0] === aState, 'Up key expands dropdown.' );
          DropdownA.collapse();
          start();
        } );

        $A.trigger( event );
      } );

      QUnit.asyncTest( 'Arrow Key Down State', function(){
        var event = $.Event( 'keydown' );
        event.keyCode = 40;

        expect( 2 );
        ok( DropdownA.getState()[0] === iState, 'DropdownA initial state is collapsed.' );

        DropdownA.one( 'stated', function(){
          ok( DropdownA.getState()[0] === aState, 'Down key expands dropdown.' );
          DropdownA.collapse();
          start();
        } );

        $A.trigger( event );
      } );

      QUnit.asyncTest( 'Escape Key State', function(){
        var event = $.Event( 'keydown' );
        event.keyCode = 27;

        expect( 2 );
        DropdownA.expand();
        ok( DropdownA.getState()[0] === aState, 'DropdownA initial state is active.' );

        DropdownA.one( 'stated', function(){
          ok( DropdownA.getState()[0] === iState, 'Escape key collapses dropdown.' );
          start();
        } );

        $A.trigger( event );
      } );

      QUnit.asyncTest( 'Focusout State', function(){
        expect( 2 );

        DropdownA.expand();
        ok( DropdownA.getState()[0] === aState, 'DropdownA initial state is active.' );

        DropdownA.one( 'stated', function(){
          setTimeout( function(){
            ok( DropdownA.getState()[0] === iState, 'Focusout collapses dropdown.' );
            start();
          }, 250 );
        } );

        $A.trigger( 'focusout' );
      } );

      QUnit.asyncTest( 'Up Key Item Select', function(){
        var event = $.Event( 'keydown' );
        event.keyCode = 38;

        expect( 4 );

        DropdownA.listInstance.select( 2 );
        DropdownA.expand();
        ok( DropdownA.getState()[0] === aState, 'DropdownA initial state is active.' );
        ok( DropdownA.listInstance.index() === 2, 'DropdownA has the 3rd item selected at index 2.' );

        DropdownA.listInstance.one( 'selected', function(){
          ok( DropdownA.listInstance.index() === 1, 'DropdownA now has the 2nd item selected at index 1.' );
          DropdownA.listInstance.select( 0 );
          ok( DropdownA.getState()[0] === iState, 'DropdownA state is inactive.' );
          start();
        } );
        $A.trigger( event );
      } );

      QUnit.asyncTest( 'Down Key Item Select', function(){
        var event = $.Event( 'keydown' );
        event.keyCode = 40;

        expect( 4 );

        DropdownA.listInstance.select( 1 );
        DropdownA.expand();
        ok( DropdownA.getState()[0] === aState, 'DropdownA initial state is active.' );
        ok( DropdownA.listInstance.index() === 1, 'DropdownA has the 2nd item selected at index 1.' );

        DropdownA.listInstance.one( 'selected', function(){
          ok( DropdownA.listInstance.index() === 2, 'DropdownA now has the 3rd item selected at index 2.' );
          DropdownA.listInstance.select( 0 );
          ok( DropdownA.getState()[0] === iState, 'DropdownA state is inactive.' );
          start();
        } );

        $A.trigger( event );
      } );

      QUnit.asyncTest( 'Item Select by Click', function(){
        var $li = DropdownA.listInstance.$element.find('li:eq(2) a');

        expect( 3 );
        ok( DropdownA.listInstance.index() === 0, 'Initial selected index is 0.');

        DropdownA.listInstance.one( 'selected', function(){
          ok( DropdownA.listInstance.index() === 2, 'Selected 3rd list item at index 2.');
          ok( $btnA.html() === $li.html(), 'Label updated with list items\'s text.' );
          DropdownA.listInstance.select( 0 );
          start();
        } );

        DropdownA.expand();
        $li.trigger( 'click' );
      } );

      QUnit.asyncTest( 'Item Select by Enter Key', function(){
        var $li = DropdownA.listInstance.$element.find('li:eq(1) a'),
          event = $.Event( 'keydown' );
        event.keyCode = 13;

        expect( 3 );
        ok( DropdownA.listInstance.index() === 0, 'Initial selected index is 0.');

        DropdownA.expand();
        DropdownA.listInstance.select( 1 );
        ok( DropdownA.listInstance.index() === 1, 'Selected 2nd list item at index 1.');

        DropdownA.one( 'stated', function(){
          ok( $btnA.html() === $li.html(), 'Label updated with list items\'s text.' );
          DropdownA.listInstance.select( 0 );
          start();
        } );

        $A.trigger( event );
      } );
    }
  } );
}
