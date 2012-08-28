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
function stateDecorator(a){function b(a){return a&&typeof a=="string"&&(a=a.replace(" ","").split(",")),a}function c(a,b){return b===undefined&&(b=0),b<a.length-1?b+=1:b=0,b}return function(d){var e=this,f=[],g=a.method,h=a.index||0,i=[];if(g!=="reset"||g!=="clear")f=b(a.states)||[constants.states.ACTIVE,constants.states.INACTIVE];this.$element.on(a.on,function(a){e.$element.is("a")&&e.$element.focus(),h=c(f,h),e.trigger(constants.events.STATE,[f[h],g])}),this.one(constants.events.STATED,function(a,b){i=b.getState()}),this.on(constants.events.STATED,function(a,b){var c;if(e.$element.is(b.$element))return;switch(g){case"add":b.hasState(f[h])&&f.length===1?e.disable():e.enable();break;case"remove":!b.hasState(f[h])&&f.length===1?e.disable():e.enable();break;case"clear":b.getState().length===0?e.disable():e.enable();break;case"reset":_.difference(i,b.getState()).length===0?e.disable():e.enable();break;default:c=_.intersection(f,b.getState()),f.length===1?b.hasState(f[h])&&f.length===1?e.disable():e.enable():f.length>1?(c.length===f.length?e.disable():e.enable(),c.length===1&&(h=_.indexOf(f,c[0]))):e.enable()}})}}var constants=require("lu/constants");typeof module!="undefined"&&(typeof module.setExports=="function"?module.setExports(stateDecorator):module.exports&&(module.exports=stateDecorator));