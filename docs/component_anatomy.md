# Lu Component Anatomy

## A Note on Documentation
* TBD: JSDoc vs. YUIDoc

## Using Fiber

Lu uses [Fiber](https://github.com/krisk/Fiber/blob/master/README.md) for object inheritance and instance decoration.  A simple class using Fiber looks like 

```js
// Animal base class
var Animal = Fiber.extend(function() {
  return {
    // The init method serves as the constructor.
    init: function() {
      // Private
      function private1(){}
      function private2(){}
      // Privileged
      this.privileged1 = function(){};
      this.privileged2 = function(){};
    },
    // Public
    method1: function(){}
  };
});
```

The `init` method is automatically called when we create an instance of Animal

```js
var critter = new Animal();
```


## Component Doc block

Start off your component with a documentation block indicating what it does and what its dependencies are.

```js    
/**
 * My awesome class that does something cool!
 * @class AwesomeThing
 * @constructor
 * @extends Abstract
 * @require Container
 * @version 0.0.1
 */
```

## Variables and `require` statements

```js
var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Abstract = require( 'lu/Abstract' ),
  Container = require( 'lu/Container' ),
  Fiber = require( 'Fiber' ),
  AwesomeThing;
```

## Extending the Parent

```js
AwesomeThing = Abstract.extend( function (base){...}
```

## Static Variables, Default Config, and Constants

## The `init` method
1. Instance Variables

  These are private variables that are only scoped within the `init` method.
  Use only a single `var` statement for all such declared variables.
```js
// PRIVATE INSTANCE VARIABLES
var self = this,
  id = $element.attr('id');
```

2. Config mixin

  Here we override any of the default configuration values with those passed in via the settings object.
  (`_.defaults` is a helper method from the underscore.js library.)
```js
// MIX THE SETTINGS INTO THE DEFAULTS.
_.defaults( settings, defaults );
```

3. Calling the Parent's Constructor

  `base` is a reference to the parent object we're extending from.  We're calling its `init` method, but forcing the context to be our child object via the `.call` method.  We also pass in the other arguments as expected.
```js
// CALL THE PARENT'S CONSTRUCTOR
base.init.call( this, $element, settings );
```

4. Private Methods

  Private methods really aren't methods -- they're just simple functions that are scoped within our `init` constructor method.
```js
/**
 * Does something internal
 * @method myPrivateMethod
 * @private
 * @param {Object} $target Jquery object for the target node
 * @return {Void}
 */
function myPrivateMethod( $target ) {
  // Do something secret...
}
```

5. Privileged Methods

  Privileged methods are defined within our `init` method so they have access to any private variables, but since they're hung off of `this` instance, they are publicly callable.
```js
/**
 * This privileged  method has access to private variables.
 * @method myPrivilegedMethod
 * @public
 * @return {Object} 
 */
this.myPrivilegedMethod = function() {
  return settings;
};
```

6. Event Listeners

  By convention, we set up any event listeners towards the bottom of the `init` method.
```js
// EVENT LISTENERS
this.on( constants.events.LOAD, function(event, [self]) {
  event.stopPropagation();
  // Do something...
});
```

 7. Decoration

Decoration is used to add or modify a specific attribute or behavior of an object.  A _big_ dog, a _red_ car, or a _loud_ baby.  Instead of subclassing the Dog, Car, or Baby classes and incurring the cost of another object, we can simply add something extra to those existing objects.
```js
Fiber.decorate(this, {});
```

## Public Methods

Public methods are defined within the main returned object as siblings to our `init` method.

## Export to Common JS Loader

```js
//Export to Common JS Loader
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( AwesomeThing );
  } else if( module.exports ){
   module.exports = AwesomeThing;
  }
}
```

## Putting It All Together

```js

/**
 * My awesome class that does something cool!
 * @class AwesomeThing
 * @constructor
 * @extends Abstract
 * @require Container
 * @version 0.0.1
 */

var constants = require( 'lu/constants' ),
  helpers = require( 'lu/helpers' ),
  Abstract = require( 'lu/Abstract' ),
  Container = require( 'lu/Container' ),
  AwesomeThing;

AwesomeThing = Abstract.extend( function ( base ) {
  /**
   * Default configuration values for AwesomeThing instances
   * @property defaults
   * @type Object
   * @private
   * @final
   */
  var defaults = {
    /**
     * Config property
     * @property {String} property1 This sets something important
     * @private
     * @final
     */
    property1,
    /**
     * Config property
     * @property {String} property2 This sets something useful
     * @private
     * @final
     */     
    property2,
    /**
     * Config property
     * @property {String} property3 This sets a helpful value
     * @private
     * @final
     */     
    property3
  };

  return {
    /**
     * Constructor
     * @method init
     * @public
     * @param {Object} $element JQuery object for the element wrapped by
     * the component
     * @param {Object} settings Configuration settings
     */
    init: function( $element, settings ) {
      
      // PRIVATE INSTANCE VARIABLES
      var self = this;

      // MIX THE SETTINGS INTO THE DEFAULTS.
      _.defaults( settings, defaults );

      // CALL THE PARENT'S CONSTRUCTOR
      base.init.call( self, $element, settings );

      /**
       * Does something internal
       * @method myPrivateMethod
       * @private
       * @param {Object} $target Jquery object for the target node
       * @return {Void}
       */
      function myPrivateMethod( $target ) {
        // Do something secret...
      }

      /**
       * This privileged method has access to private variables.
       * @method myPrivilegedMethod
       * @public
       * @return {Object} 
       */
      self.myPrivilegedMethod = function() {
        return settings;
      };

      // EVENT LISTENERS
      self.on( constants.events.LOAD, function(event, [self]) {
        event.stopPropagation();

        // Do something...
        
      });
      
    },
    /**
     * This method is available on the prototype
     * @method myPublicMethod
     * @public
     * @return {String} Computed height of the Container (result drops units)
     */
    myPublicMethod: function(){
      var something = 1;

      // Do something useful here...

      return something;
    }
  };
} );


// EXPORT TO COMMON JS LOADER
if( typeof module !== 'undefined' ){
  if( typeof module.setExports === 'function' ){
    module.setExports( AwesomeThing );
  } else if( module.exports ){
   module.exports = AwesomeThing;
  }
}

```