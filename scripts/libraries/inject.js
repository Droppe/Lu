(function() {/*

 Library: Inject
 Homepage: https://github.com/linkedin/inject
 License: Apache 2.0 License
*/
/*

 Inject
 Copyright (c) 2011 LinkedIn
 Apache Software License 2.0 (see below)

 lscache library (c) 2011 Pamela Fox
 Apache Software License 2.0 (see below)

 Porthole
 Copyright (c) 2011 Ternary Labs
 MIT License (see below)

 JSON
 Public Domain 2011-10-19

 APACHE SOFTWARE LICENSE 2.0
 ===
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 MIT LICENSE
 ===
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
var Porthole = typeof Porthole == "undefined" || !Porthole ? {} : Porthole;
(function() {
  var targetWindow = null;
  Porthole = {trace:function(s) {
    try {
      console.log("Porthole: " + s)
    }catch(e) {
    }
  }, error:function(s) {
    try {
      console.error("Porthole: " + s)
    }catch(e) {
    }
  }};
  Porthole.WindowProxy = function() {
  };
  Porthole.WindowProxy.prototype = {postMessage:function() {
  }, addEventListener:function(f) {
  }, removeEventListener:function(f) {
  }};
  Porthole.WindowProxyLegacy = function(proxyIFrameUrl, targetWindowName) {
    if(targetWindowName === undefined) {
      targetWindowName = ""
    }
    this.targetWindowName = targetWindowName;
    this.eventListeners = [];
    this.origin = window.location.protocol + "//" + window.location.host;
    if(proxyIFrameUrl !== null) {
      this.proxyIFrameName = this.targetWindowName + "ProxyIFrame";
      this.proxyIFrameLocation = proxyIFrameUrl;
      this.proxyIFrameElement = this.createIFrameProxy()
    }else {
      this.proxyIFrameElement = null
    }
  };
  Porthole.WindowProxyLegacy.prototype = {getTargetWindowName:function() {
    return this.targetWindowName
  }, getOrigin:function() {
    return this.origin
  }, createIFrameProxy:function() {
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", this.proxyIFrameName);
    iframe.setAttribute("name", this.proxyIFrameName);
    iframe.setAttribute("src", this.proxyIFrameLocation);
    iframe.setAttribute("frameBorder", "1");
    iframe.setAttribute("scrolling", "auto");
    iframe.setAttribute("width", 30);
    iframe.setAttribute("height", 30);
    iframe.setAttribute("style", "position: absolute; left: -100px; top:0px;");
    if(iframe.style.setAttribute) {
      iframe.style.setAttribute("cssText", "position: absolute; left: -100px; top:0px;")
    }
    document.body.appendChild(iframe);
    return iframe
  }, postMessage:function(data, targetOrigin) {
    if(targetOrigin === undefined) {
      targetOrigin = "*"
    }
    if(this.proxyIFrameElement === null) {
      Porthole.error("Can't send message because no proxy url was passed in the constructor")
    }else {
      sourceWindowName = window.name;
      this.proxyIFrameElement.setAttribute("src", this.proxyIFrameLocation + "#" + data + "&sourceOrigin=" + escape(this.getOrigin()) + "&targetOrigin=" + escape(targetOrigin) + "&sourceWindowName=" + sourceWindowName + "&targetWindowName=" + this.targetWindowName);
      this.proxyIFrameElement.height = this.proxyIFrameElement.height > 50 ? 50 : 100
    }
  }, addEventListener:function(f) {
    this.eventListeners.push(f);
    return f
  }, removeEventListener:function(f) {
    try {
      var index = this.eventListeners.indexOf(f);
      this.eventListeners.splice(index, 1)
    }catch(e) {
      this.eventListeners = [];
      Porthole.error(e)
    }
  }, dispatchEvent:function(e) {
    for(var i = 0;i < this.eventListeners.length;i++) {
      try {
        this.eventListeners[i](e)
      }catch(ex) {
        Porthole.error("Exception trying to call back listener: " + ex)
      }
    }
  }};
  Porthole.WindowProxyHTML5 = function(proxyIFrameUrl, targetWindowName) {
    if(targetWindowName === undefined) {
      targetWindowName = ""
    }
    this.targetWindowName = targetWindowName
  };
  Porthole.WindowProxyHTML5.prototype = {postMessage:function(data, targetOrigin) {
    if(targetOrigin === undefined) {
      targetOrigin = "*"
    }
    if(this.targetWindowName === "") {
      targetWindow = top
    }else {
      targetWindow = parent.frames[this.targetWindowName]
    }
    targetWindow.postMessage(data, targetOrigin)
  }, addEventListener:function(f) {
    window.addEventListener("message", f, false);
    return f
  }, removeEventListener:function(f) {
    window.removeEventListener("message", f, false)
  }, dispatchEvent:function(e) {
    var evt = document.createEvent("MessageEvent");
    evt.initMessageEvent("message", true, true, e.data, e.origin, 1, window, null);
    window.dispatchEvent(evt)
  }};
  if(typeof window.postMessage != "function") {
    Porthole.trace("Using legacy browser support");
    Porthole.WindowProxy = Porthole.WindowProxyLegacy;
    Porthole.WindowProxy.prototype = Porthole.WindowProxyLegacy.prototype
  }else {
    Porthole.trace("Using built-in browser support");
    Porthole.WindowProxy = Porthole.WindowProxyHTML5;
    Porthole.WindowProxy.prototype = Porthole.WindowProxyHTML5.prototype
  }
  Porthole.WindowProxy.splitMessageParameters = function(message) {
    if(typeof message == "undefined" || message === null) {
      return null
    }
    var hash = [];
    var pairs = message.split(/&/);
    for(var keyValuePairIndex in pairs) {
      var nameValue = pairs[keyValuePairIndex].split("=");
      if(typeof nameValue[1] == "undefined") {
        hash[nameValue[0]] = ""
      }else {
        hash[nameValue[0]] = nameValue[1]
      }
    }
    return hash
  };
  Porthole.MessageEvent = function MessageEvent(data, origin, source) {
    this.data = data;
    this.origin = origin;
    this.source = source
  };
  Porthole.WindowProxyDispatcher = {forwardMessageEvent:function(e) {
    var message = document.location.hash;
    if(message.length > 0) {
      message = message.substr(1);
      m = Porthole.WindowProxyDispatcher.parseMessage(message);
      if(m.targetWindowName === "") {
        targetWindow = top
      }else {
        targetWindow = parent.frames[m.targetWindowName]
      }
      var windowProxy = Porthole.WindowProxyDispatcher.findWindowProxyObjectInWindow(targetWindow, m.sourceWindowName);
      if(windowProxy) {
        if(windowProxy.origin == m.targetOrigin || m.targetOrigin == "*") {
          e = new Porthole.MessageEvent(m.data, m.sourceOrigin, windowProxy);
          windowProxy.dispatchEvent(e)
        }else {
          Porthole.error("Target origin " + windowProxy.origin + " does not match desired target of " + m.targetOrigin)
        }
      }else {
        Porthole.error("Could not find window proxy object on the target window")
      }
    }
  }, parseMessage:function(message) {
    if(typeof message == "undefined" || message === null) {
      return null
    }
    params = Porthole.WindowProxy.splitMessageParameters(message);
    var h = {targetOrigin:"", sourceOrigin:"", sourceWindowName:"", data:""};
    h.targetOrigin = unescape(params.targetOrigin);
    h.sourceOrigin = unescape(params.sourceOrigin);
    h.sourceWindowName = unescape(params.sourceWindowName);
    h.targetWindowName = unescape(params.targetWindowName);
    var d = message.split(/&/);
    if(d.length > 3) {
      d.pop();
      d.pop();
      d.pop();
      d.pop();
      h.data = d.join("&")
    }
    return h
  }, findWindowProxyObjectInWindow:function(w, sourceWindowName) {
    if(w.RuntimeObject) {
      w = w.RuntimeObject()
    }
    if(w) {
      for(var i in w) {
        try {
          if(w[i] !== null && typeof w[i] == "object" && w[i] instanceof w.Porthole.WindowProxy && w[i].getTargetWindowName() == sourceWindowName) {
            return w[i]
          }
        }catch(e) {
        }
      }
    }
    return null
  }, start:function() {
    if(window.addEventListener) {
      window.addEventListener("resize", Porthole.WindowProxyDispatcher.forwardMessageEvent, false)
    }else {
      if(document.body.attachEvent) {
        window.attachEvent("onresize", Porthole.WindowProxyDispatcher.forwardMessageEvent)
      }else {
        Porthole.error("Can't attach resize event")
      }
    }
  }}
})();
var lscache = function() {
  var CACHE_PREFIX = "lscache-";
  var CACHE_SUFFIX = "-cacheexpiration";
  var EXPIRY_RADIX = 10;
  var EXPIRY_UNITS = 60 * 1E3;
  var MAX_DATE = Math.floor(864E13 / EXPIRY_UNITS);
  var cachedStorage;
  var cachedJSON;
  var cacheBucket = "";
  function supportsStorage() {
    var key = "__lscachetest__";
    var value = key;
    if(cachedStorage !== undefined) {
      return cachedStorage
    }
    try {
      setItem(key, value);
      removeItem(key);
      cachedStorage = true
    }catch(exc) {
      cachedStorage = false
    }
    return cachedStorage
  }
  function supportsJSON() {
    if(cachedJSON === undefined) {
      cachedJSON = window.JSON != null
    }
    return cachedJSON
  }
  function expirationKey(key) {
    return key + CACHE_SUFFIX
  }
  function currentTime() {
    return Math.floor((new Date).getTime() / EXPIRY_UNITS)
  }
  function getItem(key) {
    return localStorage.getItem(CACHE_PREFIX + cacheBucket + key)
  }
  function setItem(key, value) {
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
    localStorage.setItem(CACHE_PREFIX + cacheBucket + key, value)
  }
  function removeItem(key) {
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key)
  }
  return{set:function(key, value, time) {
    if(!supportsStorage()) {
      return
    }
    if(typeof value !== "string") {
      if(!supportsJSON()) {
        return
      }
      try {
        value = JSON.stringify(value)
      }catch(e) {
        return
      }
    }
    try {
      setItem(key, value)
    }catch(e) {
      if(e.name === "QUOTA_EXCEEDED_ERR" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
        var storedKeys = [];
        var storedKey;
        for(var i = 0;i < localStorage.length;i++) {
          storedKey = localStorage.key(i);
          if(storedKey.indexOf(CACHE_PREFIX + cacheBucket) === 0 && storedKey.indexOf(CACHE_SUFFIX) < 0) {
            var mainKey = storedKey.substr((CACHE_PREFIX + cacheBucket).length);
            var exprKey = expirationKey(mainKey);
            var expiration = getItem(exprKey);
            if(expiration) {
              expiration = parseInt(expiration, EXPIRY_RADIX)
            }else {
              expiration = MAX_DATE
            }
            storedKeys.push({key:mainKey, size:(getItem(mainKey) || "").length, expiration:expiration})
          }
        }
        storedKeys.sort(function(a, b) {
          return b.expiration - a.expiration
        });
        var targetSize = (value || "").length;
        while(storedKeys.length && targetSize > 0) {
          storedKey = storedKeys.pop();
          removeItem(storedKey.key);
          removeItem(expirationKey(storedKey.key));
          targetSize -= storedKey.size
        }
        try {
          setItem(key, value)
        }catch(e) {
          return
        }
      }else {
        return
      }
    }
    if(time) {
      setItem(expirationKey(key), (currentTime() + time).toString(EXPIRY_RADIX))
    }else {
      removeItem(expirationKey(key))
    }
  }, get:function(key) {
    if(!supportsStorage()) {
      return null
    }
    var exprKey = expirationKey(key);
    var expr = getItem(exprKey);
    if(expr) {
      var expirationTime = parseInt(expr, EXPIRY_RADIX);
      if(currentTime() >= expirationTime) {
        removeItem(key);
        removeItem(exprKey);
        return null
      }
    }
    var value = getItem(key);
    if(!value || !supportsJSON()) {
      return value
    }
    try {
      return JSON.parse(value)
    }catch(e) {
      return value
    }
  }, remove:function(key) {
    if(!supportsStorage()) {
      return null
    }
    removeItem(key);
    removeItem(expirationKey(key))
  }, supported:function() {
    return supportsStorage()
  }, flush:function() {
    if(!supportsStorage()) {
      return
    }
    for(var i = localStorage.length - 1;i >= 0;--i) {
      var key = localStorage.key(i);
      if(key.indexOf(CACHE_PREFIX + cacheBucket) === 0) {
        localStorage.removeItem(key)
      }
    }
  }, setBucket:function(bucket) {
    cacheBucket = bucket
  }, resetBucket:function() {
    cacheBucket = ""
  }}
}();
var absolutePathRegex, analyzeFile, anonDefineStack, applyRules, basedir, clearFileRegistry, commentRegex, commonJSFooter, commonJSHeader, context, createEvalScript, createIframe, createModule, db, define, defineStaticRequireRegex, dispatchTreeDownload, docHead, downloadTree, evalModule, executeFile, extractRequires, fileStorageToken, fileSuffix, funcCount, functionNewlineRegex, functionRegex, functionSpaceRegex, getFormattedPointcuts, getFunctionArgs, getXHR, hostPrefixRegex, hostSuffixRegex, iframeName, 
initializeExports, isIE, loadModules, lscacheSchemaVersion, namespace, oldError, onErrorOffset, pauseRequired, processCallbacks, relativePathRegex, require, requireGreedyCapture, requireRegex, reset, responseSlicer, schemaVersion, schemaVersionString, sendToIframe, sendToXhr, standardizeModuleId, stripBuiltIns, testScript, testScriptNode, treeNode, undef, userConfig, userModules, xDomainRpc, _db;
var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) {
  for(var i = 0, l = this.length;i < l;i++) {
    if(this[i] === item) {
      return i
    }
  }
  return-1
};
isIE = eval("/*@cc_on!@*/false");
docHead = null;
onErrorOffset = 0;
funcCount = 0;
userConfig = {};
undef = undef;
context = this;
pauseRequired = false;
_db = {};
xDomainRpc = null;
fileStorageToken = "INJECT";
schemaVersion = 1;
schemaVersionString = "!version";
namespace = "Inject";
userModules = {};
fileSuffix = /.*?\.(js|txt)(\?.*)?$/;
hostPrefixRegex = /^https?:\/\//;
hostSuffixRegex = /^(.*?)(\/.*|$)/;
iframeName = "injectProxy";
responseSlicer = /^(.+?)[\s]+([\w\W]+?)[\s]+([\w\W]+)$/m;
functionRegex = /^[\s\(]*function[^(]*\(([^)]*)\)/;
functionNewlineRegex = /\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g;
functionSpaceRegex = /\s+/g;
requireRegex = /(?:^|[^\w\$_.\(])require\s*\(\s*("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g;
defineStaticRequireRegex = /^[\r\n\s]*define\(\s*("\S+",|'\S+',|\s*)\s*\[([^\]]*)\],\s*(function\s*\(|{).+/;
requireGreedyCapture = /require.*/;
commentRegex = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
relativePathRegex = /^(\.{1,2}\/).+/;
absolutePathRegex = /^([A-Za-z]+:)?\/\//;
lscache.setBucket(fileStorageToken);
lscacheSchemaVersion = lscache.get(schemaVersionString);
if(lscacheSchemaVersion && lscacheSchemaVersion > 0 && lscacheSchemaVersion < schemaVersion) {
  lscache.flush();
  lscacheSchemaVersion = 0
}
if(!lscacheSchemaVersion) {
  lscache.set(schemaVersionString, schemaVersion)
}
commonJSHeader = '__INJECT_NS__.execute.__FUNCTION_ID__ = function() {\n  with (window) {\n    var __module = __INJECT_NS__.createModule("__MODULE_ID__", "__MODULE_URI__"),\n        __require = __INJECT_NS__.require,\n        __exe = null;\n    __INJECT_NS__.setModuleExports("__MODULE_ID__", __module.exports);\n    __exe = function(require, module, exports) {\n      __POINTCUT_BEFORE__';
commonJSFooter = "    __POINTCUT_AFTER__\n  };\n  __INJECT_NS__.defineAs(__module.id);\n  try {\n    __exe.call(__module, __require, __module, __module.exports);\n  }\n  catch (__EXCEPTION__) {\n    __module.error = __EXCEPTION__;\n  }\n  __INJECT_NS__.undefineAs();\n  return __module;\n}\n};";
createEvalScript = function(code) {
  var scr;
  if(!docHead) {
    docHead = document.getElementsByTagName("head")[0]
  }
  scr = document.createElement("script");
  try {
    scr.text = code
  }catch(innerTextException) {
    try {
      scr.innerHTML = code
    }catch(innerHTMLException) {
      return false
    }
  }
  return scr
};
testScript = 'function Inject_Test_Known_Error() {\n  function nil() {}\n  nil("Known Syntax Error Line 3";\n}';
testScriptNode = createEvalScript(testScript);
oldError = context.onerror;
context.onerror = function(err, where, line) {
  onErrorOffset = 3 - line;
  window.setTimeout(function() {
    return docHead.removeChild(testScriptNode)
  });
  return true
};
docHead.appendChild(testScriptNode);
context.onerror = oldError;
db = {"module":{"create":function(moduleId) {
  var registry;
  registry = _db.moduleRegistry;
  if(!registry[moduleId]) {
    return registry[moduleId] = {"failed":false, "exports":null, "path":null, "file":null, "amd":false, "loading":false, "executed":false, "rulesApplied":false, "requires":[], "exec":null, "pointcuts":{"before":[], "after":[]}}
  }
}, "getExports":function(moduleId) {
  var registry, _ref, _ref2;
  registry = _db.moduleRegistry;
  if(db.module.getFailed(moduleId)) {
    return false
  }
  if((_ref = registry[moduleId]) != null ? _ref.exports : void 0) {
    return registry[moduleId].exports
  }
  if((_ref2 = registry[moduleId]) != null ? _ref2.exec : void 0) {
    registry[moduleId].exec();
    registry[moduleId].exec = null;
    return registry[moduleId].exports
  }
  return false
}, "setExports":function(moduleId, exports) {
  var registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  return registry[moduleId].exports = exports
}, "getPointcuts":function(moduleId) {
  var registry, _ref;
  registry = _db.moduleRegistry;
  if((_ref = registry[moduleId]) != null ? _ref.pointcuts : void 0) {
    return registry[moduleId].pointcuts
  }
}, "setPointcuts":function(moduleId, pointcuts) {
  var registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  return registry[moduleId].pointcuts = pointcuts
}, "getRequires":function(moduleId) {
  var registry, _ref;
  registry = _db.moduleRegistry;
  if((_ref = registry[moduleId]) != null ? _ref.requires : void 0) {
    return registry[moduleId].requires
  }
}, "setRequires":function(moduleId, requires) {
  var registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  return registry[moduleId].requires = requires
}, "getRulesApplied":function(moduleId) {
  var registry, _ref;
  registry = _db.moduleRegistry;
  if((_ref = registry[moduleId]) != null ? _ref.rulesApplied : void 0) {
    return registry[moduleId].rulesApplied
  }else {
    return false
  }
}, "setRulesApplied":function(moduleId, rulesApplied) {
  var registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  return registry[moduleId].rulesApplied = rulesApplied
}, "getPath":function(moduleId) {
  var registry, _ref;
  registry = _db.moduleRegistry;
  if((_ref = registry[moduleId]) != null ? _ref.path : void 0) {
    return registry[moduleId].path
  }else {
    return false
  }
}, "setPath":function(moduleId, path) {
  var registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  return registry[moduleId].path = path
}, "getFile":function(moduleId) {
  var file, path, registry, _ref;
  registry = _db.moduleRegistry;
  path = db.module.getPath(moduleId);
  if((_ref = registry[moduleId]) != null ? _ref.file : void 0) {
    return registry[moduleId].file
  }
  if(userConfig.fileExpires === 0) {
    return false
  }
  file = lscache.get(path);
  if(file && typeof file === "string" && file.length) {
    db.module.setFile(moduleId, file);
    return file
  }
  return false
}, "setFile":function(moduleId, file) {
  var path, registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  registry[moduleId].file = file;
  path = db.module.getPath(moduleId);
  return lscache.set(path, file, userConfig.fileExpires)
}, "clearAllFiles":function() {
  var data, moduleId, registry, _results;
  registry = _db.moduleRegistry;
  _results = [];
  for(moduleId in registry) {
    if(!__hasProp.call(registry, moduleId)) {
      continue
    }
    data = registry[moduleId];
    data.file = null;
    _results.push(data.loading = false)
  }
  return _results
}, "getFailed":function(moduleId) {
  var registry, _ref;
  registry = _db.moduleRegistry;
  if((_ref = registry[moduleId]) != null ? _ref.failed : void 0) {
    return registry[moduleId].failed
  }else {
    return false
  }
}, "setFailed":function(moduleId, failed) {
  var registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  return registry[moduleId].failed = failed
}, "getCircular":function(moduleId) {
  var registry, _ref;
  registry = _db.moduleRegistry;
  if((_ref = registry[moduleId]) != null ? _ref.circular : void 0) {
    return registry[moduleId].circular
  }else {
    return false
  }
}, "setCircular":function(moduleId, circular) {
  var registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  return registry[moduleId].circular = circular
}, "getAmd":function(moduleId) {
  var registry, _ref;
  registry = _db.moduleRegistry;
  if((_ref = registry[moduleId]) != null ? _ref.amd : void 0) {
    return registry[moduleId].amd
  }else {
    return false
  }
}, "setAmd":function(moduleId, isAmd) {
  var registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  return registry[moduleId].amd = isAmd
}, "getLoading":function(moduleId) {
  var registry, _ref;
  registry = _db.moduleRegistry;
  if((_ref = registry[moduleId]) != null ? _ref.loading : void 0) {
    return registry[moduleId].loading
  }else {
    return false
  }
}, "setLoading":function(moduleId, loading) {
  var registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  return registry[moduleId].loading = loading
}, "getExecuted":function(moduleId) {
  var registry, _ref;
  registry = _db.moduleRegistry;
  if((_ref = registry[moduleId]) != null ? _ref.executed : void 0) {
    return registry[moduleId].executed
  }else {
    return false
  }
}, "setExecuted":function(moduleId, executed) {
  var registry;
  registry = _db.moduleRegistry;
  db.module.create(moduleId);
  return registry[moduleId].executed = executed
}}, "txn":{"create":function() {
  var id;
  id = _db.transactionRegistryCounter++;
  _db.transactionRegistry[id] = 0;
  return id
}, "add":function(txnId) {
  return _db.transactionRegistry[txnId]++
}, "subtract":function(txnId) {
  return _db.transactionRegistry[txnId]--
}, "get":function(txnId) {
  return _db.transactionRegistry[txnId]
}, "remove":function(txnId) {
  _db.transactionRegistry[txnId] = null;
  return delete _db.transactionRegistry[txnId]
}}, "queue":{"load":{"add":function(item) {
  return _db.loadQueue.push(item)
}, "get":function() {
  return _db.loadQueue
}, "clear":function() {
  return _db.loadQueue = []
}}, "rules":{"add":function(item) {
  _db.rulesQueue.push(item);
  return _db.rulesQueueDirty = true
}, "get":function() {
  if(_db.rulesQueueDirty) {
    _db.rulesQueueDirty = false;
    _db.rulesQueue.sort(function(a, b) {
      return b.weight - a.weight
    })
  }
  return _db.rulesQueue
}, "size":function() {
  return _db.rulesQueue.length
}}, "file":{"add":function(moduleId, item) {
  if(!_db.fileQueue[moduleId]) {
    !(_db.fileQueue[moduleId] = [])
  }
  return _db.fileQueue[moduleId].push(item)
}, "get":function(moduleId) {
  if(_db.fileQueue[moduleId]) {
    return _db.fileQueue[moduleId]
  }else {
    return[]
  }
}, "clear":function(moduleId) {
  if(_db.fileQueue[moduleId]) {
    return _db.fileQueue[moduleId] = []
  }
}}, "amd":{"add":function(moduleId, item) {
  if(!_db.amdQueue[moduleId]) {
    !(_db.amdQueue[moduleId] = [])
  }
  return _db.amdQueue[moduleId].push(item)
}, "get":function(moduleId) {
  if(_db.amdQueue[moduleId]) {
    return _db.amdQueue[moduleId]
  }else {
    return[]
  }
}, "clear":function(moduleId) {
  if(_db.amdQueue[moduleId]) {
    return _db.amdQueue[moduleId] = []
  }
}}, "define":{"add":function(moduleId) {
  return _db.defineQueue.unshift(moduleId)
}, "remove":function() {
  return _db.defineQueue.shift()
}, "peek":function() {
  return _db.defineQueue[0]
}}}};
treeNode = function() {
  function treeNode(value) {
    this.value = value;
    this.children = [];
    this.parent = null;
    this.left = null;
    this.right = null
  }
  treeNode.prototype.getValue = function() {
    return this.value
  };
  treeNode.prototype.addChild = function(node) {
    var rightChild;
    if(this.children.length > 0) {
      rightChild = this.children[this.children.length - 1];
      node.setLeft(rightChild);
      rightChild.setRight(node)
    }
    this.children.push(node);
    return node.setParent(this)
  };
  treeNode.prototype.getChildren = function() {
    return this.children
  };
  treeNode.prototype.setLeft = function(node) {
    return this.left = node
  };
  treeNode.prototype.getLeft = function() {
    return this.left
  };
  treeNode.prototype.setRight = function(node) {
    return this.right = node
  };
  treeNode.prototype.getRight = function() {
    return this.right
  };
  treeNode.prototype.setParent = function(node) {
    return this.parent = node
  };
  treeNode.prototype.getParent = function() {
    return this.parent
  };
  treeNode.prototype.postOrder = function() {
    var currentNode, direction, output, _results;
    output = [];
    currentNode = this;
    direction = null;
    _results = [];
    while(currentNode) {
      if(currentNode.getChildren().length > 0 && direction !== "up") {
        direction = "down";
        currentNode = currentNode.getChildren()[0];
        continue
      }
      output.push(currentNode.getValue());
      if(currentNode.getRight()) {
        direction = "right";
        currentNode = currentNode.getRight();
        continue
      }
      if(currentNode.getParent()) {
        direction = "up";
        currentNode = currentNode.getParent();
        continue
      }
      return output
    }
    return _results
  };
  return treeNode
}();
reset = function() {
  _db = {"moduleRegistry":{}, "transactionRegistry":{}, "transactionRegistryCounter":0, "loadQueue":[], "rulesQueue":[], "fileQueue":[], "amdQueue":[], "defineQueue":[]};
  return userConfig = {"moduleRoot":null, "fileExpires":1440, "xd":{"inject":null, "xhr":null}, "debug":{"sourceMap":false}}
};
reset();
clearFileRegistry = function() {
  if(!(__indexOf.call(context, "localStorage") >= 0)) {
    return
  }
  db.module.clearAllFiles();
  return lscache.flush()
};
createIframe = function() {
  var iframe, localSrc, src, trimHost, _ref, _ref2;
  src = userConfig != null ? (_ref = userConfig.xd) != null ? _ref.xhr : void 0 : void 0;
  localSrc = userConfig != null ? (_ref2 = userConfig.xd) != null ? _ref2.inject : void 0 : void 0;
  if(!src) {
    throw new Error("Configuration requires xd.remote to be defined");
  }
  if(!localSrc) {
    throw new Error("Configuration requires xd.local to be defined");
  }
  trimHost = function(host) {
    host = host.replace(hostPrefixRegex, "").replace(hostSuffixRegex, "$1");
    return host
  };
  iframe = document.createElement("iframe");
  iframe.name = iframeName;
  iframe.src = src + "#xhr";
  iframe.style.width = iframe.style.height = "1px";
  iframe.style.right = iframe.style.bottom = "0px";
  iframe.style.position = "absolute";
  iframe.id = iframeName;
  document.body.insertBefore(iframe, document.body.firstChild);
  xDomainRpc = new Porthole.WindowProxy(userConfig.xd.xhr + "#xhr", iframeName);
  return xDomainRpc.addEventListener(function(event) {
    var item, pieces, queue, _i, _len;
    if(trimHost(event.origin) !== trimHost(userConfig.xd.xhr)) {
      return
    }
    if(event.data === "READY") {
      xDomainRpc.postMessage("READYREADY");
      pauseRequired = false;
      queue = db.queue.load.get();
      db.queue.load.clear();
      for(_i = 0, _len = queue.length;_i < _len;_i++) {
        item = queue[_i];
        item()
      }
    }else {
      pieces = event.data.match(responseSlicer);
      return processCallbacks(pieces[1], pieces[2], pieces[3])
    }
  })
};
getFormattedPointcuts = function(moduleId) {
  var afterCut, beforeCut, cut, cuts, definition, fn, noop, pointcuts, _i, _j, _len, _len2, _ref, _ref2;
  cuts = db.module.getPointcuts(moduleId);
  beforeCut = [";"];
  afterCut = [";"];
  _ref = cuts.before;
  for(_i = 0, _len = _ref.length;_i < _len;_i++) {
    cut = _ref[_i];
    beforeCut.push(cut.toString().match(/.*?\{([\w\W]*)\}/m)[1])
  }
  _ref2 = cuts.after;
  for(_j = 0, _len2 = _ref2.length;_j < _len2;_j++) {
    cut = _ref2[_j];
    afterCut.push(cut.toString().match(/.*?\{([\w\W]*)\}/m)[1])
  }
  beforeCut.push(";");
  afterCut.push(";");
  return{before:beforeCut.join(";\n"), after:afterCut.join(";\n")};
  noop = function() {
  };
  pointcuts = {"before":noop, "after":noop};
  if(!userModules[module]) {
    return pointcuts
  }
  definition = userModules[module];
  for(cut in pointcuts) {
    fn = pointcuts[cut];
    if(definition[cut]) {
      pointcuts[cut] = definition[cut]
    }
  }
  return pointcuts
};
dispatchTreeDownload = function(id, tree, node, callback) {
  var afterDownload;
  tree.addChild(node);
  db.txn.add(id);
  afterDownload = function() {
    var moduleId;
    db.txn.subtract(id);
    if(db.txn.get(id) === 0) {
      db.txn.remove(id);
      moduleId = node.getValue();
      if(db.module.getAmd(moduleId) && db.module.getLoading(moduleId)) {
        return db.queue.amd.add(moduleId, callback)
      }else {
        return callback()
      }
    }
  };
  if(db.module.getLoading(node.getValue()) === false) {
    return context.setTimeout(function() {
      return downloadTree(node, afterDownload)
    })
  }else {
    return db.queue.file.add(node.getValue(), afterDownload)
  }
};
loadModules = function(modList, callback) {
  var execute, id, moduleId, node, outstandingAMDModules, tree, _i, _len, _results;
  if(modList.length === 0) {
    context.setTimeout(function() {
      return callback.apply(context, [])
    });
    return
  }
  tree = new treeNode(null);
  id = db.txn.create();
  outstandingAMDModules = 0;
  execute = function() {
    var amdComplete, executionOrder, moduleId, _i, _len;
    amdComplete = function() {
      var exports, moduleId, _i, _len;
      exports = [];
      for(_i = 0, _len = modList.length;_i < _len;_i++) {
        moduleId = modList[_i];
        exports.push(db.module.getExports(moduleId))
      }
      return callback.apply(context, exports)
    };
    executionOrder = tree.postOrder();
    for(_i = 0, _len = executionOrder.length;_i < _len;_i++) {
      moduleId = executionOrder[_i];
      if(moduleId === null) {
        continue
      }
      executeFile(moduleId);
      if(db.module.getAmd(moduleId) && db.module.getLoading(moduleId)) {
        outstandingAMDModules++;
        db.queue.amd.add(moduleId, function() {
          if(--outstandingAMDModules === 0) {
            return amdComplete()
          }
        })
      }
    }
    if(outstandingAMDModules === 0) {
      return amdComplete()
    }
  };
  _results = [];
  for(_i = 0, _len = modList.length;_i < _len;_i++) {
    moduleId = modList[_i];
    moduleId = standardizeModuleId(moduleId);
    node = new treeNode(moduleId);
    _results.push(dispatchTreeDownload(id, tree, node, execute))
  }
  return _results
};
downloadTree = function(tree, callback) {
  var download, file, moduleId, onDownloadComplete, relativePath;
  moduleId = tree.getValue();
  if(db.module.getRulesApplied() === false) {
    if(relativePathRegex.test(moduleId)) {
      relativePath = userConfig.moduleRoot;
      if(tree.getParent() && tree.getParent().getValue()) {
        relativePath = db.module.getPath(tree.getParent().getValue())
      }
      applyRules(moduleId, true, relativePath)
    }else {
      applyRules(moduleId, true)
    }
  }
  onDownloadComplete = function(moduleId, file) {
    var id, node, processCallback, req, requires, _i, _len;
    db.module.setFile(moduleId, file);
    if(file) {
      analyzeFile(moduleId, tree);
      requires = db.module.getRequires(moduleId)
    }else {
      requires = []
    }
    processCallback = function(id, cb) {
      if(db.module.getAmd(id) && db.module.getLoading(id)) {
        return db.queue.amd.add(id, function() {
          return context.setTimeout(cb)
        })
      }else {
        return context.setTimeout(cb)
      }
    };
    if(requires.length > 0) {
      id = db.txn.create();
      for(_i = 0, _len = requires.length;_i < _len;_i++) {
        req = requires[_i];
        node = new treeNode(req);
        dispatchTreeDownload(id, tree, node, callback)
      }
      if(db.txn.get(id) === 0) {
        db.txn.remove(id);
        return processCallback(moduleId, callback)
      }
    }else {
      return processCallback(moduleId, callback)
    }
  };
  download = function() {
    db.module.setLoading(moduleId, true);
    if(userConfig.xd.inject && userConfig.xd.xhr) {
      return sendToIframe(moduleId, processCallbacks)
    }else {
      return sendToXhr(moduleId, processCallbacks)
    }
  };
  if(db.module.getExports(moduleId)) {
    return callback()
  }
  db.queue.file.add(moduleId, onDownloadComplete);
  if(db.module.getLoading(moduleId)) {
    return
  }
  file = db.module.getFile(moduleId);
  if(file && file.length > 0) {
    return processCallbacks(200, moduleId, file)
  }else {
    return download()
  }
};
processCallbacks = function(status, moduleId, file) {
  var cb, cbs, _i, _len, _results;
  if(1 * status !== 200) {
    file = false;
    db.module.setFailed(moduleId, true)
  }
  if(db.module.getAmd(moduleId) === false) {
    db.module.setLoading(moduleId, false)
  }
  cbs = db.queue.file.get(moduleId);
  db.queue.file.clear(moduleId);
  _results = [];
  for(_i = 0, _len = cbs.length;_i < _len;_i++) {
    cb = cbs[_i];
    _results.push(cb(moduleId, file))
  }
  return _results
};
extractRequires = function(file) {
  var match, reqs, require, requires, staticReq, staticReqs, uniques, _i, _len;
  requires = [];
  uniques = {};
  require = function(item) {
    if(uniques[item] !== true) {
      requires.push(item)
    }
    return uniques[item] = true
  };
  reqs = [];
  file = file.replace(commentRegex, "");
  while(match = requireRegex.exec(file)) {
    reqs.push(match[0].match(requireGreedyCapture)[0])
  }
  if((reqs != null ? reqs.length : void 0) > 0) {
    try {
      eval(reqs.join(";"))
    }catch(err) {
      if(typeof console !== "undefined" && console !== null) {
        console.log("Invalid require() syntax found in file: " + reqs.join(";"))
      }
      throw err;
    }
  }
  staticReqs = [];
  if(defineStaticRequireRegex.exec(file)) {
    staticReqs = defineStaticRequireRegex.exec(file)[2].replace(/\s|"|'|require|exports|module/g, "").split(",")
  }
  for(_i = 0, _len = staticReqs.length;_i < _len;_i++) {
    staticReq = staticReqs[_i];
    if(uniques[staticReq] !== true && staticReq !== "") {
      requires.push(staticReq)
    }
    uniques[staticReq] = true
  }
  return requires
};
analyzeFile = function(moduleId, tree) {
  var hasCircular, parent, req, reqs, safeRequires, unsafeRequires, _i, _len;
  reqs = extractRequires(db.module.getFile(moduleId));
  unsafeRequires = {};
  safeRequires = [];
  hasCircular = false;
  parent = tree;
  while(parent = parent.getParent()) {
    if(parent.getValue()) {
      unsafeRequires[parent.getValue()] = true
    }
  }
  for(_i = 0, _len = reqs.length;_i < _len;_i++) {
    req = reqs[_i];
    if(unsafeRequires[req] !== true) {
      safeRequires.push(req)
    }else {
      hasCircular = true;
      db.module.setCircular(req, true)
    }
  }
  db.module.setRequires(moduleId, safeRequires);
  return db.module.setCircular(moduleId, hasCircular)
};
applyRules = function(moduleId, save, relativePath) {
  var isMatch, pointcuts, rule, workingPath, _i, _len, _ref, _ref2, _ref3;
  workingPath = moduleId;
  pointcuts = {before:[], after:[]};
  _ref = db.queue.rules.get();
  for(_i = 0, _len = _ref.length;_i < _len;_i++) {
    rule = _ref[_i];
    isMatch = typeof rule.key === "string" ? rule.key.toLowerCase() === workingPath.toLowerCase() : rule.key.test(workingPath);
    if(isMatch === false) {
      continue
    }
    workingPath = typeof rule.path === "string" ? rule.path : rule.path(workingPath);
    if(rule != null ? (_ref2 = rule.pointcuts) != null ? _ref2.before : void 0 : void 0) {
      pointcuts.before.push(rule.pointcuts.before)
    }
    if(rule != null ? (_ref3 = rule.pointcuts) != null ? _ref3.after : void 0 : void 0) {
      pointcuts.after.push(rule.pointcuts.after)
    }
  }
  if(!absolutePathRegex.test(workingPath)) {
    if(workingPath.indexOf("/") !== 0) {
      if(typeof userConfig.moduleRoot === "undefined") {
        throw new Error("Module Root must be defined");
      }else {
        if(typeof userConfig.moduleRoot === "string") {
          workingPath = "" + userConfig.moduleRoot + workingPath
        }else {
          if(typeof userConfig.moduleRoot === "function") {
            workingPath = userConfig.moduleRoot(workingPath)
          }
        }
      }
    }
    if(typeof relativePath === "string") {
      workingPath = basedir(relativePath) + moduleId
    }
  }
  if(!fileSuffix.test(workingPath)) {
    workingPath = "" + workingPath + ".js"
  }
  if(save === true) {
    db.module.setPath(moduleId, workingPath);
    db.module.setPointcuts(moduleId, pointcuts);
    return db.module.setRulesApplied(moduleId, true)
  }else {
    if(save === false) {
      return{path:workingPath, pointcuts:pointcuts}
    }
  }
};
anonDefineStack = [];
executeFile = function(moduleId) {
  var cuts, footer, functionId, header, module, path, requiredModuleId, runCmd, runHeader, text, _i, _len, _ref;
  if(db.module.getExecuted(moduleId)) {
    return
  }
  db.module.setExecuted(moduleId, true);
  anonDefineStack.unshift(moduleId);
  _ref = db.module.getRequires(moduleId);
  for(_i = 0, _len = _ref.length;_i < _len;_i++) {
    requiredModuleId = _ref[_i];
    executeFile(requiredModuleId)
  }
  cuts = getFormattedPointcuts(moduleId);
  path = db.module.getPath(moduleId);
  text = db.module.getFile(moduleId);
  functionId = "exec" + funcCount++;
  header = commonJSHeader.replace(/__MODULE_ID__/g, moduleId).replace(/__MODULE_URI__/g, path).replace(/__FUNCTION_ID__/g, functionId).replace(/__INJECT_NS__/g, namespace).replace(/__POINTCUT_BEFORE__/g, cuts.before);
  footer = commonJSFooter.replace(/__INJECT_NS__/g, namespace).replace(/__POINTCUT_AFTER__/g, cuts.after);
  runHeader = header + "\n";
  runCmd = [runHeader, text, ";", footer].join("\n");
  module = evalModule({moduleId:moduleId, cmd:runCmd, url:path, functionId:functionId, preamble:header, originalCode:text});
  return db.module.setExports(module.id, module.exports)
};
evalModule = function(options) {
  var actualErrorLine, code, errorObject, functionId, getLineNumberFromException, message, module, moduleId, newError, originalCode, preamble, preambleLines, scr, sourceString, toExec, url;
  moduleId = options.moduleId;
  code = options.cmd;
  url = options.url;
  functionId = options.functionId;
  preamble = options.preamble;
  originalCode = options.originalCode;
  oldError = context.onerror;
  errorObject = null;
  preambleLines = preamble.split(/\n/).length + 1;
  newError = function(err, where, line) {
    var actualErrorLine, linesOfCode, message, originalLinesOfCode;
    actualErrorLine = onErrorOffset - preambleLines + line;
    linesOfCode = code.split("\n").length;
    originalLinesOfCode = originalCode.split("\n").length;
    if(line === linesOfCode) {
      actualErrorLine = originalLinesOfCode
    }
    message = "Parse error in " + moduleId + " (" + url + ") on line " + actualErrorLine + ":\n  " + err;
    errorObject = new Error(message);
    return true
  };
  getLineNumberFromException = function(e) {
    var lines, phrases;
    if(typeof e.lineNumber !== "undefined" && e.lineNumber !== null) {
      return e.lineNumber
    }
    if(e.stack) {
      lines = e.stack.split("\n");
      phrases = lines[1].split(":");
      return parseInt(phrases[phrases.length - 2], 10)
    }
    return 0
  };
  context.onerror = newError;
  scr = createEvalScript(code);
  if(scr) {
    docHead.appendChild(scr);
    window.setTimeout(function() {
      return docHead.removeChild(scr)
    })
  }
  if(!errorObject) {
    if(userConfig.debug.sourceMap) {
      sourceString = isIE ? "" : "//@ sourceURL=" + url;
      toExec = ["(", Inject.execute[functionId].toString(), ")()"].join("");
      toExec = [toExec, sourceString].join("\n");
      module = eval(toExec)
    }else {
      module = Inject.execute[functionId]()
    }
    if(module.error) {
      actualErrorLine = onErrorOffset - preambleLines + getLineNumberFromException(module.error);
      message = "Parse error in " + moduleId + " (" + url + ") on line " + actualErrorLine + ":\n  " + module.error.message;
      errorObject = new Error(message)
    }
  }
  context.onerror = oldError;
  if(typeof Inject !== "undefined" && Inject !== null ? Inject.execute[functionId] : void 0) {
    delete Inject.execute[functionId]
  }
  if(errorObject) {
    require.clearCache();
    throw errorObject;
  }
  return module
};
sendToXhr = function(moduleId, callback) {
  var path, xhr;
  path = db.module.getPath(moduleId);
  xhr = getXHR();
  xhr.open("GET", path);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
      return callback.call(context, xhr.status, moduleId, xhr.responseText)
    }
  };
  return xhr.send(null)
};
sendToIframe = function(moduleId, callback) {
  var path;
  path = db.module.getPath(moduleId);
  return xDomainRpc.postMessage("" + moduleId + " " + path)
};
getFunctionArgs = function(fn) {
  var names;
  names = fn.toString().match(functionRegex)[1].replace(functionNewlineRegex, "").replace(functionSpaceRegex, "").split(",");
  if(names.length === 1 && !names[0]) {
    return[]
  }else {
    return names
  }
};
getXHR = function() {
  var xmlhttp;
  xmlhttp = false;
  if(typeof XMLHttpRequest !== "undefined") {
    try {
      xmlhttp = new XMLHttpRequest
    }catch(errorWin) {
      xmlhttp = false
    }
  }
  if(!xmlhttp && typeof window.createRequest !== "undefined") {
    try {
      xmlhttp = new window.createRequest
    }catch(errorCr) {
      xmlhttp = false
    }
  }
  if(!xmlhttp) {
    try {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP")
    }catch(msErrOne) {
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
      }catch(msErrTwo) {
        xmlhttp = false
      }
    }
  }
  if(!xmlhttp) {
    throw new Error("Could not create an xmlHttpRequest Object");
  }
  return xmlhttp
};
initializeExports = function(moduleId) {
  var newExports;
  if(db.module.getExports(moduleId) !== false) {
    return
  }
  newExports = {__inject_circular__:true};
  return db.module.setExports(moduleId, newExports)
};
createModule = function(id, uri, exports) {
  var module;
  module = {};
  module["id"] = id || null;
  module["uri"] = uri || null;
  module["exports"] = exports || db.module.getExports(id) || {};
  module["error"] = null;
  module["setExports"] = function(xobj) {
    var name, _i, _len, _ref;
    _ref = module["exports"];
    for(_i = 0, _len = _ref.length;_i < _len;_i++) {
      name = _ref[_i];
      throw new Error("cannot setExports when exports have already been set");
    }
    module["exports"] = xobj;
    return module["exports"]
  };
  return module
};
basedir = function(path) {
  if(path.lastIndexOf("/") !== -1) {
    path = path.substring(0, path.lastIndexOf("/") + 1)
  }
  return path
};
standardizeModuleId = function(moduleId) {
  var rule, _i, _len, _ref;
  _ref = db.queue.rules.get();
  for(_i = 0, _len = _ref.length;_i < _len;_i++) {
    rule = _ref[_i];
    if(typeof rule.path === "string" && rule.path.replace(/.js$/i, "") === moduleId) {
      moduleId = rule.key
    }
  }
  return moduleId
};
stripBuiltIns = function(modules) {
  var mId, strippedModuleList, _i, _len;
  strippedModuleList = [];
  for(_i = 0, _len = modules.length;_i < _len;_i++) {
    mId = modules[_i];
    if(mId !== "require" && mId !== "exports" && mId !== "module") {
      strippedModuleList.push(mId)
    }
  }
  return strippedModuleList
};
require = function(moduleId, callback) {
  var exports, isCircular, strippedModuleList;
  if(callback == null) {
    callback = function() {
    }
  }
  if(Object.prototype.toString.call(moduleId) === "[object Array]") {
    strippedModuleList = stripBuiltIns(moduleId);
    require.ensure(strippedModuleList, function(require, module, exports) {
      var args, mId, _i, _len;
      args = [];
      for(_i = 0, _len = moduleId.length;_i < _len;_i++) {
        mId = moduleId[_i];
        switch(mId) {
          case "require":
            args.push(require);
            break;
          case "exports":
            args.push(exports);
            break;
          case "module":
            args.push(module);
            break;
          default:
            args.push(require(mId))
        }
      }
      return callback.apply(context, args)
    });
    return
  }
  moduleId = standardizeModuleId(moduleId);
  exports = db.module.getExports(moduleId);
  isCircular = db.module.getCircular(moduleId);
  if(exports === false && isCircular === false) {
    throw new Error("" + moduleId + " not loaded");
  }
  if(isCircular === true) {
    initializeExports(moduleId);
    exports = db.module.getExports(moduleId)
  }
  return exports
};
require.run = function(moduleId) {
  moduleId = standardizeModuleId(moduleId);
  if(db.module.getFile(moduleId) === false) {
    return require.ensure([moduleId], function() {
    })
  }else {
    db.module.setExports(moduleId, null);
    return executeFile(moduleId)
  }
};
require.ensure = function(moduleList, callback) {
  var ensureExecutionCallback, run;
  if(!(moduleList instanceof Array)) {
    throw new Error("moduleList is not an Array");
  }
  moduleList = stripBuiltIns(moduleList);
  if(userConfig.xd.xhr != null && !xDomainRpc && !pauseRequired) {
    createIframe();
    pauseRequired = true
  }
  ensureExecutionCallback = function() {
    var exports, module;
    module = createModule();
    exports = module.exports;
    return callback.call(context, Inject.require, module, exports)
  };
  run = function() {
    return loadModules(moduleList, ensureExecutionCallback)
  };
  if(pauseRequired) {
    return db.queue.load.add(run)
  }else {
    return run()
  }
};
require.setModuleRoot = function(root) {
  if(typeof root === "string" && root.lastIndexOf("/") !== root.length) {
    root = "" + root + "/"
  }
  if(typeof root === "string") {
    if(root.indexOf("/") === 0) {
      root = "" + location.protocol + "//" + location.host + root
    }else {
      if(root.indexOf(".") === 0) {
        root = "" + location.protocol + "//" + location.host + "/" + root
      }
    }
  }
  return userConfig.moduleRoot = root
};
require.setExpires = function(expires) {
  return userConfig.fileExpires = expires
};
require.setCrossDomain = function(local, remote) {
  userConfig.xd.inject = local;
  return userConfig.xd.xhr = remote
};
require.clearCache = function() {
  return clearFileRegistry()
};
require.manifest = function(manifest) {
  var item, ruleSet, rules, _results;
  _results = [];
  for(item in manifest) {
    if(!__hasProp.call(manifest, item)) {
      continue
    }
    rules = manifest[item];
    ruleSet = {path:rules.path || rules || null, pointcuts:{before:rules.before || null, after:rules.after || null}};
    _results.push(require.addRule(item, ruleSet))
  }
  return _results
};
require.addRule = function(match, weight, ruleSet) {
  var usePath;
  if(weight == null) {
    weight = null
  }
  if(ruleSet == null) {
    ruleSet = null
  }
  if(ruleSet === null) {
    ruleSet = weight;
    weight = db.queue.rules.size()
  }
  if(typeof ruleSet === "string") {
    usePath = ruleSet;
    ruleSet = {path:usePath}
  }
  return db.queue.rules.add({key:match, weight:weight, pointcuts:ruleSet.pointcuts || null, path:ruleSet.path || null})
};
require.toUrl = function(moduleURL) {
  return applyRules(moduleURL, false).path
};
define = function(moduleId, deps, callback) {
  var afterLoadModules, allDeps, depId, module, outstandingAMDModules, _i, _len;
  if(typeof moduleId !== "string") {
    callback = deps;
    deps = moduleId;
    moduleId = null || db.queue.define.peek()
  }
  module = createModule(moduleId);
  if(Object.prototype.toString.call(deps) !== "[object Array]") {
    callback = deps;
    deps = ["require", "exports", "module"]
  }
  db.module.setAmd(moduleId, true);
  db.module.setLoading(moduleId, true);
  allDeps = db.module.getRequires(moduleId);
  afterLoadModules = function() {
    var amdCallback, amdCallbackQueue, args, dep, exportsSet, item, returnValue, value, _i, _j, _len, _len2, _ref;
    if(typeof callback === "function") {
      args = [];
      for(_i = 0, _len = deps.length;_i < _len;_i++) {
        dep = deps[_i];
        switch(dep) {
          case "require":
            args.push(Inject.require);
            break;
          case "exports":
            args.push(module.exports);
            break;
          case "module":
            args.push(module);
            break;
          default:
            args.push(require(dep))
        }
      }
      returnValue = callback.apply(context, args);
      exportsSet = false;
      if(typeof module.exports === "function") {
        exportsSet = true
      }else {
        _ref = module.exports;
        for(item in _ref) {
          if(!__hasProp.call(_ref, item)) {
            continue
          }
          value = _ref[item];
          exportsSet = true;
          break
        }
      }
      if(exportsSet === false) {
        module.setExports(returnValue)
      }
    }else {
      module.setExports(callback)
    }
    db.module.setExports(moduleId, module.exports);
    db.module.setExecuted(moduleId, true);
    db.module.setLoading(moduleId, false);
    amdCallbackQueue = db.queue.amd.get(moduleId);
    for(_j = 0, _len2 = amdCallbackQueue.length;_j < _len2;_j++) {
      amdCallback = amdCallbackQueue[_j];
      amdCallback()
    }
    return db.queue.amd.clear(moduleId)
  };
  outstandingAMDModules = 0;
  for(_i = 0, _len = allDeps.length;_i < _len;_i++) {
    depId = allDeps[_i];
    if(db.module.getAmd(depId) && db.module.getLoading(depId)) {
      outstandingAMDModules++;
      db.queue.amd.add(depId, function() {
        if(--outstandingAMDModules === 0) {
          return afterLoadModules()
        }
      })
    }
  }
  return loadModules(allDeps, afterLoadModules)
};
define["amd"] = {};
context["require"] = require;
context["define"] = define;
context["Inject"] = {"defineAs":function(moduleId) {
  return db.queue.define.add(moduleId)
}, "undefineAs":function() {
  return db.queue.define.remove()
}, "createModule":createModule, "setModuleExports":function(moduleId, exports) {
  return db.module.setExports(moduleId, exports)
}, "require":require, "define":define, "reset":reset, "execute":{}, "enableDebug":function(key, value) {
  if(value == null) {
    value = true
  }
  return userConfig.debug[key] = value
}};
context["require"]["ensure"] = require.ensure;
context["require"]["setModuleRoot"] = require.setModuleRoot;
context["require"]["setExpires"] = require.setExpires;
context["require"]["setCrossDomain"] = require.setCrossDomain;
context["require"]["clearCache"] = require.clearCache;
context["require"]["manifest"] = require.manifest;
context["require"]["run"] = require.run;
}).call(this)
