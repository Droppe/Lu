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
var constants=require("lu/constants"),helpers=require("lu/helpers"),Abstract=require("lu/Abstract"),stateDecorator=require("lu/decorators/state"),Fiber=require("Fiber"),Switch;Switch=Abstract.extend(function(a){var b={};return{init:function(c,d){_.defaults(d,b),a.init.call(this,c,d),Fiber.decorate(this,stateDecorator(d))}}}),typeof module!="undefined"&&(typeof module.setExports=="function"?module.setExports(Switch):module.exports&&(module.exports=Switch));