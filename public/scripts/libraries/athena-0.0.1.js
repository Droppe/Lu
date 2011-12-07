/*!
 * Athena UI Framwork v0.0.1
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

$( 'body' ).on( 'athena-executed', function( event, control ) {
  console.log( $( this ).is( event.target ) );
  console.log( 'control', control );
} );

$( 'body' ).on( 'athena-ready', function( event, executed ) {
  console.log('YEAAAAA!!!!!!!', executed );
} );

var ATHENA_CONFIG = window.ATHENA_CONFIG || {},
  Athena;

Athena = function( settings ) {
  var Athena = this,
    defaults = {
      namespace: 'athena',
      debug: false,
      moduleRoot: "/scripts/packages",
      // inject -- cache for one day
      moduleExpire: 1440 
    };

  settings = settings || {};
      
  _.defaults( settings, defaults );

  ATTR = 'data-' + settings.namespace;
  UI_CONTROL_PATTERN = '[' + ATTR + '*="ui:"]';

  /**
   * Binds to jQuery and provides helper functions.
   * @private
   * @param {Object} jQuery
   */
  ( function( $ ) {
      var packages = {},
      on = $.fn.on,
      off = $.fn.off,
      trigger = $.fn.trigger;

    /**
     * Queues a control for execution with selected node.
     * @method enqueue
     * @private
     * @param {String} key The name of controll to queue
     * @param {Array} $node A jQuery collection to instantiate control with
     */
    function enqueue( key, $node ) {
      if( $node.data().queued ) {
        return;
      } else {
        if( queues[key] ) {
          queues[key].push( $node );
        } else {
          queues[key] = [$node];
        }
        $node.data( 'queued', true );
      }
    }

    /**
     * Returns an array of control keys on a $node.
     * @method getKeys
     * @private
     * @param {Array} $node A jQuery collection with the selected elements.
     */
    function getKeys( $node ) {
      return ( $node.attr( ATTR ) || '' ).split( ' ' );
    }

    /**
     * Returns a jQuery collection of non instantiated children of a node.
     * @method getDecendants
     * @private
     * @param {Array} $node A jQuery collection with the selected elements.
     */
    function getDecendants( $node ) {
      return $( _.reject( $( UI_CONTROL_PATTERN, $node ), function( item, index ) {
        return isReady( $( item ) );
      } ) );
    }

    /**
     * Checks to see if a node is ready.
     * @method isReady
     * @private
     * @param {Array} $node A jQuery collection with the selected elements.
     */
    function isReady( $node ) {
      var controls;
      if( getDecendants( $node ).length === 0 ) {
        controls = $node.data( 'controls' );
        if( controls ) {
          if( _.keys( controls ).length === getKeys( $node ).length ) {
            return true;
          }
        }
      }

      return false;
    }

    /**
     * Instantiates a control with selected element.
     * @method execute
     * @private
     * @param {Array} $node A jQuery collection with the selected elements.
     * @param {String} key The name of the Control.
     * @param {Function} Control The Control's constructor.
     */
    function execute( $node ) {
      var config = $node.data( settings.namespace + 'Config' ),
        keys = getKeys( $node );

      config = config || '{}';

      _.each( keys, function( key, index ) {
        var pckg = key.replace( /\:/g, '/' );
        var Control = new packages[pckg]( $node, new Function( '$this', 'var config =' + config + '[\'' + key + '\'] || {}; return config;')( $node ) );
        console.info( 'Action ' + key + ' executed with', $node );

        if( $node.data( 'athena-controls' )[pckg] ) {
          $node.data( 'athena-controls' )[pckg]['instance'] = Control;
        } else {
          $node.data( 'athena-controls')[ pckg ] = { 'instance': Control };
        }

        $node.trigger( 'athena-executed', [ pckg ] );

      } );

    }

    /**
     * Parses the DOM starting with selected element, requires necessary JS Files, and instantiates Athena controls. 
     * @method getControl
     * @public
     * @param {String} id The id of returned control.
     */
    $.fn.execute = function() {
      var $this = $( this ),
        $controls,
        keys = [],
        required = [],
        numberOfControls = 0;

      $controls = $( UI_CONTROL_PATTERN, $this );

      if( $this.is( UI_CONTROL_PATTERN ) ) {
        $controls = $controls.add( $this );
      }

      $controls.each( function( index, item ) {

        var $item = $( item ),
          athenaData;

        athenaData = $item.data( 'athena-controls' );

        if( athenaData === undefined ) {
          $item.data( 'athena-controls', {} );
          athenaData = $item.data( 'athena-controls' );
        }

      } );

      $controls.filter( function( item ) {
        var $item = $( item ),
          athenaData,
          isReady = true;

        athenaData = $item.data( 'athena-controls' );

        _.each( athenaData, function( item, index ) {
          if( isReady && item.state !== 'ready' ) {
            isReady = false;
            return;
          }
        } );

        return isReady;

      } );

      //Construct an array of required packages
      _.each( $controls, function( node, index ) {
        var $node = $( node ),
          controls;
        controls = $node.attr( ATTR ).split( ' ' );

        numberOfControls += controls.length;

        _.each( $node.attr( ATTR ).split( ' ' ), function( key, index ) {
          var pckg = key.replace( /\:/g, '/' );
          if( _.indexOf( required, pckg ) === -1 && _.indexOf( _.keys( packages, pckg ) ) === -1 ) {
            required.push( pckg );
          }
        } );
      } );

      // Test to see if nessasary CommonJS interfaces exists
       console.log( 'hello world' );
      try {
        window.require.setExpires( settings.moduleExpire );
        window.require.setModuleRoot( settings.moduleRoot );
        window.require.ensure( required, function( require, module, exports ) {
          console.log( 'hello world 2' );
          _.each( required, function( requirement, index ) {
            packages[ requirement ] = require( requirement );
          } );
          $controls.each( function( index, control ) {
            execute( $( control ) );
            numberOfControls -= 1;
            console.log(numberOfControls);
            if( numberOfControls === 1 ) {
              $this.trigger( 'athena-ready', [ $this ] );
            }
          } );
          
          _.log("YOJIMG", "Athena executing", module);
          if ( $this.is("body") ) {
            $this.trigger("athena-ready");
          }
          
        } );
      } catch( error ) {}

      return $this;

    };

    /**
     * Calls Athena.getControl with selected elements
     * @method getControl
     * @public
     * @param {String} id The id of returned control.
     */
    $.fn.getControl = function( id ) {
      return Athena.getControl( $( this ), id );
    };

    /**
     * Wrap jQuery's 'trigger' with Athena functionality. See: http://api.jquery.com/trigger/
     * @method trigger
     * @public
     */
    $.fn.trigger = function( event, parameters ) {
       var $this = $( this );
       $this.notify( event, parameters );
       return trigger.apply( $this, [event, parameters] );
    };

     /**
      * Notifies all observers of an event
      * @method notify
      * @public
      * @param {String} A string containing a JavaScript event type, such as click or submit.
      * @param {Array} Additional parameters to pass along to the event handler.
      */
     $.fn.notify = function( event, parameters ) {
       var $this = $( this );
       if( $this.data( '$observers' ) ) {
         $this.data( '$observers' ).trigger( event, parameters );
       }
     };

     /**
      * Adds an observer
      * @method observe
      * @public
      * @param {Array} $observer A jQuery collection of of observers.
      */
     $.fn.observe = function( $observer ) {
       var $this = $( this );
       if( $this.data( '$observers' ) ) {
         $this.data( '$observers' ).add( $observer );
       } else {
         $this.data( '$observers', $observer );
       }
     };

     /**
      * Removes an unobserve
      * @method unobserve
      * @public
      * @param {Array} $observer A jQuery collection.
      */
     $.fn.unobserve = function( $observer ) {
       var $this = $( this ),
         $observers;

       $observers = $this.data( '$observers' );

       if( $observers ){
         $observers = $( _.reject( $observers, function( item, index ) {
           return $observer.is( item );
         } ) );
         $this.data( '$observers', $observers );
       }
       return $this;

     };

  } ( jQuery ) );

  Athena.destroy = function( $element ) {
    var $controls;
    $controls = $( UI_CONTROL_PATTERN, $element );

    if( $element.is( UI_CONTROL_PATTERN ) ) {
      $controls = $controls.add( $element );
    }

    $controls.removeData( 'athena', '$observers', 'controls' );

  };

  /**
   * Factory for creating Controls.
   * @public
   * @static
   * @param {Object} jQuery
   * @param {Object} keys to be decorated
   * @param {Object} settings to be used in creation of controls
   */
  Athena.create = function( $node, keys, settings ) {
    return Athena.decorate( $node, keys, settings ).execute();
  };

  /**
   * Decorates a node with Athena markup.
   * @public
   * @stati
   * @param {Object} jQuery
   * @param {Object} keys to be decorated
   * @param {Object} settings to be used in creation of controls
   */
  Athena.decorate = function( $node, keys, settings ) {
    var nodeKeys = ( $node.attr( ATTR ) ) ? $node.attr( ATTR ).split( ' ' ) : [];

    keys = _.union( nodeKeys, keys );
    return $node.attr( ATTR, keys.join( ' ' ) ).attr( ATTR + '-config', settings );
  };

  /**
   * Returns a control with id, or an array of all controls instantiated with selected element.
   * @method getControl
   * @public
   * @static
   * @param {String} id The id of returned controll.
   */
  Athena.getControl = function( $node, id ) {
    var controls,
      control;
    if( id ) {
      return $node.data( 'controls' )[id];
    } else {
      controls = _.values( $node.data( 'controls' ) );
    }
    return controls;
  };

  $( function() {

    var $body = $( 'body' );
    Athena.decorate( $body, ['ui:Abstract'] );
    $body.execute();
  } );

};

//Export to CommonJS Loader
if( module && module.exports ) {
  module.exports = new Athena( ATHENA_CONFIG );
}

localStorage.clear();
