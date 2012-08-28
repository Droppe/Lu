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
var constants=require("lu/constants"),helpers=require("lu/helpers"),Switch=require("lu/Switch"),Fiber=require("Fiber"),Container;Container=Switch.extend(function(a){var b={states:null,content:null,url:null,selector:null,frame:!1,autoHeight:!1,autoWidth:!1,target:null};return{init:function(c,d){function h(a,b,c){var f=helpers.isUrl(b),g=$(a.target),h;return a.stopPropagation(),f||(g.is("a")&&(b=g.attr("href")),!b&&arguments.length>1&&(c=b)),b.indexOf("#")===0?(h=$(b).html(),this.trigger(constants.events.UPDATED,[e])):d.frame===!0?(h='<iframe src="'+b+'"></iframe>',this.trigger(constants.events.UPDATED,[e])):(this.removeState(constants.states.LOADED),this.addState(constants.states.LOADING),$.ajax({url:b,success:function(a,c,f){var g,h=helpers.parseUri(b).anchor;d.selector?g=$(a).find(d.selector).html():h?g=$(a).find("#"+h).html()||a:g=a,e.removeState(constants.states.LOADING),e.addState(constants.states.LOADED),e.trigger(constants.events.UPDATED,[e])},failure:function(){e.removeState(constants.states.LOADING).addState(constants.states.ERRED)}}),this)}function i(a,b,c){a.stopPropagation();switch(c){case"append":this.appendContent(b);break;case"prepend":this.prependContent(b);break;default:this.setContent(b)}}var e=this,f,g;_.defaults(d,b),a.init.call(this,c,d),this.cache={},this.$target=null,g=d.target,g?this.$target=c.find(g):this.$target=c,this.getContent=function(){return f},this.setContent=function(a){return f=a,this.$target.html(f),d.autoHeight&&(delete this.cache.height,this.setHeight(this.getHeight())),d.autoWidth&&(delete this.cache.width,this.setWidth(this.getWidth())),this.trigger(constants.events.UPDATED,c),this},this.appendContent=function(a){return this.setContent(f+a)},this.prependContent=function(a){return this.setContent(a+f)},d.url?this.trigger(constants.events.LOAD):f=c.html(),d.autoHeight&&this.setHeight(this.getHeight()),d.autoWidth&&this.setWidth(this.getWidth()),this.on(constants.events.UPDATE,i),this.on(constants.events.LOAD,h)},getHeight:function(){var a=this.cache.height,b=this.$target;return a||(b?a=b.height():a=this.$element.height(),this.cache.height=a),a},setHeight:function(a){var b=this.$target;return this.cache.height=a,b?b.height(a):this.$element.height(a),this},getWidth:function(){var a=this.cache.width,b=this.$target;return a||(b?a=b.width():a=this.$element.width(),this.cache.width=a),a},setWidth:function(a){var b=this.$target;return this.cache.width=a,b?b.width(a):this.$element.width(a),this}}}),typeof module!="undefined"&&(typeof module.setExports=="function"?module.setExports(Container):module.exports&&(module.exports=Container));