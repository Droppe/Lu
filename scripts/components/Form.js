var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Abstract = require( 'lu/Abstract' ),
  Fiber = require( 'Fiber' ),
  Form;

Form = Abstract.extend( function (Abstract){

  // === STATIC VARIABLES ===
  var root = 'lu/Form/decorators/',
      decorators = {
        async: root + 'async'
      },
      defaults = {};

  return {

    init: function ( $element, settings ){

      // === INSTANCE VARIABLES ===
      var self = this,
        errors = {},
        requirements = [],
        decorator;

      // === INITIALIZE ===
      _.defaults( settings, defaults );
      Abstract.init.call( this, $element, settings );

      // === PRIVATE ===
      function handleSubmit( event ){
        var formElements = $element.children().find( '[data-lu]' ),
          isValid = true;

        // force all children fields to validate
        _.each( formElements, function( formElement, index ){
          var component = $( formElement ).lu( 'getComponents' ),
              result = component.FormElement ? component.FormElement.instance.validate() : true;

          if( isValid ){
            isValid = result;
          }
        } );

        if( isValid ){
          self.trigger( constants.events.FORM_SUBMIT, [ self ] );
          self.submitForm( event );
        }else{
          return false;
        }
      }

      // === LU EVENT LISTENERS ===
      this.on( constants.events.VALIDATION_SUCCESS, function( event, component, validatorName ){
        var fieldName = component.$element.attr('name');

        event.stopPropagation();
        // remove any errors for the now successful validation
        if( errors[ fieldName ] && errors[ fieldName ][ validatorName ] ){
          delete errors[ fieldName ][ validatorName ];
          // if a field has no validators in error state remove it
          if( _.size( errors[ fieldName ] ) === 0 ){
            delete errors[ fieldName ];
          }
        }
      } );

      this.on( constants.events.VALIDATION_FAILURE, function( event, component, validatorName, errorMessage ){
        var fieldName = component.$element.attr('name');

        event.stopPropagation();
        // track errors on a per field and per validator basis
        if( ! errors[ fieldName ] ){
          errors[ fieldName ] = {};
        }
        errors[ fieldName ][ validatorName ] = true;
      } );

      // === DOM EVENT LISTENERS ===
      $element.submit(handleSubmit);

      // === PUBLIC ===
      this.submitForm = function( event ){
        return true;
      }

      // === DECORATION ===
      _.each( settings.decorators, function( decorator, index ){
        if( decorators[ decorator.toLowerCase() ] ){
          requirements.push( decorators[ decorator.toLowerCase() ] );
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
    module.setExports( Form );
  } else if( module.exports ){
   module.exports = Form; 
  }
}