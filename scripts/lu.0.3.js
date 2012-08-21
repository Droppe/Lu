/**
 * Lu Control Framework
 * @module Lu
 * @license
 * @author Robert Martone
 * 
 * Lu Control Framework v0.3.0
 *
 * Please thank the contributors: https://github.com/linkedin/Lu/graphs/contributors
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

var Lu;

function getComponents( $element ){
  var components = 'components';
  if( $element.length > 0 ){
    return $element.data( components ) || $element.data( components, {} ).data( components );
  } else {
    return {};
  }
}

window.Lu = new function(){
  var self = this;
  this.$mapped = $( [] );
  this.map = function( $element, component, callback ){
    _.each( $element, function( item, index ){
      var $element = $( item ),
        componentData = getComponents( $element ),
        settings,
        configuration,
        key;

      self.$mapped = self.$mapped.add( $element.not( self.$mapped ) );

      if( !componentData[component] ){

        componentData[component] = {
          deferral: $.Deferred(),
          settings: {}
        };

      } else {
        _.extend( componentData[component].settings, {} );
      }

      callback.call( self, $element, componentData[component] );

      key = componentData[component].key || component;

      try {
        configuration = ( function(){ return eval( '( function(){ return ' + $element.data( 'luConfig' ) + '; }() );' ); }()[key] || {} );
      } catch( error ){
        configuration = {};
      }

      componentData[component].settings = _.extend( componentData[component].settings, configuration );
    } );
  };
  this.execute = function( $element ){
    var $nodes = $element.find( this.$mapped ),
      deferral = $.Deferred(),
      requirements = [],
      count;

    if( $element.is( this.$mapped ) ){
      $nodes = $nodes.add( $element );
    }

    count = $nodes.length;

    function execute( $element ){
      var components = getComponents( $element );
      _.each( components, function( component, key ){
        var requirement = 'lu/' + key,
          settings = component.settings;

        requirements.push( requirement );

        count -= 1;

        deferral.then( function( required, module, exports ){

          var Component = require( requirement );

          try {
            component.instance = new Component( $element, settings );
            if( component.hasDependencies ){
              component.instance.one( 'dependencies-resolved', function( event, instance ){
                event.stopPropagation();
                component.deferral.resolve( component.instance );
              } );
            } else {
              component.deferral.resolve( component.instance );
            }
          } catch( error ){
            throw new Error( 'Component could not be instantiated.' );
          }
        } );

        if( count === 0 ){
          require.ensure( requirements, function( required, module, exports ){
            deferral.resolve( required, module, exports );
          } );
        }

      } );
    }

    _.each( $nodes, function( item, index ){
      execute( $( item ) );
    } );

    return deferral;
  };
}();

function getParents( $element ){
  return $element.parents( Lu.$mapped );
}

function getDescendants( $element ){
  return $element.find( Lu.$mapped );
}

function getChildren( $element ){
  return $element.children( Lu.$mapped );
}

function observe( $element, $observer ){
  var $observers = $element.data( '$observers' );

  if( !$observers ){
    return $element.data( '$observers', $observer );
  }

  $observers = $observers.add( $observer.not( $observers ) );
  $element.data( '$observers', $observers );

  return $element;
}

function unobserve( $element, $observer ){
  var $observers = $element.data( '$observers' );

  if( $observers ){
    $observers = $observers.not( $observer );
  }

  $element.data( '$observers', $observers );

  return $element;
}

function notify( $element, event, parameters ){
  var $observers = $element.data( '$observers' );

  if( $observers ){
    _.each( $observers, function( observer, index ){
      var $observer = $( observer ),
        components = getComponents( $observer ),
        deferrals = [];

      _.each( components, function( component, key ){
        var deferral = component.deferral;
        deferral.then( function(){
          var instance = component.instance;
          if( _.indexOf( instance.events(), event ) > -1 ){
            instance.trigger.call( instance, new $.Event( event, { target: $element } ), parameters );
          }
        } );

      } );

    } );
  }
  return $element;
}

( function( $ ){
  $.fn.lu = function(){
    var $this = $( this ),
      parameters = Array.prototype.slice.call( arguments ),
      method = parameters[0],
      retrn;

    parameters[0] = $this;

    switch( method ){
      case 'observe':
        retrn = observe.apply( $this, parameters );
        break;
      case 'unobserve':
        retrn = unobserve.apply( $this, parameters );
        break;
      case 'notify':
        retrn = notify.apply( $this, parameters );
        break;
      case 'getComponents':
        retrn = getComponents.apply( $this, parameters );
        break;
      case 'getParents':
        retrn = getParents.apply( $this, parameters );
        break;
      case 'getDescendants':
        retrn = getDescendants.apply( $this, parameters );
        break;
      case 'getChildren':
        retrn = getChildren.apply( $this, parameters );
        break;
      default:
        throw new Error( 'No such method.' );
    }

    return retrn;
  };
}( window.jQuery ) );


//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( Lu );
  } else if( module.exports ){
    module.exports = Lu;
  }
}

//Don't do Gilligan's Island if you want to be a serious actress!