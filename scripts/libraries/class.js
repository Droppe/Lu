/**
 * Class Inheritance model
 *
 * Copyright (c) 2012 Kirollos Risk <kirollos@gmail.com>.
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

  // The base Class implementation
  function Class(){};

  // Create a new Class that inherits from this class
  Class.extend = function( fn ){
    // Keep a reference to the current prototye
    var base = this.prototype,
      // Invoke the function which will return an object literal used to define
      // the prototype. Additionally, pass in the base prototype, which will
      // allow instances to use the <base> keyword.
      props = fn( base ),
      // Stores the constructor's prototype
      proto,
      name;

       // The dummy class constructor
      function constructor(){
        if( !initializing && this.init ){
          // All construction is done in the init method
          this.init.apply( this, arguments );
        }
      }

      // Instantiate a base class (but only create the instance, don't run the init function)
      // Make every <constructor> instance an instanceof <this> and of <constructor>
      initializing = true;
      proto = constructor.prototype = new this;
      initializing = false;

       // Copy the properties over onto the new prototype
      for( name in props ){
        if( props.hasOwnProperty( name ) ){
          proto[name] = props[name];
        }
      }

      // Enforce the constructor to be what we expect
      proto.constructor = constructor;

       // Add <decorate> ability
      proto.decorate = function( /*decorator[s]*/ ){
        var i,
          len = arguments.length;

        for( i = 0 ; i < len; i += 1 ){
          arguments[i]( this, base );
        }

      };

       // Make this class extendable
      constructor.extend = Class.extend;

      return constructor;
  };

   //Export to Common JS Loader
  if( typeof module !== 'undefined' ){
    if( typeof module.setExports === 'function' ){
      module.setExports( Class );
    } else if( module.exports ){
      module.exports = Class;
    }
  } else {
    window.Class = Class;
  }

}( window ) );