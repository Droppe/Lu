/**
 * Lu version 0.3.0
 * @author Robert Martone
 * @license
 *
 * Please thank the contributors:
 * https://github.com/linkedin/Lu/graphs/contributors
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

( function() {

  var PATH_TO_LU_COMPONENTS = '/scripts/components/',
    PATH_TO_FIBER = '/scripts/libraries/fiber.js';

    window.LU_CONFIG = {
      debug: 5,
      scope: 'body'
    };

  if( typeof window.require === 'function' ) {

    if( typeof window.Inject.addRule === 'function' ) {
      window.Inject.addRule( /^lu\//, {
        path: function( module ) {
          module = module.replace( 'lu/', '' );
          return PATH_TO_LU_COMPONENTS + module + '.js';
        }
      } );

      window.Inject.addRule( 'Fiber', {
        path: PATH_TO_FIBER
      } );

    }
  }

} () );