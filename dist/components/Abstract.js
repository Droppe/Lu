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
var constants=require("lu/constants"),helpers=require("lu/helpers"),Fiber=require("Fiber"),Abstract;Abstract=Fiber.extend(function(a){function d(a,b){var c=this.eventStore,d=/\s+/g;_.each(helpers.trim(a).split(d),function(a){c[a]={method:b}})}function e(a){var b=this.eventStore;_.each(helpers.trim(a).split(/\s+/g),function(c){b[a]&&delete b[a]})}var b=Array.prototype.slice,c={observe:"",notify:""};return{init:function(a,b){var d,e;_.defaults(b,c),this.$element=a,this.eventStore={},d=$(b.observe),e=$(b.notify).add(a.lu("getDescendants")),d.length>0&&d.lu("observe",a),e.length>0&&a.lu("observe",e)},on:function(){var a=b.call(arguments),c=constants.eventPrefix+arguments[0];return a.splice(0,1,c),d.call(this,c,"on"),this.$element.on.apply(this.$element,a),this},one:function(){var a=b.call(arguments),c=constants.eventPrefix+arguments[0];return a.splice(0,1,c),d.call(this,c,"one"),this.$element.one.apply(this.$element,a),this},off:function(){var a=b.call(arguments),c=constants.eventPrefix+arguments[0];return a.splice(0,1,c),e.call(this,c),this.$element.off.apply(this.$element,a),this},trigger:function(a,b){var c;return typeof a=="string"&&(a=constants.eventPrefix+a),c=this.eventStore[a],this.$element.lu("notify",a,b),c&&c.method==="one"&&e.call(this,a),this.$element.trigger.call(this.$element,a,b),this},observe:function(a){return this.$element.lu("observe",a),this},unobserve:function(a){return this.$element.lu("unobserve",a,this.$element),this},events:function(){return _.keys(this.eventStore)}}}),typeof module!="undefined"&&(typeof module.setExports=="function"?module.setExports(Abstract):module.exports&&(module.exports=Abstract));