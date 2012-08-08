;(function(context, undefined) {
/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

/** @constant the version of inject this is */
var INJECT_VERSION = "0.4.0-pre";

/** @constant a test to determine if this is the IE engine (needed for source in eval commands) */
var IS_IE = eval("/*@cc_on!@*/false");

/** @constant a storagetoken identifier we use for the bucket (lscache) */
var FILE_STORAGE_TOKEN = "INJECT";

/** @constant the version of data storage schema for lscache */
var LSCACHE_SCHEMA_VERSION = 1;

/** @constant the schema version string for validation of lscache schema */
var LSCACHE_SCHEMA_VERSION_STRING = "!version";

/** @constant the cache version string for validation of developer lscache code */
var LSCACHE_APP_KEY_STRING = "!appCacheKey";

/** @constant AMD modules that are deferred have this set as their "arg[0]" as a way to flag */
var AMD_DEFERRED = "###DEFERRED###";

/** @constant the namespace for inject() that is publicly reachable */
var NAMESPACE = "Inject";

/** @constant Regex for identifying things that end in *.js or *.txt */
var FILE_SUFFIX_REGEX = /.*?\.(js|txt)(\?.*)?$/;

/** @constant This is the basic suffix for JS files. When there is no extension, we add this if enabled */
var BASIC_FILE_SUFFIX = ".js";

/** @constant prefixes for URLs that begin with http/https */
var HOST_PREFIX_REGEX = /^https?:\/\//;

/** @constant suffix for URLs used to capture everything up to / or the end of the string */
var HOST_SUFFIX_REGEX = /^(.*?)(\/.*|$)/;

/**
 * @constant a regular expression for slicing a response from iframe communication into its parts
 * (1) Anything up to a space (status code)
 * (2) Anything up to a space (moduleid)
 * (3) Any text up until the end of the string (file)
 **/
var RESPONSE_SLICER_REGEX = /^(.+?)[\s]+([\w\W]+?)[\s]+([\w\W]+)$/m;

/** @constant a regex to locate the function() opener */
var FUNCTION_REGEX = /^[\s\(]*function[^\(]*\(([^)]*)\)/;

/** @constant a regex to locate newlines within a function body */
var FUNCTION_NEWLINES_REGEX = /\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g;

/** @constant captures the body of a JS function */
var FUNCTION_BODY_REGEX = /[\w\W]*?\{([\w\W]*)\}/m;

/** @constant locate whitespace within a function body */
var WHITESPACE_REGEX = /\s+/g;

/** @constant extract require() statements from within a larger string */
var REQUIRE_REGEX = /(?:^|[^\w\$_.\(])require\s*\(\s*("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g;

/** @constant extract define() statements from within a larger string */
var DEFINE_EXTRACTION_REGEX = /(?:^|[\s]+)define[\s]*\([\s]*((?:"|')\S+(?:"|'))?,?[\s]*(?:\[([\w\W]+)\])?/g;

/** @constant index of all commonJS builtins in a function arg collection */
var BUILTINS = {require: true, exports: true, module: true};

/** @constant a regex for replacing builtins and quotes */
var BUILTINS_REPLACE_REGEX = /[\s]|"|'|(require)|(exports)|(module)/g;

/** @constant capture anything that involves require*, aggressive to cut down the number of lines we analyze */
var GREEDY_REQUIRE_REXEX = /require.*/;

/** @constant match comments in our file (so we can strip during a static analysis) */
var JS_COMMENTS_REGEX = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;

/** @constant identifies a path as relative */
var RELATIVE_PATH_REGEX = /^(\.{1,2}\/).+/;

/** @constant identifies a path as absolute fully-qualified URL */
var ABSOLUTE_PATH_REGEX = /^([A-Za-z]+:)?\/\//;

/** @constant run a test to determine if localstorage is available */
var HAS_LOCAL_STORAGE = (function() {
  try {
    localStorage.setItem("injectLStest", "ok");
    localStorage.removeItem("injectLStest");
    return true;
  }
  catch (err) {
    return false;
  }
})();


/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

// user configuration options (see reset)
var userConfig = {
  moduleRoot: null,
  fileExpires: 300,
  useSuffix: true,
  xd: {
    relayFile: null,
    relaySwf: null
  },
  debug: {
    sourceMap: false,
    logging: false
  }
};

// context is our local scope. Should be "window"
var context = this;

// any mappings for module => handling defined by the user
var userModules = {};

// a placeholder for the easyXDM lib if loaded
var easyXdm = false;

// an XHR reference, loaded once
var isHostMethod = function(object, property) {
  var t = typeof object[property];
  return t == 'function' || (!!(t == 'object' && object[property])) || t == 'unknown';
};

var getXhr = (function(){
  if (isHostMethod(window, "XMLHttpRequest")) {
    return function(){
        return new XMLHttpRequest();
    };
  }
  else {
    var item = (function(){
      var list = ["Microsoft", "Msxml2", "Msxml3"], i = list.length;
      while (i--) {
        try {
          item = list[i] + ".XMLHTTP";
          var obj = new ActiveXObject(item);
          return item;
        } 
        catch (e) {}
      }
    }());
    return function(){
      return new ActiveXObject(item);
    };
  }
}());

function proxy(fn, scope) {
  if (!scope) {
    throw new Error("proxying requires a scope");
  }
  if (!fn) {
    throw new Error("proxying requires a function");
  }
  return function() {
    return fn.apply(scope, arguments);
  }
}

function each(collection, fn) {
  for (var i = 0, len = collection.length; i < len; i++) {
    fn(collection[i]);
  }
}

var debugLog = function() {};
// TODO: more robust logging solution
(function() {
  var logs = [];
  var canLog = (console && console.log && typeof(console.log) === "function");
  var doLog = function(origin, message) {
    if (userConfig.debug && userConfig.debug.logging) {
      console.log("## "+ origin +" ##" + "\n" + message);
    };
  }
  if (canLog) {
    debugLog = doLog;
  }
})();
/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Below are the "sandboxing" wrappers for our commonJS implementation
 * we reach in to the inject namespace (default "Inject"), into the
 * INTERNAL object, which contains methods reachable during the eval.
 * Markers in the file for dynamic content are identified with
 * __DOUBLE_UNDERSCORES__, while internal variables are marked with
 * __singleUnderscores
 * @file This file contains the commonJS header and footers
**/

var commonJSHeader = ([
'__INJECT_NS__.INTERNAL.execute.__FUNCTION_ID__ = function() {',
'  with (window) {',
'    var module = __INJECT_NS__.INTERNAL.createModule("__MODULE_ID__", "__MODULE_URI__"),',
'        require = __INJECT_NS__.INTERNAL.createRequire("__MODULE_ID__", "__MODULE_URI__"),',
'        define = __INJECT_NS__.INTERNAL.createDefine("__MODULE_ID__", "__MODULE_URI__"),',
'        __exe = null;',
'        exports = module.exports;',
'    __exe = function() {',
'      __POINTCUT_BEFORE__'
]).join('\n');
var commonJSFooter = ([
'      __POINTCUT_AFTER__',
'    };',
'    __INJECT_NS__.INTERNAL.defineExecutingModuleAs(module.id, module.uri);',
'    __error = window.onerror;',
'    try {',
'      __exe.call(module);',
'    }',
'    catch (__EXCEPTION__) {',
'      module.error = __EXCEPTION__;',
'    }',
'    __INJECT_NS__.INTERNAL.undefineExecutingModule();',
'    return module;',
'  }',
'};'
]).join('\n');

/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

// CLASS impl
/**
 * Class Inheritance model
 *
 * Copyright (c) 2012 LinkedIn.
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
( function( window ){
  // Stores whether the object is being initialized, and thus not
  // run the <init> function, or not.
  var initializing = false;

  function copy(from, to) {
    var name;
    for( name in from ){
      if( from.hasOwnProperty( name ) ){
        to[name] = from[name];
      }
    }
  }

  // The base Class implementation
  function Class(){};

  var _Class = window.Class;
  Class.noConflict = function() {
    window.Class = _Class;
    return Class;
  };

  // Create a new Class that inherits from this class
  Class.extend = function( fn ){
    // Keep a reference to the current prototye
    var base = this.prototype,
      // Invoke the function which will return an object literal used to define
      // the prototype. Additionally, pass in the parent prototype, which will
      // allow instances to use it
      properties = fn( base ),
      // Stores the constructor's prototype
      proto;

       // The dummy class constructor
      function constructor(){
        if( !initializing && typeof this.init === 'function' ){
          // All construction is done in the init method
          this.init.apply( this, arguments );
          // Prevent any re-initializing of the instance
          this.init = null;
        }
      }

      // Instantiate a base class (but only create the instance, don't run the init function),
      // and make every <constructor> instance an instanceof <this> and of <constructor>
      initializing = true;
      proto = constructor.prototype = new this;
      initializing = false;

       // Copy the properties over onto the new prototype
      copy( properties, proto );

      // return a proxy object for accessing this as a superclass
      proto.createSuper = function( subclass ){
        var props = proto,
            iface = {},
            wrap = function(scope, fn) {
              return function() {
                return fn.apply(scope, arguments);
              };
            };
        for( name in props ){
          if( props.hasOwnProperty( name ) ){
            iface[name] = wrap(subclass, props[name]);
          }
        }
        return iface;
      };

      // Enforce the constructor to be what we expect
      proto.constructor = constructor;

      // Keep a reference to the parent prototype.
      // This is needed in order to support decorators
      constructor.__base = base;

       // Make this class extendable
      constructor.extend = Class.extend;

      // Add ability to create singleton
      constructor.singleton = Class.singleton;

      // ... as well as mixin ability
      constructor.mixin = function( /* mixin[s] */ ) {
        var i,
          len = arguments.length

        for( i = 0; i < len; i++ ){
          copy( arguments[i]( base ), proto );
        }
      }

      return constructor;
  };

  // Returns a proxy object for accessing base methods
  // with a given context
  Class.proxy = function( base, instance ) {
    var name,
        iface = {},
        wrap = function( fn ) {
          return function() {
            return base[fn].apply( instance, arguments );
          };
        };

    // Create a wrapped method for each method in the base
    // prototype
    for( name in base ){
      if( base.hasOwnProperty( name ) && typeof base[name] === 'function' ){
        iface[name] = wrap( name );
      }
    }
    return iface;
  }

  // Decorates an instance
  Class.decorate = function( instance /*, decorator[s]*/ ) {
    var i,
      len = arguments.length,
      base = instance.constructor.__base;

    for( i = 1; i < len; i++ ){
      arguments[i].call( instance, base );
    }
  }

  // Return a singleton
  Class.singleton = function( fn ) {
    var obj = this.extend( fn ),
      args = arguments;

    return (function() {
      var instance;

      return {
        getInstance: function() {
          var temp;

          // Create an instance, if it does not exist
          if ( !instance ) {

            // If there are additional arguments specified, they need to be
            // passed into the constructor.
            if ( args.length > 1 ) {
              // temporary constructor
              temp = function(){};
              temp.prototype = obj.prototype;

              instance = new temp;

              // call the original constructor with 'instance' as the context
              // and the rest of the arguments
              obj.prototype.constructor.apply( instance, Array.prototype.slice.call( args, 1 ) );

            } else {
              instance = new obj();
            }

          }

          return instance;
        }
      }
    })();
  }

   //Export to Common JS Loader
  if( typeof module !== 'undefined' ){
    if( typeof module.setExports === 'function' ){
      module.setExports( Class );
    } else if( module.exports ){
      module.exports = Class;
    }
  } else {
    window.Class = Class;
  }

}( window ) );
/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

var LOCAL_EASY_XDM = true;

/**
 * easyXDM
 * http://easyxdm.net/
 * Copyright(c) 2009-2011, Øyvind Sean Kinsey, oyvind@kinsey.no.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(N,d,p,K,k,H){var b=this;var n=Math.floor(Math.random()*10000);var q=Function.prototype;var Q=/^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/;var R=/[\-\w]+\/\.\.\//;var F=/([^:])\/\//g;var I="";var o={};var M=N.easyXDM;var U="easyXDM_";var E;var y=false;var i;var h;function C(X,Z){var Y=typeof X[Z];return Y=="function"||(!!(Y=="object"&&X[Z]))||Y=="unknown"}function u(X,Y){return !!(typeof(X[Y])=="object"&&X[Y])}function r(X){return Object.prototype.toString.call(X)==="[object Array]"}function c(){try{var X=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");i=Array.prototype.slice.call(X.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/),1);h=parseInt(i[0],10)>9&&parseInt(i[1],10)>0;X=null;return true}catch(Y){return false}}var v,x;if(C(N,"addEventListener")){v=function(Z,X,Y){Z.addEventListener(X,Y,false)};x=function(Z,X,Y){Z.removeEventListener(X,Y,false)}}else{if(C(N,"attachEvent")){v=function(X,Z,Y){X.attachEvent("on"+Z,Y)};x=function(X,Z,Y){X.detachEvent("on"+Z,Y)}}else{throw new Error("Browser not supported")}}var W=false,J=[],L;if("readyState" in d){L=d.readyState;W=L=="complete"||(~navigator.userAgent.indexOf("AppleWebKit/")&&(L=="loaded"||L=="interactive"))}else{W=!!d.body}function s(){if(W){return}W=true;for(var X=0;X<J.length;X++){J[X]()}J.length=0}if(!W){if(C(N,"addEventListener")){v(d,"DOMContentLoaded",s)}else{v(d,"readystatechange",function(){if(d.readyState=="complete"){s()}});if(d.documentElement.doScroll&&N===top){var g=function(){if(W){return}try{d.documentElement.doScroll("left")}catch(X){K(g,1);return}s()};g()}}v(N,"load",s)}function G(Y,X){if(W){Y.call(X);return}J.push(function(){Y.call(X)})}function m(){var Z=parent;if(I!==""){for(var X=0,Y=I.split(".");X<Y.length;X++){Z=Z[Y[X]]}}return Z.easyXDM}function e(X){N.easyXDM=M;I=X;if(I){U="easyXDM_"+I.replace(".","_")+"_"}return o}function z(X){return X.match(Q)[3]}function f(X){return X.match(Q)[4]||""}function j(Z){var X=Z.toLowerCase().match(Q);var aa=X[2],ab=X[3],Y=X[4]||"";if((aa=="http:"&&Y==":80")||(aa=="https:"&&Y==":443")){Y=""}return aa+"//"+ab+Y}function B(X){X=X.replace(F,"$1/");if(!X.match(/^(http||https):\/\//)){var Y=(X.substring(0,1)==="/")?"":p.pathname;if(Y.substring(Y.length-1)!=="/"){Y=Y.substring(0,Y.lastIndexOf("/")+1)}X=p.protocol+"//"+p.host+Y+X}while(R.test(X)){X=X.replace(R,"")}return X}function P(X,aa){var ac="",Z=X.indexOf("#");if(Z!==-1){ac=X.substring(Z);X=X.substring(0,Z)}var ab=[];for(var Y in aa){if(aa.hasOwnProperty(Y)){ab.push(Y+"="+H(aa[Y]))}}return X+(y?"#":(X.indexOf("?")==-1?"?":"&"))+ab.join("&")+ac}var S=(function(X){X=X.substring(1).split("&");var Z={},aa,Y=X.length;while(Y--){aa=X[Y].split("=");Z[aa[0]]=k(aa[1])}return Z}(/xdm_e=/.test(p.search)?p.search:p.hash));function t(X){return typeof X==="undefined"}var O=function(){var Y={};var Z={a:[1,2,3]},X='{"a":[1,2,3]}';if(typeof JSON!="undefined"&&typeof JSON.stringify==="function"&&JSON.stringify(Z).replace((/\s/g),"")===X){return JSON}if(Object.toJSON){if(Object.toJSON(Z).replace((/\s/g),"")===X){Y.stringify=Object.toJSON}}if(typeof String.prototype.evalJSON==="function"){Z=X.evalJSON();if(Z.a&&Z.a.length===3&&Z.a[2]===3){Y.parse=function(aa){return aa.evalJSON()}}}if(Y.stringify&&Y.parse){O=function(){return Y};return Y}return null};function T(X,Y,Z){var ab;for(var aa in Y){if(Y.hasOwnProperty(aa)){if(aa in X){ab=Y[aa];if(typeof ab==="object"){T(X[aa],ab,Z)}else{if(!Z){X[aa]=Y[aa]}}}else{X[aa]=Y[aa]}}}return X}function a(){var Y=d.body.appendChild(d.createElement("form")),X=Y.appendChild(d.createElement("input"));X.name=U+"TEST"+n;E=X!==Y.elements[X.name];d.body.removeChild(Y)}function A(X){if(t(E)){a()}var Z;if(E){Z=d.createElement('<iframe name="'+X.props.name+'"/>')}else{Z=d.createElement("IFRAME");Z.name=X.props.name}Z.id=Z.name=X.props.name;delete X.props.name;if(X.onLoad){v(Z,"load",X.onLoad)}if(typeof X.container=="string"){X.container=d.getElementById(X.container)}if(!X.container){T(Z.style,{position:"absolute",top:"-2000px"});X.container=d.body}var Y=X.props.src;delete X.props.src;T(Z,X.props);Z.border=Z.frameBorder=0;Z.allowTransparency=true;X.container.appendChild(Z);Z.src=Y;X.props.src=Y;return Z}function V(aa,Z){if(typeof aa=="string"){aa=[aa]}var Y,X=aa.length;while(X--){Y=aa[X];Y=new RegExp(Y.substr(0,1)=="^"?Y:("^"+Y.replace(/(\*)/g,".$1").replace(/\?/g,".")+"$"));if(Y.test(Z)){return true}}return false}function l(Z){var ae=Z.protocol,Y;Z.isHost=Z.isHost||t(S.xdm_p);y=Z.hash||false;if(!Z.props){Z.props={}}if(!Z.isHost){Z.channel=S.xdm_c;Z.secret=S.xdm_s;Z.remote=S.xdm_e;ae=S.xdm_p;if(Z.acl&&!V(Z.acl,Z.remote)){throw new Error("Access denied for "+Z.remote)}}else{Z.remote=B(Z.remote);Z.channel=Z.channel||"default"+n++;Z.secret=Math.random().toString(16).substring(2);if(t(ae)){if(j(p.href)==j(Z.remote)){ae="4"}else{if(C(N,"postMessage")||C(d,"postMessage")){ae="1"}else{if(Z.swf&&C(N,"ActiveXObject")&&c()){ae="6"}else{if(navigator.product==="Gecko"&&"frameElement" in N&&navigator.userAgent.indexOf("WebKit")==-1){ae="5"}else{if(Z.remoteHelper){Z.remoteHelper=B(Z.remoteHelper);ae="2"}else{ae="0"}}}}}}}Z.protocol=ae;switch(ae){case"0":T(Z,{interval:100,delay:2000,useResize:true,useParent:false,usePolling:false},true);if(Z.isHost){if(!Z.local){var ac=p.protocol+"//"+p.host,X=d.body.getElementsByTagName("img"),ad;var aa=X.length;while(aa--){ad=X[aa];if(ad.src.substring(0,ac.length)===ac){Z.local=ad.src;break}}if(!Z.local){Z.local=N}}var ab={xdm_c:Z.channel,xdm_p:0};if(Z.local===N){Z.usePolling=true;Z.useParent=true;Z.local=p.protocol+"//"+p.host+p.pathname+p.search;ab.xdm_e=Z.local;ab.xdm_pa=1}else{ab.xdm_e=B(Z.local)}if(Z.container){Z.useResize=false;ab.xdm_po=1}Z.remote=P(Z.remote,ab)}else{T(Z,{channel:S.xdm_c,remote:S.xdm_e,useParent:!t(S.xdm_pa),usePolling:!t(S.xdm_po),useResize:Z.useParent?false:Z.useResize})}Y=[new o.stack.HashTransport(Z),new o.stack.ReliableBehavior({}),new o.stack.QueueBehavior({encode:true,maxLength:4000-Z.remote.length}),new o.stack.VerifyBehavior({initiate:Z.isHost})];break;case"1":Y=[new o.stack.PostMessageTransport(Z)];break;case"2":Y=[new o.stack.NameTransport(Z),new o.stack.QueueBehavior(),new o.stack.VerifyBehavior({initiate:Z.isHost})];break;case"3":Y=[new o.stack.NixTransport(Z)];break;case"4":Y=[new o.stack.SameOriginTransport(Z)];break;case"5":Y=[new o.stack.FrameElementTransport(Z)];break;case"6":if(!i){c()}Y=[new o.stack.FlashTransport(Z)];break}Y.push(new o.stack.QueueBehavior({lazy:Z.lazy,remove:true}));return Y}function D(aa){var ab,Z={incoming:function(ad,ac){this.up.incoming(ad,ac)},outgoing:function(ac,ad){this.down.outgoing(ac,ad)},callback:function(ac){this.up.callback(ac)},init:function(){this.down.init()},destroy:function(){this.down.destroy()}};for(var Y=0,X=aa.length;Y<X;Y++){ab=aa[Y];T(ab,Z,true);if(Y!==0){ab.down=aa[Y-1]}if(Y!==X-1){ab.up=aa[Y+1]}}return ab}function w(X){X.up.down=X.down;X.down.up=X.up;X.up=X.down=null}T(o,{version:"2.4.15.118",query:S,stack:{},apply:T,getJSONObject:O,whenReady:G,noConflict:e});o.DomHelper={on:v,un:x,requiresJSON:function(X){if(!u(N,"JSON")){d.write('<script type="text/javascript" src="'+X+'"><\/script>')}}};(function(){var X={};o.Fn={set:function(Y,Z){X[Y]=Z},get:function(Z,Y){var aa=X[Z];if(Y){delete X[Z]}return aa}}}());o.Socket=function(Y){var X=D(l(Y).concat([{incoming:function(ab,aa){Y.onMessage(ab,aa)},callback:function(aa){if(Y.onReady){Y.onReady(aa)}}}])),Z=j(Y.remote);this.origin=j(Y.remote);this.destroy=function(){X.destroy()};this.postMessage=function(aa){X.outgoing(aa,Z)};X.init()};o.Rpc=function(Z,Y){if(Y.local){for(var ab in Y.local){if(Y.local.hasOwnProperty(ab)){var aa=Y.local[ab];if(typeof aa==="function"){Y.local[ab]={method:aa}}}}}var X=D(l(Z).concat([new o.stack.RpcBehavior(this,Y),{callback:function(ac){if(Z.onReady){Z.onReady(ac)}}}]));this.origin=j(Z.remote);this.destroy=function(){X.destroy()};X.init()};o.stack.SameOriginTransport=function(Y){var Z,ab,aa,X;return(Z={outgoing:function(ad,ae,ac){aa(ad);if(ac){ac()}},destroy:function(){if(ab){ab.parentNode.removeChild(ab);ab=null}},onDOMReady:function(){X=j(Y.remote);if(Y.isHost){T(Y.props,{src:P(Y.remote,{xdm_e:p.protocol+"//"+p.host+p.pathname,xdm_c:Y.channel,xdm_p:4}),name:U+Y.channel+"_provider"});ab=A(Y);o.Fn.set(Y.channel,function(ac){aa=ac;K(function(){Z.up.callback(true)},0);return function(ad){Z.up.incoming(ad,X)}})}else{aa=m().Fn.get(Y.channel,true)(function(ac){Z.up.incoming(ac,X)});K(function(){Z.up.callback(true)},0)}},init:function(){G(Z.onDOMReady,Z)}})};o.stack.FlashTransport=function(aa){var ac,X,ab,ad,Y,ae;function af(ah,ag){K(function(){ac.up.incoming(ah,ad)},0)}function Z(ah){var ag=aa.swf+"?host="+aa.isHost;var aj="easyXDM_swf_"+Math.floor(Math.random()*10000);o.Fn.set("flash_loaded"+ah.replace(/[\-.]/g,"_"),function(){o.stack.FlashTransport[ah].swf=Y=ae.firstChild;var ak=o.stack.FlashTransport[ah].queue;for(var al=0;al<ak.length;al++){ak[al]()}ak.length=0});if(aa.swfContainer){ae=(typeof aa.swfContainer=="string")?d.getElementById(aa.swfContainer):aa.swfContainer}else{ae=d.createElement("div");T(ae.style,h&&aa.swfNoThrottle?{height:"20px",width:"20px",position:"fixed",right:0,top:0}:{height:"1px",width:"1px",position:"absolute",overflow:"hidden",right:0,top:0});d.body.appendChild(ae)}var ai="callback=flash_loaded"+ah.replace(/[\-.]/g,"_")+"&proto="+b.location.protocol+"&domain="+z(b.location.href)+"&port="+f(b.location.href)+"&ns="+I;ae.innerHTML="<object height='20' width='20' type='application/x-shockwave-flash' id='"+aj+"' data='"+ag+"'><param name='allowScriptAccess' value='always'></param><param name='wmode' value='transparent'><param name='movie' value='"+ag+"'></param><param name='flashvars' value='"+ai+"'></param><embed type='application/x-shockwave-flash' FlashVars='"+ai+"' allowScriptAccess='always' wmode='transparent' src='"+ag+"' height='1' width='1'></embed></object>"}return(ac={outgoing:function(ah,ai,ag){Y.postMessage(aa.channel,ah.toString());if(ag){ag()}},destroy:function(){try{Y.destroyChannel(aa.channel)}catch(ag){}Y=null;if(X){X.parentNode.removeChild(X);X=null}},onDOMReady:function(){ad=aa.remote;o.Fn.set("flash_"+aa.channel+"_init",function(){K(function(){ac.up.callback(true)})});o.Fn.set("flash_"+aa.channel+"_onMessage",af);aa.swf=B(aa.swf);var ah=z(aa.swf);var ag=function(){o.stack.FlashTransport[ah].init=true;Y=o.stack.FlashTransport[ah].swf;Y.createChannel(aa.channel,aa.secret,j(aa.remote),aa.isHost);if(aa.isHost){if(h&&aa.swfNoThrottle){T(aa.props,{position:"fixed",right:0,top:0,height:"20px",width:"20px"})}T(aa.props,{src:P(aa.remote,{xdm_e:j(p.href),xdm_c:aa.channel,xdm_p:6,xdm_s:aa.secret}),name:U+aa.channel+"_provider"});X=A(aa)}};if(o.stack.FlashTransport[ah]&&o.stack.FlashTransport[ah].init){ag()}else{if(!o.stack.FlashTransport[ah]){o.stack.FlashTransport[ah]={queue:[ag]};Z(ah)}else{o.stack.FlashTransport[ah].queue.push(ag)}}},init:function(){G(ac.onDOMReady,ac)}})};o.stack.PostMessageTransport=function(aa){var ac,ad,Y,Z;function X(ae){if(ae.origin){return j(ae.origin)}if(ae.uri){return j(ae.uri)}if(ae.domain){return p.protocol+"//"+ae.domain}throw"Unable to retrieve the origin of the event"}function ab(af){var ae=X(af);if(ae==Z&&af.data.substring(0,aa.channel.length+1)==aa.channel+" "){ac.up.incoming(af.data.substring(aa.channel.length+1),ae)}}return(ac={outgoing:function(af,ag,ae){Y.postMessage(aa.channel+" "+af,ag||Z);if(ae){ae()}},destroy:function(){x(N,"message",ab);if(ad){Y=null;ad.parentNode.removeChild(ad);ad=null}},onDOMReady:function(){Z=j(aa.remote);if(aa.isHost){var ae=function(af){if(af.data==aa.channel+"-ready"){Y=("postMessage" in ad.contentWindow)?ad.contentWindow:ad.contentWindow.document;x(N,"message",ae);v(N,"message",ab);K(function(){ac.up.callback(true)},0)}};v(N,"message",ae);T(aa.props,{src:P(aa.remote,{xdm_e:j(p.href),xdm_c:aa.channel,xdm_p:1}),name:U+aa.channel+"_provider"});ad=A(aa)}else{v(N,"message",ab);Y=("postMessage" in N.parent)?N.parent:N.parent.document;Y.postMessage(aa.channel+"-ready",Z);K(function(){ac.up.callback(true)},0)}},init:function(){G(ac.onDOMReady,ac)}})};o.stack.FrameElementTransport=function(Y){var Z,ab,aa,X;return(Z={outgoing:function(ad,ae,ac){aa.call(this,ad);if(ac){ac()}},destroy:function(){if(ab){ab.parentNode.removeChild(ab);ab=null}},onDOMReady:function(){X=j(Y.remote);if(Y.isHost){T(Y.props,{src:P(Y.remote,{xdm_e:j(p.href),xdm_c:Y.channel,xdm_p:5}),name:U+Y.channel+"_provider"});ab=A(Y);ab.fn=function(ac){delete ab.fn;aa=ac;K(function(){Z.up.callback(true)},0);return function(ad){Z.up.incoming(ad,X)}}}else{if(d.referrer&&j(d.referrer)!=S.xdm_e){N.top.location=S.xdm_e}aa=N.frameElement.fn(function(ac){Z.up.incoming(ac,X)});Z.up.callback(true)}},init:function(){G(Z.onDOMReady,Z)}})};o.stack.NameTransport=function(ab){var ac;var ae,ai,aa,ag,ah,Y,X;function af(al){var ak=ab.remoteHelper+(ae?"#_3":"#_2")+ab.channel;ai.contentWindow.sendMessage(al,ak)}function ad(){if(ae){if(++ag===2||!ae){ac.up.callback(true)}}else{af("ready");ac.up.callback(true)}}function aj(ak){ac.up.incoming(ak,Y)}function Z(){if(ah){K(function(){ah(true)},0)}}return(ac={outgoing:function(al,am,ak){ah=ak;af(al)},destroy:function(){ai.parentNode.removeChild(ai);ai=null;if(ae){aa.parentNode.removeChild(aa);aa=null}},onDOMReady:function(){ae=ab.isHost;ag=0;Y=j(ab.remote);ab.local=B(ab.local);if(ae){o.Fn.set(ab.channel,function(al){if(ae&&al==="ready"){o.Fn.set(ab.channel,aj);ad()}});X=P(ab.remote,{xdm_e:ab.local,xdm_c:ab.channel,xdm_p:2});T(ab.props,{src:X+"#"+ab.channel,name:U+ab.channel+"_provider"});aa=A(ab)}else{ab.remoteHelper=ab.remote;o.Fn.set(ab.channel,aj)}ai=A({props:{src:ab.local+"#_4"+ab.channel},onLoad:function ak(){var al=ai||this;x(al,"load",ak);o.Fn.set(ab.channel+"_load",Z);(function am(){if(typeof al.contentWindow.sendMessage=="function"){ad()}else{K(am,50)}}())}})},init:function(){G(ac.onDOMReady,ac)}})};o.stack.HashTransport=function(Z){var ac;var ah=this,af,aa,X,ad,am,ab,al;var ag,Y;function ak(ao){if(!al){return}var an=Z.remote+"#"+(am++)+"_"+ao;((af||!ag)?al.contentWindow:al).location=an}function ae(an){ad=an;ac.up.incoming(ad.substring(ad.indexOf("_")+1),Y)}function aj(){if(!ab){return}var an=ab.location.href,ap="",ao=an.indexOf("#");if(ao!=-1){ap=an.substring(ao)}if(ap&&ap!=ad){ae(ap)}}function ai(){aa=setInterval(aj,X)}return(ac={outgoing:function(an,ao){ak(an)},destroy:function(){N.clearInterval(aa);if(af||!ag){al.parentNode.removeChild(al)}al=null},onDOMReady:function(){af=Z.isHost;X=Z.interval;ad="#"+Z.channel;am=0;ag=Z.useParent;Y=j(Z.remote);if(af){Z.props={src:Z.remote,name:U+Z.channel+"_provider"};if(ag){Z.onLoad=function(){ab=N;ai();ac.up.callback(true)}}else{var ap=0,an=Z.delay/50;(function ao(){if(++ap>an){throw new Error("Unable to reference listenerwindow")}try{ab=al.contentWindow.frames[U+Z.channel+"_consumer"]}catch(aq){}if(ab){ai();ac.up.callback(true)}else{K(ao,50)}}())}al=A(Z)}else{ab=N;ai();if(ag){al=parent;ac.up.callback(true)}else{T(Z,{props:{src:Z.remote+"#"+Z.channel+new Date(),name:U+Z.channel+"_consumer"},onLoad:function(){ac.up.callback(true)}});al=A(Z)}}},init:function(){G(ac.onDOMReady,ac)}})};o.stack.ReliableBehavior=function(Y){var aa,ac;var ab=0,X=0,Z="";return(aa={incoming:function(af,ad){var ae=af.indexOf("_"),ag=af.substring(0,ae).split(",");af=af.substring(ae+1);if(ag[0]==ab){Z="";if(ac){ac(true)}}if(af.length>0){aa.down.outgoing(ag[1]+","+ab+"_"+Z,ad);if(X!=ag[1]){X=ag[1];aa.up.incoming(af,ad)}}},outgoing:function(af,ad,ae){Z=af;ac=ae;aa.down.outgoing(X+","+(++ab)+"_"+af,ad)}})};o.stack.QueueBehavior=function(Z){var ac,ad=[],ag=true,aa="",af,X=0,Y=false,ab=false;function ae(){if(Z.remove&&ad.length===0){w(ac);return}if(ag||ad.length===0||af){return}ag=true;var ah=ad.shift();ac.down.outgoing(ah.data,ah.origin,function(ai){ag=false;if(ah.callback){K(function(){ah.callback(ai)},0)}ae()})}return(ac={init:function(){if(t(Z)){Z={}}if(Z.maxLength){X=Z.maxLength;ab=true}if(Z.lazy){Y=true}else{ac.down.init()}},callback:function(ai){ag=false;var ah=ac.up;ae();ah.callback(ai)},incoming:function(ak,ai){if(ab){var aj=ak.indexOf("_"),ah=parseInt(ak.substring(0,aj),10);aa+=ak.substring(aj+1);if(ah===0){if(Z.encode){aa=k(aa)}ac.up.incoming(aa,ai);aa=""}}else{ac.up.incoming(ak,ai)}},outgoing:function(al,ai,ak){if(Z.encode){al=H(al)}var ah=[],aj;if(ab){while(al.length!==0){aj=al.substring(0,X);al=al.substring(aj.length);ah.push(aj)}while((aj=ah.shift())){ad.push({data:ah.length+"_"+aj,origin:ai,callback:ah.length===0?ak:null})}}else{ad.push({data:al,origin:ai,callback:ak})}if(Y){ac.down.init()}else{ae()}},destroy:function(){af=true;ac.down.destroy()}})};o.stack.VerifyBehavior=function(ab){var ac,aa,Y,Z=false;function X(){aa=Math.random().toString(16).substring(2);ac.down.outgoing(aa)}return(ac={incoming:function(af,ad){var ae=af.indexOf("_");if(ae===-1){if(af===aa){ac.up.callback(true)}else{if(!Y){Y=af;if(!ab.initiate){X()}ac.down.outgoing(af)}}}else{if(af.substring(0,ae)===Y){ac.up.incoming(af.substring(ae+1),ad)}}},outgoing:function(af,ad,ae){ac.down.outgoing(aa+"_"+af,ad,ae)},callback:function(ad){if(ab.initiate){X()}}})};o.stack.RpcBehavior=function(ad,Y){var aa,af=Y.serializer||O();var ae=0,ac={};function X(ag){ag.jsonrpc="2.0";aa.down.outgoing(af.stringify(ag))}function ab(ag,ai){var ah=Array.prototype.slice;return function(){var aj=arguments.length,al,ak={method:ai};if(aj>0&&typeof arguments[aj-1]==="function"){if(aj>1&&typeof arguments[aj-2]==="function"){al={success:arguments[aj-2],error:arguments[aj-1]};ak.params=ah.call(arguments,0,aj-2)}else{al={success:arguments[aj-1]};ak.params=ah.call(arguments,0,aj-1)}ac[""+(++ae)]=al;ak.id=ae}else{ak.params=ah.call(arguments,0)}if(ag.namedParams&&ak.params.length===1){ak.params=ak.params[0]}X(ak)}}function Z(an,am,ai,al){if(!ai){if(am){X({id:am,error:{code:-32601,message:"Procedure not found."}})}return}var ak,ah;if(am){ak=function(ao){ak=q;X({id:am,result:ao})};ah=function(ao,ap){ah=q;var aq={id:am,error:{code:-32099,message:ao}};if(ap){aq.error.data=ap}X(aq)}}else{ak=ah=q}if(!r(al)){al=[al]}try{var ag=ai.method.apply(ai.scope,al.concat([ak,ah]));if(!t(ag)){ak(ag)}}catch(aj){ah(aj.message)}}return(aa={incoming:function(ah,ag){var ai=af.parse(ah);if(ai.method){if(Y.handle){Y.handle(ai,X)}else{Z(ai.method,ai.id,Y.local[ai.method],ai.params)}}else{var aj=ac[ai.id];if(ai.error){if(aj.error){aj.error(ai.error)}}else{if(aj.success){aj.success(ai.result)}}delete ac[ai.id]}},init:function(){if(Y.remote){for(var ag in Y.remote){if(Y.remote.hasOwnProperty(ag)){ad[ag]=ab(Y.remote[ag],ag)}}}aa.down.init()},destroy:function(){for(var ag in Y.remote){if(Y.remote.hasOwnProperty(ag)&&ad.hasOwnProperty(ag)){delete ad[ag]}}aa.down.destroy()}})};b.easyXDM=o})(window,document,location,window.setTimeout,decodeURIComponent,encodeURIComponent);
/**
 * lscache library
 * Copyright (c) 2011, Pamela Fox
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jshint undef:true, browser:true */

/**
 * Creates a namespace for the lscache functions.
 */
var lscache = function() {

  // Prefix for all lscache keys
  var CACHE_PREFIX = 'lscache-';

  // Suffix for the key name on the expiration items in localStorage
  var CACHE_SUFFIX = '-cacheexpiration';

  // expiration date radix (set to Base-36 for most space savings)
  var EXPIRY_RADIX = 10;

  // time resolution in minutes
  var EXPIRY_UNITS = 60 * 1000;

  // ECMAScript max Date (epoch + 1e8 days)
  var MAX_DATE = Math.floor(8.64e15/EXPIRY_UNITS);

  var cachedStorage;
  var cachedJSON;
  var cacheBucket = '';

  // Determines if localStorage is supported in the browser;
  // result is cached for better performance instead of being run each time.
  // Feature detection is based on how Modernizr does it;
  // it's not straightforward due to FF4 issues.
  // It's not run at parse-time as it takes 200ms in Android.
  function supportsStorage() {
    var key = '__lscachetest__';
    var value = key;

    if (cachedStorage !== undefined) {
      return cachedStorage;
    }

    try {
      setItem(key, value);
      removeItem(key);
      cachedStorage = true;
    } catch (exc) {
      cachedStorage = false;
    }
    return cachedStorage;
  }

  // Determines if native JSON (de-)serialization is supported in the browser.
  function supportsJSON() {
    /*jshint eqnull:true */
    if (cachedJSON === undefined) {
      cachedJSON = (window.JSON != null);
    }
    return cachedJSON;
  }

  /**
   * Returns the full string for the localStorage expiration item.
   * @param {String} key
   * @return {string}
   */
  function expirationKey(key) {
    return key + CACHE_SUFFIX;
  }

  /**
   * Returns the number of minutes since the epoch.
   * @return {number}
   */
  function currentTime() {
    return Math.floor((new Date().getTime())/EXPIRY_UNITS);
  }

  /**
   * Wrapper functions for localStorage methods
   */

  function getItem(key) {
    return localStorage.getItem(CACHE_PREFIX + cacheBucket + key);
  }

  function setItem(key, value) {
    // Fix for iPad issue - sometimes throws QUOTA_EXCEEDED_ERR on setItem.
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
    localStorage.setItem(CACHE_PREFIX + cacheBucket + key, value);
  }

  function removeItem(key) {
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
  }

  return {

    /**
     * Stores the value in localStorage. Expires after specified number of minutes.
     * @param {string} key
     * @param {Object|string} value
     * @param {number} time
     */
    set: function(key, value, time) {
      if (!supportsStorage()) return;

      // If we don't get a string value, try to stringify
      // In future, localStorage may properly support storing non-strings
      // and this can be removed.
      if (typeof value !== 'string') {
        if (!supportsJSON()) return;
        try {
          value = JSON.stringify(value);
        } catch (e) {
          // Sometimes we can't stringify due to circular refs
          // in complex objects, so we won't bother storing then.
          return;
        }
      }

      try {
        setItem(key, value);
      } catch (e) {
        if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          // If we exceeded the quota, then we will sort
          // by the expire time, and then remove the N oldest
          var storedKeys = [];
          var storedKey;
          for (var i = 0; i < localStorage.length; i++) {
            storedKey = localStorage.key(i);

            if (storedKey.indexOf(CACHE_PREFIX + cacheBucket) === 0 && storedKey.indexOf(CACHE_SUFFIX) < 0) {
              var mainKey = storedKey.substr((CACHE_PREFIX + cacheBucket).length);
              var exprKey = expirationKey(mainKey);
              var expiration = getItem(exprKey);
              if (expiration) {
                expiration = parseInt(expiration, EXPIRY_RADIX);
              } else {
                // TODO: Store date added for non-expiring items for smarter removal
                expiration = MAX_DATE;
              }
              storedKeys.push({
                key: mainKey,
                size: (getItem(mainKey)||'').length,
                expiration: expiration
              });
            }
          }
          // Sorts the keys with oldest expiration time last
          storedKeys.sort(function(a, b) { return (b.expiration-a.expiration); });

          var targetSize = (value||'').length;
          while (storedKeys.length && targetSize > 0) {
            storedKey = storedKeys.pop();
            removeItem(storedKey.key);
            removeItem(expirationKey(storedKey.key));
            targetSize -= storedKey.size;
          }
          try {
            setItem(key, value);
          } catch (e) {
            // value may be larger than total quota
            return;
          }
        } else {
          // If it was some other error, just give up.
          return;
        }
      }

      // If a time is specified, store expiration info in localStorage
      if (time) {
        setItem(expirationKey(key), (currentTime() + time).toString(EXPIRY_RADIX));
      } else {
        // In case they previously set a time, remove that info from localStorage.
        removeItem(expirationKey(key));
      }
    },

    /**
     * Retrieves specified value from localStorage, if not expired.
     * @param {string} key
     * @return {string|Object}
     */
    get: function(key) {
      if (!supportsStorage()) return null;

      // Return the de-serialized item if not expired
      var exprKey = expirationKey(key);
      var expr = getItem(exprKey);

      if (expr) {
        var expirationTime = parseInt(expr, EXPIRY_RADIX);

        // Check if we should actually kick item out of storage
        if (currentTime() >= expirationTime) {
          removeItem(key);
          removeItem(exprKey);
          return null;
        }
      }

      // Tries to de-serialize stored value if its an object, and returns the normal value otherwise.
      var value = getItem(key);
      if (!value || !supportsJSON()) {
        return value;
      }

      try {
        // We can't tell if its JSON or a string, so we try to parse
        return JSON.parse(value);
      } catch (e) {
        // If we can't parse, it's probably because it isn't an object
        return value;
      }
    },

    /**
     * Removes a value from localStorage.
     * Equivalent to 'delete' in memcache, but that's a keyword in JS.
     * @param {string} key
     */
    remove: function(key) {
      if (!supportsStorage()) return null;
      removeItem(key);
      removeItem(expirationKey(key));
    },

    /**
     * Returns whether local storage is supported.
     * Currently exposed for testing purposes.
     * @return {boolean}
     */
    supported: function() {
      return supportsStorage();
    },

    /**
     * Flushes all lscache items and expiry markers without affecting rest of localStorage
     */
    flush: function() {
      if (!supportsStorage()) return;

      // Loop in reverse as removing items will change indices of tail
      for (var i = localStorage.length-1; i >= 0 ; --i) {
        var key = localStorage.key(i);
        if (key.indexOf(CACHE_PREFIX + cacheBucket) === 0) {
          localStorage.removeItem(key);
        }
      }
    },
    
    /**
     * Appends CACHE_PREFIX so lscache will partition data in to different buckets.
     * @param {string} bucket
     */
    setBucket: function(bucket) {
      cacheBucket = bucket;
    },
    
    /**
     * Resets the string being appended to CACHE_PREFIX so lscache will use the default storage behavior.
     */
    resetBucket: function() {
      cacheBucket = '';
    }
  };
}();
/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

(function() {
/*
lscache configuration
requires: localstorage, lscache
Test the schema version inside of lscache, and if it has changed, flush the cache
*/
var schemaVersion;
if (HAS_LOCAL_STORAGE && lscache) {
  lscache.setBucket(FILE_STORAGE_TOKEN);
  schemaVersion = lscache.get(LSCACHE_SCHEMA_VERSION_STRING);

  if (schemaVersion && schemaVersion > 0 && schemaVersion < LSCACHE_SCHEMA_VERSION) {
    lscache.flush();
    lscache.set(LSCACHE_SCHEMA_VERSION_STRING, LSCACHE_SCHEMA_VERSION);
  }
}

/*
easyxdm configuration
requires: easyxdm
Test for if easyXDM was loaded internally, and if so, ensure it doesn't conflict
*/
if (LOCAL_EASY_XDM && context.easyXDM) {
  easyXDM = context.easyXDM.noConflict("Inject");
}
else {
  easyXDM = false;
}
})();

/*
Class.js configuration
*/
var Class = this.Class.noConflict();
/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

var Analyzer;
(function() {
  var AsStatic = Class.extend(function() {
    return {
      init: function() {},
      stripBuiltins: function(modules) {
        var strippedModuleList = [];
        var moduleId;
        for (var i = 0, len = modules.length; i < len; i++) {
          moduleId = modules[i];
          if (moduleId !== "require" && moduleId !== "exports" && moduleId !== "module") {
            strippedModuleList.push(moduleId);
          }
        }
        return strippedModuleList;
      },    
      extractRequires: function(file) {
        var requires = [];
        var requireMatches = null;
        var defines = null;
        var uniques = {};
        var dirtyRuntimeRequires = [];
        var dirtyStaticRequires = [];
        var staticRequires = [];
        var inlineAMD = {};

        // a local require function for eval purposes
        var require = function(term) {
          if (uniques[term] !== true) {
            requires.push(term);
          }
          uniques[term] = true;
        };

        file = file.replace(JS_COMMENTS_REGEX, "");

        // handle runtime require statements
        while(match = REQUIRE_REGEX.exec(file)) {
          dirtyRuntimeRequires.push(match[0].match(GREEDY_REQUIRE_REXEX)[0]);
        }
        if (dirtyRuntimeRequires.length > 0) {
          try {
            eval([dirtyRuntimeRequires.join(";"), "//@ sourceURL=inject-analyzer.js"].join("\n"));
          }
          catch(err) {
            throw new Error("Invalid require() syntax found in file: " + dirtyRuntimeRequires.join(";"));
          }
        }

        // handle static require statements via define() API
        // then attach to master requires[] list
        // extract all define names, then all dependencies
        defines = file.match(DEFINE_EXTRACTION_REGEX);
        if (defines && defines.length) {
          each(defines, function(match) {
            var id = match.replace(DEFINE_EXTRACTION_REGEX, "$1");
            var deps = match.replace(DEFINE_EXTRACTION_REGEX, "$2");

            id = id.replace(BUILTINS_REPLACE_REGEX, "");
            deps = deps.replace(BUILTINS_REPLACE_REGEX, "").split(",");

            if (id) {
              inlineAMD[id] = true;
            }

            if (deps && deps.length) {
              for (var i = 0, len = deps.length; i < len; i++) {
                if (deps[i]) {
                  dirtyStaticRequires.push(deps[i]);
                }
              }
            }
          });

          // for each possible require, make sure we aren't already
          // running this inline
          each(dirtyStaticRequires, function(req) {
            if (uniques[req] !== true && inlineAMD[req] !== true) {
              requires.push(req);
            }
            uniques[req] = true;
          });
        }

        return requires;
      }
    };
  });
  Analyzer = new AsStatic();
})();

/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

var Communicator;
(function() {
  var AsStatic = Class.extend(function() {
    var pauseRequired = false;

    var socketConnectionQueue;
    var downloadCompleteQueue;

    var socket;

    function clearCaches() {
      socketConnectionQueue = [];
      downloadCompleteQueue = {};      
    }

    function writeToCache(url, contents) {
      // lscache and passthrough
      return lscache.set(url, contents, userConfig.fileExpires);
    }

    function readFromCache(url) {
      // lscache and passthrough
      return lscache.get(url);
    }

    function trimHost(host) {
      host = host.replace(HOST_PREFIX_REGEX, "").replace(HOST_SUFFIX_REGEX, "$1");
      return host;
    }

    // when a file completes, resolve all callbacks in its queue
    function resolveCompletedFile(moduleId, url, statusCode, contents) {
      statusCode = 1*statusCode;
      debugLog("Communicator ("+url+")", "status "+statusCode+". Length: "+((contents) ? contents.length : "NaN"));

      // write cache
      if (statusCode === 200) {
        writeToCache(url, contents);
      }

      // locate all callbacks associated with the URL
      each(downloadCompleteQueue[url], function(cb) {
        if (statusCode !== 200) {
          if (Executor) {
            Executor.flagModuleAsBroken(moduleId);
          }
          cb(false);
        }
        else {
          cb(contents);
        }
      });
      downloadCompleteQueue[url] = [];
    }

    // set up our easyXDM socket
    function createSocket() {
      var relayFile = userConfig.xd.relayFile;
      var relaySwf = userConfig.xd.relaySwf || "";
      relayFile += (relayFile.indexOf("?") >= 0) ? "&" : "?";
      relayFile += "swf="+relaySwf;

      socket = new easyXDM.Socket({
        remote: relayFile,
        swf: relaySwf,
        onMessage: function(message, origin) {
          if (typeof(userConfig.moduleRoot) === "string" && trimHost(userConfig.moduleRoot) !== trimHost(origin)) {
            return;
          }
          var pieces = message.split("__INJECT_SPLIT__");
          // pieces[0] moduleId
          // pieces[1] file URL
          // pieces[2] status code
          // pieces[3] file contents
          resolveCompletedFile(pieces[0], pieces[1], pieces[2], pieces[3]);
        },
        onReady: function() {
          pauseRequired = false;
          each(socketConnectionQueue, function(cb) {
            cb();
          });
          socketConnectionQueue = [];
        }
      });
    }

    // these are our two senders, either via easyXDM or via standard xmlHttpRequest
    function sendViaIframe(moduleId, url) {
      socket.postMessage(moduleId + "__INJECT_SPLIT__" + url);
    }
    function sendViaXHR(moduleId, url) {
      var xhr = getXhr();
      xhr.open("GET", url);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          resolveCompletedFile(moduleId, url, xhr.status, xhr.responseText);
        }
      };
      xhr.send(null);
    }

    return {
      init: function() {
        this.clearCaches();
      },
      clearCaches: function() {
        clearCaches();
      },
      get: function(moduleId, url, callback) {
        if (!downloadCompleteQueue[url]) {
          downloadCompleteQueue[url] = [];
        }

        debugLog("Communicator ("+url+")", "requesting");

        var cachedResults = readFromCache(url);
        if (cachedResults) {
          debugLog("Communicator ("+url+")", "retireved from cache. length: "+cachedResults.length);
          callback(cachedResults);
          return;
        }

        debugLog("Communicator ("+url+")", "queued");
        if (downloadCompleteQueue[url].length) {
          downloadCompleteQueue[url].push(callback);
          debugLog("Communicator ("+url+")", "request already in progress");
          return;
        }
        downloadCompleteQueue[url].push(callback);

        if (userConfig.xd.relayFile && !socket && !pauseRequired) {
          pauseRequired = true;
          window.setTimeout(createSocket);
        }

        var socketQueuedFn = function() {
          sendViaIframe(moduleId, url);
        };

        if (pauseRequired) {
          socketConnectionQueue.push(socketQueuedFn);
        }
        else {
          if (userConfig.xd.relayFile) {
            sendViaIframe(moduleId, url);
          }
          else {
            sendViaXHR(moduleId, url);
          }
        }
      }
    };
  });
  Communicator = new AsStatic();
})();
/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

var Executor;
(function() {
  var docHead = false;
  var onErrorOffset = 0;
  var testScript = 'function Inject_Test_Known_Error() {\n  function nil() {}\n  nil("Known Syntax Error Line 3";\n}';
  var initOldError = context.onerror;
  var testScriptNode = createEvalScript(testScript);

  // capture document head
  try { docHead = document.getElementsByTagName("head")[0]; }
  catch(e) { docHead = false; }

  function createEvalScript(code) {
    var scr = document.createElement("script");
    scr.type = "text/javascript";
    try { scr.text = code; } catch (e) {
    try { scr.innerHTML = code; } catch (ee) {
      return false;
    }}
    return scr;
  }

  function cleanupEvalScriptNode(node) {
    window.setTimeout(function() {
      if (docHead) {
        return docHead.removeChild(node);
      }
    });
  }

  // build a test script and ensure it works
  context.onerror = function(err, where, line) {
    onErrorOffset = 3 - line;
    cleanupEvalScriptNode(testScriptNode);
    return true;
  };
  if (docHead) {
    docHead.appendChild(testScriptNode);
  }
  context.onerror = initOldError;
  // test script completion

  function getLineNumberFromException(e) {
    var lines;
    var phrases;
    if (typeof(e.lineNumber) !== "undefined" && e.lineNumber !== null) {
      return e.lineNumber;
    }
    if (typeof(e.line) !== "undefined" && e.line !== null) {
      return e.line;
    }
    if (e.stack) {
      lines = e.stack.split("\n");
      phrases = lines[1].split(":");
      return phrases[phrases.length - 2];
    }
  }

  function executeJavaScriptModule(code, options) {
    var oldError = context.onerror;
    var errorObject = null;
    var sourceString = IS_IE ? "" : "//@ sourceURL=" + options.url;
    var result;

    options = {
      moduleId: options.moduleId || null,
      functionId: options.functionId || null,
      preamble: options.preamble || "",
      preambleLength: options.preamble.split("\n").length + 1,
      epilogue: options.epilogue || "",
      epilogueLength: options.epilogue.split("\n").length + 1,
      originalCode: options.originalCode || code,
      url: options.url || null
    };

    // add source string in sourcemap compatible browsers
    code = [code, sourceString].join("\n");

    // create a temp error handler for exactly this run of code
    // we use this for syntax error handling. It's an inner function
    // because we need to set the universal "errorObject" object
    // so we don't try and execute it later
    var tempErrorHandler = function(err, where, line, type) {
      var actualErrorLine =  line - options.preambleLength;
      var originalCodeLength = options.originalCode.split("\n").length;
      var message = "";

      switch(type) {
        case "runtime":
          message = "Runtime error in " + options.moduleId + " (" + options.url + ") on line " + actualErrorLine + ":\n  " + err;
          break;
        case "parse":
        default:
          // end of input test
          actualErrorLine = (actualErrorLine > originalCodeLength) ? originalCodeLength : actualErrorLine;
          message = "Parsing error in " + options.moduleId + " (" + options.url + ") on line " + actualErrorLine + ":\n  " + err;
      }

      // set the error object global to the executor's run
      errorObject = new Error(message);
      errorObject.line = actualErrorLine;
      errorObject.stack = null;

      context.onerror = oldError;

      return true;
    };

    // set global onError handler
    // insert script - catches parse errors
    context.onerror = tempErrorHandler;
    var scr = createEvalScript(code);
    if (scr && docHead) {
      docHead.appendChild(scr);
      cleanupEvalScriptNode(scr);
    }

    // if there were no errors, tempErrorHandler never ran and therefore
    // errorObject was never set. We can now evaluate using either the eval()
    // method or just running the function we built.
    // if there is not a registered function in the INTERNAL namespace, there
    // must have been a syntax error. Firefox mandates an eval to expose it, so
    // we use that as the least common denominator
    if (!errorObject) {
      if (!context.Inject.INTERNAL.execute[options.functionId] || userConfig.debug.sourceMap) {
        // source mapping means we will take the same source as before,
        // add a () to the end to make it auto execute, and shove it through
        // eval. This means we are doing dual eval (one for parse, one for
        // runtime) when sourceMap is enabled. Some people really want their
        // debug.
        var toExec = code.replace(/([\w\W]+?)=([\w\W]*})[\w\W]*?$/, "$1 = ($2)();");
        var relativeE;
        toExec = [toExec, sourceString].join("\n");
        if (!context.Inject.INTERNAL.execute[options.functionId]) {
          // there is nothing to run, so there must have been an uncaught
          // syntax error (firefox). 
          try {
            try { eval("+\n//@ sourceURL=inject-executor-line.js"); } catch (ee) { relativeE = ee; }
            eval(toExec);
          }
          catch(e) {
            if (e.lineNumber && relativeE.lineNumber) {
              e.lineNumber = e.lineNumber - relativeE.lineNumber + 1;
            }
            else {
              e.lineNumber = getLineNumberFromException(e);
            }
            tempErrorHandler(e.message, null, e.lineNumber, "parse")
          }
        }
        else {
          // again, we are creating a "relativeE" to capture the eval line
          // this allows us to get accurate line numbers in firefox
          try { eval("+\n//@ sourceURL=inject-executor-line.js"); } catch (ee) { relativeE = ee; }
          eval(toExec);
        }
        
        if (context.Inject.INTERNAL.execute[options.functionId]) {
          result = context.Inject.INTERNAL.execute[options.functionId];
          // set the error object using our standard method
          // result.error will be later overwritten with a clean and readable Error()
          if (result.error) {
            if (result.error.lineNumber && relativeE.lineNumber) {
              result.error.lineNumber = result.error.lineNumber - relativeE.lineNumber;
            }
            else {
              result.error.lineNumber = getLineNumberFromException(result.error);
            }
            tempErrorHandler(result.error.message, null, result.error.lineNumber, "runtime");
          }
        }
      }
      else {
        // just run it. Try/catch will capture exceptions and put them
        // into result.error for us from commonjs harness
        result = context.Inject.INTERNAL.execute[options.functionId]();
        if (result.error) {
          tempErrorHandler(result.error.message, null, getLineNumberFromException(result.error), "runtime");
        }
      }
    }

    // if we have an error object, we should attach it to the result
    // if there is no result, make an empty shell so we can test for
    // result.error in other code.
    if (errorObject) {
      if (!result) {
        result = {};
      }
      result.error = errorObject;
    }

    // clean up the function or object we globally created if it exists
    if(context.Inject.INTERNAL.execute[options.functionId]) {
      delete context.Inject.INTERNAL.execute[options.functionId];
    }

    // return the results
    return result;
  }

  var AsStatic = Class.extend(function() {
    var functionCount = 0;
    return {
      init: function() {
        this.clearCaches();
      },
      clearCaches: function() {
        // cache of resolved exports
        this.cache = {};

        // cache of executed modules (true/false)
        this.executed = {};

        // cache of "broken" modules (true/false)
        this.broken = {};

        // cache of "circular" modules (true/false)
        this.circular = {};

        // AMD style defined modules (true/false)
        this.defined = {};

        // the stack of AMD define functions, because they "could" be anonymous
        this.anonymousAMDStack = [];
      },
      defineExecutingModuleAs: function(moduleId, path) {
        return this.anonymousAMDStack.push({
          id: moduleId,
          path: path
        });
      },
      undefineExecutingModule: function() {
        return this.anonymousAMDStack.pop();
      },
      getCurrentExecutingAMD: function() {
        return this.anonymousAMDStack[this.anonymousAMDStack.length - 1];
      },
      runTree: function(root, files, callback) {
        // do a post-order traverse of files for execution
        var returns = [];
        root.postOrder(function(node) {
          if (!node.getValue().name) {
            return; // root node
          }
          var name = node.getValue().name;
          var path = node.getValue().path;
          var file = files[name];
          var resolvedId = node.getValue().resolvedId;
          // var resolvedName = (node.getParent())
          //                  ? RulesEngine.resolveIdentifier(name, node.getParent().getValue().name)
          //                  : resolvedId;
          var pointcuts = RulesEngine.getPointcuts(path, true);
          Executor.createModule(resolvedId, path);
          if (!node.isCircular()) {
            // note: we use "name" here, because of CommonJS Spec 1.0 Modules
            // the relative includes we find must be relative to "name", not the
            // resovled name
            returns.push(Executor.runModule(resolvedId, file, path, pointcuts));
          }
        });
        // all files are executed
        callback(returns);
      },
      createModule: function(moduleId, path) {
        var module;
        if (!this.cache[moduleId]) {
          module = {};
          module.id = moduleId || null;
          module.uri = path || null;
          module.exports = {};
          module.error = null;
          module.setExports = function(xobj) {
            for (var name in module.exports) {
              debugLog("cannot setExports when exports have already been set. setExports skipped");
              return;
            }
            switch(typeof(xobj)) {
              case "object":
                // objects are enumerated and added
                for (var name in xobj) {
                  module.exports[name] = xobj[name];
                }
                break;
              case "function":
              default:
                // non objects are written directly, blowing away exports
                module.exports = xobj;
                break;
            }
          };

          if (moduleId) {
            this.cache[moduleId] = module;
          }
        }

        if (moduleId) {
          return this.cache[moduleId];
        }
        else {
          return module;
        }
      },
      isModuleDefined: function(moduleId) {
        return this.defined[moduleId];
      },
      flagModuleAsDefined: function(moduleId) {
        this.defined[moduleId] = true;
      },
      flagModuleAsBroken: function(moduleId) {
        this.broken[moduleId] = true;
      },
      flagModuleAsCircular: function(moduleId) {
        this.circular[moduleId] = true;
      },
      isModuleCircular: function(moduleId) {
        return this.circular[moduleId];
      },
      getModule: function(moduleId) {
        if (this.broken[moduleId]) {
          throw new Error("module "+moduleId+" failed to load successfully");
        }
        return this.cache[moduleId] || null;
      },
      runModule: function(moduleId, code, path, pointcuts) {
        debugLog("Executor", "executing " + path);
        // check cache
        if (this.cache[moduleId] && this.executed[moduleId]) {
          return this.cache[moduleId];
        }

        // check AMD define-style cache
        if (this.cache[moduleId] && this.defined[moduleId]) {
          return this.cache[moduleId];
        }

        var functionId = "exec" + (functionCount++);
        var header = commonJSHeader.replace(/__MODULE_ID__/g, moduleId)
                                   .replace(/__MODULE_URI__/g, path)
                                   .replace(/__FUNCTION_ID__/g, functionId)
                                   .replace(/__INJECT_NS__/g, NAMESPACE)
                                   .replace(/__POINTCUT_BEFORE__/g, pointcuts.before || "");
        var footer = commonJSFooter.replace(/__INJECT_NS__/g, NAMESPACE)
                                   .replace(/__POINTCUT_AFTER__/g, pointcuts.after || "");
        var runCommand = ([header, ";", code, footer]).join("\n");
        var errorObject;
        var result;
        var actualErrorLine;
        var message;

        // try to run the JS as a module, errors set errorObject
        // try {
          result = executeJavaScriptModule(runCommand, {
            moduleId: moduleId,
            functionId: functionId,
            preamble: header,
            epilogue: footer,
            originalCode: code,
            url: path
          });
        // }
        // catch(e) {
        //   errorObject = e;
        // }       

        // if a global error object was created
        if (result && result.error) {
          Inject.clearCache();
          throw result.error;
        }

        // cache the result (IF NOT AMD)
        if (!DEFINE_EXTRACTION_REGEX.test(code)) {
          this.cache[moduleId] = result;
        }

        this.executed[moduleId] = true;
        debugLog("Executor", "executed", moduleId, path, result);

        // return the result
        return result;
      }
    };
  });
  Executor = new AsStatic();
})();
/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

var InjectCore;
(function() {
  var AsStatic = Class.extend(function() {
    return {
      init: function() {},
      createRequire: function(id, path) {
        var req = new RequireContext(id, path);
        var require = proxy(req.require, req);
        require.ensure = proxy(req.ensure, req);
        require.run = proxy(req.run, req);
        // resolve an identifier to a URL
        require.toUrl = function(identifier) {
          var resolvedId = RulesEngine.resolveIdentifier(identifier, id);
          var resolvedPath = RulesEngine.resolveUrl(resolvedId);
          return resolvedPath;
        };
        return require;
      },
      createDefine: function(id, path) {
        var req = new RequireContext(id, path);
        var define = proxy(req.define, req);
        define.amd = {};
        return define;
      },
      setModuleRoot: function(root) {
        userConfig.moduleRoot = root;
      },
      setCrossDomain: function(crossDomainConfig) {
        userConfig.xd.relayFile = crossDomainConfig.relayFile || null;
        userConfig.xd.relaySwf = crossDomainConfig.relaySwf || null;
      },
      clearCache: function() {
        if (HAS_LOCAL_STORAGE && lscache) {
          lscache.flush();
        }
      },
      setExpires: function(seconds) {
        userConfig.fileExpires = seconds || 0;
      },
      setCacheKey: function(cacheKey) {
        var lscacheAppCacheKey;
        var flush = false;

        if (!HAS_LOCAL_STORAGE || !lscache) {
          return false;
        }

        lscacheAppCacheKey = lscache.get(LSCACHE_APP_KEY_STRING);

        if ( (!cacheKey && lscacheAppCacheKey) ||
             (lscacheAppCacheKey !== null && lscacheAppCacheKey != cacheKey) ||
             (lscacheAppCacheKey === null && cacheKey) ) {
          lscache.flush();
          lscache.set(LSCACHE_APP_KEY_STRING, cacheKey);
        }
      },
      reset: function() {
        this.clearCache();
        Executor.clearCaches();
        Communicator.clearCaches();
      },
      enableDebug: function(key, value) {
        userConfig.debug[key] = value || true;
      }
    };
  });
  InjectCore = new AsStatic();
})();

/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

var RequireContext = Class.extend(function() {
  return {
    init: function(id, path) {
      this.id = id || null;
      this.path = path || null;
    },
    log: function(message) {
      debugLog("RequireContext for "+this.path, message);
    },
    getPath: function() {
      if (!userConfig.moduleRoot) {
        throw new Error("moduleRoot must be defined. Please use Inject.setModuleRoot()");
      }
      return this.path || userConfig.moduleRoot;
    },
    getId: function() {
      return this.id || "";
    },
    getModule: function(moduleId) {
      return Executor.getModule(moduleId).exports;
    },
    getAllModules: function(moduleIdOrList, require, module) {
      var args = [];
      var mId = null;
      for (var i = 0, len = moduleIdOrList.length; i < len; i++) {
        mId = moduleIdOrList[i];
        switch(mId) {
          case "require":
            args.push(require);
            break;
          case "module":
            args.push(module);
            break;
          case "exports":
            args.push(module.exports);
            break;
          default:
            // push the resolved item onto the stack direct from executor
            args.push(this.getModule(mId));
        }
      }
      return args;
    },
    require: function(moduleIdOrList, callback) {
      var path;
      var module;
      var identifier;

      if (typeof(moduleIdOrList) === "string") {
        this.log("CommonJS require(string) of "+moduleIdOrList);
        if (/^[\d]+$/.test(moduleIdOrList)) {
          throw new Error("require() must be a string containing a-z, slash(/), dash(-), and dots(.)");
        }

        identifier = RulesEngine.resolveIdentifier(moduleIdOrList, this.getId());
        module = Executor.getModule(identifier);

        if (!module) {
          throw new Error("module "+moduleIdOrList+" not found");
        }

        return module.exports;
      }

      // AMD require
      this.log("AMD require(Array) of "+moduleIdOrList.join(", "));
      var strippedModules = Analyzer.stripBuiltins(moduleIdOrList);
      this.ensure(strippedModules, proxy(function(localRequire) {
        var module = Executor.createModule();
        var modules = this.getAllModules(moduleIdOrList, localRequire, module);
        callback.apply(context, modules);
      }, this));
    },
    ensure: function(moduleList, callback) {
      if (Object.prototype.toString.call(moduleList) !== '[object Array]') {
        throw new Error("require.ensure() must take an Array as the first argument");
      }

      this.log("CommonJS require.ensure(array) of "+moduleList.join(", "));

      // strip builtins (CommonJS doesn't download or make these available)
      moduleList = Analyzer.stripBuiltins(moduleList);

      var tn;
      var td;
      var callsRemaining = moduleList.length;
      var thisPath = (this.getPath()) ? this.getPath() : userConfig.moduleRoot;

      // exit early when we have no builtins left
      if (!callsRemaining) {
        if (callback) {
          callback(InjectCore.createRequire(this.getId(), this.getPath()));
        }
        return;
      }

      // for each module, spawn a download. On download, spawn an execution
      // when all executions have ran, fire the callback with the local require
      // scope
      for (var i = 0, len = moduleList.length; i < len; i++) {
        tn = TreeDownloader.createNode(moduleList[i], thisPath);
        td = new TreeDownloader(tn);
        // get the tree, then run the tree, then --count
        // if count is 0, callback
        td.get(proxy(function(root, files) {
          Executor.runTree(root, files, proxy(function() {
            // test if all modules are done
            if (--callsRemaining === 0) {
              if (callback) {
                callback(InjectCore.createRequire(this.getId(), this.getPath()));
              }
            }
          }, this));
        }, this));
      }
    },
    run: function(moduleId) {
      this.log("AMD require.run(string) of "+moduleId);
      this.ensure([moduleId]);
    },
    define: function() {
      var args = Array.prototype.slice.call(arguments, 0);
      var id = null;
      var dependencies = ["require", "exports", "module"];
      var executionFunctionOrLiteral = {};
      var remainingDependencies = [];
      var resolvedDependencyList = [];
      var tempModule = null;
      var tempModuleId = null;
      var thisModulePath;

      // these are the various AMD interfaces and what they map to
      // we loop through the args by type and map them down into values
      // while not efficient, it makes this overloaed interface easier to
      // maintain
      var interfaces = {
        "string array object": ["id", "dependencies", "executionFunctionOrLiteral"],
        "string object":       ["id", "executionFunctionOrLiteral"],
        "array object":        ["dependencies", "executionFunctionOrLiteral"],
        "object":              ["executionFunctionOrLiteral"]
      };
      var key = [];
      var value;
      for (var i = 0, len = args.length; i < len; i++) {
        if (Object.prototype.toString.apply(args[i]) === '[object Array]') {
          key.push("array");
        }
        else if (typeof(args[i]) === "object" || typeof(args[i]) === "function") {
          key.push("object");
        }
        else {
          key.push(typeof(args[i]));
        }
      }
      key = key.join(" ");

      if (!interfaces[key]) {
        throw new Error("You did not use an AMD compliant interface. Please check your define() calls");
      }

      key = interfaces[key];
      for (var i = 0, len = key.length; i < len; i++) {
        value = args[i];
        switch(key[i]) {
          case "id":
            id = value;
            break;
          case "dependencies":
            dependencies = value;
            break;
          case "executionFunctionOrLiteral":
            executionFunctionOrLiteral = value;
            break;
        }
      }

      this.log("AMD define(...) of "+ ((id) ? id : "anonymous"));

      // strip any circular dependencies that exist
      // this will prematurely create modules
      for (var i = 0, len = dependencies.length; i < len; i++) {
        if (BUILTINS[dependencies[i]]) {
          // was a builtin, skip
          resolvedDependencyList.push(dependencies[i]);
          continue;
        }
        // TODO: amd dependencies are resolved FIRST against their current ID
        // then against the module Root (huge deviation from CommonJS which uses
        // the filepaths)
        tempModuleId = RulesEngine.resolveIdentifier(dependencies[i], this.getId());
        resolvedDependencyList.push(tempModuleId);
        if (!Executor.isModuleCircular(tempModuleId) && !Executor.isModuleDefined(tempModuleId)) {
          remainingDependencies.push(dependencies[i]);
        }
      }

      // handle anonymous modules
      if (!id) {
        id = Executor.getCurrentExecutingAMD().id;
        this.log("AMD identified anonymous module as "+id);
      }

      if (Executor.isModuleDefined(id)) {
        this.log("AMD module "+id+" has already ran once");
        return;
      }
      Executor.flagModuleAsDefined(id);

      if (typeof(executionFunctionOrLiteral) === "function") {
        dependencies.concat(Analyzer.extractRequires(executionFunctionOrLiteral.toString()));
      }

      this.log("AMD define(...) of "+id+" depends on: "+dependencies.join(", "));
      this.log("AMD define(...) of "+id+" will retrieve: "+remainingDependencies.join(", "));

      // ask only for the missed items + a require
      remainingDependencies.unshift("require");
      this.require(remainingDependencies, proxy(function(require) {
        this.log("AMD define(...) of "+id+" all downloads required");

        // use require as our first arg
        var module = Executor.getModule(id);

        // if there is no module, it was defined inline
        if (!module) {
          module = Executor.createModule(id);
        }

        var resolvedDependencies = this.getAllModules(resolvedDependencyList, require, module);
        var results;

        // if the executor is a function, run it
        // if it is an object literal, walk it.
        if (typeof(executionFunctionOrLiteral) === "function") {
          results = executionFunctionOrLiteral.apply(null, resolvedDependencies);
          if (results) {
            module.setExports(results);
          }
        }
        else {
          for (name in executionFunctionOrLiteral) {
            module.exports[name] = executionFunctionOrLiteral[name];
          }
        }

      }, this));
    }
  };
});

/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

var RulesEngine;
(function() {
  var rules = [];
  var rulesIsDirty = false;

  function sortRulesTable() {
    rules.sort(function(a, b) {
      return a.weight - b.weight;
    });
    rulesIsDirty = false;
  }

  function functionToPointcut(fn) {
    return fn.toString().replace(FUNCTION_BODY_REGEX, "$1");
  }

  var AsStatic = Class.extend(function() {
    return {
      init: function() {
        this.pointcuts = {};
      },
      resolveIdentifier: function(identifier, relativeTo) {
        if (!relativeTo) {
          relativeTo = "";
        }

        if (identifier.indexOf(".") !== 0) {
          relativeTo = "";
        }

        // basedir
        if (relativeTo) {
          relativeTo = relativeTo.split("/");
          relativeTo.pop();
          relativeTo = relativeTo.join("/");
        }

        if (identifier.indexOf("/") === 0) {
          return identifier;
        }

        identifier = this.computeRelativePath(identifier, relativeTo);

        if (identifier.indexOf("/") === 0) {
          identifier = identifier.split("/");
          identifier.shift();
          identifier = identifier.join("/");
        }

        return identifier;
      },
      resolveUrl: function(path, relativeTo) {
        var resolvedUrl;

        // if no module root, freak out
        if (!userConfig.moduleRoot) {
          throw new Error("module root needs to be defined for resolving URLs");
        }

        if (relativeTo && !userConfig.baseDir) {
          relativeTo = relativeTo.split("/");
          if (relativeTo[relativeTo.length - 1]) {
            // not ending in /
            relativeTo.pop();
          }
          relativeTo = relativeTo.join("/");
        }
        else if (relativeTo) {
          relativeTo = userConfig.baseDir(relativeTo);
        }
        else {
          relativeTo = userConfig.moduleRoot;
        }

        // exit early on resolved http URL
        if (ABSOLUTE_PATH_REGEX.test(path)) {
          return path;
        }

        // Apply our rules to the path in progress
        var result = this.applyRules(path);
        path = result.resolved;

        // exit early on resolved http URL
        if (ABSOLUTE_PATH_REGEX.test(path)) {
          return path;
        }

        // shortcut. If it starts with /, affix to module root
        if (path.indexOf("/") === 0) {
          resolvedUrl = userConfig.moduleRoot + path.substr(1);
          if (userConfig.useSuffix && !FILE_SUFFIX_REGEX.test(resolvedUrl)) {
            resolvedUrl = resolvedUrl + BASIC_FILE_SUFFIX;
          }
          return resolvedUrl;
        }

        // take off the :// to replace later
        relativeTo = relativeTo.replace(/:\/\//, "__INJECT_PROTOCOL_COLON_SLASH_SLASH__");
        path = path.replace(/:\/\//, "__INJECT_PROTOCOL_COLON_SLASH_SLASH__");

        var resolvedUrl = this.computeRelativePath(path, relativeTo);

        resolvedUrl = resolvedUrl.replace(/__INJECT_PROTOCOL_COLON_SLASH_SLASH__/, "://");

        if (userConfig.useSuffix && !FILE_SUFFIX_REGEX.test(resolvedUrl)) {
          resolvedUrl = resolvedUrl + BASIC_FILE_SUFFIX;
        }

        // store pointcuts based on the resolved URL
        this.pointcuts[resolvedUrl] = result.pointcuts;

        return resolvedUrl;
      },
      computeRelativePath: function(id, base) {
        var blownApartURL;
        var resolved = [];

        // exit early on resolved :// in a URL
        if (ABSOLUTE_PATH_REGEX.test(id)) {
          return id;
        }

        blownApartURL = [].concat(base.split("/"), id.split("/"));
        for (var i = 0, len = blownApartURL.length; i < len; i++) {
          piece = blownApartURL[i];

          if (piece === "." || (piece === "" && i > 0)) {
            // skip . or "" (was "//" in url at position 0)
            continue;
          }
          else if (piece === "..") {
            // up one directory
            if (resolved.length === 0) {
              throw new Error("could not traverse higher than highest path");
            }
            resolved.pop();
          }
          else {
            // fragment okay, add
            resolved.push(piece);
          }
        }

        resolved = resolved.join("/");
        return resolved;
      },

      getPointcuts: function(path, asString) {
        var pointcuts = this.pointcuts[path] || {before: [], after: []};
        var result = {
          before: [],
          after: []
        };
        var pointcut;

        if (typeof(asString) === "undefined") {
          return {
            before: pointcuts.before,
            after: pointcuts.after
          }
        }

        for (var i = 0, len = pointcuts.before.length; i < len; i++) {
          pointcut = pointcuts.before[i];
          result.before.push(functionToPointcut(pointcut));
        }
        for (var i = 0, len = pointcuts.after.length; i < len; i++) {
          pointcut = pointcuts.after[i];
          result.after.push(functionToPointcut(pointcut));
        }

        result.before = result.before.join("\n");
        result.after = result.after.join("\n");

        return result;

      },
      addRule: function(regexMatch, weight, ruleSet) {
        // regexMatch, ruleSet
        // regexMatch, weight, ruleSet
        if (typeof(ruleSet) === "undefined") {
          if (typeof(weight) === "undefined") {
            // one param
            ruleSet = regexMatch;
            weight = null;
            regexMatch = null;
          }

          // two params
          ruleSet = weight;
          weight = null;
        }

        // if weight was not set, create it
        if (!weight) {
          weight = rules.length;
        }

        if (typeof(ruleSet) === "string") {
          ruleSet = {
            path: ruleSet
          };
        }

        rules.push({
          matches: ruleSet.matches || regexMatch,
          weight: ruleSet.weight || weight,
          last: ruleSet.last || false,
          path: ruleSet.path,
          pcAfter: (ruleSet.pointcuts && ruleSet.pointcuts.after) ? ruleSet.pointcuts.after : null,
          pcBefore: (ruleSet.pointcuts && ruleSet.pointcuts.before) ? ruleSet.pointcuts.before : null
        });

      },
      manifest: function(manifestObj) {
        var key;
        var rule;

        for (key in manifestObj) {
          rule = manifestObj[key];
          // update the key to a "matches" if included in manifest
          if (rule.matches) {
            key = rule.matches;
          }
          this.addRule(key, rule);
        }
      },
      applyRules: function(path) {
        if (rulesIsDirty) {
          sortRulesTable();
        }

        var result = path;
        var payload;
        var beforePointCuts = [];
        var afterPointCuts = [];
        var done = false;
        each(rules, function(rule) {
          if (done) return;

          var match = false;
          // rule matching
          if (typeof(rule.matches) === "string" && rule.matches === result) {
            match = true;
          }
          else if (typeof(rule.matches) === "object" && rule.matches.test(result)) {
            match = true;
          }
          // if we have a match, do a replace
          if (match) {
            if (typeof(rule.path) === "string") {
              result = rule.path;
            }
            else if (typeof(rule.path) === "function") {
              result = rule.path(result);
            }

            if (rule.pcBefore) {
              beforePointCuts.push(rule.pcBefore);
            }
            if (rule.pcAfter) {
              afterPointCuts.push(rule.pcAfter);
            }
            if (rule.last) {
              done = true;
            }
          }

        });

        payload = {
          resolved: result || "",
          pointcuts: {
            before: beforePointCuts,
            after: afterPointCuts
          }
        };

        return payload;

      }
    };
  });
  RulesEngine = new AsStatic();
})();

/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

// depends on
// ModuleDB
//  GenericDB
// ModuleDBRecord
//  GenericDBRecord
// TreeNode
// Communicator
// Analyzer

var TreeDownloader = Class.extend(function() {
  return {
    init: function(root) {
      this.callsRemaining = 0;
      this.root = root;
      this.files = {};
    },
    log: function() {
      var args = [].slice.call(arguments, 0);
      var name = (this.root.getValue()) ? this.root.getValue().name : null;
      debugLog("TreeDownloader ("+name+")", args.join(" "));
    },
    reduceCallsRemaining: function(callback, args) {
      this.callsRemaining--;
      this.log("reduce. outstanding", this.callsRemaining);
      // TODO: there is a -1 logic item here to fix
      if (this.callsRemaining <= 0) {
        callback.call(null, args);
      }
    },
    increaseCallsRemaining: function(by) {
      this.callsRemaining += by || 1;
      this.log("increase. outstanding", this.callsRemaining);
    },
    getFiles: function() {
      return this.files;
    },
    get: function(callback) {
      /*
          root
          /  \
         A    B
        / \   |
       B   C  D
       |      |
       D      A
       |     / \
      (A)  (B)  C

       root: no-download. Add A, Add B. Spawn A, Spawn B // count = 0 + 2 = 2 (add A, add B)
       A: download. Add B, Add C. Spawn C (B logged) // count = 2 - 1 + 1 = 2 (remove A, add C)
       B: download. Add D. Spawn D // count = 2 - 1 + 1 = 2 (remove B, add D)
       C: download // count = 2 - 1 = 1 (remove C)
       D: download // count = 1 - 1 = 0 (remove D)
      */
      this.log("started download");
      this.downloadTree(this.root, proxy(function(root) {
        callback(this.root, this.getFiles());
      }, this));
    },
    downloadTree: function(node, callback) {
      // Normalize Module Path. Download. Analyze.
      var parentPath = (node.getParent() && node.getParent().getValue())
                        ? node.getParent().getValue().path
                        : userConfig.moduleRoot;
      var parentName =  (node.getParent() && node.getParent().getValue())
                        ? node.getParent().getValue().name
                        : "";

      // get the path and REAL identifier for this module (resolve relative references)
      var identifier = RulesEngine.resolveIdentifier(node.getValue().name, parentName);
      node.getValue().path = RulesEngine.resolveUrl(identifier);
      node.getValue().resolvedId = identifier;

      // top level starts at 1
      if (!node.getParent()) {
        this.increaseCallsRemaining();
      }

      // do not bother to download AMD define()-ed files
      if (Executor.isModuleDefined(node.getValue().name)) {
        this.log("AMD defined module, no download required", node.getValue().name);
        this.reduceCallsRemaining(callback, node);
        return;
      }

      this.log("requesting file", node.getValue().path);
      Communicator.get(node.getValue().name, node.getValue().path, proxy(function(contents) {
        this.log("download complete", node.getValue().path);
        var parent = node;
        var found = {};
        var value;

        // seed found with the first item
        found[node.getValue().name] = true;
        parent = parent.getParent();
        // test if you are a circular reference. check every parent back to root
        while(parent) {
          if (!parent.getValue()) {
            // reached root
            break;
          }

          value = parent.getValue().name;
          if (found[value]) {
            this.log("circular reference found", node.getValue().name);
            // flag the node as circular (commonJS) and the module itself (AMD)
            node.flagCircular();
            Executor.flagModuleAsCircular(node.getValue().name);
          }
          found[value] = true;
          parent = parent.getParent();
        }

        // if it is not circular, and we have contents
        if (!node.isCircular() && contents) {
          // store file contents for later
          this.files[node.getValue().name] = contents;

          var tempRequires = Analyzer.extractRequires(contents);
          var requires = [];
          var childNode;
          var name;
          var path;

          // remove already-defined AMD modules before we go further
          for (var i = 0, len = tempRequires.length; i < len; i++) {
            name = RulesEngine.resolveIdentifier(tempRequires[i], node.getValue().name);
            if (!Executor.isModuleDefined(name) && !Executor.isModuleDefined(tempRequires[i])) {
              requires.push(tempRequires[i]);
            }
          }

          this.log("dependencies ("+requires.length+"):" + requires.join(", "));

          // for each requires, create a child and spawn
          if (requires.length) {
            this.increaseCallsRemaining(requires.length);
          }
          for (var i = 0, len = requires.length; i < len; i++) {
            name = requires[i];
            path = RulesEngine.resolveUrl(RulesEngine.resolveIdentifier(name, node.getValue().name));
            childNode = TreeDownloader.createNode(name, path);
            node.addChild(childNode);
            this.downloadTree(childNode, proxy(function() {
              this.reduceCallsRemaining(callback, node);
            }, this));
          }
        }

        // if contents was a literal false, we had an error
        if (contents === false) {
          node.getValue().failed = true;
        }

        // this module is processed
        this.reduceCallsRemaining(callback, node);
      }, this));
    }
  };
});
TreeDownloader.createNode = function(name, path, isCircular) {
  var tn = new TreeNode({
    name: name,
    path: path,
    failed: false
  });
  if (isCircular) {
    tn.flagCircular();
  }
  return tn;
}
/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/

// TreeNode JS
var TreeNode = Class.extend(function() {
  return {
    init: function(value) {
      this.value = value;
      this.children = [];
      this.left = null;
      this.right = null;
      this.parent = null;
      this.isCircularNode = false;
    },
    getValue: function() {
      return this.value;
    },
    flagCircular: function() {
      this.isCircularNode = true;
    },
    isCircular: function() {
      return this.isCircularNode;
    },
    addChild: function(node) {
      var rightChild;
      if (this.children.length > 0) {
        rightChild = this.children[this.children.length - 1];
        node.setLeft(rightChild);
        rightChild.setRight(node);
      }
      this.children.push(node);
      return node.setParent(this);
    },
    getChildren: function() {
      return this.children;
    },
    setLeft: function(node) {
      return this.left = node;
    },
    getLeft: function() {
      return this.left;
    },
    setRight: function(node) {
      return this.right = node;
    },
    getRight: function() {
      return this.right;
    },
    setParent: function(node) {
      return this.parent = node;
    },
    getParent: function() {
      return this.parent;
    },
    postOrder: function(callback) {
      // post order traversal to an array
      // left, right, parent
      var currentNode = this,
          direction = null,
          output = [],
          i = 0;
      
      while (currentNode) {
        
        if (currentNode.getChildren().length > 0 && direction !== "up") {
          direction = "down";
          currentNode = currentNode.getChildren()[0];
          continue;
        }

        // node correct
        output.push(currentNode.getValue());
        if (callback) {
          callback(currentNode);
        }
        // end node correct

        if (currentNode.getRight()) {
          direction = "right";
          currentNode = currentNode.getRight();
          continue;
        }

        if (currentNode.getParent()) {
          direction = "up";
          currentNode = currentNode.getParent();
          continue;
        }

        return output;
      }
    }
  };
});

/*
Inject
Copyright 2011 LinkedIn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.   See the License for the specific language
governing permissions and limitations under the License.
*/
/**
 * This file defines the public interface for Inject
 * many functions in this collection pass through via proxy
 * to internal methods
 * @file public interface for Inject
 */
var globalRequire = new RequireContext();

context.Inject = {
  INTERNAL: {
    defineExecutingModuleAs: proxy(Executor.defineExecutingModuleAs, Executor),
    undefineExecutingModule: proxy(Executor.undefineExecutingModule, Executor),
    createModule: proxy(Executor.createModule, Executor),
    setModuleExports: function() {},
    execute: {},
    globalRequire: globalRequire,
    createRequire: proxy(InjectCore.createRequire, InjectCore),
    createDefine: proxy(InjectCore.createDefine, InjectCore)
  },
  easyXDM: easyXDM,
  reset: function() {
    InjectCore.reset();
  },
  enableDebug: function() {
    InjectCore.enableDebug.apply(this, arguments);
  },
  toUrl: function() {
    RulesEngine.toUrl.apply(this, arguments);
  },
  setModuleRoot: function() {
    InjectCore.setModuleRoot.apply(this, arguments);
  },
  setExpires: function() {
    InjectCore.setExpires.apply(this, arguments);
  },
  setCacheKey: function() {
    InjectCore.setCacheKey.apply(this, arguments);
  },
  setCrossDomain: function() {
    InjectCore.setCrossDomain.apply(this, arguments);
  },
  clearCache: function() {
    InjectCore.clearCache();
  },
  manifest: function() {
    RulesEngine.manifest.apply(RulesEngine, arguments);
  },
  addRule: function() {
    RulesEngine.addRule.apply(RulesEngine, arguments);
  },
  require: InjectCore.createRequire(),
  define: InjectCore.createDefine(),
  version: INJECT_VERSION
};

// commonJS (and AMD's toUrl)
context.require = context.Inject.INTERNAL.createRequire();

// AMD
context.define = context.Inject.INTERNAL.createDefine();
})(this);