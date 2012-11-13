
var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' );

function stateDecorator( settings ){

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
      if( clss.indexOf( constants.statePrefix ) > -1 ){
        removed.push( clss );
      }
    } );

    _.each( states, function( clss, index ){
      if( clss ){
        classes.push( constants.statePrefix + clss );
      }
    } );

    $element.removeClass( removed.join( ' ' ) ).addClass( classes.join( ' ' ) );

    window.setTimeout( function(){
      //allow browser re-flow
    }, 1 );
  }

  function getAppliedStates( $element ){
    var classes = $element.attr( 'class' ) || '',
      states = [];

    _.each( classes.split( ' ' ), function( item, index ){
      if( item.indexOf( constants.statePrefix ) > -1 ){
        states.push( item.replace( constants.statePrefix, '' ) );
      }
    } );
    return states;
  }

  return function( base ){

    var self = this,
      /**
       * An array of string representing the current state(s)
       * @property states
       * @type Array
       * @private
       */
      states = [],
      cache = [getAppliedStates( this.$element )];

    /**
     * Updates states on a state event
     * @method state
     * @private
     * @param {Object} event The jQuery Event object
     * @param {Array} states an array of states to set
     * @return {Function} Container.setState
     */
    function state( event, states, method ){
      if( self.$element.is( event.target ) ){
        //return early to prevent recursion
        return self;
      }
      event.stopPropagation();
      switch( method ){
        case 'add':
          self.addState( states );
          break;
        case 'remove':
          self.removeState( states );
          break;
        case 'reset':
          self.reset();
          break;
        case 'clear':
          self.clear();
          break;
        case 'toggle':
          self.toggle( states );
          break;
        default:
          self.setState( states );
      }
      return self;
    }

    /**
     * Returns the state(s) of the instance
     * @method getState
     * @public
     * @return {Array} an Array of strings representing the state(s)
     */
    this.getState = function(){
      return states;
    };

    /*
     * Sets the state(s) of the instance replacing other states
     * @method setState
     * @param {Array|String} value This can be an Array of strings or comma
     * delimited string representing multiple states. It can also be
     * a string representing a single state
     * @public
     * @return {Object} instance
     */
    this.setState = function( value ){
      if( typeof value === 'string' ){
        value = value.split( ',' ).sort();
      }

      value = value.sort();
      states = states.sort();

      if( _.isEqual( value, states ) ){
        return self;
      }

      states = value;

      applyState( this.$element, states, constants.statePrefix );
      this.trigger( constants.events.STATED, [this] );

      return this;
    };

    /*
     * Adds a state or states to the instance
     * @method addStates
     * @param {Array|String} value This can be an Array of strings or comma
     * delimited string representing multiple states. It can also be
     * a string representing a single state
     * @public
     * @return {Object} instance
     */
    this.addState = function( value ){
      if( typeof value === 'string' ){
        value = value.split( ',' );
      }
      if( _.difference( value, states ).length > 0 ){
        states = _.union( states, value );
        applyState( this.$element, states );
        this.trigger( constants.events.STATED, [this] );
      }
      return this;
    };

    /**
     * Removes the state(s) from the instance
     * @method removeState
     * @param {Array|String} value This can be an Array of strings or comma
     * delimited string representing multiple states. It can also be
     * a string representing a single state
     * @public
     * @return {Object} instance
     */
    this.removeState = function( value ){
      var intersection,
        args = [];

      if( typeof value === 'string' ){
        value = value.split( ',' );
      }

      intersection = _.intersection( states, value );
      if( intersection.length > 0 ){
        args.push( states );
        _.each( value, function( item, index ){
          args.push( item );
        } );
        states = _.without.apply( this, args );
        applyState( this.$element, states, constants.statePrefix );
        this.trigger( constants.events.STATED, [this] );
      }
      return this;
    };

    /**
     * Removes all states from the instance
     * @method clear
     * @public
     * @return {Object} instance
     */
    this.clear = function(){
      this.removeState( states );
      return this;
    };

    /**
     * Sets states to those originally defined on the node
     * @method reset
     * @public
     * @return {Object} instance
     */
    this.reset = function(){
      this.setState( cache[0] );
      return this;
    };

    /**
     * Checks to see if the state has been applied
     * @method hasState
     * @param {String} The state to check
     * @public
     * @return {Boolean} True if the state has been applied.
     */
    this.hasState = function( value ){
      return ( _.indexOf( states, value ) > -1 );
    };

    //Add the initial state
    if( cache[0] ){
      this.addState( cache[0] );
    }
    //Bind to 'state' events
    this.on( constants.events.STATE, state );

  };
}

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( stateDecorator );
  } else if( module.exports ){
   module.exports = stateDecorator;
  }
}