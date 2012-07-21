/**
 * Lu Control Framework
 * @module Lu
 * @license
 *
 * Lu Control Framework v0.2.5
 *
 * Copyright (c) 2011,2012 LinkedIn
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 // (Don't do Gilligan's Island if you want to be a serious actress!)

( function( document, window, undefined ){

  /**
   * Lu's main class
   * @class Lu
   * @constructor
   * @require inject
   * @param {Object} settings Configuration properties for this instance
   */
  function Lu(){
    var lu = this,
      packages = {},
      NAMESPACE = 'lu',
      ATTR = 'data-' + NAMESPACE,
      ATTR_CONFIG = ATTR + '-config', 
      LU_CONTROLS = NAMESPACE + '-controls',
      LU_CONFIG = NAMESPACE + '-config',
      UI_CONTROL_PATTERN = '[' + ATTR + ']';


    //Private Methods

    /**
     * Gets the JQuery data object for an Lu control
     * within the 'lu-controls' namespace
     * @method getData
     * @private
     * @param {Object} $element A jQuery object representing the control's DOM node
     * @param {String} key An optional data key
     * @return {Object} The data object
     */
    function getData( $element, key ){
      var data = $element.data( LU_CONTROLS ),
        ret;

      if( data ){
        if( key ){
          ret = data[key];
        } else{
          ret = data;
        }
      } else if( key ){
        ret = undefined;
      } else {
        $element.data(LU_CONTROLS, {} );
        ret = {};
      }

      return ret;
    }

    /**
     * Sets the JQuery data object for an Lu control
     * within the 'lu-controls' namespace
     * @method setData
     * @private
     * @param {Object} $element A jQuery collection
     * @param {Object} data An object containing the new data to store
     * @return {Object} The target element (allows chaining)
     */
    function setData( $element, data ){
      // Mixin the new data with the current data.
      $element.data( LU_CONTROLS, $.extend( true, getData( $element ), data ) );
      return $element;
    }

    //Public Methods

    /**
     * Returns true if the passed in element is a control an optional key can be
     * used to match a specific Control
     * @public
     * @static
     * @method isControl
     * @param {Object} $element a jQuery collection
     * @param {String} key The name of Lu component to test
     * @return {Boolean} True if the element is a control
     */
    lu.isControl = function( $element, key ){
      if( key ){
        return $element.filter( ATTR + '*=' + key ).length > 1;
      } else {
        return $element.is( UI_CONTROL_PATTERN );
      }
    };

    /**
     * All child controls in the $element and the $element have been executed.
     * @public
     * @static
     * @method isReady
     * @param {Object} $element a jQuery collection
     * @return {Boolean} True if all child controls have been executed
     */
    lu.isReady = function( $element ){
      var $controls = lu.getDescendants( $element ).filter( function( item ){
        return lu.isExecuted( $( item ) );
      } );
      if( $controls.length === 0 && lu.isExecuted( $element ) ){
        return true;
      }
      return false;
    };

    /**
     * All controls on a node have been executed.
     * @public
     * @static
     * @method isExecuted
     * @param {Object} $element a jQuery collection
     * @return {Boolean} True if controls on $element are finished executing
     */
    lu.isExecuted = function( $element ){
      return ( ( getData( $element, 'executed' ) ) ? true : false );
    };

    /**
     * Returns an array of all Lu keys on $element
     * @public
     * @static
     * @method getKeys
     * @param {Object} $element a jQuery collection
     * @return {Array} An array of Lu keys
     */
    lu.getKeys = function( $element ){
      return ( $element.attr( ATTR ) || '' ).split( ' ' );
    };

    /**
     * Parses the $element for Lu controls, loads, and instatiates them.
     * @public
     * @static
     * @method execute
     * @param {Object} $element a jQuery collection
     * @return {Object} The executed element (allows chaining)
     */
    lu.execute = function( $element ){
      var $controls,
        keys = [],
        required = [],
        numberOfControls = 0;

      /**
       * Instantiates a control with selected element.
       * @method execute
       * @private
       * @param {Array} $node A jQuery collection with the selected elements.
       * @param {String} key The name of the Control.
       * @param {Function} Control The Control's constructor.
       * @return {Void}
       */
      function execute( $node ){
        var config = $node.data( LU_CONFIG ),
          extraConfig = $node.data( 'luExtraConfig' ),
          keys = lu.getKeys( $node );

        _.each( keys, function( key, index ){
          var Control,
            __params__ = key.split( ':' ),
            pckg = NAMESPACE + '/' + __params__.shift(),
            nodeData;

          _.each( __params__, function( item, index ){
              __params__[index] = item.toLowerCase();
          } );

          if( config ){
            config = ( function(){ return eval( '( function(){ return ' + config + '; }() );' ); }()[key] || {} );
          } else {
            config = {};
          }

          config = _.extend( config, extraConfig );

          if( __params__.length > 0 ){
            config.__params__ = __params__;
          }

          Control = new packages[pckg]( $node, config );

          nodeData = getData( $node, key );

          if( nodeData ){
            nodeData.instance = Control;
          } else {
            nodeData = {};
            nodeData[key] = {};
            nodeData[key].instance = Control;
            setData( $node, nodeData );
          }
        } );

        _.each( lu.getControls( $node ), function( item, index ){
          $node.trigger( 'luExecuted', [keys] );
        } );

        setData( $node, {'executed': true} );
        lu.console( $node ).info( 'executed' );
      }

      $controls = lu.getDescendants( $element );

      if( lu.isControl( $element ) ){
        $controls = $controls.add( $element );
      }

      //Filter out controls that are already executed
      $controls = $controls.filter( function( index, item ){
        return ( lu.isExecuted( $( item ) ) ? false : true );
      } );

      //Construct an array of required packages && init the Deferred Object
      _.each( $controls, function( node, index ){
        var $node = $( node ),
          Deferred,
          controls;

        Deferred = getData( $node, 'Deferred' );

        if( !Deferred ){
          setData( $node, {'Deferred': $.Deferred()} );
        }

        controls = lu.getKeys( $node );
        numberOfControls += controls.length;

        _.each( controls, function( key, index ){
          var pckg = NAMESPACE + '/' + key.split( ':' ).shift();
          if( _.indexOf( required, pckg ) === -1 && _.indexOf( _.keys( packages, pckg ) ) === -1 ){
            required.push( pckg );
          }
        } );
      } );

      require.ensure( required, function( require, module, exports ){
        _.each( required, function( requirement, index ){
          packages[requirement] = require( requirement );
        } );

        $controls.each( function( index, control ){
          var defObj,
            $control = $( control );

          execute( $control );
          numberOfControls -= 1;

          if( numberOfControls === 0 ){
            $element.trigger( 'luReady', [$element] );
          }

          // Resolve any deferred objects stored within the control's data object.
          defObj = getData( $control, 'Deferred' );

          if( defObj ){
            if( defObj.state() === 'pending' ){
              defObj.resolve();
            }
          }
        } );
      } );

      return $element;
    };

    /**
     * Notifies observers of events
     * @public
     * @static
     * @method notify
     * @param {Object} $element a jQuery collection
     * @param {string} event the event type
     * @param {Array} $element extra arguments associated with the event
     * @return {Object} The target element (allows chaining)
     */
    lu.notify = function( $element, event, parameters ){
      var $observers = getData( $element, '$observers' );

      if( $observers ){
        $observers.each( function( index, item ){
          var $item = $( item ),
            Deferred;

          Deferred = getData( $item, 'Deferred' );

          if( Deferred ){
            // If the deferred object is already resolved
            // adding a new .done() fires the enclosed function
            // immediately.
            Deferred.done( function(){
              _.each( lu.getControls( $item ), function( item, index ){
                //Filter out Controls that don't listen for the event
                var events = ( item.events ) ? item.events() : [];
                if( _.indexOf( events, event ) > -1 ){
                  item.trigger.call( item, new jQuery.Event( event, { target: $element } ), parameters );
                }
              } );
            } );

          }
        } );
      }

      return $element;
    };

    /**
     * Add an $observer to an $element
     * @public
     * @static
     * @method observe
     * @param {Object} $element a jQuery collection
     * @param {Object} $observer a jQuery collection
     * @return {Object} The target element (allows chaining)
     */
    lu.observe = function( $element, $observer ){
      var $observers = getData( $element, '$observers' ) || $( [] );

      $observer = $observer.not( $observers );
      $observers = $observers.add( $observer );

      setData( $element, {'$observers': $observers} );

      return $element;
    };

    /**
     * Remove an observer from an $element
     * @public
     * @static
     * @method unobserve
     * @param {Object} $element a jQuery collection
     * @param {Object} $observer a jQuery collection
     * @return {Object} The target element (allows chaining)
     */
    lu.unobserve = function( $element, $observer ){
      var data = getData( $element ),
        $observers;

      if( _.keys( data ).length === 0 ){
        return $element;
      }

      $observers = data.$observers;

      if( $observers ){
        $observers = $( _.reject( $observers, function( item, index ){
          return $observer.is( item );
        } ) );
        setData( $element, {'$observers': $observers} );
      }
      return $element;
    };

    /**
     * Destroys the binding of an Lu control to the $element
     * @public
     * @static
     * @method destroy
     * @param {Object} $element a jQuery collection
     * @return {Object} A JQuery collection of Lu controls
     */
    lu.destroy = function( $element ){
      var $controls = lu.getDescendants( $element ),
        attrs = [ATTR, ATTR_CONFIG],
        data = [NAMESPACE, LU_CONTROLS, LU_CONFIG];

      if ( $element.is( UI_CONTROL_PATTERN ) ){
        $controls = $controls.add( $element );
      }

      $controls.each( function( index, item ){
        var $item = $( item );
        _.each( lu.getControls( $item ), function( item, index ){
          var events = ( item.events ) ? item.events() : [];
          item.off( events.join( ' ' ) );
        } );

        $item.removeData( data );

        _.each( attrs, function( attr, index ){
          $item.removeAttr( attr );
        } );
      } );

      return $element;
    };

    /**
     * Decorates a node with Lu markup.
     * @method decorate
     * @public
     * @static
     * @param {Object} $element a jQuery collection
     * @param {Object} keys to be decorated
     * @param {Object} settings to be used in creation of controls
     * @return {String} The conjoined keys
     */
    lu.decorate = function( $element, keys, settings ){
      var result,
        nodeKeys = ( $element.attr( ATTR ) ) ? $element.attr( ATTR ).split( ' ' ) : [],
        luExtraConfig = 'luExtraConfig';

      settings = settings || {};

      keys = _.union( nodeKeys, keys );

      result = $element.attr( ATTR, keys.join( ' ' ) );
      $element.data( 'luExtraConfig', _.extend( $element.data( luExtraConfig ) || {}, settings ) );

      return result;
    };

    /**
     * Decorates a node with Lu markup and instantiates controls.
     * @method create
     * @public
     * @static
     * @param {Object} $element a jQuery collection
     * @param {Object} keys to be decorated
     * @param {Object} settings to be used in creation of controls
     * @return {Object} The target element (allows chaining)
     */
    lu.create = function( $element, keys, settings ){
      return lu.execute( lu.decorate( $element, keys, settings ) );
    };

    /**
     * Returns a control instance with id
     * @method getControl
     * @public
     * @static
     * @param {Object} $element a jQuery collection
     * @param {String} key The id of returned control.
     * @return {Object} The specified Lu control or the first control found if none specified
     */
    lu.getControl = function( $element, key ){
      var data = getData( $element ),
        instance = null;

      if( _.keys( data ).length === 0 ){
        return null;
      }

      if( key ){
        instance = data[key].instance;
      } else {
        _.each( data, function( item, index ){
          if( !instance ){
            instance = item.instance;
          }
        } );
      }

      return instance;
    };

    /**
     * Returns a controls object
     * @method getControls
     * @public
     * @static
     * @param {Object} $element a jQuery collection
     * @return {Object} The Lu controls associated with the given element
     */
    lu.getControls = function( $element ){
      var data = getData( $element ),
        keys,
        controls = null,
        dataKeys = _.keys( data );

      if( dataKeys.length === 0 ){
        return controls;
      }

      keys = lu.getKeys( $element );

      _.each( dataKeys, function( key, index ){
        if( _.indexOf( keys, key ) > -1 ){
          if( !controls ){
            controls = {};
          }
          controls[key] = lu.getControl( $element, key );
        }
      } );

      return controls;
    };

    /**
     * Gets the decendants of the passed in $node filtered by filter
     * @method getDescendants
     * @public
     * @static
     * @param {Object} $element a jQuery collection
     * @param {String} filter an optional css selector to use as a filter
     * @return {Object} A Jquery collection of the decendants
     */
    lu.getDescendants = function( $element, filter ){
      if( filter ){
        return $( UI_CONTROL_PATTERN, $element ).filter( filter );
      } else {
        return $( UI_CONTROL_PATTERN, $element );
      }
    };

    /**
     * Gets the children of the passed in $node filtered by filter
     * @method getChildren
     * @public
     * @static
     * @param {Object} $element a jQuery collection
     * @param {String} filter an optional css selector to use as a filter
     * @return {Object} A Jquery collection of the children
     */
    lu.getChildren = function( $element, filter ){
      if( filter ){
        return $element.children( UI_CONTROL_PATTERN ).filter( filter );
      } else {
        return $element.children( UI_CONTROL_PATTERN );
      }
    };

    /**
     * Gets the first parent of the passed in $node matching filter
     * @method getParent
     * @public
     * @static
     * @param {Object} $element a jQuery collection
     * @param {String || function || Object} filter a css selector, jQuery collection or function to be used as a filter
     * @return {Object} A Jquery collection representing the parent
     */
    lu.getParent = function( $element, filter ){
      if( filter ){
        return $element.parents( UI_CONTROL_PATTERN ).filter( filter ).eq( 0 );
      } else {
        return $element.parents( UI_CONTROL_PATTERN ).eq( 0 );
      }
    };

    /**
     * Gets all of the parents of the passed in $node matching filter
     * @method getParents
     * @public
     * @static
     * @param {Object} $element a jQuery collection
     * @param {String} filter an optional css selector to use as a filter
     * @return {Object} A Jquery collection representing the parents
     */
    lu.getParents = function( $element, filter ){
      if( filter ){
        return $element.parents( UI_CONTROL_PATTERN ).filter( filter );
      } else {
        return $element.parents( UI_CONTROL_PATTERN );
      }
    };

    /**
     * A console facade that includes useful information about the control
     * @method console
     * @public
     * @static
     * @param {Object} $element a jQuery collection
     */
    lu.console = function( $element ){
      var prefix = 'Lu :: ',
        slice = Array.prototype.slice;

      if( window.lu_debug  === false ){
        return {
          error: function(){},
          warn: function(){},
          info: function(){},
          debug: function(){}
        };
      }

      return {
        error: function(){
          if( window.lu_debug >= 1 ){
            var parameters = slice.call( arguments );
            parameters.unshift( prefix, $element );
            return _.error( parameters );
          }
        },
        warn: function(){
          if( window.lu_debug >= 2 ){
            var parameters = slice.call( arguments );
            parameters.unshift( prefix, $element );
            return _.warn( parameters );
          }
        },
        info: function(){
          if( window.lu_debug >= 3 ){
            var parameters = slice.call( arguments );
            parameters.unshift( prefix, $element );
            return _.info( parameters );
          }
        },
        debug: function(){
          if( window.lu_debug >= 4 ){
            var parameters = slice.call( arguments );
            parameters.unshift( prefix, $element );
            return _.debug( parameters );
          }
        },
        log: function(){
          if( window.lu_debug >= 5 ){
            var parameters = slice.call( arguments );
            parameters.unshift( prefix, $element );
            return _.log( parameters );
          }
        }
      };
    };
  }

  //Attach a new lu to the window
  window.lu = new Lu();

  //Bind lu to jquery as a plugin
  ( function( $ ){

    /**
     * Lu JQuery plugin
     * @method lu
     * @public
     */
    $.fn.lu = function(){
      var $this = $( this ),
        parameters = Array.prototype.slice.call( arguments ),
        method = parameters[0];

      parameters[ 0 ] = $this;

      if( typeof window.lu[method] === 'function' ){
        return window.lu[method].apply( $this, parameters );
      }

    };

  }( window.jQuery ) );

  //Do a first pass of the HTML with the body.
  $( function(){

    function execute(){
      var $body = $( 'body' ),
        executingFlag = 'lu-executing',
        readyFlag = 'lu-ready';

      $body.addClass( executingFlag ).one( 'luReady', function( event ){
        $body.toggleClass( executingFlag, readyFlag );
        window.lu.console( $body ).info( 'ready' );
      } );

      window.lu.decorate( $body, ['Abstract'] );
      window.lu.execute( $body );
      window.lu.console( $body ).info( 'executing' );

    }

    execute();

  } );
}( document, window ) );

//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( window.lu );
  } else if( module.exports ){
   module.exports = window.lu;
  }
}