Lu.map( $( 'input[type=text][placeholder][data-lu~=Placeholder], textarea[placeholder][data-lu~=Placeholder]' ), 'Placeholder', function(){} );

function execute(){
  var InputPlaceholder,
    TextareaPlaceholder,
    $inputPlaceholder = $( '#inputTest' ),
    $textareaPlaceholder = $( '#textareaTest' );

  InputPlaceholder = $inputPlaceholder.lu( 'getComponents' ).Placeholder.instance;
  TextareaPlaceholder = $textareaPlaceholder.lu( 'getComponents' ).Placeholder.instance;

  function setup () {
    $inputPlaceholder.trigger( 'focus' ).val('').trigger( 'blur' );
    $textareaPlaceholder.trigger( 'focus' ).val('').trigger( 'blur' );
  }

  if ( !( 'placeholder' in document.createElement( 'input' ) && 'placeholder' in document.createElement( 'textarea' ) ) ) {
    asyncTest( 'placeholder text inserted', function(){
      setup();
      expect( 2 );
      equal( $inputPlaceholder.val(), 'input placeholder', 'Placeholder text succesfully inserted into input element' );
      equal( $textareaPlaceholder.val(), 'textarea placeholder', 'Placeholder text succesfully inserted into textarea element' );
      start();
    } );

    asyncTest ( 'focus, no user text in element', function() {
      setup();
      expect( 2 );
      $inputPlaceholder.one( 'focus', function() {
        equal( $inputPlaceholder.val(), '', 'Placeholder text succesfully removed' );
        start();
      } );
      $textareaPlaceholder.one( 'focus', function() {
        equal( $textareaPlaceholder.val(), '', 'Placeholder text succesfully removed' );
        start();
      } );
      $inputPlaceholder.trigger( 'focus' );
      $textareaPlaceholder.trigger( 'focus' );
    } );

    asyncTest ( 'focus, with user text in element', function() {
      setup();
      expect( 2 );
      $inputPlaceholder.trigger( 'focus' ).val( 'Remove me' ).trigger( 'blur' );
      $textareaPlaceholder.trigger( 'focus' ).val( 'Remove me, too' ).trigger( 'blur' );
      $inputPlaceholder.one( 'focus', function() {
        equal( $inputPlaceholder.val(), 'Remove me', 'Placeholder text succesfully removed' );
        start();
      } );
      $textareaPlaceholder.one( 'focus', function() {
        equal( $textareaPlaceholder.val(), 'Remove me, too', 'Placeholder text succesfully removed' );
        start();
      } );
      $inputPlaceholder.trigger( 'focus' );
      $textareaPlaceholder.trigger( 'focus' );
    } );

    asyncTest ( 'blur, no user text in element', function() {
      setup();
      expect( 2 );
      $inputPlaceholder.one( 'blur', function() {
        equal( $inputPlaceholder.val(), 'input placeholder', 'Placeholder text succesfully removed' );
        start();
      } );
      $textareaPlaceholder.one( 'blur', function() {
        equal( $textareaPlaceholder.val(), 'textarea placeholder', 'Placeholder text succesfully removed' );
        start();
      } );
      $inputPlaceholder.trigger( 'focus' );
      $inputPlaceholder.trigger( 'blur' );
      $textareaPlaceholder.trigger( 'focus' );
      $textareaPlaceholder.trigger( 'blur' );
    } );

    asyncTest ( 'blur, with user text in element', function() {
      setup();
      expect( 2 );
      $inputPlaceholder.trigger( 'focus' ).val( 'Remove me' ).trigger( 'blur' );
      $textareaPlaceholder.trigger( 'focus' ).val( 'Remove me, too' ).trigger( 'blur' );
      $inputPlaceholder.one( 'blur', function() {
        equal( $inputPlaceholder.val(), 'Remove me', 'Placeholder text succesfully removed' );
        start();
      } );
      $textareaPlaceholder.one( 'focus', function() {
        equal( $textareaPlaceholder.val(), 'Remove me, too', 'Placeholder text succesfully removed' );
        start();
      } );
      $inputPlaceholder.trigger( 'focus' );
      $inputPlaceholder.trigger( 'blur' );
      $textareaPlaceholder.trigger( 'focus' );
      $textareaPlaceholder.trigger( 'blur' );
    } );
  }
}
