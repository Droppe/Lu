( function(){
  this.$mapped = $( [] );
  this.Map = Fiber.extend( function(){
    var Observer,
      Maps = [],
      observationSettings = {
        childList: true,
        subtree: true,
      };

    function handler( records ){
      _.each( records, function( record, index ){
        _.each( record.addedNodes, function( node, index ){
          var $node;

          if( _.indexOf( ['SCRIPT', 'LINK', 'STYLE', 'META', 'HEAD', 'HTML', 'BASE'], node.nodeName ) !== -1 ){
            return;
          }

          $node = $( node );

          _.each( Maps, function( map, index ){
            map.execute();
          } );

        } );
      } );
    }

    function map( $element, component, callback ){
      var mapped = [];

      _.each( $element, function( item, index ){
        var $element = $( item ),
          componentData,
          deferral,
          settings,
          configuration = item.getAttribute( 'data-lu-config' ),
          key;

        componentData = $element.lu( 'getComponents' );

        if( !$element.data( 'mapped' ) ){
          $element.data( 'mapped', true );
          mapped.push( item );
        }

        if( !componentData[component] ){
          deferral = $.Deferred();
          componentData[component] = {
            deferral: deferral,
            ready: deferral.then,
            settings: {}
          };
        } else {
          _.extend( componentData[component].settings, {} );
        }

        if( callback ){
          callback.call( componentData[component], $element );
        }

        key = componentData[component].key || component;

        if( configuration ){
          try {
            configuration = ( function(){ return eval( '( function(){ return ' + configuration + '; }() );' ); }()[key] || {} );
          } catch( e ){
            configuration = {};
          }
        } else {
          configuration = {};
        }

        componentData[component].settings = _.extend( componentData[component].settings, configuration );
      } );

      this.$mapped = this.$mapped.add( mapped );
    }

    function getScope( scope ){
      var $scope;
      if( scope ){
        if( scope instanceof $ ){
          $scope = scope;
        } else {
          $scope = $( scope );
        }
      } else {
        $scope = $( 'body' );
      }
      return $scope;
    }

    //TODO: Fallback to DOMMutationEvents https://developer.mozilla.org/en-US/docs/DOM/MutationObserver
    //TODO: Add Lu Supported Object
    if( this.MutationObserver !== undefined ){
      Observer = new MutationObserver( handler );
    } else if( this.WebKitMutationObserver !== undefined ){
      Observer = new WebKitMutationObserver( handler );
    }

    return {
      init: function(){
        this.maps = [],
        this.$mapped = $();
        Maps.push( this );
      },
      observe: function( scope ){
        _.each( getScope( scope ), function( element, index ){
          Observer.observe( element, observationSettings );
        } );
      },
      detach: function( scope ){
        _.each( getScope( scope ), function( element, index ){
          Observer.detach( element );
        } );
      },
      add: function( scope, component, executor ){
        this.maps.push( function(){
          map.call( this, getScope( scope ), component, executor );
          Lu.$mapped = Lu.$mapped.add( this.$mapped );
        } );
      },
      execute: function(){
        var self = this;
        _.each( this.maps, function( map, index ){
          map.call( self );
        } );
        Lu.execute( this.$mapped );
      }
    }
  } );
}.call( Lu ) );