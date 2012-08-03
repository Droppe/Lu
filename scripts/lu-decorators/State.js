function stateDecorator() {

  var STATED_EVENT = 'stated',
    STATE_EVENT = 'state',
    STATE_PREFIX = 'lu-state-';

  function normalizeStates( states ){
    if( states ){
      if( typeof states === 'string' ){
        states = states.replace( ' ', '' ).split( ',' );
      }
    }
    return states;
  }

  /**
   * Add Classes representing the current states to $element and remove
   * invalid states
   * @method applyState
   * @private
   * @param {Object} event The jQuery Event object
   * @param {Array} states an array of states to set
   * @return {Function} Container.setState
   */
  function applyState( $element, states ){
    var removed = [],
      classes = [],
      classAttr = $element.attr( 'class' ) || '';

    _.each( classAttr.split( ' ' ), function( clss, index ){
      if( clss.indexOf( STATE_PREFIX ) > -1 ){
        removed.push( clss );
      }
    } );

    _.each( states, function( clss, index ){
      classes.push( STATE_PREFIX + clss );
    } );

    $element.removeClass( removed.join( ' ' ) ).addClass( classes.join( ' ' ) );
  }

  function getAppliedStates( $element ){
    var classes = $element.attr( 'class' ) || '',
      states = [];

    _.each( classes.split( ' ' ), function( item, index ){
      if( item.indexOf( STATE_PREFIX ) > -1 ){
        states.push( item.replace( STATE_PREFIX, '' ) );
      }
    } );

    return states;
  }

  return function( instance ){
    /**
     * An array of string representing the current state(s)
     * @property states
     * @type Array
     * @private
     */
    var states = [],
      $element = instance.$element,
      prefix = STATE_PREFIX;

    /**
     * Updates states on a state event
     * @method state
     * @private
     * @param {Object} event The jQuery Event object
     * @param {Array} states an array of states to set
     * @return {Function} Container.setState
     */
    function state( event, states ){
      if( instance.$element.is( event.target ) ){
        return;
      }
      event.stopPropagation();
      return instance.setState( states );
    }

    /**
     * Returns the state(s) of the instance
     * @method getState
     * @public
     * @return {Array} an Array of strings representing the state(s)
     */
    instance.getState = function(){
      return states;
    };

    /**
     * Sets the state(s) of the instance replacing other states
     * @method setState
     * @param {Array|String} value This can be an Array of strings or comma
     * delimeted string representing multiple states. It can also be
     * a string representing a single state
     * @public
     * @return {Object} instance
     */
    instance.setState = function( value ){
      if( typeof value === 'string' ){
        value = value.split( ',' ).sort();
      }

      value = value.sort();
      states = states.sort();

      if( _.isEqual( value, states ) ){
        return instance;
      }

      states = value;

      applyState( $element, states, prefix );
      instance.trigger( STATED_EVENT, [instance] );

      return instance;
    };

    /**
     * Adds a state or states to the instance
     * @method addState
     * @param {Array|String} value This can be an Array of strings or comma
     * delimeted string representing multiple states. It can also be
     * a string representing a single state
     * @public
     * @return {Object} instance
     */
    instance.addState = function( value ){
      if( typeof value === 'string' ){
        value = value.split( ',' );
      }
      console.log( 'DOFF', _.difference( value, states ).length );
      if( _.difference( value, states ).length > 0 ){
        states = _.union( states, value );
        applyState( $element, states );
        console.log( instance );
        instance.trigger( STATED_EVENT, [instance] );
        console.log( 'HEJJJJ' );
      }
      return instance;
    };

    /**
     * Removes the state(s) from the instance
     * @method addState
     * @param {Array|String} value This can be an Array of strings or comma
     * delimeted string representing multiple states. It can also be
     * a string representing a single state
     * @public
     * @return {Object} instance
     */
    instance.removeState = function( value ){
      var intersection;
      if( typeof value === 'string' ){
        value = value.split( ',' );
      }

      intersection = _.intersection( states, value );

      if( intersection.length > 0 ){
        states = _.without( states, value );
        applyState( $element, states, prefix );
        instance.trigger( STATED_EVENT, [instance] );
      }

      return instance;
    };

    /**
     * Checks to see if the state has been applied
     * @method hasState
     * @param {String} The state to check
     * @public
     * @return {Boolean} True if the state has been applied.
     */
    instance.hasState = function( value ){
      return ( _.indexOf( states, value ) > -1 );
    };

    console.log( getAppliedStates( $element ), $element );
    instance.addState( getAppliedStates( $element ) );

    //Bind state event to state
    instance.on( STATE_EVENT, state );
  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( stateDecorator() );
  } else if( module.exports ){
   module.exports = stateDecorator();
  }
}