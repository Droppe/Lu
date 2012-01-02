/* 

 Lu Control Framwork v0.0.2
 https://github.com/iheartweb/LuControlFramework
 Copyright (c) 2011 Robert Martone
 
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:
 
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// (Don't do Gilligan's Island if you want to be a serious actress!)


/**
 * Lu Control Framework
 * @module lu
 * @class lu
 * @constructor
 * @requires inject, ptclass
 * @param {Object} settings Configuration properties for this instance
 */

var LU_CONFIG = window.LU_CONFIG || {},
  Lu;

Lu = function( settings ) {
  var Lu = this,
    defaults = {
      namespace: 'lu',
      debug: false,
      useCommonJSLoader: true,
      prefixes: ['ui']
    },
    ATTR,
    UI_CONTROL_PATTERN = '[data-lu]',
    DEFERRED = 'Deferred',
    packages = {};

  settings = settings || {};

  _.defaults( settings, defaults );

  ATTR = 'data-' + settings.namespace;

  //Setup require statement
  if ( !typeof window.require === 'function' && !window.module || !LU_CONFIG.useCommonJSLoader ) {
    window.require = function( id ) {
      id = id.split( '/' ).pop();
      id.reverse();
      return window[ id.join('') ];
    };
    delete window.module;
  }

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
  Lu.isControl = function( $element, key ) {
    if( key ) {
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
  //Refactor Ready and Executed into one method
  Lu.isReady = function( $element ) {
    var $controls = Lu.getDescendants( $element ).filter( function( item ) {
      return Lu.isExecuted( $( item ) );
    } );
    if( $controls.length === 0 && Lu.isExecuted( $element ) ) {
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
  Lu.isExecuted = function( $element ) {
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
  Lu.getKeys = function( $element ) {
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
  Lu.execute = function( $element ) {
    var $controls,
       keys = [],
       required = [],
       numberOfControls = 0;

   /**
    * Instantiates a control with selected element.
    * @method Execute
    * @private
    * @param {Array} $node A jQuery collection with the selected elements.
    * @param {String} key The name of the Control.
    * @param {Function} Control The Control's constructor.
    * @return {Void}
    */
    function Execute( $node ) {
      var config = $node.data( 'lu-config' ),
       keys = Lu.getKeys( $node );

      config = config || '{}';

      _.each( keys, function( key, index ) {
        var Control,
          pckg = settings.namespace + '/' + key.replace( /:/g, '/' ),
          nodeData;

        config = Function( '$this', 'var config =' + config + '[\'' + key + '\'] || {}; return config;')( $node );
        Control = new packages[pckg]( $node, config );

        nodeData = getData( $node, key );

        if( nodeData ) {
          nodeData['instance'] = Control;
        } else {
          nodeData = {};
          nodeData[key] = {};
          nodeData[key]['instance'] = Control;
          setData( $node, nodeData );
        }

      } );

     _.each( Lu.getControls( $node ), function( item, index ) {
        item.trigger( 'lu-executed', [keys] );
      } );
      setData( $node, { 'executed': true } );
    }

    $controls = Lu.getDescendants( $element );

    if( Lu.isControl( $element ) ) {
      $controls = $controls.add( $element );
    }

    //Filter out controls that are already executed
    $controls = $controls.filter( function( index, item ) {
      return ( Lu.isExecuted( $( item ) ) ? false : true );
    } );

    //Construct an array of required packages && init the Deferred Object
    _.each( $controls, function( node, index ) {
      var $node = $( node ),
        Deferred,
        controls;

      Deferred = getData( $node, 'Deferred' );


      if( !Deferred ) {
        setData( $node, { 'Deferred': $.Deferred() } );
      }

      controls = Lu.getKeys( $node );
      numberOfControls += controls.length;

      _.each( controls, function( key, index ) {

        var pckg = settings.namespace + '/' + key.replace( /:/g, '/' );
        if( _.indexOf( required, pckg ) === -1 && _.indexOf( _.keys( packages, pckg ) ) === -1 ) {
          required.push( pckg );
        }
      } );

    } );

      
    // Test to see if necessary CommonJS interfaces exists
    try {

      window.require.ensure( required, function( require, module, exports ) {
        _.each( required, function( requirement, index ) {
          packages[ requirement ] = require( requirement );
        } );
                
        $controls.each( function( index, control ) {
          var defObj,
            $control = $(control);
          Execute( $control );
          numberOfControls -= 1;

          if( numberOfControls === 0 ) {
            $element.trigger( 'lu-ready', [ $element ] );
          }

          // Resolve any deferred objects stored within the control's data object.
          defObj = getData( $control, DEFERRED );

          if ( defObj ) { 
            if( !defObj.isResolved() ) {
              defObj.resolve();
            }
          }

        } );

      } );

    } catch( error ) {}
    return $element;

  }; 

  /**
   * Notifies observers of events
   * @public
   * @static
   * @method notifys
   * @param {Object} $element a jQuery collection
   * @param {string} event the event type
   * @param {Array} $element extra arguments associated with the event
   * @return {Object} The target element (allows chaining)
   */
  Lu.notify = function( $element, event, parameters ) {
    var $observers = getData( $element, '$observers' );

    if ( $observers ) {
      $observers.each( function ( index, item ) {
        var $item = $( item ),
          Deferred;

        Deferred = getData( $item, 'Deferred' );

        if ( Deferred ) {
          // If the deferred object is already resolved
          // adding a new .done() fires the enclosed function
          // immediately.
          Deferred.done( function () {
            _.each( Lu.getControls( $item ), function( item, index ) {
              item.trigger( event, parameters );
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
  Lu.observe = function( $element, $observer ) {

    var $observers = getData( $element, '$observers' ) || $( [] );

    $observer = $observer.not( $observers );
    $observers = $observers.add( $observer );

    setData( $element, { '$observers': $observers } );

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
  Lu.unobserve = function( $element, $observer ) {
    var data = getData( $element ),
      $observers;

    if( _.keys( data ).length === 0 ) {
      return $element;
    }

    $observers = data['$observers'];

    if( $observers ){
      $observers = $( _.reject( $observers, function( item, index ) {
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
  Lu.destroy = function( $element ) {
    var $controls = Lu.getDescendants( $element );
    if( $element.is( UI_CONTROL_PATTERN ) ) {
      $controls = $controls.add( $element );
    }
    $controls.removeData( 'lu', 'lu-controls', 'lu-config' );
    return $controls;
  };

  /**
   * Using json.stringify will break in older browsers, so inject
   * in an external library when needed.  Otherwise use the native functionality.
   * @method JSONify
   * @private
   * @param {Object} obj A JSON object to convert to a string.
   * @return {Void}
   */
  var JSONify = function (obj) {};

  ( function () {
    var LIBPATH = "/scripts/libraries/json2.js";
    if ( window.JSON ) {
      // Use the native JSON method
      JSONify = window.JSON.stringify;
    }
    else {
      // Otherwise Inject Crockford's JSON library and assign to our placeholder function
      require.ensure([LIBPATH], function () {        
        var JSON2lib = require(LIBPATH);
        JSONify = (JSON2lib && JSON2lib.stringify) ? JSON2lib.stringify: JSONify;
      });            
    }

  }());
  
  
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
  Lu.decorate = function( $element, keys, settings ) {
        
    var nodeKeys = ( $element.attr( ATTR ) ) ? $element.attr( ATTR ).split( ' ' ) : [];
    keys = _.union( nodeKeys, keys );
    settings = settings;
    if( settings ) {
      return $element.attr( ATTR, keys.join( ' ' ) ).attr( ATTR + '-config', JSONify( settings ) );
    }
    return $element.attr( ATTR, keys.join( ' ' ) );
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
  Lu.create = function( $element, keys, settings ) {
    return Lu.execute( Lu.decorate( $element, keys, settings ) );
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
  Lu.getControl = function( $element, key ) {
    var data = getData( $element ),
      instance;

    if( _.keys( data ).length === 0 ) {
      return null;
    }

    if( key ) {
      instance = data[key]['instance'];
    } else {
      _.each( data, function( item, index ) {
        if( !instance ) {
          instance = item['instance'];
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
  Lu.getControls = function( $element ) {
    var data = getData( $element ),
      keys,
      controls = null;

    if( _.keys( data ).length === 0 ) {
      return controls;
    }

    keys = Lu.getKeys( $element );

    _.each( _.keys( data ), function( key, index ){

      if( _.indexOf( keys, key ) > -1 ) {
        if( !controls ) {
          controls = {};
        }
        controls[key] = Lu.getControl( $element, key );
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
  Lu.getDescendants = function( $element, filter ) {
    if( filter ) {
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
  Lu.getChildren = function( $element, filter ) {
    if( filter ) {
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
  Lu.getParent = function( $element, filter ) {
    if( filter ) {
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
  Lu.getParents = function( $element, filter ) {
    if( filter ) {
      return $element.parents( UI_CONTROL_PATTERN ).filter( filter );
    } else {
      return $element.parents( UI_CONTROL_PATTERN );
    }
  };

  /**
   * Gets the JQuery data object for an Lu control 
   * within the 'lu-controls' namespace
   * @method getData
   * @private
   * @param {Object} $element A jQuery object representing the control's DOM node
   * @param {String} key An optional data key
   * @return {Object} The data object
   */
  function getData( $element, key ) {
    var data = $element.data( 'lu-controls' ),
      ret;

    if( data ) {
      if( key ) {
        ret = data[key];
      } else {
        ret = data;
      };
    } else if( key ) {
      ret = undefined;
    } else {
      $element.data('lu-controls', {} );
      ret = {};
    }

    return ret;
  };

  /**
   * Sets the JQuery data object for an Lu control 
   * within the 'lu-controls' namespace
   * @method setData
   * @private
   * @param {Object} $element A jQuery collection
   * @param {Object} data An object containing the new data to store
   * @return {Object} The target element (allows chaining)
   */
  function setData( $element, data ) {
    // Mixin the new data with the current data.
    $element.data( 'lu-controls', $.extend( true, getData( $element ), data ) );
    return $element;
  };

// Bind Lu to jQuery
  ( function( $ ) {
    var trigger = $.fn.trigger;
        on = $.fn.on;

    /**
     * Lu JQuery plugin 
     * @method lu
     * @public
     */    
    $.fn.lu = function() {
      var $this = $( this ),
        parameters = Array.prototype.slice.call( arguments ),
        method = parameters[0];
      
      parameters[ 0 ] = $this;

      if( typeof Lu[method] === 'function' ) {
        return Lu[method].apply( $this, parameters );
      }

    };

    /**
     * Wrap jQuery's 'trigger' with Lu functionality. See: http://api.jquery.com/trigger/
     * @method trigger
     * @public
     * @param {String} event An event type
     * @param {Array} parameters Additional data to be passed to the callback handler
     */
    $.fn.trigger = function( event, parameters ) {
      var $this = $( this ),
        $descendants;

      if( Lu.isControl( $this ) ) {
        Lu.notify( $this, event, parameters );
      }
      return trigger.apply( $this, [event, parameters] );
    };

    // $.fn.on = function() {
    //   var $this = $( this ),
    //     handler,
    //     parameters;
    // 
    //   if( Lu.isControl( $this ) ) {
    //     parameters = Array.prototype.slice.call( arguments );
    //     _.each( parameters, function( parameter, index ) {
    //       if( typeof parameter === 'function' ) {
    //         parameters[index] = function() {
    //           var parameters = Array.prototype.slice.call( arguments );

    // TODO: if propagation is stopped, and not detecting if the target is itself

    //           if( !parameters[0].isPropagationStopped() ) {
    //            parameter.apply( $this, parameters );
    //           }
    //         }
    //       }
    //     } );
    //     return on.apply( $this, parameters );
    //   } else {
    //     return on.apply( $this, arguments );
    //   }
    // };

  } ( jQuery ) );

  //Parse the body, load and instantiate all controls
  $( function() {
    Lu.execute( Lu.decorate( $( 'body' ), ['Abstract'] ) );
  } );

};


//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( new Lu( LU_CONFIG ) );
  } else if( module.exports ) {
   module.exports = new Lu( LU_CONFIG ); 
  }
}