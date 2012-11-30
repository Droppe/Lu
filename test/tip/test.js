function execute(){
  var mouseTipEl = $( '#mouse-tip' ),
      mouseTipComponent = mouseTipEl.lu( 'getComponent', 'Tip' ),
      inputTipEl = $( '#input-tip' ),
      inputTipComponent = inputTipEl.lu( 'getComponent', 'Tip' ),
      persistentTipEl = $( '#persistent-tip' ),
      persistentTipComponent = persistentTipEl.lu( 'getComponent', 'Tip' );

  $.when.apply( $, [ mouseTipComponent.deferral,
                     inputTipComponent.deferral,
                     persistentTipComponent.deferral ] ).done( function () {

    QUnit.module( 'API Tests' );

    test( 'Programmatic show', 1, function() {
      mouseTipComponent.instance.show();
      if( $( '.mouse-tip' ).is( ':visible' ) ) {
        ok( true, 'Tip is shown' );
      }
    } );

    test( 'Programmatic getPosition', 1, function() {
      var position = mouseTipComponent.instance.getPosition();

      if( position.top && position.left ) {
        ok( true, 'Postion object has correct attributes' );
      }
    } );

    asyncTest( 'Programmatic hide', 1, function() {
      mouseTipComponent.instance.hide();
      setTimeout( function() {
        if( !$( '.mouse-tip' ).is( ':visible' ) ) {
          ok( true, 'Tip is hidden' );
          start();
        }
      }, 500 );
    } );

    QUnit.module( 'Interaction Tests' );

    test( 'Mouse over show', 2, function() {
      mouseTipEl.trigger( 'mouseenter' );
      ok( $.trim( $( '.mouse-tip' ).html() ) === 'Mouse tooltip content.', 'Tip content is correct.' );
      if( $( '.mouse-tip' ).is( ':visible' ) ) {
        ok( true, 'Tip is shown' );
      }
    } );

    asyncTest( 'Mouse leave hide', 1, function() {
      $( document ).trigger( 'mousemove' );
      setTimeout( function() {
        if( !$( '.mouse-tip' ).is( ':visible' ) ) {
          ok( true, 'Tip is hidden' );
          start();
        }
      }, 500 );
    } );

    test( 'Focus show', 2, function() {
      inputTipEl.trigger( 'focus' );
      ok( $.trim( $( '.input-tip' ).html() ) === 'Input tooltip content.', 'Tip content is correct.' );
      if( $( '.input-tip' ).is( ':visible' ) ) {
        ok( true, 'Tip is shown' );
      }
    } );

    asyncTest( 'Blur hide', 1, function() {
      $( inputTipEl ).trigger( 'blur' );
      setTimeout( function() {
        if( !$( '.input-tip' ).is( ':visible' ) ) {
          ok( true, 'Tip is hidden' );
          start();
        }
      }, 500 );
    } );

    test( 'Show persistent tip', 1, function() {
      persistentTipEl.trigger( 'mouseenter' );
      if( $( '.persistent-tip' ).is( ':visible' ) ) {
        ok( true, 'Tip is shown' );
      }
    } );

    test( 'Hide persistent tip (with close button)', 1, function() {
      $( '.persistent-tip .close' ).trigger( 'click' );
      if( !$( '.persistent-tip' ).is( ':visible' ) ) {
        ok( true, 'Tip is hidden' );
      }
    } );

  } );
}