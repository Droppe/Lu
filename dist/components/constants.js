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
var constants={HAS_A18_ATTRS:"button, input",DISABLED:"disabled",eventPrefix:"lu:",events:{SELECTED:"selected",SELECT:"select",STATED:"stated",STATE:"state",UPDATED:"updated",UPDATE:"update",LOAD:"load",OUT_OF_BOUNDS:"out_of_bounds",NEXT:"next",PREVIOUS:"previous",FIRST:"first",LAST:"last",PLAY:"play",PAUSED:"paused"},statePrefix:"lu-state-",states:{STATE:"state",STATED:"stated",SELECTED:"selected",DISABLED:"disabled",LOADING:"loading",LOADED:"loaded",MAXED:"maxed",FLOORED:"floored",TRANSITIONING:"transitioning",TRANSITIONED:"transitioned",PLAYING:"playing",PAUSED:"paused",ACTIVE:"active",INACTIVE:"inactive",ERRED:"erred",REVERSE:"reverse",FOWARD:"forward"}};typeof module!="undefined"&&(typeof module.setExports=="function"?module.setExports(constants):module.exports&&(module.exports=constants));