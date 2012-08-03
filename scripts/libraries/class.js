/**
 * Class Inheritance model
 *
 * Copyright (c) 2012 LinkedIn.
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
( function( window ){
  // Stores whether the object is being initialized, and thus not
  // run the <init> function, or not.
  var initializing = false;

  function copy(from, to) {
    var name;
    for( name in from ){
      if( from.hasOwnProperty( name ) ){
        to[name] = from[name];
      }
    }
  }

  // The base Class implementation
  function Class(){};

  // Create a new Class that inherits from this class
  Class.extend = function( fn ){

    //debugger;
    
    // Keep a reference to the current prototye
    var base = this.prototype,
      // Invoke the function which will return an object literal used to define
      // the prototype. Additionally, pass in the parent prototype, which will
      // allow instances to use it
      properties = fn( base ),
      // Stores the constructor's prototype
      proto;

       // The dummy class constructor
      function constructor(){
        if( !initializing && typeof this.init === "function" ){
          // All construction is done in the init method
          this.init.apply( this, arguments );
          // Prevent any re-initializing of the instance
          delete this.init;
        }
      }

      // Instantiate a base class (but only create the instance, don't run the init function),
      // and make every <constructor> instance an instanceof <this> and of <constructor>
      initializing = true;
      proto = constructor.prototype = new this;
      initializing = false;

       // Copy the properties over onto the new prototype
      copy( properties, proto );

      // Enforce the constructor to be what we expect
      proto.constructor = constructor;

      // TO BE REMOVED, just here for backwards compatibility
      // Add <decorate> ability
      proto.decorate = function( /*decorator[s]*/ ){
        var i,
          len = arguments.length;

        for( i = 0 ; i < len; i += 1 ){
          arguments[i]( this, base );
        }

      };
      //////////////////////

      // Keep a reference to the parent prototype.
      // This is needed in order to support decorators
      constructor.__base = base;

       // Make this class extendable
      constructor.extend = Class.extend;

      // Add ability to create singleton
      constructor.singleton = Class.singleton;

      // ... as well as mixin ability
      constructor.mixin = function( /* mixin[s] */ ) {
        var i,
          len = arguments.length

        for( i = 0; i < len; i++ ){
          copy( arguments[i]( base ), proto );
        }
      }

      return constructor;
  };

  // Returns a proxy object for accessing base methods
  // with a given context
  Class.proxy = function( base, instance ) {
    var name,
      iface = {},
      wrap = function( fn ) {
        return function() {
          return base[fn].apply( instance, arguments );
        };
      };

    // Create a wrapped method for each method in the base
    // prototype
    for( name in base ){
      if( base.hasOwnProperty( name ) && typeof base[name] === "function" ){
        iface[name] = wrap( name );
      }
    }
    return iface;
  }

  /**
   * @purpose: Decorate an instance with given decorator(s)
   * @param instance {Object} Class instance to be decorated
   * @param decorators {Function|[Functions]} A single decorator or a list of decorators to apply
   * @param(s) args Remaining arguments to be passed into each decorator
   *
   * (Note: when a decorator is called, the first arguments passed is is the super class prototype
   * (i.e., the base))
   *
   * Example usage:
   *
   *  function Decorator(base, arg1, arg2) {
   *     // this === obj
   *     // arg1 === 1
   *     // arg2 === 2
   *  }
   *
   *  var obj = new Bar(); // Some Class instance
   *  Class.decorate(obj, 1, 2);
   */
  Class.decorate = function( instance, decorators /*, arg[s] */ ) {
    var i,
      decorators = Object.prototype.toString.call(decorators) === "[object Array]" ? decorators : [decorators],
      len = decorators.length,
      base = instance.constructor.__base,
      // Get the rest of the arguments, if any are specified
      args = Array.prototype.slice.call(arguments, 2);

    // Prepend the the base object
    args.unshift(base);

    for( i = 0; i < len; i++ ){
      decorators[i].apply( instance, args );
    }
  }

  // Return a singleton
  Class.singleton = function( fn ) {
    var obj = this.extend( fn ),
      args = arguments;

    return ( function() {
      var instance;

      return {
        getInstance: function() {
          var temp;

          // Create an instance, if it does not exist
          if ( !instance ) {

            // If there are additional arguments specified, they need to be
            // passed into the constructor.
            if ( args.length > 1 ) {
              // temporary constructor
              temp = function(){};
              temp.prototype = obj.prototype;

              instance = new temp;

              // call the original constructor with 'instance' as the context
              // and the rest of the arguments
              obj.prototype.constructor.apply( instance, Array.prototype.slice.call( args, 1 ) );

            } else {
              instance = new obj();
            }

          }

          return instance;
        }
      }
    })();
  }

   //Export to Common JS Loader
  if( typeof module !== "undefined" ){
    if( typeof module.setExports === "function" ){
      module.setExports( Class );
    } else if( module.exports ){
      module.exports = Class;
    }
  } else {
    window.Class = Class;
  }

}( window ) );