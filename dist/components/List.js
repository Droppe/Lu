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
var constants=require("lu/constants"),helpers=require("lu/helpers"),Switch=require("lu/Switch"),Fiber=require("Fiber"),List;List=Switch.extend(function(a){var b=constants.statePrefix+constants.states.SELECTED,c="ul, ol, dl",d={index:undefined};return{init:function(e,f){var g=this,h,i,j,k;_.defaults(f,d),a.init.call(this,e,f),this.index=function(){return k},this.items=function(){var a;return f.items?typeof f.items=="string"?a=e.children(f.items):a=f.items:e.is(c)?a=e.children():a=e.children(c).first().children(),a||(a=e.children()),a},this.current=function(){return h},this.select=function(a){var c,d,e;return a===undefined?this:(e=typeof a=="number"?a:undefined,typeof a=="number"&&a<=this.size()-1?d=this.$items.eq(a):typeof a=="string"?(d=this.$items.filter(a),d=d.size()===1?d:undefined):a instanceof $&&a.size()===1&&a.is(this.$items)&&(d=a),d===undefined?(this.trigger(constants.events.OUT_OF_BOUNDS,[this]),this):(e===undefined&&(e=this.$items.index(d)),e>this.index()?this.addState(constants.states.FORWARD).removeState(constants.states.REVERSE):e<this.index()&&this.addState(constants.states.REVERSE).removeState(constants.states.FORWARD),c=d.lu("getComponents").Container,c||(Lu.map(d,"Container",function(){}),Lu.execute(d),c=d.lu("getComponents").Container),c.deferral.then(function(a){var c=g.current();if(e===k&&h)return;c?c.removeState(constants.states.SELECTED):g.$items.filter("."+b).not(a.$element).removeClass(b),h=a,k=e,h.addState(constants.states.SELECTED),g.trigger(constants.events.SELECTED,[g])}),this))},this.$items=this.items(),this.orientation=f.orientation,k=f.index,k===undefined&&(k=this.$items.filter("."+b).index(this.$items),k=0,k===-1&&(k=0)),g.select(k),this.on(constants.events.SELECT,function(a,b){a.stopPropagation();var c=b.$element,d=c.attr("aria-controls"),e,f;d||(e=c.attr("href"),e&&(d=helpers.parseUri(e).anchor)),d?(f=$("#"+d),f.is(g.$items)?g.select(f):g.select(b.$element.closest(g.$items))):g.select(b.$element.closest(g.$items))}),this.on(constants.events.NEXT,function(a){a.stopPropagation(),g.next()}),this.on(constants.events.PREVIOUS,function(a){a.stopPropagation(),g.previous()}),this.on(constants.events.FIRST,function(a){a.stopPropagation(),g.first()}),this.on(constants.events.LAST,function(a){a.stopPropagation(),g.last()}),this.on(constants.events.STATED,function(a,b){a.stopPropagation();var c;if(!b.$element.is(g.$items))return;c=g.current();if(c&&b.$element.is(c.$element))return;b.hasState&&b.hasState(constants.states.SELECTED)&&g.select(b.$element)})},add:function(a){return this.$items=this.$items.add(a),this.$items.parent().append(a),this},remove:function(a){return $($(a),this.$items).remove(),this.$items=this.$items.not(a),this},next:function(){return this.hasNext()?this.select(this.index+1):this.trigger(constants.events.OUT_OF_BOUNDS,[this]),this},previous:function(){return this.hasPrevious()?this.select(this.index-1):this.trigger(constants.events.OUT_OF_BOUNDS,[this]),this},last:function(){return this.select(this.$items.eq(this.size()-1)),this},first:function(){return this.select(0),this},hasNext:function(){return this.index<this.size()-1},hasPrevious:function(){return this.index>0},current:function(){return this.$items.eq(this.index)},size:function(){return this.$items.size()}}}),typeof module!="undefined"&&(typeof module.setExports=="function"?module.setExports(List):module.exports&&(module.exports=List));