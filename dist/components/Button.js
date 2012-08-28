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
var constants=require("lu/constants"),helpers=require("lu/helpers"),Switch=require("lu/Switch"),Fiber=require("Fiber"),Button;Button=Switch.extend(function(a){function e(a,b){a.$element.on("keyup",function(c){c.keyCode===32&&a.trigger(b)})}var b={on:"click"},c="lu/Button/decorators/",d={first:c+"first",last:c+"last",load:c+"load",next:c+"next",pause:c+"pause",play:c+"play",previous:c+"previous",select:c+"select",state:c+"state",def:c+"default"};return{init:function(c,f){var g=this,h,i=[],j;_.defaults(f,b),a.init.call(this,c,f),h=f.action;if(h!==undefined)switch(h){case"first":i.push(d.first),i.push(d.def);break;case"last":i.push(d.last),i.push(d.def);break;case"load":i.push(d.load),i.push(d.def);break;case"next":i.push(d.next),i.push(d.def);break;case"pause":i.push(d.pause),i.push(d.def);break;case"play":i.push(d.play),i.push(d.def);break;case"previous":i.push(d.previous),i.push(d.def);break;case"select":i.push(d.select);break;case"state":i.push(d.state);break;default:throw new Error('Button decorator "'+h+'" does not exist!')}else i.push(d.def);require.ensure(i,function(a,b,c){_.each(i,function(b,c){b=a(b)(f),Fiber.decorate(g,b)}),g.trigger("dependencies-resolved")}),e(this,f.on)},disable:function(){var a=this.$element;return a.is(constants.HAS_A18_ATTRS)&&a.prop(constants.DISABLED,!0),this.addState(constants.states.DISABLED),this},enable:function(){var a=this.$element;return a.removeProp(constants.DISABLED),this.removeState(constants.states.DISABLED),this}}}),typeof module!="undefined"&&(typeof module.setExports=="function"?module.setExports(Button):module.exports&&(module.exports=Button));