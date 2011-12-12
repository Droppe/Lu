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
      moduleRoot: "/scripts/packages",
      moduleExpire: 1440,
      useCommonJSLoader: true,
      prefixes: ['ui']
    },
    ATTR,
    UI_CONTROL_PATTERN = [],
    packages = {};

  settings = settings || {};

  _.defaults( settings, defaults );

  ATTR = 'data-' + settings.namespace;

  _.each( settings.prefixes, function( item, index ) {
    UI_CONTROL_PATTERN.push('[' + ATTR + '*="' + item + ':"]');
  } );

  UI_CONTROL_PATTERN = UI_CONTROL_PATTERN.join(', ');

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
   * @method unobserve
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
   * @method unobserve
   * @param {Object} $element a jQuery collection
   * @return {Boolean} True if controls on $element are finished executing
   */
  Athena.isExecuted = function( $element ) {
    var isExecuted = $element.data( 'athena-controls' )['executed'];
    return ( $element.data( 'athena-controls' )['executed'] ) ? true : false;
  };

  /**
   * Returns an array of all Athena keys on $element
   * @public
   * @static
   * @method unobserve
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
        var pckg = key.replace( /\:/g, '/' ),
          Control;
        config = Function( '$this', 'var config =' + config + '[\'' + key + '\'] || {}; return config;')( $node );
        Control = new packages[pckg]( $node, config );
        console.info( 'Action ' + key + ' executed with', $node );

        if( $node.data( 'athena-controls' )[key] ) {
          $node.data( 'athena-controls' )[key]['instance'] = Control;
        } else {
          $node.data( 'athena-controls' )[key] = { 'instance': Control };
        }

      } );

      $node.trigger( 'athena-executed', [keys] );
      $node.data( 'athena-controls' )[ 'executed' ] = true;
    }

    $controls = Athena.getDescendants( $element );

    if( Athena.isControl( $element ) ) {
      $controls = $controls.add( $element );
    }
    
    $controls.each( function( index, item ) {
      var $item = $( item ),
        athenaData;
      athenaData = $item.data( 'athena-controls' );
      if( athenaData === undefined ) {
        $item.data( 'athena-controls', {} );
      }
    } );

    //Filter out controls that are already executed
    $controls = $controls.filter( function( index, item ) {
      return Athena.isExecuted( $( item ) ) ? false : true;
    } );
    
    //Construct an array of required packages
    _.each( $controls, function( node, index ) {
      var $node = $( node ),
        controls;
    
      controls = Athena.getKeys( $node );
      numberOfControls += controls.length;
    
      _.each( controls, function( key, index ) {
        var pckg = key.replace( /\:/g, '/' );
        if( _.indexOf( required, pckg ) === -1 && _.indexOf( _.keys( packages, pckg ) ) === -1 ) {
          required.push( pckg );
        }
      } );
    
    } );
    
    // Test to see if necessary CommonJS interfaces exists
    try {
      window.require.setExpires( settings.moduleExpire );
      window.require.setModuleRoot( settings.moduleRoot );
      window.require.ensure( required, function( require, module, exports ) {
        _.each( required, function( requirement, index ) {
          packages[ requirement ] = require( requirement );
        } );
        $controls.each( function( index, control ) {
          execute( $( control ) );
          numberOfControls -= 1;
          //This could be a one off error.
          if( numberOfControls === 0 ) {
            $element.trigger( 'athena-ready', [ $element ] );
          }
          // Resolve any deferred objects stored within the control's data object.
          if ( $(control).data("$deferred") ) {
            $(control).data("$deferred").resolve();
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
    var data = $element.data( 'athena-controls' ),
      $observers;

    if( !data ) {
      return $element;
    }

    $observers = data['$observers'];

    $observers.each(function (index, item) {
      var $item = $(item);
      if ( $item.data("$deferred") ) {
        // If the deferred object is already resolved
        // adding a new .done() fires the enclosed function
        // immediately.
        $item.data("$deferred").done( function () {
          $item.trigger( event, parameters );
        });
      }
    });

    return $element;

  };

  /**
   * Add and $observer to an $element
   * @public
   * @static
   * @method observe
   * @param {Object} $element a jQuery collection
   * @param {Object} $observer a jQuery collection
   * @return {Object} The target element (allows chaining)
   */
  Athena.observe = function( $element, $observer ) {
    $element.each( function( index, item ) {
      var $item = $( item ),
        $observers,
        data;

      data = $item.data( 'athena-controls' );

      if( !data ) {
        return;
      }

      $observers = data['$observers'];

      if( $observers && $observers.length ) {
        $observers = $observers.add( $observer );
      } else {
        $observers = $observer;
      }
      $item.data( 'athena-controls' )[ '$observers' ] = $observers;
    } );

    // Create and store a new Deferred object for each new
    // $observer passed into this method
    $observer.each( function (index, item) {

      // Don't overwrite any existing Deferred object ??
      if ( $(item).data("$deferred") ) {
        // tbd -- do nothing?
      }
      else {
        $(item).data("$deferred", $.Deferred() );
      }        
    });

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
    var data = $element.data( 'athena-controls' ),
      $observers;

    if( !data ) {
      return $element;
    }

    $observers = data['$observers'];

    if( $observers ){
      $observers = $( _.reject( $observers, function( item, index ) {
        return $observer.is( item );
      } ) );
      $element.data( 'athena-controls' )['$observers'] = $observers;
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
   * @public
   * @static
   * @param {Object} $element a jQuery collection
   * @param {Object} keys to be decorated
   * @param {Object} settings to be used in creation of controls
   * @return {String} The conjoined keys
   */
   //TODO: USING JSON.STRINGIGY WILL BREAK IN OLDER BROWSERS
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
   * Decorates a node with Athena markup instanciates controls.
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
   * @return {Object} The specified Athena control
   */
  Athena.getControl = function( $element, key ) {
    var data = $element.data( 'athena-controls' );
    if( !data ) {
      return null;
    }
    return $element.data( 'athena-controls' )[key]['instance'];
  };

  /**
   * Returns a controls object keyed by key
   * @method getControls
   * @public
   * @static
   * @param {Object} $element a jQuery collection
   * @return {Object} The Athena controls associated with the given element
   */
  Athena.getControls = function( $element ) {
    var data = $element.data( 'athena-controls' ),
      keys,
      controls = null;

    if( !data ) {
      return controls;
    }

    keys = Athena.getKeys( $element );

    _.each( _.keys( $element.data( 'athena-controls' ) ), function( key, index ){
      if( _.indexOf( keys, key ) > -1 ) {
        if( !controls ) {
          controls = {};
        }
        controls['key'] = Athena.getControl( $element, key );
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
   * @param {String} filter an optional css selector to use as a filter
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
   * Bind Athena to jQuery.
   * @private
   * @param {Object} jQuery
   * @return {Void}
   */
  ( function( $ ) {
    var trigger = $.fn.trigger;

    $.fn.athena = function() {
      var $this = $( this ),
        parameters = Array.prototype.slice.call( arguments ),
        method = parameters[0];
      
      parameters[ 0 ] = $this;

      if( typeof Athena[method] === 'function' ) {
        Athena[method].apply( $this, parameters );
      }
    };

    /**
     * Wrap jQuery's 'trigger' with Athena functionality. See: http://api.jquery.com/trigger/
     * @method trigger
     * @public
     */
    $.fn.trigger = function( event, parameters ) {
       var $this = $( this );
       Athena.notify( $this, event, parameters );
       return trigger.apply( $this, [event, parameters] );
    };

  } ( jQuery ) );

  //Parse the body, load and instantiate all controls
  $( function() {
    Athena.execute( Athena.decorate( $( 'body' ), ['ui:Abstract'] ) );
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