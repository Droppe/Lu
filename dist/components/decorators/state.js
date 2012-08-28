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
function stateDecorator(a){function b(a){return a&&typeof a=="string"&&(a=a.replace(" ","").split(",")),a}function c(a,b){var c=[],d=[],e=a.attr("class")||"";_.each(e.split(" "),function(a,b){a.indexOf(constants.statePrefix)>-1&&c.push(a)}),_.each(b,function(a,b){a&&d.push(constants.statePrefix+a)}),a.removeClass(c.join(" ")).addClass(d.join(" "))}function d(a){var b=a.attr("class")||"",c=[];return _.each(b.split(" "),function(a,b){a.indexOf(constants.statePrefix)>-1&&c.push(a.replace(constants.statePrefix,""))}),c}return function(a){function g(a,c,d){if(b.$element.is(a.target))return b;a.stopPropagation();switch(d){case"add":b.addState(c);break;case"remove":b.removeState(c);break;case"reset":b.reset();break;case"clear":b.clear();break;case"toggle":b.toggle(c);break;default:b.setState(c)}return b}var b=this,e=[],f=[d(this.$element)];this.getState=function(){return e},this.setState=function(a){return typeof a=="string"&&(a=a.split(",").sort()),a=a.sort(),e=e.sort(),_.isEqual(a,e)?b:(e=a,c(this.$element,e,constants.statePrefix),this.trigger(constants.events.STATED,[this]),this)},this.addState=function(a){return typeof a=="string"&&(a=a.split(",")),_.difference(a,e).length>0&&(e=_.union(e,a),c(this.$element,e),this.trigger(constants.events.STATED,[this])),this},this.removeState=function(a){var b,d=[];return typeof a=="string"&&(a=a.split(",")),b=_.intersection(e,a),b.length>0&&(d.push(e),_.each(a,function(a,b){d.push(a)}),e=_.without.apply(this,d),c(this.$element,e,constants.statePrefix),this.trigger(constants.events.STATED,[this])),this},this.clear=function(){return this.removeState(e),this},this.reset=function(){return this.setState(f[0]),this},this.hasState=function(a){return _.indexOf(e,a)>-1},this.addState(f[0]),this.on(constants.events.STATE,g)}}var constants=require("lu/constants"),helpers=require("lu/helpers");typeof module!="undefined"&&(typeof module.setExports=="function"?module.setExports(stateDecorator):module.exports&&(module.exports=stateDecorator));