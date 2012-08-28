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
function parseUri(a){var b=parseUri.options,c=b.parser[b.strictMode?"strict":"loose"].exec(a),d={},e=14;while(e>0)e-=1,d[b.key[e]]=c[e]||"";return d[b.q.name]={},d[b.key[12]].replace(b.q.parser,function(a,c,e){c&&(d[b.q.name][c]=e)}),d}var helpers={},urlRegExp=/\b((?:[a-z][\w\-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;helpers.console=function(){function d(c,d){if(b){if(typeof b[c]=="function")return b[c].apply(b,a.call(d));if(typeof b[c]=="object")return Function.prototype.call.call(b[c],b,a.call(d))}}function e(){}var a=Array.prototype.slice,b=window.console,c=window.LU_CONFIG.debug;return c===!1?{error:e,warn:e,info:e,debug:e,log:e}:{error:function(){if(c>=1)return _.error(arguments)},warn:function(){if(c>=2)return d("warn",arguments)},info:function(){if(c>=3)return d("info",arguments)},debug:function(){if(c>=4)return d("debug",arguments)},log:function(){if(c>=5)return d("log",arguments)}}}(),helpers.isUrl=function(a){return urlRegExp.test(a)},parseUri.options={strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},helpers.parseUri=parseUri,helpers.trim=function(){return typeof String.prototype.trim=="function"?function(a){return a.trim()}:function(a){return a.replace(/^\s+|\s+$/g,"")}}(),typeof module!="undefined"&&(typeof module.setExports=="function"?module.setExports(helpers):module.exports&&(module.exports=helpers));