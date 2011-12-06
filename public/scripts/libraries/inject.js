/**
 * @license
 * Library: Inject
 * Homepage: https://github.com/jakobo/inject
 * License: Apache 2.0 License
 */


/**
 * @license
 * Inject
 * Copyright (c) 2011 Jakob Heuser <jakob@felocity.com>. All Rights Reserved.
 * Apache Software License 2.0 (see below)
 *
 * lscache library (c) 2011 Pamela Fox
 * Apache Software License 2.0 (see below)
 *
 * Porthole
 * Copyright (c) 2011 Ternary Labs. All Rights Reserved.
 * MIT License (see below)
 *
 * APACHE SOFTWARE LICENSE 2.0
 * ===
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
 *
 * MIT LICENSE
 * ===
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

(function() {
  /*
  # Inject: Dependency Awesomeness #
  
  Some sample ways to use inject...
      var foo = require("moduleName");
      
      // -- or --
      
      require.ensure(["moduleOne", "moduleTwo", "moduleThree"], function(require, exports, module) {
        var foo = require("moduleOne");
      })
      
      // -- or --
      
      require.run("mySampleApplication")
  
  Configuring Inject
    require.setModuleRoot("http://example.com/path/to/js/root")
    require.setCrossDomain("http://local.example.com/path/to/relay.html", "http://remote.example.com/path/to/relay.html")
    require.addRule(moduleName, "http://local.example.com/path/to/module")
  
  For more details, check out the README or github: https://github.com/Jakobo/inject
  */
  /*
  Constants and Registries used
  */
  var Porthole, analyzeFile, applyRules, clearFileRegistry, commonJSFooter, commonJSHeader, context, createIframe, db, define, dispatchTreeDownload, downloadTree, executeFile, fileStorageToken, fileStore, getFormattedPointcuts, getXHR, hostPrefixRegex, hostSuffixRegex, iframeName, jsSuffix, loadModules, lscache, namespace, pauseRequired, processCallbacks, require, requireEnsureRegex, requireRegex, reset, responseSlicer, schemaVersion, sendToIframe, sendToXhr, treeNode, undef, userConfig, userModules, xDomainRpc, _db;
  var __hasProp = Object.prototype.hasOwnProperty;
  userConfig = {};
  undef = undef;
  schemaVersion = 1;
  context = this;
  pauseRequired = false;
  _db = {};
  xDomainRpc = null;
  fileStorageToken = "FILEDB";
  fileStore = "Inject FileStorage";
  namespace = "Inject";
  userModules = {};
  jsSuffix = /.*?\.js$/;
  hostPrefixRegex = /^https?:\/\//;
  hostSuffixRegex = /^(.*?)(\/.*|$)/;
  iframeName = "injectProxy";
  responseSlicer = /^(.+?)[\s]([\w\W]+)$/m;
  requireRegex = null;
  requireEnsureRegex = null;
  
// requireRegexes from Yabble - James Brantly
requireRegex = /(?:^|[^\w\$_.])require\s*\(\s*("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g;
requireEnsureRegex = /(?:^|[^\w\$_.])require.ensure\s*\(\s*(\[("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\s*|,)*\])/g;
;
  /*
  CommonJS wrappers for a header and footer
  these bookend the included code and insulate the scope so that it doesn't impact inject()
  or anything else.
  */
  commonJSHeader = 'with (window) {\n  (function() {\n    var module = {}, exports = {}, require = __INJECT_NS__.require, exe = null;\n    module.id = "__MODULE_ID__";\n    module.uri = "__MODULE_URI__";\n    module.exports = exports;\n    module.setExports = function(xobj) {\n      for (var name in module.exports) {\n        if (module.exports.hasOwnProperty(name)) {\n          throw new Error("module.setExports() failed: Module Exports has already been defined");\n        }\n      }\n      module.exports = xobj;\n      return module.exports;\n    }\n    exe = function(module, exports, require) {\n      __POINTCUT_BEFORE__';
  commonJSFooter = '    __POINTCUT_AFTER__\n  };\n  exe.call(module, module, exports, require);\n  return module.exports;\n})();\n}';
  db = {
    /*
      ## db{} ##
      this is the database for all registries and queues
      to reduce maintenance headaches, all accessing is done through this
      object, and not the _db object
      */
    "module": {
      /*
          ## db.module{} ##
          These functions manipulate the module registry
          */
      "create": function(moduleId) {
        /*
              ## create(moduleId) ##
              create a registry entry for tracking a module
              */
        var registry;
        registry = _db.moduleRegistry;
        if (!registry[moduleId]) {
          return registry[moduleId] = {
            "exports": null,
            "path": null,
            "file": null,
            "amd": false,
            "loading": false,
            "rulesApplied": false,
            "requires": [],
            "staticRequires": [],
            "exec": null,
            "pointcuts": {
              "before": [],
              "after": []
            }
          };
        }
      },
      "getExports": function(moduleId) {
        /*
              ## getExports(moduleId) ##
              get the exports for a given moduleId
              */
        var registry, _ref, _ref2;
        registry = _db.moduleRegistry;
        if ((_ref = registry[moduleId]) != null ? _ref.exports : void 0) {
          return registry[moduleId].exports;
        }
        if ((_ref2 = registry[moduleId]) != null ? _ref2.exec : void 0) {
          registry[moduleId].exec();
          registry[moduleId].exec = null;
          return registry[moduleId].exports;
        }
        return false;
      },
      "setExports": function(moduleId, exports) {
        /*
              ## setExports(moduleId, exports) ##
              set the exports for moduleId
              */
        var registry;
        registry = _db.moduleRegistry;
        db.module.create(moduleId);
        return registry[moduleId].exports = exports;
      },
      "getPointcuts": function(moduleId) {
        /*
              ## getPointcuts(moduleId) ##
              get the pointcuts for a given moduleId
              */
        var registry, _ref;
        registry = _db.moduleRegistry;
        if ((_ref = registry[moduleId]) != null ? _ref.pointcuts : void 0) {
          return registry[moduleId].pointcuts;
        }
      },
      "setPointcuts": function(moduleId, pointcuts) {
        /*
              ## setPointcuts(moduleId, pointcuts) ##
              set the pointcuts for moduleId
              */
        var registry;
        registry = _db.moduleRegistry;
        db.module.create(moduleId);
        return registry[moduleId].pointcuts = pointcuts;
      },
      "getRequires": function(moduleId) {
        /*
              ## getRequires(moduleId) ##
              get the requires for a given moduleId found at runtime
              */
        var registry, _ref;
        registry = _db.moduleRegistry;
        if ((_ref = registry[moduleId]) != null ? _ref.requires : void 0) {
          return registry[moduleId].requires;
        }
      },
      "setRequires": function(moduleId, requires) {
        /*
              ## setRequires(moduleId, requires) ##
              set the runtime dependencies for moduleId
              */
        var registry;
        registry = _db.moduleRegistry;
        db.module.create(moduleId);
        return registry[moduleId].requires = requires;
      },
      "getStaticRequires": function(moduleId) {
        /*
              ## getStaticRequires(moduleId) ##
              get the requires for a given moduleId found at declaration time (static dependencies)
              */
        var registry, _ref;
        registry = _db.moduleRegistry;
        if ((_ref = registry[moduleId]) != null ? _ref.staticRequires : void 0) {
          return registry[moduleId].staticRequires;
        }
      },
      "setStaticRequires": function(moduleId, staticRequires) {
        /*
              ## setStaticRequires(moduleId, staticRequires) ##
              set the staticRequires for moduleId, found at declaration time
              */
        var registry;
        registry = _db.moduleRegistry;
        db.module.create(moduleId);
        return registry[moduleId].staticRequires = staticRequires;
      },
      "getRulesApplied": function(moduleId) {
        /*
              ## getRulesApplied(moduleId) ##
              get the status of the rulesApplied flag. It's set when it has passed through
              the rules queue
              */
        var registry, _ref;
        registry = _db.moduleRegistry;
        if ((_ref = registry[moduleId]) != null ? _ref.rulesApplied : void 0) {
          return registry[moduleId].rulesApplied;
        } else {
          return false;
        }
      },
      "setRulesApplied": function(moduleId, rulesApplied) {
        /*
              ## setRulesApplied(moduleId, rulesApplied) ##
              set the rules applied flag for moduleId once all rules have been applied
              */
        var registry;
        registry = _db.moduleRegistry;
        db.module.create(moduleId);
        return registry[moduleId].rulesApplied = rulesApplied;
      },
      "getPath": function(moduleId) {
        /*
              ## getPath(moduleId) ##
              get the resolved path for a given moduleId
              */
        var registry, _ref;
        registry = _db.moduleRegistry;
        if ((_ref = registry[moduleId]) != null ? _ref.path : void 0) {
          return registry[moduleId].path;
        } else {
          return false;
        }
      },
      "setPath": function(moduleId, path) {
        /*
              ## setPath(moduleId, path) ##
              set the path for moduleId
              */
        var registry;
        registry = _db.moduleRegistry;
        db.module.create(moduleId);
        return registry[moduleId].path = path;
      },
      "getFile": function(moduleId) {
        /*
              ## getFile(moduleId) ##
              get the file for a given moduleId. If it doesn't exist in the registry,
              look for the object in localStorage. Return false if no matches are found
              */
        var file, path, registry, token, _ref;
        registry = _db.moduleRegistry;
        path = db.module.getPath(moduleId);
        token = "" + fileStorageToken + schemaVersion + path;
        if ((_ref = registry[moduleId]) != null ? _ref.file : void 0) {
          return registry[moduleId].file;
        }
        if (userConfig.fileExpires === 0) {
          return false;
        }
        file = lscache.get(token);
        if (file && typeof file === "string" && file.length) {
          db.module.setFile(moduleId, file);
          return file;
        }
        return false;
      },
      "setFile": function(moduleId, file) {
        /*
              ## setFile(moduleId, file) ##
              set the file contents for moduleId, and update localStorage
              */
        var path, registry, token;
        registry = _db.moduleRegistry;
        db.module.create(moduleId);
        registry[moduleId].file = file;
        path = db.module.getPath(moduleId);
        token = "" + fileStorageToken + schemaVersion + path;
        return lscache.set(token, file, userConfig.fileExpires);
      },
      "clearAllFiles": function() {
        /*
              ## clearAllFiles() ##
              remove all files from the registry. It sets them all back to an unloaded state
              */
        var data, moduleId, registry, _results;
        registry = _db.moduleRegistry;
        _results = [];
        for (moduleId in registry) {
          if (!__hasProp.call(registry, moduleId)) continue;
          data = registry[moduleId];
          data.file = null;
          _results.push(data.loading = false);
        }
        return _results;
      },
      "getAmd": function(moduleId) {
        /*
              ## getAmd(moduleId) ##
              get the status of the amd flag. It's set when a module is defined use AMD
              */
        var registry, _ref;
        registry = _db.moduleRegistry;
        if ((_ref = registry[moduleId]) != null ? _ref.amd : void 0) {
          return registry[moduleId].amd;
        } else {
          return false;
        }
      },
      "setAmd": function(moduleId, isAmd) {
        /*
              ## setAmd(moduleId, isAmd) ##
              set the amd flag for moduleId, It's set when a module is defined use AMD
              */
        var registry;
        registry = _db.moduleRegistry;
        db.module.create(moduleId);
        return registry[moduleId].amd = isAmd;
      },
      "getLoading": function(moduleId) {
        /*
              ## getLoading(moduleId) ##
              get the status of the loading flag. It's set when an item begins download,
              and cleared when the download completes and the file is saved
              */
        var registry, _ref;
        registry = _db.moduleRegistry;
        if ((_ref = registry[moduleId]) != null ? _ref.loading : void 0) {
          return registry[moduleId].loading;
        } else {
          return false;
        }
      },
      "setLoading": function(moduleId, loading) {
        /*
              ## setLoading(moduleId, loading) ##
              set the loading flag for moduleId, It's set when an item begins download
              */
        var registry;
        registry = _db.moduleRegistry;
        db.module.create(moduleId);
        return registry[moduleId].loading = loading;
      }
    },
    "txn": {
      /*
          ## db.txn{} ##
          These methods manipulate the transaction registry
          */
      "create": function() {
        /*
              ## create() ##
              Create a transaction so we can count outstanding requests
              */
        var id;
        id = _db.transactionRegistryCounter++;
        _db.transactionRegistry[id] = 0;
        return id;
      },
      "add": function(txnId) {
        /*
              ## add(txnId) ##
              increment the counter for a given transaction id
              */        return _db.transactionRegistry[txnId]++;
      },
      "subtract": function(txnId) {
        /*
              ## subtract(txnId) ##
              decrement the counter for a given transaction id
              */        return _db.transactionRegistry[txnId]--;
      },
      "get": function(txnId) {
        /*
              ## get(txnId) ##
              Get the number of outstanding transactions for a given transaction id
              */        return _db.transactionRegistry[txnId];
      },
      "remove": function(txnId) {
        /*
              ## remove(txnId) ##
              Remove a transaction entry from the registry
              */        _db.transactionRegistry[txnId] = null;
        return delete _db.transactionRegistry[txnId];
      }
    },
    "queue": {
      "load": {
        /*
              ## db.queue.load{} ##
              these methods affect the load queue, tracking callback requests
              when loading is blocked for a cross domain iframe
              */
        "add": function(item) {
          return _db.loadQueue.push(item);
        },
        "get": function() {
          return _db.loadQueue;
        },
        "clear": function() {
          return _db.loadQueue = [];
        }
      },
      "rules": {
        /*
              ## db.queue.rules{} ##
              these methods affect the rules queue, tracking rules placed into
              the system via addRule(). Any time the rules are dirty, we sort them
              on get()
              */
        "add": function(item) {
          _db.rulesQueue.push(item);
          return _db.rulesQueueDirty = true;
        },
        "get": function() {
          if (_db.rulesQueueDirty) {
            _db.rulesQueueDirty = false;
            _db.rulesQueue.sort(function(a, b) {
              return b.weight - a.weight;
            });
          }
          return _db.rulesQueue;
        },
        "size": function() {
          return _db.rulesQueue.length;
        }
      },
      "file": {
        /*
              ## db.queue.file{} ##
              these methods affect the file queue, used for tracking pending callbacks
              when a file is being downloaded. It supports a clear() method to remove
              all pending callbacks after the queue has been ran.
              */
        "add": function(moduleId, item) {
          if (!_db.fileQueue[moduleId]) {
            !(_db.fileQueue[moduleId] = []);
          }
          return _db.fileQueue[moduleId].push(item);
        },
        "get": function(moduleId) {
          if (_db.fileQueue[moduleId]) {
            return _db.fileQueue[moduleId];
          } else {
            return [];
          }
        },
        "clear": function(moduleId) {
          if (_db.fileQueue[moduleId]) {
            return _db.fileQueue[moduleId] = [];
          }
        }
      },
      "amd": {
        /*
              ## db.queue.amd{} ##
              these methods affect the amd queue, used for tracking pending amd callbacks
              when a defined module file is being downloaded. It supports a clear() method to remove
              all pending callbacks after the queue has been ran.
              */
        "add": function(moduleId, item) {
          if (!_db.amdQueue[moduleId]) {
            !(_db.amdQueue[moduleId] = []);
          }
          return _db.amdQueue[moduleId].push(item);
        },
        "get": function(moduleId) {
          if (_db.amdQueue[moduleId]) {
            return _db.amdQueue[moduleId];
          } else {
            return [];
          }
        },
        "clear": function(moduleId) {
          if (_db.amdQueue[moduleId]) {
            return _db.amdQueue[moduleId] = [];
          }
        }
      }
    }
  };
  treeNode = (function() {
    /*
      ## treeNode [class] ##
      _internal_ used for constructing the dependency tree
      once built, we can perform a post-order traversal which identifies
      the order we are supposed to execute our required files
      */    function treeNode(value) {
      /*
          ## constructor(value) ##
          set the value for the node, create null values for parent, left right
          */      this.value = value;
      this.children = [];
      this.parent = null;
      this.left = null;
      this.right = null;
    }
    treeNode.prototype.getValue = function() {
      /*
          ## getValue() ##
          get the value of the node
          */      return this.value;
    };
    treeNode.prototype.addChild = function(node) {
      /*
          ## addChild(node) ##
          add a child node to the existing tree. Creates left, right, and parent relationships
          */
      var rightChild;
      if (this.children.length > 0) {
        rightChild = this.children[this.children.length - 1];
        node.setLeft(rightChild);
        rightChild.setRight(node);
      }
      this.children.push(node);
      return node.setParent(this);
    };
    treeNode.prototype.getChildren = function() {
      /*
          ## getChildren() ##
          get the children for the existing tree
          */      return this.children;
    };
    treeNode.prototype.setLeft = function(node) {
      /*
          ## setLeft(node) ##
          set the sibling to the left of this current node
          */      return this.left = node;
    };
    treeNode.prototype.getLeft = function() {
      /*
          ## getLeft() ##
          get the left / previous sibling
          */      return this.left;
    };
    treeNode.prototype.setRight = function(node) {
      /*
          ## setRight(node) ##
          set the sibling to the right of this current node
          */      return this.right = node;
    };
    treeNode.prototype.getRight = function() {
      /*
          ## getRight() ##
          get the right / next sibling
          */      return this.right;
    };
    treeNode.prototype.setParent = function(node) {
      /*
          ## setParent(node) ##
          set the parent of this node
          */      return this.parent = node;
    };
    treeNode.prototype.getParent = function() {
      /*
          ## getParent() ##
          get the parent of this node
          */      return this.parent;
    };
    treeNode.prototype.postOrder = function() {
      /*
          ## postOrder() ##
          Perform a post-order traversal of the tree, and return an array
          of the values. The order for post-order is left, right, parent
          */
      var currentNode, direction, output, _results;
      output = [];
      currentNode = this;
      direction = null;
      _results = [];
      while (currentNode) {
        if (currentNode.getChildren().length > 0 && direction !== "up") {
          direction = "down";
          currentNode = currentNode.getChildren()[0];
          continue;
        }
        output.push(currentNode.getValue());
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
      return _results;
    };
    return treeNode;
  })();
  reset = function() {
    _db = {
      "moduleRegistry": {},
      "transactionRegistry": {},
      "transactionRegistryCounter": 0,
      "loadQueue": [],
      "rulesQueue": [],
      "fileQueue": [],
      "amdQueue": []
    };
    return userConfig = {
      "moduleRoot": null,
      "fileExpires": 1440,
      "xd": {
        "inject": null,
        "xhr": null
      }
    };
  };
  reset();
  clearFileRegistry = function(version) {
    var key, keys, token, _i, _len;
    if (version == null) {
      version = schemaVersion;
    }
    /*
      ## clearFileRegistry(version = schemaVersion) ##
      _internal_ Clears the internal file registry at `version`
      clearing all local storage keys that relate to the fileStorageToken and version
      */
    token = "" + fileStorageToken + version;
    keys = [];
    
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key.indexOf(token) !== -1) keys.push(key)
  }
  ;
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      localStorage.removeItem(key);
    }
    if (version === schemaVersion) {
      return db.module.clearAllFiles();
    }
  };
  createIframe = function() {
    /*
      ## createIframe() ##
      _internal_ create an iframe to the xhr location
      */
    var iframe, localSrc, src, trimHost, _ref, _ref2;
    src = userConfig != null ? (_ref = userConfig.xd) != null ? _ref.xhr : void 0 : void 0;
    localSrc = userConfig != null ? (_ref2 = userConfig.xd) != null ? _ref2.inject : void 0 : void 0;
    if (!src) {
      throw new Error("Configuration requires xd.remote to be defined");
    }
    if (!localSrc) {
      throw new Error("Configuration requires xd.local to be defined");
    }
    trimHost = function(host) {
      host = host.replace(hostPrefixRegex, "").replace(hostSuffixRegex, "$1");
      return host;
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
      if (trimHost(event.origin) !== trimHost(userConfig.xd.xhr)) {
        return;
      }
      if (event.data === "READY") {
        xDomainRpc.postMessage("READYREADY");
        pauseRequired = false;
        queue = db.queue.load.get();
        db.queue.load.clear();
        for (_i = 0, _len = queue.length; _i < _len; _i++) {
          item = queue[_i];
          item();
        }
      } else {
        pieces = event.data.match(responseSlicer);
        return processCallbacks(pieces[1], pieces[2]);
      }
    });
  };
  getFormattedPointcuts = function(moduleId) {
    /*
      ## getFormattedPointcuts(moduleId) ##
      _internal_ get the [pointcuts](http://en.wikipedia.org/wiki/Pointcut) for a module if
      specified
      */
    var afterCut, beforeCut, cut, cuts, definition, fn, noop, pointcuts, _i, _j, _len, _len2, _ref, _ref2;
    cuts = db.module.getPointcuts(moduleId);
    beforeCut = [";"];
    afterCut = [";"];
    _ref = cuts.before;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cut = _ref[_i];
      beforeCut.push(cut.toString().match(/.*?\{([\w\W]*)\}/m)[1]);
    }
    _ref2 = cuts.after;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      cut = _ref2[_j];
      afterCut.push(cut.toString().match(/.*?\{([\w\W]*)\}/m)[1]);
    }
    beforeCut.push(";");
    afterCut.push(";");
    return {
      before: beforeCut.join(";\n"),
      after: afterCut.join(";\n")
    };
    noop = function() {};
    pointcuts = {
      'before': noop,
      'after': noop
    };
    if (!userModules[module]) {
      return pointcuts;
    }
    definition = userModules[module];
    for (cut in pointcuts) {
      fn = pointcuts[cut];
      if (definition[cut]) {
        pointcuts[cut] = definition[cut];
      }
    }
    return pointcuts;
  };
  dispatchTreeDownload = function(id, tree, node, callback) {
    /*
      ## dispatchTreeDownload(id, tree, node, callback) ##
      _internal_ this is used to decouple the execution of a subtree when in a loop
      It uses setTimeout() to fully decouple the item, and yield to the page which
      may be doing other tasks. When all children have completed, callback() is
      invoked
      */
    var afterDownload;
    tree.addChild(node);
    db.txn.add(id);
    afterDownload = function() {
      var moduleId;
      db.txn.subtract(id);
      if (db.txn.get(id) === 0) {
        db.txn.remove(id);
        moduleId = node.getValue();
        if (db.module.getAmd(moduleId) === true && db.module.getExports(moduleId) === false) {
          return db.queue.amd.add(moduleId, callback);
        } else {
          return callback();
        }
      }
    };
    if (db.module.getLoading(node.getValue()) === false) {
      return context.setTimeout(function() {
        return downloadTree(node, afterDownload);
      });
    } else {
      return db.queue.file.add(node.getValue(), afterDownload);
    }
  };
  loadModules = function(modList, callback) {
    /*
      ## loadModules(modList, callback) ##
      _internal_ load a collection of modules in modList, and once they have all loaded, execute the callback cb
      */
    var execute, id, moduleId, node, tree, _i, _len, _results;
    if (modList.length === 0) {
      context.setTimeout(function() {
        return callback.apply(context, []);
      });
      return;
    }
    tree = new treeNode(null);
    id = db.txn.create();
    execute = function() {
      var executionOrder, exports, moduleId, _i, _j, _len, _len2;
      executionOrder = tree.postOrder();
      for (_i = 0, _len = executionOrder.length; _i < _len; _i++) {
        moduleId = executionOrder[_i];
        if (moduleId === null) {
          continue;
        }
        executeFile(moduleId);
      }
      exports = [];
      for (_j = 0, _len2 = modList.length; _j < _len2; _j++) {
        moduleId = modList[_j];
        exports.push(db.module.getExports(moduleId));
      }
      callback.apply(context, exports);
    };
    _results = [];
    for (_i = 0, _len = modList.length; _i < _len; _i++) {
      moduleId = modList[_i];
      node = new treeNode(moduleId);
      _results.push(dispatchTreeDownload(id, tree, node, execute));
    }
    return _results;
  };
  downloadTree = function(tree, callback) {
    /*
      ## downloadTree(tree, callback) ##
      download the current item and its dependencies, storing the results in a tree
      when all items have finished loading, invoke callback()
      */
    var download, file, moduleId, onDownloadComplete;
    moduleId = tree.getValue();
    if (db.module.getRulesApplied() === false) {
      applyRules(moduleId);
    }
    onDownloadComplete = function(moduleId, file) {
      var id, node, req, requires, _i, _len;
      db.module.setFile(moduleId, file);
      analyzeFile(moduleId);
      requires = db.module.getRequires(moduleId);
      id = db.txn.create();
      for (_i = 0, _len = requires.length; _i < _len; _i++) {
        req = requires[_i];
        node = new treeNode(req);
        dispatchTreeDownload(id, tree, node, callback);
      }
      if (db.txn.get(id) === 0) {
        db.txn.remove(id);
        if (db.module.getAmd(moduleId) === true && db.module.getExports(moduleId) === false) {
          return db.queue.amd.add(moduleId, function() {
            return context.setTimeout(callback);
          });
        } else {
          return context.setTimeout(callback);
        }
      }
    };
    download = function() {
      db.module.setLoading(moduleId, true);
      if (userConfig.xd.inject && userConfig.xd.xhr) {
        return sendToIframe(moduleId, processCallbacks);
      } else {
        return sendToXhr(moduleId, processCallbacks);
      }
    };
    db.queue.file.add(moduleId, onDownloadComplete);
    if (db.module.getLoading(moduleId)) {
      return;
    }
    file = db.module.getFile(moduleId);
    if (file && file.length > 0) {
      return processCallbacks(moduleId, file);
    } else {
      return download();
    }
  };
  processCallbacks = function(moduleId, file) {
    /*
      ## processCallbacks(moduleId, file) ##
      _internal_ given a module ID and file, disable the loading flag for the module
      then locate all callbacks that have been queued- dispatch them
      */
    var cb, cbs, _i, _len, _results;
    db.module.setLoading(moduleId, false);
    cbs = db.queue.file.get(moduleId);
    db.queue.file.clear(moduleId);
    _results = [];
    for (_i = 0, _len = cbs.length; _i < _len; _i++) {
      cb = cbs[_i];
      _results.push(cb(moduleId, file));
    }
    return _results;
  };
  analyzeFile = function(moduleId) {
    /*
      ## analyzeFile(moduleId) ##
      _internal_ scan a module's file for dependencies and record them
      */
    var file, match, reqs, require, requires, staticReq, uniques, _i, _len, _ref;
    requires = [];
    uniques = {};
    require = function(item) {
      if (uniques[item] !== true) {
        requires.push(item);
      }
      return uniques[item] = true;
    };
    require.ensure = function(items) {
      var item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        _results.push(require(item));
      }
      return _results;
    };
    reqs = [];
    file = db.module.getFile(moduleId);
    while ((match = requireRegex.exec(file))) {
      reqs.push(match[0]);
    }
    while ((match = requireEnsureRegex.exec(file))) {
      reqs.push(match[0]);
    }
    if ((reqs != null ? reqs.length : void 0) > 0) {
      eval(reqs.join(";"));
    }
    _ref = db.module.getStaticRequires(moduleId);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      staticReq = _ref[_i];
      if (uniques[staticReq] !== true) {
        requires.push(staticReq);
      }
      uniques[staticReq] = true;
    }
    return db.module.setRequires(moduleId, requires);
  };
  applyRules = function(moduleId) {
    /*
      ## applyRules(moduleId) ##
      _internal_ normalize the path based on the module collection or any functions
      associated with its identifier
      */
    var isMatch, pointcuts, rule, workingPath, _i, _len, _ref, _ref2, _ref3;
    workingPath = moduleId;
    pointcuts = {
      before: [],
      after: []
    };
    _ref = db.queue.rules.get();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rule = _ref[_i];
      isMatch = typeof rule.key === "string" ? rule.key.toLowerCase() === workingPath.toLowerCase() : rule.key.test(workingPath);
      if (isMatch === false) {
        continue;
      }
      workingPath = typeof rule.path === "string" ? rule.path : rule.path(workingPath);
      if (rule != null ? (_ref2 = rule.pointcuts) != null ? _ref2.before : void 0 : void 0) {
        pointcuts.before.push(rule.pointcuts.before);
      }
      if (rule != null ? (_ref3 = rule.pointcuts) != null ? _ref3.after : void 0 : void 0) {
        pointcuts.after.push(rule.pointcuts.after);
      }
    }
    if (workingPath.indexOf("/") !== 0) {
      if (typeof userConfig.moduleRoot === "undefined") {
        throw new Error("Module Root must be defined");
      } else if (typeof userConfig.moduleRoot === "string") {
        workingPath = "" + userConfig.moduleRoot + workingPath;
      } else if (typeof userConfig.moduleRoot === "function") {
        workingPath = userConfig.moduleRoot(workingPath);
      }
    }
    if (!jsSuffix.test(workingPath)) {
      workingPath = "" + workingPath + ".js";
    }
    db.module.setPath(moduleId, workingPath);
    db.module.setPointcuts(moduleId, pointcuts);
    return db.module.setRulesApplied(moduleId, true);
  };
  executeFile = function(moduleId) {
    /*
      ## executeFile(moduleId) ##
      _internal_ attempts to execute a file with a CommonJS scope
      and store the exports
      */
    var cuts, exports, footer, header, path, runCmd, text;
    if (db.module.getExports(moduleId)) {
      return;
    }
    cuts = getFormattedPointcuts(moduleId);
    path = db.module.getPath(moduleId);
    text = db.module.getFile(moduleId);
    header = commonJSHeader.replace(/__MODULE_ID__/g, moduleId).replace(/__MODULE_URI__/g, path).replace(/__INJECT_NS__/g, namespace).replace(/__POINTCUT_BEFORE__/g, cuts.before);
    footer = commonJSFooter.replace(/__POINTCUT_AFTER__/g, cuts.after);
    runCmd = "" + header + "\n" + text + "\n" + footer + "\n//@ sourceURL=" + path;
    try {
      exports = context.eval(runCmd);
    } catch (err) {
      throw err;
    }
    return db.module.setExports(moduleId, exports);
  };
  sendToXhr = function(moduleId, callback) {
    /*
      ## sendToXhr(moduleId, callback) ##
      CLEANUPOK
      _internal_ request a module at path using xmlHttpRequest. On retrieval, fire off cb
      */
    var path, xhr;
    path = db.module.getPath(moduleId);
    xhr = getXHR();
    xhr.open("GET", path);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        return callback.call(context, moduleId, xhr.responseText);
      }
    };
    return xhr.send(null);
  };
  sendToIframe = function(moduleId, callback) {
    /*
      ## sendToIframe(txId, module, path, cb) ##
      CLEANUPOK
      _internal_ request a module at path using Porthole + iframe. On retrieval, the cb will be fired
      */
    var path;
    path = db.module.getPath(moduleId);
    return xDomainRpc.postMessage("" + moduleId + " " + path);
  };
  getXHR = function() {
    /*
      ## getXHR() ##
      CLEANUPOK
      _internal_ get an XMLHttpRequest object
      */
    var xmlhttp;
    xmlhttp = false;
    if (typeof XMLHttpRequest !== "undefined") {
      try {
        xmlhttp = new XMLHttpRequest();
      } catch (errorWin) {
        xmlhttp = false;
      }
    }
    if (!xmlhttp && typeof window.createRequest !== "undefined") {
      try {
        xmlhttp = new window.createRequest();
      } catch (errorCr) {
        xmlhttp = false;
      }
    }
    if (!xmlhttp) {
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (msErrOne) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (msErrTwo) {
          xmlhttp = false;
        }
      }
    }
    if (!xmlhttp) {
      throw new Error("Could not create an xmlHttpRequest Object");
    }
    return xmlhttp;
  };
  /*
  Main Payloads: require, require.ensure, etc
  */
  require = function(moduleId) {
    /*
      ## require(moduleId) ##
      CLEANUPOK
      Return the value of a module. This is a synchronous call, meaning the module needs
      to have already been loaded. If you are unsure about the module's existence, you
      should be using require.ensure() instead. For modules beyond the first tier, their
      shallow dependencies are resolved and block, so there is no need for require.ensure()
      beyond the topmost level.
      */
    var mod;
    mod = db.module.getExports(moduleId);
    if (mod === false) {
      throw new Error("" + moduleId + " not loaded");
    }
    return mod;
  };
  require.ensure = function(moduleList, callback) {
    /*
      ## require.ensure(moduleList, callback) ##
      CLEANUPOK
      Ensure the modules in moduleList (array) are loaded, and then execute callback
      (function). Use this instead of require() when you need to load shallow dependencies
      first.
      */
    var ensureExecutionCallback, run;
    if ((userConfig.xd.xhr != null) && !xDomainRpc && !pauseRequired) {
      createIframe();
      pauseRequired = true;
    }
    ensureExecutionCallback = function() {
      var exports, module;
      module = {};
      exports = {};
      module.exports = exports;
      return callback.call(context, require, module, exports);
    };
    run = function() {
      return loadModules(moduleList, ensureExecutionCallback);
    };
    if (pauseRequired) {
      return db.queue.load.add(run);
    } else {
      return run();
    }
  };
  require.setModuleRoot = function(root) {
    /*
      ## require.setModuleRoot(root) ##
      CLEANUPOK
      set the base path for including your modules. This is used as the default if no
      items in the manifest can be located.
      
      Optionally, you can set root to a function. The return value of that function will
      be used instead. This can allow for very complex module configurations and branching
      with multiple CDNs such as in a complex production environment.
      */    if (typeof root === "string" && root.lastIndexOf("/") !== root.length) {
      root = "" + root + "/";
    }
    return userConfig.moduleRoot = root;
  };
  require.setExpires = function(expires) {
    /*
      ## require.setExpires(expires) ##
      CLEANUPOK
      Set the time in seconds that files will persist in localStorage. Setting to 0 will disable
      localstorage caching.
      */    return userConfig.fileExpires = expires;
  };
  require.setCrossDomain = function(local, remote) {
    /*
      ## require.setCrossDomain(local, remote) ##
      CLEANUPOK
      Set a pair of URLs to relay files. You must have two relay files in your cross domain setup:
      
      * one relay file (local) on the same domain as the page hosting Inject
      * one relay file (remote) on the domain where you are hosting your root from setModuleRoot()
      
      The same require.setCrossDomain statement should be added to BOTH your relay.html files.
      */    userConfig.xd.inject = local;
    return userConfig.xd.xhr = remote;
  };
  require.clearCache = function(version) {
    /*
      ## require.clearCache(version) ##
      CLEANUPOK
      Remove the localStorage class at version. If no version is specified, the entire cache is cleared.
      */    return clearFileRegistry(version);
  };
  require.manifest = function(manifest) {
    /*
      ## require.manifest(manifest) ##
      Provide a custom manifest for Inject. This maps module names to file paths, adds pointcuts, and more.
      The key is always the module name, and then inside of that key can be either
      
      * a String (the path that will be used for resolving that module)
      * an Object containing
      ** path (String or Function) a path to use for the module, behaves like setModuleRoot()
      ** pointcuts (Object) a set of Aspect Oriented functions to run before and after the function.
      
      The pointcuts are a unique solution that allows you to require() things like jQuery. A pointcut could,
      for example add an after() method which sets exports.$ to jQuery.noConflict(). This would restore the
      window to its unpoluted state and make jQuery actionable as a commonJS module without having to alter
      the original library.
      */
    var item, ruleSet, rules, _results;
    _results = [];
    for (item in manifest) {
      if (!__hasProp.call(manifest, item)) continue;
      rules = manifest[item];
      ruleSet = {
        path: rules.path || null,
        pointcuts: {
          before: rules.before || null,
          after: rules.after || null
        }
      };
      _results.push(require.addRule(item, ruleSet));
    }
    return _results;
  };
  require.addRule = function(match, weight, ruleSet) {
    var usePath;
    if (weight == null) {
      weight = null;
    }
    if (ruleSet == null) {
      ruleSet = null;
    }
    /*
      ## require.addRule(match, [weight], ruleset) ##
      Add a rule that matches the given match, and apply ruleset to it
      * match: a regex or string to match against
      * weight: [optional] a numeric weight. Higher numbered weights run later
      * ruleset: a string containing a 1:1 replacement for match, or an object literal that
        contains path or pointcuts information
      */
    if (ruleSet === null) {
      ruleSet = weight;
      weight = db.queue.rules.size();
    }
    if (typeof ruleSet === "string") {
      usePath = ruleSet;
      ruleSet = {
        path: usePath
      };
    }
    return db.queue.rules.add({
      key: match,
      weight: weight,
      pointcuts: ruleSet.pointcuts || null,
      path: ruleSet.path || null
    });
  };
  require.run = function(moduleId) {
    /*
      ## require.run(moduleId) ##
      Try to getFile for moduleId, if the file exists, execute the file, if not, load this file and run it
      */    if (db.module.getFile(moduleId) === false) {
      return require.ensure([moduleId], function() {});
    } else {
      db.module.setExports(moduleId, null);
      return executeFile(moduleId);
    }
  };
  define = function(moduleId, deps, callback) {
    /*
      ## define(moduleId, deps, callback) ##
      Define a module with moduleId, run require.ensure to make sure all dependency modules have been loaded, and then
      apply the callback function with an array of dependency module objects, add the callback return and moduleId into
      moduleRegistry list.
      */
    var dep, strippedDeps, _i, _len;
    if (typeof moduleId !== "string") {
      callback = deps;
      deps = moduleId;
      moduleId = null;
    }
    if (Object.prototype.toString.call(deps) !== "[object Array]") {
      callback = deps;
      deps = [];
    }
    if (moduleId) {
      db.module.setAmd(moduleId, true);
    }
    strippedDeps = [];
    for (_i = 0, _len = deps.length; _i < _len; _i++) {
      dep = deps[_i];
      if (dep !== "exports" && dep !== "require" && dep !== "module") {
        strippedDeps.push(dep);
      }
    }
    db.module.setStaticRequires(moduleId, strippedDeps);
    return require.ensure(strippedDeps, function(require, module, exports) {
      var amdCallback, amdCallbackQueue, args, count, dep, item, returnValue, _j, _k, _l, _len2, _len3, _len4, _ref;
      args = [];
      for (_j = 0, _len2 = deps.length; _j < _len2; _j++) {
        dep = deps[_j];
        switch (dep) {
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
            args.push(require(dep));
        }
      }
      if (typeof callback === 'function') {
        returnValue = callback.apply(context, args);
        count = 0;
        _ref = module['exports'];
        for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
          item = _ref[_k];
          count++;
        }
        if (count === 0 && typeof returnValue !== "undefined") {
          exports = returnValue;
        }
      } else if (typeof callback === 'object') {
        exports = callback;
      }
      if (moduleId) {
        db.module.setExports(moduleId, exports);
        amdCallbackQueue = db.queue.amd.get(moduleId);
        for (_l = 0, _len4 = amdCallbackQueue.length; _l < _len4; _l++) {
          amdCallback = amdCallbackQueue[_l];
          amdCallback();
        }
        return db.queue.amd.clear(moduleId);
      }
    });
  };
  define.amd = {
    jQuery: true
  };
  context['require'] = require;
  context['define'] = define;
  context['Inject'] = {
    'require': require,
    'define': define,
    'reset': reset,
    'debug': function() {
      return typeof console !== "undefined" && console !== null ? console.dir(_db) : void 0;
    }
  };
  context['require']['ensure'] = require.ensure;
  context['require']['setModuleRoot'] = require.setModuleRoot;
  context['require']['setExpires'] = require.setExpires;
  context['require']['setCrossDomain'] = require.setCrossDomain;
  context['require']['clearCache'] = require.clearCache;
  context['require']['manifest'] = require.manifest;
  context['require']['run'] = require.run;
  /*
  Porthole
  */
  Porthole = null;
  
Porthole="undefined"==typeof Porthole||!Porthole?{}:Porthole;Porthole={trace:function(){},error:function(a){try{console.error("Porthole: "+a)}catch(b){}},WindowProxy:function(){}};Porthole.WindowProxy.prototype={postMessage:function(){},addEventListener:function(){},removeEventListener:function(){}};
Porthole.WindowProxyLegacy=function(a,b){void 0===b&&(b="");this.targetWindowName=b;this.eventListeners=[];this.origin=window.location.protocol+"//"+window.location.host;null!==a?(this.proxyIFrameName=this.targetWindowName+"ProxyIFrame",this.proxyIFrameLocation=a,this.proxyIFrameElement=this.createIFrameProxy()):this.proxyIFrameElement=null};
Porthole.WindowProxyLegacy.prototype={getTargetWindowName:function(){return this.targetWindowName},getOrigin:function(){return this.origin},createIFrameProxy:function(){var a=document.createElement("iframe");a.setAttribute("id",this.proxyIFrameName);a.setAttribute("name",this.proxyIFrameName);a.setAttribute("src",this.proxyIFrameLocation);a.setAttribute("frameBorder","1");a.setAttribute("scrolling","auto");a.setAttribute("width",30);a.setAttribute("height",30);a.setAttribute("style","position: absolute; left: -100px; top:0px;");
a.style.setAttribute&&a.style.setAttribute("cssText","position: absolute; left: -100px; top:0px;");document.body.appendChild(a);return a},postMessage:function(a,b){void 0===b&&(b="*");null===this.proxyIFrameElement?Porthole.error("Can't send message because no proxy url was passed in the constructor"):(sourceWindowName=window.name,this.proxyIFrameElement.setAttribute("src",this.proxyIFrameLocation+"#"+a+"&sourceOrigin="+escape(this.getOrigin())+"&targetOrigin="+escape(b)+"&sourceWindowName="+sourceWindowName+
"&targetWindowName="+this.targetWindowName),this.proxyIFrameElement.height=50<this.proxyIFrameElement.height?50:100)},addEventListener:function(a){this.eventListeners.push(a);return a},removeEventListener:function(a){try{this.eventListeners.splice(this.eventListeners.indexOf(a),1)}catch(b){this.eventListeners=[],Porthole.error(b)}},dispatchEvent:function(a){for(var b=0;b<this.eventListeners.length;b++)try{this.eventListeners[b](a)}catch(c){Porthole.error("Exception trying to call back listener: "+
c)}}};Porthole.WindowProxyHTML5=function(a,b){void 0===b&&(b="");this.targetWindowName=b};
Porthole.WindowProxyHTML5.prototype={postMessage:function(a,b){void 0===b&&(b="*");targetWindow=""===this.targetWindowName?top:parent.frames[this.targetWindowName];targetWindow.postMessage(a,b)},addEventListener:function(a){window.addEventListener("message",a,!1);return a},removeEventListener:function(a){window.removeEventListener("message",a,!1)},dispatchEvent:function(a){var b=document.createEvent("MessageEvent");b.initMessageEvent("message",!0,!0,a.data,a.origin,1,window,null);window.dispatchEvent(b)}};
"function"!=typeof window.postMessage?(Porthole.trace("Using legacy browser support"),Porthole.WindowProxy=Porthole.WindowProxyLegacy,Porthole.WindowProxy.prototype=Porthole.WindowProxyLegacy.prototype):(Porthole.trace("Using built-in browser support"),Porthole.WindowProxy=Porthole.WindowProxyHTML5,Porthole.WindowProxy.prototype=Porthole.WindowProxyHTML5.prototype);
Porthole.WindowProxy.splitMessageParameters=function(a){if("undefined"==typeof a||null===a)return null;var b=[],a=a.split(/&/),c;for(c in a){var d=a[c].split("=");b[d[0]]="undefined"==typeof d[1]?"":d[1]}return b};Porthole.MessageEvent=function(a,b,c){this.data=a;this.origin=b;this.source=c};
Porthole.WindowProxyDispatcher={forwardMessageEvent:function(a){a=document.location.hash;if(0<a.length){a=a.substr(1);m=Porthole.WindowProxyDispatcher.parseMessage(a);targetWindow=""===m.targetWindowName?top:parent.frames[m.targetWindowName];var b=Porthole.WindowProxyDispatcher.findWindowProxyObjectInWindow(targetWindow,m.sourceWindowName);b?b.origin==m.targetOrigin||"*"==m.targetOrigin?(a=new Porthole.MessageEvent(m.data,m.sourceOrigin,b),b.dispatchEvent(a)):Porthole.error("Target origin "+b.origin+
" does not match desired target of "+m.targetOrigin):Porthole.error("Could not find window proxy object on the target window")}},parseMessage:function(a){if("undefined"==typeof a||null===a)return null;params=Porthole.WindowProxy.splitMessageParameters(a);var b={targetOrigin:"",sourceOrigin:"",sourceWindowName:"",data:""};b.targetOrigin=unescape(params.targetOrigin);b.sourceOrigin=unescape(params.sourceOrigin);b.sourceWindowName=unescape(params.sourceWindowName);b.targetWindowName=unescape(params.targetWindowName);
a=a.split(/&/);if(3<a.length)a.pop(),a.pop(),a.pop(),a.pop(),b.data=a.join("&");return b},findWindowProxyObjectInWindow:function(a,b){a.RuntimeObject&&(a=a.RuntimeObject());if(a)for(var c in a)try{if(null!==a[c]&&"object"==typeof a[c]&&a[c]instanceof a.Porthole.WindowProxy&&a[c].getTargetWindowName()==b)return a[c]}catch(d){}return null},start:function(){window.addEventListener?window.addEventListener("resize",Porthole.WindowProxyDispatcher.forwardMessageEvent,!1):document.body.attachEvent?window.attachEvent("onresize",
Porthole.WindowProxyDispatcher.forwardMessageEvent):Porthole.error("Can't attach resize event")}};
;
  /*
  lscache library
  */
  lscache = null;
  
var lscache=function(){function g(){return Math.floor((new Date).getTime()/6E4)}function l(a,b,f){function o(){try{localStorage.setItem(a+c,g()),0<f?(localStorage.setItem(a+d,g()+f),localStorage.setItem(a,b)):0>f||0===f?(localStorage.removeItem(a+c),localStorage.removeItem(a+d),localStorage.removeItem(a)):localStorage.setItem(a,b)}catch(h){if("QUOTA_EXCEEDED_ERR"===h.name||"NS_ERROR_DOM_QUOTA_REACHED"==h.name){if(0===i.length&&!m)return localStorage.removeItem(a+c),localStorage.removeItem(a+d),localStorage.removeItem(a),
!1;m&&(m=!1);if(!e){for(var n=0,l=localStorage.length;n<l;n++)if(j=localStorage.key(n),-1<j.indexOf(c)){var p=j.split(c)[0];i.push({key:p,touched:parseInt(localStorage[j],10)})}i.sort(function(a,b){return a.touched-b.touched})}if(k=i.shift())localStorage.removeItem(k.key+c),localStorage.removeItem(k.key+d),localStorage.removeItem(k.key);o()}}}var e=!1,m=!0,i=[],j,k;o()}var d="-EXP",c="-LRU",e;try{e=!!localStorage.getItem}catch(q){e=!1}var h=null!=window.JSON;return{set:function(a,b,c){if(e){if("string"!=
typeof b){if(!h)return;try{b=JSON.stringify(b)}catch(d){return}}l(a,b,c)}},get:function(a){function b(a){if(h)try{return JSON.parse(localStorage.getItem(a))}catch(b){return localStorage.getItem(a)}else return localStorage.getItem(a)}if(!e)return null;if(localStorage.getItem(a+d)){var f=parseInt(localStorage.getItem(a+d),10);if(g()>=f)localStorage.removeItem(a),localStorage.removeItem(a+d),localStorage.removeItem(a+c);else return localStorage.setItem(a+c,g()),b(a)}else if(localStorage.getItem(a))return localStorage.setItem(a+
c,g()),b(a);return null},remove:function(a){if(!e)return null;localStorage.removeItem(a);localStorage.removeItem(a+d);localStorage.removeItem(a+c)}}}();
;
}).call(this);
