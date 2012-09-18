function execute(){
  var mouseTipEl = $( '#mouse-tip' ),
      mouseTipComponent = mouseTipEl.lu( 'getComponent', 'Tip' ),
      inputTipEl = $( '#input-tip' ),
      inputTipComponent = inputTipEl.lu( 'getComponent', 'Tip' );

  QUnit.module( 'Lu Tips' );

  QUnit.asyncTest( 'Mouse triggered tip.' , function() {
    mouseTipComponent.ready(function() {
      mouseTipEl.trigger( 'mouseenter' );
      expect( 2 );
      ok( $.trim( $( '.mouse-tip' ).html() ) === 'Fatback pork belly flank salami cow t-bone ground round pancetta short ribs jerky pig pork sausage.', 'Tip content is correct.' );
      start();
      $(document).trigger( 'mousemove' );
      stop();
      setTimeout(function() {
        ok( $( '.mouse-tip' ).css('display') === 'none', 'Tip has been hidden.' );
        start();
      }, 300);
    });
  });

  QUnit.asyncTest( 'Focus triggered tip.' , function() {
    inputTipComponent.ready(function() {
      inputTipEl.trigger( 'focus' );
      expect( 2 );
      ok( $.trim( $( '.input-tip' ).html() ) === 'Pastrami boudin pig, swine filet mignon venison flank chuck.', 'Tip content is correct.' );
      start();
      inputTipEl.trigger( 'blur' );
      stop();
      setTimeout(function() {
        ok( $( '.input-tip' ).css( 'display' ) === 'none', 'Tip has been hidden.' );
        start();
      }, 300);
    });
  });

}