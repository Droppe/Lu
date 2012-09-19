var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Abstract = require( 'lu/Abstract' ),
  Fiber = require( 'Fiber' ),
  FormElement;

FormElement = Abstract.extend( function (Abstract){

  // === STATIC VARIABLES ===
  var root = 'lu/FormElement/decorators/',
      decorators = {
        required: root + 'required',
        length: root + 'length',
        ajax: root + 'ajax',
        number: root + 'number'
      },
      defaults = {
        validationFrequency: [ 'blur' ],
        errorClassName: 'error',
        errorMessageTemplate: _.template('<div class="<%= className %>"><%= message %></div>'),
        errorMessageClassName: 'errorMessage',
        errorMessagePosition: 'firstChildOfParent'
      };

  return {

    init: function ( $element, settings ){

      // === INSTANCE VARIABLES ===
      var self = this,
        validators = {},
        errorMessageEls = {},
        requirements = [],
        decorator;

      // === INITIALIZE ===
      _.defaults( settings, defaults );
      Abstract.init.call( this, $element, settings );

      // === PRIVATE ===
      function handleValidationResult( result, validatorName ){
        if( result.success ){
          self.trigger( constants.events.VALIDATION_SUCCESS, [ self, validatorName ] );
        } else {
          self.trigger( constants.events.VALIDATION_FAILURE, [ self, validatorName, result.message ] );
        }
      }

      function insertErrorMessage( validatorName, el ) {
        var position = settings.errorMessagePosition;

        errorMessageEls[ validatorName ] = el;
        if( position === 'firstChildOfParent' ){
          $element.parent().prepend( errorMessageEls[ validatorName ] );
        }else if( position === 'before' ){
          $element.before( errorMessageEls[ validatorName ] );
        }else if( position === 'after' ){
          $element.after( errorMessageEls[ validatorName ] );
        }
      }

      // === PUBLIC ===
      this.addValidator = function( validatorName, validatorFunction ){
        validators[ validatorName ] = validatorFunction;
      }

      this.validate = function( event ){
        var success = true;

        _.each( validators, function( validatorFunction, validatorName, validators ){
          var result = validatorFunction();

          // perform internal validation tasks
          handleValidationResult( result, validatorName );
          // determine if field has any failed validators
          if(success) {
            success = result.success
          }
        } );

        return success;
      }

      // === LU EVENT LISTENERS ===
      this.on( constants.events.VALIDATION_SUCCESS, function( event, component, validatorName ){
        if( errorMessageEls[ validatorName ] ) {
          errorMessageEls[ validatorName ].remove();
          delete errorMessageEls[ validatorName ];
        }
        if( _.size( errorMessageEls ) === 0 ){
          $element.removeClass( settings.errorClassName );
        }
      } );

      this.on( constants.events.VALIDATION_FAILURE, function( event, component, validatorName, errorMessage ){
        if( errorMessageEls[ validatorName ] ) {
          errorMessageEls[ validatorName ].html( errorMessage );
        } else {
          insertErrorMessage( validatorName, $( settings.errorMessageTemplate( { className: settings.errorMessageClassName, message: errorMessage } ) ) );
        }
        $element.addClass( settings.errorClassName );
      } );

      // === DOM EVENT LISTENERS ===
      _.each( settings.validationFrequency, function( frequency, index ){
        if( frequency === 'blur' ){
          $element.blur( self.validate );
        } else if( frequency === 'keyup' ){
          $element.keyup( self.validate );
        }
      } );

      // === DECORATION ===
      _.each( settings.validators, function( validator, index ){
        if( decorators[ validator.toLowerCase() ] ){
          requirements.push( decorators[ validator.toLowerCase() ] );
        }
      } );

      require.ensure( requirements, function( require, module, exports ){
        _.each( requirements, function( decorator, index ){
          decorator = require( decorator )( settings );
          Fiber.decorate( self, decorator );
        } );
        self.trigger( 'dependencies-resolved' );
      } );

    }
  };

});

// Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( FormElement );
  } else if( module.exports ){
   module.exports = FormElement; 
  }
}