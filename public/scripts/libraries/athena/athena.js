/*!
 * Athena UI Framwork v0.0.2
 * https://github.com/iheartweb/AthenaUIFramework
 * Copyright (c) 2011 Robert Martone
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var ATHENA_CONFIG = window.ATHENA_CONFIG || {},
  Athena;

/*
 * Don't do Gilligan's Island if you want to be a serious actress.
 */


Athena = function( settings ) {
  var Athena = this,
    defaults = {
      namespace: 'athena',
      debug: false,
      useCommonJSLoader: true,
      prefixes: ['ui']
    },
    ATTR,
    UI_CONTROL_PATTERN = '[data-athena]',
    DEFERRED = 'Deferred',
    packages = {};

  settings = settings || {};

  _.defaults( settings, defaults );

  ATTR = 'data-' + settings.namespace;

  //Setup require statement
  if ( !typeof window.require === 'function' && !window.module || !ATHENA_CONFIG.useCommonJSLoader ) {
    window.require = function( id ) {
      id = id.split( '/' ).pop();
      id.reverse();
      return window[ id.join('') ];
    };
    delete window.module;
  }

  /**
   * Returns true if the passed in element is a control an optional key can be used to match a speciffic Control
   * @public
   * @static
   * @method isControl
   * @param {Object} $element a jQuery collection
   * @param {String} key The name of Athena component to test
   * @return {Boolean} True if the element is a control
   */
  Athena.isControl = function( $element, key ) {
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
  Athena.isReady = function( $element ) {
    var $controls = Athena.getDescendants( $element ).filter( function( item ) {
      return Athena.isExecuted( $( item ) );
    } );
    if( $controls.length === 0 && Athena.isExecuted( $element ) ) {
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
  Athena.isExecuted = function( $element ) {
    return ( ( getData( $element, 'executed' ) ) ? true : false );
  };

  /**
   * Returns an array of all Athena keys on $element
   * @public
   * @static
   * @method getKeys
   * @param {Object} $element a jQuery collection
   * @return {Array} An array of Athena keys 
   */
  Athena.getKeys = function( $element ) {
    return ( $element.attr( ATTR ) || '' ).split( ' ' );
  };

  /**
   * Parses the $element for Athena controls, loads, and instatiates them.
   * @public
   * @static
   * @method execute
   * @param {Object} $element a jQuery collection
   * @return {Object} The executed element (allows chaining)
   */
  Athena.execute = function( $element ) {
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
    function execute( $node ) {
      var config = $node.data( 'athena-config' ),
       keys = Athena.getKeys( $node );

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

     _.each( Athena.getControls( $node ), function( item, index ) {
        item.trigger( 'athena-executed', [keys] );
      } );
      setData( $node, { 'executed': true } );
    }

    $controls = Athena.getDescendants( $element );

    if( Athena.isControl( $element ) ) {
      $controls = $controls.add( $element );
    }

    //Filter out controls that are already executed
    $controls = $controls.filter( function( index, item ) {
      return ( Athena.isExecuted( $( item ) ) ? false : true );
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

      controls = Athena.getKeys( $node );
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
          execute( $control );
          numberOfControls -= 1;

          if( numberOfControls === 0 ) {
            $element.trigger( 'athena-ready', [ $element ] );
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
  Athena.notify = function( $element, event, parameters ) {
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
            _.each( Athena.getControls( $item ), function( item, index ) {
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
  Athena.observe = function( $element, $observer ) {

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
  Athena.unobserve = function( $element, $observer ) {
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
   * Destroys the binding of an Athena control to the $element
   * @public
   * @static
   * @method destroy
   * @param {Object} $element a jQuery collection
   * @return {Object} A JQuery collection of Athena controls
   */
  Athena.destroy = function( $element ) {
    var $controls = Athena.getDescendants( $element );
    if( $element.is( UI_CONTROL_PATTERN ) ) {
      $controls = $controls.add( $element );
    }
    $controls.removeData( 'athena', 'athena-controls', 'athena-config' );
    return $controls;
  };

  /**
   * Decorates a node with Athena markup.
   * @method decorate
   * @public
   * @static
   * @param {Object} $element a jQuery collection
   * @param {Object} keys to be decorated
   * @param {Object} settings to be used in creation of controls
   * @return {String} The conjoined keys
   */
   //TODO: USING JSON.STRINGIFY WILL BREAK IN OLDER BROWSERS
  Athena.decorate = function( $element, keys, settings ) {
    var nodeKeys = ( $element.attr( ATTR ) ) ? $element.attr( ATTR ).split( ' ' ) : [];
    keys = _.union( nodeKeys, keys );
    settings = settings;
    if( settings ) {
      return $element.attr( ATTR, keys.join( ' ' ) ).attr( ATTR + '-config', JSON.stringify( settings ) );
    }
    return $element.attr( ATTR, keys.join( ' ' ) );
  };

  /**
   * Decorates a node with Athena markup and instantiates controls.
   * @method create
   * @public
   * @static
   * @param {Object} $element a jQuery collection
   * @param {Object} keys to be decorated
   * @param {Object} settings to be used in creation of controls
   * @return {Object} The target element (allows chaining)
   */
  Athena.create = function( $element, keys, settings ) {
    return Athena.execute( Athena.decorate( $element, keys, settings ) );
  };

  /**
   * Returns a control instance with id
   * @method getControl
   * @public
   * @static
   * @param {Object} $element a jQuery collection
   * @param {String} key The id of returned control.
   * @return {Object} The specified Athena control or the first control found if none specified
   */
  Athena.getControl = function( $element, key ) {
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
   * @return {Object} The Athena controls associated with the given element
   */
  Athena.getControls = function( $element ) {
    var data = getData( $element ),
      keys,
      controls = null;

    if( _.keys( data ).length === 0 ) {
      return controls;
    }

    keys = Athena.getKeys( $element );

    _.each( _.keys( data ), function( key, index ){

      if( _.indexOf( keys, key ) > -1 ) {
        if( !controls ) {
          controls = {};
        }
        controls[key] = Athena.getControl( $element, key );
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
  Athena.getDescendants = function( $element, filter ) {
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
  Athena.getChildren = function( $element, filter ) {
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
  Athena.getParent = function( $element, filter ) {
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
  Athena.getParents = function( $element, filter ) {
    if( filter ) {
      return $element.parents( UI_CONTROL_PATTERN ).filter( filter );
    } else {
      return $element.parents( UI_CONTROL_PATTERN );
    }
  };

  /**
   * Gets the JQuery data object for an Athena control 
   * within the 'athena-controls' namespace
   * @method getData
   * @private
   * @param {Object} $element A jQuery object representing the control's DOM node
   * @param {String} key An optional data key
   * @return {Object} The data object
   */
  function getData( $element, key ) {
    var data = $element.data( 'athena-controls' ),
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
      $element.data('athena-controls', {} );
      ret = {};
    }

    return ret;
  };

  /**
   * Sets the JQuery data object for an Athena control 
   * within the 'athena-controls' namespace
   * @method setData
   * @private
   * @param {Object} $element A jQuery collection
   * @param {Object} data An object containing the new data to store
   * @return {Object} The target element (allows chaining)
   */
  function setData( $element, data ) {
    // Mixin the new data with the current data.
    $element.data( 'athena-controls', $.extend( true, getData( $element ), data ) );
    return $element;
  };

  /**
   * Bind Athena to jQuery.
   * @private
   * @param {Object} jQuery
   * @return {Void}
   */
  ( function( $ ) {
    var trigger = $.fn.trigger;
        on = $.fn.on;

    $.fn.athena = function() {
      var $this = $( this ),
        parameters = Array.prototype.slice.call( arguments ),
        method = parameters[0];
      
      parameters[ 0 ] = $this;

      if( typeof Athena[method] === 'function' ) {
        return Athena[method].apply( $this, parameters );
      }

    };

    /**
     * Wrap jQuery's 'trigger' with Athena functionality. See: http://api.jquery.com/trigger/
     * @method trigger
     * @public
     * @param {String} event An event type
     * @param {Array} parameters Additional data to be passed to the callback handler
     */
    $.fn.trigger = function( event, parameters ) {
      var $this = $( this ),
        $descendants;

      if( Athena.isControl( $this ) ) {
        Athena.notify( $this, event, parameters );
      }
      return trigger.apply( $this, [event, parameters] );
    };

    $.fn.on = function() {
      var $this = $( this ),
        handler,
        parameters;

      if( Athena.isControl( $this ) ) {
        parameters = Array.prototype.slice.call( arguments );
        _.each( parameters, function( parameter, index ) {
          if( typeof parameter === 'function' ) {
            parameters[index] = function() {
              var parameters = Array.prototype.slice.call( arguments );
              if( !parameters[0].isPropagationStopped() ) {
               parameter.apply( $this, parameters );
              }
            }
          }
        } );
        return on.apply( $this, parameters );
      } else {
        return on.apply( $this, arguments );
      }
    };

  } ( jQuery ) );

  //Parse the body, load and instantiate all controls
  $( function() {
    Athena.execute( Athena.decorate( $( 'body' ), ['Abstract'] ) );
  } );

};


//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ){
    module.setExports( new Athena( ATHENA_CONFIG ) );
  } else if( module.exports ) {
   module.exports = new Athena( ATHENA_CONFIG ); 
  }
}