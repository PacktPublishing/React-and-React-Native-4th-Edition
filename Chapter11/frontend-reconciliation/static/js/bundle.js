/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "896186a5297738375302"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/ansi-regex/index.js":
/*!*********************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/ansi-regex/index.js ***!
  \*********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),

/***/ "../../node_modules/asap/browser-raw.js":
/*!*********************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/asap/browser-raw.js ***!
  \*********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/chalk/index.js":
/*!****************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/chalk/index.js ***!
  \****************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var escapeStringRegexp = __webpack_require__(/*! escape-string-regexp */ "../../node_modules/escape-string-regexp/index.js");
var ansiStyles = __webpack_require__(/*! ansi-styles */ "../../node_modules/chalk/node_modules/ansi-styles/index.js");
var stripAnsi = __webpack_require__(/*! strip-ansi */ "../../node_modules/strip-ansi/index.js");
var hasAnsi = __webpack_require__(/*! has-ansi */ "../../node_modules/has-ansi/index.js");
var supportsColor = __webpack_require__(/*! supports-color */ "../../node_modules/chalk/node_modules/supports-color/index.js");
var defineProps = Object.defineProperties;
var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(Object({"NODE_ENV":"production","PUBLIC_URL":""}).TERM);

function Chalk(options) {
	// detect mode if not set manually
	this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001b[94m';
}

var styles = (function () {
	var ret = {};

	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

		ret[key] = {
			get: function () {
				return build.call(this, this._styles.concat(key));
			}
		};
	});

	return ret;
})();

var proto = defineProps(function chalk() {}, styles);

function build(_styles) {
	var builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder.enabled = this.enabled;
	// __proto__ is used because we must return a function, but there is
	// no way to create a function with a different prototype.
	/* eslint-disable no-proto */
	builder.__proto__ = proto;

	return builder;
}

function applyStyle() {
	// support varags, but simply cast to string in case there's only one arg
	var args = arguments;
	var argsLen = args.length;
	var str = argsLen !== 0 && String(arguments[0]);

	if (argsLen > 1) {
		// don't slice `arguments`, it prevents v8 optimizations
		for (var a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || !str) {
		return str;
	}

	var nestedStyles = this._styles;
	var i = nestedStyles.length;

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	var originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
		ansiStyles.dim.open = '';
	}

	while (i--) {
		var code = ansiStyles[nestedStyles[i]];

		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;
	}

	// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
	ansiStyles.dim.open = originalDim;

	return str;
}

function init() {
	var ret = {};

	Object.keys(styles).forEach(function (name) {
		ret[name] = {
			get: function () {
				return build.call(this, [name]);
			}
		};
	});

	return ret;
}

defineProps(Chalk.prototype, init());

module.exports = new Chalk();
module.exports.styles = ansiStyles;
module.exports.hasColor = hasAnsi;
module.exports.stripColor = stripAnsi;
module.exports.supportsColor = supportsColor;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../process/browser.js */ "../../node_modules/process/browser.js")))

/***/ }),

/***/ "../../node_modules/chalk/node_modules/ansi-styles/index.js":
/*!*****************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/chalk/node_modules/ansi-styles/index.js ***!
  \*****************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

function assembleStyles () {
	var styles = {
		modifiers: {
			reset: [0, 0],
			bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		colors: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39]
		},
		bgColors: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49]
		}
	};

	// fix humans
	styles.colors.grey = styles.colors.gray;

	Object.keys(styles).forEach(function (groupName) {
		var group = styles[groupName];

		Object.keys(group).forEach(function (styleName) {
			var style = group[styleName];

			styles[styleName] = group[styleName] = {
				open: '\u001b[' + style[0] + 'm',
				close: '\u001b[' + style[1] + 'm'
			};
		});

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	});

	return styles;
}

Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../webpack/buildin/module.js */ "../../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../../node_modules/chalk/node_modules/supports-color/index.js":
/*!********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/chalk/node_modules/supports-color/index.js ***!
  \********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function (flag) {
	flag = '--' + flag;
	var pos = argv.indexOf(flag);
	return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

module.exports = (function () {
	if ('FORCE_COLOR' in Object({"NODE_ENV":"production","PUBLIC_URL":""})) {
		return true;
	}

	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return false;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return true;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in Object({"NODE_ENV":"production","PUBLIC_URL":""})) {
		return true;
	}

	if (Object({"NODE_ENV":"production","PUBLIC_URL":""}).TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(Object({"NODE_ENV":"production","PUBLIC_URL":""}).TERM)) {
		return true;
	}

	return false;
})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../process/browser.js */ "../../node_modules/process/browser.js")))

/***/ }),

/***/ "../../node_modules/escape-string-regexp/index.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/escape-string-regexp/index.js ***!
  \*******************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};


/***/ }),

/***/ "../../node_modules/fbjs/lib/ExecutionEnvironment.js":
/*!**********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/fbjs/lib/ExecutionEnvironment.js ***!
  \**********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;

/***/ }),

/***/ "../../node_modules/fbjs/lib/containsNode.js":
/*!**************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/fbjs/lib/containsNode.js ***!
  \**************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var isTextNode = __webpack_require__(/*! ./isTextNode */ "../../node_modules/fbjs/lib/isTextNode.js");

/*eslint-disable no-bitwise */

/**
 * Checks if a given DOM node contains or is another DOM node.
 */
function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if ('contains' in outerNode) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

module.exports = containsNode;

/***/ }),

/***/ "../../node_modules/fbjs/lib/emptyFunction.js":
/*!***************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/fbjs/lib/emptyFunction.js ***!
  \***************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),

/***/ "../../node_modules/fbjs/lib/emptyObject.js":
/*!*************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/fbjs/lib/emptyObject.js ***!
  \*************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyObject = {};

if (false) {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;

/***/ }),

/***/ "../../node_modules/fbjs/lib/getActiveElement.js":
/*!******************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/fbjs/lib/getActiveElement.js ***!
  \******************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/* eslint-disable fb-www/typeof-undefined */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document or document body is not
 * yet defined.
 *
 * @param {?DOMDocument} doc Defaults to current document.
 * @return {?DOMElement}
 */
function getActiveElement(doc) /*?DOMElement*/{
  doc = doc || (typeof document !== 'undefined' ? document : undefined);
  if (typeof doc === 'undefined') {
    return null;
  }
  try {
    return doc.activeElement || doc.body;
  } catch (e) {
    return doc.body;
  }
}

module.exports = getActiveElement;

/***/ }),

/***/ "../../node_modules/fbjs/lib/invariant.js":
/*!***********************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/fbjs/lib/invariant.js ***!
  \***********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (false) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),

/***/ "../../node_modules/fbjs/lib/isNode.js":
/*!********************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/fbjs/lib/isNode.js ***!
  \********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
function isNode(object) {
  var doc = object ? object.ownerDocument || object : document;
  var defaultView = doc.defaultView || window;
  return !!(object && (typeof defaultView.Node === 'function' ? object instanceof defaultView.Node : typeof object === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string'));
}

module.exports = isNode;

/***/ }),

/***/ "../../node_modules/fbjs/lib/isTextNode.js":
/*!************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/fbjs/lib/isTextNode.js ***!
  \************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

var isNode = __webpack_require__(/*! ./isNode */ "../../node_modules/fbjs/lib/isNode.js");

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */
function isTextNode(object) {
  return isNode(object) && object.nodeType == 3;
}

module.exports = isTextNode;

/***/ }),

/***/ "../../node_modules/fbjs/lib/shallowEqual.js":
/*!**************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/fbjs/lib/shallowEqual.js ***!
  \**************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

/*eslint-disable no-self-compare */



var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

module.exports = shallowEqual;

/***/ }),

/***/ "../../node_modules/has-ansi/index.js":
/*!*******************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/has-ansi/index.js ***!
  \*******************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ "../../node_modules/ansi-regex/index.js");
var re = new RegExp(ansiRegex().source); // remove the `g` flag
module.exports = re.test.bind(re);


/***/ }),

/***/ "../../node_modules/inherits/inherits_browser.js":
/*!******************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/inherits/inherits_browser.js ***!
  \******************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),

/***/ "../../node_modules/json3/lib/json3.js":
/*!********************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/json3/lib/json3.js ***!
  \********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = "function" === "function" && __webpack_require__(/*! !webpack amd options */ "../../node_modules/webpack/buildin/amd-options.js");

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the object's prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (objectTypes[typeof filter] && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root["JSON3"],
        isRestored = false;

    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root["JSON3"] = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return JSON3;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/buildin/module.js */ "../../node_modules/webpack/buildin/module.js")(module), __webpack_require__(/*! ./../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/node-libs-browser/node_modules/punycode/punycode.js":
/*!*****************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/node-libs-browser/node_modules/punycode/punycode.js ***!
  \*****************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../webpack/buildin/module.js */ "../../node_modules/webpack/buildin/module.js")(module), __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/object-assign/index.js":
/*!************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/object-assign/index.js ***!
  \************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "../../node_modules/process/browser.js":
/*!********************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/process/browser.js ***!
  \********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "../../node_modules/querystring-es3/decode.js":
/*!***************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/querystring-es3/decode.js ***!
  \***************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ "../../node_modules/querystring-es3/encode.js":
/*!***************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/querystring-es3/encode.js ***!
  \***************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ "../../node_modules/querystring-es3/index.js":
/*!**************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/querystring-es3/index.js ***!
  \**************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ "../../node_modules/querystring-es3/decode.js");
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ "../../node_modules/querystring-es3/encode.js");


/***/ }),

/***/ "../../node_modules/react-dev-utils/formatWebpackMessages.js":
/*!******************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-dev-utils/formatWebpackMessages.js ***!
  \******************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



// WARNING: this code is untranspiled and is used in browser too.
// Please make sure any changes are in ES5 or contribute a Babel compile step.

// Some custom utilities to prettify Webpack output.
// This is quite hacky and hopefully won't be needed when Webpack fixes this.
// https://github.com/webpack/webpack/issues/2878

var chalk = __webpack_require__(/*! chalk */ "../../node_modules/chalk/index.js");
var friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

// Cleans up webpack error messages.
// eslint-disable-next-line no-unused-vars
function formatMessage(message, isError) {
  var lines = message.split('\n');

  if (lines.length > 2 && lines[1] === '') {
    // Remove extra newline.
    lines.splice(1, 1);
  }

  // Remove webpack-specific loader notation from filename.
  // Before:
  // ./~/css-loader!./~/postcss-loader!./src/App.css
  // After:
  // ./src/App.css
  if (lines[0].lastIndexOf('!') !== -1) {
    lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
  }

  lines = lines.filter(function(line) {
    // Webpack adds a list of entry points to warning messages:
    //  @ ./src/index.js
    //  @ multi react-scripts/~/react-dev-utils/webpackHotDevClient.js ...
    // It is misleading (and unrelated to the warnings) so we clean it up.
    // It is only useful for syntax errors but we have beautiful frames for them.
    return line.indexOf(' @ ') !== 0;
  });

  // line #0 is filename
  // line #1 is the main error message
  if (!lines[0] || !lines[1]) {
    return lines.join('\n');
  }

  // Cleans up verbose "module not found" messages for files and packages.
  if (lines[1].indexOf('Module not found: ') === 0) {
    lines = [
      lines[0],
      // Clean up message because "Module not found: " is descriptive enough.
      lines[1]
        .replace("Cannot resolve 'file' or 'directory' ", '')
        .replace('Cannot resolve module ', '')
        .replace('Error: ', '')
        .replace('[CaseSensitivePathsPlugin] ', ''),
    ];
  }

  // Cleans up syntax error messages.
  if (lines[1].indexOf('Module build failed: ') === 0) {
    lines[1] = lines[1].replace(
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    );
  }

  // Clean up export errors.
  // TODO: we should really send a PR to Webpack for this.
  var exportError = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/;
  if (lines[1].match(exportError)) {
    lines[1] = lines[1].replace(
      exportError,
      "$1 '$4' does not contain an export named '$3'."
    );
  }

  lines[0] = chalk.inverse(lines[0]);

  // Reassemble the message.
  message = lines.join('\n');
  // Internal stacks are generally useless so we strip them... with the
  // exception of stacks containing `webpack:` because they're normally
  // from user code generated by WebPack. For more information see
  // https://github.com/facebookincubator/create-react-app/pull/1050
  message = message.replace(
    /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm,
    ''
  ); // at ... ...:x:y

  return message.trim();
}

function formatWebpackMessages(json) {
  var formattedErrors = json.errors.map(function(message) {
    return formatMessage(message, true);
  });
  var formattedWarnings = json.warnings.map(function(message) {
    return formatMessage(message, false);
  });
  var result = {
    errors: formattedErrors,
    warnings: formattedWarnings,
  };
  if (result.errors.some(isLikelyASyntaxError)) {
    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }
  return result;
}

module.exports = formatWebpackMessages;


/***/ }),

/***/ "../../node_modules/react-dev-utils/launchEditorEndpoint.js":
/*!*****************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-dev-utils/launchEditorEndpoint.js ***!
  \*****************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


// TODO: we might want to make this injectable to support DEV-time non-root URLs.
module.exports = '/__open-stack-frame-in-editor';


/***/ }),

/***/ "../../node_modules/react-dev-utils/webpackHotDevClient.js":
/*!****************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-dev-utils/webpackHotDevClient.js ***!
  \****************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



// This alternative WebpackDevServer combines the functionality of:
// https://github.com/webpack/webpack-dev-server/blob/webpack-1/client/index.js
// https://github.com/webpack/webpack/blob/webpack-1/hot/dev-server.js

// It only supports their simplest configuration (hot updates on same server).
// It makes some opinionated choices on top, like adding a syntax error overlay
// that looks similar to our console output. The error overlay is inspired by:
// https://github.com/glenjamin/webpack-hot-middleware

var SockJS = __webpack_require__(/*! sockjs-client */ "../../node_modules/sockjs-client/lib/entry.js");
var stripAnsi = __webpack_require__(/*! strip-ansi */ "../../node_modules/strip-ansi/index.js");
var url = __webpack_require__(/*! url */ "../../node_modules/url/url.js");
var launchEditorEndpoint = __webpack_require__(/*! ./launchEditorEndpoint */ "../../node_modules/react-dev-utils/launchEditorEndpoint.js");
var formatWebpackMessages = __webpack_require__(/*! ./formatWebpackMessages */ "../../node_modules/react-dev-utils/formatWebpackMessages.js");
var ErrorOverlay = __webpack_require__(/*! react-error-overlay */ "../../node_modules/react-error-overlay/lib/index.js");

ErrorOverlay.setEditorHandler(function editorHandler(errorLocation) {
  // Keep this sync with errorOverlayMiddleware.js
  fetch(
    launchEditorEndpoint +
      '?fileName=' +
      window.encodeURIComponent(errorLocation.fileName) +
      '&lineNumber=' +
      window.encodeURIComponent(errorLocation.lineNumber || 1) +
      '&colNumber=' +
      window.encodeURIComponent(errorLocation.colNumber || 1)
  );
});

// We need to keep track of if there has been a runtime error.
// Essentially, we cannot guarantee application state was not corrupted by the
// runtime error. To prevent confusing behavior, we forcibly reload the entire
// application. This is handled below when we are notified of a compile (code
// change).
// See https://github.com/facebookincubator/create-react-app/issues/3096
var hadRuntimeError = false;
ErrorOverlay.startReportingRuntimeErrors({
  onError: function() {
    hadRuntimeError = true;
  },
  filename: '/static/js/bundle.js',
});

if (module.hot && typeof module.hot.dispose === 'function') {
  module.hot.dispose(function() {
    // TODO: why do we need this?
    ErrorOverlay.stopReportingRuntimeErrors();
  });
}

// Connect to WebpackDevServer via a socket.
var connection = new SockJS(
  url.format({
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    port: window.location.port,
    // Hardcoded in WebpackDevServer
    pathname: '/sockjs-node',
  })
);

// Unlike WebpackDevServer client, we won't try to reconnect
// to avoid spamming the console. Disconnect usually happens
// when developer stops the server.
connection.onclose = function() {
  if (typeof console !== 'undefined' && typeof console.info === 'function') {
    console.info(
      'The development server has disconnected.\nRefresh the page if necessary.'
    );
  }
};

// Remember some state related to hot module replacement.
var isFirstCompilation = true;
var mostRecentCompilationHash = null;
var hasCompileErrors = false;

function clearOutdatedErrors() {
  // Clean up outdated compile errors, if any.
  if (typeof console !== 'undefined' && typeof console.clear === 'function') {
    if (hasCompileErrors) {
      console.clear();
    }
  }
}

// Successful compilation.
function handleSuccess() {
  clearOutdatedErrors();

  var isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;

  // Attempt to apply hot updates or reload.
  if (isHotUpdate) {
    tryApplyUpdates(function onHotUpdateSuccess() {
      // Only dismiss it when we're sure it's a hot update.
      // Otherwise it would flicker right before the reload.
      ErrorOverlay.dismissBuildError();
    });
  }
}

// Compilation with warnings (e.g. ESLint).
function handleWarnings(warnings) {
  clearOutdatedErrors();

  var isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;

  function printWarnings() {
    // Print warnings to the console.
    var formatted = formatWebpackMessages({
      warnings: warnings,
      errors: [],
    });

    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      for (var i = 0; i < formatted.warnings.length; i++) {
        if (i === 5) {
          console.warn(
            'There were more warnings in other files.\n' +
              'You can find a complete log in the terminal.'
          );
          break;
        }
        console.warn(stripAnsi(formatted.warnings[i]));
      }
    }
  }

  // Attempt to apply hot updates or reload.
  if (isHotUpdate) {
    tryApplyUpdates(function onSuccessfulHotUpdate() {
      // Only print warnings if we aren't refreshing the page.
      // Otherwise they'll disappear right away anyway.
      printWarnings();
      // Only dismiss it when we're sure it's a hot update.
      // Otherwise it would flicker right before the reload.
      ErrorOverlay.dismissBuildError();
    });
  } else {
    // Print initial warnings immediately.
    printWarnings();
  }
}

// Compilation with errors (e.g. syntax error or missing modules).
function handleErrors(errors) {
  clearOutdatedErrors();

  isFirstCompilation = false;
  hasCompileErrors = true;

  // "Massage" webpack messages.
  var formatted = formatWebpackMessages({
    errors: errors,
    warnings: [],
  });

  // Only show the first error.
  ErrorOverlay.reportBuildError(formatted.errors[0]);

  // Also log them to the console.
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    for (var i = 0; i < formatted.errors.length; i++) {
      console.error(stripAnsi(formatted.errors[i]));
    }
  }

  // Do not attempt to reload now.
  // We will reload on next success instead.
}

// There is a newer version of the code available.
function handleAvailableHash(hash) {
  // Update last known compilation hash.
  mostRecentCompilationHash = hash;
}

// Handle messages from the server.
connection.onmessage = function(e) {
  var message = JSON.parse(e.data);
  switch (message.type) {
    case 'hash':
      handleAvailableHash(message.data);
      break;
    case 'still-ok':
    case 'ok':
      handleSuccess();
      break;
    case 'content-changed':
      // Triggered when a file from `contentBase` changed.
      window.location.reload();
      break;
    case 'warnings':
      handleWarnings(message.data);
      break;
    case 'errors':
      handleErrors(message.data);
      break;
    default:
    // Do nothing.
  }
};

// Is there a newer version of this code available?
function isUpdateAvailable() {
  /* globals __webpack_hash__ */
  // __webpack_hash__ is the hash of the current compilation.
  // It's a global variable injected by Webpack.
  return mostRecentCompilationHash !== __webpack_require__.h();
}

// Webpack disallows updates in other states.
function canApplyUpdates() {
  return module.hot.status() === 'idle';
}

// Attempt to update code on the fly, fall back to a hard reload.
function tryApplyUpdates(onHotUpdateSuccess) {
  if (false) {
    // HotModuleReplacementPlugin is not in Webpack configuration.
    window.location.reload();
    return;
  }

  if (!isUpdateAvailable() || !canApplyUpdates()) {
    return;
  }

  function handleApplyUpdates(err, updatedModules) {
    if (err || !updatedModules || hadRuntimeError) {
      window.location.reload();
      return;
    }

    if (typeof onHotUpdateSuccess === 'function') {
      // Maybe we want to do something.
      onHotUpdateSuccess();
    }

    if (isUpdateAvailable()) {
      // While we were updating, there was a new update! Do it again.
      tryApplyUpdates();
    }
  }

  // https://webpack.github.io/docs/hot-module-replacement.html#check
  var result = module.hot.check(/* autoApply */ true, handleApplyUpdates);

  // // Webpack 2 returns a Promise instead of invoking a callback
  if (result && result.then) {
    result.then(
      function(updatedModules) {
        handleApplyUpdates(null, updatedModules);
      },
      function(err) {
        handleApplyUpdates(err, null);
      }
    );
  }
}


/***/ }),

/***/ "../../node_modules/react-dom/cjs/react-dom.production.min.js":
/*!*******************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-dom/cjs/react-dom.production.min.js ***!
  \*******************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.4.0
 * react-dom.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
var aa=__webpack_require__(/*! fbjs/lib/invariant */ "../../node_modules/fbjs/lib/invariant.js"),ca=__webpack_require__(/*! react */ "../../node_modules/react/index.js"),m=__webpack_require__(/*! fbjs/lib/ExecutionEnvironment */ "../../node_modules/fbjs/lib/ExecutionEnvironment.js"),p=__webpack_require__(/*! object-assign */ "../../node_modules/object-assign/index.js"),v=__webpack_require__(/*! fbjs/lib/emptyFunction */ "../../node_modules/fbjs/lib/emptyFunction.js"),da=__webpack_require__(/*! fbjs/lib/getActiveElement */ "../../node_modules/fbjs/lib/getActiveElement.js"),ea=__webpack_require__(/*! fbjs/lib/shallowEqual */ "../../node_modules/fbjs/lib/shallowEqual.js"),fa=__webpack_require__(/*! fbjs/lib/containsNode */ "../../node_modules/fbjs/lib/containsNode.js"),ha=__webpack_require__(/*! fbjs/lib/emptyObject */ "../../node_modules/fbjs/lib/emptyObject.js");
function A(a){for(var b=arguments.length-1,c="https://reactjs.org/docs/error-decoder.html?invariant="+a,d=0;d<b;d++)c+="&args[]="+encodeURIComponent(arguments[d+1]);aa(!1,"Minified React error #"+a+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",c)}ca?void 0:A("227");
function ia(a,b,c,d,e,f,g,h,k){this._hasCaughtError=!1;this._caughtError=null;var n=Array.prototype.slice.call(arguments,3);try{b.apply(c,n)}catch(r){this._caughtError=r,this._hasCaughtError=!0}}
var B={_caughtError:null,_hasCaughtError:!1,_rethrowError:null,_hasRethrowError:!1,invokeGuardedCallback:function(a,b,c,d,e,f,g,h,k){ia.apply(B,arguments)},invokeGuardedCallbackAndCatchFirstError:function(a,b,c,d,e,f,g,h,k){B.invokeGuardedCallback.apply(this,arguments);if(B.hasCaughtError()){var n=B.clearCaughtError();B._hasRethrowError||(B._hasRethrowError=!0,B._rethrowError=n)}},rethrowCaughtError:function(){return ka.apply(B,arguments)},hasCaughtError:function(){return B._hasCaughtError},clearCaughtError:function(){if(B._hasCaughtError){var a=
B._caughtError;B._caughtError=null;B._hasCaughtError=!1;return a}A("198")}};function ka(){if(B._hasRethrowError){var a=B._rethrowError;B._rethrowError=null;B._hasRethrowError=!1;throw a;}}var la=null,ma={};
function na(){if(la)for(var a in ma){var b=ma[a],c=la.indexOf(a);-1<c?void 0:A("96",a);if(!oa[c]){b.extractEvents?void 0:A("97",a);oa[c]=b;c=b.eventTypes;for(var d in c){var e=void 0;var f=c[d],g=b,h=d;pa.hasOwnProperty(h)?A("99",h):void 0;pa[h]=f;var k=f.phasedRegistrationNames;if(k){for(e in k)k.hasOwnProperty(e)&&qa(k[e],g,h);e=!0}else f.registrationName?(qa(f.registrationName,g,h),e=!0):e=!1;e?void 0:A("98",d,a)}}}}
function qa(a,b,c){ra[a]?A("100",a):void 0;ra[a]=b;sa[a]=b.eventTypes[c].dependencies}var oa=[],pa={},ra={},sa={};function ta(a){la?A("101"):void 0;la=Array.prototype.slice.call(a);na()}function ua(a){var b=!1,c;for(c in a)if(a.hasOwnProperty(c)){var d=a[c];ma.hasOwnProperty(c)&&ma[c]===d||(ma[c]?A("102",c):void 0,ma[c]=d,b=!0)}b&&na()}
var va={plugins:oa,eventNameDispatchConfigs:pa,registrationNameModules:ra,registrationNameDependencies:sa,possibleRegistrationNames:null,injectEventPluginOrder:ta,injectEventPluginsByName:ua},wa=null,xa=null,ya=null;function za(a,b,c,d){b=a.type||"unknown-event";a.currentTarget=ya(d);B.invokeGuardedCallbackAndCatchFirstError(b,c,void 0,a);a.currentTarget=null}
function Aa(a,b){null==b?A("30"):void 0;if(null==a)return b;if(Array.isArray(a)){if(Array.isArray(b))return a.push.apply(a,b),a;a.push(b);return a}return Array.isArray(b)?[a].concat(b):[a,b]}function Ba(a,b,c){Array.isArray(a)?a.forEach(b,c):a&&b.call(c,a)}var Ca=null;
function Da(a,b){if(a){var c=a._dispatchListeners,d=a._dispatchInstances;if(Array.isArray(c))for(var e=0;e<c.length&&!a.isPropagationStopped();e++)za(a,b,c[e],d[e]);else c&&za(a,b,c,d);a._dispatchListeners=null;a._dispatchInstances=null;a.isPersistent()||a.constructor.release(a)}}function Ea(a){return Da(a,!0)}function Fa(a){return Da(a,!1)}var Ga={injectEventPluginOrder:ta,injectEventPluginsByName:ua};
function Ha(a,b){var c=a.stateNode;if(!c)return null;var d=wa(c);if(!d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1}if(a)return null;c&&"function"!==typeof c?A("231",b,typeof c):void 0;
return c}function Ia(a,b){null!==a&&(Ca=Aa(Ca,a));a=Ca;Ca=null;a&&(b?Ba(a,Ea):Ba(a,Fa),Ca?A("95"):void 0,B.rethrowCaughtError())}function Ja(a,b,c,d){for(var e=null,f=0;f<oa.length;f++){var g=oa[f];g&&(g=g.extractEvents(a,b,c,d))&&(e=Aa(e,g))}Ia(e,!1)}var Ka={injection:Ga,getListener:Ha,runEventsInBatch:Ia,runExtractedEventsInBatch:Ja},La=Math.random().toString(36).slice(2),C="__reactInternalInstance$"+La,Ma="__reactEventHandlers$"+La;
function Na(a){if(a[C])return a[C];for(;!a[C];)if(a.parentNode)a=a.parentNode;else return null;a=a[C];return 5===a.tag||6===a.tag?a:null}function Oa(a){if(5===a.tag||6===a.tag)return a.stateNode;A("33")}function Pa(a){return a[Ma]||null}var Qa={precacheFiberNode:function(a,b){b[C]=a},getClosestInstanceFromNode:Na,getInstanceFromNode:function(a){a=a[C];return!a||5!==a.tag&&6!==a.tag?null:a},getNodeFromInstance:Oa,getFiberCurrentPropsFromNode:Pa,updateFiberProps:function(a,b){a[Ma]=b}};
function F(a){do a=a.return;while(a&&5!==a.tag);return a?a:null}function Ra(a,b,c){for(var d=[];a;)d.push(a),a=F(a);for(a=d.length;0<a--;)b(d[a],"captured",c);for(a=0;a<d.length;a++)b(d[a],"bubbled",c)}function Sa(a,b,c){if(b=Ha(a,c.dispatchConfig.phasedRegistrationNames[b]))c._dispatchListeners=Aa(c._dispatchListeners,b),c._dispatchInstances=Aa(c._dispatchInstances,a)}function Ta(a){a&&a.dispatchConfig.phasedRegistrationNames&&Ra(a._targetInst,Sa,a)}
function Ua(a){if(a&&a.dispatchConfig.phasedRegistrationNames){var b=a._targetInst;b=b?F(b):null;Ra(b,Sa,a)}}function Va(a,b,c){a&&c&&c.dispatchConfig.registrationName&&(b=Ha(a,c.dispatchConfig.registrationName))&&(c._dispatchListeners=Aa(c._dispatchListeners,b),c._dispatchInstances=Aa(c._dispatchInstances,a))}function Xa(a){a&&a.dispatchConfig.registrationName&&Va(a._targetInst,null,a)}function Ya(a){Ba(a,Ta)}
function Za(a,b,c,d){if(c&&d)a:{var e=c;for(var f=d,g=0,h=e;h;h=F(h))g++;h=0;for(var k=f;k;k=F(k))h++;for(;0<g-h;)e=F(e),g--;for(;0<h-g;)f=F(f),h--;for(;g--;){if(e===f||e===f.alternate)break a;e=F(e);f=F(f)}e=null}else e=null;f=e;for(e=[];c&&c!==f;){g=c.alternate;if(null!==g&&g===f)break;e.push(c);c=F(c)}for(c=[];d&&d!==f;){g=d.alternate;if(null!==g&&g===f)break;c.push(d);d=F(d)}for(d=0;d<e.length;d++)Va(e[d],"bubbled",a);for(a=c.length;0<a--;)Va(c[a],"captured",b)}
var $a={accumulateTwoPhaseDispatches:Ya,accumulateTwoPhaseDispatchesSkipTarget:function(a){Ba(a,Ua)},accumulateEnterLeaveDispatches:Za,accumulateDirectDispatches:function(a){Ba(a,Xa)}};function ab(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;c["ms"+a]="MS"+b;c["O"+a]="o"+b.toLowerCase();return c}
var bb={animationend:ab("Animation","AnimationEnd"),animationiteration:ab("Animation","AnimationIteration"),animationstart:ab("Animation","AnimationStart"),transitionend:ab("Transition","TransitionEnd")},cb={},db={};m.canUseDOM&&(db=document.createElement("div").style,"AnimationEvent"in window||(delete bb.animationend.animation,delete bb.animationiteration.animation,delete bb.animationstart.animation),"TransitionEvent"in window||delete bb.transitionend.transition);
function eb(a){if(cb[a])return cb[a];if(!bb[a])return a;var b=bb[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in db)return cb[a]=b[c];return a}var fb=eb("animationend"),gb=eb("animationiteration"),hb=eb("animationstart"),ib=eb("transitionend"),jb="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),kb=null;
function lb(){!kb&&m.canUseDOM&&(kb="textContent"in document.documentElement?"textContent":"innerText");return kb}var G={_root:null,_startText:null,_fallbackText:null};function mb(){if(G._fallbackText)return G._fallbackText;var a,b=G._startText,c=b.length,d,e=nb(),f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);G._fallbackText=e.slice(a,1<d?1-d:void 0);return G._fallbackText}function nb(){return"value"in G._root?G._root.value:G._root[lb()]}
var ob="dispatchConfig _targetInst nativeEvent isDefaultPrevented isPropagationStopped _dispatchListeners _dispatchInstances".split(" "),pb={type:null,target:null,currentTarget:v.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};
function H(a,b,c,d){this.dispatchConfig=a;this._targetInst=b;this.nativeEvent=c;a=this.constructor.Interface;for(var e in a)a.hasOwnProperty(e)&&((b=a[e])?this[e]=b(c):"target"===e?this.target=d:this[e]=c[e]);this.isDefaultPrevented=(null!=c.defaultPrevented?c.defaultPrevented:!1===c.returnValue)?v.thatReturnsTrue:v.thatReturnsFalse;this.isPropagationStopped=v.thatReturnsFalse;return this}
p(H.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&(a.returnValue=!1),this.isDefaultPrevented=v.thatReturnsTrue)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=v.thatReturnsTrue)},persist:function(){this.isPersistent=v.thatReturnsTrue},isPersistent:v.thatReturnsFalse,
destructor:function(){var a=this.constructor.Interface,b;for(b in a)this[b]=null;for(a=0;a<ob.length;a++)this[ob[a]]=null}});H.Interface=pb;H.extend=function(a){function b(){}function c(){return d.apply(this,arguments)}var d=this;b.prototype=d.prototype;var e=new b;p(e,c.prototype);c.prototype=e;c.prototype.constructor=c;c.Interface=p({},d.Interface,a);c.extend=d.extend;qb(c);return c};qb(H);
function rb(a,b,c,d){if(this.eventPool.length){var e=this.eventPool.pop();this.call(e,a,b,c,d);return e}return new this(a,b,c,d)}function sb(a){a instanceof this?void 0:A("223");a.destructor();10>this.eventPool.length&&this.eventPool.push(a)}function qb(a){a.eventPool=[];a.getPooled=rb;a.release=sb}var tb=H.extend({data:null}),ub=H.extend({data:null}),vb=[9,13,27,32],wb=m.canUseDOM&&"CompositionEvent"in window,xb=null;m.canUseDOM&&"documentMode"in document&&(xb=document.documentMode);
var yb=m.canUseDOM&&"TextEvent"in window&&!xb,zb=m.canUseDOM&&(!wb||xb&&8<xb&&11>=xb),Ab=String.fromCharCode(32),Bb={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",
captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},Cb=!1;
function Db(a,b){switch(a){case "keyup":return-1!==vb.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "blur":return!0;default:return!1}}function Eb(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}var Fb=!1;function Gb(a,b){switch(a){case "compositionend":return Eb(b);case "keypress":if(32!==b.which)return null;Cb=!0;return Ab;case "textInput":return a=b.data,a===Ab&&Cb?null:a;default:return null}}
function Hb(a,b){if(Fb)return"compositionend"===a||!wb&&Db(a,b)?(a=mb(),G._root=null,G._startText=null,G._fallbackText=null,Fb=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return zb?null:b.data;default:return null}}
var Ib={eventTypes:Bb,extractEvents:function(a,b,c,d){var e=void 0;var f=void 0;if(wb)b:{switch(a){case "compositionstart":e=Bb.compositionStart;break b;case "compositionend":e=Bb.compositionEnd;break b;case "compositionupdate":e=Bb.compositionUpdate;break b}e=void 0}else Fb?Db(a,c)&&(e=Bb.compositionEnd):"keydown"===a&&229===c.keyCode&&(e=Bb.compositionStart);e?(zb&&(Fb||e!==Bb.compositionStart?e===Bb.compositionEnd&&Fb&&(f=mb()):(G._root=d,G._startText=nb(),Fb=!0)),e=tb.getPooled(e,b,c,d),f?e.data=
f:(f=Eb(c),null!==f&&(e.data=f)),Ya(e),f=e):f=null;(a=yb?Gb(a,c):Hb(a,c))?(b=ub.getPooled(Bb.beforeInput,b,c,d),b.data=a,Ya(b)):b=null;return null===f?b:null===b?f:[f,b]}},Jb=null,Kb={injectFiberControlledHostComponent:function(a){Jb=a}},Lb=null,Mb=null;function Nb(a){if(a=xa(a)){Jb&&"function"===typeof Jb.restoreControlledState?void 0:A("194");var b=wa(a.stateNode);Jb.restoreControlledState(a.stateNode,a.type,b)}}function Ob(a){Lb?Mb?Mb.push(a):Mb=[a]:Lb=a}
function Pb(){return null!==Lb||null!==Mb}function Qb(){if(Lb){var a=Lb,b=Mb;Mb=Lb=null;Nb(a);if(b)for(a=0;a<b.length;a++)Nb(b[a])}}var Rb={injection:Kb,enqueueStateRestore:Ob,needsStateRestore:Pb,restoreStateIfNeeded:Qb};function Sb(a,b){return a(b)}function Tb(a,b,c){return a(b,c)}function Ub(){}var Vb=!1;function Wb(a,b){if(Vb)return a(b);Vb=!0;try{return Sb(a,b)}finally{Vb=!1,Pb()&&(Ub(),Qb())}}
var Xb={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Yb(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return"input"===b?!!Xb[a.type]:"textarea"===b?!0:!1}function Zb(a){a=a.target||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}
function $b(a,b){if(!m.canUseDOM||b&&!("addEventListener"in document))return!1;a="on"+a;b=a in document;b||(b=document.createElement("div"),b.setAttribute(a,"return;"),b="function"===typeof b[a]);return b}function ac(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function bc(a){var b=ac(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a)}});Object.defineProperty(a,b,{enumerable:c.enumerable});return{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=
null;delete a[b]}}}}function cc(a){a._valueTracker||(a._valueTracker=bc(a))}function dc(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=ac(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}
var ec=ca.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,I="function"===typeof Symbol&&Symbol.for,fc=I?Symbol.for("react.element"):60103,gc=I?Symbol.for("react.portal"):60106,hc=I?Symbol.for("react.fragment"):60107,ic=I?Symbol.for("react.strict_mode"):60108,jc=I?Symbol.for("react.profiler"):60114,mc=I?Symbol.for("react.provider"):60109,nc=I?Symbol.for("react.context"):60110,oc=I?Symbol.for("react.async_mode"):60111,pc=I?Symbol.for("react.forward_ref"):60112,qc=I?Symbol.for("react.timeout"):
60113,rc="function"===typeof Symbol&&Symbol.iterator;function sc(a){if(null===a||"undefined"===typeof a)return null;a=rc&&a[rc]||a["@@iterator"];return"function"===typeof a?a:null}
function tc(a){var b=a.type;if("function"===typeof b)return b.displayName||b.name;if("string"===typeof b)return b;switch(b){case oc:return"AsyncMode";case nc:return"Context.Consumer";case hc:return"ReactFragment";case gc:return"ReactPortal";case jc:return"Profiler("+a.pendingProps.id+")";case mc:return"Context.Provider";case ic:return"StrictMode";case qc:return"Timeout"}if("object"===typeof b&&null!==b)switch(b.$$typeof){case pc:return a=b.render.displayName||b.render.name||"",""!==a?"ForwardRef("+
a+")":"ForwardRef"}return null}function vc(a){var b="";do{a:switch(a.tag){case 0:case 1:case 2:case 5:var c=a._debugOwner,d=a._debugSource;var e=tc(a);var f=null;c&&(f=tc(c));c=d;e="\n    in "+(e||"Unknown")+(c?" (at "+c.fileName.replace(/^.*[\\\/]/,"")+":"+c.lineNumber+")":f?" (created by "+f+")":"");break a;default:e=""}b+=e;a=a.return}while(a);return b}
var wc=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,xc={},yc={};function zc(a){if(yc.hasOwnProperty(a))return!0;if(xc.hasOwnProperty(a))return!1;if(wc.test(a))return yc[a]=!0;xc[a]=!0;return!1}
function Ac(a,b,c,d){if(null!==c&&0===c.type)return!1;switch(typeof b){case "function":case "symbol":return!0;case "boolean":if(d)return!1;if(null!==c)return!c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}function Bc(a,b,c,d){if(null===b||"undefined"===typeof b||Ac(a,b,c,d))return!0;if(d)return!1;if(null!==c)switch(c.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}
function J(a,b,c,d,e){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b}var K={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){K[a]=new J(a,0,!1,a,null)});
[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];K[b]=new J(b,1,!1,a[1],null)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){K[a]=new J(a,2,!1,a.toLowerCase(),null)});["autoReverse","externalResourcesRequired","preserveAlpha"].forEach(function(a){K[a]=new J(a,2,!1,a,null)});
"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){K[a]=new J(a,3,!1,a.toLowerCase(),null)});["checked","multiple","muted","selected"].forEach(function(a){K[a]=new J(a,3,!0,a.toLowerCase(),null)});["capture","download"].forEach(function(a){K[a]=new J(a,4,!1,a.toLowerCase(),null)});
["cols","rows","size","span"].forEach(function(a){K[a]=new J(a,6,!1,a.toLowerCase(),null)});["rowSpan","start"].forEach(function(a){K[a]=new J(a,5,!1,a.toLowerCase(),null)});var Cc=/[\-:]([a-z])/g;function Dc(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(Cc,
Dc);K[b]=new J(b,1,!1,a,null)});"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(Cc,Dc);K[b]=new J(b,1,!1,a,"http://www.w3.org/1999/xlink")});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(Cc,Dc);K[b]=new J(b,1,!1,a,"http://www.w3.org/XML/1998/namespace")});K.tabIndex=new J("tabIndex",1,!1,"tabindex",null);
function Ec(a,b,c,d){var e=K.hasOwnProperty(b)?K[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(Bc(b,c,e,d)&&(c=null),d||null===e?zc(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c))))}
function Fc(a,b){var c=b.checked;return p({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Gc(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Hc(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value}}function Ic(a,b){b=b.checked;null!=b&&Ec(a,"checked",b,!1)}
function Jc(a,b){Ic(a,b);var c=Hc(b.value);if(null!=c)if("number"===b.type){if(0===c&&""===a.value||a.value!=c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);b.hasOwnProperty("value")?Kc(a,b.type,c):b.hasOwnProperty("defaultValue")&&Kc(a,b.type,Hc(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked)}
function Lc(a,b){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue"))""===a.value&&(a.value=""+a._wrapperState.initialValue),a.defaultValue=""+a._wrapperState.initialValue;b=a.name;""!==b&&(a.name="");a.defaultChecked=!a.defaultChecked;a.defaultChecked=!a.defaultChecked;""!==b&&(a.name=b)}function Kc(a,b,c){if("number"!==b||a.ownerDocument.activeElement!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c)}
function Hc(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return""}}var Mc={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}};function Nc(a,b,c){a=H.getPooled(Mc.change,a,b,c);a.type="change";Ob(c);Ya(a);return a}var Oc=null,Pc=null;function Qc(a){Ia(a,!1)}function Rc(a){var b=Oa(a);if(dc(b))return a}
function Sc(a,b){if("change"===a)return b}var Tc=!1;m.canUseDOM&&(Tc=$b("input")&&(!document.documentMode||9<document.documentMode));function Uc(){Oc&&(Oc.detachEvent("onpropertychange",Vc),Pc=Oc=null)}function Vc(a){"value"===a.propertyName&&Rc(Pc)&&(a=Nc(Pc,a,Zb(a)),Wb(Qc,a))}function Wc(a,b,c){"focus"===a?(Uc(),Oc=b,Pc=c,Oc.attachEvent("onpropertychange",Vc)):"blur"===a&&Uc()}function Xc(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return Rc(Pc)}
function Yc(a,b){if("click"===a)return Rc(b)}function Zc(a,b){if("input"===a||"change"===a)return Rc(b)}
var $c={eventTypes:Mc,_isInputEventSupported:Tc,extractEvents:function(a,b,c,d){var e=b?Oa(b):window,f=void 0,g=void 0,h=e.nodeName&&e.nodeName.toLowerCase();"select"===h||"input"===h&&"file"===e.type?f=Sc:Yb(e)?Tc?f=Zc:(f=Xc,g=Wc):(h=e.nodeName)&&"input"===h.toLowerCase()&&("checkbox"===e.type||"radio"===e.type)&&(f=Yc);if(f&&(f=f(a,b)))return Nc(f,c,d);g&&g(a,e,b);"blur"===a&&null!=b&&(a=b._wrapperState||e._wrapperState)&&a.controlled&&"number"===e.type&&Kc(e,"number",e.value)}},ad=H.extend({view:null,
detail:null}),bd={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function cd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=bd[a])?!!b[a]:!1}function dd(){return cd}
var ed=ad.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:dd,button:null,buttons:null,relatedTarget:function(a){return a.relatedTarget||(a.fromElement===a.srcElement?a.toElement:a.fromElement)}}),fd=ed.extend({pointerId:null,width:null,height:null,pressure:null,tiltX:null,tiltY:null,pointerType:null,isPrimary:null}),gd={mouseEnter:{registrationName:"onMouseEnter",dependencies:["mouseout","mouseover"]},
mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",dependencies:["pointerout","pointerover"]}},hd={eventTypes:gd,extractEvents:function(a,b,c,d){var e="mouseover"===a||"pointerover"===a,f="mouseout"===a||"pointerout"===a;if(e&&(c.relatedTarget||c.fromElement)||!f&&!e)return null;e=d.window===d?d:(e=d.ownerDocument)?e.defaultView||
e.parentWindow:window;f?(f=b,b=(b=c.relatedTarget||c.toElement)?Na(b):null):f=null;if(f===b)return null;var g=void 0,h=void 0,k=void 0,n=void 0;if("mouseout"===a||"mouseover"===a)g=ed,h=gd.mouseLeave,k=gd.mouseEnter,n="mouse";else if("pointerout"===a||"pointerover"===a)g=fd,h=gd.pointerLeave,k=gd.pointerEnter,n="pointer";a=null==f?e:Oa(f);e=null==b?e:Oa(b);h=g.getPooled(h,f,c,d);h.type=n+"leave";h.target=a;h.relatedTarget=e;c=g.getPooled(k,b,c,d);c.type=n+"enter";c.target=e;c.relatedTarget=a;Za(h,
c,f,b);return[h,c]}};function id(a){var b=a;if(a.alternate)for(;b.return;)b=b.return;else{if(0!==(b.effectTag&2))return 1;for(;b.return;)if(b=b.return,0!==(b.effectTag&2))return 1}return 3===b.tag?2:3}function jd(a){2!==id(a)?A("188"):void 0}
function kd(a){var b=a.alternate;if(!b)return b=id(a),3===b?A("188"):void 0,1===b?null:a;for(var c=a,d=b;;){var e=c.return,f=e?e.alternate:null;if(!e||!f)break;if(e.child===f.child){for(var g=e.child;g;){if(g===c)return jd(e),a;if(g===d)return jd(e),b;g=g.sibling}A("188")}if(c.return!==d.return)c=e,d=f;else{g=!1;for(var h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}g?
void 0:A("189")}}c.alternate!==d?A("190"):void 0}3!==c.tag?A("188"):void 0;return c.stateNode.current===c?a:b}function ld(a){a=kd(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}}return null}
function md(a){a=kd(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child&&4!==b.tag)b.child.return=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}}return null}var nd=H.extend({animationName:null,elapsedTime:null,pseudoElement:null}),od=H.extend({clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),pd=ad.extend({relatedTarget:null});
function qd(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}
var rd={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},sd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",
116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},td=ad.extend({key:function(a){if(a.key){var b=rd[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=qd(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?sd[a.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:dd,charCode:function(a){return"keypress"===
a.type?qd(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===a.type?qd(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),ud=ed.extend({dataTransfer:null}),vd=ad.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:dd}),wd=H.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),xd=ed.extend({deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in
a?-a.wheelDeltaX:0},deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:null,deltaMode:null}),yd=[["abort","abort"],[fb,"animationEnd"],[gb,"animationIteration"],[hb,"animationStart"],["canplay","canPlay"],["canplaythrough","canPlayThrough"],["drag","drag"],["dragenter","dragEnter"],["dragexit","dragExit"],["dragleave","dragLeave"],["dragover","dragOver"],["durationchange","durationChange"],["emptied","emptied"],["encrypted","encrypted"],
["ended","ended"],["error","error"],["gotpointercapture","gotPointerCapture"],["load","load"],["loadeddata","loadedData"],["loadedmetadata","loadedMetadata"],["loadstart","loadStart"],["lostpointercapture","lostPointerCapture"],["mousemove","mouseMove"],["mouseout","mouseOut"],["mouseover","mouseOver"],["playing","playing"],["pointermove","pointerMove"],["pointerout","pointerOut"],["pointerover","pointerOver"],["progress","progress"],["scroll","scroll"],["seeking","seeking"],["stalled","stalled"],
["suspend","suspend"],["timeupdate","timeUpdate"],["toggle","toggle"],["touchmove","touchMove"],[ib,"transitionEnd"],["waiting","waiting"],["wheel","wheel"]],zd={},Ad={};function Bd(a,b){var c=a[0];a=a[1];var d="on"+(a[0].toUpperCase()+a.slice(1));b={phasedRegistrationNames:{bubbled:d,captured:d+"Capture"},dependencies:[c],isInteractive:b};zd[a]=b;Ad[c]=b}
[["blur","blur"],["cancel","cancel"],["click","click"],["close","close"],["contextmenu","contextMenu"],["copy","copy"],["cut","cut"],["dblclick","doubleClick"],["dragend","dragEnd"],["dragstart","dragStart"],["drop","drop"],["focus","focus"],["input","input"],["invalid","invalid"],["keydown","keyDown"],["keypress","keyPress"],["keyup","keyUp"],["mousedown","mouseDown"],["mouseup","mouseUp"],["paste","paste"],["pause","pause"],["play","play"],["pointercancel","pointerCancel"],["pointerdown","pointerDown"],
["pointerup","pointerUp"],["ratechange","rateChange"],["reset","reset"],["seeked","seeked"],["submit","submit"],["touchcancel","touchCancel"],["touchend","touchEnd"],["touchstart","touchStart"],["volumechange","volumeChange"]].forEach(function(a){Bd(a,!0)});yd.forEach(function(a){Bd(a,!1)});
var Cd={eventTypes:zd,isInteractiveTopLevelEventType:function(a){a=Ad[a];return void 0!==a&&!0===a.isInteractive},extractEvents:function(a,b,c,d){var e=Ad[a];if(!e)return null;switch(a){case "keypress":if(0===qd(c))return null;case "keydown":case "keyup":a=td;break;case "blur":case "focus":a=pd;break;case "click":if(2===c.button)return null;case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":a=ed;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":a=
ud;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":a=vd;break;case fb:case gb:case hb:a=nd;break;case ib:a=wd;break;case "scroll":a=ad;break;case "wheel":a=xd;break;case "copy":case "cut":case "paste":a=od;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":a=fd;break;default:a=H}b=a.getPooled(e,b,c,d);Ya(b);return b}},Dd=Cd.isInteractiveTopLevelEventType,
Ed=[];function Fd(a){var b=a.targetInst;do{if(!b){a.ancestors.push(b);break}var c;for(c=b;c.return;)c=c.return;c=3!==c.tag?null:c.stateNode.containerInfo;if(!c)break;a.ancestors.push(b);b=Na(c)}while(b);for(c=0;c<a.ancestors.length;c++)b=a.ancestors[c],Ja(a.topLevelType,b,a.nativeEvent,Zb(a.nativeEvent))}var Gd=!0;function Id(a){Gd=!!a}function L(a,b){if(!b)return null;var c=(Dd(a)?Jd:Kd).bind(null,a);b.addEventListener(a,c,!1)}
function Ld(a,b){if(!b)return null;var c=(Dd(a)?Jd:Kd).bind(null,a);b.addEventListener(a,c,!0)}function Jd(a,b){Tb(Kd,a,b)}function Kd(a,b){if(Gd){var c=Zb(b);c=Na(c);null===c||"number"!==typeof c.tag||2===id(c)||(c=null);if(Ed.length){var d=Ed.pop();d.topLevelType=a;d.nativeEvent=b;d.targetInst=c;a=d}else a={topLevelType:a,nativeEvent:b,targetInst:c,ancestors:[]};try{Wb(Fd,a)}finally{a.topLevelType=null,a.nativeEvent=null,a.targetInst=null,a.ancestors.length=0,10>Ed.length&&Ed.push(a)}}}
var Md={get _enabled(){return Gd},setEnabled:Id,isEnabled:function(){return Gd},trapBubbledEvent:L,trapCapturedEvent:Ld,dispatchEvent:Kd},Nd={},Od=0,Pd="_reactListenersID"+(""+Math.random()).slice(2);function Qd(a){Object.prototype.hasOwnProperty.call(a,Pd)||(a[Pd]=Od++,Nd[a[Pd]]={});return Nd[a[Pd]]}function Rd(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Sd(a,b){var c=Rd(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=Rd(c)}}function Td(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&"text"===a.type||"textarea"===b||"true"===a.contentEditable)}
var Ud=m.canUseDOM&&"documentMode"in document&&11>=document.documentMode,Vd={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu focus keydown keyup mousedown mouseup selectionchange".split(" ")}},Wd=null,Xd=null,Yd=null,Zd=!1;
function $d(a,b){if(Zd||null==Wd||Wd!==da())return null;var c=Wd;"selectionStart"in c&&Td(c)?c={start:c.selectionStart,end:c.selectionEnd}:window.getSelection?(c=window.getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}):c=void 0;return Yd&&ea(Yd,c)?null:(Yd=c,a=H.getPooled(Vd.select,Xd,a,b),a.type="select",a.target=Wd,Ya(a),a)}
var ae={eventTypes:Vd,extractEvents:function(a,b,c,d){var e=d.window===d?d.document:9===d.nodeType?d:d.ownerDocument,f;if(!(f=!e)){a:{e=Qd(e);f=sa.onSelect;for(var g=0;g<f.length;g++){var h=f[g];if(!e.hasOwnProperty(h)||!e[h]){e=!1;break a}}e=!0}f=!e}if(f)return null;e=b?Oa(b):window;switch(a){case "focus":if(Yb(e)||"true"===e.contentEditable)Wd=e,Xd=b,Yd=null;break;case "blur":Yd=Xd=Wd=null;break;case "mousedown":Zd=!0;break;case "contextmenu":case "mouseup":return Zd=!1,$d(c,d);case "selectionchange":if(Ud)break;
case "keydown":case "keyup":return $d(c,d)}return null}};Ga.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin TapEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" "));wa=Qa.getFiberCurrentPropsFromNode;xa=Qa.getInstanceFromNode;ya=Qa.getNodeFromInstance;Ga.injectEventPluginsByName({SimpleEventPlugin:Cd,EnterLeaveEventPlugin:hd,ChangeEventPlugin:$c,SelectEventPlugin:ae,BeforeInputEventPlugin:Ib});var be=void 0;
be="object"===typeof performance&&"function"===typeof performance.now?function(){return performance.now()}:function(){return Date.now()};var ce=void 0,de=void 0;
if(m.canUseDOM){var ee=[],fe=0,ge={},he=-1,ie=!1,je=!1,ke=0,le=33,me=33,ne={didTimeout:!1,timeRemaining:function(){var a=ke-be();return 0<a?a:0}},oe=function(a,b){if(ge[b])try{a(ne)}finally{delete ge[b]}},pe="__reactIdleCallback$"+Math.random().toString(36).slice(2);window.addEventListener("message",function(a){if(a.source===window&&a.data===pe&&(ie=!1,0!==ee.length)){if(0!==ee.length&&(a=be(),!(-1===he||he>a))){he=-1;ne.didTimeout=!0;for(var b=0,c=ee.length;b<c;b++){var d=ee[b],e=d.timeoutTime;-1!==
e&&e<=a?oe(d.scheduledCallback,d.callbackId):-1!==e&&(-1===he||e<he)&&(he=e)}}for(a=be();0<ke-a&&0<ee.length;)a=ee.shift(),ne.didTimeout=!1,oe(a.scheduledCallback,a.callbackId),a=be();0<ee.length&&!je&&(je=!0,requestAnimationFrame(qe))}},!1);var qe=function(a){je=!1;var b=a-ke+me;b<me&&le<me?(8>b&&(b=8),me=b<le?le:b):le=b;ke=a+me;ie||(ie=!0,window.postMessage(pe,"*"))};ce=function(a,b){var c=-1;null!=b&&"number"===typeof b.timeout&&(c=be()+b.timeout);if(-1===he||-1!==c&&c<he)he=c;fe++;b=fe;ee.push({scheduledCallback:a,
callbackId:b,timeoutTime:c});ge[b]=!0;je||(je=!0,requestAnimationFrame(qe));return b};de=function(a){delete ge[a]}}else{var re=0,se={};ce=function(a){var b=re++,c=setTimeout(function(){a({timeRemaining:function(){return Infinity},didTimeout:!1})});se[b]=c;return b};de=function(a){var b=se[a];delete se[a];clearTimeout(b)}}function te(a){var b="";ca.Children.forEach(a,function(a){null==a||"string"!==typeof a&&"number"!==typeof a||(b+=a)});return b}
function ue(a,b){a=p({children:void 0},b);if(b=te(b.children))a.children=b;return a}function ve(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0)}else{c=""+c;b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e])}null!==b&&(b.selected=!0)}}
function we(a,b){var c=b.value;a._wrapperState={initialValue:null!=c?c:b.defaultValue,wasMultiple:!!b.multiple}}function xe(a,b){null!=b.dangerouslySetInnerHTML?A("91"):void 0;return p({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function ye(a,b){var c=b.value;null==c&&(c=b.defaultValue,b=b.children,null!=b&&(null!=c?A("92"):void 0,Array.isArray(b)&&(1>=b.length?void 0:A("93"),b=b[0]),c=""+b),null==c&&(c=""));a._wrapperState={initialValue:""+c}}
function ze(a,b){var c=b.value;null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&(a.defaultValue=c));null!=b.defaultValue&&(a.defaultValue=b.defaultValue)}function Ae(a){var b=a.textContent;b===a._wrapperState.initialValue&&(a.value=b)}var Be={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};
function Ce(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function De(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?Ce(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var Ee=void 0,Fe=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if(a.namespaceURI!==Be.svg||"innerHTML"in a)a.innerHTML=b;else{Ee=Ee||document.createElement("div");Ee.innerHTML="<svg>"+b+"</svg>";for(b=Ee.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild)}});
function Ge(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b}
var He={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,
stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ie=["Webkit","ms","Moz","O"];Object.keys(He).forEach(function(a){Ie.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);He[b]=He[a]})});
function Je(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--");var e=c;var f=b[c];e=null==f||"boolean"===typeof f||""===f?"":d||"number"!==typeof f||0===f||He.hasOwnProperty(e)&&He[e]?(""+f).trim():f+"px";"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e}}var Ke=p({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function Le(a,b,c){b&&(Ke[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML?A("137",a,c()):void 0),null!=b.dangerouslySetInnerHTML&&(null!=b.children?A("60"):void 0,"object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML?void 0:A("61")),null!=b.style&&"object"!==typeof b.style?A("62",c()):void 0)}
function Me(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;default:return!0}}var Ne=v.thatReturns("");
function Oe(a,b){a=9===a.nodeType||11===a.nodeType?a:a.ownerDocument;var c=Qd(a);b=sa[b];for(var d=0;d<b.length;d++){var e=b[d];if(!c.hasOwnProperty(e)||!c[e]){switch(e){case "scroll":Ld("scroll",a);break;case "focus":case "blur":Ld("focus",a);Ld("blur",a);c.blur=!0;c.focus=!0;break;case "cancel":case "close":$b(e,!0)&&Ld(e,a);break;case "invalid":case "submit":case "reset":break;default:-1===jb.indexOf(e)&&L(e,a)}c[e]=!0}}}
function Pe(a,b,c,d){c=9===c.nodeType?c:c.ownerDocument;d===Be.html&&(d=Ce(a));d===Be.html?"script"===a?(a=c.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):a="string"===typeof b.is?c.createElement(a,{is:b.is}):c.createElement(a):a=c.createElementNS(d,a);return a}function Qe(a,b){return(9===b.nodeType?b:b.ownerDocument).createTextNode(a)}
function Re(a,b,c,d){var e=Me(b,c);switch(b){case "iframe":case "object":L("load",a);var f=c;break;case "video":case "audio":for(f=0;f<jb.length;f++)L(jb[f],a);f=c;break;case "source":L("error",a);f=c;break;case "img":case "image":case "link":L("error",a);L("load",a);f=c;break;case "form":L("reset",a);L("submit",a);f=c;break;case "details":L("toggle",a);f=c;break;case "input":Gc(a,c);f=Fc(a,c);L("invalid",a);Oe(d,"onChange");break;case "option":f=ue(a,c);break;case "select":we(a,c);f=p({},c,{value:void 0});
L("invalid",a);Oe(d,"onChange");break;case "textarea":ye(a,c);f=xe(a,c);L("invalid",a);Oe(d,"onChange");break;default:f=c}Le(b,f,Ne);var g=f,h;for(h in g)if(g.hasOwnProperty(h)){var k=g[h];"style"===h?Je(a,k,Ne):"dangerouslySetInnerHTML"===h?(k=k?k.__html:void 0,null!=k&&Fe(a,k)):"children"===h?"string"===typeof k?("textarea"!==b||""!==k)&&Ge(a,k):"number"===typeof k&&Ge(a,""+k):"suppressContentEditableWarning"!==h&&"suppressHydrationWarning"!==h&&"autoFocus"!==h&&(ra.hasOwnProperty(h)?null!=k&&Oe(d,
h):null!=k&&Ec(a,h,k,e))}switch(b){case "input":cc(a);Lc(a,c);break;case "textarea":cc(a);Ae(a,c);break;case "option":null!=c.value&&a.setAttribute("value",c.value);break;case "select":a.multiple=!!c.multiple;b=c.value;null!=b?ve(a,!!c.multiple,b,!1):null!=c.defaultValue&&ve(a,!!c.multiple,c.defaultValue,!0);break;default:"function"===typeof f.onClick&&(a.onclick=v)}}
function Se(a,b,c,d,e){var f=null;switch(b){case "input":c=Fc(a,c);d=Fc(a,d);f=[];break;case "option":c=ue(a,c);d=ue(a,d);f=[];break;case "select":c=p({},c,{value:void 0});d=p({},d,{value:void 0});f=[];break;case "textarea":c=xe(a,c);d=xe(a,d);f=[];break;default:"function"!==typeof c.onClick&&"function"===typeof d.onClick&&(a.onclick=v)}Le(b,d,Ne);b=a=void 0;var g=null;for(a in c)if(!d.hasOwnProperty(a)&&c.hasOwnProperty(a)&&null!=c[a])if("style"===a){var h=c[a];for(b in h)h.hasOwnProperty(b)&&(g||
(g={}),g[b]="")}else"dangerouslySetInnerHTML"!==a&&"children"!==a&&"suppressContentEditableWarning"!==a&&"suppressHydrationWarning"!==a&&"autoFocus"!==a&&(ra.hasOwnProperty(a)?f||(f=[]):(f=f||[]).push(a,null));for(a in d){var k=d[a];h=null!=c?c[a]:void 0;if(d.hasOwnProperty(a)&&k!==h&&(null!=k||null!=h))if("style"===a)if(h){for(b in h)!h.hasOwnProperty(b)||k&&k.hasOwnProperty(b)||(g||(g={}),g[b]="");for(b in k)k.hasOwnProperty(b)&&h[b]!==k[b]&&(g||(g={}),g[b]=k[b])}else g||(f||(f=[]),f.push(a,g)),
g=k;else"dangerouslySetInnerHTML"===a?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(a,""+k)):"children"===a?h===k||"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(a,""+k):"suppressContentEditableWarning"!==a&&"suppressHydrationWarning"!==a&&(ra.hasOwnProperty(a)?(null!=k&&Oe(e,a),f||h===k||(f=[])):(f=f||[]).push(a,k))}g&&(f=f||[]).push("style",g);return f}
function Te(a,b,c,d,e){"input"===c&&"radio"===e.type&&null!=e.name&&Ic(a,e);Me(c,d);d=Me(c,e);for(var f=0;f<b.length;f+=2){var g=b[f],h=b[f+1];"style"===g?Je(a,h,Ne):"dangerouslySetInnerHTML"===g?Fe(a,h):"children"===g?Ge(a,h):Ec(a,g,h,d)}switch(c){case "input":Jc(a,e);break;case "textarea":ze(a,e);break;case "select":a._wrapperState.initialValue=void 0,b=a._wrapperState.wasMultiple,a._wrapperState.wasMultiple=!!e.multiple,c=e.value,null!=c?ve(a,!!e.multiple,c,!1):b!==!!e.multiple&&(null!=e.defaultValue?
ve(a,!!e.multiple,e.defaultValue,!0):ve(a,!!e.multiple,e.multiple?[]:"",!1))}}
function Ue(a,b,c,d,e){switch(b){case "iframe":case "object":L("load",a);break;case "video":case "audio":for(d=0;d<jb.length;d++)L(jb[d],a);break;case "source":L("error",a);break;case "img":case "image":case "link":L("error",a);L("load",a);break;case "form":L("reset",a);L("submit",a);break;case "details":L("toggle",a);break;case "input":Gc(a,c);L("invalid",a);Oe(e,"onChange");break;case "select":we(a,c);L("invalid",a);Oe(e,"onChange");break;case "textarea":ye(a,c),L("invalid",a),Oe(e,"onChange")}Le(b,
c,Ne);d=null;for(var f in c)if(c.hasOwnProperty(f)){var g=c[f];"children"===f?"string"===typeof g?a.textContent!==g&&(d=["children",g]):"number"===typeof g&&a.textContent!==""+g&&(d=["children",""+g]):ra.hasOwnProperty(f)&&null!=g&&Oe(e,f)}switch(b){case "input":cc(a);Lc(a,c);break;case "textarea":cc(a);Ae(a,c);break;case "select":case "option":break;default:"function"===typeof c.onClick&&(a.onclick=v)}return d}function Ve(a,b){return a.nodeValue!==b}
var We={createElement:Pe,createTextNode:Qe,setInitialProperties:Re,diffProperties:Se,updateProperties:Te,diffHydratedProperties:Ue,diffHydratedText:Ve,warnForUnmatchedText:function(){},warnForDeletedHydratableElement:function(){},warnForDeletedHydratableText:function(){},warnForInsertedHydratedElement:function(){},warnForInsertedHydratedText:function(){},restoreControlledState:function(a,b,c){switch(b){case "input":Jc(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;
c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Pa(d);e?void 0:A("90");dc(d);Jc(d,e)}}}break;case "textarea":ze(a,c);break;case "select":b=c.value,null!=b&&ve(a,!!c.multiple,b,!1)}}},Xe=null,Ye=null;function Ze(a,b){switch(a){case "button":case "input":case "select":case "textarea":return!!b.autoFocus}return!1}
function $e(a,b){return"textarea"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&"string"===typeof b.dangerouslySetInnerHTML.__html}var af=be,bf=ce,cf=de;function df(a){for(a=a.nextSibling;a&&1!==a.nodeType&&3!==a.nodeType;)a=a.nextSibling;return a}function ef(a){for(a=a.firstChild;a&&1!==a.nodeType&&3!==a.nodeType;)a=a.nextSibling;return a}new Set;var ff=[],gf=-1;function hf(a){return{current:a}}
function M(a){0>gf||(a.current=ff[gf],ff[gf]=null,gf--)}function N(a,b){gf++;ff[gf]=a.current;a.current=b}var jf=hf(ha),O=hf(!1),kf=ha;function lf(a){return mf(a)?kf:jf.current}
function nf(a,b){var c=a.type.contextTypes;if(!c)return ha;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function mf(a){return 2===a.tag&&null!=a.type.childContextTypes}function of(a){mf(a)&&(M(O,a),M(jf,a))}function pf(a){M(O,a);M(jf,a)}
function qf(a,b,c){jf.current!==ha?A("168"):void 0;N(jf,b,a);N(O,c,a)}function rf(a,b){var c=a.stateNode,d=a.type.childContextTypes;if("function"!==typeof c.getChildContext)return b;c=c.getChildContext();for(var e in c)e in d?void 0:A("108",tc(a)||"Unknown",e);return p({},b,c)}function sf(a){if(!mf(a))return!1;var b=a.stateNode;b=b&&b.__reactInternalMemoizedMergedChildContext||ha;kf=jf.current;N(jf,b,a);N(O,O.current,a);return!0}
function tf(a,b){var c=a.stateNode;c?void 0:A("169");if(b){var d=rf(a,kf);c.__reactInternalMemoizedMergedChildContext=d;M(O,a);M(jf,a);N(jf,d,a)}else M(O,a);N(O,b,a)}
function uf(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=null;this.index=0;this.ref=null;this.pendingProps=b;this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.effectTag=0;this.lastEffect=this.firstEffect=this.nextEffect=null;this.expirationTime=0;this.alternate=null}
function vf(a,b,c){var d=a.alternate;null===d?(d=new uf(a.tag,b,a.key,a.mode),d.type=a.type,d.stateNode=a.stateNode,d.alternate=a,a.alternate=d):(d.pendingProps=b,d.effectTag=0,d.nextEffect=null,d.firstEffect=null,d.lastEffect=null);d.expirationTime=c;d.child=a.child;d.memoizedProps=a.memoizedProps;d.memoizedState=a.memoizedState;d.updateQueue=a.updateQueue;d.sibling=a.sibling;d.index=a.index;d.ref=a.ref;return d}
function wf(a,b,c){var d=a.type,e=a.key;a=a.props;if("function"===typeof d)var f=d.prototype&&d.prototype.isReactComponent?2:0;else if("string"===typeof d)f=5;else switch(d){case hc:return xf(a.children,b,c,e);case oc:f=11;b|=3;break;case ic:f=11;b|=2;break;case jc:return d=new uf(15,a,e,b|4),d.type=jc,d.expirationTime=c,d;case qc:f=16;b|=2;break;default:a:{switch("object"===typeof d&&null!==d?d.$$typeof:null){case mc:f=13;break a;case nc:f=12;break a;case pc:f=14;break a;default:A("130",null==d?
d:typeof d,"")}f=void 0}}b=new uf(f,a,e,b);b.type=d;b.expirationTime=c;return b}function xf(a,b,c,d){a=new uf(10,a,d,b);a.expirationTime=c;return a}function yf(a,b,c){a=new uf(6,a,null,b);a.expirationTime=c;return a}function zf(a,b,c){b=new uf(4,null!==a.children?a.children:[],a.key,b);b.expirationTime=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function Af(a,b,c){b=new uf(3,null,null,b?3:0);a={current:b,containerInfo:a,pendingChildren:null,earliestPendingTime:0,latestPendingTime:0,earliestSuspendedTime:0,latestSuspendedTime:0,latestPingedTime:0,pendingCommitExpirationTime:0,finishedWork:null,context:null,pendingContext:null,hydrate:c,remainingExpirationTime:0,firstBatch:null,nextScheduledRoot:null};return b.stateNode=a}var Bf=null,Cf=null;function Df(a){return function(b){try{return a(b)}catch(c){}}}
function Ef(a){if("undefined"===typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var b=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(b.isDisabled||!b.supportsFiber)return!0;try{var c=b.inject(a);Bf=Df(function(a){return b.onCommitFiberRoot(c,a)});Cf=Df(function(a){return b.onCommitFiberUnmount(c,a)})}catch(d){}return!0}function Ff(a){"function"===typeof Bf&&Bf(a)}function Gf(a){"function"===typeof Cf&&Cf(a)}var Hf=!1;
function If(a){return{expirationTime:0,baseState:a,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function Jf(a){return{expirationTime:a.expirationTime,baseState:a.baseState,firstUpdate:a.firstUpdate,lastUpdate:a.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}
function Kf(a){return{expirationTime:a,tag:0,payload:null,callback:null,next:null,nextEffect:null}}function Lf(a,b,c){null===a.lastUpdate?a.firstUpdate=a.lastUpdate=b:(a.lastUpdate.next=b,a.lastUpdate=b);if(0===a.expirationTime||a.expirationTime>c)a.expirationTime=c}
function Mf(a,b,c){var d=a.alternate;if(null===d){var e=a.updateQueue;var f=null;null===e&&(e=a.updateQueue=If(a.memoizedState))}else e=a.updateQueue,f=d.updateQueue,null===e?null===f?(e=a.updateQueue=If(a.memoizedState),f=d.updateQueue=If(d.memoizedState)):e=a.updateQueue=Jf(f):null===f&&(f=d.updateQueue=Jf(e));null===f||e===f?Lf(e,b,c):null===e.lastUpdate||null===f.lastUpdate?(Lf(e,b,c),Lf(f,b,c)):(Lf(e,b,c),f.lastUpdate=b)}
function Nf(a,b,c){var d=a.updateQueue;d=null===d?a.updateQueue=If(a.memoizedState):Of(a,d);null===d.lastCapturedUpdate?d.firstCapturedUpdate=d.lastCapturedUpdate=b:(d.lastCapturedUpdate.next=b,d.lastCapturedUpdate=b);if(0===d.expirationTime||d.expirationTime>c)d.expirationTime=c}function Of(a,b){var c=a.alternate;null!==c&&b===c.updateQueue&&(b=a.updateQueue=Jf(b));return b}
function Pf(a,b,c,d,e,f){switch(c.tag){case 1:return a=c.payload,"function"===typeof a?a.call(f,d,e):a;case 3:a.effectTag=a.effectTag&-1025|64;case 0:a=c.payload;e="function"===typeof a?a.call(f,d,e):a;if(null===e||void 0===e)break;return p({},d,e);case 2:Hf=!0}return d}
function Qf(a,b,c,d,e){Hf=!1;if(!(0===b.expirationTime||b.expirationTime>e)){b=Of(a,b);for(var f=b.baseState,g=null,h=0,k=b.firstUpdate,n=f;null!==k;){var r=k.expirationTime;if(r>e){if(null===g&&(g=k,f=n),0===h||h>r)h=r}else n=Pf(a,b,k,n,c,d),null!==k.callback&&(a.effectTag|=32,k.nextEffect=null,null===b.lastEffect?b.firstEffect=b.lastEffect=k:(b.lastEffect.nextEffect=k,b.lastEffect=k));k=k.next}r=null;for(k=b.firstCapturedUpdate;null!==k;){var w=k.expirationTime;if(w>e){if(null===r&&(r=k,null===
g&&(f=n)),0===h||h>w)h=w}else n=Pf(a,b,k,n,c,d),null!==k.callback&&(a.effectTag|=32,k.nextEffect=null,null===b.lastCapturedEffect?b.firstCapturedEffect=b.lastCapturedEffect=k:(b.lastCapturedEffect.nextEffect=k,b.lastCapturedEffect=k));k=k.next}null===g&&(b.lastUpdate=null);null===r?b.lastCapturedUpdate=null:a.effectTag|=32;null===g&&null===r&&(f=n);b.baseState=f;b.firstUpdate=g;b.firstCapturedUpdate=r;b.expirationTime=h;a.memoizedState=n}}
function Rf(a,b){"function"!==typeof a?A("191",a):void 0;a.call(b)}
function Sf(a,b,c){null!==b.firstCapturedUpdate&&(null!==b.lastUpdate&&(b.lastUpdate.next=b.firstCapturedUpdate,b.lastUpdate=b.lastCapturedUpdate),b.firstCapturedUpdate=b.lastCapturedUpdate=null);a=b.firstEffect;for(b.firstEffect=b.lastEffect=null;null!==a;){var d=a.callback;null!==d&&(a.callback=null,Rf(d,c));a=a.nextEffect}a=b.firstCapturedEffect;for(b.firstCapturedEffect=b.lastCapturedEffect=null;null!==a;)b=a.callback,null!==b&&(a.callback=null,Rf(b,c)),a=a.nextEffect}
function Tf(a,b){return{value:a,source:b,stack:vc(b)}}var Uf=hf(null),Vf=hf(null),Wf=hf(0);function Xf(a){var b=a.type._context;N(Wf,b._changedBits,a);N(Vf,b._currentValue,a);N(Uf,a,a);b._currentValue=a.pendingProps.value;b._changedBits=a.stateNode}function Yf(a){var b=Wf.current,c=Vf.current;M(Uf,a);M(Vf,a);M(Wf,a);a=a.type._context;a._currentValue=c;a._changedBits=b}var Zf={},$f=hf(Zf),ag=hf(Zf),bg=hf(Zf);function cg(a){a===Zf?A("174"):void 0;return a}
function dg(a,b){N(bg,b,a);N(ag,a,a);N($f,Zf,a);var c=b.nodeType;switch(c){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:De(null,"");break;default:c=8===c?b.parentNode:b,b=c.namespaceURI||null,c=c.tagName,b=De(b,c)}M($f,a);N($f,b,a)}function eg(a){M($f,a);M(ag,a);M(bg,a)}function fg(a){ag.current===a&&(M($f,a),M(ag,a))}function hg(a,b,c){var d=a.memoizedState;b=b(c,d);d=null===b||void 0===b?d:p({},d,b);a.memoizedState=d;a=a.updateQueue;null!==a&&0===a.expirationTime&&(a.baseState=d)}
var lg={isMounted:function(a){return(a=a._reactInternalFiber)?2===id(a):!1},enqueueSetState:function(a,b,c){a=a._reactInternalFiber;var d=ig();d=jg(d,a);var e=Kf(d);e.payload=b;void 0!==c&&null!==c&&(e.callback=c);Mf(a,e,d);kg(a,d)},enqueueReplaceState:function(a,b,c){a=a._reactInternalFiber;var d=ig();d=jg(d,a);var e=Kf(d);e.tag=1;e.payload=b;void 0!==c&&null!==c&&(e.callback=c);Mf(a,e,d);kg(a,d)},enqueueForceUpdate:function(a,b){a=a._reactInternalFiber;var c=ig();c=jg(c,a);var d=Kf(c);d.tag=2;void 0!==
b&&null!==b&&(d.callback=b);Mf(a,d,c);kg(a,c)}};function mg(a,b,c,d,e,f){var g=a.stateNode;a=a.type;return"function"===typeof g.shouldComponentUpdate?g.shouldComponentUpdate(c,e,f):a.prototype&&a.prototype.isPureReactComponent?!ea(b,c)||!ea(d,e):!0}
function ng(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&lg.enqueueReplaceState(b,b.state,null)}
function og(a,b){var c=a.type,d=a.stateNode,e=a.pendingProps,f=lf(a);d.props=e;d.state=a.memoizedState;d.refs=ha;d.context=nf(a,f);f=a.updateQueue;null!==f&&(Qf(a,f,e,d,b),d.state=a.memoizedState);f=a.type.getDerivedStateFromProps;"function"===typeof f&&(hg(a,f,e),d.state=a.memoizedState);"function"===typeof c.getDerivedStateFromProps||"function"===typeof d.getSnapshotBeforeUpdate||"function"!==typeof d.UNSAFE_componentWillMount&&"function"!==typeof d.componentWillMount||(c=d.state,"function"===typeof d.componentWillMount&&
d.componentWillMount(),"function"===typeof d.UNSAFE_componentWillMount&&d.UNSAFE_componentWillMount(),c!==d.state&&lg.enqueueReplaceState(d,d.state,null),f=a.updateQueue,null!==f&&(Qf(a,f,e,d,b),d.state=a.memoizedState));"function"===typeof d.componentDidMount&&(a.effectTag|=4)}var pg=Array.isArray;
function qg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;var d=void 0;c&&(2!==c.tag?A("110"):void 0,d=c.stateNode);d?void 0:A("147",a);var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs===ha?d.refs={}:d.refs;null===a?delete b[e]:b[e]=a};b._stringRef=e;return b}"string"!==typeof a?A("148"):void 0;c._owner?void 0:A("254",a)}return a}
function rg(a,b){"textarea"!==a.type&&A("31","[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b,"")}
function sg(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.effectTag=8}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b,c){a=vf(a,b,c);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.effectTag=
2,c):d;b.effectTag=2;return c}function g(b){a&&null===b.alternate&&(b.effectTag=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=yf(c,a.mode,d),b.return=a,b;b=e(b,c,d);b.return=a;return b}function k(a,b,c,d){if(null!==b&&b.type===c.type)return d=e(b,c.props,d),d.ref=qg(a,b,c),d.return=a,d;d=wf(c,a.mode,d);d.ref=qg(a,b,c);d.return=a;return d}function n(a,b,c,d){if(null===b||4!==b.tag||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=
zf(c,a.mode,d),b.return=a,b;b=e(b,c.children||[],d);b.return=a;return b}function r(a,b,c,d,f){if(null===b||10!==b.tag)return b=xf(c,a.mode,d,f),b.return=a,b;b=e(b,c,d);b.return=a;return b}function w(a,b,c){if("string"===typeof b||"number"===typeof b)return b=yf(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case fc:return c=wf(b,a.mode,c),c.ref=qg(a,null,b),c.return=a,c;case gc:return b=zf(b,a.mode,c),b.return=a,b}if(pg(b)||sc(b))return b=xf(b,a.mode,c,null),b.return=
a,b;rg(a,b)}return null}function P(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case fc:return c.key===e?c.type===hc?r(a,b,c.props.children,d,e):k(a,b,c,d):null;case gc:return c.key===e?n(a,b,c,d):null}if(pg(c)||sc(c))return null!==e?null:r(a,b,c,d,null);rg(a,c)}return null}function kc(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);
if("object"===typeof d&&null!==d){switch(d.$$typeof){case fc:return a=a.get(null===d.key?c:d.key)||null,d.type===hc?r(b,a,d.props.children,e,d.key):k(b,a,d,e);case gc:return a=a.get(null===d.key?c:d.key)||null,n(b,a,d,e)}if(pg(d)||sc(d))return a=a.get(c)||null,r(b,a,d,e,null);rg(b,d)}return null}function Hd(e,g,h,k){for(var u=null,x=null,t=g,q=g=0,n=null;null!==t&&q<h.length;q++){t.index>q?(n=t,t=null):n=t.sibling;var l=P(e,t,h[q],k);if(null===l){null===t&&(t=n);break}a&&t&&null===l.alternate&&b(e,
t);g=f(l,g,q);null===x?u=l:x.sibling=l;x=l;t=n}if(q===h.length)return c(e,t),u;if(null===t){for(;q<h.length;q++)if(t=w(e,h[q],k))g=f(t,g,q),null===x?u=t:x.sibling=t,x=t;return u}for(t=d(e,t);q<h.length;q++)if(n=kc(t,e,q,h[q],k))a&&null!==n.alternate&&t.delete(null===n.key?q:n.key),g=f(n,g,q),null===x?u=n:x.sibling=n,x=n;a&&t.forEach(function(a){return b(e,a)});return u}function E(e,g,h,k){var t=sc(h);"function"!==typeof t?A("150"):void 0;h=t.call(h);null==h?A("151"):void 0;for(var u=t=null,n=g,x=
g=0,y=null,l=h.next();null!==n&&!l.done;x++,l=h.next()){n.index>x?(y=n,n=null):y=n.sibling;var r=P(e,n,l.value,k);if(null===r){n||(n=y);break}a&&n&&null===r.alternate&&b(e,n);g=f(r,g,x);null===u?t=r:u.sibling=r;u=r;n=y}if(l.done)return c(e,n),t;if(null===n){for(;!l.done;x++,l=h.next())l=w(e,l.value,k),null!==l&&(g=f(l,g,x),null===u?t=l:u.sibling=l,u=l);return t}for(n=d(e,n);!l.done;x++,l=h.next())l=kc(n,e,x,l.value,k),null!==l&&(a&&null!==l.alternate&&n.delete(null===l.key?x:l.key),g=f(l,g,x),null===
u?t=l:u.sibling=l,u=l);a&&n.forEach(function(a){return b(e,a)});return t}return function(a,d,f,h){"object"===typeof f&&null!==f&&f.type===hc&&null===f.key&&(f=f.props.children);var k="object"===typeof f&&null!==f;if(k)switch(f.$$typeof){case fc:a:{var n=f.key;for(k=d;null!==k;){if(k.key===n)if(10===k.tag?f.type===hc:k.type===f.type){c(a,k.sibling);d=e(k,f.type===hc?f.props.children:f.props,h);d.ref=qg(a,k,f);d.return=a;a=d;break a}else{c(a,k);break}else b(a,k);k=k.sibling}f.type===hc?(d=xf(f.props.children,
a.mode,h,f.key),d.return=a,a=d):(h=wf(f,a.mode,h),h.ref=qg(a,d,f),h.return=a,a=h)}return g(a);case gc:a:{for(k=f.key;null!==d;){if(d.key===k)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[],h);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling}d=zf(f,a.mode,h);d.return=a;a=d}return g(a)}if("string"===typeof f||"number"===typeof f)return f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f,h),d.return=
a,a=d):(c(a,d),d=yf(f,a.mode,h),d.return=a,a=d),g(a);if(pg(f))return Hd(a,d,f,h);if(sc(f))return E(a,d,f,h);k&&rg(a,f);if("undefined"===typeof f)switch(a.tag){case 2:case 1:h=a.type,A("152",h.displayName||h.name||"Component")}return c(a,d)}}var tg=sg(!0),ug=sg(!1),vg=null,wg=null,xg=!1;function yg(a,b){var c=new uf(5,null,null,0);c.type="DELETED";c.stateNode=b;c.return=a;c.effectTag=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c}
function zg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,!0):!1;default:return!1}}function Ag(a){if(xg){var b=wg;if(b){var c=b;if(!zg(a,b)){b=df(c);if(!b||!zg(a,b)){a.effectTag|=2;xg=!1;vg=a;return}yg(vg,c)}vg=a;wg=ef(b)}else a.effectTag|=2,xg=!1,vg=a}}
function Bg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag;)a=a.return;vg=a}function Cg(a){if(a!==vg)return!1;if(!xg)return Bg(a),xg=!0,!1;var b=a.type;if(5!==a.tag||"head"!==b&&"body"!==b&&!$e(b,a.memoizedProps))for(b=wg;b;)yg(a,b),b=df(b);Bg(a);wg=vg?df(a.stateNode):null;return!0}function Dg(){wg=vg=null;xg=!1}function Q(a,b,c){Eg(a,b,c,b.expirationTime)}function Eg(a,b,c,d){b.child=null===a?ug(b,null,c,d):tg(b,a.child,c,d)}
function Fg(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.effectTag|=128}function Gg(a,b,c,d,e){Fg(a,b);var f=0!==(b.effectTag&64);if(!c&&!f)return d&&tf(b,!1),R(a,b);c=b.stateNode;ec.current=b;var g=f?null:c.render();b.effectTag|=1;f&&(Eg(a,b,null,e),b.child=null);Eg(a,b,g,e);b.memoizedState=c.state;b.memoizedProps=c.props;d&&tf(b,!0);return b.child}
function Hg(a){var b=a.stateNode;b.pendingContext?qf(a,b.pendingContext,b.pendingContext!==b.context):b.context&&qf(a,b.context,!1);dg(a,b.containerInfo)}
function Ig(a,b,c,d){var e=a.child;null!==e&&(e.return=a);for(;null!==e;){switch(e.tag){case 12:var f=e.stateNode|0;if(e.type===b&&0!==(f&c)){for(f=e;null!==f;){var g=f.alternate;if(0===f.expirationTime||f.expirationTime>d)f.expirationTime=d,null!==g&&(0===g.expirationTime||g.expirationTime>d)&&(g.expirationTime=d);else if(null!==g&&(0===g.expirationTime||g.expirationTime>d))g.expirationTime=d;else break;f=f.return}f=null}else f=e.child;break;case 13:f=e.type===a.type?null:e.child;break;default:f=
e.child}if(null!==f)f.return=e;else for(f=e;null!==f;){if(f===a){f=null;break}e=f.sibling;if(null!==e){e.return=f.return;f=e;break}f=f.return}e=f}}
function Jg(a,b,c){var d=b.type._context,e=b.pendingProps,f=b.memoizedProps,g=!0;if(O.current)g=!1;else if(f===e)return b.stateNode=0,Xf(b),R(a,b);var h=e.value;b.memoizedProps=e;if(null===f)h=1073741823;else if(f.value===e.value){if(f.children===e.children&&g)return b.stateNode=0,Xf(b),R(a,b);h=0}else{var k=f.value;if(k===h&&(0!==k||1/k===1/h)||k!==k&&h!==h){if(f.children===e.children&&g)return b.stateNode=0,Xf(b),R(a,b);h=0}else if(h="function"===typeof d._calculateChangedBits?d._calculateChangedBits(k,
h):1073741823,h|=0,0===h){if(f.children===e.children&&g)return b.stateNode=0,Xf(b),R(a,b)}else Ig(b,d,h,c)}b.stateNode=h;Xf(b);Q(a,b,e.children);return b.child}function R(a,b){null!==a&&b.child!==a.child?A("153"):void 0;if(null!==b.child){a=b.child;var c=vf(a,a.pendingProps,a.expirationTime);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=vf(a,a.pendingProps,a.expirationTime),c.return=b;c.sibling=null}return b.child}
function Kg(a,b,c){if(0===b.expirationTime||b.expirationTime>c){switch(b.tag){case 3:Hg(b);break;case 2:sf(b);break;case 4:dg(b,b.stateNode.containerInfo);break;case 13:Xf(b)}return null}switch(b.tag){case 0:null!==a?A("155"):void 0;var d=b.type,e=b.pendingProps,f=lf(b);f=nf(b,f);d=d(e,f);b.effectTag|=1;"object"===typeof d&&null!==d&&"function"===typeof d.render&&void 0===d.$$typeof?(f=b.type,b.tag=2,b.memoizedState=null!==d.state&&void 0!==d.state?d.state:null,f=f.getDerivedStateFromProps,"function"===
typeof f&&hg(b,f,e),e=sf(b),d.updater=lg,b.stateNode=d,d._reactInternalFiber=b,og(b,c),a=Gg(a,b,!0,e,c)):(b.tag=1,Q(a,b,d),b.memoizedProps=e,a=b.child);return a;case 1:return e=b.type,c=b.pendingProps,O.current||b.memoizedProps!==c?(d=lf(b),d=nf(b,d),e=e(c,d),b.effectTag|=1,Q(a,b,e),b.memoizedProps=c,a=b.child):a=R(a,b),a;case 2:e=sf(b);if(null===a)if(null===b.stateNode){var g=b.pendingProps,h=b.type;d=lf(b);var k=2===b.tag&&null!=b.type.contextTypes;f=k?nf(b,d):ha;g=new h(g,f);b.memoizedState=null!==
g.state&&void 0!==g.state?g.state:null;g.updater=lg;b.stateNode=g;g._reactInternalFiber=b;k&&(k=b.stateNode,k.__reactInternalMemoizedUnmaskedChildContext=d,k.__reactInternalMemoizedMaskedChildContext=f);og(b,c);d=!0}else{h=b.type;d=b.stateNode;k=b.memoizedProps;f=b.pendingProps;d.props=k;var n=d.context;g=lf(b);g=nf(b,g);var r=h.getDerivedStateFromProps;(h="function"===typeof r||"function"===typeof d.getSnapshotBeforeUpdate)||"function"!==typeof d.UNSAFE_componentWillReceiveProps&&"function"!==typeof d.componentWillReceiveProps||
(k!==f||n!==g)&&ng(b,d,f,g);Hf=!1;var w=b.memoizedState;n=d.state=w;var P=b.updateQueue;null!==P&&(Qf(b,P,f,d,c),n=b.memoizedState);k!==f||w!==n||O.current||Hf?("function"===typeof r&&(hg(b,r,f),n=b.memoizedState),(k=Hf||mg(b,k,f,w,n,g))?(h||"function"!==typeof d.UNSAFE_componentWillMount&&"function"!==typeof d.componentWillMount||("function"===typeof d.componentWillMount&&d.componentWillMount(),"function"===typeof d.UNSAFE_componentWillMount&&d.UNSAFE_componentWillMount()),"function"===typeof d.componentDidMount&&
(b.effectTag|=4)):("function"===typeof d.componentDidMount&&(b.effectTag|=4),b.memoizedProps=f,b.memoizedState=n),d.props=f,d.state=n,d.context=g,d=k):("function"===typeof d.componentDidMount&&(b.effectTag|=4),d=!1)}else h=b.type,d=b.stateNode,f=b.memoizedProps,k=b.pendingProps,d.props=f,n=d.context,g=lf(b),g=nf(b,g),r=h.getDerivedStateFromProps,(h="function"===typeof r||"function"===typeof d.getSnapshotBeforeUpdate)||"function"!==typeof d.UNSAFE_componentWillReceiveProps&&"function"!==typeof d.componentWillReceiveProps||
(f!==k||n!==g)&&ng(b,d,k,g),Hf=!1,n=b.memoizedState,w=d.state=n,P=b.updateQueue,null!==P&&(Qf(b,P,k,d,c),w=b.memoizedState),f!==k||n!==w||O.current||Hf?("function"===typeof r&&(hg(b,r,k),w=b.memoizedState),(r=Hf||mg(b,f,k,n,w,g))?(h||"function"!==typeof d.UNSAFE_componentWillUpdate&&"function"!==typeof d.componentWillUpdate||("function"===typeof d.componentWillUpdate&&d.componentWillUpdate(k,w,g),"function"===typeof d.UNSAFE_componentWillUpdate&&d.UNSAFE_componentWillUpdate(k,w,g)),"function"===typeof d.componentDidUpdate&&
(b.effectTag|=4),"function"===typeof d.getSnapshotBeforeUpdate&&(b.effectTag|=256)):("function"!==typeof d.componentDidUpdate||f===a.memoizedProps&&n===a.memoizedState||(b.effectTag|=4),"function"!==typeof d.getSnapshotBeforeUpdate||f===a.memoizedProps&&n===a.memoizedState||(b.effectTag|=256),b.memoizedProps=k,b.memoizedState=w),d.props=k,d.state=w,d.context=g,d=r):("function"!==typeof d.componentDidUpdate||f===a.memoizedProps&&n===a.memoizedState||(b.effectTag|=4),"function"!==typeof d.getSnapshotBeforeUpdate||
f===a.memoizedProps&&n===a.memoizedState||(b.effectTag|=256),d=!1);return Gg(a,b,d,e,c);case 3:Hg(b);e=b.updateQueue;if(null!==e)if(d=b.memoizedState,d=null!==d?d.element:null,Qf(b,e,b.pendingProps,null,c),e=b.memoizedState.element,e===d)Dg(),a=R(a,b);else{d=b.stateNode;if(d=(null===a||null===a.child)&&d.hydrate)wg=ef(b.stateNode.containerInfo),vg=b,d=xg=!0;d?(b.effectTag|=2,b.child=ug(b,null,e,c)):(Dg(),Q(a,b,e));a=b.child}else Dg(),a=R(a,b);return a;case 5:a:{cg(bg.current);e=cg($f.current);d=De(e,
b.type);e!==d&&(N(ag,b,b),N($f,d,b));null===a&&Ag(b);e=b.type;k=b.memoizedProps;d=b.pendingProps;f=null!==a?a.memoizedProps:null;if(!O.current&&k===d){if(k=b.mode&1&&!!d.hidden)b.expirationTime=1073741823;if(!k||1073741823!==c){a=R(a,b);break a}}k=d.children;$e(e,d)?k=null:f&&$e(e,f)&&(b.effectTag|=16);Fg(a,b);1073741823!==c&&b.mode&1&&d.hidden?(b.expirationTime=1073741823,b.memoizedProps=d,a=null):(Q(a,b,k),b.memoizedProps=d,a=b.child)}return a;case 6:return null===a&&Ag(b),b.memoizedProps=b.pendingProps,
null;case 16:return null;case 4:return dg(b,b.stateNode.containerInfo),e=b.pendingProps,O.current||b.memoizedProps!==e?(null===a?b.child=tg(b,null,e,c):Q(a,b,e),b.memoizedProps=e,a=b.child):a=R(a,b),a;case 14:return e=b.type.render,c=b.pendingProps,d=b.ref,O.current||b.memoizedProps!==c||d!==(null!==a?a.ref:null)?(e=e(c,d),Q(a,b,e),b.memoizedProps=c,a=b.child):a=R(a,b),a;case 10:return c=b.pendingProps,O.current||b.memoizedProps!==c?(Q(a,b,c),b.memoizedProps=c,a=b.child):a=R(a,b),a;case 11:return c=
b.pendingProps.children,O.current||null!==c&&b.memoizedProps!==c?(Q(a,b,c),b.memoizedProps=c,a=b.child):a=R(a,b),a;case 15:return c=b.pendingProps,b.memoizedProps===c?a=R(a,b):(Q(a,b,c.children),b.memoizedProps=c,a=b.child),a;case 13:return Jg(a,b,c);case 12:a:if(d=b.type,f=b.pendingProps,k=b.memoizedProps,e=d._currentValue,g=d._changedBits,O.current||0!==g||k!==f){b.memoizedProps=f;h=f.unstable_observedBits;if(void 0===h||null===h)h=1073741823;b.stateNode=h;if(0!==(g&h))Ig(b,d,g,c);else if(k===f){a=
R(a,b);break a}c=f.children;c=c(e);b.effectTag|=1;Q(a,b,c);a=b.child}else a=R(a,b);return a;default:A("156")}}function Lg(a){a.effectTag|=4}var Pg=void 0,Qg=void 0,Rg=void 0;Pg=function(){};Qg=function(a,b,c){(b.updateQueue=c)&&Lg(b)};Rg=function(a,b,c,d){c!==d&&Lg(b)};
function Sg(a,b){var c=b.pendingProps;switch(b.tag){case 1:return null;case 2:return of(b),null;case 3:eg(b);pf(b);var d=b.stateNode;d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Cg(b),b.effectTag&=-3;Pg(b);return null;case 5:fg(b);d=cg(bg.current);var e=b.type;if(null!==a&&null!=b.stateNode){var f=a.memoizedProps,g=b.stateNode,h=cg($f.current);g=Se(g,e,f,c,d);Qg(a,b,g,e,f,c,d,h);a.ref!==b.ref&&(b.effectTag|=128)}else{if(!c)return null===b.stateNode?
A("166"):void 0,null;a=cg($f.current);if(Cg(b))c=b.stateNode,e=b.type,f=b.memoizedProps,c[C]=b,c[Ma]=f,d=Ue(c,e,f,a,d),b.updateQueue=d,null!==d&&Lg(b);else{a=Pe(e,c,d,a);a[C]=b;a[Ma]=c;a:for(f=b.child;null!==f;){if(5===f.tag||6===f.tag)a.appendChild(f.stateNode);else if(4!==f.tag&&null!==f.child){f.child.return=f;f=f.child;continue}if(f===b)break;for(;null===f.sibling;){if(null===f.return||f.return===b)break a;f=f.return}f.sibling.return=f.return;f=f.sibling}Re(a,e,c,d);Ze(e,c)&&Lg(b);b.stateNode=
a}null!==b.ref&&(b.effectTag|=128)}return null;case 6:if(a&&null!=b.stateNode)Rg(a,b,a.memoizedProps,c);else{if("string"!==typeof c)return null===b.stateNode?A("166"):void 0,null;d=cg(bg.current);cg($f.current);Cg(b)?(d=b.stateNode,c=b.memoizedProps,d[C]=b,Ve(d,c)&&Lg(b)):(d=Qe(c,d),d[C]=b,b.stateNode=d)}return null;case 14:return null;case 16:return null;case 10:return null;case 11:return null;case 15:return null;case 4:return eg(b),Pg(b),null;case 13:return Yf(b),null;case 12:return null;case 0:A("167");
default:A("156")}}function Tg(a,b){var c=b.source;null===b.stack&&null!==c&&vc(c);null!==c&&tc(c);b=b.value;null!==a&&2===a.tag&&tc(a);try{b&&b.suppressReactErrorLogging||console.error(b)}catch(d){d&&d.suppressReactErrorLogging||console.error(d)}}function Ug(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null)}catch(c){Vg(a,c)}else b.current=null}
function Wg(a){"function"===typeof Gf&&Gf(a);switch(a.tag){case 2:Ug(a);var b=a.stateNode;if("function"===typeof b.componentWillUnmount)try{b.props=a.memoizedProps,b.state=a.memoizedState,b.componentWillUnmount()}catch(c){Vg(a,c)}break;case 5:Ug(a);break;case 4:Xg(a)}}function Yg(a){return 5===a.tag||3===a.tag||4===a.tag}
function Zg(a){a:{for(var b=a.return;null!==b;){if(Yg(b)){var c=b;break a}b=b.return}A("160");c=void 0}var d=b=void 0;switch(c.tag){case 5:b=c.stateNode;d=!1;break;case 3:b=c.stateNode.containerInfo;d=!0;break;case 4:b=c.stateNode.containerInfo;d=!0;break;default:A("161")}c.effectTag&16&&(Ge(b,""),c.effectTag&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||Yg(c.return)){c=null;break a}c=c.return}c.sibling.return=c.return;for(c=c.sibling;5!==c.tag&&6!==c.tag;){if(c.effectTag&2)continue b;
if(null===c.child||4===c.tag)continue b;else c.child.return=c,c=c.child}if(!(c.effectTag&2)){c=c.stateNode;break a}}for(var e=a;;){if(5===e.tag||6===e.tag)if(c)if(d){var f=b,g=e.stateNode,h=c;8===f.nodeType?f.parentNode.insertBefore(g,h):f.insertBefore(g,h)}else b.insertBefore(e.stateNode,c);else d?(f=b,g=e.stateNode,8===f.nodeType?f.parentNode.insertBefore(g,f):f.appendChild(g)):b.appendChild(e.stateNode);else if(4!==e.tag&&null!==e.child){e.child.return=e;e=e.child;continue}if(e===a)break;for(;null===
e.sibling;){if(null===e.return||e.return===a)return;e=e.return}e.sibling.return=e.return;e=e.sibling}}
function Xg(a){for(var b=a,c=!1,d=void 0,e=void 0;;){if(!c){c=b.return;a:for(;;){null===c?A("160"):void 0;switch(c.tag){case 5:d=c.stateNode;e=!1;break a;case 3:d=c.stateNode.containerInfo;e=!0;break a;case 4:d=c.stateNode.containerInfo;e=!0;break a}c=c.return}c=!0}if(5===b.tag||6===b.tag){a:for(var f=b,g=f;;)if(Wg(g),null!==g.child&&4!==g.tag)g.child.return=g,g=g.child;else{if(g===f)break;for(;null===g.sibling;){if(null===g.return||g.return===f)break a;g=g.return}g.sibling.return=g.return;g=g.sibling}e?
(f=d,g=b.stateNode,8===f.nodeType?f.parentNode.removeChild(g):f.removeChild(g)):d.removeChild(b.stateNode)}else if(4===b.tag?d=b.stateNode.containerInfo:Wg(b),null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return;b=b.return;4===b.tag&&(c=!1)}b.sibling.return=b.return;b=b.sibling}}
function $g(a,b){switch(b.tag){case 2:break;case 5:var c=b.stateNode;if(null!=c){var d=b.memoizedProps;a=null!==a?a.memoizedProps:d;var e=b.type,f=b.updateQueue;b.updateQueue=null;null!==f&&(c[Ma]=d,Te(c,f,e,a,d))}break;case 6:null===b.stateNode?A("162"):void 0;b.stateNode.nodeValue=b.memoizedProps;break;case 3:break;case 15:break;case 16:break;default:A("163")}}function ah(a,b,c){c=Kf(c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){bh(d);Tg(a,b)};return c}
function ch(a,b,c){c=Kf(c);c.tag=3;var d=a.stateNode;null!==d&&"function"===typeof d.componentDidCatch&&(c.callback=function(){null===dh?dh=new Set([this]):dh.add(this);var c=b.value,d=b.stack;Tg(a,b);this.componentDidCatch(c,{componentStack:null!==d?d:""})});return c}
function eh(a,b,c,d,e,f){c.effectTag|=512;c.firstEffect=c.lastEffect=null;d=Tf(d,c);a=b;do{switch(a.tag){case 3:a.effectTag|=1024;d=ah(a,d,f);Nf(a,d,f);return;case 2:if(b=d,c=a.stateNode,0===(a.effectTag&64)&&null!==c&&"function"===typeof c.componentDidCatch&&(null===dh||!dh.has(c))){a.effectTag|=1024;d=ch(a,b,f);Nf(a,d,f);return}}a=a.return}while(null!==a)}
function fh(a){switch(a.tag){case 2:of(a);var b=a.effectTag;return b&1024?(a.effectTag=b&-1025|64,a):null;case 3:return eg(a),pf(a),b=a.effectTag,b&1024?(a.effectTag=b&-1025|64,a):null;case 5:return fg(a),null;case 16:return b=a.effectTag,b&1024?(a.effectTag=b&-1025|64,a):null;case 4:return eg(a),null;case 13:return Yf(a),null;default:return null}}var gh=af(),hh=2,ih=gh,jh=0,kh=0,lh=!1,S=null,mh=null,T=0,nh=-1,oh=!1,U=null,ph=!1,qh=!1,dh=null;
function rh(){if(null!==S)for(var a=S.return;null!==a;){var b=a;switch(b.tag){case 2:of(b);break;case 3:eg(b);pf(b);break;case 5:fg(b);break;case 4:eg(b);break;case 13:Yf(b)}a=a.return}mh=null;T=0;nh=-1;oh=!1;S=null;qh=!1}
function sh(a){for(;;){var b=a.alternate,c=a.return,d=a.sibling;if(0===(a.effectTag&512)){b=Sg(b,a,T);var e=a;if(1073741823===T||1073741823!==e.expirationTime){var f=0;switch(e.tag){case 3:case 2:var g=e.updateQueue;null!==g&&(f=g.expirationTime)}for(g=e.child;null!==g;)0!==g.expirationTime&&(0===f||f>g.expirationTime)&&(f=g.expirationTime),g=g.sibling;e.expirationTime=f}if(null!==b)return b;null!==c&&0===(c.effectTag&512)&&(null===c.firstEffect&&(c.firstEffect=a.firstEffect),null!==a.lastEffect&&
(null!==c.lastEffect&&(c.lastEffect.nextEffect=a.firstEffect),c.lastEffect=a.lastEffect),1<a.effectTag&&(null!==c.lastEffect?c.lastEffect.nextEffect=a:c.firstEffect=a,c.lastEffect=a));if(null!==d)return d;if(null!==c)a=c;else{qh=!0;break}}else{a=fh(a,oh,T);if(null!==a)return a.effectTag&=511,a;null!==c&&(c.firstEffect=c.lastEffect=null,c.effectTag|=512);if(null!==d)return d;if(null!==c)a=c;else break}}return null}
function th(a){var b=Kg(a.alternate,a,T);null===b&&(b=sh(a));ec.current=null;return b}
function uh(a,b,c){lh?A("243"):void 0;lh=!0;if(b!==T||a!==mh||null===S)rh(),mh=a,T=b,nh=-1,S=vf(mh.current,null,T),a.pendingCommitExpirationTime=0;var d=!1;oh=!c||T<=hh;do{try{if(c)for(;null!==S&&!vh();)S=th(S);else for(;null!==S;)S=th(S)}catch(f){if(null===S)d=!0,bh(f);else{null===S?A("271"):void 0;c=S;var e=c.return;if(null===e){d=!0;bh(f);break}eh(a,e,c,f,oh,T,ih);S=sh(c)}}break}while(1);lh=!1;if(d)return null;if(null===S){if(qh)return a.pendingCommitExpirationTime=b,a.current.alternate;oh?A("262"):
void 0;0<=nh&&setTimeout(function(){var b=a.current.expirationTime;0!==b&&(0===a.remainingExpirationTime||a.remainingExpirationTime<b)&&wh(a,b)},nh);xh(a.current.expirationTime)}return null}
function Vg(a,b){var c;a:{lh&&!ph?A("263"):void 0;for(c=a.return;null!==c;){switch(c.tag){case 2:var d=c.stateNode;if("function"===typeof c.type.getDerivedStateFromCatch||"function"===typeof d.componentDidCatch&&(null===dh||!dh.has(d))){a=Tf(b,a);a=ch(c,a,1);Mf(c,a,1);kg(c,1);c=void 0;break a}break;case 3:a=Tf(b,a);a=ah(c,a,1);Mf(c,a,1);kg(c,1);c=void 0;break a}c=c.return}3===a.tag&&(c=Tf(b,a),c=ah(a,c,1),Mf(a,c,1),kg(a,1));c=void 0}return c}
function yh(){var a=2+25*(((ig()-2+500)/25|0)+1);a<=jh&&(a=jh+1);return jh=a}function jg(a,b){a=0!==kh?kh:lh?ph?1:T:b.mode&1?zh?2+10*(((a-2+15)/10|0)+1):2+25*(((a-2+500)/25|0)+1):1;zh&&(0===Ah||a>Ah)&&(Ah=a);return a}
function kg(a,b){for(;null!==a;){if(0===a.expirationTime||a.expirationTime>b)a.expirationTime=b;null!==a.alternate&&(0===a.alternate.expirationTime||a.alternate.expirationTime>b)&&(a.alternate.expirationTime=b);if(null===a.return)if(3===a.tag){var c=a.stateNode;!lh&&0!==T&&b<T&&rh();var d=c.current.expirationTime;lh&&!ph&&mh===c||wh(c,d);Bh>Ch&&A("185")}else break;a=a.return}}function ig(){ih=af()-gh;return hh=(ih/10|0)+2}
function Dh(a){var b=kh;kh=2+25*(((ig()-2+500)/25|0)+1);try{return a()}finally{kh=b}}function Eh(a,b,c,d,e){var f=kh;kh=1;try{return a(b,c,d,e)}finally{kh=f}}var Fh=null,V=null,Gh=0,Hh=-1,W=!1,X=null,Y=0,Ah=0,Ih=!1,Jh=!1,Kh=null,Lh=null,Z=!1,Mh=!1,zh=!1,Nh=null,Ch=1E3,Bh=0,Oh=1;function Ph(a){if(0!==Gh){if(a>Gh)return;cf(Hh)}var b=af()-gh;Gh=a;Hh=bf(Qh,{timeout:10*(a-2)-b})}
function wh(a,b){if(null===a.nextScheduledRoot)a.remainingExpirationTime=b,null===V?(Fh=V=a,a.nextScheduledRoot=a):(V=V.nextScheduledRoot=a,V.nextScheduledRoot=Fh);else{var c=a.remainingExpirationTime;if(0===c||b<c)a.remainingExpirationTime=b}W||(Z?Mh&&(X=a,Y=1,Rh(a,1,!1)):1===b?Sh():Ph(b))}
function Th(){var a=0,b=null;if(null!==V)for(var c=V,d=Fh;null!==d;){var e=d.remainingExpirationTime;if(0===e){null===c||null===V?A("244"):void 0;if(d===d.nextScheduledRoot){Fh=V=d.nextScheduledRoot=null;break}else if(d===Fh)Fh=e=d.nextScheduledRoot,V.nextScheduledRoot=e,d.nextScheduledRoot=null;else if(d===V){V=c;V.nextScheduledRoot=Fh;d.nextScheduledRoot=null;break}else c.nextScheduledRoot=d.nextScheduledRoot,d.nextScheduledRoot=null;d=c.nextScheduledRoot}else{if(0===a||e<a)a=e,b=d;if(d===V)break;
c=d;d=d.nextScheduledRoot}}c=X;null!==c&&c===b&&1===a?Bh++:Bh=0;X=b;Y=a}function Qh(a){Uh(0,!0,a)}function Sh(){Uh(1,!1,null)}function Uh(a,b,c){Lh=c;Th();if(b)for(;null!==X&&0!==Y&&(0===a||a>=Y)&&(!Ih||ig()>=Y);)ig(),Rh(X,Y,!Ih),Th();else for(;null!==X&&0!==Y&&(0===a||a>=Y);)Rh(X,Y,!1),Th();null!==Lh&&(Gh=0,Hh=-1);0!==Y&&Ph(Y);Lh=null;Ih=!1;Vh()}function Wh(a,b){W?A("253"):void 0;X=a;Y=b;Rh(a,b,!1);Sh();Vh()}
function Vh(){Bh=0;if(null!==Nh){var a=Nh;Nh=null;for(var b=0;b<a.length;b++){var c=a[b];try{c._onComplete()}catch(d){Jh||(Jh=!0,Kh=d)}}}if(Jh)throw a=Kh,Kh=null,Jh=!1,a;}function Rh(a,b,c){W?A("245"):void 0;W=!0;c?(c=a.finishedWork,null!==c?Xh(a,c,b):(a.finishedWork=null,c=uh(a,b,!0),null!==c&&(vh()?a.finishedWork=c:Xh(a,c,b)))):(c=a.finishedWork,null!==c?Xh(a,c,b):(a.finishedWork=null,c=uh(a,b,!1),null!==c&&Xh(a,c,b)));W=!1}
function Xh(a,b,c){var d=a.firstBatch;if(null!==d&&d._expirationTime<=c&&(null===Nh?Nh=[d]:Nh.push(d),d._defer)){a.finishedWork=b;a.remainingExpirationTime=0;return}a.finishedWork=null;ph=lh=!0;c=b.stateNode;c.current===b?A("177"):void 0;d=c.pendingCommitExpirationTime;0===d?A("261"):void 0;c.pendingCommitExpirationTime=0;ig();ec.current=null;if(1<b.effectTag)if(null!==b.lastEffect){b.lastEffect.nextEffect=b;var e=b.firstEffect}else e=b;else e=b.firstEffect;Xe=Gd;var f=da();if(Td(f)){if("selectionStart"in
f)var g={start:f.selectionStart,end:f.selectionEnd};else a:{var h=window.getSelection&&window.getSelection();if(h&&0!==h.rangeCount){g=h.anchorNode;var k=h.anchorOffset,n=h.focusNode;h=h.focusOffset;try{g.nodeType,n.nodeType}catch(Wa){g=null;break a}var r=0,w=-1,P=-1,kc=0,Hd=0,E=f,t=null;b:for(;;){for(var x;;){E!==g||0!==k&&3!==E.nodeType||(w=r+k);E!==n||0!==h&&3!==E.nodeType||(P=r+h);3===E.nodeType&&(r+=E.nodeValue.length);if(null===(x=E.firstChild))break;t=E;E=x}for(;;){if(E===f)break b;t===g&&
++kc===k&&(w=r);t===n&&++Hd===h&&(P=r);if(null!==(x=E.nextSibling))break;E=t;t=E.parentNode}E=x}g=-1===w||-1===P?null:{start:w,end:P}}else g=null}g=g||{start:0,end:0}}else g=null;Ye={focusedElem:f,selectionRange:g};Id(!1);for(U=e;null!==U;){f=!1;g=void 0;try{for(;null!==U;){if(U.effectTag&256){var u=U.alternate;k=U;switch(k.tag){case 2:if(k.effectTag&256&&null!==u){var y=u.memoizedProps,D=u.memoizedState,ja=k.stateNode;ja.props=k.memoizedProps;ja.state=k.memoizedState;var hi=ja.getSnapshotBeforeUpdate(y,
D);ja.__reactInternalSnapshotBeforeUpdate=hi}break;case 3:case 5:case 6:case 4:break;default:A("163")}}U=U.nextEffect}}catch(Wa){f=!0,g=Wa}f&&(null===U?A("178"):void 0,Vg(U,g),null!==U&&(U=U.nextEffect))}for(U=e;null!==U;){u=!1;y=void 0;try{for(;null!==U;){var q=U.effectTag;q&16&&Ge(U.stateNode,"");if(q&128){var z=U.alternate;if(null!==z){var l=z.ref;null!==l&&("function"===typeof l?l(null):l.current=null)}}switch(q&14){case 2:Zg(U);U.effectTag&=-3;break;case 6:Zg(U);U.effectTag&=-3;$g(U.alternate,
U);break;case 4:$g(U.alternate,U);break;case 8:D=U,Xg(D),D.return=null,D.child=null,D.alternate&&(D.alternate.child=null,D.alternate.return=null)}U=U.nextEffect}}catch(Wa){u=!0,y=Wa}u&&(null===U?A("178"):void 0,Vg(U,y),null!==U&&(U=U.nextEffect))}l=Ye;z=da();q=l.focusedElem;u=l.selectionRange;if(z!==q&&fa(document.documentElement,q)){Td(q)&&(z=u.start,l=u.end,void 0===l&&(l=z),"selectionStart"in q?(q.selectionStart=z,q.selectionEnd=Math.min(l,q.value.length)):window.getSelection&&(z=window.getSelection(),
y=q[lb()].length,l=Math.min(u.start,y),u=void 0===u.end?l:Math.min(u.end,y),!z.extend&&l>u&&(y=u,u=l,l=y),y=Sd(q,l),D=Sd(q,u),y&&D&&(1!==z.rangeCount||z.anchorNode!==y.node||z.anchorOffset!==y.offset||z.focusNode!==D.node||z.focusOffset!==D.offset)&&(ja=document.createRange(),ja.setStart(y.node,y.offset),z.removeAllRanges(),l>u?(z.addRange(ja),z.extend(D.node,D.offset)):(ja.setEnd(D.node,D.offset),z.addRange(ja)))));z=[];for(l=q;l=l.parentNode;)1===l.nodeType&&z.push({element:l,left:l.scrollLeft,
top:l.scrollTop});q.focus();for(q=0;q<z.length;q++)l=z[q],l.element.scrollLeft=l.left,l.element.scrollTop=l.top}Ye=null;Id(Xe);Xe=null;c.current=b;for(U=e;null!==U;){e=!1;q=void 0;try{for(z=d;null!==U;){var gg=U.effectTag;if(gg&36){var lc=U.alternate;l=U;u=z;switch(l.tag){case 2:var ba=l.stateNode;if(l.effectTag&4)if(null===lc)ba.props=l.memoizedProps,ba.state=l.memoizedState,ba.componentDidMount();else{var ri=lc.memoizedProps,si=lc.memoizedState;ba.props=l.memoizedProps;ba.state=l.memoizedState;
ba.componentDidUpdate(ri,si,ba.__reactInternalSnapshotBeforeUpdate)}var Mg=l.updateQueue;null!==Mg&&(ba.props=l.memoizedProps,ba.state=l.memoizedState,Sf(l,Mg,ba,u));break;case 3:var Ng=l.updateQueue;if(null!==Ng){y=null;if(null!==l.child)switch(l.child.tag){case 5:y=l.child.stateNode;break;case 2:y=l.child.stateNode}Sf(l,Ng,y,u)}break;case 5:var ti=l.stateNode;null===lc&&l.effectTag&4&&Ze(l.type,l.memoizedProps)&&ti.focus();break;case 6:break;case 4:break;case 15:break;case 16:break;default:A("163")}}if(gg&
128){l=void 0;var uc=U.ref;if(null!==uc){var Og=U.stateNode;switch(U.tag){case 5:l=Og;break;default:l=Og}"function"===typeof uc?uc(l):uc.current=l}}var ui=U.nextEffect;U.nextEffect=null;U=ui}}catch(Wa){e=!0,q=Wa}e&&(null===U?A("178"):void 0,Vg(U,q),null!==U&&(U=U.nextEffect))}lh=ph=!1;"function"===typeof Ff&&Ff(b.stateNode);b=c.current.expirationTime;0===b&&(dh=null);a.remainingExpirationTime=b}function vh(){return null===Lh||Lh.timeRemaining()>Oh?!1:Ih=!0}
function bh(a){null===X?A("246"):void 0;X.remainingExpirationTime=0;Jh||(Jh=!0,Kh=a)}function xh(a){null===X?A("246"):void 0;X.remainingExpirationTime=a}function Yh(a,b){var c=Z;Z=!0;try{return a(b)}finally{(Z=c)||W||Sh()}}function Zh(a,b){if(Z&&!Mh){Mh=!0;try{return a(b)}finally{Mh=!1}}return a(b)}function $h(a,b){W?A("187"):void 0;var c=Z;Z=!0;try{return Eh(a,b)}finally{Z=c,Sh()}}function ai(a){var b=Z;Z=!0;try{Eh(a)}finally{(Z=b)||W||Uh(1,!1,null)}}
function bi(a,b,c,d,e){var f=b.current;if(c){c=c._reactInternalFiber;var g;b:{2===id(c)&&2===c.tag?void 0:A("170");for(g=c;3!==g.tag;){if(mf(g)){g=g.stateNode.__reactInternalMemoizedMergedChildContext;break b}(g=g.return)?void 0:A("171")}g=g.stateNode.context}c=mf(c)?rf(c,g):g}else c=ha;null===b.context?b.context=c:b.pendingContext=c;b=e;e=Kf(d);e.payload={element:a};b=void 0===b?null:b;null!==b&&(e.callback=b);Mf(f,e,d);kg(f,d);return d}
function ci(a){var b=a._reactInternalFiber;void 0===b&&("function"===typeof a.render?A("188"):A("268",Object.keys(a)));a=ld(b);return null===a?null:a.stateNode}function di(a,b,c,d){var e=b.current,f=ig();e=jg(f,e);return bi(a,b,c,e,d)}function ei(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}
function fi(a){var b=a.findFiberByHostInstance;return Ef(p({},a,{findHostInstanceByFiber:function(a){a=ld(a);return null===a?null:a.stateNode},findFiberByHostInstance:function(a){return b?b(a):null}}))}
var gi={updateContainerAtExpirationTime:bi,createContainer:function(a,b,c){return Af(a,b,c)},updateContainer:di,flushRoot:Wh,requestWork:wh,computeUniqueAsyncExpiration:yh,batchedUpdates:Yh,unbatchedUpdates:Zh,deferredUpdates:Dh,syncUpdates:Eh,interactiveUpdates:function(a,b,c){if(zh)return a(b,c);Z||W||0===Ah||(Uh(Ah,!1,null),Ah=0);var d=zh,e=Z;Z=zh=!0;try{return a(b,c)}finally{zh=d,(Z=e)||W||Sh()}},flushInteractiveUpdates:function(){W||0===Ah||(Uh(Ah,!1,null),Ah=0)},flushControlled:ai,flushSync:$h,
getPublicRootInstance:ei,findHostInstance:ci,findHostInstanceWithNoPortals:function(a){a=md(a);return null===a?null:a.stateNode},injectIntoDevTools:fi};function ii(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:gc,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}Kb.injectFiberControlledHostComponent(We);
function ji(a){this._expirationTime=yh();this._root=a;this._callbacks=this._next=null;this._hasChildren=this._didComplete=!1;this._children=null;this._defer=!0}ji.prototype.render=function(a){this._defer?void 0:A("250");this._hasChildren=!0;this._children=a;var b=this._root._internalRoot,c=this._expirationTime,d=new ki;bi(a,b,null,c,d._onCommit);return d};ji.prototype.then=function(a){if(this._didComplete)a();else{var b=this._callbacks;null===b&&(b=this._callbacks=[]);b.push(a)}};
ji.prototype.commit=function(){var a=this._root._internalRoot,b=a.firstBatch;this._defer&&null!==b?void 0:A("251");if(this._hasChildren){var c=this._expirationTime;if(b!==this){this._hasChildren&&(c=this._expirationTime=b._expirationTime,this.render(this._children));for(var d=null,e=b;e!==this;)d=e,e=e._next;null===d?A("251"):void 0;d._next=e._next;this._next=b;a.firstBatch=this}this._defer=!1;Wh(a,c);b=this._next;this._next=null;b=a.firstBatch=b;null!==b&&b._hasChildren&&b.render(b._children)}else this._next=
null,this._defer=!1};ji.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var a=this._callbacks;if(null!==a)for(var b=0;b<a.length;b++)(0,a[b])()}};function ki(){this._callbacks=null;this._didCommit=!1;this._onCommit=this._onCommit.bind(this)}ki.prototype.then=function(a){if(this._didCommit)a();else{var b=this._callbacks;null===b&&(b=this._callbacks=[]);b.push(a)}};
ki.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var a=this._callbacks;if(null!==a)for(var b=0;b<a.length;b++){var c=a[b];"function"!==typeof c?A("191",c):void 0;c()}}};function li(a,b,c){this._internalRoot=Af(a,b,c)}li.prototype.render=function(a,b){var c=this._internalRoot,d=new ki;b=void 0===b?null:b;null!==b&&d.then(b);di(a,c,null,d._onCommit);return d};
li.prototype.unmount=function(a){var b=this._internalRoot,c=new ki;a=void 0===a?null:a;null!==a&&c.then(a);di(null,b,null,c._onCommit);return c};li.prototype.legacy_renderSubtreeIntoContainer=function(a,b,c){var d=this._internalRoot,e=new ki;c=void 0===c?null:c;null!==c&&e.then(c);di(b,d,a,e._onCommit);return e};
li.prototype.createBatch=function(){var a=new ji(this),b=a._expirationTime,c=this._internalRoot,d=c.firstBatch;if(null===d)c.firstBatch=a,a._next=null;else{for(c=null;null!==d&&d._expirationTime<=b;)c=d,d=d._next;a._next=d;null!==c&&(c._next=a)}return a};function mi(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}Sb=gi.batchedUpdates;Tb=gi.interactiveUpdates;Ub=gi.flushInteractiveUpdates;
function ni(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new li(a,!1,b)}
function oi(a,b,c,d,e){mi(c)?void 0:A("200");var f=c._reactRootContainer;if(f){if("function"===typeof e){var g=e;e=function(){var a=ei(f._internalRoot);g.call(a)}}null!=a?f.legacy_renderSubtreeIntoContainer(a,b,e):f.render(b,e)}else{f=c._reactRootContainer=ni(c,d);if("function"===typeof e){var h=e;e=function(){var a=ei(f._internalRoot);h.call(a)}}Zh(function(){null!=a?f.legacy_renderSubtreeIntoContainer(a,b,e):f.render(b,e)})}return ei(f._internalRoot)}
function pi(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;mi(b)?void 0:A("200");return ii(a,b,null,c)}
var qi={createPortal:pi,findDOMNode:function(a){return null==a?null:1===a.nodeType?a:ci(a)},hydrate:function(a,b,c){return oi(null,a,b,!0,c)},render:function(a,b,c){return oi(null,a,b,!1,c)},unstable_renderSubtreeIntoContainer:function(a,b,c,d){null==a||void 0===a._reactInternalFiber?A("38"):void 0;return oi(a,b,c,!1,d)},unmountComponentAtNode:function(a){mi(a)?void 0:A("40");return a._reactRootContainer?(Zh(function(){oi(null,null,a,!1,function(){a._reactRootContainer=null})}),!0):!1},unstable_createPortal:function(){return pi.apply(void 0,
arguments)},unstable_batchedUpdates:Yh,unstable_deferredUpdates:Dh,flushSync:$h,unstable_flushControlled:ai,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{EventPluginHub:Ka,EventPluginRegistry:va,EventPropagators:$a,ReactControlledComponent:Rb,ReactDOMComponentTree:Qa,ReactDOMEventListener:Md},unstable_createRoot:function(a,b){return new li(a,!0,null!=b&&!0===b.hydrate)}};fi({findFiberByHostInstance:Na,bundleType:0,version:"16.4.0",rendererPackageName:"react-dom"});
var vi={default:qi},wi=vi&&qi||vi;module.exports=wi.default?wi.default:wi;


/***/ }),

/***/ "../../node_modules/react-dom/index.js":
/*!********************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-dom/index.js ***!
  \********************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: hydrate */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (false) {
    // This branch is unreachable because this function is only called
    // in production, but the condition is true only in development.
    // Therefore if the branch is still here, dead code elimination wasn't
    // properly applied.
    // Don't change the message. React DevTools relies on it. Also make sure
    // this message doesn't occur elsewhere in this function, or it will cause
    // a false positive.
    throw new Error('^_^');
  }
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(/*! ./cjs/react-dom.production.min.js */ "../../node_modules/react-dom/cjs/react-dom.production.min.js");
} else {
  module.exports = require('./cjs/react-dom.development.js');
}


/***/ }),

/***/ "../../node_modules/react-error-overlay/lib/index.js":
/*!**********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-error-overlay/lib/index.js ***!
  \**********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReactErrorOverlay"] = factory();
	else
		root["ReactErrorOverlay"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export StackFrame */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScriptLine; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** A container holding a script line. */
var ScriptLine =
/** The content (or value) of this line of source. */
function ScriptLine(lineNumber, content) {
  var highlight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  _classCallCheck(this, ScriptLine);

  this.lineNumber = lineNumber;
  this.content = content;
  this.highlight = highlight;
}
/** Whether or not this line should be highlighted. Particularly useful for error reporting with context. */

/** The line number of this line of source. */
;

/**
 * A representation of a stack frame.
 */


var StackFrame = function () {
  function StackFrame() {
    var functionName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var lineNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var columnNumber = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var scriptCode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var sourceFunctionName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var sourceFileName = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var sourceLineNumber = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
    var sourceColumnNumber = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : null;
    var sourceScriptCode = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : null;

    _classCallCheck(this, StackFrame);

    if (functionName && functionName.indexOf('Object.') === 0) {
      functionName = functionName.slice('Object.'.length);
    }
    if (
    // Chrome has a bug with inferring function.name:
    // https://github.com/facebookincubator/create-react-app/issues/2097
    // Let's ignore a meaningless name we get for top-level modules.
    functionName === 'friendlySyntaxErrorLabel' || functionName === 'exports.__esModule' || functionName === '<anonymous>' || !functionName) {
      functionName = null;
    }
    this.functionName = functionName;

    this.fileName = fileName;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;

    this._originalFunctionName = sourceFunctionName;
    this._originalFileName = sourceFileName;
    this._originalLineNumber = sourceLineNumber;
    this._originalColumnNumber = sourceColumnNumber;

    this._scriptCode = scriptCode;
    this._originalScriptCode = sourceScriptCode;
  }

  /**
   * Returns the name of this function.
   */


  _createClass(StackFrame, [{
    key: 'getFunctionName',
    value: function getFunctionName() {
      return this.functionName || '(anonymous function)';
    }

    /**
     * Returns the source of the frame.
     * This contains the file name, line number, and column number when available.
     */

  }, {
    key: 'getSource',
    value: function getSource() {
      var str = '';
      if (this.fileName != null) {
        str += this.fileName + ':';
      }
      if (this.lineNumber != null) {
        str += this.lineNumber + ':';
      }
      if (this.columnNumber != null) {
        str += this.columnNumber + ':';
      }
      return str.slice(0, -1);
    }

    /**
     * Returns a pretty version of this stack frame.
     */

  }, {
    key: 'toString',
    value: function toString() {
      var functionName = this.getFunctionName();
      var source = this.getSource();
      return '' + functionName + (source ? ' (' + source + ')' : '');
    }
  }]);

  return StackFrame;
}();


/* harmony default export */ __webpack_exports__["b"] = (StackFrame);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(19);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export extractSourceMapUrl */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getSourceMap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_source_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_source_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_source_map__);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

/**
 * Returns an instance of <code>{@link SourceMap}</code> for a given fileUri and fileContents.
 * @param {string} fileUri The URI of the source file.
 * @param {string} fileContents The contents of the source file.
 */
var getSourceMap = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(fileUri, fileContents) {
    var sm, base64, match2, index, url, obj;
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return extractSourceMapUrl(fileUri, fileContents);

          case 2:
            sm = _context.sent;

            if (!(sm.indexOf('data:') === 0)) {
              _context.next = 14;
              break;
            }

            base64 = /^data:application\/json;([\w=:"-]+;)*base64,/;
            match2 = sm.match(base64);

            if (match2) {
              _context.next = 8;
              break;
            }

            throw new Error('Sorry, non-base64 inline source-map encoding is not supported.');

          case 8:
            sm = sm.substring(match2[0].length);
            sm = window.atob(sm);
            sm = JSON.parse(sm);
            return _context.abrupt('return', new SourceMap(new __WEBPACK_IMPORTED_MODULE_1_source_map__["SourceMapConsumer"](sm)));

          case 14:
            index = fileUri.lastIndexOf('/');
            url = fileUri.substring(0, index + 1) + sm;
            _context.next = 18;
            return fetch(url).then(function (res) {
              return res.json();
            });

          case 18:
            obj = _context.sent;
            return _context.abrupt('return', new SourceMap(new __WEBPACK_IMPORTED_MODULE_1_source_map__["SourceMapConsumer"](obj)));

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getSourceMap(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * A wrapped instance of a <code>{@link https://github.com/mozilla/source-map SourceMapConsumer}</code>.
 *
 * This exposes methods which will be indifferent to changes made in <code>{@link https://github.com/mozilla/source-map source-map}</code>.
 */

var SourceMap = function () {
  function SourceMap(sourceMap) {
    _classCallCheck(this, SourceMap);

    this.__source_map = sourceMap;
  }

  /**
   * Returns the original code position for a generated code position.
   * @param {number} line The line of the generated code position.
   * @param {number} column The column of the generated code position.
   */


  _createClass(SourceMap, [{
    key: 'getOriginalPosition',
    value: function getOriginalPosition(line, column) {
      var _source_map$original = this.__source_map.originalPositionFor({
        line: line,
        column: column
      }),
          l = _source_map$original.line,
          c = _source_map$original.column,
          s = _source_map$original.source;

      return { line: l, column: c, source: s };
    }

    /**
     * Returns the generated code position for an original position.
     * @param {string} source The source file of the original code position.
     * @param {number} line The line of the original code position.
     * @param {number} column The column of the original code position.
     */

  }, {
    key: 'getGeneratedPosition',
    value: function getGeneratedPosition(source, line, column) {
      var _source_map$generate = this.__source_map.generatedPositionFor({
        source: source,
        line: line,
        column: column
      }),
          l = _source_map$generate.line,
          c = _source_map$generate.column;

      return {
        line: l,
        column: c
      };
    }

    /**
     * Returns the code for a given source file name.
     * @param {string} sourceName The name of the source file.
     */

  }, {
    key: 'getSource',
    value: function getSource(sourceName) {
      return this.__source_map.sourceContentFor(sourceName);
    }
  }, {
    key: 'getSources',
    value: function getSources() {
      return this.__source_map.sources;
    }
  }]);

  return SourceMap;
}();

function extractSourceMapUrl(fileUri, fileContents) {
  var regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
  var match = null;
  for (;;) {
    var next = regex.exec(fileContents);
    if (next == null) {
      break;
    }
    match = next;
  }
  if (!(match && match[1])) {
    return Promise.reject('Cannot find a source map directive for ' + fileUri + '.');
  }
  return Promise.resolve(match[1].toString());
}


/* unused harmony default export */ var _unused_webpack_default_export = (getSourceMap);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = __webpack_require__(6);
var util = __webpack_require__(0);
var ArraySet = __webpack_require__(7).ArraySet;
var MappingList = __webpack_require__(23).MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = __webpack_require__(22);

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(0);
var has = Object.prototype.hasOwnProperty;

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = util.toSetString(aStr);
  var isDuplicate = has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    this._set[sStr] = idx;
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  var sStr = util.toSetString(aStr);
  return has.call(this._set, sStr);
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  var sStr = util.toSetString(aStr);
  if (has.call(this._set, sStr)) {
    return this._set[sStr];
  }
  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getLinesAround; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stack_frame__ = __webpack_require__(1);
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 *
 * @param {number} line The line number to provide context around.
 * @param {number} count The number of lines you'd like for context.
 * @param {string[] | string} lines The source code.
 */
function getLinesAround(line, count, lines) {
  if (typeof lines === 'string') {
    lines = lines.split('\n');
  }
  var result = [];
  for (var index = Math.max(0, line - 1 - count); index <= Math.min(lines.length - 1, line - 1 + count); ++index) {
    result.push(new __WEBPACK_IMPORTED_MODULE_0__stack_frame__["a" /* ScriptLine */](index + 1, lines[index], index === line - 1));
  }
  return result;
}


/* unused harmony default export */ var _unused_webpack_default_export = (getLinesAround);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (immutable) */ __webpack_exports__["setEditorHandler"] = setEditorHandler;
/* harmony export (immutable) */ __webpack_exports__["reportBuildError"] = reportBuildError;
/* harmony export (immutable) */ __webpack_exports__["dismissBuildError"] = dismissBuildError;
/* harmony export (immutable) */ __webpack_exports__["startReportingRuntimeErrors"] = startReportingRuntimeErrors;
/* harmony export (immutable) */ __webpack_exports__["dismissRuntimeErrors"] = dismissRuntimeErrors;
/* harmony export (immutable) */ __webpack_exports__["stopReportingRuntimeErrors"] = stopReportingRuntimeErrors;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__listenToRuntimeErrors__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_dom_css__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_iframeScript__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_iframeScript___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_iframeScript__);
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





// Importing iframe-bundle generated in the pre build step as
// a text using webpack raw-loader. See webpack.config.js file.
// $FlowFixMe


var iframe = null;
var isLoadingIframe = false;
var isIframeReady = false;

var editorHandler = null;
var currentBuildError = null;
var currentRuntimeErrorRecords = [];
var currentRuntimeErrorOptions = null;
var stopListeningToRuntimeErrors = null;

function setEditorHandler(handler) {
  editorHandler = handler;
  if (iframe) {
    update();
  }
}

function reportBuildError(error) {
  currentBuildError = error;
  update();
}

function dismissBuildError() {
  currentBuildError = null;
  update();
}

function startReportingRuntimeErrors(options) {
  if (stopListeningToRuntimeErrors !== null) {
    throw new Error('Already listening');
  }
  if (options.launchEditorEndpoint) {
    console.warn('Warning: `startReportingRuntimeErrors` doesn’t accept ' + '`launchEditorEndpoint` argument anymore. Use `listenToOpenInEditor` ' + 'instead with your own implementation to open errors in editor ');
  }
  currentRuntimeErrorOptions = options;
  stopListeningToRuntimeErrors = Object(__WEBPACK_IMPORTED_MODULE_0__listenToRuntimeErrors__["a" /* listenToRuntimeErrors */])(function (errorRecord) {
    try {
      if (typeof options.onError === 'function') {
        options.onError.call(null);
      }
    } finally {
      handleRuntimeError(errorRecord);
    }
  }, options.filename);
}

function handleRuntimeError(errorRecord) {
  if (currentRuntimeErrorRecords.some(function (_ref) {
    var error = _ref.error;
    return error === errorRecord.error;
  })) {
    // Deduplicate identical errors.
    // This fixes https://github.com/facebookincubator/create-react-app/issues/3011.
    return;
  }
  currentRuntimeErrorRecords = currentRuntimeErrorRecords.concat([errorRecord]);
  update();
}

function dismissRuntimeErrors() {
  currentRuntimeErrorRecords = [];
  update();
}

function stopReportingRuntimeErrors() {
  if (stopListeningToRuntimeErrors === null) {
    throw new Error('Not currently listening');
  }
  currentRuntimeErrorOptions = null;
  try {
    stopListeningToRuntimeErrors();
  } finally {
    stopListeningToRuntimeErrors = null;
  }
}

function update() {
  // Loading iframe can be either sync or async depending on the browser.
  if (isLoadingIframe) {
    // Iframe is loading.
    // First render will happen soon--don't need to do anything.
    return;
  }
  if (isIframeReady) {
    // Iframe is ready.
    // Just update it.
    updateIframeContent();
    return;
  }
  // We need to schedule the first render.
  isLoadingIframe = true;
  var loadingIframe = window.document.createElement('iframe');
  Object(__WEBPACK_IMPORTED_MODULE_2__utils_dom_css__["a" /* applyStyles */])(loadingIframe, __WEBPACK_IMPORTED_MODULE_1__styles__["a" /* iframeStyle */]);
  loadingIframe.onload = function () {
    var iframeDocument = loadingIframe.contentDocument;
    if (iframeDocument != null && iframeDocument.body != null) {
      iframe = loadingIframe;
      var script = loadingIframe.contentWindow.document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = __WEBPACK_IMPORTED_MODULE_3_iframeScript___default.a;
      iframeDocument.body.appendChild(script);
    }
  };
  var appDocument = window.document;
  appDocument.body.appendChild(loadingIframe);
}

function updateIframeContent() {
  if (!currentRuntimeErrorOptions) {
    throw new Error('Expected options to be injected.');
  }

  if (!iframe) {
    throw new Error('Iframe has not been created yet.');
  }

  var isRendered = iframe.contentWindow.updateContent({
    currentBuildError: currentBuildError,
    currentRuntimeErrorRecords: currentRuntimeErrorRecords,
    dismissRuntimeErrors: dismissRuntimeErrors,
    editorHandler: editorHandler
  });

  if (!isRendered) {
    window.document.body.removeChild(iframe);
    iframe = null;
    isIframeReady = false;
  }
}

window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ || {};
window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.iframeReady = function iframeReady() {
  isIframeReady = true;
  isLoadingIframe = false;
  updateIframeContent();
};

if (process.env.NODE_ENV === 'production') {
  console.warn('react-error-overlay is not meant for use in production. You should ' + 'ensure it is not included in your build to reduce bundle size.');
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = listenToRuntimeErrors;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__effects_unhandledError__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__effects_unhandledRejection__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__effects_stackTraceLimit__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__effects_proxyConsole__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_warnings__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_getStackFrames__ = __webpack_require__(16);
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */








var CONTEXT_SIZE = 3;

function listenToRuntimeErrors(crash) {
  var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/static/js/bundle.js';

  function crashWithFrames(error) {
    var unhandledRejection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    Object(__WEBPACK_IMPORTED_MODULE_5__utils_getStackFrames__["a" /* default */])(error, unhandledRejection, CONTEXT_SIZE).then(function (stackFrames) {
      if (stackFrames == null) {
        return;
      }
      crash({
        error: error,
        unhandledRejection: unhandledRejection,
        contextSize: CONTEXT_SIZE,
        stackFrames: stackFrames
      });
    }).catch(function (e) {
      console.log('Could not get the stack frames of error:', e);
    });
  }
  Object(__WEBPACK_IMPORTED_MODULE_0__effects_unhandledError__["a" /* register */])(window, function (error) {
    return crashWithFrames(error, false);
  });
  Object(__WEBPACK_IMPORTED_MODULE_1__effects_unhandledRejection__["a" /* register */])(window, function (error) {
    return crashWithFrames(error, true);
  });
  Object(__WEBPACK_IMPORTED_MODULE_2__effects_stackTraceLimit__["a" /* register */])();
  Object(__WEBPACK_IMPORTED_MODULE_3__effects_proxyConsole__["b" /* registerReactStack */])();
  Object(__WEBPACK_IMPORTED_MODULE_3__effects_proxyConsole__["a" /* permanentRegister */])('error', function (warning, stack) {
    var data = Object(__WEBPACK_IMPORTED_MODULE_4__utils_warnings__["a" /* massage */])(warning, stack);
    crashWithFrames(
    // $FlowFixMe
    {
      message: data.message,
      stack: data.stack,
      __unmap_source: filename
    }, false);
  });

  return function stopListening() {
    Object(__WEBPACK_IMPORTED_MODULE_2__effects_stackTraceLimit__["b" /* unregister */])();
    Object(__WEBPACK_IMPORTED_MODULE_1__effects_unhandledRejection__["b" /* unregister */])(window);
    Object(__WEBPACK_IMPORTED_MODULE_0__effects_unhandledError__["b" /* unregister */])(window);
    Object(__WEBPACK_IMPORTED_MODULE_3__effects_proxyConsole__["c" /* unregisterReactStack */])();
  };
}

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return registerUnhandledError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return unregisterUnhandledError; });
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var boundErrorHandler = null;

function errorHandler(callback, e) {
  if (!e.error) {
    return;
  }
  // $FlowFixMe
  var error = e.error;

  if (error instanceof Error) {
    callback(error);
  } else {
    // A non-error was thrown, we don't have a trace. :(
    // Look in your browser's devtools for more information
    callback(new Error(error));
  }
}

function registerUnhandledError(target, callback) {
  if (boundErrorHandler !== null) {
    return;
  }
  boundErrorHandler = errorHandler.bind(undefined, callback);
  target.addEventListener('error', boundErrorHandler);
}

function unregisterUnhandledError(target) {
  if (boundErrorHandler === null) {
    return;
  }
  target.removeEventListener('error', boundErrorHandler);
  boundErrorHandler = null;
}



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return registerUnhandledRejection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return unregisterUnhandledRejection; });
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var boundRejectionHandler = null;

function rejectionHandler(callback, e) {
  if (e == null || e.reason == null) {
    return callback(new Error('Unknown'));
  }
  var reason = e.reason;

  if (reason instanceof Error) {
    return callback(reason);
  }
  // A non-error was rejected, we don't have a trace :(
  // Look in your browser's devtools for more information
  return callback(new Error(reason));
}

function registerUnhandledRejection(target, callback) {
  if (boundRejectionHandler !== null) {
    return;
  }
  boundRejectionHandler = rejectionHandler.bind(undefined, callback);
  // $FlowFixMe
  target.addEventListener('unhandledrejection', boundRejectionHandler);
}

function unregisterUnhandledRejection(target) {
  if (boundRejectionHandler === null) {
    return;
  }
  // $FlowFixMe
  target.removeEventListener('unhandledrejection', boundRejectionHandler);
  boundRejectionHandler = null;
}



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return registerStackTraceLimit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return unregisterStackTraceLimit; });
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var stackTraceRegistered = false;
// Default: https://docs.microsoft.com/en-us/scripting/javascript/reference/stacktracelimit-property-error-javascript
var restoreStackTraceValue = 10;

var MAX_STACK_LENGTH = 50;

function registerStackTraceLimit() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : MAX_STACK_LENGTH;

  if (stackTraceRegistered) {
    return;
  }
  try {
    restoreStackTraceValue = Error.stackTraceLimit;
    Error.stackTraceLimit = limit;
    stackTraceRegistered = true;
  } catch (e) {
    // Not all browsers support this so we don't care if it errors
  }
}

function unregisterStackTraceLimit() {
  if (!stackTraceRegistered) {
    return;
  }
  try {
    Error.stackTraceLimit = restoreStackTraceValue;
    stackTraceRegistered = false;
  } catch (e) {
    // Not all browsers support this so we don't care if it errors
  }
}



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return permanentRegister; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return registerReactStack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return unregisterReactStack; });

var reactFrameStack = []; /**
                           * Copyright (c) 2015-present, Facebook, Inc.
                           *
                           * This source code is licensed under the MIT license found in the
                           * LICENSE file in the root directory of this source tree.
                           */

// This is a stripped down barebones version of this proposal:
// https://gist.github.com/sebmarkbage/bdefa100f19345229d526d0fdd22830f
// We're implementing just enough to get the invalid element type warnings
// to display the component stack in React 15.6+:
// https://github.com/facebook/react/pull/9679
/// TODO: a more comprehensive implementation.

var registerReactStack = function registerReactStack() {
  if (typeof console !== 'undefined') {
    // $FlowFixMe
    console.reactStack = function (frames) {
      return reactFrameStack.push(frames);
    };
    // $FlowFixMe
    console.reactStackEnd = function (frames) {
      return reactFrameStack.pop();
    };
  }
};

var unregisterReactStack = function unregisterReactStack() {
  if (typeof console !== 'undefined') {
    // $FlowFixMe
    console.reactStack = undefined;
    // $FlowFixMe
    console.reactStackEnd = undefined;
  }
};

var permanentRegister = function proxyConsole(type, callback) {
  if (typeof console !== 'undefined') {
    var orig = console[type];
    if (typeof orig === 'function') {
      console[type] = function __stack_frame_overlay_proxy_console__() {
        try {
          var _message = arguments[0];
          if (typeof _message === 'string' && reactFrameStack.length > 0) {
            callback(_message, reactFrameStack[reactFrameStack.length - 1]);
          }
        } catch (err) {
          // Warnings must never crash. Rethrow with a clean stack.
          setTimeout(function () {
            throw err;
          });
        }
        return orig.apply(this, arguments);
      };
    }
  }
};



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return massage; });


function stripInlineStacktrace(message) {
  return message.split('\n').filter(function (line) {
    return !line.match(/^\s*in/);
  }).join('\n'); // "  in Foo"
} /**
   * Copyright (c) 2015-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

function massage(warning, frames) {
  var message = stripInlineStacktrace(warning);

  // Reassemble the stack with full filenames provided by React
  var stack = '';
  var lastFilename = void 0;
  var lastLineNumber = void 0;
  for (var index = 0; index < frames.length; ++index) {
    var _frames$index = frames[index],
        fileName = _frames$index.fileName,
        lineNumber = _frames$index.lineNumber;

    if (fileName == null || lineNumber == null) {
      continue;
    }

    // TODO: instead, collapse them in the UI
    if (fileName === lastFilename && typeof lineNumber === 'number' && typeof lastLineNumber === 'number' && Math.abs(lineNumber - lastLineNumber) < 3) {
      continue;
    }
    lastFilename = fileName;
    lastLineNumber = lineNumber;

    var name = frames[index].name;

    name = name || '(anonymous function)';
    stack += 'in ' + name + ' (at ' + fileName + ':' + lineNumber + ')\n';
  }

  return { message: message, stack: stack };
}



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getStackFrames */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__parser__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mapper__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__unmapper__ = __webpack_require__(29);

 /**
                                   * Copyright (c) 2015-present, Facebook, Inc.
                                   *
                                   * This source code is licensed under the MIT license found in the
                                   * LICENSE file in the root directory of this source tree.
                                   */




function getStackFrames(error) {
  var unhandledRejection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var contextSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;

  var parsedFrames = Object(__WEBPACK_IMPORTED_MODULE_0__parser__["a" /* parse */])(error);
  var enhancedFramesPromise = void 0;
  if (error.__unmap_source) {
    enhancedFramesPromise = Object(__WEBPACK_IMPORTED_MODULE_2__unmapper__["a" /* unmap */])(
    // $FlowFixMe
    error.__unmap_source, parsedFrames, contextSize);
  } else {
    enhancedFramesPromise = Object(__WEBPACK_IMPORTED_MODULE_1__mapper__["a" /* map */])(parsedFrames, contextSize);
  }
  return enhancedFramesPromise.then(function (enhancedFrames) {
    if (enhancedFrames.map(function (f) {
      return f._originalFileName;
    }).filter(function (f) {
      return f != null && f.indexOf('node_modules') === -1;
    }).length === 0) {
      return null;
    }
    return enhancedFrames.filter(function (_ref) {
      var functionName = _ref.functionName;
      return functionName == null || functionName.indexOf('__stack_frame_overlay_proxy_console__') === -1;
    });
  });
}

/* harmony default export */ __webpack_exports__["a"] = (getStackFrames);


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return parseError; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stack_frame__ = __webpack_require__(1);
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var regexExtractLocation = /\(?(.+?)(?::(\d+))?(?::(\d+))?\)?$/;

function extractLocation(token) {
  return regexExtractLocation.exec(token).slice(1).map(function (v) {
    var p = Number(v);
    if (!isNaN(p)) {
      return p;
    }
    return v;
  });
}

var regexValidFrame_Chrome = /^\s*(at|in)\s.+(:\d+)/;
var regexValidFrame_FireFox = /(^|@)\S+:\d+|.+line\s+\d+\s+>\s+(eval|Function).+/;

function parseStack(stack) {
  var frames = stack.filter(function (e) {
    return regexValidFrame_Chrome.test(e) || regexValidFrame_FireFox.test(e);
  }).map(function (e) {
    if (regexValidFrame_FireFox.test(e)) {
      // Strip eval, we don't care about it
      var isEval = false;
      if (/ > (eval|Function)/.test(e)) {
        e = e.replace(/ line (\d+)(?: > eval line \d+)* > (eval|Function):\d+:\d+/g, ':$1');
        isEval = true;
      }
      var data = e.split(/[@]/g);
      var last = data.pop();
      return new (Function.prototype.bind.apply(__WEBPACK_IMPORTED_MODULE_0__stack_frame__["b" /* default */], [null].concat([data.join('@') || (isEval ? 'eval' : null)], _toConsumableArray(extractLocation(last)))))();
    } else {
      // Strip eval, we don't care about it
      if (e.indexOf('(eval ') !== -1) {
        e = e.replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
      }
      if (e.indexOf('(at ') !== -1) {
        e = e.replace(/\(at /, '(');
      }
      var _data = e.trim().split(/\s+/g).slice(1);
      var _last = _data.pop();
      return new (Function.prototype.bind.apply(__WEBPACK_IMPORTED_MODULE_0__stack_frame__["b" /* default */], [null].concat([_data.join(' ') || null], _toConsumableArray(extractLocation(_last)))))();
    }
  });
  return frames;
}

/**
 * Turns an <code>Error</code>, or similar object, into a set of <code>StackFrame</code>s.
 * @alias parse
 */
function parseError(error) {
  if (error == null) {
    throw new Error('You cannot pass a null object.');
  }
  if (typeof error === 'string') {
    return parseStack(error.split('\n'));
  }
  if (Array.isArray(error)) {
    return parseStack(error);
  }
  if (typeof error.stack === 'string') {
    return parseStack(error.stack.split('\n'));
  }
  throw new Error('The error you provided does not contain a stack trace.');
}


/* unused harmony default export */ var _unused_webpack_default_export = (parseError);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return map; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stack_frame__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getSourceMap__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__getLinesAround__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_settle_promise__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_settle_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_settle_promise__);


/**
 * Enhances a set of <code>StackFrame</code>s with their original positions and code (when available).
 * @param {StackFrame[]} frames A set of <code>StackFrame</code>s which contain (generated) code positions.
 * @param {number} [contextLines=3] The number of lines to provide before and after the line specified in the <code>StackFrame</code>.
 */
var map = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee2(frames) {
    var _this = this;

    var contextLines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
    var cache, files;
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            cache = {};
            files = [];

            frames.forEach(function (frame) {
              var fileName = frame.fileName;

              if (fileName == null) {
                return;
              }
              if (files.indexOf(fileName) !== -1) {
                return;
              }
              files.push(fileName);
            });
            _context2.next = 5;
            return Object(__WEBPACK_IMPORTED_MODULE_4_settle_promise__["settle"])(files.map(function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(fileName) {
                var fileSource, map;
                return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return fetch(fileName).then(function (r) {
                          return r.text();
                        });

                      case 2:
                        fileSource = _context.sent;
                        _context.next = 5;
                        return Object(__WEBPACK_IMPORTED_MODULE_2__getSourceMap__["a" /* getSourceMap */])(fileName, fileSource);

                      case 5:
                        map = _context.sent;

                        cache[fileName] = { fileSource: fileSource, map: map };

                      case 7:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 5:
            return _context2.abrupt('return', frames.map(function (frame) {
              var functionName = frame.functionName,
                  fileName = frame.fileName,
                  lineNumber = frame.lineNumber,
                  columnNumber = frame.columnNumber;

              var _ref3 = cache[fileName] || {},
                  map = _ref3.map,
                  fileSource = _ref3.fileSource;

              if (map == null || lineNumber == null) {
                return frame;
              }

              var _map$getOriginalPosit = map.getOriginalPosition(lineNumber, columnNumber),
                  source = _map$getOriginalPosit.source,
                  line = _map$getOriginalPosit.line,
                  column = _map$getOriginalPosit.column;

              var originalSource = source == null ? [] : map.getSource(source);
              return new __WEBPACK_IMPORTED_MODULE_1__stack_frame__["b" /* default */](functionName, fileName, lineNumber, columnNumber, Object(__WEBPACK_IMPORTED_MODULE_3__getLinesAround__["a" /* getLinesAround */])(lineNumber, contextLines, fileSource), functionName, source, line, column, Object(__WEBPACK_IMPORTED_MODULE_3__getLinesAround__["a" /* getLinesAround */])(line, contextLines, originalSource));
            }));

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function map(_x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */







/* unused harmony default export */ var _unused_webpack_default_export = (map);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(20);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = __webpack_require__(5).SourceMapGenerator;
exports.SourceMapConsumer = __webpack_require__(24).SourceMapConsumer;
exports.SourceNode = __webpack_require__(27).SourceNode;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(0);

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(0);
var binarySearch = __webpack_require__(25);
var ArraySet = __webpack_require__(7).ArraySet;
var base64VLQ = __webpack_require__(6);
var quickSort = __webpack_require__(26).quickSort;

function SourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap)
    : new BasicSourceMapConsumer(sourceMap);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      if (source != null && sourceRoot != null) {
        source = util.join(sourceRoot, source);
      }
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: Optional. the column number in the original source.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    if (this.sourceRoot != null) {
      needle.source = util.relative(this.sourceRoot, needle.source);
    }
    if (!this._sources.has(needle.source)) {
      return [];
    }
    needle.source = this._sources.indexOf(needle.source);

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The only parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._sources.toArray().map(function (s) {
      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
    }, this);
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          if (this.sourceRoot != null) {
            source = util.join(this.sourceRoot, source);
          }
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    if (this.sourceRoot != null) {
      aSource = util.relative(this.sourceRoot, aSource);
    }

    if (this._sources.has(aSource)) {
      return this.sourcesContent[this._sources.indexOf(aSource)];
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + aSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    if (this.sourceRoot != null) {
      source = util.relative(this.sourceRoot, source);
    }
    if (!this._sources.has(source)) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    source = this._sources.indexOf(source);

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The only parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        if (section.consumer.sourceRoot !== null) {
          source = util.join(section.consumer.sourceRoot, source);
        }
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = section.consumer._names.at(mapping.name);
        this._names.add(name);
        name = this._names.indexOf(name);

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = __webpack_require__(5).SourceMapGenerator;
var util = __webpack_require__(0);

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are removed from this array, by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var shiftNextLine = function() {
      var lineContents = remainingLines.shift();
      // The last line of a file might not have a newline.
      var newLine = remainingLines.shift() || "";
      return lineContents + newLine;
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[0];
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[0];
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[0] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLines.length > 0) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function settle(val) {
  if (!Array.isArray(val)) val = [val];
  return Promise.all(val.map(function (p) {
    return p.then(function (value) {
      return {
        isFulfilled: true,
        isRejected: false,
        value: value
      };
    }).catch(function (reason) {
      return {
        isFulfilled: false,
        isRejected: true,
        reason: reason
      };
    });
  }));
}

exports.settle = settle;
exports.default = settle;

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return unmap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stack_frame__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getSourceMap__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__getLinesAround__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_path__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_path__);


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Turns a set of mapped <code>StackFrame</code>s back into their generated code position and enhances them with code.
 * @param {string} fileUri The URI of the <code>bundle.js</code> file.
 * @param {StackFrame[]} frames A set of <code>StackFrame</code>s which are already mapped and missing their generated positions.
 * @param {number} [fileContents=3] The number of lines to provide before and after the line specified in the <code>StackFrame</code>.
 */
var unmap = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(_fileUri, frames) {
    var contextLines = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
    var fileContents, fileUri, map;
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fileContents = (typeof _fileUri === 'undefined' ? 'undefined' : _typeof(_fileUri)) === 'object' ? _fileUri.contents : null;
            fileUri = (typeof _fileUri === 'undefined' ? 'undefined' : _typeof(_fileUri)) === 'object' ? _fileUri.uri : _fileUri;

            if (!(fileContents == null)) {
              _context.next = 6;
              break;
            }

            _context.next = 5;
            return fetch(fileUri).then(function (res) {
              return res.text();
            });

          case 5:
            fileContents = _context.sent;

          case 6:
            _context.next = 8;
            return Object(__WEBPACK_IMPORTED_MODULE_2__getSourceMap__["a" /* getSourceMap */])(fileUri, fileContents);

          case 8:
            map = _context.sent;
            return _context.abrupt('return', frames.map(function (frame) {
              var functionName = frame.functionName,
                  lineNumber = frame.lineNumber,
                  columnNumber = frame.columnNumber,
                  _originalLineNumber = frame._originalLineNumber;

              if (_originalLineNumber != null) {
                return frame;
              }
              var fileName = frame.fileName;

              if (fileName) {
                // The web version of this module only provides POSIX support, so Windows
                // paths like C:\foo\\baz\..\\bar\ cannot be normalized.
                // A simple solution to this is to replace all `\` with `/`, then
                // normalize afterwards.
                fileName = __WEBPACK_IMPORTED_MODULE_4_path___default.a.normalize(fileName.replace(/[\\]+/g, '/'));
              }
              if (fileName == null) {
                return frame;
              }
              var fN = fileName;
              var source = map.getSources()
              // Prepare path for normalization; see comment above for reasoning.
              .map(function (s) {
                return s.replace(/[\\]+/g, '/');
              }).filter(function (p) {
                p = __WEBPACK_IMPORTED_MODULE_4_path___default.a.normalize(p);
                var i = p.lastIndexOf(fN);
                return i !== -1 && i === p.length - fN.length;
              }).map(function (p) {
                return {
                  token: p,
                  seps: count(__WEBPACK_IMPORTED_MODULE_4_path___default.a.sep, __WEBPACK_IMPORTED_MODULE_4_path___default.a.normalize(p)),
                  penalties: count('node_modules', p) + count('~', p)
                };
              }).sort(function (a, b) {
                var s = Math.sign(a.seps - b.seps);
                if (s !== 0) {
                  return s;
                }
                return Math.sign(a.penalties - b.penalties);
              });
              if (source.length < 1 || lineNumber == null) {
                return new __WEBPACK_IMPORTED_MODULE_1__stack_frame__["b" /* default */](null, null, null, null, null, functionName, fN, lineNumber, columnNumber, null);
              }
              var sourceT = source[0].token;

              var _map$getGeneratedPosi = map.getGeneratedPosition(sourceT, lineNumber,
              // $FlowFixMe
              columnNumber),
                  line = _map$getGeneratedPosi.line,
                  column = _map$getGeneratedPosi.column;

              var originalSource = map.getSource(sourceT);
              return new __WEBPACK_IMPORTED_MODULE_1__stack_frame__["b" /* default */](functionName, fileUri, line, column || null, Object(__WEBPACK_IMPORTED_MODULE_3__getLinesAround__["a" /* getLinesAround */])(line, contextLines, fileContents || []), functionName, fN, lineNumber, columnNumber, Object(__WEBPACK_IMPORTED_MODULE_3__getLinesAround__["a" /* getLinesAround */])(lineNumber, contextLines, originalSource));
            }));

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function unmap(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */






function count(search, string) {
  // Count starts at -1 becuse a do-while loop always runs at least once
  var count = -1,
      index = -1;
  do {
    // First call or the while case evaluated true, meaning we have to make
    // count 0 or we found a character
    ++count;
    // Find the index of our search string, starting after the previous index
    index = string.indexOf(search, index + 1);
  } while (index !== -1);
  return count;
}


/* unused harmony default export */ var _unused_webpack_default_export = (unmap);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return iframeStyle; });
/* unused harmony export overlayStyle */
/* unused harmony export primaryErrorStyle */
/* unused harmony export secondaryErrorStyle */
/* unused harmony export black */
/* unused harmony export darkGray */
/* unused harmony export red */
/* unused harmony export redTransparent */
/* unused harmony export yellowTransparent */
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var black = '#293238',
    darkGray = '#878e91',
    red = '#ce1126',
    redTransparent = 'rgba(206, 17, 38, 0.05)',
    lightRed = '#fccfcf',
    yellow = '#fbf5b4',
    yellowTransparent = 'rgba(251, 245, 180, 0.3)',
    white = '#ffffff';

var iframeStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  border: 'none',
  'z-index': 2147483647
};

var overlayStyle = {
  width: '100%',
  height: '100%',
  'box-sizing': 'border-box',
  'text-align': 'center',
  'background-color': white
};

var primaryErrorStyle = {
  'background-color': lightRed
};

var secondaryErrorStyle = {
  'background-color': yellow
};



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getHead */
/* unused harmony export injectCss */
/* unused harmony export removeCss */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return applyStyles; });
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var injectedCount = 0;
var injectedCache = {};

function getHead(document) {
  return document.head || document.getElementsByTagName('head')[0];
}

function injectCss(document, css) {
  var head = getHead(document);
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);

  injectedCache[++injectedCount] = style;
  return injectedCount;
}

function removeCss(document, ref) {
  if (injectedCache[ref] == null) {
    return;
  }
  var head = getHead(document);
  head.removeChild(injectedCache[ref]);
  delete injectedCache[ref];
}

function applyStyles(element, styles) {
  element.setAttribute('style', '');
  for (var key in styles) {
    if (!styles.hasOwnProperty(key)) {
      continue;
    }
    // $FlowFixMe
    element.style[key] = styles[key];
  }
}



/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "!function(e){function t(n){if(u[n])return u[n].exports;var r=u[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var u={};t.m=e,t.c=u,t.d=function(e,u,n){t.o(e,u)||Object.defineProperty(e,u,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var u=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(u,\"a\",u),u},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p=\"\",t(t.s=17)}([function(e,t,u){\"use strict\";e.exports=u(23)},function(e,t,u){\"use strict\";u.d(t,\"c\",function(){return l}),u.d(t,\"d\",function(){return c}),u.d(t,\"g\",function(){return s}),u.d(t,\"a\",function(){return n}),u.d(t,\"b\",function(){return r}),u.d(t,\"e\",function(){return o}),u.d(t,\"f\",function(){return a}),u.d(t,\"h\",function(){return i});var n=\"#293238\",r=\"#878e91\",o=\"#ce1126\",a=\"rgba(206, 17, 38, 0.05)\",i=\"rgba(251, 245, 180, 0.3)\",l={width:\"100%\",height:\"100%\",\"box-sizing\":\"border-box\",\"text-align\":\"center\",\"background-color\":\"#ffffff\"},c={\"background-color\":\"#fccfcf\"},s={\"background-color\":\"#fbf5b4\"}},function(e,t,u){\"use strict\";function n(e){if(null===e||void 0===e)throw new TypeError(\"Object.assign cannot be called with null or undefined\");return Object(e)}var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String(\"abc\");if(e[5]=\"de\",\"5\"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},u=0;u<10;u++)t[\"_\"+String.fromCharCode(u)]=u;if(\"0123456789\"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(\"\"))return!1;var n={};return\"abcdefghijklmnopqrst\".split(\"\").forEach(function(e){n[e]=e}),\"abcdefghijklmnopqrst\"===Object.keys(Object.assign({},n)).join(\"\")}catch(e){return!1}}()?Object.assign:function(e,t){for(var u,i,l=n(e),c=1;c<arguments.length;c++){u=Object(arguments[c]);for(var s in u)o.call(u,s)&&(l[s]=u[s]);if(r){i=r(u);for(var f=0;f<i.length;f++)a.call(u,i[f])&&(l[i[f]]=u[i[f]])}}return l}},function(e,t,u){\"use strict\";function n(e){return function(){return e}}var r=function(){};r.thatReturns=n,r.thatReturnsFalse=n(!1),r.thatReturnsTrue=n(!0),r.thatReturnsNull=n(null),r.thatReturnsThis=function(){return this},r.thatReturnsArgument=function(e){return e},e.exports=r},function(e,t,u){\"use strict\";function n(){}function r(e){try{return e.then}catch(e){return g=e,C}}function o(e,t){try{return e(t)}catch(e){return g=e,C}}function a(e,t,u){try{e(t,u)}catch(e){return g=e,C}}function i(e){if(\"object\"!==typeof this)throw new TypeError(\"Promises must be constructed via new\");if(\"function\"!==typeof e)throw new TypeError(\"Promise constructor's argument is not a function\");this._75=0,this._83=0,this._18=null,this._38=null,e!==n&&h(e,this)}function l(e,t,u){return new e.constructor(function(r,o){var a=new i(n);a.then(r,o),c(e,new D(t,u,a))})}function c(e,t){for(;3===e._83;)e=e._18;if(i._47&&i._47(e),0===e._83)return 0===e._75?(e._75=1,void(e._38=t)):1===e._75?(e._75=2,void(e._38=[e._38,t])):void e._38.push(t);s(e,t)}function s(e,t){m(function(){var u=1===e._83?t.onFulfilled:t.onRejected;if(null===u)return void(1===e._83?f(t.promise,e._18):p(t.promise,e._18));var n=o(u,e._18);n===C?p(t.promise,g):f(t.promise,n)})}function f(e,t){if(t===e)return p(e,new TypeError(\"A promise cannot be resolved with itself.\"));if(t&&(\"object\"===typeof t||\"function\"===typeof t)){var u=r(t);if(u===C)return p(e,g);if(u===e.then&&t instanceof i)return e._83=3,e._18=t,void d(e);if(\"function\"===typeof u)return void h(u.bind(t),e)}e._83=1,e._18=t,d(e)}function p(e,t){e._83=2,e._18=t,i._71&&i._71(e,t),d(e)}function d(e){if(1===e._75&&(c(e,e._38),e._38=null),2===e._75){for(var t=0;t<e._38.length;t++)c(e,e._38[t]);e._38=null}}function D(e,t,u){this.onFulfilled=\"function\"===typeof e?e:null,this.onRejected=\"function\"===typeof t?t:null,this.promise=u}function h(e,t){var u=!1,n=a(e,function(e){u||(u=!0,f(t,e))},function(e){u||(u=!0,p(t,e))});u||n!==C||(u=!0,p(t,g))}var m=u(20),g=null,C={};e.exports=i,i._47=null,i._71=null,i._44=n,i.prototype.then=function(e,t){if(this.constructor!==i)return l(this,e,t);var u=new i(n);return c(this,new D(e,t,u)),u}},function(e,t,u){\"use strict\";var n={};e.exports=n},function(e,t,u){\"use strict\";function n(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}function r(e,t){if(!e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!t||\"object\"!==typeof t&&\"function\"!==typeof t?e:t}function o(e,t){if(\"function\"!==typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=u(0),i=u.n(a),l=u(1),c=function(){function e(e,t){for(var u=0;u<t.length;u++){var n=t[u];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,u,n){return u&&e(t.prototype,u),n&&e(t,n),t}}(),s={position:\"relative\",display:\"inline-flex\",flexDirection:\"column\",height:\"100%\",width:\"1024px\",maxWidth:\"100%\",overflowX:\"hidden\",overflowY:\"auto\",padding:\"0.5rem\",boxSizing:\"border-box\",textAlign:\"left\",fontFamily:\"Consolas, Menlo, monospace\",fontSize:\"11px\",whiteSpace:\"pre-wrap\",wordBreak:\"break-word\",lineHeight:1.5,color:l.a},f=function(e){function t(){var e,u,o,a;n(this,t);for(var i=arguments.length,l=Array(i),c=0;c<i;c++)l[c]=arguments[c];return u=o=r(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),o.iframeWindow=null,o.getIframeWindow=function(e){if(e){var t=e.ownerDocument;o.iframeWindow=t.defaultView}},o.onKeyDown=function(e){var t=o.props.shortcutHandler;t&&t(e.key)},a=u,r(o,a)}return o(t,e),c(t,[{key:\"componentDidMount\",value:function(){window.addEventListener(\"keydown\",this.onKeyDown),this.iframeWindow&&this.iframeWindow.addEventListener(\"keydown\",this.onKeyDown)}},{key:\"componentWillUnmount\",value:function(){window.removeEventListener(\"keydown\",this.onKeyDown),this.iframeWindow&&this.iframeWindow.removeEventListener(\"keydown\",this.onKeyDown)}},{key:\"render\",value:function(){return i.a.createElement(\"div\",{style:s,ref:this.getIframeWindow},this.props.children)}}]),t}(a.Component);t.a=f},function(e,t,u){\"use strict\";function n(e){return o.a.createElement(\"div\",{style:i},e.line1,o.a.createElement(\"br\",null),e.line2)}var r=u(0),o=u.n(r),a=u(1),i={fontFamily:\"sans-serif\",color:a.b,marginTop:\"0.5rem\",flex:\"0 0 auto\"};t.a=n},function(e,t,u){\"use strict\";function n(e){return o.a.createElement(\"div\",{style:i},e.headerText)}var r=u(0),o=u.n(r),a=u(1),i={fontSize:\"2em\",fontFamily:\"sans-serif\",color:a.e,whiteSpace:\"pre-wrap\",margin:\"0 2rem 0.75rem 0\",flex:\"0 0 auto\",maxHeight:\"50%\",overflow:\"auto\"};t.a=n},function(e,t,u){\"use strict\";function n(e){var t=e.main?l:c,u={__html:e.codeHTML};return o.a.createElement(\"pre\",{style:t},o.a.createElement(\"code\",{style:s,dangerouslySetInnerHTML:u}))}var r=u(0),o=u.n(r),a=u(1),i={display:\"block\",padding:\"0.5em\",marginTop:\"0.5em\",marginBottom:\"0.5em\",overflowX:\"auto\",whiteSpace:\"pre-wrap\",borderRadius:\"0.25rem\"},l=Object.assign({},i,{backgroundColor:a.f}),c=Object.assign({},i,{backgroundColor:a.h}),s={fontFamily:\"Consolas, Menlo, monospace\"};t.a=n},function(e,t,u){\"use strict\";function n(e){for(var t=(new o.a).ansiToJson(i.encode(e),{use_classes:!0}),u=\"\",n=!1,r=0;r<t.length;++r)for(var a=t[r],s=a.content,f=a.fg,p=s.split(\"\\n\"),d=0;d<p.length;++d){n||(u+='<span data-ansi-line=\"true\">',n=!0);var D=p[d].replace(\"\\r\",\"\"),h=l[c[f]];null!=h?u+='<span style=\"color: #'+h+';\">'+D+\"</span>\":(null!=f&&console.log(\"Missing color mapping: \",f),u+=\"<span>\"+D+\"</span>\"),d<p.length-1&&(u+=\"</span>\",n=!1,u+=\"<br/>\")}return n&&(u+=\"</span>\",n=!1),u}var r=u(11),o=u.n(r),a=u(35),i=(u.n(a),new a.AllHtmlEntities),l={reset:[\"333333\",\"transparent\"],black:\"333333\",red:\"881280\",green:\"1155cc\",yellow:\"881280\",blue:\"994500\",magenta:\"994500\",cyan:\"c80000\",gray:\"6e6e6e\",lightgrey:\"f5f5f5\",darkgrey:\"6e6e6e\"},c={\"ansi-bright-black\":\"black\",\"ansi-bright-yellow\":\"yellow\",\"ansi-yellow\":\"yellow\",\"ansi-bright-green\":\"green\",\"ansi-green\":\"green\",\"ansi-bright-cyan\":\"cyan\",\"ansi-cyan\":\"cyan\",\"ansi-bright-red\":\"red\",\"ansi-red\":\"red\",\"ansi-bright-magenta\":\"magenta\",\"ansi-magenta\":\"magenta\",\"ansi-white\":\"darkgrey\"};t.a=n},function(e,t,u){\"use strict\";function n(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}var r=function(){function e(e,t){for(var u=0;u<t.length;u++){var n=t[u];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,u,n){return u&&e(t.prototype,u),n&&e(t,n),t}}(),o=[[{color:\"0, 0, 0\",class:\"ansi-black\"},{color:\"187, 0, 0\",class:\"ansi-red\"},{color:\"0, 187, 0\",class:\"ansi-green\"},{color:\"187, 187, 0\",class:\"ansi-yellow\"},{color:\"0, 0, 187\",class:\"ansi-blue\"},{color:\"187, 0, 187\",class:\"ansi-magenta\"},{color:\"0, 187, 187\",class:\"ansi-cyan\"},{color:\"255,255,255\",class:\"ansi-white\"}],[{color:\"85, 85, 85\",class:\"ansi-bright-black\"},{color:\"255, 85, 85\",class:\"ansi-bright-red\"},{color:\"0, 255, 0\",class:\"ansi-bright-green\"},{color:\"255, 255, 85\",class:\"ansi-bright-yellow\"},{color:\"85, 85, 255\",class:\"ansi-bright-blue\"},{color:\"255, 85, 255\",class:\"ansi-bright-magenta\"},{color:\"85, 255, 255\",class:\"ansi-bright-cyan\"},{color:\"255, 255, 255\",class:\"ansi-bright-white\"}]],a=function(){function e(){n(this,e),this.fg=this.bg=this.fg_truecolor=this.bg_truecolor=null,this.bright=0}return r(e,null,[{key:\"escapeForHtml\",value:function(t){return(new e).escapeForHtml(t)}},{key:\"linkify\",value:function(t){return(new e).linkify(t)}},{key:\"ansiToHtml\",value:function(t,u){return(new e).ansiToHtml(t,u)}},{key:\"ansiToJson\",value:function(t,u){return(new e).ansiToJson(t,u)}},{key:\"ansiToText\",value:function(t){return(new e).ansiToText(t)}}]),r(e,[{key:\"setupPalette\",value:function(){this.PALETTE_COLORS=[];for(var e=0;e<2;++e)for(var t=0;t<8;++t)this.PALETTE_COLORS.push(o[e][t].color);for(var u=[0,95,135,175,215,255],n=function(e,t,n){return u[e]+\", \"+u[t]+\", \"+u[n]},r=0;r<6;++r)for(var a=0;a<6;++a)for(var i=0;i<6;++i)this.PALETTE_COLORS.push(n(r,a,i));for(var l=8,c=0;c<24;++c,l+=10)this.PALETTE_COLORS.push(n(l,l,l))}},{key:\"escapeForHtml\",value:function(e){return e.replace(/[&<>]/gm,function(e){return\"&\"==e?\"&amp;\":\"<\"==e?\"&lt;\":\">\"==e?\"&gt;\":\"\"})}},{key:\"linkify\",value:function(e){return e.replace(/(https?:\\/\\/[^\\s]+)/gm,function(e){return'<a href=\"'+e+'\">'+e+\"</a>\"})}},{key:\"ansiToHtml\",value:function(e,t){return this.process(e,t,!0)}},{key:\"ansiToJson\",value:function(e,t){return t=t||{},t.json=!0,t.clearLine=!1,this.process(e,t,!0)}},{key:\"ansiToText\",value:function(e){return this.process(e,{},!1)}},{key:\"process\",value:function(e,t,u){var n=this,r=this,o=e.split(/\\033\\[/),a=o.shift();void 0!==t&&null!==t||(t={}),t.clearLine=/\\r/.test(e);var i=o.map(function(e){return n.processChunk(e,t,u)});if(t&&t.json){var l=r.processChunkJson(\"\");return l.content=a,l.clearLine=t.clearLine,i.unshift(l),t.remove_empty&&(i=i.filter(function(e){return!e.isEmpty()})),i}return i.unshift(a),i.join(\"\")}},{key:\"processChunkJson\",value:function(e,t,u){t=\"undefined\"==typeof t?{}:t;var n=t.use_classes=\"undefined\"!=typeof t.use_classes&&t.use_classes,r=t.key=n?\"class\":\"color\",a={content:e,fg:null,bg:null,fg_truecolor:null,bg_truecolor:null,clearLine:t.clearLine,decoration:null,was_processed:!1,isEmpty:function(){return!a.content}},i=e.match(/^([!\\x3c-\\x3f]*)([\\d;]*)([\\x20-\\x2c]*[\\x40-\\x7e])([\\s\\S]*)/m);if(!i)return a;var l=(a.content=i[4],i[2].split(\";\"));if(\"\"!==i[1]||\"m\"!==i[3])return a;if(!u)return a;var c=this;for(c.decoration=null;l.length>0;){var s=l.shift(),f=parseInt(s);if(isNaN(f)||0===f)c.fg=c.bg=c.decoration=null;else if(1===f)c.decoration=\"bold\";else if(2===f)c.decoration=\"dim\";else if(3==f)c.decoration=\"italic\";else if(4==f)c.decoration=\"underline\";else if(5==f)c.decoration=\"blink\";else if(7===f)c.decoration=\"reverse\";else if(8===f)c.decoration=\"hidden\";else if(9===f)c.decoration=\"strikethrough\";else if(39==f)c.fg=null;else if(49==f)c.bg=null;else if(f>=30&&f<38)c.fg=o[0][f%10][r];else if(f>=90&&f<98)c.fg=o[1][f%10][r];else if(f>=40&&f<48)c.bg=o[0][f%10][r];else if(f>=100&&f<108)c.bg=o[1][f%10][r];else if(38===f||48===f){var p=38===f;if(l.length>=1){var d=l.shift();if(\"5\"===d&&l.length>=1){var D=parseInt(l.shift());if(D>=0&&D<=255)if(n){var h=D>=16?\"ansi-palette-\"+D:o[D>7?1:0][D%8].class;p?c.fg=h:c.bg=h}else this.PALETTE_COLORS||c.setupPalette(),p?c.fg=this.PALETTE_COLORS[D]:c.bg=this.PALETTE_COLORS[D]}else if(\"2\"===d&&l.length>=3){var m=parseInt(l.shift()),g=parseInt(l.shift()),C=parseInt(l.shift());if(m>=0&&m<=255&&g>=0&&g<=255&&C>=0&&C<=255){var A=m+\", \"+g+\", \"+C;n?p?(c.fg=\"ansi-truecolor\",c.fg_truecolor=A):(c.bg=\"ansi-truecolor\",c.bg_truecolor=A):p?c.fg=A:c.bg=A}}}}}if(null===c.fg&&null===c.bg&&null===c.decoration)return a;return a.fg=c.fg,a.bg=c.bg,a.fg_truecolor=c.fg_truecolor,a.bg_truecolor=c.bg_truecolor,a.decoration=c.decoration,a.was_processed=!0,a}},{key:\"processChunk\",value:function(e,t,u){var n=this;t=t||{};var r=this.processChunkJson(e,t,u);if(t.json)return r;if(r.isEmpty())return\"\";if(!r.was_processed)return r.content;var o=t.use_classes,a=[],i=[],l={},c=function(e){var t=[],u=void 0;for(u in e)e.hasOwnProperty(u)&&t.push(\"data-\"+u+'=\"'+n.escapeForHtml(e[u])+'\"');return t.length>0?\" \"+t.join(\" \"):\"\"};return r.fg&&(o?(i.push(r.fg+\"-fg\"),null!==r.fg_truecolor&&(l[\"ansi-truecolor-fg\"]=r.fg_truecolor,r.fg_truecolor=null)):a.push(\"color:rgb(\"+r.fg+\")\")),r.bg&&(o?(i.push(r.bg+\"-bg\"),null!==r.bg_truecolor&&(l[\"ansi-truecolor-bg\"]=r.bg_truecolor,r.bg_truecolor=null)):a.push(\"background-color:rgb(\"+r.bg+\")\")),r.decoration&&(o?i.push(\"ansi-\"+r.decoration):\"bold\"===r.decoration?a.push(\"font-weight:bold\"):\"dim\"===r.decoration?a.push(\"opacity:0.5\"):\"italic\"===r.decoration?a.push(\"font-style:italic\"):\"reverse\"===r.decoration?a.push(\"filter:invert(100%)\"):\"hidden\"===r.decoration?a.push(\"visibility:hidden\"):\"strikethrough\"===r.decoration?a.push(\"text-decoration:line-through\"):a.push(\"text-decoration:\"+r.decoration)),o?'<span class=\"'+i.join(\" \")+'\"'+c(l)+\">\"+r.content+\"</span>\":'<span style=\"'+a.join(\";\")+'\"'+c(l)+\">\"+r.content+\"</span>\"}}]),e}();e.exports=a},function(e,t){function u(){}var n=[[\"Aacute\",[193]],[\"aacute\",[225]],[\"Abreve\",[258]],[\"abreve\",[259]],[\"ac\",[8766]],[\"acd\",[8767]],[\"acE\",[8766,819]],[\"Acirc\",[194]],[\"acirc\",[226]],[\"acute\",[180]],[\"Acy\",[1040]],[\"acy\",[1072]],[\"AElig\",[198]],[\"aelig\",[230]],[\"af\",[8289]],[\"Afr\",[120068]],[\"afr\",[120094]],[\"Agrave\",[192]],[\"agrave\",[224]],[\"alefsym\",[8501]],[\"aleph\",[8501]],[\"Alpha\",[913]],[\"alpha\",[945]],[\"Amacr\",[256]],[\"amacr\",[257]],[\"amalg\",[10815]],[\"amp\",[38]],[\"AMP\",[38]],[\"andand\",[10837]],[\"And\",[10835]],[\"and\",[8743]],[\"andd\",[10844]],[\"andslope\",[10840]],[\"andv\",[10842]],[\"ang\",[8736]],[\"ange\",[10660]],[\"angle\",[8736]],[\"angmsdaa\",[10664]],[\"angmsdab\",[10665]],[\"angmsdac\",[10666]],[\"angmsdad\",[10667]],[\"angmsdae\",[10668]],[\"angmsdaf\",[10669]],[\"angmsdag\",[10670]],[\"angmsdah\",[10671]],[\"angmsd\",[8737]],[\"angrt\",[8735]],[\"angrtvb\",[8894]],[\"angrtvbd\",[10653]],[\"angsph\",[8738]],[\"angst\",[197]],[\"angzarr\",[9084]],[\"Aogon\",[260]],[\"aogon\",[261]],[\"Aopf\",[120120]],[\"aopf\",[120146]],[\"apacir\",[10863]],[\"ap\",[8776]],[\"apE\",[10864]],[\"ape\",[8778]],[\"apid\",[8779]],[\"apos\",[39]],[\"ApplyFunction\",[8289]],[\"approx\",[8776]],[\"approxeq\",[8778]],[\"Aring\",[197]],[\"aring\",[229]],[\"Ascr\",[119964]],[\"ascr\",[119990]],[\"Assign\",[8788]],[\"ast\",[42]],[\"asymp\",[8776]],[\"asympeq\",[8781]],[\"Atilde\",[195]],[\"atilde\",[227]],[\"Auml\",[196]],[\"auml\",[228]],[\"awconint\",[8755]],[\"awint\",[10769]],[\"backcong\",[8780]],[\"backepsilon\",[1014]],[\"backprime\",[8245]],[\"backsim\",[8765]],[\"backsimeq\",[8909]],[\"Backslash\",[8726]],[\"Barv\",[10983]],[\"barvee\",[8893]],[\"barwed\",[8965]],[\"Barwed\",[8966]],[\"barwedge\",[8965]],[\"bbrk\",[9141]],[\"bbrktbrk\",[9142]],[\"bcong\",[8780]],[\"Bcy\",[1041]],[\"bcy\",[1073]],[\"bdquo\",[8222]],[\"becaus\",[8757]],[\"because\",[8757]],[\"Because\",[8757]],[\"bemptyv\",[10672]],[\"bepsi\",[1014]],[\"bernou\",[8492]],[\"Bernoullis\",[8492]],[\"Beta\",[914]],[\"beta\",[946]],[\"beth\",[8502]],[\"between\",[8812]],[\"Bfr\",[120069]],[\"bfr\",[120095]],[\"bigcap\",[8898]],[\"bigcirc\",[9711]],[\"bigcup\",[8899]],[\"bigodot\",[10752]],[\"bigoplus\",[10753]],[\"bigotimes\",[10754]],[\"bigsqcup\",[10758]],[\"bigstar\",[9733]],[\"bigtriangledown\",[9661]],[\"bigtriangleup\",[9651]],[\"biguplus\",[10756]],[\"bigvee\",[8897]],[\"bigwedge\",[8896]],[\"bkarow\",[10509]],[\"blacklozenge\",[10731]],[\"blacksquare\",[9642]],[\"blacktriangle\",[9652]],[\"blacktriangledown\",[9662]],[\"blacktriangleleft\",[9666]],[\"blacktriangleright\",[9656]],[\"blank\",[9251]],[\"blk12\",[9618]],[\"blk14\",[9617]],[\"blk34\",[9619]],[\"block\",[9608]],[\"bne\",[61,8421]],[\"bnequiv\",[8801,8421]],[\"bNot\",[10989]],[\"bnot\",[8976]],[\"Bopf\",[120121]],[\"bopf\",[120147]],[\"bot\",[8869]],[\"bottom\",[8869]],[\"bowtie\",[8904]],[\"boxbox\",[10697]],[\"boxdl\",[9488]],[\"boxdL\",[9557]],[\"boxDl\",[9558]],[\"boxDL\",[9559]],[\"boxdr\",[9484]],[\"boxdR\",[9554]],[\"boxDr\",[9555]],[\"boxDR\",[9556]],[\"boxh\",[9472]],[\"boxH\",[9552]],[\"boxhd\",[9516]],[\"boxHd\",[9572]],[\"boxhD\",[9573]],[\"boxHD\",[9574]],[\"boxhu\",[9524]],[\"boxHu\",[9575]],[\"boxhU\",[9576]],[\"boxHU\",[9577]],[\"boxminus\",[8863]],[\"boxplus\",[8862]],[\"boxtimes\",[8864]],[\"boxul\",[9496]],[\"boxuL\",[9563]],[\"boxUl\",[9564]],[\"boxUL\",[9565]],[\"boxur\",[9492]],[\"boxuR\",[9560]],[\"boxUr\",[9561]],[\"boxUR\",[9562]],[\"boxv\",[9474]],[\"boxV\",[9553]],[\"boxvh\",[9532]],[\"boxvH\",[9578]],[\"boxVh\",[9579]],[\"boxVH\",[9580]],[\"boxvl\",[9508]],[\"boxvL\",[9569]],[\"boxVl\",[9570]],[\"boxVL\",[9571]],[\"boxvr\",[9500]],[\"boxvR\",[9566]],[\"boxVr\",[9567]],[\"boxVR\",[9568]],[\"bprime\",[8245]],[\"breve\",[728]],[\"Breve\",[728]],[\"brvbar\",[166]],[\"bscr\",[119991]],[\"Bscr\",[8492]],[\"bsemi\",[8271]],[\"bsim\",[8765]],[\"bsime\",[8909]],[\"bsolb\",[10693]],[\"bsol\",[92]],[\"bsolhsub\",[10184]],[\"bull\",[8226]],[\"bullet\",[8226]],[\"bump\",[8782]],[\"bumpE\",[10926]],[\"bumpe\",[8783]],[\"Bumpeq\",[8782]],[\"bumpeq\",[8783]],[\"Cacute\",[262]],[\"cacute\",[263]],[\"capand\",[10820]],[\"capbrcup\",[10825]],[\"capcap\",[10827]],[\"cap\",[8745]],[\"Cap\",[8914]],[\"capcup\",[10823]],[\"capdot\",[10816]],[\"CapitalDifferentialD\",[8517]],[\"caps\",[8745,65024]],[\"caret\",[8257]],[\"caron\",[711]],[\"Cayleys\",[8493]],[\"ccaps\",[10829]],[\"Ccaron\",[268]],[\"ccaron\",[269]],[\"Ccedil\",[199]],[\"ccedil\",[231]],[\"Ccirc\",[264]],[\"ccirc\",[265]],[\"Cconint\",[8752]],[\"ccups\",[10828]],[\"ccupssm\",[10832]],[\"Cdot\",[266]],[\"cdot\",[267]],[\"cedil\",[184]],[\"Cedilla\",[184]],[\"cemptyv\",[10674]],[\"cent\",[162]],[\"centerdot\",[183]],[\"CenterDot\",[183]],[\"cfr\",[120096]],[\"Cfr\",[8493]],[\"CHcy\",[1063]],[\"chcy\",[1095]],[\"check\",[10003]],[\"checkmark\",[10003]],[\"Chi\",[935]],[\"chi\",[967]],[\"circ\",[710]],[\"circeq\",[8791]],[\"circlearrowleft\",[8634]],[\"circlearrowright\",[8635]],[\"circledast\",[8859]],[\"circledcirc\",[8858]],[\"circleddash\",[8861]],[\"CircleDot\",[8857]],[\"circledR\",[174]],[\"circledS\",[9416]],[\"CircleMinus\",[8854]],[\"CirclePlus\",[8853]],[\"CircleTimes\",[8855]],[\"cir\",[9675]],[\"cirE\",[10691]],[\"cire\",[8791]],[\"cirfnint\",[10768]],[\"cirmid\",[10991]],[\"cirscir\",[10690]],[\"ClockwiseContourIntegral\",[8754]],[\"clubs\",[9827]],[\"clubsuit\",[9827]],[\"colon\",[58]],[\"Colon\",[8759]],[\"Colone\",[10868]],[\"colone\",[8788]],[\"coloneq\",[8788]],[\"comma\",[44]],[\"commat\",[64]],[\"comp\",[8705]],[\"compfn\",[8728]],[\"complement\",[8705]],[\"complexes\",[8450]],[\"cong\",[8773]],[\"congdot\",[10861]],[\"Congruent\",[8801]],[\"conint\",[8750]],[\"Conint\",[8751]],[\"ContourIntegral\",[8750]],[\"copf\",[120148]],[\"Copf\",[8450]],[\"coprod\",[8720]],[\"Coproduct\",[8720]],[\"copy\",[169]],[\"COPY\",[169]],[\"copysr\",[8471]],[\"CounterClockwiseContourIntegral\",[8755]],[\"crarr\",[8629]],[\"cross\",[10007]],[\"Cross\",[10799]],[\"Cscr\",[119966]],[\"cscr\",[119992]],[\"csub\",[10959]],[\"csube\",[10961]],[\"csup\",[10960]],[\"csupe\",[10962]],[\"ctdot\",[8943]],[\"cudarrl\",[10552]],[\"cudarrr\",[10549]],[\"cuepr\",[8926]],[\"cuesc\",[8927]],[\"cularr\",[8630]],[\"cularrp\",[10557]],[\"cupbrcap\",[10824]],[\"cupcap\",[10822]],[\"CupCap\",[8781]],[\"cup\",[8746]],[\"Cup\",[8915]],[\"cupcup\",[10826]],[\"cupdot\",[8845]],[\"cupor\",[10821]],[\"cups\",[8746,65024]],[\"curarr\",[8631]],[\"curarrm\",[10556]],[\"curlyeqprec\",[8926]],[\"curlyeqsucc\",[8927]],[\"curlyvee\",[8910]],[\"curlywedge\",[8911]],[\"curren\",[164]],[\"curvearrowleft\",[8630]],[\"curvearrowright\",[8631]],[\"cuvee\",[8910]],[\"cuwed\",[8911]],[\"cwconint\",[8754]],[\"cwint\",[8753]],[\"cylcty\",[9005]],[\"dagger\",[8224]],[\"Dagger\",[8225]],[\"daleth\",[8504]],[\"darr\",[8595]],[\"Darr\",[8609]],[\"dArr\",[8659]],[\"dash\",[8208]],[\"Dashv\",[10980]],[\"dashv\",[8867]],[\"dbkarow\",[10511]],[\"dblac\",[733]],[\"Dcaron\",[270]],[\"dcaron\",[271]],[\"Dcy\",[1044]],[\"dcy\",[1076]],[\"ddagger\",[8225]],[\"ddarr\",[8650]],[\"DD\",[8517]],[\"dd\",[8518]],[\"DDotrahd\",[10513]],[\"ddotseq\",[10871]],[\"deg\",[176]],[\"Del\",[8711]],[\"Delta\",[916]],[\"delta\",[948]],[\"demptyv\",[10673]],[\"dfisht\",[10623]],[\"Dfr\",[120071]],[\"dfr\",[120097]],[\"dHar\",[10597]],[\"dharl\",[8643]],[\"dharr\",[8642]],[\"DiacriticalAcute\",[180]],[\"DiacriticalDot\",[729]],[\"DiacriticalDoubleAcute\",[733]],[\"DiacriticalGrave\",[96]],[\"DiacriticalTilde\",[732]],[\"diam\",[8900]],[\"diamond\",[8900]],[\"Diamond\",[8900]],[\"diamondsuit\",[9830]],[\"diams\",[9830]],[\"die\",[168]],[\"DifferentialD\",[8518]],[\"digamma\",[989]],[\"disin\",[8946]],[\"div\",[247]],[\"divide\",[247]],[\"divideontimes\",[8903]],[\"divonx\",[8903]],[\"DJcy\",[1026]],[\"djcy\",[1106]],[\"dlcorn\",[8990]],[\"dlcrop\",[8973]],[\"dollar\",[36]],[\"Dopf\",[120123]],[\"dopf\",[120149]],[\"Dot\",[168]],[\"dot\",[729]],[\"DotDot\",[8412]],[\"doteq\",[8784]],[\"doteqdot\",[8785]],[\"DotEqual\",[8784]],[\"dotminus\",[8760]],[\"dotplus\",[8724]],[\"dotsquare\",[8865]],[\"doublebarwedge\",[8966]],[\"DoubleContourIntegral\",[8751]],[\"DoubleDot\",[168]],[\"DoubleDownArrow\",[8659]],[\"DoubleLeftArrow\",[8656]],[\"DoubleLeftRightArrow\",[8660]],[\"DoubleLeftTee\",[10980]],[\"DoubleLongLeftArrow\",[10232]],[\"DoubleLongLeftRightArrow\",[10234]],[\"DoubleLongRightArrow\",[10233]],[\"DoubleRightArrow\",[8658]],[\"DoubleRightTee\",[8872]],[\"DoubleUpArrow\",[8657]],[\"DoubleUpDownArrow\",[8661]],[\"DoubleVerticalBar\",[8741]],[\"DownArrowBar\",[10515]],[\"downarrow\",[8595]],[\"DownArrow\",[8595]],[\"Downarrow\",[8659]],[\"DownArrowUpArrow\",[8693]],[\"DownBreve\",[785]],[\"downdownarrows\",[8650]],[\"downharpoonleft\",[8643]],[\"downharpoonright\",[8642]],[\"DownLeftRightVector\",[10576]],[\"DownLeftTeeVector\",[10590]],[\"DownLeftVectorBar\",[10582]],[\"DownLeftVector\",[8637]],[\"DownRightTeeVector\",[10591]],[\"DownRightVectorBar\",[10583]],[\"DownRightVector\",[8641]],[\"DownTeeArrow\",[8615]],[\"DownTee\",[8868]],[\"drbkarow\",[10512]],[\"drcorn\",[8991]],[\"drcrop\",[8972]],[\"Dscr\",[119967]],[\"dscr\",[119993]],[\"DScy\",[1029]],[\"dscy\",[1109]],[\"dsol\",[10742]],[\"Dstrok\",[272]],[\"dstrok\",[273]],[\"dtdot\",[8945]],[\"dtri\",[9663]],[\"dtrif\",[9662]],[\"duarr\",[8693]],[\"duhar\",[10607]],[\"dwangle\",[10662]],[\"DZcy\",[1039]],[\"dzcy\",[1119]],[\"dzigrarr\",[10239]],[\"Eacute\",[201]],[\"eacute\",[233]],[\"easter\",[10862]],[\"Ecaron\",[282]],[\"ecaron\",[283]],[\"Ecirc\",[202]],[\"ecirc\",[234]],[\"ecir\",[8790]],[\"ecolon\",[8789]],[\"Ecy\",[1069]],[\"ecy\",[1101]],[\"eDDot\",[10871]],[\"Edot\",[278]],[\"edot\",[279]],[\"eDot\",[8785]],[\"ee\",[8519]],[\"efDot\",[8786]],[\"Efr\",[120072]],[\"efr\",[120098]],[\"eg\",[10906]],[\"Egrave\",[200]],[\"egrave\",[232]],[\"egs\",[10902]],[\"egsdot\",[10904]],[\"el\",[10905]],[\"Element\",[8712]],[\"elinters\",[9191]],[\"ell\",[8467]],[\"els\",[10901]],[\"elsdot\",[10903]],[\"Emacr\",[274]],[\"emacr\",[275]],[\"empty\",[8709]],[\"emptyset\",[8709]],[\"EmptySmallSquare\",[9723]],[\"emptyv\",[8709]],[\"EmptyVerySmallSquare\",[9643]],[\"emsp13\",[8196]],[\"emsp14\",[8197]],[\"emsp\",[8195]],[\"ENG\",[330]],[\"eng\",[331]],[\"ensp\",[8194]],[\"Eogon\",[280]],[\"eogon\",[281]],[\"Eopf\",[120124]],[\"eopf\",[120150]],[\"epar\",[8917]],[\"eparsl\",[10723]],[\"eplus\",[10865]],[\"epsi\",[949]],[\"Epsilon\",[917]],[\"epsilon\",[949]],[\"epsiv\",[1013]],[\"eqcirc\",[8790]],[\"eqcolon\",[8789]],[\"eqsim\",[8770]],[\"eqslantgtr\",[10902]],[\"eqslantless\",[10901]],[\"Equal\",[10869]],[\"equals\",[61]],[\"EqualTilde\",[8770]],[\"equest\",[8799]],[\"Equilibrium\",[8652]],[\"equiv\",[8801]],[\"equivDD\",[10872]],[\"eqvparsl\",[10725]],[\"erarr\",[10609]],[\"erDot\",[8787]],[\"escr\",[8495]],[\"Escr\",[8496]],[\"esdot\",[8784]],[\"Esim\",[10867]],[\"esim\",[8770]],[\"Eta\",[919]],[\"eta\",[951]],[\"ETH\",[208]],[\"eth\",[240]],[\"Euml\",[203]],[\"euml\",[235]],[\"euro\",[8364]],[\"excl\",[33]],[\"exist\",[8707]],[\"Exists\",[8707]],[\"expectation\",[8496]],[\"exponentiale\",[8519]],[\"ExponentialE\",[8519]],[\"fallingdotseq\",[8786]],[\"Fcy\",[1060]],[\"fcy\",[1092]],[\"female\",[9792]],[\"ffilig\",[64259]],[\"fflig\",[64256]],[\"ffllig\",[64260]],[\"Ffr\",[120073]],[\"ffr\",[120099]],[\"filig\",[64257]],[\"FilledSmallSquare\",[9724]],[\"FilledVerySmallSquare\",[9642]],[\"fjlig\",[102,106]],[\"flat\",[9837]],[\"fllig\",[64258]],[\"fltns\",[9649]],[\"fnof\",[402]],[\"Fopf\",[120125]],[\"fopf\",[120151]],[\"forall\",[8704]],[\"ForAll\",[8704]],[\"fork\",[8916]],[\"forkv\",[10969]],[\"Fouriertrf\",[8497]],[\"fpartint\",[10765]],[\"frac12\",[189]],[\"frac13\",[8531]],[\"frac14\",[188]],[\"frac15\",[8533]],[\"frac16\",[8537]],[\"frac18\",[8539]],[\"frac23\",[8532]],[\"frac25\",[8534]],[\"frac34\",[190]],[\"frac35\",[8535]],[\"frac38\",[8540]],[\"frac45\",[8536]],[\"frac56\",[8538]],[\"frac58\",[8541]],[\"frac78\",[8542]],[\"frasl\",[8260]],[\"frown\",[8994]],[\"fscr\",[119995]],[\"Fscr\",[8497]],[\"gacute\",[501]],[\"Gamma\",[915]],[\"gamma\",[947]],[\"Gammad\",[988]],[\"gammad\",[989]],[\"gap\",[10886]],[\"Gbreve\",[286]],[\"gbreve\",[287]],[\"Gcedil\",[290]],[\"Gcirc\",[284]],[\"gcirc\",[285]],[\"Gcy\",[1043]],[\"gcy\",[1075]],[\"Gdot\",[288]],[\"gdot\",[289]],[\"ge\",[8805]],[\"gE\",[8807]],[\"gEl\",[10892]],[\"gel\",[8923]],[\"geq\",[8805]],[\"geqq\",[8807]],[\"geqslant\",[10878]],[\"gescc\",[10921]],[\"ges\",[10878]],[\"gesdot\",[10880]],[\"gesdoto\",[10882]],[\"gesdotol\",[10884]],[\"gesl\",[8923,65024]],[\"gesles\",[10900]],[\"Gfr\",[120074]],[\"gfr\",[120100]],[\"gg\",[8811]],[\"Gg\",[8921]],[\"ggg\",[8921]],[\"gimel\",[8503]],[\"GJcy\",[1027]],[\"gjcy\",[1107]],[\"gla\",[10917]],[\"gl\",[8823]],[\"glE\",[10898]],[\"glj\",[10916]],[\"gnap\",[10890]],[\"gnapprox\",[10890]],[\"gne\",[10888]],[\"gnE\",[8809]],[\"gneq\",[10888]],[\"gneqq\",[8809]],[\"gnsim\",[8935]],[\"Gopf\",[120126]],[\"gopf\",[120152]],[\"grave\",[96]],[\"GreaterEqual\",[8805]],[\"GreaterEqualLess\",[8923]],[\"GreaterFullEqual\",[8807]],[\"GreaterGreater\",[10914]],[\"GreaterLess\",[8823]],[\"GreaterSlantEqual\",[10878]],[\"GreaterTilde\",[8819]],[\"Gscr\",[119970]],[\"gscr\",[8458]],[\"gsim\",[8819]],[\"gsime\",[10894]],[\"gsiml\",[10896]],[\"gtcc\",[10919]],[\"gtcir\",[10874]],[\"gt\",[62]],[\"GT\",[62]],[\"Gt\",[8811]],[\"gtdot\",[8919]],[\"gtlPar\",[10645]],[\"gtquest\",[10876]],[\"gtrapprox\",[10886]],[\"gtrarr\",[10616]],[\"gtrdot\",[8919]],[\"gtreqless\",[8923]],[\"gtreqqless\",[10892]],[\"gtrless\",[8823]],[\"gtrsim\",[8819]],[\"gvertneqq\",[8809,65024]],[\"gvnE\",[8809,65024]],[\"Hacek\",[711]],[\"hairsp\",[8202]],[\"half\",[189]],[\"hamilt\",[8459]],[\"HARDcy\",[1066]],[\"hardcy\",[1098]],[\"harrcir\",[10568]],[\"harr\",[8596]],[\"hArr\",[8660]],[\"harrw\",[8621]],[\"Hat\",[94]],[\"hbar\",[8463]],[\"Hcirc\",[292]],[\"hcirc\",[293]],[\"hearts\",[9829]],[\"heartsuit\",[9829]],[\"hellip\",[8230]],[\"hercon\",[8889]],[\"hfr\",[120101]],[\"Hfr\",[8460]],[\"HilbertSpace\",[8459]],[\"hksearow\",[10533]],[\"hkswarow\",[10534]],[\"hoarr\",[8703]],[\"homtht\",[8763]],[\"hookleftarrow\",[8617]],[\"hookrightarrow\",[8618]],[\"hopf\",[120153]],[\"Hopf\",[8461]],[\"horbar\",[8213]],[\"HorizontalLine\",[9472]],[\"hscr\",[119997]],[\"Hscr\",[8459]],[\"hslash\",[8463]],[\"Hstrok\",[294]],[\"hstrok\",[295]],[\"HumpDownHump\",[8782]],[\"HumpEqual\",[8783]],[\"hybull\",[8259]],[\"hyphen\",[8208]],[\"Iacute\",[205]],[\"iacute\",[237]],[\"ic\",[8291]],[\"Icirc\",[206]],[\"icirc\",[238]],[\"Icy\",[1048]],[\"icy\",[1080]],[\"Idot\",[304]],[\"IEcy\",[1045]],[\"iecy\",[1077]],[\"iexcl\",[161]],[\"iff\",[8660]],[\"ifr\",[120102]],[\"Ifr\",[8465]],[\"Igrave\",[204]],[\"igrave\",[236]],[\"ii\",[8520]],[\"iiiint\",[10764]],[\"iiint\",[8749]],[\"iinfin\",[10716]],[\"iiota\",[8489]],[\"IJlig\",[306]],[\"ijlig\",[307]],[\"Imacr\",[298]],[\"imacr\",[299]],[\"image\",[8465]],[\"ImaginaryI\",[8520]],[\"imagline\",[8464]],[\"imagpart\",[8465]],[\"imath\",[305]],[\"Im\",[8465]],[\"imof\",[8887]],[\"imped\",[437]],[\"Implies\",[8658]],[\"incare\",[8453]],[\"in\",[8712]],[\"infin\",[8734]],[\"infintie\",[10717]],[\"inodot\",[305]],[\"intcal\",[8890]],[\"int\",[8747]],[\"Int\",[8748]],[\"integers\",[8484]],[\"Integral\",[8747]],[\"intercal\",[8890]],[\"Intersection\",[8898]],[\"intlarhk\",[10775]],[\"intprod\",[10812]],[\"InvisibleComma\",[8291]],[\"InvisibleTimes\",[8290]],[\"IOcy\",[1025]],[\"iocy\",[1105]],[\"Iogon\",[302]],[\"iogon\",[303]],[\"Iopf\",[120128]],[\"iopf\",[120154]],[\"Iota\",[921]],[\"iota\",[953]],[\"iprod\",[10812]],[\"iquest\",[191]],[\"iscr\",[119998]],[\"Iscr\",[8464]],[\"isin\",[8712]],[\"isindot\",[8949]],[\"isinE\",[8953]],[\"isins\",[8948]],[\"isinsv\",[8947]],[\"isinv\",[8712]],[\"it\",[8290]],[\"Itilde\",[296]],[\"itilde\",[297]],[\"Iukcy\",[1030]],[\"iukcy\",[1110]],[\"Iuml\",[207]],[\"iuml\",[239]],[\"Jcirc\",[308]],[\"jcirc\",[309]],[\"Jcy\",[1049]],[\"jcy\",[1081]],[\"Jfr\",[120077]],[\"jfr\",[120103]],[\"jmath\",[567]],[\"Jopf\",[120129]],[\"jopf\",[120155]],[\"Jscr\",[119973]],[\"jscr\",[119999]],[\"Jsercy\",[1032]],[\"jsercy\",[1112]],[\"Jukcy\",[1028]],[\"jukcy\",[1108]],[\"Kappa\",[922]],[\"kappa\",[954]],[\"kappav\",[1008]],[\"Kcedil\",[310]],[\"kcedil\",[311]],[\"Kcy\",[1050]],[\"kcy\",[1082]],[\"Kfr\",[120078]],[\"kfr\",[120104]],[\"kgreen\",[312]],[\"KHcy\",[1061]],[\"khcy\",[1093]],[\"KJcy\",[1036]],[\"kjcy\",[1116]],[\"Kopf\",[120130]],[\"kopf\",[120156]],[\"Kscr\",[119974]],[\"kscr\",[12e4]],[\"lAarr\",[8666]],[\"Lacute\",[313]],[\"lacute\",[314]],[\"laemptyv\",[10676]],[\"lagran\",[8466]],[\"Lambda\",[923]],[\"lambda\",[955]],[\"lang\",[10216]],[\"Lang\",[10218]],[\"langd\",[10641]],[\"langle\",[10216]],[\"lap\",[10885]],[\"Laplacetrf\",[8466]],[\"laquo\",[171]],[\"larrb\",[8676]],[\"larrbfs\",[10527]],[\"larr\",[8592]],[\"Larr\",[8606]],[\"lArr\",[8656]],[\"larrfs\",[10525]],[\"larrhk\",[8617]],[\"larrlp\",[8619]],[\"larrpl\",[10553]],[\"larrsim\",[10611]],[\"larrtl\",[8610]],[\"latail\",[10521]],[\"lAtail\",[10523]],[\"lat\",[10923]],[\"late\",[10925]],[\"lates\",[10925,65024]],[\"lbarr\",[10508]],[\"lBarr\",[10510]],[\"lbbrk\",[10098]],[\"lbrace\",[123]],[\"lbrack\",[91]],[\"lbrke\",[10635]],[\"lbrksld\",[10639]],[\"lbrkslu\",[10637]],[\"Lcaron\",[317]],[\"lcaron\",[318]],[\"Lcedil\",[315]],[\"lcedil\",[316]],[\"lceil\",[8968]],[\"lcub\",[123]],[\"Lcy\",[1051]],[\"lcy\",[1083]],[\"ldca\",[10550]],[\"ldquo\",[8220]],[\"ldquor\",[8222]],[\"ldrdhar\",[10599]],[\"ldrushar\",[10571]],[\"ldsh\",[8626]],[\"le\",[8804]],[\"lE\",[8806]],[\"LeftAngleBracket\",[10216]],[\"LeftArrowBar\",[8676]],[\"leftarrow\",[8592]],[\"LeftArrow\",[8592]],[\"Leftarrow\",[8656]],[\"LeftArrowRightArrow\",[8646]],[\"leftarrowtail\",[8610]],[\"LeftCeiling\",[8968]],[\"LeftDoubleBracket\",[10214]],[\"LeftDownTeeVector\",[10593]],[\"LeftDownVectorBar\",[10585]],[\"LeftDownVector\",[8643]],[\"LeftFloor\",[8970]],[\"leftharpoondown\",[8637]],[\"leftharpoonup\",[8636]],[\"leftleftarrows\",[8647]],[\"leftrightarrow\",[8596]],[\"LeftRightArrow\",[8596]],[\"Leftrightarrow\",[8660]],[\"leftrightarrows\",[8646]],[\"leftrightharpoons\",[8651]],[\"leftrightsquigarrow\",[8621]],[\"LeftRightVector\",[10574]],[\"LeftTeeArrow\",[8612]],[\"LeftTee\",[8867]],[\"LeftTeeVector\",[10586]],[\"leftthreetimes\",[8907]],[\"LeftTriangleBar\",[10703]],[\"LeftTriangle\",[8882]],[\"LeftTriangleEqual\",[8884]],[\"LeftUpDownVector\",[10577]],[\"LeftUpTeeVector\",[10592]],[\"LeftUpVectorBar\",[10584]],[\"LeftUpVector\",[8639]],[\"LeftVectorBar\",[10578]],[\"LeftVector\",[8636]],[\"lEg\",[10891]],[\"leg\",[8922]],[\"leq\",[8804]],[\"leqq\",[8806]],[\"leqslant\",[10877]],[\"lescc\",[10920]],[\"les\",[10877]],[\"lesdot\",[10879]],[\"lesdoto\",[10881]],[\"lesdotor\",[10883]],[\"lesg\",[8922,65024]],[\"lesges\",[10899]],[\"lessapprox\",[10885]],[\"lessdot\",[8918]],[\"lesseqgtr\",[8922]],[\"lesseqqgtr\",[10891]],[\"LessEqualGreater\",[8922]],[\"LessFullEqual\",[8806]],[\"LessGreater\",[8822]],[\"lessgtr\",[8822]],[\"LessLess\",[10913]],[\"lesssim\",[8818]],[\"LessSlantEqual\",[10877]],[\"LessTilde\",[8818]],[\"lfisht\",[10620]],[\"lfloor\",[8970]],[\"Lfr\",[120079]],[\"lfr\",[120105]],[\"lg\",[8822]],[\"lgE\",[10897]],[\"lHar\",[10594]],[\"lhard\",[8637]],[\"lharu\",[8636]],[\"lharul\",[10602]],[\"lhblk\",[9604]],[\"LJcy\",[1033]],[\"ljcy\",[1113]],[\"llarr\",[8647]],[\"ll\",[8810]],[\"Ll\",[8920]],[\"llcorner\",[8990]],[\"Lleftarrow\",[8666]],[\"llhard\",[10603]],[\"lltri\",[9722]],[\"Lmidot\",[319]],[\"lmidot\",[320]],[\"lmoustache\",[9136]],[\"lmoust\",[9136]],[\"lnap\",[10889]],[\"lnapprox\",[10889]],[\"lne\",[10887]],[\"lnE\",[8808]],[\"lneq\",[10887]],[\"lneqq\",[8808]],[\"lnsim\",[8934]],[\"loang\",[10220]],[\"loarr\",[8701]],[\"lobrk\",[10214]],[\"longleftarrow\",[10229]],[\"LongLeftArrow\",[10229]],[\"Longleftarrow\",[10232]],[\"longleftrightarrow\",[10231]],[\"LongLeftRightArrow\",[10231]],[\"Longleftrightarrow\",[10234]],[\"longmapsto\",[10236]],[\"longrightarrow\",[10230]],[\"LongRightArrow\",[10230]],[\"Longrightarrow\",[10233]],[\"looparrowleft\",[8619]],[\"looparrowright\",[8620]],[\"lopar\",[10629]],[\"Lopf\",[120131]],[\"lopf\",[120157]],[\"loplus\",[10797]],[\"lotimes\",[10804]],[\"lowast\",[8727]],[\"lowbar\",[95]],[\"LowerLeftArrow\",[8601]],[\"LowerRightArrow\",[8600]],[\"loz\",[9674]],[\"lozenge\",[9674]],[\"lozf\",[10731]],[\"lpar\",[40]],[\"lparlt\",[10643]],[\"lrarr\",[8646]],[\"lrcorner\",[8991]],[\"lrhar\",[8651]],[\"lrhard\",[10605]],[\"lrm\",[8206]],[\"lrtri\",[8895]],[\"lsaquo\",[8249]],[\"lscr\",[120001]],[\"Lscr\",[8466]],[\"lsh\",[8624]],[\"Lsh\",[8624]],[\"lsim\",[8818]],[\"lsime\",[10893]],[\"lsimg\",[10895]],[\"lsqb\",[91]],[\"lsquo\",[8216]],[\"lsquor\",[8218]],[\"Lstrok\",[321]],[\"lstrok\",[322]],[\"ltcc\",[10918]],[\"ltcir\",[10873]],[\"lt\",[60]],[\"LT\",[60]],[\"Lt\",[8810]],[\"ltdot\",[8918]],[\"lthree\",[8907]],[\"ltimes\",[8905]],[\"ltlarr\",[10614]],[\"ltquest\",[10875]],[\"ltri\",[9667]],[\"ltrie\",[8884]],[\"ltrif\",[9666]],[\"ltrPar\",[10646]],[\"lurdshar\",[10570]],[\"luruhar\",[10598]],[\"lvertneqq\",[8808,65024]],[\"lvnE\",[8808,65024]],[\"macr\",[175]],[\"male\",[9794]],[\"malt\",[10016]],[\"maltese\",[10016]],[\"Map\",[10501]],[\"map\",[8614]],[\"mapsto\",[8614]],[\"mapstodown\",[8615]],[\"mapstoleft\",[8612]],[\"mapstoup\",[8613]],[\"marker\",[9646]],[\"mcomma\",[10793]],[\"Mcy\",[1052]],[\"mcy\",[1084]],[\"mdash\",[8212]],[\"mDDot\",[8762]],[\"measuredangle\",[8737]],[\"MediumSpace\",[8287]],[\"Mellintrf\",[8499]],[\"Mfr\",[120080]],[\"mfr\",[120106]],[\"mho\",[8487]],[\"micro\",[181]],[\"midast\",[42]],[\"midcir\",[10992]],[\"mid\",[8739]],[\"middot\",[183]],[\"minusb\",[8863]],[\"minus\",[8722]],[\"minusd\",[8760]],[\"minusdu\",[10794]],[\"MinusPlus\",[8723]],[\"mlcp\",[10971]],[\"mldr\",[8230]],[\"mnplus\",[8723]],[\"models\",[8871]],[\"Mopf\",[120132]],[\"mopf\",[120158]],[\"mp\",[8723]],[\"mscr\",[120002]],[\"Mscr\",[8499]],[\"mstpos\",[8766]],[\"Mu\",[924]],[\"mu\",[956]],[\"multimap\",[8888]],[\"mumap\",[8888]],[\"nabla\",[8711]],[\"Nacute\",[323]],[\"nacute\",[324]],[\"nang\",[8736,8402]],[\"nap\",[8777]],[\"napE\",[10864,824]],[\"napid\",[8779,824]],[\"napos\",[329]],[\"napprox\",[8777]],[\"natural\",[9838]],[\"naturals\",[8469]],[\"natur\",[9838]],[\"nbsp\",[160]],[\"nbump\",[8782,824]],[\"nbumpe\",[8783,824]],[\"ncap\",[10819]],[\"Ncaron\",[327]],[\"ncaron\",[328]],[\"Ncedil\",[325]],[\"ncedil\",[326]],[\"ncong\",[8775]],[\"ncongdot\",[10861,824]],[\"ncup\",[10818]],[\"Ncy\",[1053]],[\"ncy\",[1085]],[\"ndash\",[8211]],[\"nearhk\",[10532]],[\"nearr\",[8599]],[\"neArr\",[8663]],[\"nearrow\",[8599]],[\"ne\",[8800]],[\"nedot\",[8784,824]],[\"NegativeMediumSpace\",[8203]],[\"NegativeThickSpace\",[8203]],[\"NegativeThinSpace\",[8203]],[\"NegativeVeryThinSpace\",[8203]],[\"nequiv\",[8802]],[\"nesear\",[10536]],[\"nesim\",[8770,824]],[\"NestedGreaterGreater\",[8811]],[\"NestedLessLess\",[8810]],[\"nexist\",[8708]],[\"nexists\",[8708]],[\"Nfr\",[120081]],[\"nfr\",[120107]],[\"ngE\",[8807,824]],[\"nge\",[8817]],[\"ngeq\",[8817]],[\"ngeqq\",[8807,824]],[\"ngeqslant\",[10878,824]],[\"nges\",[10878,824]],[\"nGg\",[8921,824]],[\"ngsim\",[8821]],[\"nGt\",[8811,8402]],[\"ngt\",[8815]],[\"ngtr\",[8815]],[\"nGtv\",[8811,824]],[\"nharr\",[8622]],[\"nhArr\",[8654]],[\"nhpar\",[10994]],[\"ni\",[8715]],[\"nis\",[8956]],[\"nisd\",[8954]],[\"niv\",[8715]],[\"NJcy\",[1034]],[\"njcy\",[1114]],[\"nlarr\",[8602]],[\"nlArr\",[8653]],[\"nldr\",[8229]],[\"nlE\",[8806,824]],[\"nle\",[8816]],[\"nleftarrow\",[8602]],[\"nLeftarrow\",[8653]],[\"nleftrightarrow\",[8622]],[\"nLeftrightarrow\",[8654]],[\"nleq\",[8816]],[\"nleqq\",[8806,824]],[\"nleqslant\",[10877,824]],[\"nles\",[10877,824]],[\"nless\",[8814]],[\"nLl\",[8920,824]],[\"nlsim\",[8820]],[\"nLt\",[8810,8402]],[\"nlt\",[8814]],[\"nltri\",[8938]],[\"nltrie\",[8940]],[\"nLtv\",[8810,824]],[\"nmid\",[8740]],[\"NoBreak\",[8288]],[\"NonBreakingSpace\",[160]],[\"nopf\",[120159]],[\"Nopf\",[8469]],[\"Not\",[10988]],[\"not\",[172]],[\"NotCongruent\",[8802]],[\"NotCupCap\",[8813]],[\"NotDoubleVerticalBar\",[8742]],[\"NotElement\",[8713]],[\"NotEqual\",[8800]],[\"NotEqualTilde\",[8770,824]],[\"NotExists\",[8708]],[\"NotGreater\",[8815]],[\"NotGreaterEqual\",[8817]],[\"NotGreaterFullEqual\",[8807,824]],[\"NotGreaterGreater\",[8811,824]],[\"NotGreaterLess\",[8825]],[\"NotGreaterSlantEqual\",[10878,824]],[\"NotGreaterTilde\",[8821]],[\"NotHumpDownHump\",[8782,824]],[\"NotHumpEqual\",[8783,824]],[\"notin\",[8713]],[\"notindot\",[8949,824]],[\"notinE\",[8953,824]],[\"notinva\",[8713]],[\"notinvb\",[8951]],[\"notinvc\",[8950]],[\"NotLeftTriangleBar\",[10703,824]],[\"NotLeftTriangle\",[8938]],[\"NotLeftTriangleEqual\",[8940]],[\"NotLess\",[8814]],[\"NotLessEqual\",[8816]],[\"NotLessGreater\",[8824]],[\"NotLessLess\",[8810,824]],[\"NotLessSlantEqual\",[10877,824]],[\"NotLessTilde\",[8820]],[\"NotNestedGreaterGreater\",[10914,824]],[\"NotNestedLessLess\",[10913,824]],[\"notni\",[8716]],[\"notniva\",[8716]],[\"notnivb\",[8958]],[\"notnivc\",[8957]],[\"NotPrecedes\",[8832]],[\"NotPrecedesEqual\",[10927,824]],[\"NotPrecedesSlantEqual\",[8928]],[\"NotReverseElement\",[8716]],[\"NotRightTriangleBar\",[10704,824]],[\"NotRightTriangle\",[8939]],[\"NotRightTriangleEqual\",[8941]],[\"NotSquareSubset\",[8847,824]],[\"NotSquareSubsetEqual\",[8930]],[\"NotSquareSuperset\",[8848,824]],[\"NotSquareSupersetEqual\",[8931]],[\"NotSubset\",[8834,8402]],[\"NotSubsetEqual\",[8840]],[\"NotSucceeds\",[8833]],[\"NotSucceedsEqual\",[10928,824]],[\"NotSucceedsSlantEqual\",[8929]],[\"NotSucceedsTilde\",[8831,824]],[\"NotSuperset\",[8835,8402]],[\"NotSupersetEqual\",[8841]],[\"NotTilde\",[8769]],[\"NotTildeEqual\",[8772]],[\"NotTildeFullEqual\",[8775]],[\"NotTildeTilde\",[8777]],[\"NotVerticalBar\",[8740]],[\"nparallel\",[8742]],[\"npar\",[8742]],[\"nparsl\",[11005,8421]],[\"npart\",[8706,824]],[\"npolint\",[10772]],[\"npr\",[8832]],[\"nprcue\",[8928]],[\"nprec\",[8832]],[\"npreceq\",[10927,824]],[\"npre\",[10927,824]],[\"nrarrc\",[10547,824]],[\"nrarr\",[8603]],[\"nrArr\",[8655]],[\"nrarrw\",[8605,824]],[\"nrightarrow\",[8603]],[\"nRightarrow\",[8655]],[\"nrtri\",[8939]],[\"nrtrie\",[8941]],[\"nsc\",[8833]],[\"nsccue\",[8929]],[\"nsce\",[10928,824]],[\"Nscr\",[119977]],[\"nscr\",[120003]],[\"nshortmid\",[8740]],[\"nshortparallel\",[8742]],[\"nsim\",[8769]],[\"nsime\",[8772]],[\"nsimeq\",[8772]],[\"nsmid\",[8740]],[\"nspar\",[8742]],[\"nsqsube\",[8930]],[\"nsqsupe\",[8931]],[\"nsub\",[8836]],[\"nsubE\",[10949,824]],[\"nsube\",[8840]],[\"nsubset\",[8834,8402]],[\"nsubseteq\",[8840]],[\"nsubseteqq\",[10949,824]],[\"nsucc\",[8833]],[\"nsucceq\",[10928,824]],[\"nsup\",[8837]],[\"nsupE\",[10950,824]],[\"nsupe\",[8841]],[\"nsupset\",[8835,8402]],[\"nsupseteq\",[8841]],[\"nsupseteqq\",[10950,824]],[\"ntgl\",[8825]],[\"Ntilde\",[209]],[\"ntilde\",[241]],[\"ntlg\",[8824]],[\"ntriangleleft\",[8938]],[\"ntrianglelefteq\",[8940]],[\"ntriangleright\",[8939]],[\"ntrianglerighteq\",[8941]],[\"Nu\",[925]],[\"nu\",[957]],[\"num\",[35]],[\"numero\",[8470]],[\"numsp\",[8199]],[\"nvap\",[8781,8402]],[\"nvdash\",[8876]],[\"nvDash\",[8877]],[\"nVdash\",[8878]],[\"nVDash\",[8879]],[\"nvge\",[8805,8402]],[\"nvgt\",[62,8402]],[\"nvHarr\",[10500]],[\"nvinfin\",[10718]],[\"nvlArr\",[10498]],[\"nvle\",[8804,8402]],[\"nvlt\",[60,8402]],[\"nvltrie\",[8884,8402]],[\"nvrArr\",[10499]],[\"nvrtrie\",[8885,8402]],[\"nvsim\",[8764,8402]],[\"nwarhk\",[10531]],[\"nwarr\",[8598]],[\"nwArr\",[8662]],[\"nwarrow\",[8598]],[\"nwnear\",[10535]],[\"Oacute\",[211]],[\"oacute\",[243]],[\"oast\",[8859]],[\"Ocirc\",[212]],[\"ocirc\",[244]],[\"ocir\",[8858]],[\"Ocy\",[1054]],[\"ocy\",[1086]],[\"odash\",[8861]],[\"Odblac\",[336]],[\"odblac\",[337]],[\"odiv\",[10808]],[\"odot\",[8857]],[\"odsold\",[10684]],[\"OElig\",[338]],[\"oelig\",[339]],[\"ofcir\",[10687]],[\"Ofr\",[120082]],[\"ofr\",[120108]],[\"ogon\",[731]],[\"Ograve\",[210]],[\"ograve\",[242]],[\"ogt\",[10689]],[\"ohbar\",[10677]],[\"ohm\",[937]],[\"oint\",[8750]],[\"olarr\",[8634]],[\"olcir\",[10686]],[\"olcross\",[10683]],[\"oline\",[8254]],[\"olt\",[10688]],[\"Omacr\",[332]],[\"omacr\",[333]],[\"Omega\",[937]],[\"omega\",[969]],[\"Omicron\",[927]],[\"omicron\",[959]],[\"omid\",[10678]],[\"ominus\",[8854]],[\"Oopf\",[120134]],[\"oopf\",[120160]],[\"opar\",[10679]],[\"OpenCurlyDoubleQuote\",[8220]],[\"OpenCurlyQuote\",[8216]],[\"operp\",[10681]],[\"oplus\",[8853]],[\"orarr\",[8635]],[\"Or\",[10836]],[\"or\",[8744]],[\"ord\",[10845]],[\"order\",[8500]],[\"orderof\",[8500]],[\"ordf\",[170]],[\"ordm\",[186]],[\"origof\",[8886]],[\"oror\",[10838]],[\"orslope\",[10839]],[\"orv\",[10843]],[\"oS\",[9416]],[\"Oscr\",[119978]],[\"oscr\",[8500]],[\"Oslash\",[216]],[\"oslash\",[248]],[\"osol\",[8856]],[\"Otilde\",[213]],[\"otilde\",[245]],[\"otimesas\",[10806]],[\"Otimes\",[10807]],[\"otimes\",[8855]],[\"Ouml\",[214]],[\"ouml\",[246]],[\"ovbar\",[9021]],[\"OverBar\",[8254]],[\"OverBrace\",[9182]],[\"OverBracket\",[9140]],[\"OverParenthesis\",[9180]],[\"para\",[182]],[\"parallel\",[8741]],[\"par\",[8741]],[\"parsim\",[10995]],[\"parsl\",[11005]],[\"part\",[8706]],[\"PartialD\",[8706]],[\"Pcy\",[1055]],[\"pcy\",[1087]],[\"percnt\",[37]],[\"period\",[46]],[\"permil\",[8240]],[\"perp\",[8869]],[\"pertenk\",[8241]],[\"Pfr\",[120083]],[\"pfr\",[120109]],[\"Phi\",[934]],[\"phi\",[966]],[\"phiv\",[981]],[\"phmmat\",[8499]],[\"phone\",[9742]],[\"Pi\",[928]],[\"pi\",[960]],[\"pitchfork\",[8916]],[\"piv\",[982]],[\"planck\",[8463]],[\"planckh\",[8462]],[\"plankv\",[8463]],[\"plusacir\",[10787]],[\"plusb\",[8862]],[\"pluscir\",[10786]],[\"plus\",[43]],[\"plusdo\",[8724]],[\"plusdu\",[10789]],[\"pluse\",[10866]],[\"PlusMinus\",[177]],[\"plusmn\",[177]],[\"plussim\",[10790]],[\"plustwo\",[10791]],[\"pm\",[177]],[\"Poincareplane\",[8460]],[\"pointint\",[10773]],[\"popf\",[120161]],[\"Popf\",[8473]],[\"pound\",[163]],[\"prap\",[10935]],[\"Pr\",[10939]],[\"pr\",[8826]],[\"prcue\",[8828]],[\"precapprox\",[10935]],[\"prec\",[8826]],[\"preccurlyeq\",[8828]],[\"Precedes\",[8826]],[\"PrecedesEqual\",[10927]],[\"PrecedesSlantEqual\",[8828]],[\"PrecedesTilde\",[8830]],[\"preceq\",[10927]],[\"precnapprox\",[10937]],[\"precneqq\",[10933]],[\"precnsim\",[8936]],[\"pre\",[10927]],[\"prE\",[10931]],[\"precsim\",[8830]],[\"prime\",[8242]],[\"Prime\",[8243]],[\"primes\",[8473]],[\"prnap\",[10937]],[\"prnE\",[10933]],[\"prnsim\",[8936]],[\"prod\",[8719]],[\"Product\",[8719]],[\"profalar\",[9006]],[\"profline\",[8978]],[\"profsurf\",[8979]],[\"prop\",[8733]],[\"Proportional\",[8733]],[\"Proportion\",[8759]],[\"propto\",[8733]],[\"prsim\",[8830]],[\"prurel\",[8880]],[\"Pscr\",[119979]],[\"pscr\",[120005]],[\"Psi\",[936]],[\"psi\",[968]],[\"puncsp\",[8200]],[\"Qfr\",[120084]],[\"qfr\",[120110]],[\"qint\",[10764]],[\"qopf\",[120162]],[\"Qopf\",[8474]],[\"qprime\",[8279]],[\"Qscr\",[119980]],[\"qscr\",[120006]],[\"quaternions\",[8461]],[\"quatint\",[10774]],[\"quest\",[63]],[\"questeq\",[8799]],[\"quot\",[34]],[\"QUOT\",[34]],[\"rAarr\",[8667]],[\"race\",[8765,817]],[\"Racute\",[340]],[\"racute\",[341]],[\"radic\",[8730]],[\"raemptyv\",[10675]],[\"rang\",[10217]],[\"Rang\",[10219]],[\"rangd\",[10642]],[\"range\",[10661]],[\"rangle\",[10217]],[\"raquo\",[187]],[\"rarrap\",[10613]],[\"rarrb\",[8677]],[\"rarrbfs\",[10528]],[\"rarrc\",[10547]],[\"rarr\",[8594]],[\"Rarr\",[8608]],[\"rArr\",[8658]],[\"rarrfs\",[10526]],[\"rarrhk\",[8618]],[\"rarrlp\",[8620]],[\"rarrpl\",[10565]],[\"rarrsim\",[10612]],[\"Rarrtl\",[10518]],[\"rarrtl\",[8611]],[\"rarrw\",[8605]],[\"ratail\",[10522]],[\"rAtail\",[10524]],[\"ratio\",[8758]],[\"rationals\",[8474]],[\"rbarr\",[10509]],[\"rBarr\",[10511]],[\"RBarr\",[10512]],[\"rbbrk\",[10099]],[\"rbrace\",[125]],[\"rbrack\",[93]],[\"rbrke\",[10636]],[\"rbrksld\",[10638]],[\"rbrkslu\",[10640]],[\"Rcaron\",[344]],[\"rcaron\",[345]],[\"Rcedil\",[342]],[\"rcedil\",[343]],[\"rceil\",[8969]],[\"rcub\",[125]],[\"Rcy\",[1056]],[\"rcy\",[1088]],[\"rdca\",[10551]],[\"rdldhar\",[10601]],[\"rdquo\",[8221]],[\"rdquor\",[8221]],[\"CloseCurlyDoubleQuote\",[8221]],[\"rdsh\",[8627]],[\"real\",[8476]],[\"realine\",[8475]],[\"realpart\",[8476]],[\"reals\",[8477]],[\"Re\",[8476]],[\"rect\",[9645]],[\"reg\",[174]],[\"REG\",[174]],[\"ReverseElement\",[8715]],[\"ReverseEquilibrium\",[8651]],[\"ReverseUpEquilibrium\",[10607]],[\"rfisht\",[10621]],[\"rfloor\",[8971]],[\"rfr\",[120111]],[\"Rfr\",[8476]],[\"rHar\",[10596]],[\"rhard\",[8641]],[\"rharu\",[8640]],[\"rharul\",[10604]],[\"Rho\",[929]],[\"rho\",[961]],[\"rhov\",[1009]],[\"RightAngleBracket\",[10217]],[\"RightArrowBar\",[8677]],[\"rightarrow\",[8594]],[\"RightArrow\",[8594]],[\"Rightarrow\",[8658]],[\"RightArrowLeftArrow\",[8644]],[\"rightarrowtail\",[8611]],[\"RightCeiling\",[8969]],[\"RightDoubleBracket\",[10215]],[\"RightDownTeeVector\",[10589]],[\"RightDownVectorBar\",[10581]],[\"RightDownVector\",[8642]],[\"RightFloor\",[8971]],[\"rightharpoondown\",[8641]],[\"rightharpoonup\",[8640]],[\"rightleftarrows\",[8644]],[\"rightleftharpoons\",[8652]],[\"rightrightarrows\",[8649]],[\"rightsquigarrow\",[8605]],[\"RightTeeArrow\",[8614]],[\"RightTee\",[8866]],[\"RightTeeVector\",[10587]],[\"rightthreetimes\",[8908]],[\"RightTriangleBar\",[10704]],[\"RightTriangle\",[8883]],[\"RightTriangleEqual\",[8885]],[\"RightUpDownVector\",[10575]],[\"RightUpTeeVector\",[10588]],[\"RightUpVectorBar\",[10580]],[\"RightUpVector\",[8638]],[\"RightVectorBar\",[10579]],[\"RightVector\",[8640]],[\"ring\",[730]],[\"risingdotseq\",[8787]],[\"rlarr\",[8644]],[\"rlhar\",[8652]],[\"rlm\",[8207]],[\"rmoustache\",[9137]],[\"rmoust\",[9137]],[\"rnmid\",[10990]],[\"roang\",[10221]],[\"roarr\",[8702]],[\"robrk\",[10215]],[\"ropar\",[10630]],[\"ropf\",[120163]],[\"Ropf\",[8477]],[\"roplus\",[10798]],[\"rotimes\",[10805]],[\"RoundImplies\",[10608]],[\"rpar\",[41]],[\"rpargt\",[10644]],[\"rppolint\",[10770]],[\"rrarr\",[8649]],[\"Rrightarrow\",[8667]],[\"rsaquo\",[8250]],[\"rscr\",[120007]],[\"Rscr\",[8475]],[\"rsh\",[8625]],[\"Rsh\",[8625]],[\"rsqb\",[93]],[\"rsquo\",[8217]],[\"rsquor\",[8217]],[\"CloseCurlyQuote\",[8217]],[\"rthree\",[8908]],[\"rtimes\",[8906]],[\"rtri\",[9657]],[\"rtrie\",[8885]],[\"rtrif\",[9656]],[\"rtriltri\",[10702]],[\"RuleDelayed\",[10740]],[\"ruluhar\",[10600]],[\"rx\",[8478]],[\"Sacute\",[346]],[\"sacute\",[347]],[\"sbquo\",[8218]],[\"scap\",[10936]],[\"Scaron\",[352]],[\"scaron\",[353]],[\"Sc\",[10940]],[\"sc\",[8827]],[\"sccue\",[8829]],[\"sce\",[10928]],[\"scE\",[10932]],[\"Scedil\",[350]],[\"scedil\",[351]],[\"Scirc\",[348]],[\"scirc\",[349]],[\"scnap\",[10938]],[\"scnE\",[10934]],[\"scnsim\",[8937]],[\"scpolint\",[10771]],[\"scsim\",[8831]],[\"Scy\",[1057]],[\"scy\",[1089]],[\"sdotb\",[8865]],[\"sdot\",[8901]],[\"sdote\",[10854]],[\"searhk\",[10533]],[\"searr\",[8600]],[\"seArr\",[8664]],[\"searrow\",[8600]],[\"sect\",[167]],[\"semi\",[59]],[\"seswar\",[10537]],[\"setminus\",[8726]],[\"setmn\",[8726]],[\"sext\",[10038]],[\"Sfr\",[120086]],[\"sfr\",[120112]],[\"sfrown\",[8994]],[\"sharp\",[9839]],[\"SHCHcy\",[1065]],[\"shchcy\",[1097]],[\"SHcy\",[1064]],[\"shcy\",[1096]],[\"ShortDownArrow\",[8595]],[\"ShortLeftArrow\",[8592]],[\"shortmid\",[8739]],[\"shortparallel\",[8741]],[\"ShortRightArrow\",[8594]],[\"ShortUpArrow\",[8593]],[\"shy\",[173]],[\"Sigma\",[931]],[\"sigma\",[963]],[\"sigmaf\",[962]],[\"sigmav\",[962]],[\"sim\",[8764]],[\"simdot\",[10858]],[\"sime\",[8771]],[\"simeq\",[8771]],[\"simg\",[10910]],[\"simgE\",[10912]],[\"siml\",[10909]],[\"simlE\",[10911]],[\"simne\",[8774]],[\"simplus\",[10788]],[\"simrarr\",[10610]],[\"slarr\",[8592]],[\"SmallCircle\",[8728]],[\"smallsetminus\",[8726]],[\"smashp\",[10803]],[\"smeparsl\",[10724]],[\"smid\",[8739]],[\"smile\",[8995]],[\"smt\",[10922]],[\"smte\",[10924]],[\"smtes\",[10924,65024]],[\"SOFTcy\",[1068]],[\"softcy\",[1100]],[\"solbar\",[9023]],[\"solb\",[10692]],[\"sol\",[47]],[\"Sopf\",[120138]],[\"sopf\",[120164]],[\"spades\",[9824]],[\"spadesuit\",[9824]],[\"spar\",[8741]],[\"sqcap\",[8851]],[\"sqcaps\",[8851,65024]],[\"sqcup\",[8852]],[\"sqcups\",[8852,65024]],[\"Sqrt\",[8730]],[\"sqsub\",[8847]],[\"sqsube\",[8849]],[\"sqsubset\",[8847]],[\"sqsubseteq\",[8849]],[\"sqsup\",[8848]],[\"sqsupe\",[8850]],[\"sqsupset\",[8848]],[\"sqsupseteq\",[8850]],[\"square\",[9633]],[\"Square\",[9633]],[\"SquareIntersection\",[8851]],[\"SquareSubset\",[8847]],[\"SquareSubsetEqual\",[8849]],[\"SquareSuperset\",[8848]],[\"SquareSupersetEqual\",[8850]],[\"SquareUnion\",[8852]],[\"squarf\",[9642]],[\"squ\",[9633]],[\"squf\",[9642]],[\"srarr\",[8594]],[\"Sscr\",[119982]],[\"sscr\",[120008]],[\"ssetmn\",[8726]],[\"ssmile\",[8995]],[\"sstarf\",[8902]],[\"Star\",[8902]],[\"star\",[9734]],[\"starf\",[9733]],[\"straightepsilon\",[1013]],[\"straightphi\",[981]],[\"strns\",[175]],[\"sub\",[8834]],[\"Sub\",[8912]],[\"subdot\",[10941]],[\"subE\",[10949]],[\"sube\",[8838]],[\"subedot\",[10947]],[\"submult\",[10945]],[\"subnE\",[10955]],[\"subne\",[8842]],[\"subplus\",[10943]],[\"subrarr\",[10617]],[\"subset\",[8834]],[\"Subset\",[8912]],[\"subseteq\",[8838]],[\"subseteqq\",[10949]],[\"SubsetEqual\",[8838]],[\"subsetneq\",[8842]],[\"subsetneqq\",[10955]],[\"subsim\",[10951]],[\"subsub\",[10965]],[\"subsup\",[10963]],[\"succapprox\",[10936]],[\"succ\",[8827]],[\"succcurlyeq\",[8829]],[\"Succeeds\",[8827]],[\"SucceedsEqual\",[10928]],[\"SucceedsSlantEqual\",[8829]],[\"SucceedsTilde\",[8831]],[\"succeq\",[10928]],[\"succnapprox\",[10938]],[\"succneqq\",[10934]],[\"succnsim\",[8937]],[\"succsim\",[8831]],[\"SuchThat\",[8715]],[\"sum\",[8721]],[\"Sum\",[8721]],[\"sung\",[9834]],[\"sup1\",[185]],[\"sup2\",[178]],[\"sup3\",[179]],[\"sup\",[8835]],[\"Sup\",[8913]],[\"supdot\",[10942]],[\"supdsub\",[10968]],[\"supE\",[10950]],[\"supe\",[8839]],[\"supedot\",[10948]],[\"Superset\",[8835]],[\"SupersetEqual\",[8839]],[\"suphsol\",[10185]],[\"suphsub\",[10967]],[\"suplarr\",[10619]],[\"supmult\",[10946]],[\"supnE\",[10956]],[\"supne\",[8843]],[\"supplus\",[10944]],[\"supset\",[8835]],[\"Supset\",[8913]],[\"supseteq\",[8839]],[\"supseteqq\",[10950]],[\"supsetneq\",[8843]],[\"supsetneqq\",[10956]],[\"supsim\",[10952]],[\"supsub\",[10964]],[\"supsup\",[10966]],[\"swarhk\",[10534]],[\"swarr\",[8601]],[\"swArr\",[8665]],[\"swarrow\",[8601]],[\"swnwar\",[10538]],[\"szlig\",[223]],[\"Tab\",[9]],[\"target\",[8982]],[\"Tau\",[932]],[\"tau\",[964]],[\"tbrk\",[9140]],[\"Tcaron\",[356]],[\"tcaron\",[357]],[\"Tcedil\",[354]],[\"tcedil\",[355]],[\"Tcy\",[1058]],[\"tcy\",[1090]],[\"tdot\",[8411]],[\"telrec\",[8981]],[\"Tfr\",[120087]],[\"tfr\",[120113]],[\"there4\",[8756]],[\"therefore\",[8756]],[\"Therefore\",[8756]],[\"Theta\",[920]],[\"theta\",[952]],[\"thetasym\",[977]],[\"thetav\",[977]],[\"thickapprox\",[8776]],[\"thicksim\",[8764]],[\"ThickSpace\",[8287,8202]],[\"ThinSpace\",[8201]],[\"thinsp\",[8201]],[\"thkap\",[8776]],[\"thksim\",[8764]],[\"THORN\",[222]],[\"thorn\",[254]],[\"tilde\",[732]],[\"Tilde\",[8764]],[\"TildeEqual\",[8771]],[\"TildeFullEqual\",[8773]],[\"TildeTilde\",[8776]],[\"timesbar\",[10801]],[\"timesb\",[8864]],[\"times\",[215]],[\"timesd\",[10800]],[\"tint\",[8749]],[\"toea\",[10536]],[\"topbot\",[9014]],[\"topcir\",[10993]],[\"top\",[8868]],[\"Topf\",[120139]],[\"topf\",[120165]],[\"topfork\",[10970]],[\"tosa\",[10537]],[\"tprime\",[8244]],[\"trade\",[8482]],[\"TRADE\",[8482]],[\"triangle\",[9653]],[\"triangledown\",[9663]],[\"triangleleft\",[9667]],[\"trianglelefteq\",[8884]],[\"triangleq\",[8796]],[\"triangleright\",[9657]],[\"trianglerighteq\",[8885]],[\"tridot\",[9708]],[\"trie\",[8796]],[\"triminus\",[10810]],[\"TripleDot\",[8411]],[\"triplus\",[10809]],[\"trisb\",[10701]],[\"tritime\",[10811]],[\"trpezium\",[9186]],[\"Tscr\",[119983]],[\"tscr\",[120009]],[\"TScy\",[1062]],[\"tscy\",[1094]],[\"TSHcy\",[1035]],[\"tshcy\",[1115]],[\"Tstrok\",[358]],[\"tstrok\",[359]],[\"twixt\",[8812]],[\"twoheadleftarrow\",[8606]],[\"twoheadrightarrow\",[8608]],[\"Uacute\",[218]],[\"uacute\",[250]],[\"uarr\",[8593]],[\"Uarr\",[8607]],[\"uArr\",[8657]],[\"Uarrocir\",[10569]],[\"Ubrcy\",[1038]],[\"ubrcy\",[1118]],[\"Ubreve\",[364]],[\"ubreve\",[365]],[\"Ucirc\",[219]],[\"ucirc\",[251]],[\"Ucy\",[1059]],[\"ucy\",[1091]],[\"udarr\",[8645]],[\"Udblac\",[368]],[\"udblac\",[369]],[\"udhar\",[10606]],[\"ufisht\",[10622]],[\"Ufr\",[120088]],[\"ufr\",[120114]],[\"Ugrave\",[217]],[\"ugrave\",[249]],[\"uHar\",[10595]],[\"uharl\",[8639]],[\"uharr\",[8638]],[\"uhblk\",[9600]],[\"ulcorn\",[8988]],[\"ulcorner\",[8988]],[\"ulcrop\",[8975]],[\"ultri\",[9720]],[\"Umacr\",[362]],[\"umacr\",[363]],[\"uml\",[168]],[\"UnderBar\",[95]],[\"UnderBrace\",[9183]],[\"UnderBracket\",[9141]],[\"UnderParenthesis\",[9181]],[\"Union\",[8899]],[\"UnionPlus\",[8846]],[\"Uogon\",[370]],[\"uogon\",[371]],[\"Uopf\",[120140]],[\"uopf\",[120166]],[\"UpArrowBar\",[10514]],[\"uparrow\",[8593]],[\"UpArrow\",[8593]],[\"Uparrow\",[8657]],[\"UpArrowDownArrow\",[8645]],[\"updownarrow\",[8597]],[\"UpDownArrow\",[8597]],[\"Updownarrow\",[8661]],[\"UpEquilibrium\",[10606]],[\"upharpoonleft\",[8639]],[\"upharpoonright\",[8638]],[\"uplus\",[8846]],[\"UpperLeftArrow\",[8598]],[\"UpperRightArrow\",[8599]],[\"upsi\",[965]],[\"Upsi\",[978]],[\"upsih\",[978]],[\"Upsilon\",[933]],[\"upsilon\",[965]],[\"UpTeeArrow\",[8613]],[\"UpTee\",[8869]],[\"upuparrows\",[8648]],[\"urcorn\",[8989]],[\"urcorner\",[8989]],[\"urcrop\",[8974]],[\"Uring\",[366]],[\"uring\",[367]],[\"urtri\",[9721]],[\"Uscr\",[119984]],[\"uscr\",[120010]],[\"utdot\",[8944]],[\"Utilde\",[360]],[\"utilde\",[361]],[\"utri\",[9653]],[\"utrif\",[9652]],[\"uuarr\",[8648]],[\"Uuml\",[220]],[\"uuml\",[252]],[\"uwangle\",[10663]],[\"vangrt\",[10652]],[\"varepsilon\",[1013]],[\"varkappa\",[1008]],[\"varnothing\",[8709]],[\"varphi\",[981]],[\"varpi\",[982]],[\"varpropto\",[8733]],[\"varr\",[8597]],[\"vArr\",[8661]],[\"varrho\",[1009]],[\"varsigma\",[962]],[\"varsubsetneq\",[8842,65024]],[\"varsubsetneqq\",[10955,65024]],[\"varsupsetneq\",[8843,65024]],[\"varsupsetneqq\",[10956,65024]],[\"vartheta\",[977]],[\"vartriangleleft\",[8882]],[\"vartriangleright\",[8883]],[\"vBar\",[10984]],[\"Vbar\",[10987]],[\"vBarv\",[10985]],[\"Vcy\",[1042]],[\"vcy\",[1074]],[\"vdash\",[8866]],[\"vDash\",[8872]],[\"Vdash\",[8873]],[\"VDash\",[8875]],[\"Vdashl\",[10982]],[\"veebar\",[8891]],[\"vee\",[8744]],[\"Vee\",[8897]],[\"veeeq\",[8794]],[\"vellip\",[8942]],[\"verbar\",[124]],[\"Verbar\",[8214]],[\"vert\",[124]],[\"Vert\",[8214]],[\"VerticalBar\",[8739]],[\"VerticalLine\",[124]],[\"VerticalSeparator\",[10072]],[\"VerticalTilde\",[8768]],[\"VeryThinSpace\",[8202]],[\"Vfr\",[120089]],[\"vfr\",[120115]],[\"vltri\",[8882]],[\"vnsub\",[8834,8402]],[\"vnsup\",[8835,8402]],[\"Vopf\",[120141]],[\"vopf\",[120167]],[\"vprop\",[8733]],[\"vrtri\",[8883]],[\"Vscr\",[119985]],[\"vscr\",[120011]],[\"vsubnE\",[10955,65024]],[\"vsubne\",[8842,65024]],[\"vsupnE\",[10956,65024]],[\"vsupne\",[8843,65024]],[\"Vvdash\",[8874]],[\"vzigzag\",[10650]],[\"Wcirc\",[372]],[\"wcirc\",[373]],[\"wedbar\",[10847]],[\"wedge\",[8743]],[\"Wedge\",[8896]],[\"wedgeq\",[8793]],[\"weierp\",[8472]],[\"Wfr\",[120090]],[\"wfr\",[120116]],[\"Wopf\",[120142]],[\"wopf\",[120168]],[\"wp\",[8472]],[\"wr\",[8768]],[\"wreath\",[8768]],[\"Wscr\",[119986]],[\"wscr\",[120012]],[\"xcap\",[8898]],[\"xcirc\",[9711]],[\"xcup\",[8899]],[\"xdtri\",[9661]],[\"Xfr\",[120091]],[\"xfr\",[120117]],[\"xharr\",[10231]],[\"xhArr\",[10234]],[\"Xi\",[926]],[\"xi\",[958]],[\"xlarr\",[10229]],[\"xlArr\",[10232]],[\"xmap\",[10236]],[\"xnis\",[8955]],[\"xodot\",[10752]],[\"Xopf\",[120143]],[\"xopf\",[120169]],[\"xoplus\",[10753]],[\"xotime\",[10754]],[\"xrarr\",[10230]],[\"xrArr\",[10233]],[\"Xscr\",[119987]],[\"xscr\",[120013]],[\"xsqcup\",[10758]],[\"xuplus\",[10756]],[\"xutri\",[9651]],[\"xvee\",[8897]],[\"xwedge\",[8896]],[\"Yacute\",[221]],[\"yacute\",[253]],[\"YAcy\",[1071]],[\"yacy\",[1103]],[\"Ycirc\",[374]],[\"ycirc\",[375]],[\"Ycy\",[1067]],[\"ycy\",[1099]],[\"yen\",[165]],[\"Yfr\",[120092]],[\"yfr\",[120118]],[\"YIcy\",[1031]],[\"yicy\",[1111]],[\"Yopf\",[120144]],[\"yopf\",[120170]],[\"Yscr\",[119988]],[\"yscr\",[120014]],[\"YUcy\",[1070]],[\"yucy\",[1102]],[\"yuml\",[255]],[\"Yuml\",[376]],[\"Zacute\",[377]],[\"zacute\",[378]],[\"Zcaron\",[381]],[\"zcaron\",[382]],[\"Zcy\",[1047]],[\"zcy\",[1079]],[\"Zdot\",[379]],[\"zdot\",[380]],[\"zeetrf\",[8488]],[\"ZeroWidthSpace\",[8203]],[\"Zeta\",[918]],[\"zeta\",[950]],[\"zfr\",[120119]],[\"Zfr\",[8488]],[\"ZHcy\",[1046]],[\"zhcy\",[1078]],[\"zigrarr\",[8669]],[\"zopf\",[120171]],[\"Zopf\",[8484]],[\"Zscr\",[119989]],[\"zscr\",[120015]],[\"zwj\",[8205]],[\"zwnj\",[8204]]],r={},o={};!function(e,t){for(var u=n.length,r=[];u--;){var o,a=n[u],i=a[0],l=a[1],c=l[0],s=c<32||c>126||62===c||60===c||38===c||34===c||39===c;if(s&&(o=t[c]=t[c]||{}),l[1]){var f=l[1];e[i]=String.fromCharCode(c)+String.fromCharCode(f),r.push(s&&(o[f]=i))}else e[i]=String.fromCharCode(c),r.push(s&&(o[\"\"]=i))}}(r,o),u.prototype.decode=function(e){return e&&e.length?e.replace(/&(#?[\\w\\d]+);?/g,function(e,t){var u;if(\"#\"===t.charAt(0)){var n=\"x\"===t.charAt(1)?parseInt(t.substr(2).toLowerCase(),16):parseInt(t.substr(1));isNaN(n)||n<-32768||n>65535||(u=String.fromCharCode(n))}else u=r[t];return u||e}):\"\"},u.decode=function(e){return(new u).decode(e)},u.prototype.encode=function(e){if(!e||!e.length)return\"\";for(var t=e.length,u=\"\",n=0;n<t;){var r=o[e.charCodeAt(n)];if(r){var a=r[e.charCodeAt(n+1)];if(a?n++:a=r[\"\"],a){u+=\"&\"+a+\";\",n++;continue}}u+=e.charAt(n),n++}return u},u.encode=function(e){return(new u).encode(e)},u.prototype.encodeNonUTF=function(e){if(!e||!e.length)return\"\";for(var t=e.length,u=\"\",n=0;n<t;){var r=e.charCodeAt(n),a=o[r];if(a){var i=a[e.charCodeAt(n+1)];if(i?n++:i=a[\"\"],i){u+=\"&\"+i+\";\",n++;continue}}u+=r<32||r>126?\"&#\"+r+\";\":e.charAt(n),n++}return u},u.encodeNonUTF=function(e){return(new u).encodeNonUTF(e)},u.prototype.encodeNonASCII=function(e){if(!e||!e.length)return\"\";for(var t=e.length,u=\"\",n=0;n<t;){var r=e.charCodeAt(n);r<=255?u+=e[n++]:(u+=\"&#\"+r+\";\",n++)}return u},u.encodeNonASCII=function(e){return(new u).encodeNonASCII(e)},e.exports=u},function(e,t,u){\"use strict\";function n(e,t){e.setAttribute(\"style\",\"\");for(var u in t)t.hasOwnProperty(u)&&(e.style[u]=t[u])}u.d(t,\"a\",function(){return n})},function(e,t){!function(){\"use strict\";function t(e){return 48<=e&&e<=57}function u(e){return 48<=e&&e<=57||97<=e&&e<=102||65<=e&&e<=70}function n(e){return e>=48&&e<=55}function r(e){return 32===e||9===e||11===e||12===e||160===e||e>=5760&&d.indexOf(e)>=0}function o(e){return 10===e||13===e||8232===e||8233===e}function a(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(Math.floor((e-65536)/1024)+55296)+String.fromCharCode((e-65536)%1024+56320)}function i(e){return e<128?D[e]:p.NonAsciiIdentifierStart.test(a(e))}function l(e){return e<128?h[e]:p.NonAsciiIdentifierPart.test(a(e))}function c(e){return e<128?D[e]:f.NonAsciiIdentifierStart.test(a(e))}function s(e){return e<128?h[e]:f.NonAsciiIdentifierPart.test(a(e))}var f,p,d,D,h,m;for(p={NonAsciiIdentifierStart:/[\\xAA\\xB5\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0-\\u08B2\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0980\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA69D\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA7AD\\uA7B0\\uA7B1\\uA7F7-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uA9E0-\\uA9E4\\uA9E6-\\uA9EF\\uA9FA-\\uA9FE\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA7E-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB5F\\uAB64\\uAB65\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]/,NonAsciiIdentifierPart:/[\\xAA\\xB5\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0300-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u0483-\\u0487\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0610-\\u061A\\u0620-\\u0669\\u066E-\\u06D3\\u06D5-\\u06DC\\u06DF-\\u06E8\\u06EA-\\u06FC\\u06FF\\u0710-\\u074A\\u074D-\\u07B1\\u07C0-\\u07F5\\u07FA\\u0800-\\u082D\\u0840-\\u085B\\u08A0-\\u08B2\\u08E4-\\u0963\\u0966-\\u096F\\u0971-\\u0983\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BC-\\u09C4\\u09C7\\u09C8\\u09CB-\\u09CE\\u09D7\\u09DC\\u09DD\\u09DF-\\u09E3\\u09E6-\\u09F1\\u0A01-\\u0A03\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A3C\\u0A3E-\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A59-\\u0A5C\\u0A5E\\u0A66-\\u0A75\\u0A81-\\u0A83\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABC-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0AD0\\u0AE0-\\u0AE3\\u0AE6-\\u0AEF\\u0B01-\\u0B03\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3C-\\u0B44\\u0B47\\u0B48\\u0B4B-\\u0B4D\\u0B56\\u0B57\\u0B5C\\u0B5D\\u0B5F-\\u0B63\\u0B66-\\u0B6F\\u0B71\\u0B82\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD0\\u0BD7\\u0BE6-\\u0BEF\\u0C00-\\u0C03\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D-\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C58\\u0C59\\u0C60-\\u0C63\\u0C66-\\u0C6F\\u0C81-\\u0C83\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBC-\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5\\u0CD6\\u0CDE\\u0CE0-\\u0CE3\\u0CE6-\\u0CEF\\u0CF1\\u0CF2\\u0D01-\\u0D03\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D-\\u0D44\\u0D46-\\u0D48\\u0D4A-\\u0D4E\\u0D57\\u0D60-\\u0D63\\u0D66-\\u0D6F\\u0D7A-\\u0D7F\\u0D82\\u0D83\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0DCA\\u0DCF-\\u0DD4\\u0DD6\\u0DD8-\\u0DDF\\u0DE6-\\u0DEF\\u0DF2\\u0DF3\\u0E01-\\u0E3A\\u0E40-\\u0E4E\\u0E50-\\u0E59\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB9\\u0EBB-\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EC8-\\u0ECD\\u0ED0-\\u0ED9\\u0EDC-\\u0EDF\\u0F00\\u0F18\\u0F19\\u0F20-\\u0F29\\u0F35\\u0F37\\u0F39\\u0F3E-\\u0F47\\u0F49-\\u0F6C\\u0F71-\\u0F84\\u0F86-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u1000-\\u1049\\u1050-\\u109D\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u135D-\\u135F\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u170C\\u170E-\\u1714\\u1720-\\u1734\\u1740-\\u1753\\u1760-\\u176C\\u176E-\\u1770\\u1772\\u1773\\u1780-\\u17D3\\u17D7\\u17DC\\u17DD\\u17E0-\\u17E9\\u180B-\\u180D\\u1810-\\u1819\\u1820-\\u1877\\u1880-\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1920-\\u192B\\u1930-\\u193B\\u1946-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19B0-\\u19C9\\u19D0-\\u19D9\\u1A00-\\u1A1B\\u1A20-\\u1A5E\\u1A60-\\u1A7C\\u1A7F-\\u1A89\\u1A90-\\u1A99\\u1AA7\\u1AB0-\\u1ABD\\u1B00-\\u1B4B\\u1B50-\\u1B59\\u1B6B-\\u1B73\\u1B80-\\u1BF3\\u1C00-\\u1C37\\u1C40-\\u1C49\\u1C4D-\\u1C7D\\u1CD0-\\u1CD2\\u1CD4-\\u1CF6\\u1CF8\\u1CF9\\u1D00-\\u1DF5\\u1DFC-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u200C\\u200D\\u203F\\u2040\\u2054\\u2071\\u207F\\u2090-\\u209C\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D7F-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2DE0-\\u2DFF\\u2E2F\\u3005-\\u3007\\u3021-\\u302F\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u3099\\u309A\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA62B\\uA640-\\uA66F\\uA674-\\uA67D\\uA67F-\\uA69D\\uA69F-\\uA6F1\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA7AD\\uA7B0\\uA7B1\\uA7F7-\\uA827\\uA840-\\uA873\\uA880-\\uA8C4\\uA8D0-\\uA8D9\\uA8E0-\\uA8F7\\uA8FB\\uA900-\\uA92D\\uA930-\\uA953\\uA960-\\uA97C\\uA980-\\uA9C0\\uA9CF-\\uA9D9\\uA9E0-\\uA9FE\\uAA00-\\uAA36\\uAA40-\\uAA4D\\uAA50-\\uAA59\\uAA60-\\uAA76\\uAA7A-\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEF\\uAAF2-\\uAAF6\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB5F\\uAB64\\uAB65\\uABC0-\\uABEA\\uABEC\\uABED\\uABF0-\\uABF9\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE00-\\uFE0F\\uFE20-\\uFE2D\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF10-\\uFF19\\uFF21-\\uFF3A\\uFF3F\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]/},f={NonAsciiIdentifierStart:/[\\xAA\\xB5\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0-\\u08B2\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0980\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2118-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309B-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA69D\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA7AD\\uA7B0\\uA7B1\\uA7F7-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uA9E0-\\uA9E4\\uA9E6-\\uA9EF\\uA9FA-\\uA9FE\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA7E-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB5F\\uAB64\\uAB65\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]|\\uD800[\\uDC00-\\uDC0B\\uDC0D-\\uDC26\\uDC28-\\uDC3A\\uDC3C\\uDC3D\\uDC3F-\\uDC4D\\uDC50-\\uDC5D\\uDC80-\\uDCFA\\uDD40-\\uDD74\\uDE80-\\uDE9C\\uDEA0-\\uDED0\\uDF00-\\uDF1F\\uDF30-\\uDF4A\\uDF50-\\uDF75\\uDF80-\\uDF9D\\uDFA0-\\uDFC3\\uDFC8-\\uDFCF\\uDFD1-\\uDFD5]|\\uD801[\\uDC00-\\uDC9D\\uDD00-\\uDD27\\uDD30-\\uDD63\\uDE00-\\uDF36\\uDF40-\\uDF55\\uDF60-\\uDF67]|\\uD802[\\uDC00-\\uDC05\\uDC08\\uDC0A-\\uDC35\\uDC37\\uDC38\\uDC3C\\uDC3F-\\uDC55\\uDC60-\\uDC76\\uDC80-\\uDC9E\\uDD00-\\uDD15\\uDD20-\\uDD39\\uDD80-\\uDDB7\\uDDBE\\uDDBF\\uDE00\\uDE10-\\uDE13\\uDE15-\\uDE17\\uDE19-\\uDE33\\uDE60-\\uDE7C\\uDE80-\\uDE9C\\uDEC0-\\uDEC7\\uDEC9-\\uDEE4\\uDF00-\\uDF35\\uDF40-\\uDF55\\uDF60-\\uDF72\\uDF80-\\uDF91]|\\uD803[\\uDC00-\\uDC48]|\\uD804[\\uDC03-\\uDC37\\uDC83-\\uDCAF\\uDCD0-\\uDCE8\\uDD03-\\uDD26\\uDD50-\\uDD72\\uDD76\\uDD83-\\uDDB2\\uDDC1-\\uDDC4\\uDDDA\\uDE00-\\uDE11\\uDE13-\\uDE2B\\uDEB0-\\uDEDE\\uDF05-\\uDF0C\\uDF0F\\uDF10\\uDF13-\\uDF28\\uDF2A-\\uDF30\\uDF32\\uDF33\\uDF35-\\uDF39\\uDF3D\\uDF5D-\\uDF61]|\\uD805[\\uDC80-\\uDCAF\\uDCC4\\uDCC5\\uDCC7\\uDD80-\\uDDAE\\uDE00-\\uDE2F\\uDE44\\uDE80-\\uDEAA]|\\uD806[\\uDCA0-\\uDCDF\\uDCFF\\uDEC0-\\uDEF8]|\\uD808[\\uDC00-\\uDF98]|\\uD809[\\uDC00-\\uDC6E]|[\\uD80C\\uD840-\\uD868\\uD86A-\\uD86C][\\uDC00-\\uDFFF]|\\uD80D[\\uDC00-\\uDC2E]|\\uD81A[\\uDC00-\\uDE38\\uDE40-\\uDE5E\\uDED0-\\uDEED\\uDF00-\\uDF2F\\uDF40-\\uDF43\\uDF63-\\uDF77\\uDF7D-\\uDF8F]|\\uD81B[\\uDF00-\\uDF44\\uDF50\\uDF93-\\uDF9F]|\\uD82C[\\uDC00\\uDC01]|\\uD82F[\\uDC00-\\uDC6A\\uDC70-\\uDC7C\\uDC80-\\uDC88\\uDC90-\\uDC99]|\\uD835[\\uDC00-\\uDC54\\uDC56-\\uDC9C\\uDC9E\\uDC9F\\uDCA2\\uDCA5\\uDCA6\\uDCA9-\\uDCAC\\uDCAE-\\uDCB9\\uDCBB\\uDCBD-\\uDCC3\\uDCC5-\\uDD05\\uDD07-\\uDD0A\\uDD0D-\\uDD14\\uDD16-\\uDD1C\\uDD1E-\\uDD39\\uDD3B-\\uDD3E\\uDD40-\\uDD44\\uDD46\\uDD4A-\\uDD50\\uDD52-\\uDEA5\\uDEA8-\\uDEC0\\uDEC2-\\uDEDA\\uDEDC-\\uDEFA\\uDEFC-\\uDF14\\uDF16-\\uDF34\\uDF36-\\uDF4E\\uDF50-\\uDF6E\\uDF70-\\uDF88\\uDF8A-\\uDFA8\\uDFAA-\\uDFC2\\uDFC4-\\uDFCB]|\\uD83A[\\uDC00-\\uDCC4]|\\uD83B[\\uDE00-\\uDE03\\uDE05-\\uDE1F\\uDE21\\uDE22\\uDE24\\uDE27\\uDE29-\\uDE32\\uDE34-\\uDE37\\uDE39\\uDE3B\\uDE42\\uDE47\\uDE49\\uDE4B\\uDE4D-\\uDE4F\\uDE51\\uDE52\\uDE54\\uDE57\\uDE59\\uDE5B\\uDE5D\\uDE5F\\uDE61\\uDE62\\uDE64\\uDE67-\\uDE6A\\uDE6C-\\uDE72\\uDE74-\\uDE77\\uDE79-\\uDE7C\\uDE7E\\uDE80-\\uDE89\\uDE8B-\\uDE9B\\uDEA1-\\uDEA3\\uDEA5-\\uDEA9\\uDEAB-\\uDEBB]|\\uD869[\\uDC00-\\uDED6\\uDF00-\\uDFFF]|\\uD86D[\\uDC00-\\uDF34\\uDF40-\\uDFFF]|\\uD86E[\\uDC00-\\uDC1D]|\\uD87E[\\uDC00-\\uDE1D]/,NonAsciiIdentifierPart:/[\\xAA\\xB5\\xB7\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0300-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u0483-\\u0487\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0610-\\u061A\\u0620-\\u0669\\u066E-\\u06D3\\u06D5-\\u06DC\\u06DF-\\u06E8\\u06EA-\\u06FC\\u06FF\\u0710-\\u074A\\u074D-\\u07B1\\u07C0-\\u07F5\\u07FA\\u0800-\\u082D\\u0840-\\u085B\\u08A0-\\u08B2\\u08E4-\\u0963\\u0966-\\u096F\\u0971-\\u0983\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BC-\\u09C4\\u09C7\\u09C8\\u09CB-\\u09CE\\u09D7\\u09DC\\u09DD\\u09DF-\\u09E3\\u09E6-\\u09F1\\u0A01-\\u0A03\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A3C\\u0A3E-\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A59-\\u0A5C\\u0A5E\\u0A66-\\u0A75\\u0A81-\\u0A83\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABC-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0AD0\\u0AE0-\\u0AE3\\u0AE6-\\u0AEF\\u0B01-\\u0B03\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3C-\\u0B44\\u0B47\\u0B48\\u0B4B-\\u0B4D\\u0B56\\u0B57\\u0B5C\\u0B5D\\u0B5F-\\u0B63\\u0B66-\\u0B6F\\u0B71\\u0B82\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD0\\u0BD7\\u0BE6-\\u0BEF\\u0C00-\\u0C03\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D-\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C58\\u0C59\\u0C60-\\u0C63\\u0C66-\\u0C6F\\u0C81-\\u0C83\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBC-\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5\\u0CD6\\u0CDE\\u0CE0-\\u0CE3\\u0CE6-\\u0CEF\\u0CF1\\u0CF2\\u0D01-\\u0D03\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D-\\u0D44\\u0D46-\\u0D48\\u0D4A-\\u0D4E\\u0D57\\u0D60-\\u0D63\\u0D66-\\u0D6F\\u0D7A-\\u0D7F\\u0D82\\u0D83\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0DCA\\u0DCF-\\u0DD4\\u0DD6\\u0DD8-\\u0DDF\\u0DE6-\\u0DEF\\u0DF2\\u0DF3\\u0E01-\\u0E3A\\u0E40-\\u0E4E\\u0E50-\\u0E59\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB9\\u0EBB-\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EC8-\\u0ECD\\u0ED0-\\u0ED9\\u0EDC-\\u0EDF\\u0F00\\u0F18\\u0F19\\u0F20-\\u0F29\\u0F35\\u0F37\\u0F39\\u0F3E-\\u0F47\\u0F49-\\u0F6C\\u0F71-\\u0F84\\u0F86-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u1000-\\u1049\\u1050-\\u109D\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u135D-\\u135F\\u1369-\\u1371\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u170C\\u170E-\\u1714\\u1720-\\u1734\\u1740-\\u1753\\u1760-\\u176C\\u176E-\\u1770\\u1772\\u1773\\u1780-\\u17D3\\u17D7\\u17DC\\u17DD\\u17E0-\\u17E9\\u180B-\\u180D\\u1810-\\u1819\\u1820-\\u1877\\u1880-\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1920-\\u192B\\u1930-\\u193B\\u1946-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19B0-\\u19C9\\u19D0-\\u19DA\\u1A00-\\u1A1B\\u1A20-\\u1A5E\\u1A60-\\u1A7C\\u1A7F-\\u1A89\\u1A90-\\u1A99\\u1AA7\\u1AB0-\\u1ABD\\u1B00-\\u1B4B\\u1B50-\\u1B59\\u1B6B-\\u1B73\\u1B80-\\u1BF3\\u1C00-\\u1C37\\u1C40-\\u1C49\\u1C4D-\\u1C7D\\u1CD0-\\u1CD2\\u1CD4-\\u1CF6\\u1CF8\\u1CF9\\u1D00-\\u1DF5\\u1DFC-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u200C\\u200D\\u203F\\u2040\\u2054\\u2071\\u207F\\u2090-\\u209C\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2118-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D7F-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2DE0-\\u2DFF\\u3005-\\u3007\\u3021-\\u302F\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u3099-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA62B\\uA640-\\uA66F\\uA674-\\uA67D\\uA67F-\\uA69D\\uA69F-\\uA6F1\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA7AD\\uA7B0\\uA7B1\\uA7F7-\\uA827\\uA840-\\uA873\\uA880-\\uA8C4\\uA8D0-\\uA8D9\\uA8E0-\\uA8F7\\uA8FB\\uA900-\\uA92D\\uA930-\\uA953\\uA960-\\uA97C\\uA980-\\uA9C0\\uA9CF-\\uA9D9\\uA9E0-\\uA9FE\\uAA00-\\uAA36\\uAA40-\\uAA4D\\uAA50-\\uAA59\\uAA60-\\uAA76\\uAA7A-\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEF\\uAAF2-\\uAAF6\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB5F\\uAB64\\uAB65\\uABC0-\\uABEA\\uABEC\\uABED\\uABF0-\\uABF9\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE00-\\uFE0F\\uFE20-\\uFE2D\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF10-\\uFF19\\uFF21-\\uFF3A\\uFF3F\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]|\\uD800[\\uDC00-\\uDC0B\\uDC0D-\\uDC26\\uDC28-\\uDC3A\\uDC3C\\uDC3D\\uDC3F-\\uDC4D\\uDC50-\\uDC5D\\uDC80-\\uDCFA\\uDD40-\\uDD74\\uDDFD\\uDE80-\\uDE9C\\uDEA0-\\uDED0\\uDEE0\\uDF00-\\uDF1F\\uDF30-\\uDF4A\\uDF50-\\uDF7A\\uDF80-\\uDF9D\\uDFA0-\\uDFC3\\uDFC8-\\uDFCF\\uDFD1-\\uDFD5]|\\uD801[\\uDC00-\\uDC9D\\uDCA0-\\uDCA9\\uDD00-\\uDD27\\uDD30-\\uDD63\\uDE00-\\uDF36\\uDF40-\\uDF55\\uDF60-\\uDF67]|\\uD802[\\uDC00-\\uDC05\\uDC08\\uDC0A-\\uDC35\\uDC37\\uDC38\\uDC3C\\uDC3F-\\uDC55\\uDC60-\\uDC76\\uDC80-\\uDC9E\\uDD00-\\uDD15\\uDD20-\\uDD39\\uDD80-\\uDDB7\\uDDBE\\uDDBF\\uDE00-\\uDE03\\uDE05\\uDE06\\uDE0C-\\uDE13\\uDE15-\\uDE17\\uDE19-\\uDE33\\uDE38-\\uDE3A\\uDE3F\\uDE60-\\uDE7C\\uDE80-\\uDE9C\\uDEC0-\\uDEC7\\uDEC9-\\uDEE6\\uDF00-\\uDF35\\uDF40-\\uDF55\\uDF60-\\uDF72\\uDF80-\\uDF91]|\\uD803[\\uDC00-\\uDC48]|\\uD804[\\uDC00-\\uDC46\\uDC66-\\uDC6F\\uDC7F-\\uDCBA\\uDCD0-\\uDCE8\\uDCF0-\\uDCF9\\uDD00-\\uDD34\\uDD36-\\uDD3F\\uDD50-\\uDD73\\uDD76\\uDD80-\\uDDC4\\uDDD0-\\uDDDA\\uDE00-\\uDE11\\uDE13-\\uDE37\\uDEB0-\\uDEEA\\uDEF0-\\uDEF9\\uDF01-\\uDF03\\uDF05-\\uDF0C\\uDF0F\\uDF10\\uDF13-\\uDF28\\uDF2A-\\uDF30\\uDF32\\uDF33\\uDF35-\\uDF39\\uDF3C-\\uDF44\\uDF47\\uDF48\\uDF4B-\\uDF4D\\uDF57\\uDF5D-\\uDF63\\uDF66-\\uDF6C\\uDF70-\\uDF74]|\\uD805[\\uDC80-\\uDCC5\\uDCC7\\uDCD0-\\uDCD9\\uDD80-\\uDDB5\\uDDB8-\\uDDC0\\uDE00-\\uDE40\\uDE44\\uDE50-\\uDE59\\uDE80-\\uDEB7\\uDEC0-\\uDEC9]|\\uD806[\\uDCA0-\\uDCE9\\uDCFF\\uDEC0-\\uDEF8]|\\uD808[\\uDC00-\\uDF98]|\\uD809[\\uDC00-\\uDC6E]|[\\uD80C\\uD840-\\uD868\\uD86A-\\uD86C][\\uDC00-\\uDFFF]|\\uD80D[\\uDC00-\\uDC2E]|\\uD81A[\\uDC00-\\uDE38\\uDE40-\\uDE5E\\uDE60-\\uDE69\\uDED0-\\uDEED\\uDEF0-\\uDEF4\\uDF00-\\uDF36\\uDF40-\\uDF43\\uDF50-\\uDF59\\uDF63-\\uDF77\\uDF7D-\\uDF8F]|\\uD81B[\\uDF00-\\uDF44\\uDF50-\\uDF7E\\uDF8F-\\uDF9F]|\\uD82C[\\uDC00\\uDC01]|\\uD82F[\\uDC00-\\uDC6A\\uDC70-\\uDC7C\\uDC80-\\uDC88\\uDC90-\\uDC99\\uDC9D\\uDC9E]|\\uD834[\\uDD65-\\uDD69\\uDD6D-\\uDD72\\uDD7B-\\uDD82\\uDD85-\\uDD8B\\uDDAA-\\uDDAD\\uDE42-\\uDE44]|\\uD835[\\uDC00-\\uDC54\\uDC56-\\uDC9C\\uDC9E\\uDC9F\\uDCA2\\uDCA5\\uDCA6\\uDCA9-\\uDCAC\\uDCAE-\\uDCB9\\uDCBB\\uDCBD-\\uDCC3\\uDCC5-\\uDD05\\uDD07-\\uDD0A\\uDD0D-\\uDD14\\uDD16-\\uDD1C\\uDD1E-\\uDD39\\uDD3B-\\uDD3E\\uDD40-\\uDD44\\uDD46\\uDD4A-\\uDD50\\uDD52-\\uDEA5\\uDEA8-\\uDEC0\\uDEC2-\\uDEDA\\uDEDC-\\uDEFA\\uDEFC-\\uDF14\\uDF16-\\uDF34\\uDF36-\\uDF4E\\uDF50-\\uDF6E\\uDF70-\\uDF88\\uDF8A-\\uDFA8\\uDFAA-\\uDFC2\\uDFC4-\\uDFCB\\uDFCE-\\uDFFF]|\\uD83A[\\uDC00-\\uDCC4\\uDCD0-\\uDCD6]|\\uD83B[\\uDE00-\\uDE03\\uDE05-\\uDE1F\\uDE21\\uDE22\\uDE24\\uDE27\\uDE29-\\uDE32\\uDE34-\\uDE37\\uDE39\\uDE3B\\uDE42\\uDE47\\uDE49\\uDE4B\\uDE4D-\\uDE4F\\uDE51\\uDE52\\uDE54\\uDE57\\uDE59\\uDE5B\\uDE5D\\uDE5F\\uDE61\\uDE62\\uDE64\\uDE67-\\uDE6A\\uDE6C-\\uDE72\\uDE74-\\uDE77\\uDE79-\\uDE7C\\uDE7E\\uDE80-\\uDE89\\uDE8B-\\uDE9B\\uDEA1-\\uDEA3\\uDEA5-\\uDEA9\\uDEAB-\\uDEBB]|\\uD869[\\uDC00-\\uDED6\\uDF00-\\uDFFF]|\\uD86D[\\uDC00-\\uDF34\\uDF40-\\uDFFF]|\\uD86E[\\uDC00-\\uDC1D]|\\uD87E[\\uDC00-\\uDE1D]|\\uDB40[\\uDD00-\\uDDEF]/},d=[5760,6158,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288,65279],D=new Array(128),m=0;m<128;++m)D[m]=m>=97&&m<=122||m>=65&&m<=90||36===m||95===m;for(h=new Array(128),m=0;m<128;++m)h[m]=m>=97&&m<=122||m>=65&&m<=90||m>=48&&m<=57||36===m||95===m;e.exports={isDecimalDigit:t,isHexDigit:u,isOctalDigit:n,isWhiteSpace:r,isLineTerminator:o,isIdentifierStartES5:i,isIdentifierPartES5:l,isIdentifierStartES6:c,isIdentifierPartES6:s}}()},function(e,t){function u(){throw new Error(\"setTimeout has not been defined\")}function n(){throw new Error(\"clearTimeout has not been defined\")}function r(e){if(s===setTimeout)return setTimeout(e,0);if((s===u||!s)&&setTimeout)return s=setTimeout,setTimeout(e,0);try{return s(e,0)}catch(t){try{return s.call(null,e,0)}catch(t){return s.call(this,e,0)}}}function o(e){if(f===clearTimeout)return clearTimeout(e);if((f===n||!f)&&clearTimeout)return f=clearTimeout,clearTimeout(e);try{return f(e)}catch(t){try{return f.call(null,e)}catch(t){return f.call(this,e)}}}function a(){h&&d&&(h=!1,d.length?D=d.concat(D):m=-1,D.length&&i())}function i(){if(!h){var e=r(a);h=!0;for(var t=D.length;t;){for(d=D,D=[];++m<t;)d&&d[m].run();m=-1,t=D.length}d=null,h=!1,o(e)}}function l(e,t){this.fun=e,this.array=t}function c(){}var s,f,p=e.exports={};!function(){try{s=\"function\"===typeof setTimeout?setTimeout:u}catch(e){s=u}try{f=\"function\"===typeof clearTimeout?clearTimeout:n}catch(e){f=n}}();var d,D=[],h=!1,m=-1;p.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var u=1;u<arguments.length;u++)t[u-1]=arguments[u];D.push(new l(e,t)),1!==D.length||h||r(i)},l.prototype.run=function(){this.fun.apply(null,this.array)},p.title=\"browser\",p.browser=!0,p.env={},p.argv=[],p.version=\"\",p.versions={},p.on=c,p.addListener=c,p.once=c,p.off=c,p.removeListener=c,p.removeAllListeners=c,p.emit=c,p.prependListener=c,p.prependOnceListener=c,p.listeners=function(e){return[]},p.binding=function(e){throw new Error(\"process.binding is not supported\")},p.cwd=function(){return\"/\"},p.chdir=function(e){throw new Error(\"process.chdir is not supported\")},p.umask=function(){return 0}},function(e,t,u){\"use strict\";e.exports=function(){return/[\\u001b\\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g}},function(e,t,u){\"use strict\";function n(e){var t=e.currentBuildError,u=e.currentRuntimeErrorRecords,n=e.dismissRuntimeErrors,r=e.editorHandler;return t?a.a.createElement(c.a,{error:t,editorHandler:r}):u.length>0?a.a.createElement(s.a,{errorRecords:u,close:n,editorHandler:r}):null}Object.defineProperty(t,\"__esModule\",{value:!0});var r=u(18),o=(u.n(r),u(0)),a=u.n(o),i=u(24),l=u.n(i),c=u(34),s=u(39),f=u(1),p=u(13),d=null;window.updateContent=function(e){var t=n(e);return null===t?(l.a.unmountComponentAtNode(d),!1):(l.a.render(t,d),!0)},document.body.style.margin=\"0\",document.body.style[\"max-width\"]=\"100vw\",d=document.createElement(\"div\"),Object(p.a)(d,f.c),document.body.appendChild(d),window.parent.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.iframeReady()},function(e,t,u){\"undefined\"===typeof Promise&&(u(19).enable(),window.Promise=u(22)),Object.assign=u(2)},function(e,t,u){\"use strict\";function n(){c=!1,i._47=null,i._71=null}function r(e){function t(t){(e.allRejections||a(f[t].error,e.whitelist||l))&&(f[t].displayId=s++,e.onUnhandled?(f[t].logged=!0,e.onUnhandled(f[t].displayId,f[t].error)):(f[t].logged=!0,o(f[t].displayId,f[t].error)))}function u(t){f[t].logged&&(e.onHandled?e.onHandled(f[t].displayId,f[t].error):f[t].onUnhandled||(console.warn(\"Promise Rejection Handled (id: \"+f[t].displayId+\"):\"),console.warn('  This means you can ignore any previous messages of the form \"Possible Unhandled Promise Rejection\" with id '+f[t].displayId+\".\")))}e=e||{},c&&n(),c=!0;var r=0,s=0,f={};i._47=function(e){2===e._83&&f[e._56]&&(f[e._56].logged?u(e._56):clearTimeout(f[e._56].timeout),delete f[e._56])},i._71=function(e,u){0===e._75&&(e._56=r++,f[e._56]={displayId:null,error:u,timeout:setTimeout(t.bind(null,e._56),a(u,l)?100:2e3),logged:!1})}}function o(e,t){console.warn(\"Possible Unhandled Promise Rejection (id: \"+e+\"):\"),((t&&(t.stack||t))+\"\").split(\"\\n\").forEach(function(e){console.warn(\"  \"+e)})}function a(e,t){return t.some(function(t){return e instanceof t})}var i=u(4),l=[ReferenceError,TypeError,RangeError],c=!1;t.disable=n,t.enable=r},function(e,t,u){\"use strict\";(function(t){function u(e){a.length||(o(),i=!0),a[a.length]=e}function n(){for(;l<a.length;){var e=l;if(l+=1,a[e].call(),l>c){for(var t=0,u=a.length-l;t<u;t++)a[t]=a[t+l];a.length-=l,l=0}}a.length=0,l=0,i=!1}function r(e){return function(){function t(){clearTimeout(u),clearInterval(n),e()}var u=setTimeout(t,0),n=setInterval(t,50)}}e.exports=u;var o,a=[],i=!1,l=0,c=1024,s=\"undefined\"!==typeof t?t:self,f=s.MutationObserver||s.WebKitMutationObserver;o=\"function\"===typeof f?function(e){var t=1,u=new f(e),n=document.createTextNode(\"\");return u.observe(n,{characterData:!0}),function(){t=-t,n.data=t}}(n):r(n),u.requestFlush=o,u.makeRequestCallFromTimer=r}).call(t,u(21))},function(e,t){var u;u=function(){return this}();try{u=u||Function(\"return this\")()||(0,eval)(\"this\")}catch(e){\"object\"===typeof window&&(u=window)}e.exports=u},function(e,t,u){\"use strict\";function n(e){var t=new r(r._44);return t._83=1,t._18=e,t}var r=u(4);e.exports=r;var o=n(!0),a=n(!1),i=n(null),l=n(void 0),c=n(0),s=n(\"\");r.resolve=function(e){if(e instanceof r)return e;if(null===e)return i;if(void 0===e)return l;if(!0===e)return o;if(!1===e)return a;if(0===e)return c;if(\"\"===e)return s;if(\"object\"===typeof e||\"function\"===typeof e)try{var t=e.then;if(\"function\"===typeof t)return new r(t.bind(e))}catch(e){return new r(function(t,u){u(e)})}return n(e)},r.all=function(e){var t=Array.prototype.slice.call(e);return new r(function(e,u){function n(a,i){if(i&&(\"object\"===typeof i||\"function\"===typeof i)){if(i instanceof r&&i.then===r.prototype.then){for(;3===i._83;)i=i._18;return 1===i._83?n(a,i._18):(2===i._83&&u(i._18),void i.then(function(e){n(a,e)},u))}var l=i.then;if(\"function\"===typeof l){return void new r(l.bind(i)).then(function(e){n(a,e)},u)}}t[a]=i,0===--o&&e(t)}if(0===t.length)return e([]);for(var o=t.length,a=0;a<t.length;a++)n(a,t[a])})},r.reject=function(e){return new r(function(t,u){u(e)})},r.race=function(e){return new r(function(t,u){e.forEach(function(e){r.resolve(e).then(t,u)})})},r.prototype.catch=function(e){return this.then(null,e)}},function(e,t,u){\"use strict\";function n(e){for(var t=arguments.length-1,u=\"Minified React error #\"+e+\"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant=\"+e,n=0;n<t;n++)u+=\"&args[]=\"+encodeURIComponent(arguments[n+1]);throw t=Error(u+\" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.\"),t.name=\"Invariant Violation\",t.framesToPop=1,t}function r(e,t,u){this.props=e,this.context=t,this.refs=A,this.updater=u||k}function o(e,t,u){this.props=e,this.context=t,this.refs=A,this.updater=u||k}function a(){}function i(e,t,u){this.props=e,this.context=t,this.refs=A,this.updater=u||k}function l(e,t,u){var n,r={},o=null,a=null;if(null!=t)for(n in void 0!==t.ref&&(a=t.ref),void 0!==t.key&&(o=\"\"+t.key),t)N.call(t,n)&&!O.hasOwnProperty(n)&&(r[n]=t[n]);var i=arguments.length-2;if(1===i)r.children=u;else if(1<i){for(var l=Array(i),c=0;c<i;c++)l[c]=arguments[c+2];r.children=l}if(e&&e.defaultProps)for(n in i=e.defaultProps)void 0===r[n]&&(r[n]=i[n]);return{$$typeof:y,type:e,key:o,ref:a,props:r,_owner:_.current}}function c(e){return\"object\"===typeof e&&null!==e&&e.$$typeof===y}function s(e){var t={\"=\":\"=0\",\":\":\"=2\"};return\"$\"+(\"\"+e).replace(/[=:]/g,function(e){return t[e]})}function f(e,t,u,n){if(I.length){var r=I.pop();return r.result=e,r.keyPrefix=t,r.func=u,r.context=n,r.count=0,r}return{result:e,keyPrefix:t,func:u,context:n,count:0}}function p(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>I.length&&I.push(e)}function d(e,t,u,r){var o=typeof e;\"undefined\"!==o&&\"boolean\"!==o||(e=null);var a=!1;if(null===e)a=!0;else switch(o){case\"string\":case\"number\":a=!0;break;case\"object\":switch(e.$$typeof){case y:case b:case v:case B:a=!0}}if(a)return u(r,e,\"\"===t?\".\"+D(e,0):t),1;if(a=0,t=\"\"===t?\".\":t+\":\",Array.isArray(e))for(var i=0;i<e.length;i++){o=e[i];var l=t+D(o,i);a+=d(o,l,u,r)}else if(null===e||\"undefined\"===typeof e?l=null:(l=x&&e[x]||e[\"@@iterator\"],l=\"function\"===typeof l?l:null),\"function\"===typeof l)for(e=l.call(e),i=0;!(o=e.next()).done;)o=o.value,l=t+D(o,i++),a+=d(o,l,u,r);else\"object\"===o&&(u=\"\"+e,n(\"31\",\"[object Object]\"===u?\"object with keys {\"+Object.keys(e).join(\", \")+\"}\":u,\"\"));return a}function D(e,t){return\"object\"===typeof e&&null!==e&&null!=e.key?s(e.key):t.toString(36)}function h(e,t){e.func.call(e.context,t,e.count++)}function m(e,t,u){var n=e.result,r=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?g(e,n,u,E.thatReturnsArgument):null!=e&&(c(e)&&(t=r+(!e.key||t&&t.key===e.key?\"\":(\"\"+e.key).replace(P,\"$&/\")+\"/\")+u,e={$$typeof:y,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}),n.push(e))}function g(e,t,u,n,r){var o=\"\";null!=u&&(o=(\"\"+u).replace(P,\"$&/\")+\"/\"),t=f(t,o,n,r),null==e||d(e,\"\",m,t),p(t)}var C=u(2),A=u(5),E=u(3),F=\"function\"===typeof Symbol&&Symbol.for,y=F?Symbol.for(\"react.element\"):60103,b=F?Symbol.for(\"react.call\"):60104,v=F?Symbol.for(\"react.return\"):60105,B=F?Symbol.for(\"react.portal\"):60106,w=F?Symbol.for(\"react.fragment\"):60107,x=\"function\"===typeof Symbol&&Symbol.iterator,k={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};r.prototype.isReactComponent={},r.prototype.setState=function(e,t){\"object\"!==typeof e&&\"function\"!==typeof e&&null!=e&&n(\"85\"),this.updater.enqueueSetState(this,e,t,\"setState\")},r.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,\"forceUpdate\")},a.prototype=r.prototype;var T=o.prototype=new a;T.constructor=o,C(T,r.prototype),T.isPureReactComponent=!0;var S=i.prototype=new a;S.constructor=i,C(S,r.prototype),S.unstable_isAsyncReactComponent=!0,S.render=function(){return this.props.children};var _={current:null},N=Object.prototype.hasOwnProperty,O={key:!0,ref:!0,__self:!0,__source:!0},P=/\\/+/g,I=[],R={Children:{map:function(e,t,u){if(null==e)return e;var n=[];return g(e,n,null,t,u),n},forEach:function(e,t,u){if(null==e)return e;t=f(null,null,t,u),null==e||d(e,\"\",h,t),p(t)},count:function(e){return null==e?0:d(e,\"\",E.thatReturnsNull,null)},toArray:function(e){var t=[];return g(e,t,null,E.thatReturnsArgument),t},only:function(e){return c(e)||n(\"143\"),e}},Component:r,PureComponent:o,unstable_AsyncComponent:i,Fragment:w,createElement:l,cloneElement:function(e,t,u){var n=C({},e.props),r=e.key,o=e.ref,a=e._owner;if(null!=t){if(void 0!==t.ref&&(o=t.ref,a=_.current),void 0!==t.key&&(r=\"\"+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(l in t)N.call(t,l)&&!O.hasOwnProperty(l)&&(n[l]=void 0===t[l]&&void 0!==i?i[l]:t[l])}var l=arguments.length-2;if(1===l)n.children=u;else if(1<l){i=Array(l);for(var c=0;c<l;c++)i[c]=arguments[c+2];n.children=i}return{$$typeof:y,type:e.type,key:r,ref:o,props:n,_owner:a}},createFactory:function(e){var t=l.bind(null,e);return t.type=e,t},isValidElement:c,version:\"16.2.0\",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:_,assign:C}},L=Object.freeze({default:R}),q=L&&R||L;e.exports=q.default?q.default:q},function(e,t,u){\"use strict\";function n(){if(\"undefined\"!==typeof{}&&\"function\"===typeof{}.checkDCE)try{({}).checkDCE(n)}catch(e){console.error(e)}}n(),e.exports=u(25)},function(e,t,u){\"use strict\";function n(e){for(var t=arguments.length-1,u=\"Minified React error #\"+e+\"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant=\"+e,n=0;n<t;n++)u+=\"&args[]=\"+encodeURIComponent(arguments[n+1]);throw t=Error(u+\" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.\"),t.name=\"Invariant Violation\",t.framesToPop=1,t}function r(e,t){return(e&t)===t}function o(e,t){if(ku.hasOwnProperty(e)||2<e.length&&(\"o\"===e[0]||\"O\"===e[0])&&(\"n\"===e[1]||\"N\"===e[1]))return!1;if(null===t)return!0;switch(typeof t){case\"boolean\":return ku.hasOwnProperty(e)?e=!0:(t=a(e))?e=t.hasBooleanValue||t.hasStringBooleanValue||t.hasOverloadedBooleanValue:(e=e.toLowerCase().slice(0,5),e=\"data-\"===e||\"aria-\"===e),e;case\"undefined\":case\"number\":case\"string\":case\"object\":return!0;default:return!1}}function a(e){return Su.hasOwnProperty(e)?Su[e]:null}function i(e){return e[1].toUpperCase()}function l(e,t,u,n,r,o,a,i,l){Vu._hasCaughtError=!1,Vu._caughtError=null;var c=Array.prototype.slice.call(arguments,3);try{t.apply(u,c)}catch(e){Vu._caughtError=e,Vu._hasCaughtError=!0}}function c(){if(Vu._hasRethrowError){var e=Vu._rethrowError;throw Vu._rethrowError=null,Vu._hasRethrowError=!1,e}}function s(){if(zu)for(var e in Wu){var t=Wu[e],u=zu.indexOf(e);if(-1<u||n(\"96\",e),!Ku[u]){t.extractEvents||n(\"97\",e),Ku[u]=t,u=t.eventTypes;for(var r in u){var o=void 0,a=u[r],i=t,l=r;Gu.hasOwnProperty(l)&&n(\"99\",l),Gu[l]=a;var c=a.phasedRegistrationNames;if(c){for(o in c)c.hasOwnProperty(o)&&f(c[o],i,l);o=!0}else a.registrationName?(f(a.registrationName,i,l),o=!0):o=!1;o||n(\"98\",r,e)}}}}function f(e,t,u){$u[e]&&n(\"100\",e),$u[e]=t,Qu[e]=t.eventTypes[u].dependencies}function p(e){zu&&n(\"101\"),zu=Array.prototype.slice.call(e),s()}function d(e){var t,u=!1;for(t in e)if(e.hasOwnProperty(t)){var r=e[t];Wu.hasOwnProperty(t)&&Wu[t]===r||(Wu[t]&&n(\"102\",t),Wu[t]=r,u=!0)}u&&s()}function D(e,t,u,n){t=e.type||\"unknown-event\",e.currentTarget=Zu(n),Vu.invokeGuardedCallbackAndCatchFirstError(t,u,void 0,e),e.currentTarget=null}function h(e,t){return null==t&&n(\"30\"),null==e?t:Array.isArray(e)?Array.isArray(t)?(e.push.apply(e,t),e):(e.push(t),e):Array.isArray(t)?[e].concat(t):[e,t]}function m(e,t,u){Array.isArray(e)?e.forEach(t,u):e&&t.call(u,e)}function g(e,t){if(e){var u=e._dispatchListeners,n=e._dispatchInstances;if(Array.isArray(u))for(var r=0;r<u.length&&!e.isPropagationStopped();r++)D(e,t,u[r],n[r]);else u&&D(e,t,u,n);e._dispatchListeners=null,e._dispatchInstances=null,e.isPersistent()||e.constructor.release(e)}}function C(e){return g(e,!0)}function A(e){return g(e,!1)}function E(e,t){var u=e.stateNode;if(!u)return null;var r=Ju(u);if(!r)return null;u=r[t];e:switch(t){case\"onClick\":case\"onClickCapture\":case\"onDoubleClick\":case\"onDoubleClickCapture\":case\"onMouseDown\":case\"onMouseDownCapture\":case\"onMouseMove\":case\"onMouseMoveCapture\":case\"onMouseUp\":case\"onMouseUpCapture\":(r=!r.disabled)||(e=e.type,r=!(\"button\"===e||\"input\"===e||\"select\"===e||\"textarea\"===e)),e=!r;break e;default:e=!1}return e?null:(u&&\"function\"!==typeof u&&n(\"231\",t,typeof u),u)}function F(e,t,u,n){for(var r,o=0;o<Ku.length;o++){var a=Ku[o];a&&(a=a.extractEvents(e,t,u,n))&&(r=h(r,a))}return r}function y(e){e&&(en=h(en,e))}function b(e){var t=en;en=null,t&&(e?m(t,C):m(t,A),en&&n(\"95\"),Vu.rethrowCaughtError())}function v(e){if(e[rn])return e[rn];for(var t=[];!e[rn];){if(t.push(e),!e.parentNode)return null;e=e.parentNode}var u=void 0,n=e[rn];if(5===n.tag||6===n.tag)return n;for(;e&&(n=e[rn]);e=t.pop())u=n;return u}function B(e){if(5===e.tag||6===e.tag)return e.stateNode;n(\"33\")}function w(e){return e[on]||null}function x(e){do{e=e.return}while(e&&5!==e.tag);return e||null}function k(e,t,u){for(var n=[];e;)n.push(e),e=x(e);for(e=n.length;0<e--;)t(n[e],\"captured\",u);for(e=0;e<n.length;e++)t(n[e],\"bubbled\",u)}function T(e,t,u){(t=E(e,u.dispatchConfig.phasedRegistrationNames[t]))&&(u._dispatchListeners=h(u._dispatchListeners,t),u._dispatchInstances=h(u._dispatchInstances,e))}function S(e){e&&e.dispatchConfig.phasedRegistrationNames&&k(e._targetInst,T,e)}function _(e){if(e&&e.dispatchConfig.phasedRegistrationNames){var t=e._targetInst;t=t?x(t):null,k(t,T,e)}}function N(e,t,u){e&&u&&u.dispatchConfig.registrationName&&(t=E(e,u.dispatchConfig.registrationName))&&(u._dispatchListeners=h(u._dispatchListeners,t),u._dispatchInstances=h(u._dispatchInstances,e))}function O(e){e&&e.dispatchConfig.registrationName&&N(e._targetInst,null,e)}function P(e){m(e,S)}function I(e,t,u,n){if(u&&n)e:{for(var r=u,o=n,a=0,i=r;i;i=x(i))a++;i=0;for(var l=o;l;l=x(l))i++;for(;0<a-i;)r=x(r),a--;for(;0<i-a;)o=x(o),i--;for(;a--;){if(r===o||r===o.alternate)break e;r=x(r),o=x(o)}r=null}else r=null;for(o=r,r=[];u&&u!==o&&(null===(a=u.alternate)||a!==o);)r.push(u),u=x(u);for(u=[];n&&n!==o&&(null===(a=n.alternate)||a!==o);)u.push(n),n=x(n);for(n=0;n<r.length;n++)N(r[n],\"bubbled\",e);for(e=u.length;0<e--;)N(u[e],\"captured\",t)}function R(){return!cn&&Au.canUseDOM&&(cn=\"textContent\"in document.documentElement?\"textContent\":\"innerText\"),cn}function L(){if(sn._fallbackText)return sn._fallbackText;var e,t,u=sn._startText,n=u.length,r=q(),o=r.length;for(e=0;e<n&&u[e]===r[e];e++);var a=n-e;for(t=1;t<=a&&u[n-t]===r[o-t];t++);return sn._fallbackText=r.slice(e,1<t?1-t:void 0),sn._fallbackText}function q(){return\"value\"in sn._root?sn._root.value:sn._root[R()]}function U(e,t,u,n){this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=u,e=this.constructor.Interface;for(var r in e)e.hasOwnProperty(r)&&((t=e[r])?this[r]=t(u):\"target\"===r?this.target=n:this[r]=u[r]);return this.isDefaultPrevented=(null!=u.defaultPrevented?u.defaultPrevented:!1===u.returnValue)?Fu.thatReturnsTrue:Fu.thatReturnsFalse,this.isPropagationStopped=Fu.thatReturnsFalse,this}function M(e,t,u,n){if(this.eventPool.length){var r=this.eventPool.pop();return this.call(r,e,t,u,n),r}return new this(e,t,u,n)}function j(e){e instanceof this||n(\"223\"),e.destructor(),10>this.eventPool.length&&this.eventPool.push(e)}function H(e){e.eventPool=[],e.getPooled=M,e.release=j}function V(e,t,u,n){return U.call(this,e,t,u,n)}function z(e,t,u,n){return U.call(this,e,t,u,n)}function W(e,t){switch(e){case\"topKeyUp\":return-1!==dn.indexOf(t.keyCode);case\"topKeyDown\":return 229!==t.keyCode;case\"topKeyPress\":case\"topMouseDown\":case\"topBlur\":return!0;default:return!1}}function K(e){return e=e.detail,\"object\"===typeof e&&\"data\"in e?e.data:null}function G(e,t){switch(e){case\"topCompositionEnd\":return K(t);case\"topKeyPress\":return 32!==t.which?null:(bn=!0,Fn);case\"topTextInput\":return e=t.data,e===Fn&&bn?null:e;default:return null}}function $(e,t){if(vn)return\"topCompositionEnd\"===e||!Dn&&W(e,t)?(e=L(),sn._root=null,sn._startText=null,sn._fallbackText=null,vn=!1,e):null;switch(e){case\"topPaste\":return null;case\"topKeyPress\":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case\"topCompositionEnd\":return En?null:t.data;default:return null}}function Q(e){if(e=Xu(e)){wn&&\"function\"===typeof wn.restoreControlledState||n(\"194\");var t=Ju(e.stateNode);wn.restoreControlledState(e.stateNode,e.type,t)}}function Y(e){xn?kn?kn.push(e):kn=[e]:xn=e}function J(){if(xn){var e=xn,t=kn;if(kn=xn=null,Q(e),t)for(e=0;e<t.length;e++)Q(t[e])}}function X(e,t){return e(t)}function Z(e,t){if(_n)return X(e,t);_n=!0;try{return X(e,t)}finally{_n=!1,J()}}function ee(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return\"input\"===t?!!Nn[e.type]:\"textarea\"===t}function te(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),3===e.nodeType?e.parentNode:e}function ue(e,t){if(!Au.canUseDOM||t&&!(\"addEventListener\"in document))return!1;t=\"on\"+e;var u=t in document;return u||(u=document.createElement(\"div\"),u.setAttribute(t,\"return;\"),u=\"function\"===typeof u[t]),!u&&Cn&&\"wheel\"===e&&(u=document.implementation.hasFeature(\"Events.wheel\",\"3.0\")),u}function ne(e){var t=e.type;return(e=e.nodeName)&&\"input\"===e.toLowerCase()&&(\"checkbox\"===t||\"radio\"===t)}function re(e){var t=ne(e)?\"checked\":\"value\",u=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),n=\"\"+e[t];if(!e.hasOwnProperty(t)&&\"function\"===typeof u.get&&\"function\"===typeof u.set)return Object.defineProperty(e,t,{enumerable:u.enumerable,configurable:!0,get:function(){return u.get.call(this)},set:function(e){n=\"\"+e,u.set.call(this,e)}}),{getValue:function(){return n},setValue:function(e){n=\"\"+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}function oe(e){e._valueTracker||(e._valueTracker=re(e))}function ae(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var u=t.getValue(),n=\"\";return e&&(n=ne(e)?e.checked?\"true\":\"false\":e.value),(e=n)!==u&&(t.setValue(e),!0)}function ie(e,t,u){return e=U.getPooled(On.change,e,t,u),e.type=\"change\",Y(u),P(e),e}function le(e){y(e),b(!1)}function ce(e){if(ae(B(e)))return e}function se(e,t){if(\"topChange\"===e)return t}function fe(){Pn&&(Pn.detachEvent(\"onpropertychange\",pe),In=Pn=null)}function pe(e){\"value\"===e.propertyName&&ce(In)&&(e=ie(In,e,te(e)),Z(le,e))}function de(e,t,u){\"topFocus\"===e?(fe(),Pn=t,In=u,Pn.attachEvent(\"onpropertychange\",pe)):\"topBlur\"===e&&fe()}function De(e){if(\"topSelectionChange\"===e||\"topKeyUp\"===e||\"topKeyDown\"===e)return ce(In)}function he(e,t){if(\"topClick\"===e)return ce(t)}function me(e,t){if(\"topInput\"===e||\"topChange\"===e)return ce(t)}function ge(e,t,u,n){return U.call(this,e,t,u,n)}function Ce(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):!!(e=qn[e])&&!!t[e]}function Ae(){return Ce}function Ee(e,t,u,n){return U.call(this,e,t,u,n)}function Fe(e){return e=e.type,\"string\"===typeof e?e:\"function\"===typeof e?e.displayName||e.name:null}function ye(e){var t=e;if(e.alternate)for(;t.return;)t=t.return;else{if(0!==(2&t.effectTag))return 1;for(;t.return;)if(t=t.return,0!==(2&t.effectTag))return 1}return 3===t.tag?2:3}function be(e){return!!(e=e._reactInternalFiber)&&2===ye(e)}function ve(e){2!==ye(e)&&n(\"188\")}function Be(e){var t=e.alternate;if(!t)return t=ye(e),3===t&&n(\"188\"),1===t?null:e;for(var u=e,r=t;;){var o=u.return,a=o?o.alternate:null;if(!o||!a)break;if(o.child===a.child){for(var i=o.child;i;){if(i===u)return ve(o),e;if(i===r)return ve(o),t;i=i.sibling}n(\"188\")}if(u.return!==r.return)u=o,r=a;else{i=!1;for(var l=o.child;l;){if(l===u){i=!0,u=o,r=a;break}if(l===r){i=!0,r=o,u=a;break}l=l.sibling}if(!i){for(l=a.child;l;){if(l===u){i=!0,u=a,r=o;break}if(l===r){i=!0,r=a,u=o;break}l=l.sibling}i||n(\"189\")}}u.alternate!==r&&n(\"190\")}return 3!==u.tag&&n(\"188\"),u.stateNode.current===u?e:t}function we(e){if(!(e=Be(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}function xe(e){if(!(e=Be(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child&&4!==t.tag)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}function ke(e){var t=e.targetInst;do{if(!t){e.ancestors.push(t);break}var u;for(u=t;u.return;)u=u.return;if(!(u=3!==u.tag?null:u.stateNode.containerInfo))break;e.ancestors.push(t),t=v(u)}while(t);for(u=0;u<e.ancestors.length;u++)t=e.ancestors[u],zn(e.topLevelType,t,e.nativeEvent,te(e.nativeEvent))}function Te(e){Vn=!!e}function Se(e,t,u){return u?yu.listen(u,t,Ne.bind(null,e)):null}function _e(e,t,u){return u?yu.capture(u,t,Ne.bind(null,e)):null}function Ne(e,t){if(Vn){var u=te(t);if(u=v(u),null===u||\"number\"!==typeof u.tag||2===ye(u)||(u=null),Hn.length){var n=Hn.pop();n.topLevelType=e,n.nativeEvent=t,n.targetInst=u,e=n}else e={topLevelType:e,nativeEvent:t,targetInst:u,ancestors:[]};try{Z(ke,e)}finally{e.topLevelType=null,e.nativeEvent=null,e.targetInst=null,e.ancestors.length=0,10>Hn.length&&Hn.push(e)}}}function Oe(e,t){var u={};return u[e.toLowerCase()]=t.toLowerCase(),u[\"Webkit\"+e]=\"webkit\"+t,u[\"Moz\"+e]=\"moz\"+t,u[\"ms\"+e]=\"MS\"+t,u[\"O\"+e]=\"o\"+t.toLowerCase(),u}function Pe(e){if(Gn[e])return Gn[e];if(!Kn[e])return e;var t,u=Kn[e];for(t in u)if(u.hasOwnProperty(t)&&t in $n)return Gn[e]=u[t];return\"\"}function Ie(e){return Object.prototype.hasOwnProperty.call(e,Xn)||(e[Xn]=Jn++,Yn[e[Xn]]={}),Yn[e[Xn]]}function Re(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Le(e,t){var u=Re(e);e=0;for(var n;u;){if(3===u.nodeType){if(n=e+u.textContent.length,e<=t&&n>=t)return{node:u,offset:t-e};e=n}e:{for(;u;){if(u.nextSibling){u=u.nextSibling;break e}u=u.parentNode}u=void 0}u=Re(u)}}function qe(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(\"input\"===t&&\"text\"===e.type||\"textarea\"===t||\"true\"===e.contentEditable)}function Ue(e,t){if(rr||null==tr||tr!==bu())return null;var u=tr;return\"selectionStart\"in u&&qe(u)?u={start:u.selectionStart,end:u.selectionEnd}:window.getSelection?(u=window.getSelection(),u={anchorNode:u.anchorNode,anchorOffset:u.anchorOffset,focusNode:u.focusNode,focusOffset:u.focusOffset}):u=void 0,nr&&vu(nr,u)?null:(nr=u,e=U.getPooled(er.select,ur,e,t),e.type=\"select\",e.target=tr,P(e),e)}function Me(e,t,u,n){return U.call(this,e,t,u,n)}function je(e,t,u,n){return U.call(this,e,t,u,n)}function He(e,t,u,n){return U.call(this,e,t,u,n)}function Ve(e){var t=e.keyCode;return\"charCode\"in e?0===(e=e.charCode)&&13===t&&(e=13):e=t,32<=e||13===e?e:0}function ze(e,t,u,n){return U.call(this,e,t,u,n)}function We(e,t,u,n){return U.call(this,e,t,u,n)}function Ke(e,t,u,n){return U.call(this,e,t,u,n)}function Ge(e,t,u,n){return U.call(this,e,t,u,n)}function $e(e,t,u,n){return U.call(this,e,t,u,n)}function Qe(e){0>pr||(e.current=fr[pr],fr[pr]=null,pr--)}function Ye(e,t){pr++,fr[pr]=e.current,e.current=t}function Je(e){return Ze(e)?hr:dr.current}function Xe(e,t){var u=e.type.contextTypes;if(!u)return xu;var n=e.stateNode;if(n&&n.__reactInternalMemoizedUnmaskedChildContext===t)return n.__reactInternalMemoizedMaskedChildContext;var r,o={};for(r in u)o[r]=t[r];return n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function Ze(e){return 2===e.tag&&null!=e.type.childContextTypes}function et(e){Ze(e)&&(Qe(Dr,e),Qe(dr,e))}function tt(e,t,u){null!=dr.cursor&&n(\"168\"),Ye(dr,t,e),Ye(Dr,u,e)}function ut(e,t){var u=e.stateNode,r=e.type.childContextTypes;if(\"function\"!==typeof u.getChildContext)return t;u=u.getChildContext();for(var o in u)o in r||n(\"108\",Fe(e)||\"Unknown\",o);return Eu({},t,u)}function nt(e){if(!Ze(e))return!1;var t=e.stateNode;return t=t&&t.__reactInternalMemoizedMergedChildContext||xu,hr=dr.current,Ye(dr,t,e),Ye(Dr,Dr.current,e),!0}function rt(e,t){var u=e.stateNode;if(u||n(\"169\"),t){var r=ut(e,hr);u.__reactInternalMemoizedMergedChildContext=r,Qe(Dr,e),Qe(dr,e),Ye(dr,r,e)}else Qe(Dr,e);Ye(Dr,t,e)}function ot(e,t,u){this.tag=e,this.key=t,this.stateNode=this.type=null,this.sibling=this.child=this.return=null,this.index=0,this.memoizedState=this.updateQueue=this.memoizedProps=this.pendingProps=this.ref=null,this.internalContextTag=u,this.effectTag=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.expirationTime=0,this.alternate=null}function at(e,t,u){var n=e.alternate;return null===n?(n=new ot(e.tag,e.key,e.internalContextTag),n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.effectTag=0,n.nextEffect=null,n.firstEffect=null,n.lastEffect=null),n.expirationTime=u,n.pendingProps=t,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function it(e,t,u){var r=void 0,o=e.type,a=e.key;return\"function\"===typeof o?(r=o.prototype&&o.prototype.isReactComponent?new ot(2,a,t):new ot(0,a,t),r.type=o,r.pendingProps=e.props):\"string\"===typeof o?(r=new ot(5,a,t),r.type=o,r.pendingProps=e.props):\"object\"===typeof o&&null!==o&&\"number\"===typeof o.tag?(r=o,r.pendingProps=e.props):n(\"130\",null==o?o:typeof o,\"\"),r.expirationTime=u,r}function lt(e,t,u,n){return t=new ot(10,n,t),t.pendingProps=e,t.expirationTime=u,t}function ct(e,t,u){return t=new ot(6,null,t),t.pendingProps=e,t.expirationTime=u,t}function st(e,t,u){return t=new ot(7,e.key,t),t.type=e.handler,t.pendingProps=e,t.expirationTime=u,t}function ft(e,t,u){return e=new ot(9,null,t),e.expirationTime=u,e}function pt(e,t,u){return t=new ot(4,e.key,t),t.pendingProps=e.children||[],t.expirationTime=u,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function dt(e){return function(t){try{return e(t)}catch(e){}}}function Dt(e){if(\"undefined\"===typeof{})return!1;var t={};if(t.isDisabled||!t.supportsFiber)return!0;try{var u=t.inject(e);mr=dt(function(e){return t.onCommitFiberRoot(u,e)}),gr=dt(function(e){return t.onCommitFiberUnmount(u,e)})}catch(e){}return!0}function ht(e){\"function\"===typeof mr&&mr(e)}function mt(e){\"function\"===typeof gr&&gr(e)}function gt(e){return{baseState:e,expirationTime:0,first:null,last:null,callbackList:null,hasForceUpdate:!1,isInitialized:!1}}function Ct(e,t){null===e.last?e.first=e.last=t:(e.last.next=t,e.last=t),(0===e.expirationTime||e.expirationTime>t.expirationTime)&&(e.expirationTime=t.expirationTime)}function At(e,t){var u=e.alternate,n=e.updateQueue;null===n&&(n=e.updateQueue=gt(null)),null!==u?null===(e=u.updateQueue)&&(e=u.updateQueue=gt(null)):e=null,e=e!==n?e:null,null===e?Ct(n,t):null===n.last||null===e.last?(Ct(n,t),Ct(e,t)):(Ct(n,t),e.last=t)}function Et(e,t,u,n){return e=e.partialState,\"function\"===typeof e?e.call(t,u,n):e}function Ft(e,t,u,n,r,o){null!==e&&e.updateQueue===u&&(u=t.updateQueue={baseState:u.baseState,expirationTime:u.expirationTime,first:u.first,last:u.last,isInitialized:u.isInitialized,callbackList:null,hasForceUpdate:!1}),u.expirationTime=0,u.isInitialized?e=u.baseState:(e=u.baseState=t.memoizedState,u.isInitialized=!0);for(var a=!0,i=u.first,l=!1;null!==i;){var c=i.expirationTime;if(c>o){var s=u.expirationTime;(0===s||s>c)&&(u.expirationTime=c),l||(l=!0,u.baseState=e)}else l||(u.first=i.next,null===u.first&&(u.last=null)),i.isReplace?(e=Et(i,n,e,r),a=!0):(c=Et(i,n,e,r))&&(e=a?Eu({},e,c):Eu(e,c),a=!1),i.isForced&&(u.hasForceUpdate=!0),null!==i.callback&&(c=u.callbackList,null===c&&(c=u.callbackList=[]),c.push(i));i=i.next}return null!==u.callbackList?t.effectTag|=32:null!==u.first||u.hasForceUpdate||(t.updateQueue=null),l||(u.baseState=e),e}function yt(e,t){var u=e.callbackList;if(null!==u)for(e.callbackList=null,e=0;e<u.length;e++){var r=u[e],o=r.callback;r.callback=null,\"function\"!==typeof o&&n(\"191\",o),o.call(t)}}function bt(e,t,u,r){function o(e,t){t.updater=a,e.stateNode=t,t._reactInternalFiber=e}var a={isMounted:be,enqueueSetState:function(u,n,r){u=u._reactInternalFiber,r=void 0===r?null:r;var o=t(u);At(u,{expirationTime:o,partialState:n,callback:r,isReplace:!1,isForced:!1,nextCallback:null,next:null}),e(u,o)},enqueueReplaceState:function(u,n,r){u=u._reactInternalFiber,r=void 0===r?null:r;var o=t(u);At(u,{expirationTime:o,partialState:n,callback:r,isReplace:!0,isForced:!1,nextCallback:null,next:null}),e(u,o)},enqueueForceUpdate:function(u,n){u=u._reactInternalFiber,n=void 0===n?null:n;var r=t(u);At(u,{expirationTime:r,partialState:null,callback:n,isReplace:!1,isForced:!0,nextCallback:null,next:null}),e(u,r)}};return{adoptClassInstance:o,constructClassInstance:function(e,t){var u=e.type,n=Je(e),r=2===e.tag&&null!=e.type.contextTypes,a=r?Xe(e,n):xu;return t=new u(t,a),o(e,t),r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=n,e.__reactInternalMemoizedMaskedChildContext=a),t},mountClassInstance:function(e,t){var u=e.alternate,r=e.stateNode,o=r.state||null,i=e.pendingProps;i||n(\"158\");var l=Je(e);r.props=i,r.state=e.memoizedState=o,r.refs=xu,r.context=Xe(e,l),null!=e.type&&null!=e.type.prototype&&!0===e.type.prototype.unstable_isAsyncReactComponent&&(e.internalContextTag|=1),\"function\"===typeof r.componentWillMount&&(o=r.state,r.componentWillMount(),o!==r.state&&a.enqueueReplaceState(r,r.state,null),null!==(o=e.updateQueue)&&(r.state=Ft(u,e,o,r,i,t))),\"function\"===typeof r.componentDidMount&&(e.effectTag|=4)},updateClassInstance:function(e,t,o){var i=t.stateNode;i.props=t.memoizedProps,i.state=t.memoizedState;var l=t.memoizedProps,c=t.pendingProps;c||null==(c=l)&&n(\"159\");var s=i.context,f=Je(t);if(f=Xe(t,f),\"function\"!==typeof i.componentWillReceiveProps||l===c&&s===f||(s=i.state,i.componentWillReceiveProps(c,f),i.state!==s&&a.enqueueReplaceState(i,i.state,null)),s=t.memoizedState,o=null!==t.updateQueue?Ft(e,t,t.updateQueue,i,c,o):s,!(l!==c||s!==o||Dr.current||null!==t.updateQueue&&t.updateQueue.hasForceUpdate))return\"function\"!==typeof i.componentDidUpdate||l===e.memoizedProps&&s===e.memoizedState||(t.effectTag|=4),!1;var p=c;if(null===l||null!==t.updateQueue&&t.updateQueue.hasForceUpdate)p=!0;else{var d=t.stateNode,D=t.type;p=\"function\"===typeof d.shouldComponentUpdate?d.shouldComponentUpdate(p,o,f):!D.prototype||!D.prototype.isPureReactComponent||(!vu(l,p)||!vu(s,o))}return p?(\"function\"===typeof i.componentWillUpdate&&i.componentWillUpdate(c,o,f),\"function\"===typeof i.componentDidUpdate&&(t.effectTag|=4)):(\"function\"!==typeof i.componentDidUpdate||l===e.memoizedProps&&s===e.memoizedState||(t.effectTag|=4),u(t,c),r(t,o)),i.props=c,i.state=o,i.context=f,p}}}function vt(e){return null===e||\"undefined\"===typeof e?null:(e=vr&&e[vr]||e[\"@@iterator\"],\"function\"===typeof e?e:null)}function Bt(e,t){var u=t.ref;if(null!==u&&\"function\"!==typeof u){if(t._owner){t=t._owner;var r=void 0;t&&(2!==t.tag&&n(\"110\"),r=t.stateNode),r||n(\"147\",u);var o=\"\"+u;return null!==e&&null!==e.ref&&e.ref._stringRef===o?e.ref:(e=function(e){var t=r.refs===xu?r.refs={}:r.refs;null===e?delete t[o]:t[o]=e},e._stringRef=o,e)}\"string\"!==typeof u&&n(\"148\"),t._owner||n(\"149\",u)}return u}function wt(e,t){\"textarea\"!==e.type&&n(\"31\",\"[object Object]\"===Object.prototype.toString.call(t)?\"object with keys {\"+Object.keys(t).join(\", \")+\"}\":t,\"\")}function xt(e){function t(t,u){if(e){var n=t.lastEffect;null!==n?(n.nextEffect=u,t.lastEffect=u):t.firstEffect=t.lastEffect=u,u.nextEffect=null,u.effectTag=8}}function u(u,n){if(!e)return null;for(;null!==n;)t(u,n),n=n.sibling;return null}function r(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function o(e,t,u){return e=at(e,t,u),e.index=0,e.sibling=null,e}function a(t,u,n){return t.index=n,e?null!==(n=t.alternate)?(n=n.index,n<u?(t.effectTag=2,u):n):(t.effectTag=2,u):u}function i(t){return e&&null===t.alternate&&(t.effectTag=2),t}function l(e,t,u,n){return null===t||6!==t.tag?(t=ct(u,e.internalContextTag,n),t.return=e,t):(t=o(t,u,n),t.return=e,t)}function c(e,t,u,n){return null!==t&&t.type===u.type?(n=o(t,u.props,n),n.ref=Bt(t,u),n.return=e,n):(n=it(u,e.internalContextTag,n),n.ref=Bt(t,u),n.return=e,n)}function s(e,t,u,n){return null===t||7!==t.tag?(t=st(u,e.internalContextTag,n),t.return=e,t):(t=o(t,u,n),t.return=e,t)}function f(e,t,u,n){return null===t||9!==t.tag?(t=ft(u,e.internalContextTag,n),t.type=u.value,t.return=e,t):(t=o(t,null,n),t.type=u.value,t.return=e,t)}function p(e,t,u,n){return null===t||4!==t.tag||t.stateNode.containerInfo!==u.containerInfo||t.stateNode.implementation!==u.implementation?(t=pt(u,e.internalContextTag,n),t.return=e,t):(t=o(t,u.children||[],n),t.return=e,t)}function d(e,t,u,n,r){return null===t||10!==t.tag?(t=lt(u,e.internalContextTag,n,r),t.return=e,t):(t=o(t,u,n),t.return=e,t)}function D(e,t,u){if(\"string\"===typeof t||\"number\"===typeof t)return t=ct(\"\"+t,e.internalContextTag,u),t.return=e,t;if(\"object\"===typeof t&&null!==t){switch(t.$$typeof){case Ar:return t.type===br?(t=lt(t.props.children,e.internalContextTag,u,t.key),t.return=e,t):(u=it(t,e.internalContextTag,u),u.ref=Bt(null,t),u.return=e,u);case Er:return t=st(t,e.internalContextTag,u),t.return=e,t;case Fr:return u=ft(t,e.internalContextTag,u),u.type=t.value,u.return=e,u;case yr:return t=pt(t,e.internalContextTag,u),t.return=e,t}if(Br(t)||vt(t))return t=lt(t,e.internalContextTag,u,null),t.return=e,t;wt(e,t)}return null}function h(e,t,u,n){var r=null!==t?t.key:null;if(\"string\"===typeof u||\"number\"===typeof u)return null!==r?null:l(e,t,\"\"+u,n);if(\"object\"===typeof u&&null!==u){switch(u.$$typeof){case Ar:return u.key===r?u.type===br?d(e,t,u.props.children,n,r):c(e,t,u,n):null;case Er:return u.key===r?s(e,t,u,n):null;case Fr:return null===r?f(e,t,u,n):null;case yr:return u.key===r?p(e,t,u,n):null}if(Br(u)||vt(u))return null!==r?null:d(e,t,u,n,null);wt(e,u)}return null}function m(e,t,u,n,r){if(\"string\"===typeof n||\"number\"===typeof n)return e=e.get(u)||null,l(t,e,\"\"+n,r);if(\"object\"===typeof n&&null!==n){switch(n.$$typeof){case Ar:return e=e.get(null===n.key?u:n.key)||null,n.type===br?d(t,e,n.props.children,r,n.key):c(t,e,n,r);case Er:return e=e.get(null===n.key?u:n.key)||null,s(t,e,n,r);case Fr:return e=e.get(u)||null,f(t,e,n,r);case yr:return e=e.get(null===n.key?u:n.key)||null,p(t,e,n,r)}if(Br(n)||vt(n))return e=e.get(u)||null,d(t,e,n,r,null);wt(t,n)}return null}function g(n,o,i,l){for(var c=null,s=null,f=o,p=o=0,d=null;null!==f&&p<i.length;p++){f.index>p?(d=f,f=null):d=f.sibling;var g=h(n,f,i[p],l);if(null===g){null===f&&(f=d);break}e&&f&&null===g.alternate&&t(n,f),o=a(g,o,p),null===s?c=g:s.sibling=g,s=g,f=d}if(p===i.length)return u(n,f),c;if(null===f){for(;p<i.length;p++)(f=D(n,i[p],l))&&(o=a(f,o,p),null===s?c=f:s.sibling=f,s=f);return c}for(f=r(n,f);p<i.length;p++)(d=m(f,n,p,i[p],l))&&(e&&null!==d.alternate&&f.delete(null===d.key?p:d.key),o=a(d,o,p),null===s?c=d:s.sibling=d,s=d);return e&&f.forEach(function(e){return t(n,e)}),c}function C(o,i,l,c){var s=vt(l);\"function\"!==typeof s&&n(\"150\"),null==(l=s.call(l))&&n(\"151\");for(var f=s=null,p=i,d=i=0,g=null,C=l.next();null!==p&&!C.done;d++,C=l.next()){p.index>d?(g=p,p=null):g=p.sibling;var A=h(o,p,C.value,c);if(null===A){p||(p=g);break}e&&p&&null===A.alternate&&t(o,p),i=a(A,i,d),null===f?s=A:f.sibling=A,f=A,p=g}if(C.done)return u(o,p),s;if(null===p){for(;!C.done;d++,C=l.next())null!==(C=D(o,C.value,c))&&(i=a(C,i,d),null===f?s=C:f.sibling=C,f=C);return s}for(p=r(o,p);!C.done;d++,C=l.next())null!==(C=m(p,o,d,C.value,c))&&(e&&null!==C.alternate&&p.delete(null===C.key?d:C.key),i=a(C,i,d),null===f?s=C:f.sibling=C,f=C);return e&&p.forEach(function(e){return t(o,e)}),s}return function(e,r,a,l){\"object\"===typeof a&&null!==a&&a.type===br&&null===a.key&&(a=a.props.children);var c=\"object\"===typeof a&&null!==a;if(c)switch(a.$$typeof){case Ar:e:{var s=a.key;for(c=r;null!==c;){if(c.key===s){if(10===c.tag?a.type===br:c.type===a.type){u(e,c.sibling),r=o(c,a.type===br?a.props.children:a.props,l),r.ref=Bt(c,a),r.return=e,e=r;break e}u(e,c);break}t(e,c),c=c.sibling}a.type===br?(r=lt(a.props.children,e.internalContextTag,l,a.key),r.return=e,e=r):(l=it(a,e.internalContextTag,l),l.ref=Bt(r,a),l.return=e,e=l)}return i(e);case Er:e:{for(c=a.key;null!==r;){if(r.key===c){if(7===r.tag){u(e,r.sibling),r=o(r,a,l),r.return=e,e=r;break e}u(e,r);break}t(e,r),r=r.sibling}r=st(a,e.internalContextTag,l),r.return=e,e=r}return i(e);case Fr:e:{if(null!==r){if(9===r.tag){u(e,r.sibling),r=o(r,null,l),r.type=a.value,r.return=e,e=r;break e}u(e,r)}r=ft(a,e.internalContextTag,l),r.type=a.value,r.return=e,e=r}return i(e);case yr:e:{for(c=a.key;null!==r;){if(r.key===c){if(4===r.tag&&r.stateNode.containerInfo===a.containerInfo&&r.stateNode.implementation===a.implementation){u(e,r.sibling),r=o(r,a.children||[],l),r.return=e,e=r;break e}u(e,r);break}t(e,r),r=r.sibling}r=pt(a,e.internalContextTag,l),r.return=e,e=r}return i(e)}if(\"string\"===typeof a||\"number\"===typeof a)return a=\"\"+a,null!==r&&6===r.tag?(u(e,r.sibling),r=o(r,a,l)):(u(e,r),r=ct(a,e.internalContextTag,l)),r.return=e,e=r,i(e);if(Br(a))return g(e,r,a,l);if(vt(a))return C(e,r,a,l);if(c&&wt(e,a),\"undefined\"===typeof a)switch(e.tag){case 2:case 1:l=e.type,n(\"152\",l.displayName||l.name||\"Component\")}return u(e,r)}}function kt(e,t,u,r,o){function a(e,t,u){var n=t.expirationTime;t.child=null===e?xr(t,null,u,n):wr(t,e.child,u,n)}function i(e,t){var u=t.ref;null===u||e&&e.ref===u||(t.effectTag|=128)}function l(e,t,u,n){if(i(e,t),!u)return n&&rt(t,!1),s(e,t);u=t.stateNode,jn.current=t;var r=u.render();return t.effectTag|=1,a(e,t,r),t.memoizedState=u.state,t.memoizedProps=u.props,n&&rt(t,!0),t.child}function c(e){var t=e.stateNode;t.pendingContext?tt(e,t.pendingContext,t.pendingContext!==t.context):t.context&&tt(e,t.context,!1),m(e,t.containerInfo)}function s(e,t){if(null!==e&&t.child!==e.child&&n(\"153\"),null!==t.child){e=t.child;var u=at(e,e.pendingProps,e.expirationTime);for(t.child=u,u.return=t;null!==e.sibling;)e=e.sibling,u=u.sibling=at(e,e.pendingProps,e.expirationTime),u.return=t;u.sibling=null}return t.child}function f(e,t){switch(t.tag){case 3:c(t);break;case 2:nt(t);break;case 4:m(t,t.stateNode.containerInfo)}return null}var p=e.shouldSetTextContent,d=e.useSyncScheduling,D=e.shouldDeprioritizeSubtree,h=t.pushHostContext,m=t.pushHostContainer,g=u.enterHydrationState,C=u.resetHydrationState,A=u.tryToClaimNextHydratableInstance;e=bt(r,o,function(e,t){e.memoizedProps=t},function(e,t){e.memoizedState=t});var E=e.adoptClassInstance,F=e.constructClassInstance,y=e.mountClassInstance,b=e.updateClassInstance;return{beginWork:function(e,t,u){if(0===t.expirationTime||t.expirationTime>u)return f(e,t);switch(t.tag){case 0:null!==e&&n(\"155\");var r=t.type,o=t.pendingProps,v=Je(t);return v=Xe(t,v),r=r(o,v),t.effectTag|=1,\"object\"===typeof r&&null!==r&&\"function\"===typeof r.render?(t.tag=2,o=nt(t),E(t,r),y(t,u),t=l(e,t,!0,o)):(t.tag=1,a(e,t,r),t.memoizedProps=o,t=t.child),t;case 1:e:{if(o=t.type,u=t.pendingProps,r=t.memoizedProps,Dr.current)null===u&&(u=r);else if(null===u||r===u){t=s(e,t);break e}r=Je(t),r=Xe(t,r),o=o(u,r),t.effectTag|=1,a(e,t,o),t.memoizedProps=u,t=t.child}return t;case 2:return o=nt(t),r=void 0,null===e?t.stateNode?n(\"153\"):(F(t,t.pendingProps),y(t,u),r=!0):r=b(e,t,u),l(e,t,r,o);case 3:return c(t),o=t.updateQueue,null!==o?(r=t.memoizedState,o=Ft(e,t,o,null,null,u),r===o?(C(),t=s(e,t)):(r=o.element,v=t.stateNode,(null===e||null===e.child)&&v.hydrate&&g(t)?(t.effectTag|=2,t.child=xr(t,null,r,u)):(C(),a(e,t,r)),t.memoizedState=o,t=t.child)):(C(),t=s(e,t)),t;case 5:h(t),null===e&&A(t),o=t.type;var B=t.memoizedProps;return r=t.pendingProps,null===r&&null===(r=B)&&n(\"154\"),v=null!==e?e.memoizedProps:null,Dr.current||null!==r&&B!==r?(B=r.children,p(o,r)?B=null:v&&p(o,v)&&(t.effectTag|=16),i(e,t),2147483647!==u&&!d&&D(o,r)?(t.expirationTime=2147483647,t=null):(a(e,t,B),t.memoizedProps=r,t=t.child)):t=s(e,t),t;case 6:return null===e&&A(t),e=t.pendingProps,null===e&&(e=t.memoizedProps),t.memoizedProps=e,null;case 8:t.tag=7;case 7:return o=t.pendingProps,Dr.current?null===o&&null===(o=e&&e.memoizedProps)&&n(\"154\"):null!==o&&t.memoizedProps!==o||(o=t.memoizedProps),r=o.children,t.stateNode=null===e?xr(t,t.stateNode,r,u):wr(t,t.stateNode,r,u),t.memoizedProps=o,t.stateNode;case 9:return null;case 4:e:{if(m(t,t.stateNode.containerInfo),o=t.pendingProps,Dr.current)null===o&&null==(o=e&&e.memoizedProps)&&n(\"154\");else if(null===o||t.memoizedProps===o){t=s(e,t);break e}null===e?t.child=wr(t,null,o,u):a(e,t,o),t.memoizedProps=o,t=t.child}return t;case 10:e:{if(u=t.pendingProps,Dr.current)null===u&&(u=t.memoizedProps);else if(null===u||t.memoizedProps===u){t=s(e,t);break e}a(e,t,u),t.memoizedProps=u,t=t.child}return t;default:n(\"156\")}},beginFailedWork:function(e,t,u){switch(t.tag){case 2:nt(t);break;case 3:c(t);break;default:n(\"157\")}return t.effectTag|=64,null===e?t.child=null:t.child!==e.child&&(t.child=e.child),0===t.expirationTime||t.expirationTime>u?f(e,t):(t.firstEffect=null,t.lastEffect=null,t.child=null===e?xr(t,null,null,u):wr(t,e.child,null,u),2===t.tag&&(e=t.stateNode,t.memoizedProps=e.props,t.memoizedState=e.state),t.child)}}}function Tt(e,t,u){function r(e){e.effectTag|=4}var o=e.createInstance,a=e.createTextInstance,i=e.appendInitialChild,l=e.finalizeInitialChildren,c=e.prepareUpdate,s=e.persistence,f=t.getRootHostContainer,p=t.popHostContext,d=t.getHostContext,D=t.popHostContainer,h=u.prepareToHydrateHostInstance,m=u.prepareToHydrateHostTextInstance,g=u.popHydrationState,C=void 0,A=void 0,E=void 0;return e.mutation?(C=function(){},A=function(e,t,u){(t.updateQueue=u)&&r(t)},E=function(e,t,u,n){u!==n&&r(t)}):n(s?\"235\":\"236\"),{completeWork:function(e,t,u){var s=t.pendingProps;switch(null===s?s=t.memoizedProps:2147483647===t.expirationTime&&2147483647!==u||(t.pendingProps=null),t.tag){case 1:return null;case 2:return et(t),null;case 3:return D(t),Qe(Dr,t),Qe(dr,t),s=t.stateNode,s.pendingContext&&(s.context=s.pendingContext,s.pendingContext=null),null!==e&&null!==e.child||(g(t),t.effectTag&=-3),C(t),null;case 5:p(t),u=f();var F=t.type;if(null!==e&&null!=t.stateNode){var y=e.memoizedProps,b=t.stateNode,v=d();b=c(b,F,y,s,u,v),A(e,t,b,F,y,s,u),e.ref!==t.ref&&(t.effectTag|=128)}else{if(!s)return null===t.stateNode&&n(\"166\"),null;if(e=d(),g(t))h(t,u,e)&&r(t);else{e=o(F,s,u,e,t);e:for(y=t.child;null!==y;){if(5===y.tag||6===y.tag)i(e,y.stateNode);else if(4!==y.tag&&null!==y.child){y.child.return=y,y=y.child;continue}if(y===t)break;for(;null===y.sibling;){if(null===y.return||y.return===t)break e;y=y.return}y.sibling.return=y.return,y=y.sibling}l(e,F,s,u)&&r(t),t.stateNode=e}null!==t.ref&&(t.effectTag|=128)}return null;case 6:if(e&&null!=t.stateNode)E(e,t,e.memoizedProps,s);else{if(\"string\"!==typeof s)return null===t.stateNode&&n(\"166\"),null;e=f(),u=d(),g(t)?m(t)&&r(t):t.stateNode=a(s,e,u,t)}return null;case 7:(s=t.memoizedProps)||n(\"165\"),t.tag=8,F=[];e:for((y=t.stateNode)&&(y.return=t);null!==y;){if(5===y.tag||6===y.tag||4===y.tag)n(\"247\");else if(9===y.tag)F.push(y.type);else if(null!==y.child){y.child.return=y,y=y.child;continue}for(;null===y.sibling;){if(null===y.return||y.return===t)break e;y=y.return}y.sibling.return=y.return,y=y.sibling}return y=s.handler,s=y(s.props,F),t.child=wr(t,null!==e?e.child:null,s,u),t.child;case 8:return t.tag=7,null;case 9:case 10:return null;case 4:return D(t),C(t),null;case 0:n(\"167\");default:n(\"156\")}}}}function St(e,t){function u(e){var u=e.ref;if(null!==u)try{u(null)}catch(u){t(e,u)}}function r(e){switch(\"function\"===typeof mt&&mt(e),e.tag){case 2:u(e);var n=e.stateNode;if(\"function\"===typeof n.componentWillUnmount)try{n.props=e.memoizedProps,n.state=e.memoizedState,n.componentWillUnmount()}catch(u){t(e,u)}break;case 5:u(e);break;case 7:o(e.stateNode);break;case 4:c&&i(e)}}function o(e){for(var t=e;;)if(r(t),null===t.child||c&&4===t.tag){if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}else t.child.return=t,t=t.child}function a(e){return 5===e.tag||3===e.tag||4===e.tag}function i(e){for(var t=e,u=!1,a=void 0,i=void 0;;){if(!u){u=t.return;e:for(;;){switch(null===u&&n(\"160\"),u.tag){case 5:a=u.stateNode,i=!1;break e;case 3:case 4:a=u.stateNode.containerInfo,i=!0;break e}u=u.return}u=!0}if(5===t.tag||6===t.tag)o(t),i?A(a,t.stateNode):C(a,t.stateNode);else if(4===t.tag?a=t.stateNode.containerInfo:r(t),null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return;t=t.return,4===t.tag&&(u=!1)}t.sibling.return=t.return,t=t.sibling}}var l=e.getPublicInstance,c=e.mutation;e=e.persistence,c||n(e?\"235\":\"236\");var s=c.commitMount,f=c.commitUpdate,p=c.resetTextContent,d=c.commitTextUpdate,D=c.appendChild,h=c.appendChildToContainer,m=c.insertBefore,g=c.insertInContainerBefore,C=c.removeChild,A=c.removeChildFromContainer;return{commitResetTextContent:function(e){p(e.stateNode)},commitPlacement:function(e){e:{for(var t=e.return;null!==t;){if(a(t)){var u=t;break e}t=t.return}n(\"160\"),u=void 0}var r=t=void 0;switch(u.tag){case 5:t=u.stateNode,r=!1;break;case 3:case 4:t=u.stateNode.containerInfo,r=!0;break;default:n(\"161\")}16&u.effectTag&&(p(t),u.effectTag&=-17);e:t:for(u=e;;){for(;null===u.sibling;){if(null===u.return||a(u.return)){u=null;break e}u=u.return}for(u.sibling.return=u.return,u=u.sibling;5!==u.tag&&6!==u.tag;){if(2&u.effectTag)continue t;if(null===u.child||4===u.tag)continue t;u.child.return=u,u=u.child}if(!(2&u.effectTag)){u=u.stateNode;break e}}for(var o=e;;){if(5===o.tag||6===o.tag)u?r?g(t,o.stateNode,u):m(t,o.stateNode,u):r?h(t,o.stateNode):D(t,o.stateNode);else if(4!==o.tag&&null!==o.child){o.child.return=o,o=o.child;continue}if(o===e)break;for(;null===o.sibling;){if(null===o.return||o.return===e)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},commitDeletion:function(e){i(e),e.return=null,e.child=null,e.alternate&&(e.alternate.child=null,e.alternate.return=null)},commitWork:function(e,t){switch(t.tag){case 2:break;case 5:var u=t.stateNode;if(null!=u){var r=t.memoizedProps;e=null!==e?e.memoizedProps:r;var o=t.type,a=t.updateQueue;t.updateQueue=null,null!==a&&f(u,a,o,e,r,t)}break;case 6:null===t.stateNode&&n(\"162\"),u=t.memoizedProps,d(t.stateNode,null!==e?e.memoizedProps:u,u);break;case 3:break;default:n(\"163\")}},commitLifeCycles:function(e,t){switch(t.tag){case 2:var u=t.stateNode;if(4&t.effectTag)if(null===e)u.props=t.memoizedProps,u.state=t.memoizedState,u.componentDidMount();else{var r=e.memoizedProps;e=e.memoizedState,u.props=t.memoizedProps,u.state=t.memoizedState,u.componentDidUpdate(r,e)}t=t.updateQueue,null!==t&&yt(t,u);break;case 3:u=t.updateQueue,null!==u&&yt(u,null!==t.child?t.child.stateNode:null);break;case 5:u=t.stateNode,null===e&&4&t.effectTag&&s(u,t.type,t.memoizedProps,t);break;case 6:case 4:break;default:n(\"163\")}},commitAttachRef:function(e){var t=e.ref;if(null!==t){var u=e.stateNode;switch(e.tag){case 5:t(l(u));break;default:t(u)}}},commitDetachRef:function(e){null!==(e=e.ref)&&e(null)}}}function _t(e){function t(e){return e===kr&&n(\"174\"),e}var u=e.getChildHostContext,r=e.getRootHostContext,o={current:kr},a={current:kr},i={current:kr};return{getHostContext:function(){return t(o.current)},getRootHostContainer:function(){return t(i.current)},popHostContainer:function(e){Qe(o,e),Qe(a,e),Qe(i,e)},popHostContext:function(e){a.current===e&&(Qe(o,e),Qe(a,e))},pushHostContainer:function(e,t){Ye(i,t,e),t=r(t),Ye(a,e,e),Ye(o,t,e)},pushHostContext:function(e){var n=t(i.current),r=t(o.current);n=u(r,e.type,n),r!==n&&(Ye(a,e,e),Ye(o,n,e))},resetHostContainer:function(){o.current=kr,i.current=kr}}}function Nt(e){function t(e,t){var u=new ot(5,null,0);u.type=\"DELETED\",u.stateNode=t,u.return=e,u.effectTag=8,null!==e.lastEffect?(e.lastEffect.nextEffect=u,e.lastEffect=u):e.firstEffect=e.lastEffect=u}function u(e,t){switch(e.tag){case 5:return null!==(t=a(t,e.type,e.pendingProps))&&(e.stateNode=t,!0);case 6:return null!==(t=i(t,e.pendingProps))&&(e.stateNode=t,!0);default:return!1}}function r(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag;)e=e.return;p=e}var o=e.shouldSetTextContent;if(!(e=e.hydration))return{enterHydrationState:function(){return!1},resetHydrationState:function(){},tryToClaimNextHydratableInstance:function(){},prepareToHydrateHostInstance:function(){n(\"175\")},prepareToHydrateHostTextInstance:function(){n(\"176\")},popHydrationState:function(){return!1}};var a=e.canHydrateInstance,i=e.canHydrateTextInstance,l=e.getNextHydratableSibling,c=e.getFirstHydratableChild,s=e.hydrateInstance,f=e.hydrateTextInstance,p=null,d=null,D=!1;return{enterHydrationState:function(e){return d=c(e.stateNode.containerInfo),p=e,D=!0},resetHydrationState:function(){d=p=null,D=!1},tryToClaimNextHydratableInstance:function(e){if(D){var n=d;if(n){if(!u(e,n)){if(!(n=l(n))||!u(e,n))return e.effectTag|=2,D=!1,void(p=e);t(p,d)}p=e,d=c(n)}else e.effectTag|=2,D=!1,p=e}},prepareToHydrateHostInstance:function(e,t,u){return t=s(e.stateNode,e.type,e.memoizedProps,t,u,e),e.updateQueue=t,null!==t},prepareToHydrateHostTextInstance:function(e){return f(e.stateNode,e.memoizedProps,e)},popHydrationState:function(e){if(e!==p)return!1;if(!D)return r(e),D=!0,!1;var u=e.type;if(5!==e.tag||\"head\"!==u&&\"body\"!==u&&!o(u,e.memoizedProps))for(u=d;u;)t(e,u),u=l(u);return r(e),d=p?l(e.stateNode):null,!0}}}function Ot(e){function t(e){oe=Q=!0;var t=e.stateNode;if(t.current===e&&n(\"177\"),t.isReadyForCommit=!1,jn.current=null,1<e.effectTag)if(null!==e.lastEffect){e.lastEffect.nextEffect=e;var u=e.firstEffect}else u=e;else u=e.firstEffect;for(z(),Z=u;null!==Z;){var r=!1,o=void 0;try{for(;null!==Z;){var a=Z.effectTag;if(16&a&&O(Z),128&a){var i=Z.alternate;null!==i&&U(i)}switch(-242&a){case 2:P(Z),Z.effectTag&=-3;break;case 6:P(Z),Z.effectTag&=-3,R(Z.alternate,Z);break;case 4:R(Z.alternate,Z);break;case 8:ae=!0,I(Z),ae=!1}Z=Z.nextEffect}}catch(e){r=!0,o=e}r&&(null===Z&&n(\"178\"),l(Z,o),null!==Z&&(Z=Z.nextEffect))}for(W(),t.current=e,Z=u;null!==Z;){u=!1,r=void 0;try{for(;null!==Z;){var c=Z.effectTag;if(36&c&&L(Z.alternate,Z),128&c&&q(Z),64&c)switch(o=Z,a=void 0,null!==ee&&(a=ee.get(o),ee.delete(o),null==a&&null!==o.alternate&&(o=o.alternate,a=ee.get(o),ee.delete(o))),null==a&&n(\"184\"),o.tag){case 2:o.stateNode.componentDidCatch(a.error,{componentStack:a.componentStack});break;case 3:null===ne&&(ne=a.error);break;default:n(\"157\")}var s=Z.nextEffect;Z.nextEffect=null,Z=s}}catch(e){u=!0,r=e}u&&(null===Z&&n(\"178\"),l(Z,r),null!==Z&&(Z=Z.nextEffect))}return Q=oe=!1,\"function\"===typeof ht&&ht(e.stateNode),ue&&(ue.forEach(h),ue=null),null!==ne&&(e=ne,ne=null,b(e)),t=t.current.expirationTime,0===t&&(te=ee=null),t}function u(e){for(;;){var t=N(e.alternate,e,X),u=e.return,n=e.sibling,r=e;if(2147483647===X||2147483647!==r.expirationTime){if(2!==r.tag&&3!==r.tag)var o=0;else o=r.updateQueue,o=null===o?0:o.expirationTime;for(var a=r.child;null!==a;)0!==a.expirationTime&&(0===o||o>a.expirationTime)&&(o=a.expirationTime),a=a.sibling;r.expirationTime=o}if(null!==t)return t;if(null!==u&&(null===u.firstEffect&&(u.firstEffect=e.firstEffect),null!==e.lastEffect&&(null!==u.lastEffect&&(u.lastEffect.nextEffect=e.firstEffect),u.lastEffect=e.lastEffect),1<e.effectTag&&(null!==u.lastEffect?u.lastEffect.nextEffect=e:u.firstEffect=e,u.lastEffect=e)),null!==n)return n;if(null===u){e.stateNode.isReadyForCommit=!0;break}e=u}return null}function r(e){var t=S(e.alternate,e,X);return null===t&&(t=u(e)),jn.current=null,t}function o(e){var t=_(e.alternate,e,X);return null===t&&(t=u(e)),jn.current=null,t}function a(e){if(null!==ee){if(!(0===X||X>e))if(X<=G)for(;null!==Y;)Y=c(Y)?o(Y):r(Y);else for(;null!==Y&&!y();)Y=c(Y)?o(Y):r(Y)}else if(!(0===X||X>e))if(X<=G)for(;null!==Y;)Y=r(Y);else for(;null!==Y&&!y();)Y=r(Y)}function i(e,t){if(Q&&n(\"243\"),Q=!0,e.isReadyForCommit=!1,e!==J||t!==X||null===Y){for(;-1<pr;)fr[pr]=null,pr--;hr=xu,dr.current=xu,Dr.current=!1,k(),J=e,X=t,Y=at(J.current,null,t)}var u=!1,r=null;try{a(t)}catch(e){u=!0,r=e}for(;u;){if(re){ne=r;break}var i=Y;if(null===i)re=!0;else{var c=l(i,r);if(null===c&&n(\"183\"),!re){try{for(u=c,r=t,c=u;null!==i;){switch(i.tag){case 2:et(i);break;case 5:x(i);break;case 3:w(i);break;case 4:w(i)}if(i===c||i.alternate===c)break;i=i.return}Y=o(u),a(r)}catch(e){u=!0,r=e;continue}break}}}return t=ne,re=Q=!1,ne=null,null!==t&&b(t),e.isReadyForCommit?e.current.alternate:null}function l(e,t){var u=jn.current=null,n=!1,r=!1,o=null;if(3===e.tag)u=e,s(e)&&(re=!0);else for(var a=e.return;null!==a&&null===u;){if(2===a.tag?\"function\"===typeof a.stateNode.componentDidCatch&&(n=!0,o=Fe(a),u=a,r=!0):3===a.tag&&(u=a),s(a)){if(ae||null!==ue&&(ue.has(a)||null!==a.alternate&&ue.has(a.alternate)))return null;u=null,r=!1}a=a.return}if(null!==u){null===te&&(te=new Set),te.add(u);var i=\"\";a=e;do{e:switch(a.tag){case 0:case 1:case 2:case 5:var l=a._debugOwner,c=a._debugSource,f=Fe(a),p=null;l&&(p=Fe(l)),l=c,f=\"\\n    in \"+(f||\"Unknown\")+(l?\" (at \"+l.fileName.replace(/^.*[\\\\\\/]/,\"\")+\":\"+l.lineNumber+\")\":p?\" (created by \"+p+\")\":\"\");break e;default:f=\"\"}i+=f,a=a.return}while(a);a=i,e=Fe(e),null===ee&&(ee=new Map),t={componentName:e,componentStack:a,error:t,errorBoundary:n?u.stateNode:null,errorBoundaryFound:n,errorBoundaryName:o,willRetry:r},ee.set(u,t);try{var d=t.error;d&&d.suppressReactErrorLogging||console.error(d)}catch(e){e&&e.suppressReactErrorLogging||console.error(e)}return oe?(null===ue&&(ue=new Set),ue.add(u)):h(u),u}return null===ne&&(ne=t),null}function c(e){return null!==ee&&(ee.has(e)||null!==e.alternate&&ee.has(e.alternate))}function s(e){return null!==te&&(te.has(e)||null!==e.alternate&&te.has(e.alternate))}function f(){return 20*(1+((m()+100)/20|0))}function p(e){return 0!==$?$:Q?oe?1:X:!V||1&e.internalContextTag?f():1}function d(e,t){return D(e,t,!1)}function D(e,t){for(;null!==e;){if((0===e.expirationTime||e.expirationTime>t)&&(e.expirationTime=t),null!==e.alternate&&(0===e.alternate.expirationTime||e.alternate.expirationTime>t)&&(e.alternate.expirationTime=t),null===e.return){if(3!==e.tag)break;var u=e.stateNode;!Q&&u===J&&t<X&&(Y=J=null,X=0);var r=u,o=t;if(ye>Ee&&n(\"185\"),null===r.nextScheduledRoot)r.remainingExpirationTime=o,null===le?(ie=le=r,r.nextScheduledRoot=r):(le=le.nextScheduledRoot=r,le.nextScheduledRoot=ie);else{var a=r.remainingExpirationTime;(0===a||o<a)&&(r.remainingExpirationTime=o)}fe||(Ce?Ae&&(pe=r,de=1,F(pe,de)):1===o?E(1,null):g(o)),!Q&&u===J&&t<X&&(Y=J=null,X=0)}e=e.return}}function h(e){D(e,1,!0)}function m(){return G=2+((M()-K)/10|0)}function g(e){if(0!==ce){if(e>ce)return;H(se)}var t=M()-K;ce=e,se=j(A,{timeout:10*(e-2)-t})}function C(){var e=0,t=null;if(null!==le)for(var u=le,r=ie;null!==r;){var o=r.remainingExpirationTime;if(0===o){if((null===u||null===le)&&n(\"244\"),r===r.nextScheduledRoot){ie=le=r.nextScheduledRoot=null;break}if(r===ie)ie=o=r.nextScheduledRoot,le.nextScheduledRoot=o,r.nextScheduledRoot=null;else{if(r===le){le=u,le.nextScheduledRoot=ie,r.nextScheduledRoot=null;break}u.nextScheduledRoot=r.nextScheduledRoot,r.nextScheduledRoot=null}r=u.nextScheduledRoot}else{if((0===e||o<e)&&(e=o,t=r),r===le)break;u=r,r=r.nextScheduledRoot}}u=pe,null!==u&&u===t?ye++:ye=0,pe=t,de=e}function A(e){E(0,e)}function E(e,t){for(ge=t,C();null!==pe&&0!==de&&(0===e||de<=e)&&!De;)F(pe,de),C();if(null!==ge&&(ce=0,se=-1),0!==de&&g(de),ge=null,De=!1,ye=0,he)throw e=me,me=null,he=!1,e}function F(e,u){if(fe&&n(\"245\"),fe=!0,u<=m()){var r=e.finishedWork;null!==r?(e.finishedWork=null,e.remainingExpirationTime=t(r)):(e.finishedWork=null,null!==(r=i(e,u))&&(e.remainingExpirationTime=t(r)))}else r=e.finishedWork,null!==r?(e.finishedWork=null,e.remainingExpirationTime=t(r)):(e.finishedWork=null,null!==(r=i(e,u))&&(y()?e.finishedWork=r:e.remainingExpirationTime=t(r)));fe=!1}function y(){return!(null===ge||ge.timeRemaining()>be)&&(De=!0)}function b(e){null===pe&&n(\"246\"),pe.remainingExpirationTime=0,he||(he=!0,me=e)}var v=_t(e),B=Nt(e),w=v.popHostContainer,x=v.popHostContext,k=v.resetHostContainer,T=kt(e,v,B,d,p),S=T.beginWork,_=T.beginFailedWork,N=Tt(e,v,B).completeWork;v=St(e,l);var O=v.commitResetTextContent,P=v.commitPlacement,I=v.commitDeletion,R=v.commitWork,L=v.commitLifeCycles,q=v.commitAttachRef,U=v.commitDetachRef,M=e.now,j=e.scheduleDeferredCallback,H=e.cancelDeferredCallback,V=e.useSyncScheduling,z=e.prepareForCommit,W=e.resetAfterCommit,K=M(),G=2,$=0,Q=!1,Y=null,J=null,X=0,Z=null,ee=null,te=null,ue=null,ne=null,re=!1,oe=!1,ae=!1,ie=null,le=null,ce=0,se=-1,fe=!1,pe=null,de=0,De=!1,he=!1,me=null,ge=null,Ce=!1,Ae=!1,Ee=1e3,ye=0,be=1;return{computeAsyncExpiration:f,computeExpirationForFiber:p,scheduleWork:d,batchedUpdates:function(e,t){var u=Ce;Ce=!0;try{return e(t)}finally{(Ce=u)||fe||E(1,null)}},unbatchedUpdates:function(e){if(Ce&&!Ae){Ae=!0;try{return e()}finally{Ae=!1}}return e()},flushSync:function(e){var t=Ce;Ce=!0;try{e:{var u=$;$=1;try{var r=e();break e}finally{$=u}r=void 0}return r}finally{Ce=t,fe&&n(\"187\"),E(1,null)}},deferredUpdates:function(e){var t=$;$=f();try{return e()}finally{$=t}}}}function Pt(e){function t(e){return e=we(e),null===e?null:e.stateNode}var u=e.getPublicInstance;e=Ot(e);var r=e.computeAsyncExpiration,o=e.computeExpirationForFiber,a=e.scheduleWork;return{createContainer:function(e,t){var u=new ot(3,null,0);return e={current:u,containerInfo:e,pendingChildren:null,remainingExpirationTime:0,isReadyForCommit:!1,finishedWork:null,context:null,pendingContext:null,hydrate:t,nextScheduledRoot:null},u.stateNode=e},updateContainer:function(e,t,u,i){var l=t.current;if(u){u=u._reactInternalFiber;var c;e:{for(2===ye(u)&&2===u.tag||n(\"170\"),c=u;3!==c.tag;){if(Ze(c)){c=c.stateNode.__reactInternalMemoizedMergedChildContext;break e}(c=c.return)||n(\"171\")}c=c.stateNode.context}u=Ze(u)?ut(u,c):c}else u=xu;null===t.context?t.context=u:t.pendingContext=u,t=i,t=void 0===t?null:t,i=null!=e&&null!=e.type&&null!=e.type.prototype&&!0===e.type.prototype.unstable_isAsyncReactComponent?r():o(l),At(l,{expirationTime:i,partialState:{element:e},callback:t,isReplace:!1,isForced:!1,nextCallback:null,next:null}),a(l,i)},batchedUpdates:e.batchedUpdates,unbatchedUpdates:e.unbatchedUpdates,deferredUpdates:e.deferredUpdates,flushSync:e.flushSync,getPublicRootInstance:function(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return u(e.child.stateNode);default:return e.child.stateNode}},findHostInstance:t,findHostInstanceWithNoPortals:function(e){return e=xe(e),null===e?null:e.stateNode},injectIntoDevTools:function(e){var u=e.findFiberByHostInstance;return Dt(Eu({},e,{findHostInstanceByFiber:function(e){return t(e)},findFiberByHostInstance:function(e){return u?u(e):null}}))}}}function It(e,t,u){var n=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:yr,key:null==n?null:\"\"+n,children:e,containerInfo:t,implementation:u}}function Rt(e){return!!$r.hasOwnProperty(e)||!Gr.hasOwnProperty(e)&&(Kr.test(e)?$r[e]=!0:(Gr[e]=!0,!1))}function Lt(e,t,u){var n=a(t);if(n&&o(t,u)){var r=n.mutationMethod;r?r(e,u):null==u||n.hasBooleanValue&&!u||n.hasNumericValue&&isNaN(u)||n.hasPositiveNumericValue&&1>u||n.hasOverloadedBooleanValue&&!1===u?Ut(e,t):n.mustUseProperty?e[n.propertyName]=u:(t=n.attributeName,(r=n.attributeNamespace)?e.setAttributeNS(r,t,\"\"+u):n.hasBooleanValue||n.hasOverloadedBooleanValue&&!0===u?e.setAttribute(t,\"\"):e.setAttribute(t,\"\"+u))}else qt(e,t,o(t,u)?u:null)}function qt(e,t,u){Rt(t)&&(null==u?e.removeAttribute(t):e.setAttribute(t,\"\"+u))}function Ut(e,t){var u=a(t);u?(t=u.mutationMethod)?t(e,void 0):u.mustUseProperty?e[u.propertyName]=!u.hasBooleanValue&&\"\":e.removeAttribute(u.attributeName):e.removeAttribute(t)}function Mt(e,t){var u=t.value,n=t.checked;return Eu({type:void 0,step:void 0,min:void 0,max:void 0},t,{defaultChecked:void 0,defaultValue:void 0,value:null!=u?u:e._wrapperState.initialValue,checked:null!=n?n:e._wrapperState.initialChecked})}function jt(e,t){var u=t.defaultValue;e._wrapperState={initialChecked:null!=t.checked?t.checked:t.defaultChecked,initialValue:null!=t.value?t.value:u,controlled:\"checkbox\"===t.type||\"radio\"===t.type?null!=t.checked:null!=t.value}}function Ht(e,t){null!=(t=t.checked)&&Lt(e,\"checked\",t)}function Vt(e,t){Ht(e,t);var u=t.value;null!=u?0===u&&\"\"===e.value?e.value=\"0\":\"number\"===t.type?(t=parseFloat(e.value)||0,(u!=t||u==t&&e.value!=u)&&(e.value=\"\"+u)):e.value!==\"\"+u&&(e.value=\"\"+u):(null==t.value&&null!=t.defaultValue&&e.defaultValue!==\"\"+t.defaultValue&&(e.defaultValue=\"\"+t.defaultValue),null==t.checked&&null!=t.defaultChecked&&(e.defaultChecked=!!t.defaultChecked))}function zt(e,t){switch(t.type){case\"submit\":case\"reset\":break;case\"color\":case\"date\":case\"datetime\":case\"datetime-local\":case\"month\":case\"time\":case\"week\":e.value=\"\",e.value=e.defaultValue;break;default:e.value=e.value}t=e.name,\"\"!==t&&(e.name=\"\"),e.defaultChecked=!e.defaultChecked,e.defaultChecked=!e.defaultChecked,\"\"!==t&&(e.name=t)}function Wt(e){var t=\"\";return Cu.Children.forEach(e,function(e){null==e||\"string\"!==typeof e&&\"number\"!==typeof e||(t+=e)}),t}function Kt(e,t){return e=Eu({children:void 0},t),(t=Wt(t.children))&&(e.children=t),e}function Gt(e,t,u,n){if(e=e.options,t){t={};for(var r=0;r<u.length;r++)t[\"$\"+u[r]]=!0;for(u=0;u<e.length;u++)r=t.hasOwnProperty(\"$\"+e[u].value),e[u].selected!==r&&(e[u].selected=r),r&&n&&(e[u].defaultSelected=!0)}else{for(u=\"\"+u,t=null,r=0;r<e.length;r++){if(e[r].value===u)return e[r].selected=!0,void(n&&(e[r].defaultSelected=!0));null!==t||e[r].disabled||(t=e[r])}null!==t&&(t.selected=!0)}}function $t(e,t){var u=t.value;e._wrapperState={initialValue:null!=u?u:t.defaultValue,wasMultiple:!!t.multiple}}function Qt(e,t){return null!=t.dangerouslySetInnerHTML&&n(\"91\"),Eu({},t,{value:void 0,defaultValue:void 0,children:\"\"+e._wrapperState.initialValue})}function Yt(e,t){var u=t.value;null==u&&(u=t.defaultValue,t=t.children,null!=t&&(null!=u&&n(\"92\"),Array.isArray(t)&&(1>=t.length||n(\"93\"),t=t[0]),u=\"\"+t),null==u&&(u=\"\")),e._wrapperState={initialValue:\"\"+u}}function Jt(e,t){var u=t.value;null!=u&&(u=\"\"+u,u!==e.value&&(e.value=u),null==t.defaultValue&&(e.defaultValue=u)),null!=t.defaultValue&&(e.defaultValue=t.defaultValue)}function Xt(e){var t=e.textContent;t===e._wrapperState.initialValue&&(e.value=t)}function Zt(e){switch(e){case\"svg\":return\"http://www.w3.org/2000/svg\";case\"math\":return\"http://www.w3.org/1998/Math/MathML\";default:return\"http://www.w3.org/1999/xhtml\"}}function eu(e,t){return null==e||\"http://www.w3.org/1999/xhtml\"===e?Zt(t):\"http://www.w3.org/2000/svg\"===e&&\"foreignObject\"===t?\"http://www.w3.org/1999/xhtml\":e}function tu(e,t){if(t){var u=e.firstChild;if(u&&u===e.lastChild&&3===u.nodeType)return void(u.nodeValue=t)}e.textContent=t}function uu(e,t){e=e.style;for(var u in t)if(t.hasOwnProperty(u)){var n=0===u.indexOf(\"--\"),r=u,o=t[u];r=null==o||\"boolean\"===typeof o||\"\"===o?\"\":n||\"number\"!==typeof o||0===o||Xr.hasOwnProperty(r)&&Xr[r]?(\"\"+o).trim():o+\"px\",\"float\"===u&&(u=\"cssFloat\"),n?e.setProperty(u,r):e[u]=r}}function nu(e,t,u){t&&(eo[e]&&(null!=t.children||null!=t.dangerouslySetInnerHTML)&&n(\"137\",e,u()),null!=t.dangerouslySetInnerHTML&&(null!=t.children&&n(\"60\"),\"object\"===typeof t.dangerouslySetInnerHTML&&\"__html\"in t.dangerouslySetInnerHTML||n(\"61\")),null!=t.style&&\"object\"!==typeof t.style&&n(\"62\",u()))}function ru(e,t){if(-1===e.indexOf(\"-\"))return\"string\"===typeof t.is;switch(e){case\"annotation-xml\":case\"color-profile\":case\"font-face\":case\"font-face-src\":case\"font-face-uri\":case\"font-face-format\":case\"font-face-name\":case\"missing-glyph\":return!1;default:return!0}}function ou(e,t){e=9===e.nodeType||11===e.nodeType?e:e.ownerDocument;var u=Ie(e);t=Qu[t];for(var n=0;n<t.length;n++){var r=t[n];u.hasOwnProperty(r)&&u[r]||(\"topScroll\"===r?_e(\"topScroll\",\"scroll\",e):\"topFocus\"===r||\"topBlur\"===r?(_e(\"topFocus\",\"focus\",e),_e(\"topBlur\",\"blur\",e),u.topBlur=!0,u.topFocus=!0):\"topCancel\"===r?(ue(\"cancel\",!0)&&_e(\"topCancel\",\"cancel\",e),u.topCancel=!0):\"topClose\"===r?(ue(\"close\",!0)&&_e(\"topClose\",\"close\",e),u.topClose=!0):Qn.hasOwnProperty(r)&&Se(r,Qn[r],e),u[r]=!0)}}function au(e,t,u,n){return u=9===u.nodeType?u:u.ownerDocument,n===to&&(n=Zt(e)),n===to?\"script\"===e?(e=u.createElement(\"div\"),e.innerHTML=\"<script><\\/script>\",e=e.removeChild(e.firstChild)):e=\"string\"===typeof t.is?u.createElement(e,{is:t.is}):u.createElement(e):e=u.createElementNS(n,e),e}function iu(e,t){return(9===t.nodeType?t:t.ownerDocument).createTextNode(e)}function lu(e,t,u,n){var r=ru(t,u);switch(t){case\"iframe\":case\"object\":Se(\"topLoad\",\"load\",e);var o=u;break;case\"video\":case\"audio\":for(o in no)no.hasOwnProperty(o)&&Se(o,no[o],e);o=u;break;case\"source\":Se(\"topError\",\"error\",e),o=u;break;case\"img\":case\"image\":Se(\"topError\",\"error\",e),Se(\"topLoad\",\"load\",e),o=u;break;case\"form\":Se(\"topReset\",\"reset\",e),Se(\"topSubmit\",\"submit\",e),o=u;break;case\"details\":Se(\"topToggle\",\"toggle\",e),o=u;break;case\"input\":jt(e,u),o=Mt(e,u),Se(\"topInvalid\",\"invalid\",e),ou(n,\"onChange\");break;case\"option\":o=Kt(e,u);break;case\"select\":$t(e,u),o=Eu({},u,{value:void 0}),Se(\"topInvalid\",\"invalid\",e),ou(n,\"onChange\");break;case\"textarea\":Yt(e,u),o=Qt(e,u),Se(\"topInvalid\",\"invalid\",e),ou(n,\"onChange\");break;default:o=u}nu(t,o,uo);var a,i=o;for(a in i)if(i.hasOwnProperty(a)){var l=i[a];\"style\"===a?uu(e,l,uo):\"dangerouslySetInnerHTML\"===a?null!=(l=l?l.__html:void 0)&&Jr(e,l):\"children\"===a?\"string\"===typeof l?(\"textarea\"!==t||\"\"!==l)&&tu(e,l):\"number\"===typeof l&&tu(e,\"\"+l):\"suppressContentEditableWarning\"!==a&&\"suppressHydrationWarning\"!==a&&\"autoFocus\"!==a&&($u.hasOwnProperty(a)?null!=l&&ou(n,a):r?qt(e,a,l):null!=l&&Lt(e,a,l))}switch(t){case\"input\":oe(e),zt(e,u);break;case\"textarea\":oe(e),Xt(e,u);break;case\"option\":null!=u.value&&e.setAttribute(\"value\",u.value);break;case\"select\":e.multiple=!!u.multiple,t=u.value,null!=t?Gt(e,!!u.multiple,t,!1):null!=u.defaultValue&&Gt(e,!!u.multiple,u.defaultValue,!0);break;default:\"function\"===typeof o.onClick&&(e.onclick=Fu)}}function cu(e,t,u,n,r){var o=null;switch(t){case\"input\":u=Mt(e,u),n=Mt(e,n),o=[];break;case\"option\":u=Kt(e,u),n=Kt(e,n),o=[];break;case\"select\":u=Eu({},u,{value:void 0}),n=Eu({},n,{value:void 0}),o=[];break;case\"textarea\":u=Qt(e,u),n=Qt(e,n),o=[];break;default:\"function\"!==typeof u.onClick&&\"function\"===typeof n.onClick&&(e.onclick=Fu)}nu(t,n,uo);var a,i;e=null;for(a in u)if(!n.hasOwnProperty(a)&&u.hasOwnProperty(a)&&null!=u[a])if(\"style\"===a)for(i in t=u[a])t.hasOwnProperty(i)&&(e||(e={}),e[i]=\"\");else\"dangerouslySetInnerHTML\"!==a&&\"children\"!==a&&\"suppressContentEditableWarning\"!==a&&\"suppressHydrationWarning\"!==a&&\"autoFocus\"!==a&&($u.hasOwnProperty(a)?o||(o=[]):(o=o||[]).push(a,null));for(a in n){var l=n[a];if(t=null!=u?u[a]:void 0,n.hasOwnProperty(a)&&l!==t&&(null!=l||null!=t))if(\"style\"===a)if(t){for(i in t)!t.hasOwnProperty(i)||l&&l.hasOwnProperty(i)||(e||(e={}),e[i]=\"\");for(i in l)l.hasOwnProperty(i)&&t[i]!==l[i]&&(e||(e={}),e[i]=l[i])}else e||(o||(o=[]),o.push(a,e)),e=l;else\"dangerouslySetInnerHTML\"===a?(l=l?l.__html:void 0,t=t?t.__html:void 0,null!=l&&t!==l&&(o=o||[]).push(a,\"\"+l)):\"children\"===a?t===l||\"string\"!==typeof l&&\"number\"!==typeof l||(o=o||[]).push(a,\"\"+l):\"suppressContentEditableWarning\"!==a&&\"suppressHydrationWarning\"!==a&&($u.hasOwnProperty(a)?(null!=l&&ou(r,a),o||t===l||(o=[])):(o=o||[]).push(a,l))}return e&&(o=o||[]).push(\"style\",e),o}function su(e,t,u,n,r){\"input\"===u&&\"radio\"===r.type&&null!=r.name&&Ht(e,r),ru(u,n),n=ru(u,r);for(var o=0;o<t.length;o+=2){var a=t[o],i=t[o+1];\"style\"===a?uu(e,i,uo):\"dangerouslySetInnerHTML\"===a?Jr(e,i):\"children\"===a?tu(e,i):n?null!=i?qt(e,a,i):e.removeAttribute(a):null!=i?Lt(e,a,i):Ut(e,a)}switch(u){case\"input\":Vt(e,r);break;case\"textarea\":Jt(e,r);break;case\"select\":e._wrapperState.initialValue=void 0,t=e._wrapperState.wasMultiple,e._wrapperState.wasMultiple=!!r.multiple,u=r.value,null!=u?Gt(e,!!r.multiple,u,!1):t!==!!r.multiple&&(null!=r.defaultValue?Gt(e,!!r.multiple,r.defaultValue,!0):Gt(e,!!r.multiple,r.multiple?[]:\"\",!1))}}function fu(e,t,u,n,r){switch(t){case\"iframe\":case\"object\":Se(\"topLoad\",\"load\",e);break;case\"video\":case\"audio\":for(var o in no)no.hasOwnProperty(o)&&Se(o,no[o],e);break;case\"source\":Se(\"topError\",\"error\",e);break;case\"img\":case\"image\":Se(\"topError\",\"error\",e),Se(\"topLoad\",\"load\",e);break;case\"form\":Se(\"topReset\",\"reset\",e),Se(\"topSubmit\",\"submit\",e);break;case\"details\":Se(\"topToggle\",\"toggle\",e);break;case\"input\":jt(e,u),Se(\"topInvalid\",\"invalid\",e),ou(r,\"onChange\");break;case\"select\":$t(e,u),Se(\"topInvalid\",\"invalid\",e),ou(r,\"onChange\");break;case\"textarea\":Yt(e,u),Se(\"topInvalid\",\"invalid\",e),ou(r,\"onChange\")}nu(t,u,uo),n=null;for(var a in u)u.hasOwnProperty(a)&&(o=u[a],\"children\"===a?\"string\"===typeof o?e.textContent!==o&&(n=[\"children\",o]):\"number\"===typeof o&&e.textContent!==\"\"+o&&(n=[\"children\",\"\"+o]):$u.hasOwnProperty(a)&&null!=o&&ou(r,a));switch(t){case\"input\":oe(e),zt(e,u);break;case\"textarea\":oe(e),Xt(e,u);break;case\"select\":case\"option\":break;default:\"function\"===typeof u.onClick&&(e.onclick=Fu)}return n}function pu(e,t){return e.nodeValue!==t}function du(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||\" react-mount-point-unstable \"!==e.nodeValue))}function Du(e){return!(!(e=e?9===e.nodeType?e.documentElement:e.firstChild:null)||1!==e.nodeType||!e.hasAttribute(\"data-reactroot\"))}function hu(e,t,u,r,o){du(u)||n(\"200\");var a=u._reactRootContainer;if(a)io.updateContainer(t,a,e,o);else{if(!(r=r||Du(u)))for(a=void 0;a=u.lastChild;)u.removeChild(a);var i=io.createContainer(u,r);a=u._reactRootContainer=i,io.unbatchedUpdates(function(){io.updateContainer(t,i,e,o)})}return io.getPublicRootInstance(a)}function mu(e,t){var u=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;return du(t)||n(\"200\"),It(e,t,null,u)}function gu(e,t){this._reactRootContainer=io.createContainer(e,t)}var Cu=u(0),Au=u(26),Eu=u(2),Fu=u(3),yu=u(27),bu=u(28),vu=u(29),Bu=u(30),wu=u(33),xu=u(5);Cu||n(\"227\");var ku={children:!0,dangerouslySetInnerHTML:!0,defaultValue:!0,defaultChecked:!0,innerHTML:!0,suppressContentEditableWarning:!0,suppressHydrationWarning:!0,style:!0},Tu={MUST_USE_PROPERTY:1,HAS_BOOLEAN_VALUE:4,HAS_NUMERIC_VALUE:8,HAS_POSITIVE_NUMERIC_VALUE:24,HAS_OVERLOADED_BOOLEAN_VALUE:32,HAS_STRING_BOOLEAN_VALUE:64,injectDOMPropertyConfig:function(e){var t=Tu,u=e.Properties||{},o=e.DOMAttributeNamespaces||{},a=e.DOMAttributeNames||{};e=e.DOMMutationMethods||{};for(var i in u){Su.hasOwnProperty(i)&&n(\"48\",i);var l=i.toLowerCase(),c=u[i];l={attributeName:l,attributeNamespace:null,propertyName:i,mutationMethod:null,mustUseProperty:r(c,t.MUST_USE_PROPERTY),hasBooleanValue:r(c,t.HAS_BOOLEAN_VALUE),hasNumericValue:r(c,t.HAS_NUMERIC_VALUE),hasPositiveNumericValue:r(c,t.HAS_POSITIVE_NUMERIC_VALUE),hasOverloadedBooleanValue:r(c,t.HAS_OVERLOADED_BOOLEAN_VALUE),hasStringBooleanValue:r(c,t.HAS_STRING_BOOLEAN_VALUE)},1>=l.hasBooleanValue+l.hasNumericValue+l.hasOverloadedBooleanValue||n(\"50\",i),a.hasOwnProperty(i)&&(l.attributeName=a[i]),o.hasOwnProperty(i)&&(l.attributeNamespace=o[i]),e.hasOwnProperty(i)&&(l.mutationMethod=e[i]),Su[i]=l}}},Su={},_u=Tu,Nu=_u.MUST_USE_PROPERTY,Ou=_u.HAS_BOOLEAN_VALUE,Pu=_u.HAS_NUMERIC_VALUE,Iu=_u.HAS_POSITIVE_NUMERIC_VALUE,Ru=_u.HAS_OVERLOADED_BOOLEAN_VALUE,Lu=_u.HAS_STRING_BOOLEAN_VALUE,qu={Properties:{allowFullScreen:Ou,async:Ou,autoFocus:Ou,autoPlay:Ou,capture:Ru,checked:Nu|Ou,cols:Iu,contentEditable:Lu,controls:Ou,default:Ou,defer:Ou,disabled:Ou,download:Ru,draggable:Lu,formNoValidate:Ou,hidden:Ou,loop:Ou,multiple:Nu|Ou,muted:Nu|Ou,noValidate:Ou,open:Ou,playsInline:Ou,readOnly:Ou,required:Ou,reversed:Ou,rows:Iu,rowSpan:Pu,scoped:Ou,seamless:Ou,selected:Nu|Ou,size:Iu,start:Pu,span:Iu,spellCheck:Lu,style:0,tabIndex:0,itemScope:Ou,acceptCharset:0,className:0,htmlFor:0,httpEquiv:0,value:Lu},DOMAttributeNames:{acceptCharset:\"accept-charset\",className:\"class\",htmlFor:\"for\",httpEquiv:\"http-equiv\"},DOMMutationMethods:{value:function(e,t){if(null==t)return e.removeAttribute(\"value\");\"number\"!==e.type||!1===e.hasAttribute(\"value\")?e.setAttribute(\"value\",\"\"+t):e.validity&&!e.validity.badInput&&e.ownerDocument.activeElement!==e&&e.setAttribute(\"value\",\"\"+t)}}},Uu=_u.HAS_STRING_BOOLEAN_VALUE,Mu={xlink:\"http://www.w3.org/1999/xlink\",xml:\"http://www.w3.org/XML/1998/namespace\"},ju={Properties:{autoReverse:Uu,externalResourcesRequired:Uu,preserveAlpha:Uu},DOMAttributeNames:{autoReverse:\"autoReverse\",externalResourcesRequired:\"externalResourcesRequired\",preserveAlpha:\"preserveAlpha\"},DOMAttributeNamespaces:{xlinkActuate:Mu.xlink,xlinkArcrole:Mu.xlink,xlinkHref:Mu.xlink,xlinkRole:Mu.xlink,xlinkShow:Mu.xlink,xlinkTitle:Mu.xlink,xlinkType:Mu.xlink,xmlBase:Mu.xml,xmlLang:Mu.xml,xmlSpace:Mu.xml}},Hu=/[\\-\\:]([a-z])/g;\"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode x-height xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xmlns:xlink xml:lang xml:space\".split(\" \").forEach(function(e){var t=e.replace(Hu,i);ju.Properties[t]=0,ju.DOMAttributeNames[t]=e}),_u.injectDOMPropertyConfig(qu),_u.injectDOMPropertyConfig(ju);var Vu={_caughtError:null,_hasCaughtError:!1,_rethrowError:null,_hasRethrowError:!1,injection:{injectErrorUtils:function(e){\"function\"!==typeof e.invokeGuardedCallback&&n(\"197\"),l=e.invokeGuardedCallback}},invokeGuardedCallback:function(e,t,u,n,r,o,a,i,c){l.apply(Vu,arguments)},invokeGuardedCallbackAndCatchFirstError:function(e,t,u,n,r,o,a,i,l){if(Vu.invokeGuardedCallback.apply(this,arguments),Vu.hasCaughtError()){var c=Vu.clearCaughtError();Vu._hasRethrowError||(Vu._hasRethrowError=!0,Vu._rethrowError=c)}},rethrowCaughtError:function(){return c.apply(Vu,arguments)},hasCaughtError:function(){return Vu._hasCaughtError},clearCaughtError:function(){if(Vu._hasCaughtError){var e=Vu._caughtError;return Vu._caughtError=null,Vu._hasCaughtError=!1,e}n(\"198\")}},zu=null,Wu={},Ku=[],Gu={},$u={},Qu={},Yu=Object.freeze({plugins:Ku,eventNameDispatchConfigs:Gu,registrationNameModules:$u,registrationNameDependencies:Qu,possibleRegistrationNames:null,injectEventPluginOrder:p,injectEventPluginsByName:d}),Ju=null,Xu=null,Zu=null,en=null,tn={injectEventPluginOrder:p,injectEventPluginsByName:d},un=Object.freeze({injection:tn,getListener:E,extractEvents:F,enqueueEvents:y,processEventQueue:b}),nn=Math.random().toString(36).slice(2),rn=\"__reactInternalInstance$\"+nn,on=\"__reactEventHandlers$\"+nn,an=Object.freeze({precacheFiberNode:function(e,t){t[rn]=e},getClosestInstanceFromNode:v,getInstanceFromNode:function(e){return e=e[rn],!e||5!==e.tag&&6!==e.tag?null:e},getNodeFromInstance:B,getFiberCurrentPropsFromNode:w,updateFiberProps:function(e,t){e[on]=t}}),ln=Object.freeze({accumulateTwoPhaseDispatches:P,accumulateTwoPhaseDispatchesSkipTarget:function(e){m(e,_)},accumulateEnterLeaveDispatches:I,accumulateDirectDispatches:function(e){m(e,O)}}),cn=null,sn={_root:null,_startText:null,_fallbackText:null},fn=\"dispatchConfig _targetInst nativeEvent isDefaultPrevented isPropagationStopped _dispatchListeners _dispatchInstances\".split(\" \"),pn={type:null,target:null,currentTarget:Fu.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};Eu(U.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():\"unknown\"!==typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=Fu.thatReturnsTrue)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():\"unknown\"!==typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=Fu.thatReturnsTrue)},persist:function(){this.isPersistent=Fu.thatReturnsTrue},isPersistent:Fu.thatReturnsFalse,destructor:function(){var e,t=this.constructor.Interface;for(e in t)this[e]=null;for(t=0;t<fn.length;t++)this[fn[t]]=null}}),U.Interface=pn,U.augmentClass=function(e,t){function u(){}u.prototype=this.prototype;var n=new u;Eu(n,e.prototype),e.prototype=n,e.prototype.constructor=e,e.Interface=Eu({},this.Interface,t),e.augmentClass=this.augmentClass,H(e)},H(U),U.augmentClass(V,{data:null}),U.augmentClass(z,{data:null});var dn=[9,13,27,32],Dn=Au.canUseDOM&&\"CompositionEvent\"in window,hn=null;Au.canUseDOM&&\"documentMode\"in document&&(hn=document.documentMode);var mn;if(mn=Au.canUseDOM&&\"TextEvent\"in window&&!hn){var gn=window.opera;mn=!(\"object\"===typeof gn&&\"function\"===typeof gn.version&&12>=parseInt(gn.version(),10))}var Cn,An=mn,En=Au.canUseDOM&&(!Dn||hn&&8<hn&&11>=hn),Fn=String.fromCharCode(32),yn={beforeInput:{phasedRegistrationNames:{bubbled:\"onBeforeInput\",captured:\"onBeforeInputCapture\"},dependencies:[\"topCompositionEnd\",\"topKeyPress\",\"topTextInput\",\"topPaste\"]},compositionEnd:{phasedRegistrationNames:{bubbled:\"onCompositionEnd\",captured:\"onCompositionEndCapture\"},dependencies:\"topBlur topCompositionEnd topKeyDown topKeyPress topKeyUp topMouseDown\".split(\" \")},compositionStart:{phasedRegistrationNames:{bubbled:\"onCompositionStart\",captured:\"onCompositionStartCapture\"},dependencies:\"topBlur topCompositionStart topKeyDown topKeyPress topKeyUp topMouseDown\".split(\" \")},compositionUpdate:{phasedRegistrationNames:{bubbled:\"onCompositionUpdate\",captured:\"onCompositionUpdateCapture\"},dependencies:\"topBlur topCompositionUpdate topKeyDown topKeyPress topKeyUp topMouseDown\".split(\" \")}},bn=!1,vn=!1,Bn={eventTypes:yn,extractEvents:function(e,t,u,n){var r;if(Dn)e:{switch(e){case\"topCompositionStart\":var o=yn.compositionStart;break e;case\"topCompositionEnd\":o=yn.compositionEnd;break e;case\"topCompositionUpdate\":o=yn.compositionUpdate;break e}o=void 0}else vn?W(e,u)&&(o=yn.compositionEnd):\"topKeyDown\"===e&&229===u.keyCode&&(o=yn.compositionStart);return o?(En&&(vn||o!==yn.compositionStart?o===yn.compositionEnd&&vn&&(r=L()):(sn._root=n,sn._startText=q(),vn=!0)),o=V.getPooled(o,t,u,n),r?o.data=r:null!==(r=K(u))&&(o.data=r),P(o),r=o):r=null,(e=An?G(e,u):$(e,u))?(t=z.getPooled(yn.beforeInput,t,u,n),t.data=e,P(t)):t=null,[r,t]}},wn=null,xn=null,kn=null,Tn={injectFiberControlledHostComponent:function(e){wn=e}},Sn=Object.freeze({injection:Tn,enqueueStateRestore:Y,restoreStateIfNeeded:J}),_n=!1,Nn={color:!0,date:!0,datetime:!0,\"datetime-local\":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};Au.canUseDOM&&(Cn=document.implementation&&document.implementation.hasFeature&&!0!==document.implementation.hasFeature(\"\",\"\"));var On={change:{phasedRegistrationNames:{bubbled:\"onChange\",captured:\"onChangeCapture\"},dependencies:\"topBlur topChange topClick topFocus topInput topKeyDown topKeyUp topSelectionChange\".split(\" \")}},Pn=null,In=null,Rn=!1;Au.canUseDOM&&(Rn=ue(\"input\")&&(!document.documentMode||9<document.documentMode));var Ln={eventTypes:On,_isInputEventSupported:Rn,extractEvents:function(e,t,u,n){var r=t?B(t):window,o=r.nodeName&&r.nodeName.toLowerCase();if(\"select\"===o||\"input\"===o&&\"file\"===r.type)var a=se;else if(ee(r))if(Rn)a=me;else{a=De;var i=de}else!(o=r.nodeName)||\"input\"!==o.toLowerCase()||\"checkbox\"!==r.type&&\"radio\"!==r.type||(a=he);if(a&&(a=a(e,t)))return ie(a,u,n);i&&i(e,r,t),\"topBlur\"===e&&null!=t&&(e=t._wrapperState||r._wrapperState)&&e.controlled&&\"number\"===r.type&&(e=\"\"+r.value,r.getAttribute(\"value\")!==e&&r.setAttribute(\"value\",e))}};U.augmentClass(ge,{view:null,detail:null});var qn={Alt:\"altKey\",Control:\"ctrlKey\",Meta:\"metaKey\",Shift:\"shiftKey\"};ge.augmentClass(Ee,{screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:Ae,button:null,buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)}});var Un={mouseEnter:{registrationName:\"onMouseEnter\",dependencies:[\"topMouseOut\",\"topMouseOver\"]},mouseLeave:{registrationName:\"onMouseLeave\",dependencies:[\"topMouseOut\",\"topMouseOver\"]}},Mn={eventTypes:Un,extractEvents:function(e,t,u,n){if(\"topMouseOver\"===e&&(u.relatedTarget||u.fromElement)||\"topMouseOut\"!==e&&\"topMouseOver\"!==e)return null;var r=n.window===n?n:(r=n.ownerDocument)?r.defaultView||r.parentWindow:window;if(\"topMouseOut\"===e?(e=t,t=(t=u.relatedTarget||u.toElement)?v(t):null):e=null,e===t)return null;var o=null==e?r:B(e);r=null==t?r:B(t);var a=Ee.getPooled(Un.mouseLeave,e,u,n);return a.type=\"mouseleave\",a.target=o,a.relatedTarget=r,u=Ee.getPooled(Un.mouseEnter,t,u,n),u.type=\"mouseenter\",u.target=r,u.relatedTarget=o,I(a,u,e,t),[a,u]}},jn=Cu.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Hn=[],Vn=!0,zn=void 0,Wn=Object.freeze({get _enabled(){return Vn},get _handleTopLevel(){return zn},setHandleTopLevel:function(e){zn=e},setEnabled:Te,isEnabled:function(){return Vn},trapBubbledEvent:Se,trapCapturedEvent:_e,dispatchEvent:Ne}),Kn={animationend:Oe(\"Animation\",\"AnimationEnd\"),animationiteration:Oe(\"Animation\",\"AnimationIteration\"),animationstart:Oe(\"Animation\",\"AnimationStart\"),transitionend:Oe(\"Transition\",\"TransitionEnd\")},Gn={},$n={};Au.canUseDOM&&($n=document.createElement(\"div\").style,\"AnimationEvent\"in window||(delete Kn.animationend.animation,delete Kn.animationiteration.animation,delete Kn.animationstart.animation),\"TransitionEvent\"in window||delete Kn.transitionend.transition);var Qn={topAbort:\"abort\",topAnimationEnd:Pe(\"animationend\")||\"animationend\",topAnimationIteration:Pe(\"animationiteration\")||\"animationiteration\",topAnimationStart:Pe(\"animationstart\")||\"animationstart\",topBlur:\"blur\",topCancel:\"cancel\",topCanPlay:\"canplay\",topCanPlayThrough:\"canplaythrough\",topChange:\"change\",topClick:\"click\",topClose:\"close\",topCompositionEnd:\"compositionend\",topCompositionStart:\"compositionstart\",topCompositionUpdate:\"compositionupdate\",topContextMenu:\"contextmenu\",topCopy:\"copy\",topCut:\"cut\",topDoubleClick:\"dblclick\",topDrag:\"drag\",topDragEnd:\"dragend\",topDragEnter:\"dragenter\",topDragExit:\"dragexit\",topDragLeave:\"dragleave\",topDragOver:\"dragover\",topDragStart:\"dragstart\",topDrop:\"drop\",topDurationChange:\"durationchange\",topEmptied:\"emptied\",topEncrypted:\"encrypted\",topEnded:\"ended\",topError:\"error\",topFocus:\"focus\",topInput:\"input\",topKeyDown:\"keydown\",topKeyPress:\"keypress\",topKeyUp:\"keyup\",topLoadedData:\"loadeddata\",topLoad:\"load\",topLoadedMetadata:\"loadedmetadata\",topLoadStart:\"loadstart\",topMouseDown:\"mousedown\",topMouseMove:\"mousemove\",topMouseOut:\"mouseout\",topMouseOver:\"mouseover\",topMouseUp:\"mouseup\",topPaste:\"paste\",topPause:\"pause\",topPlay:\"play\",topPlaying:\"playing\",topProgress:\"progress\",topRateChange:\"ratechange\",topScroll:\"scroll\",topSeeked:\"seeked\",topSeeking:\"seeking\",topSelectionChange:\"selectionchange\",topStalled:\"stalled\",topSuspend:\"suspend\",topTextInput:\"textInput\",topTimeUpdate:\"timeupdate\",topToggle:\"toggle\",topTouchCancel:\"touchcancel\",topTouchEnd:\"touchend\",topTouchMove:\"touchmove\",topTouchStart:\"touchstart\",topTransitionEnd:Pe(\"transitionend\")||\"transitionend\",topVolumeChange:\"volumechange\",topWaiting:\"waiting\",topWheel:\"wheel\"},Yn={},Jn=0,Xn=\"_reactListenersID\"+(\"\"+Math.random()).slice(2),Zn=Au.canUseDOM&&\"documentMode\"in document&&11>=document.documentMode,er={select:{phasedRegistrationNames:{bubbled:\"onSelect\",captured:\"onSelectCapture\"},dependencies:\"topBlur topContextMenu topFocus topKeyDown topKeyUp topMouseDown topMouseUp topSelectionChange\".split(\" \")}},tr=null,ur=null,nr=null,rr=!1,or={eventTypes:er,extractEvents:function(e,t,u,n){var r,o=n.window===n?n.document:9===n.nodeType?n:n.ownerDocument;if(!(r=!o)){e:{o=Ie(o),r=Qu.onSelect;for(var a=0;a<r.length;a++){var i=r[a];if(!o.hasOwnProperty(i)||!o[i]){o=!1;break e}}o=!0}r=!o}if(r)return null;switch(o=t?B(t):window,e){case\"topFocus\":(ee(o)||\"true\"===o.contentEditable)&&(tr=o,ur=t,nr=null);break;case\"topBlur\":nr=ur=tr=null;break;case\"topMouseDown\":rr=!0;break;case\"topContextMenu\":case\"topMouseUp\":return rr=!1,Ue(u,n);case\"topSelectionChange\":if(Zn)break;case\"topKeyDown\":case\"topKeyUp\":return Ue(u,n)}return null}};U.augmentClass(Me,{animationName:null,elapsedTime:null,pseudoElement:null}),U.augmentClass(je,{clipboardData:function(e){return\"clipboardData\"in e?e.clipboardData:window.clipboardData}}),ge.augmentClass(He,{relatedTarget:null});var ar={Esc:\"Escape\",Spacebar:\" \",Left:\"ArrowLeft\",Up:\"ArrowUp\",Right:\"ArrowRight\",Down:\"ArrowDown\",Del:\"Delete\",Win:\"OS\",Menu:\"ContextMenu\",Apps:\"ContextMenu\",Scroll:\"ScrollLock\",MozPrintableKey:\"Unidentified\"},ir={8:\"Backspace\",9:\"Tab\",12:\"Clear\",13:\"Enter\",16:\"Shift\",17:\"Control\",18:\"Alt\",19:\"Pause\",20:\"CapsLock\",27:\"Escape\",32:\" \",33:\"PageUp\",34:\"PageDown\",35:\"End\",36:\"Home\",37:\"ArrowLeft\",38:\"ArrowUp\",39:\"ArrowRight\",40:\"ArrowDown\",45:\"Insert\",46:\"Delete\",112:\"F1\",113:\"F2\",114:\"F3\",115:\"F4\",116:\"F5\",117:\"F6\",118:\"F7\",119:\"F8\",120:\"F9\",121:\"F10\",122:\"F11\",123:\"F12\",144:\"NumLock\",145:\"ScrollLock\",224:\"Meta\"};ge.augmentClass(ze,{key:function(e){if(e.key){var t=ar[e.key]||e.key;if(\"Unidentified\"!==t)return t}return\"keypress\"===e.type?(e=Ve(e),13===e?\"Enter\":String.fromCharCode(e)):\"keydown\"===e.type||\"keyup\"===e.type?ir[e.keyCode]||\"Unidentified\":\"\"},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:Ae,charCode:function(e){return\"keypress\"===e.type?Ve(e):0},keyCode:function(e){return\"keydown\"===e.type||\"keyup\"===e.type?e.keyCode:0},which:function(e){return\"keypress\"===e.type?Ve(e):\"keydown\"===e.type||\"keyup\"===e.type?e.keyCode:0}}),Ee.augmentClass(We,{dataTransfer:null}),ge.augmentClass(Ke,{touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:Ae}),U.augmentClass(Ge,{propertyName:null,elapsedTime:null,pseudoElement:null}),Ee.augmentClass($e,{deltaX:function(e){return\"deltaX\"in e?e.deltaX:\"wheelDeltaX\"in e?-e.wheelDeltaX:0},deltaY:function(e){return\"deltaY\"in e?e.deltaY:\"wheelDeltaY\"in e?-e.wheelDeltaY:\"wheelDelta\"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null});var lr={},cr={};\"abort animationEnd animationIteration animationStart blur cancel canPlay canPlayThrough click close contextMenu copy cut doubleClick drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error focus input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing progress rateChange reset scroll seeked seeking stalled submit suspend timeUpdate toggle touchCancel touchEnd touchMove touchStart transitionEnd volumeChange waiting wheel\".split(\" \").forEach(function(e){var t=e[0].toUpperCase()+e.slice(1),u=\"on\"+t;t=\"top\"+t,u={phasedRegistrationNames:{bubbled:u,captured:u+\"Capture\"},dependencies:[t]},lr[e]=u,cr[t]=u});var sr={eventTypes:lr,extractEvents:function(e,t,u,n){var r=cr[e];if(!r)return null;switch(e){case\"topKeyPress\":if(0===Ve(u))return null;case\"topKeyDown\":case\"topKeyUp\":e=ze;break;case\"topBlur\":case\"topFocus\":e=He;break;case\"topClick\":if(2===u.button)return null;case\"topDoubleClick\":case\"topMouseDown\":case\"topMouseMove\":case\"topMouseUp\":case\"topMouseOut\":case\"topMouseOver\":case\"topContextMenu\":e=Ee;break;case\"topDrag\":case\"topDragEnd\":case\"topDragEnter\":case\"topDragExit\":case\"topDragLeave\":case\"topDragOver\":case\"topDragStart\":case\"topDrop\":e=We;break;case\"topTouchCancel\":case\"topTouchEnd\":case\"topTouchMove\":case\"topTouchStart\":e=Ke;break;case\"topAnimationEnd\":case\"topAnimationIteration\":case\"topAnimationStart\":e=Me;break;case\"topTransitionEnd\":e=Ge;break;case\"topScroll\":e=ge;break;case\"topWheel\":e=$e;break;case\"topCopy\":case\"topCut\":case\"topPaste\":e=je;break;default:e=U}return t=e.getPooled(r,t,u,n),P(t),t}};zn=function(e,t,u,n){e=F(e,t,u,n),y(e),b(!1)},tn.injectEventPluginOrder(\"ResponderEventPlugin SimpleEventPlugin TapEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin\".split(\" \")),Ju=an.getFiberCurrentPropsFromNode,Xu=an.getInstanceFromNode,Zu=an.getNodeFromInstance,tn.injectEventPluginsByName({SimpleEventPlugin:sr,EnterLeaveEventPlugin:Mn,ChangeEventPlugin:Ln,SelectEventPlugin:or,BeforeInputEventPlugin:Bn});var fr=[],pr=-1;new Set;var dr={current:xu},Dr={current:!1},hr=xu,mr=null,gr=null,Cr=\"function\"===typeof Symbol&&Symbol.for,Ar=Cr?Symbol.for(\"react.element\"):60103,Er=Cr?Symbol.for(\"react.call\"):60104,Fr=Cr?Symbol.for(\"react.return\"):60105,yr=Cr?Symbol.for(\"react.portal\"):60106,br=Cr?Symbol.for(\"react.fragment\"):60107,vr=\"function\"===typeof Symbol&&Symbol.iterator,Br=Array.isArray,wr=xt(!0),xr=xt(!1),kr={},Tr=Object.freeze({default:Pt}),Sr=Tr&&Pt||Tr,_r=Sr.default?Sr.default:Sr,Nr=\"object\"===typeof performance&&\"function\"===typeof performance.now,Or=void 0;Or=Nr?function(){return performance.now()}:function(){return Date.now()};var Pr=void 0,Ir=void 0;if(Au.canUseDOM)if(\"function\"!==typeof requestIdleCallback||\"function\"!==typeof cancelIdleCallback){var Rr,Lr=null,qr=!1,Ur=-1,Mr=!1,jr=0,Hr=33,Vr=33;Rr=Nr?{didTimeout:!1,timeRemaining:function(){var e=jr-performance.now();return 0<e?e:0}}:{didTimeout:!1,timeRemaining:function(){var e=jr-Date.now();return 0<e?e:0}};var zr=\"__reactIdleCallback$\"+Math.random().toString(36).slice(2);window.addEventListener(\"message\",function(e){if(e.source===window&&e.data===zr){if(qr=!1,e=Or(),0>=jr-e){if(!(-1!==Ur&&Ur<=e))return void(Mr||(Mr=!0,requestAnimationFrame(Wr)));Rr.didTimeout=!0}else Rr.didTimeout=!1;Ur=-1,e=Lr,Lr=null,null!==e&&e(Rr)}},!1);var Wr=function(e){Mr=!1;var t=e-jr+Vr;t<Vr&&Hr<Vr?(8>t&&(t=8),Vr=t<Hr?Hr:t):Hr=t,jr=e+Vr,qr||(qr=!0,window.postMessage(zr,\"*\"))};Pr=function(e,t){return Lr=e,null!=t&&\"number\"===typeof t.timeout&&(Ur=Or()+t.timeout),Mr||(Mr=!0,requestAnimationFrame(Wr)),0},Ir=function(){Lr=null,qr=!1,Ur=-1}}else Pr=window.requestIdleCallback,Ir=window.cancelIdleCallback;else Pr=function(e){return setTimeout(function(){e({timeRemaining:function(){return 1/0}})})},Ir=function(e){clearTimeout(e)};var Kr=/^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$/,Gr={},$r={},Qr={html:\"http://www.w3.org/1999/xhtml\",mathml:\"http://www.w3.org/1998/Math/MathML\",svg:\"http://www.w3.org/2000/svg\"},Yr=void 0,Jr=function(e){return\"undefined\"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,u,n,r){MSApp.execUnsafeLocalFunction(function(){return e(t,u)})}:e}(function(e,t){if(e.namespaceURI!==Qr.svg||\"innerHTML\"in e)e.innerHTML=t;else{for(Yr=Yr||document.createElement(\"div\"),Yr.innerHTML=\"<svg>\"+t+\"</svg>\",t=Yr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}}),Xr={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Zr=[\"Webkit\",\"ms\",\"Moz\",\"O\"];Object.keys(Xr).forEach(function(e){Zr.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Xr[t]=Xr[e]})});var eo=Eu({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0}),to=Qr.html,uo=Fu.thatReturns(\"\"),no={topAbort:\"abort\",topCanPlay:\"canplay\",topCanPlayThrough:\"canplaythrough\",topDurationChange:\"durationchange\",topEmptied:\"emptied\",topEncrypted:\"encrypted\",topEnded:\"ended\",topError:\"error\",topLoadedData:\"loadeddata\",topLoadedMetadata:\"loadedmetadata\",topLoadStart:\"loadstart\",topPause:\"pause\",topPlay:\"play\",topPlaying:\"playing\",topProgress:\"progress\",topRateChange:\"ratechange\",topSeeked:\"seeked\",topSeeking:\"seeking\",topStalled:\"stalled\",topSuspend:\"suspend\",topTimeUpdate:\"timeupdate\",topVolumeChange:\"volumechange\",topWaiting:\"waiting\"},ro=Object.freeze({createElement:au,createTextNode:iu,setInitialProperties:lu,diffProperties:cu,updateProperties:su,diffHydratedProperties:fu,diffHydratedText:pu,warnForUnmatchedText:function(){},warnForDeletedHydratableElement:function(){},warnForDeletedHydratableText:function(){},warnForInsertedHydratedElement:function(){},warnForInsertedHydratedText:function(){},restoreControlledState:function(e,t,u){switch(t){case\"input\":if(Vt(e,u),t=u.name,\"radio\"===u.type&&null!=t){for(u=e;u.parentNode;)u=u.parentNode;for(u=u.querySelectorAll(\"input[name=\"+JSON.stringify(\"\"+t)+'][type=\"radio\"]'),t=0;t<u.length;t++){var r=u[t];if(r!==e&&r.form===e.form){var o=w(r);o||n(\"90\"),ae(r),Vt(r,o)}}}break;case\"textarea\":Jt(e,u);break;case\"select\":null!=(t=u.value)&&Gt(e,!!u.multiple,t,!1)}}});Tn.injectFiberControlledHostComponent(ro);var oo=null,ao=null,io=_r({getRootHostContext:function(e){var t=e.nodeType;switch(t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:eu(null,\"\");break;default:t=8===t?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=eu(e,t)}return e},getChildHostContext:function(e,t){return eu(e,t)},getPublicInstance:function(e){return e},prepareForCommit:function(){oo=Vn;var e=bu();if(qe(e)){if(\"selectionStart\"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{var u=window.getSelection&&window.getSelection();if(u&&0!==u.rangeCount){t=u.anchorNode;var n=u.anchorOffset,r=u.focusNode;u=u.focusOffset;try{t.nodeType,r.nodeType}catch(e){t=null;break e}var o=0,a=-1,i=-1,l=0,c=0,s=e,f=null;t:for(;;){for(var p;s!==t||0!==n&&3!==s.nodeType||(a=o+n),s!==r||0!==u&&3!==s.nodeType||(i=o+u),3===s.nodeType&&(o+=s.nodeValue.length),null!==(p=s.firstChild);)f=s,s=p;for(;;){if(s===e)break t;if(f===t&&++l===n&&(a=o),f===r&&++c===u&&(i=o),null!==(p=s.nextSibling))break;s=f,f=s.parentNode}s=p}t=-1===a||-1===i?null:{start:a,end:i}}else t=null}t=t||{start:0,end:0}}else t=null;ao={focusedElem:e,selectionRange:t},Te(!1)},resetAfterCommit:function(){var e=ao,t=bu(),u=e.focusedElem,n=e.selectionRange;if(t!==u&&Bu(document.documentElement,u)){if(qe(u))if(t=n.start,e=n.end,void 0===e&&(e=t),\"selectionStart\"in u)u.selectionStart=t,u.selectionEnd=Math.min(e,u.value.length);else if(window.getSelection){t=window.getSelection();var r=u[R()].length;e=Math.min(n.start,r),n=void 0===n.end?e:Math.min(n.end,r),!t.extend&&e>n&&(r=n,n=e,e=r),r=Le(u,e);var o=Le(u,n);if(r&&o&&(1!==t.rangeCount||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)){var a=document.createRange();a.setStart(r.node,r.offset),t.removeAllRanges(),e>n?(t.addRange(a),t.extend(o.node,o.offset)):(a.setEnd(o.node,o.offset),t.addRange(a))}}for(t=[],e=u;e=e.parentNode;)1===e.nodeType&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(wu(u),u=0;u<t.length;u++)e=t[u],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}ao=null,Te(oo),oo=null},createInstance:function(e,t,u,n,r){return e=au(e,t,u,n),e[rn]=r,e[on]=t,e},appendInitialChild:function(e,t){e.appendChild(t)},finalizeInitialChildren:function(e,t,u,n){lu(e,t,u,n);e:{switch(t){case\"button\":case\"input\":case\"select\":case\"textarea\":e=!!u.autoFocus;break e}e=!1}return e},prepareUpdate:function(e,t,u,n,r){return cu(e,t,u,n,r)},shouldSetTextContent:function(e,t){return\"textarea\"===e||\"string\"===typeof t.children||\"number\"===typeof t.children||\"object\"===typeof t.dangerouslySetInnerHTML&&null!==t.dangerouslySetInnerHTML&&\"string\"===typeof t.dangerouslySetInnerHTML.__html},shouldDeprioritizeSubtree:function(e,t){return!!t.hidden},createTextInstance:function(e,t,u,n){return e=iu(e,t),e[rn]=n,e},now:Or,mutation:{commitMount:function(e){e.focus()},commitUpdate:function(e,t,u,n,r){e[on]=r,su(e,t,u,n,r)},resetTextContent:function(e){e.textContent=\"\"},commitTextUpdate:function(e,t,u){e.nodeValue=u},appendChild:function(e,t){e.appendChild(t)},appendChildToContainer:function(e,t){8===e.nodeType?e.parentNode.insertBefore(t,e):e.appendChild(t)},insertBefore:function(e,t,u){e.insertBefore(t,u)},insertInContainerBefore:function(e,t,u){8===e.nodeType?e.parentNode.insertBefore(t,u):e.insertBefore(t,u)},removeChild:function(e,t){e.removeChild(t)},removeChildFromContainer:function(e,t){8===e.nodeType?e.parentNode.removeChild(t):e.removeChild(t)}},hydration:{canHydrateInstance:function(e,t){return 1!==e.nodeType||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e},canHydrateTextInstance:function(e,t){return\"\"===t||3!==e.nodeType?null:e},getNextHydratableSibling:function(e){for(e=e.nextSibling;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e},getFirstHydratableChild:function(e){for(e=e.firstChild;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e},hydrateInstance:function(e,t,u,n,r,o){return e[rn]=o,e[on]=u,fu(e,t,u,r,n)},hydrateTextInstance:function(e,t,u){return e[rn]=u,pu(e,t)},didNotMatchHydratedContainerTextInstance:function(){},didNotMatchHydratedTextInstance:function(){},didNotHydrateContainerInstance:function(){},didNotHydrateInstance:function(){},didNotFindHydratableContainerInstance:function(){},didNotFindHydratableContainerTextInstance:function(){},didNotFindHydratableInstance:function(){},didNotFindHydratableTextInstance:function(){}},scheduleDeferredCallback:Pr,cancelDeferredCallback:Ir,useSyncScheduling:!0});X=io.batchedUpdates,gu.prototype.render=function(e,t){io.updateContainer(e,this._reactRootContainer,null,t)},gu.prototype.unmount=function(e){io.updateContainer(null,this._reactRootContainer,null,e)};var lo={createPortal:mu,findDOMNode:function(e){if(null==e)return null;if(1===e.nodeType)return e;var t=e._reactInternalFiber;if(t)return io.findHostInstance(t);\"function\"===typeof e.render?n(\"188\"):n(\"213\",Object.keys(e))},hydrate:function(e,t,u){return hu(null,e,t,!0,u)},render:function(e,t,u){return hu(null,e,t,!1,u)},unstable_renderSubtreeIntoContainer:function(e,t,u,r){return(null==e||void 0===e._reactInternalFiber)&&n(\"38\"),hu(e,t,u,!1,r)},unmountComponentAtNode:function(e){return du(e)||n(\"40\"),!!e._reactRootContainer&&(io.unbatchedUpdates(function(){hu(null,null,e,!1,function(){e._reactRootContainer=null})}),!0)},unstable_createPortal:mu,unstable_batchedUpdates:Z,unstable_deferredUpdates:io.deferredUpdates,flushSync:io.flushSync,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{EventPluginHub:un,EventPluginRegistry:Yu,EventPropagators:ln,ReactControlledComponent:Sn,ReactDOMComponentTree:an,ReactDOMEventListener:Wn}};io.injectIntoDevTools({findFiberByHostInstance:v,bundleType:0,version:\"16.2.0\",rendererPackageName:\"react-dom\"});var co=Object.freeze({default:lo}),so=co&&lo||co;e.exports=so.default?so.default:so},function(e,t,u){\"use strict\";var n=!(\"undefined\"===typeof window||!window.document||!window.document.createElement),r={canUseDOM:n,canUseWorkers:\"undefined\"!==typeof Worker,canUseEventListeners:n&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:n&&!!window.screen,isInWorker:!n};e.exports=r},function(e,t,u){\"use strict\";var n=u(3),r={listen:function(e,t,u){return e.addEventListener?(e.addEventListener(t,u,!1),{remove:function(){e.removeEventListener(t,u,!1)}}):e.attachEvent?(e.attachEvent(\"on\"+t,u),{remove:function(){e.detachEvent(\"on\"+t,u)}}):void 0},capture:function(e,t,u){return e.addEventListener?(e.addEventListener(t,u,!0),{remove:function(){e.removeEventListener(t,u,!0)}}):{remove:n}},registerDefault:function(){}};e.exports=r},function(e,t,u){\"use strict\";function n(e){if(\"undefined\"===typeof(e=e||(\"undefined\"!==typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}e.exports=n},function(e,t,u){\"use strict\";function n(e,t){return e===t?0!==e||0!==t||1/e===1/t:e!==e&&t!==t}function r(e,t){if(n(e,t))return!0;if(\"object\"!==typeof e||null===e||\"object\"!==typeof t||null===t)return!1;var u=Object.keys(e),r=Object.keys(t);if(u.length!==r.length)return!1;for(var a=0;a<u.length;a++)if(!o.call(t,u[a])||!n(e[u[a]],t[u[a]]))return!1;return!0}var o=Object.prototype.hasOwnProperty;e.exports=r},function(e,t,u){\"use strict\";function n(e,t){return!(!e||!t)&&(e===t||!r(e)&&(r(t)?n(e,t.parentNode):\"contains\"in e?e.contains(t):!!e.compareDocumentPosition&&!!(16&e.compareDocumentPosition(t))))}var r=u(31);e.exports=n},function(e,t,u){\"use strict\";function n(e){return r(e)&&3==e.nodeType}var r=u(32);e.exports=n},function(e,t,u){\"use strict\";function n(e){var t=e?e.ownerDocument||e:document,u=t.defaultView||window;return!(!e||!(\"function\"===typeof u.Node?e instanceof u.Node:\"object\"===typeof e&&\"number\"===typeof e.nodeType&&\"string\"===typeof e.nodeName))}e.exports=n},function(e,t,u){\"use strict\";function n(e){try{e.focus()}catch(e){}}e.exports=n},function(e,t,u){\"use strict\";function n(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}function r(e,t){if(!e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!t||\"object\"!==typeof t&&\"function\"!==typeof t?e:t}function o(e,t){if(\"function\"!==typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=u(0),i=u.n(a),l=u(6),c=u(7),s=u(8),f=u(9),p=u(10),d=u(38),D=function(){function e(e,t){for(var u=0;u<t.length;u++){var n=t[u];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,u,n){return u&&e(t.prototype,u),n&&e(t,n),t}}(),h={cursor:\"pointer\"},m=function(e){function t(){return n(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),D(t,[{key:\"render\",value:function(){var e=this.props,t=e.error,u=e.editorHandler,n=Object(d.a)(t),r=null!==n&&null!==u;return i.a.createElement(l.a,null,i.a.createElement(s.a,{headerText:\"Failed to compile\"}),i.a.createElement(\"a\",{onClick:r&&n?function(){return u(n)}:null,style:r?h:null},i.a.createElement(f.a,{main:!0,codeHTML:Object(p.a)(t)})),i.a.createElement(c.a,{line1:\"This error occurred during the build time and cannot be dismissed.\"}))}}]),t}(a.PureComponent);t.a=m},function(e,t,u){e.exports={XmlEntities:u(36),Html4Entities:u(37),Html5Entities:u(12),AllHtmlEntities:u(12)}},function(e,t){function u(){}var n={\"&lt\":\"<\",\"&gt\":\">\",\"&quot\":'\"',\"&apos\":\"'\",\"&amp\":\"&\",\"&lt;\":\"<\",\"&gt;\":\">\",\"&quot;\":'\"',\"&apos;\":\"'\",\"&amp;\":\"&\"},r={60:\"lt\",62:\"gt\",34:\"quot\",39:\"apos\",38:\"amp\"},o={\"<\":\"&lt;\",\">\":\"&gt;\",'\"':\"&quot;\",\"'\":\"&apos;\",\"&\":\"&amp;\"};u.prototype.encode=function(e){return e&&e.length?e.replace(/<|>|\"|'|&/g,function(e){return o[e]}):\"\"},u.encode=function(e){return(new u).encode(e)},u.prototype.decode=function(e){return e&&e.length?e.replace(/&#?[0-9a-zA-Z]+;?/g,function(e){if(\"#\"===e.charAt(1)){var t=\"x\"===e.charAt(2).toLowerCase()?parseInt(e.substr(3),16):parseInt(e.substr(2));return isNaN(t)||t<-32768||t>65535?\"\":String.fromCharCode(t)}return n[e]||e}):\"\"},u.decode=function(e){return(new u).decode(e)},u.prototype.encodeNonUTF=function(e){if(!e||!e.length)return\"\";for(var t=e.length,u=\"\",n=0;n<t;){var o=e.charCodeAt(n),a=r[o];a?(u+=\"&\"+a+\";\",n++):(u+=o<32||o>126?\"&#\"+o+\";\":e.charAt(n),n++)}return u},u.encodeNonUTF=function(e){return(new u).encodeNonUTF(e)},u.prototype.encodeNonASCII=function(e){if(!e||!e.length)return\"\";for(var t=e.length,u=\"\",n=0;n<t;){var r=e.charCodeAt(n);r<=255?u+=e[n++]:(u+=\"&#\"+r+\";\",n++)}return u},u.encodeNonASCII=function(e){return(new u).encodeNonASCII(e)},e.exports=u},function(e,t){function u(){}for(var n=[\"apos\",\"nbsp\",\"iexcl\",\"cent\",\"pound\",\"curren\",\"yen\",\"brvbar\",\"sect\",\"uml\",\"copy\",\"ordf\",\"laquo\",\"not\",\"shy\",\"reg\",\"macr\",\"deg\",\"plusmn\",\"sup2\",\"sup3\",\"acute\",\"micro\",\"para\",\"middot\",\"cedil\",\"sup1\",\"ordm\",\"raquo\",\"frac14\",\"frac12\",\"frac34\",\"iquest\",\"Agrave\",\"Aacute\",\"Acirc\",\"Atilde\",\"Auml\",\"Aring\",\"Aelig\",\"Ccedil\",\"Egrave\",\"Eacute\",\"Ecirc\",\"Euml\",\"Igrave\",\"Iacute\",\"Icirc\",\"Iuml\",\"ETH\",\"Ntilde\",\"Ograve\",\"Oacute\",\"Ocirc\",\"Otilde\",\"Ouml\",\"times\",\"Oslash\",\"Ugrave\",\"Uacute\",\"Ucirc\",\"Uuml\",\"Yacute\",\"THORN\",\"szlig\",\"agrave\",\"aacute\",\"acirc\",\"atilde\",\"auml\",\"aring\",\"aelig\",\"ccedil\",\"egrave\",\"eacute\",\"ecirc\",\"euml\",\"igrave\",\"iacute\",\"icirc\",\"iuml\",\"eth\",\"ntilde\",\"ograve\",\"oacute\",\"ocirc\",\"otilde\",\"ouml\",\"divide\",\"oslash\",\"ugrave\",\"uacute\",\"ucirc\",\"uuml\",\"yacute\",\"thorn\",\"yuml\",\"quot\",\"amp\",\"lt\",\"gt\",\"OElig\",\"oelig\",\"Scaron\",\"scaron\",\"Yuml\",\"circ\",\"tilde\",\"ensp\",\"emsp\",\"thinsp\",\"zwnj\",\"zwj\",\"lrm\",\"rlm\",\"ndash\",\"mdash\",\"lsquo\",\"rsquo\",\"sbquo\",\"ldquo\",\"rdquo\",\"bdquo\",\"dagger\",\"Dagger\",\"permil\",\"lsaquo\",\"rsaquo\",\"euro\",\"fnof\",\"Alpha\",\"Beta\",\"Gamma\",\"Delta\",\"Epsilon\",\"Zeta\",\"Eta\",\"Theta\",\"Iota\",\"Kappa\",\"Lambda\",\"Mu\",\"Nu\",\"Xi\",\"Omicron\",\"Pi\",\"Rho\",\"Sigma\",\"Tau\",\"Upsilon\",\"Phi\",\"Chi\",\"Psi\",\"Omega\",\"alpha\",\"beta\",\"gamma\",\"delta\",\"epsilon\",\"zeta\",\"eta\",\"theta\",\"iota\",\"kappa\",\"lambda\",\"mu\",\"nu\",\"xi\",\"omicron\",\"pi\",\"rho\",\"sigmaf\",\"sigma\",\"tau\",\"upsilon\",\"phi\",\"chi\",\"psi\",\"omega\",\"thetasym\",\"upsih\",\"piv\",\"bull\",\"hellip\",\"prime\",\"Prime\",\"oline\",\"frasl\",\"weierp\",\"image\",\"real\",\"trade\",\"alefsym\",\"larr\",\"uarr\",\"rarr\",\"darr\",\"harr\",\"crarr\",\"lArr\",\"uArr\",\"rArr\",\"dArr\",\"hArr\",\"forall\",\"part\",\"exist\",\"empty\",\"nabla\",\"isin\",\"notin\",\"ni\",\"prod\",\"sum\",\"minus\",\"lowast\",\"radic\",\"prop\",\"infin\",\"ang\",\"and\",\"or\",\"cap\",\"cup\",\"int\",\"there4\",\"sim\",\"cong\",\"asymp\",\"ne\",\"equiv\",\"le\",\"ge\",\"sub\",\"sup\",\"nsub\",\"sube\",\"supe\",\"oplus\",\"otimes\",\"perp\",\"sdot\",\"lceil\",\"rceil\",\"lfloor\",\"rfloor\",\"lang\",\"rang\",\"loz\",\"spades\",\"clubs\",\"hearts\",\"diams\"],r=[39,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,34,38,60,62,338,339,352,353,376,710,732,8194,8195,8201,8204,8205,8206,8207,8211,8212,8216,8217,8218,8220,8221,8222,8224,8225,8240,8249,8250,8364,402,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,931,932,933,934,935,936,937,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,977,978,982,8226,8230,8242,8243,8254,8260,8472,8465,8476,8482,8501,8592,8593,8594,8595,8596,8629,8656,8657,8658,8659,8660,8704,8706,8707,8709,8711,8712,8713,8715,8719,8721,8722,8727,8730,8733,8734,8736,8743,8744,8745,8746,8747,8756,8764,8773,8776,8800,8801,8804,8805,8834,8835,8836,8838,8839,8853,8855,8869,8901,8968,8969,8970,8971,9001,9002,9674,9824,9827,9829,9830],o={},a={},i=0,l=n.length;i<l;){var c=n[i],s=r[i];o[c]=String.fromCharCode(s),a[s]=c,i++}u.prototype.decode=function(e){return e&&e.length?e.replace(/&(#?[\\w\\d]+);?/g,function(e,t){var u;if(\"#\"===t.charAt(0)){var n=\"x\"===t.charAt(1).toLowerCase()?parseInt(t.substr(2),16):parseInt(t.substr(1));isNaN(n)||n<-32768||n>65535||(u=String.fromCharCode(n))}else u=o[t];return u||e}):\"\"},u.decode=function(e){return(new u).decode(e)},u.prototype.encode=function(e){if(!e||!e.length)return\"\";for(var t=e.length,u=\"\",n=0;n<t;){var r=a[e.charCodeAt(n)];u+=r?\"&\"+r+\";\":e.charAt(n),n++}return u},u.encode=function(e){return(new u).encode(e)},u.prototype.encodeNonUTF=function(e){if(!e||!e.length)return\"\";for(var t=e.length,u=\"\",n=0;n<t;){var r=e.charCodeAt(n),o=a[r];u+=o?\"&\"+o+\";\":r<32||r>126?\"&#\"+r+\";\":e.charAt(n),n++}return u},u.encodeNonUTF=function(e){return(new u).encodeNonUTF(e)},u.prototype.encodeNonASCII=function(e){if(!e||!e.length)return\"\";for(var t=e.length,u=\"\",n=0;n<t;){var r=e.charCodeAt(n);r<=255?u+=e[n++]:(u+=\"&#\"+r+\";\",n++)}return u},u.encodeNonASCII=function(e){return(new u).encodeNonASCII(e)},e.exports=u},function(e,t,u){\"use strict\";function n(e){for(var t=e.split(\"\\n\"),u=\"\",n=0,r=0,l=0;l<t.length;l++){var c=o.a.ansiToText(t[l]).trim();if(c){!u&&c.match(a)&&(u=c);for(var s=0;s<i.length;){var f=c.match(i[s]);if(f){n=parseInt(f[1],10),r=parseInt(f[2],10)+1||1;break}s++}if(u&&n)break}}return u&&n?{fileName:u,lineNumber:n,colNumber:r}:null}var r=u(11),o=u.n(r),a=/^\\.(\\/[^\\/\\n ]+)+\\.[^\\/\\n ]+$/,i=[/^.*\\((\\d+):(\\d+)\\)$/,/^Line (\\d+):.+$/];t.a=n},function(e,t,u){\"use strict\";function n(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}function r(e,t){if(!e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!t||\"object\"!==typeof t&&\"function\"!==typeof t?e:t}function o(e,t){if(\"function\"!==typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=u(0),i=u.n(a),l=u(6),c=u(40),s=u(41),f=u(42),p=u(7),d=function(){function e(e,t){for(var u=0;u<t.length;u++){var n=t[u];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,u,n){return u&&e(t.prototype,u),n&&e(t,n),t}}(),D=function(e){function t(){var e,u,o,a;n(this,t);for(var i=arguments.length,l=Array(i),c=0;c<i;c++)l[c]=arguments[c];return u=o=r(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),o.state={currentIndex:0},o.previous=function(){o.setState(function(e,t){return{currentIndex:e.currentIndex>0?e.currentIndex-1:t.errorRecords.length-1}})},o.next=function(){o.setState(function(e,t){return{currentIndex:e.currentIndex<t.errorRecords.length-1?e.currentIndex+1:0}})},o.shortcutHandler=function(e){\"Escape\"===e?o.props.close():\"ArrowLeft\"===e?o.previous():\"ArrowRight\"===e&&o.next()},a=u,r(o,a)}return o(t,e),d(t,[{key:\"render\",value:function(){var e=this.props,t=e.errorRecords,u=e.close,n=t.length;return i.a.createElement(l.a,{shortcutHandler:this.shortcutHandler},i.a.createElement(c.a,{close:u}),n>1&&i.a.createElement(s.a,{currentError:this.state.currentIndex+1,totalErrors:n,previous:this.previous,next:this.next}),i.a.createElement(f.a,{errorRecord:t[this.state.currentIndex],editorHandler:this.props.editorHandler}),i.a.createElement(p.a,{line1:\"This screen is visible only in development. It will not appear if the app crashes in production.\",line2:\"Open your browser’s developer console to further inspect this error.\"}))}}]),t}(a.PureComponent);t.a=D},function(e,t,u){\"use strict\";function n(e){var t=e.close;return o.a.createElement(\"span\",{title:\"Click or press Escape to dismiss.\",onClick:t,style:i},\"×\")}var r=u(0),o=u.n(r),a=u(1),i={color:a.a,lineHeight:\"1rem\",fontSize:\"1.5rem\",padding:\"1rem\",cursor:\"pointer\",position:\"absolute\",right:0,top:0};t.a=n},function(e,t,u){\"use strict\";function n(e){var t=e.currentError,u=e.totalErrors,n=e.previous,r=e.next;return o.a.createElement(\"div\",{style:i},o.a.createElement(\"span\",{style:l},o.a.createElement(\"button\",{onClick:n,style:s},\"←\"),o.a.createElement(\"button\",{onClick:r,style:f},\"→\")),t+\" of \"+u+\" errors on the page\")}var r=u(0),o=u.n(r),a=u(1),i={marginBottom:\"0.5rem\"},l={marginRight:\"1em\"},c={backgroundColor:a.f,color:a.e,border:\"none\",borderRadius:\"4px\",padding:\"3px 6px\",cursor:\"pointer\"},s=Object.assign({},c,{borderTopRightRadius:\"0px\",borderBottomRightRadius:\"0px\",marginRight:\"1px\"}),f=Object.assign({},c,{borderTopLeftRadius:\"0px\",borderBottomLeftRadius:\"0px\"});t.a=n},function(e,t,u){\"use strict\";function n(e){var t=e.errorRecord,u=e.editorHandler,n=t.error,r=t.unhandledRejection,c=t.contextSize,s=t.stackFrames,f=r?\"Unhandled Rejection (\"+n.name+\")\":n.name,p=n.message,d=p.match(/^\\w*:/)||!f?p:f+\": \"+p;return d=d.replace(/^Invariant Violation:\\s*/,\"\").replace(/^Warning:\\s*/,\"\").replace(\" Check the render method\",\"\\n\\nCheck the render method\").replace(\" Check your code at\",\"\\n\\nCheck your code at\"),o.a.createElement(\"div\",{style:l},o.a.createElement(a.a,{headerText:d}),o.a.createElement(i.a,{stackFrames:s,errorName:f,contextSize:c,editorHandler:u}))}var r=u(0),o=u.n(r),a=u(8),i=u(43),l={display:\"flex\",flexDirection:\"column\"};t.a=n},function(e,t,u){\"use strict\";function n(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}function r(e,t){if(!e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!t||\"object\"!==typeof t&&\"function\"!==typeof t?e:t}function o(e,t){if(\"function\"!==typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=u(0),i=u.n(a),l=u(44),c=u(60),s=u(61),f=u(62),p=function(){function e(e,t){for(var u=0;u<t.length;u++){var n=t[u];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,u,n){return u&&e(t.prototype,u),n&&e(t,n),t}}(),d={fontSize:\"1em\",flex:\"0 1 auto\",minHeight:\"0px\",overflow:\"auto\"},D=function(e){function t(){return n(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),p(t,[{key:\"renderFrames\",value:function(){var e=this.props,t=e.stackFrames,u=e.errorName,n=e.contextSize,r=e.editorHandler,o=[],a=!1,p=[],d=0;return t.forEach(function(e,D){var h=e.fileName,m=e._originalFileName,g=Object(s.a)(m,h),C=!Object(f.a)(u),A=g&&(C||a);g||(a=!0);var E=i.a.createElement(l.a,{key:\"frame-\"+D,frame:e,contextSize:n,critical:0===D,showCode:!A,editorHandler:r}),F=D===t.length-1;A&&p.push(E),A&&!F||(1===p.length?o.push(p[0]):p.length>1&&(d++,o.push(i.a.createElement(c.a,{key:\"bundle-\"+d},p))),p=[]),A||o.push(E)}),o}},{key:\"render\",value:function(){return i.a.createElement(\"div\",{style:d},this.renderFrames())}}]),t}(a.Component);t.a=D},function(e,t,u){\"use strict\";function n(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}function r(e,t){if(!e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!t||\"object\"!==typeof t&&\"function\"!==typeof t?e:t}function o(e,t){if(\"function\"!==typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=u(0),i=u.n(a),l=u(45),c=u(59),s=u(1),f=function(){function e(e,t){for(var u=0;u<t.length;u++){var n=t[u];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,u,n){return u&&e(t.prototype,u),n&&e(t,n),t}}(),p={fontSize:\"0.9em\",marginBottom:\"0.9em\"},d={textDecoration:\"none\",color:s.b,cursor:\"pointer\"},D={cursor:\"pointer\"},h={marginBottom:\"1.5em\",color:s.b,cursor:\"pointer\",border:\"none\",display:\"block\",width:\"100%\",textAlign:\"left\",background:\"#fff\",fontFamily:\"Consolas, Menlo, monospace\",fontSize:\"1em\",padding:\"0px\",lineHeight:\"1.5\"},m=function(e){function t(){var e,u,o,a;n(this,t);for(var i=arguments.length,l=Array(i),c=0;c<i;c++)l[c]=arguments[c];return u=o=r(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),o.state={compiled:!1},o.toggleCompiled=function(){o.setState(function(e){return{compiled:!e.compiled}})},o.editorHandler=function(){var e=o.getErrorLocation();e&&o.props.editorHandler(e)},o.onKeyDown=function(e){\"Enter\"===e.key&&o.editorHandler()},a=u,r(o,a)}return o(t,e),f(t,[{key:\"getErrorLocation\",value:function(){var e=this.props.frame,t=e._originalFileName,u=e._originalLineNumber;return t?-1!==t.trim().indexOf(\" \")?null:{fileName:t,lineNumber:u||1}:null}},{key:\"render\",value:function(){var e=this.props,t=e.frame,u=e.contextSize,n=e.critical,r=e.showCode,o=t.fileName,a=t.lineNumber,s=t.columnNumber,f=t._scriptCode,m=t._originalFileName,g=t._originalLineNumber,C=t._originalColumnNumber,A=t._originalScriptCode,E=t.getFunctionName(),F=this.state.compiled,y=Object(c.a)(m,g,C,o,a,s,F),b=null;r&&(F&&f&&0!==f.length&&null!=a?b={lines:f,lineNum:a,columnNum:s,contextSize:u,main:n}:!F&&A&&0!==A.length&&null!=g&&(b={lines:A,lineNum:g,columnNum:C,contextSize:u,main:n}));var v=null!==this.getErrorLocation()&&null!==this.props.editorHandler;return i.a.createElement(\"div\",null,i.a.createElement(\"div\",null,E),i.a.createElement(\"div\",{style:p},i.a.createElement(\"a\",{style:v?d:null,onClick:v?this.editorHandler:null,onKeyDown:v?this.onKeyDown:null,tabIndex:v?\"0\":null},y)),b&&i.a.createElement(\"span\",null,i.a.createElement(\"a\",{onClick:v?this.editorHandler:null,style:v?D:null},i.a.createElement(l.a,b)),i.a.createElement(\"button\",{style:h,onClick:this.toggleCompiled},\"View \"+(F?\"source\":\"compiled\"))))}}]),t}(a.Component);t.a=m},function(e,t,u){\"use strict\";function n(e){var t=e.lines,u=e.lineNum,n=e.columnNum,r=e.contextSize,f=e.main,d=[],D=1/0;t.forEach(function(e){var t=e.content,u=t.match(/^\\s*/);\"\"!==t&&(D=u&&u[0]?Math.min(D,u[0].length):0)}),t.forEach(function(e){var t=e.content,u=e.lineNumber;isFinite(D)&&(t=t.substring(D)),d[u-1]=t});var h=p()(d.join(\"\\n\"),u,null==n?0:n-(isFinite(D)?D:0),{forceColor:!0,linesAbove:r,linesBelow:r}),m=Object(s.a)(h),g=document.createElement(\"code\");g.innerHTML=m,Object(l.a)(g);var C=g.childNodes;e:for(var A=0;A<C.length;++A)for(var E=C[A],F=E.childNodes,y=0;y<F.length;++y){var b=F[y],v=b.innerText;if(null!=v&&-1!==v.indexOf(\" \"+u+\" |\")){Object(i.a)(E,f?c.d:c.g);break e}}return o.a.createElement(a.a,{main:f,codeHTML:g.innerHTML})}var r=u(0),o=u.n(r),a=u(9),i=u(13),l=u(46),c=u(1),s=u(10),f=u(47),p=u.n(f);t.a=n},function(e,t,u){\"use strict\";function n(e,t){for(;null!=t&&\"br\"!==t.tagName.toLowerCase();)t=t.nextElementSibling;null!=t&&e.removeChild(t)}function r(e){for(var t=e.childNodes,u=0;u<t.length;++u){var r=t[u];if(\"span\"===r.tagName.toLowerCase()){var o=r.innerText;if(null!=o){\"|^\"===o.replace(/\\s/g,\"\")&&(r.style.position=\"absolute\",n(e,r))}}}}u.d(t,\"a\",function(){return r})},function(e,t,u){\"use strict\";function n(e){return e&&e.__esModule?e:{default:e}}function r(e){return{keyword:e.cyan,capitalized:e.yellow,jsx_tag:e.yellow,punctuator:e.yellow,number:e.magenta,string:e.green,regex:e.magenta,comment:e.grey,invalid:e.white.bgRed.bold,gutter:e.grey,marker:e.red.bold}}function o(e){var t=e.slice(-2),u=t[0],n=t[1],r=(0,i.matchToToken)(e);if(\"name\"===r.type){if(s.default.keyword.isReservedWordES6(r.value))return\"keyword\";if(D.test(r.value)&&(\"<\"===n[u-1]||\"</\"==n.substr(u-2,2)))return\"jsx_tag\";if(r.value[0]!==r.value[0].toLowerCase())return\"capitalized\"}return\"punctuator\"===r.type&&h.test(r.value)?\"bracket\":r.type}function a(e,t){return t.replace(l.default,function(){for(var t=arguments.length,u=Array(t),n=0;n<t;n++)u[n]=arguments[n];var r=o(u),a=e[r];return a?u[0].split(d).map(function(e){return a(e)}).join(\"\\n\"):u[0]})}t.__esModule=!0,t.default=function(e,t,u){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};u=Math.max(u,0);var o=n.highlightCode&&p.default.supportsColor||n.forceColor,i=p.default;n.forceColor&&(i=new p.default.constructor({enabled:!0}));var l=function(e,t){return o?e(t):t},c=r(i);o&&(e=a(c,e));var s=n.linesAbove||2,f=n.linesBelow||3,D=e.split(d),h=Math.max(t-(s+1),0),m=Math.min(D.length,t+f);t||u||(h=0,m=D.length);var g=String(m).length,C=D.slice(h,m).map(function(e,n){var r=h+1+n,o=(\" \"+r).slice(-g),a=\" \"+o+\" | \";if(r===t){var i=\"\";if(u){var s=e.slice(0,u-1).replace(/[^\\t]/g,\" \");i=[\"\\n \",l(c.gutter,a.replace(/\\d/g,\" \")),s,l(c.marker,\"^\")].join(\"\")}return[l(c.marker,\">\"),l(c.gutter,a),e,i].join(\"\")}return\" \"+l(c.gutter,a)+e}).join(\"\\n\");return o?i.reset(C):C};var i=u(48),l=n(i),c=u(49),s=n(c),f=u(52),p=n(f),d=/\\r\\n|[\\n\\r\\u2028\\u2029]/,D=/^[a-z][\\w-]*$/i,h=/^[()\\[\\]{}]$/;e.exports=t.default},function(e,t){Object.defineProperty(t,\"__esModule\",{value:!0}),t.default=/((['\"])(?:(?!\\2|\\\\).|\\\\(?:\\r\\n|[\\s\\S]))*(\\2)?|`(?:[^`\\\\$]|\\\\[\\s\\S]|\\$(?!\\{)|\\$\\{(?:[^{}]|\\{[^}]*\\}?)*\\}?)*(`)?)|(\\/\\/.*)|(\\/\\*(?:[^*]|\\*(?!\\/))*(\\*\\/)?)|(\\/(?!\\*)(?:\\[(?:(?![\\]\\\\]).|\\\\.)*\\]|(?![\\/\\]\\\\]).|\\\\.)+\\/(?:(?!\\s*(?:\\b|[\\u0080-\\uFFFF$\\\\'\"~({]|[+\\-!](?!=)|\\.?\\d))|[gmiyu]{1,5}\\b(?![\\u0080-\\uFFFF$\\\\]|\\s*(?:[+\\-*%&|^<>!=?({]|\\/(?![\\/*])))))|(0[xX][\\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\\d*\\.\\d+|\\d+\\.?)(?:[eE][+-]?\\d+)?)|((?!\\d)(?:(?!\\s)[$\\w\\u0080-\\uFFFF]|\\\\u[\\da-fA-F]{4}|\\\\u\\{[\\da-fA-F]+\\})+)|(--|\\+\\+|&&|\\|\\||=>|\\.{3}|(?:[+\\-\\/%&|^]|\\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\\](){}])|(\\s+)|(^$|[\\s\\S])/g,t.matchToToken=function(e){var t={type:\"invalid\",value:e[0]};return e[1]?(t.type=\"string\",t.closed=!(!e[3]&&!e[4])):e[5]?t.type=\"comment\":e[6]?(t.type=\"comment\",t.closed=!!e[7]):e[8]?t.type=\"regex\":e[9]?t.type=\"number\":e[10]?t.type=\"name\":e[11]?t.type=\"punctuator\":e[12]&&(t.type=\"whitespace\"),t}},function(e,t,u){!function(){\"use strict\";t.ast=u(50),t.code=u(14),t.keyword=u(51)}()},function(e,t){!function(){\"use strict\";function t(e){if(null==e)return!1;switch(e.type){case\"ArrayExpression\":case\"AssignmentExpression\":case\"BinaryExpression\":case\"CallExpression\":case\"ConditionalExpression\":case\"FunctionExpression\":case\"Identifier\":case\"Literal\":case\"LogicalExpression\":case\"MemberExpression\":case\"NewExpression\":case\"ObjectExpression\":case\"SequenceExpression\":case\"ThisExpression\":case\"UnaryExpression\":case\"UpdateExpression\":return!0}return!1}function u(e){if(null==e)return!1;switch(e.type){case\"DoWhileStatement\":case\"ForInStatement\":case\"ForStatement\":case\"WhileStatement\":return!0}return!1}function n(e){if(null==e)return!1;switch(e.type){case\"BlockStatement\":case\"BreakStatement\":case\"ContinueStatement\":case\"DebuggerStatement\":case\"DoWhileStatement\":case\"EmptyStatement\":case\"ExpressionStatement\":case\"ForInStatement\":case\"ForStatement\":case\"IfStatement\":case\"LabeledStatement\":case\"ReturnStatement\":case\"SwitchStatement\":case\"ThrowStatement\":case\"TryStatement\":case\"VariableDeclaration\":case\"WhileStatement\":case\"WithStatement\":return!0}return!1}function r(e){return n(e)||null!=e&&\"FunctionDeclaration\"===e.type}function o(e){switch(e.type){case\"IfStatement\":return null!=e.alternate?e.alternate:e.consequent;case\"LabeledStatement\":case\"ForStatement\":case\"ForInStatement\":case\"WhileStatement\":case\"WithStatement\":return e.body}return null}function a(e){var t;if(\"IfStatement\"!==e.type)return!1;if(null==e.alternate)return!1;t=e.consequent;do{if(\"IfStatement\"===t.type&&null==t.alternate)return!0;t=o(t)}while(t);return!1}e.exports={isExpression:t,isStatement:n,isIterationStatement:u,isSourceElement:r,isProblematicIfStatement:a,trailingStatement:o}}()},function(e,t,u){!function(){\"use strict\";function t(e){switch(e){case\"implements\":case\"interface\":case\"package\":case\"private\":case\"protected\":case\"public\":case\"static\":case\"let\":return!0;default:return!1}}function n(e,t){return!(!t&&\"yield\"===e)&&r(e,t)}function r(e,u){if(u&&t(e))return!0;switch(e.length){case 2:return\"if\"===e||\"in\"===e||\"do\"===e;case 3:return\"var\"===e||\"for\"===e||\"new\"===e||\"try\"===e;case 4:return\"this\"===e||\"else\"===e||\"case\"===e||\"void\"===e||\"with\"===e||\"enum\"===e;case 5:return\"while\"===e||\"break\"===e||\"catch\"===e||\"throw\"===e||\"const\"===e||\"yield\"===e||\"class\"===e||\"super\"===e;case 6:return\"return\"===e||\"typeof\"===e||\"delete\"===e||\"switch\"===e||\"export\"===e||\"import\"===e;case 7:return\"default\"===e||\"finally\"===e||\"extends\"===e;case 8:return\"function\"===e||\"continue\"===e||\"debugger\"===e;case 10:return\"instanceof\"===e;default:return!1}}function o(e,t){return\"null\"===e||\"true\"===e||\"false\"===e||n(e,t)}function a(e,t){return\"null\"===e||\"true\"===e||\"false\"===e||r(e,t)}function i(e){return\"eval\"===e||\"arguments\"===e}function l(e){var t,u,n;if(0===e.length)return!1;if(n=e.charCodeAt(0),!d.isIdentifierStartES5(n))return!1;for(t=1,u=e.length;t<u;++t)if(n=e.charCodeAt(t),!d.isIdentifierPartES5(n))return!1;return!0}function c(e,t){return 1024*(e-55296)+(t-56320)+65536}function s(e){var t,u,n,r,o;if(0===e.length)return!1;for(o=d.isIdentifierStartES6,t=0,u=e.length;t<u;++t){if(55296<=(n=e.charCodeAt(t))&&n<=56319){if(++t>=u)return!1;if(!(56320<=(r=e.charCodeAt(t))&&r<=57343))return!1;n=c(n,r)}if(!o(n))return!1;o=d.isIdentifierPartES6}return!0}function f(e,t){return l(e)&&!o(e,t)}function p(e,t){return s(e)&&!a(e,t)}var d=u(14);e.exports={isKeywordES5:n,isKeywordES6:r,isReservedWordES5:o,isReservedWordES6:a,isRestrictedWord:i,isIdentifierNameES5:l,isIdentifierNameES6:s,isIdentifierES5:f,isIdentifierES6:p}}()},function(e,t,u){\"use strict\";(function(t){function n(e){this.enabled=e&&void 0!==e.enabled?e.enabled:s}function r(e){var t=function(){return o.apply(t,arguments)};return t._styles=e,t.enabled=this.enabled,t.__proto__=D,t}function o(){var e=arguments,t=e.length,u=0!==t&&String(arguments[0]);if(t>1)for(var n=1;n<t;n++)u+=\" \"+e[n];if(!this.enabled||!u)return u;var r=this._styles,o=r.length,a=i.dim.open;for(!p||-1===r.indexOf(\"gray\")&&-1===r.indexOf(\"grey\")||(i.dim.open=\"\");o--;){var l=i[r[o]];u=l.open+u.replace(l.closeRe,l.open)+l.close}return i.dim.open=a,u}var a=u(53),i=u(54),l=u(56),c=u(57),s=u(58),f=Object.defineProperties,p=\"win32\"===t.platform&&!/^xterm/i.test(Object({NODE_ENV:\"production\"}).TERM);p&&(i.blue.open=\"\u001b[94m\");var d=function(){var e={};return Object.keys(i).forEach(function(t){i[t].closeRe=new RegExp(a(i[t].close),\"g\"),e[t]={get:function(){return r.call(this,this._styles.concat(t))}}}),e}(),D=f(function(){},d);f(n.prototype,function(){var e={};return Object.keys(d).forEach(function(t){e[t]={get:function(){return r.call(this,[t])}}}),e}()),e.exports=new n,e.exports.styles=i,e.exports.hasColor=c,e.exports.stripColor=l,e.exports.supportsColor=s}).call(t,u(15))},function(e,t,u){\"use strict\";var n=/[|\\\\{}()[\\]^$+*?.]/g;e.exports=function(e){if(\"string\"!==typeof e)throw new TypeError(\"Expected a string\");return e.replace(n,\"\\\\$&\")}},function(e,t,u){\"use strict\";(function(e){function t(){var e={modifiers:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},colors:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],gray:[90,39]},bgColors:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49]}};return e.colors.grey=e.colors.gray,Object.keys(e).forEach(function(t){var u=e[t];Object.keys(u).forEach(function(t){var n=u[t];e[t]=u[t]={open:\"\u001b[\"+n[0]+\"m\",close:\"\u001b[\"+n[1]+\"m\"}}),Object.defineProperty(e,t,{value:u,enumerable:!1})}),e}Object.defineProperty(e,\"exports\",{enumerable:!0,get:t})}).call(t,u(55)(e))},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,\"loaded\",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,\"id\",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,u){\"use strict\";var n=u(16)();e.exports=function(e){return\"string\"===typeof e?e.replace(n,\"\"):e}},function(e,t,u){\"use strict\";var n=u(16),r=new RegExp(n().source);e.exports=r.test.bind(r)},function(e,t,u){\"use strict\";(function(t){var u=t.argv,n=u.indexOf(\"--\"),r=function(e){e=\"--\"+e;var t=u.indexOf(e);return-1!==t&&(-1===n||t<n)};e.exports=function(){return\"FORCE_COLOR\"in Object({NODE_ENV:\"production\"})||!(r(\"no-color\")||r(\"no-colors\")||r(\"color=false\"))&&(!!(r(\"color\")||r(\"colors\")||r(\"color=true\")||r(\"color=always\"))||!(t.stdout&&!t.stdout.isTTY)&&(\"win32\"===t.platform||(\"COLORTERM\"in Object({NODE_ENV:\"production\"})||\"dumb\"!==Object({NODE_ENV:\"production\"}).TERM&&!!/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(Object({NODE_ENV:\"production\"}).TERM))))}()}).call(t,u(15))},function(e,t,u){\"use strict\";function n(e,t,u,n,r,o,a){var i=void 0;if(!a&&e&&\"number\"===typeof t){var l=/^[\\/|\\\\].*?[\\/|\\\\]((src|node_modules)[\\/|\\\\].*)/.exec(e);i=l&&l[1]?l[1]:e,i+=\":\"+t,u&&(i+=\":\"+u)}else n&&\"number\"===typeof r?(i=n+\":\"+r,o&&(i+=\":\"+o)):i=\"unknown\";return i.replace(\"webpack://\",\".\")}u.d(t,\"a\",function(){return n})},function(e,t,u){\"use strict\";function n(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}function r(e,t){if(!e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!t||\"object\"!==typeof t&&\"function\"!==typeof t?e:t}function o(e,t){if(\"function\"!==typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=u(0),i=u.n(a),l=u(1),c=function(){function e(e,t){for(var u=0;u<t.length;u++){var n=t[u];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,u,n){return u&&e(t.prototype,u),n&&e(t,n),t}}(),s={color:l.a,cursor:\"pointer\",border:\"none\",display:\"block\",width:\"100%\",textAlign:\"left\",background:\"#fff\",fontFamily:\"Consolas, Menlo, monospace\",fontSize:\"1em\",padding:\"0px\",lineHeight:\"1.5\"},f=Object.assign({},s,{marginBottom:\"1.5em\"}),p=Object.assign({},s,{marginBottom:\"0.6em\"}),d=function(e){function t(){var e,u,o,a;n(this,t);for(var i=arguments.length,l=Array(i),c=0;c<i;c++)l[c]=arguments[c];return u=o=r(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),o.state={collapsed:!0},o.toggleCollaped=function(){o.setState(function(e){return{collapsed:!e.collapsed}})},a=u,r(o,a)}return o(t,e),c(t,[{key:\"render\",value:function(){var e=this.props.children.length,t=this.state.collapsed;return i.a.createElement(\"div\",null,i.a.createElement(\"button\",{onClick:this.toggleCollaped,style:t?f:p},(t?\"▶\":\"▼\")+\" \"+e+\" stack frames were \"+(t?\"collapsed.\":\"expanded.\")),i.a.createElement(\"div\",{style:{display:t?\"none\":\"block\"}},this.props.children,i.a.createElement(\"button\",{onClick:this.toggleCollaped,style:p},\"▲ \"+e+\" stack frames were expanded.\")))}}]),t}(a.Component);t.a=d},function(e,t,u){\"use strict\";function n(e,t){return null==e||\"\"===e||-1!==e.indexOf(\"/~/\")||-1!==e.indexOf(\"/node_modules/\")||-1!==e.trim().indexOf(\" \")||null==t||\"\"===t}u.d(t,\"a\",function(){return n})},function(e,t,u){\"use strict\";function n(e){switch(e){case\"EvalError\":case\"InternalError\":case\"RangeError\":case\"ReferenceError\":case\"SyntaxError\":case\"TypeError\":case\"URIError\":return!0;default:return!1}}u.d(t,\"a\",function(){return n})}]);"

/***/ })
/******/ ]);
});

/***/ }),

/***/ "../../node_modules/react-scripts/config/polyfills.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-scripts/config/polyfills.js ***!
  \***********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end


if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  __webpack_require__(/*! promise/lib/rejection-tracking */ "../../node_modules/react-scripts/node_modules/promise/lib/rejection-tracking.js").enable();
  window.Promise = __webpack_require__(/*! promise/lib/es6-extensions.js */ "../../node_modules/react-scripts/node_modules/promise/lib/es6-extensions.js");
}

// fetch() polyfill for making API calls.
__webpack_require__(/*! whatwg-fetch */ "../../node_modules/react-scripts/node_modules/whatwg-fetch/fetch.js");

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = __webpack_require__(/*! object-assign */ "../../node_modules/object-assign/index.js");

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
// We don't polyfill it in the browser--this is user's responsibility.
if (false) {
  require('raf').polyfill(global);
}


/***/ }),

/***/ "../../node_modules/react-scripts/node_modules/promise/lib/core.js":
/*!************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-scripts/node_modules/promise/lib/core.js ***!
  \************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var asap = __webpack_require__(/*! asap/raw */ "../../node_modules/asap/browser-raw.js");

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Promise constructor\'s argument is not a function');
  }
  this._75 = 0;
  this._83 = 0;
  this._18 = null;
  this._38 = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._47 = null;
Promise._71 = null;
Promise._44 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  while (self._83 === 3) {
    self = self._18;
  }
  if (Promise._47) {
    Promise._47(self);
  }
  if (self._83 === 0) {
    if (self._75 === 0) {
      self._75 = 1;
      self._38 = deferred;
      return;
    }
    if (self._75 === 1) {
      self._75 = 2;
      self._38 = [self._38, deferred];
      return;
    }
    self._38.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._83 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._83 === 1) {
        resolve(deferred.promise, self._18);
      } else {
        reject(deferred.promise, self._18);
      }
      return;
    }
    var ret = tryCallOne(cb, self._18);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._83 = 3;
      self._18 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._83 = 1;
  self._18 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._83 = 2;
  self._18 = newValue;
  if (Promise._71) {
    Promise._71(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._75 === 1) {
    handle(self, self._38);
    self._38 = null;
  }
  if (self._75 === 2) {
    for (var i = 0; i < self._38.length; i++) {
      handle(self, self._38[i]);
    }
    self._38 = null;
  }
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  });
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}


/***/ }),

/***/ "../../node_modules/react-scripts/node_modules/promise/lib/es6-extensions.js":
/*!**********************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-scripts/node_modules/promise/lib/es6-extensions.js ***!
  \**********************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = __webpack_require__(/*! ./core.js */ "../../node_modules/react-scripts/node_modules/promise/lib/core.js");

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._44);
  p._83 = 1;
  p._18 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._83 === 3) {
            val = val._18;
          }
          if (val._83 === 1) return res(i, val._18);
          if (val._83 === 2) reject(val._18);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};


/***/ }),

/***/ "../../node_modules/react-scripts/node_modules/promise/lib/rejection-tracking.js":
/*!**************************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-scripts/node_modules/promise/lib/rejection-tracking.js ***!
  \**************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Promise = __webpack_require__(/*! ./core */ "../../node_modules/react-scripts/node_modules/promise/lib/core.js");

var DEFAULT_WHITELIST = [
  ReferenceError,
  TypeError,
  RangeError
];

var enabled = false;
exports.disable = disable;
function disable() {
  enabled = false;
  Promise._47 = null;
  Promise._71 = null;
}

exports.enable = enable;
function enable(options) {
  options = options || {};
  if (enabled) disable();
  enabled = true;
  var id = 0;
  var displayId = 0;
  var rejections = {};
  Promise._47 = function (promise) {
    if (
      promise._83 === 2 && // IS REJECTED
      rejections[promise._56]
    ) {
      if (rejections[promise._56].logged) {
        onHandled(promise._56);
      } else {
        clearTimeout(rejections[promise._56].timeout);
      }
      delete rejections[promise._56];
    }
  };
  Promise._71 = function (promise, err) {
    if (promise._75 === 0) { // not yet handled
      promise._56 = id++;
      rejections[promise._56] = {
        displayId: null,
        error: err,
        timeout: setTimeout(
          onUnhandled.bind(null, promise._56),
          // For reference errors and type errors, this almost always
          // means the programmer made a mistake, so log them after just
          // 100ms
          // otherwise, wait 2 seconds to see if they get handled
          matchWhitelist(err, DEFAULT_WHITELIST)
            ? 100
            : 2000
        ),
        logged: false
      };
    }
  };
  function onUnhandled(id) {
    if (
      options.allRejections ||
      matchWhitelist(
        rejections[id].error,
        options.whitelist || DEFAULT_WHITELIST
      )
    ) {
      rejections[id].displayId = displayId++;
      if (options.onUnhandled) {
        rejections[id].logged = true;
        options.onUnhandled(
          rejections[id].displayId,
          rejections[id].error
        );
      } else {
        rejections[id].logged = true;
        logError(
          rejections[id].displayId,
          rejections[id].error
        );
      }
    }
  }
  function onHandled(id) {
    if (rejections[id].logged) {
      if (options.onHandled) {
        options.onHandled(rejections[id].displayId, rejections[id].error);
      } else if (!rejections[id].onUnhandled) {
        console.warn(
          'Promise Rejection Handled (id: ' + rejections[id].displayId + '):'
        );
        console.warn(
          '  This means you can ignore any previous messages of the form "Possible Unhandled Promise Rejection" with id ' +
          rejections[id].displayId + '.'
        );
      }
    }
  }
}

function logError(id, error) {
  console.warn('Possible Unhandled Promise Rejection (id: ' + id + '):');
  var errStr = (error && (error.stack || error)) + '';
  errStr.split('\n').forEach(function (line) {
    console.warn('  ' + line);
  });
}

function matchWhitelist(error, list) {
  return list.some(function (cls) {
    return error instanceof cls;
  });
}

/***/ }),

/***/ "../../node_modules/react-scripts/node_modules/whatwg-fetch/fetch.js":
/*!**************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-scripts/node_modules/whatwg-fetch/fetch.js ***!
  \**************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),

/***/ "../../node_modules/react/cjs/react.production.min.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react/cjs/react.production.min.js ***!
  \***********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.4.0
 * react.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var k=__webpack_require__(/*! object-assign */ "../../node_modules/object-assign/index.js"),n=__webpack_require__(/*! fbjs/lib/invariant */ "../../node_modules/fbjs/lib/invariant.js"),p=__webpack_require__(/*! fbjs/lib/emptyObject */ "../../node_modules/fbjs/lib/emptyObject.js"),q=__webpack_require__(/*! fbjs/lib/emptyFunction */ "../../node_modules/fbjs/lib/emptyFunction.js"),r="function"===typeof Symbol&&Symbol.for,t=r?Symbol.for("react.element"):60103,u=r?Symbol.for("react.portal"):60106,v=r?Symbol.for("react.fragment"):60107,w=r?Symbol.for("react.strict_mode"):60108,x=r?Symbol.for("react.profiler"):60114,y=r?Symbol.for("react.provider"):60109,z=r?Symbol.for("react.context"):60110,A=r?Symbol.for("react.async_mode"):60111,B=
r?Symbol.for("react.forward_ref"):60112;r&&Symbol.for("react.timeout");var C="function"===typeof Symbol&&Symbol.iterator;function D(a){for(var b=arguments.length-1,e="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=0;c<b;c++)e+="&args[]="+encodeURIComponent(arguments[c+1]);n(!1,"Minified React error #"+a+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",e)}
var E={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};function F(a,b,e){this.props=a;this.context=b;this.refs=p;this.updater=e||E}F.prototype.isReactComponent={};F.prototype.setState=function(a,b){"object"!==typeof a&&"function"!==typeof a&&null!=a?D("85"):void 0;this.updater.enqueueSetState(this,a,b,"setState")};F.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};function G(){}
G.prototype=F.prototype;function H(a,b,e){this.props=a;this.context=b;this.refs=p;this.updater=e||E}var I=H.prototype=new G;I.constructor=H;k(I,F.prototype);I.isPureReactComponent=!0;var J={current:null},K=Object.prototype.hasOwnProperty,L={key:!0,ref:!0,__self:!0,__source:!0};
function M(a,b,e){var c=void 0,d={},g=null,h=null;if(null!=b)for(c in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(g=""+b.key),b)K.call(b,c)&&!L.hasOwnProperty(c)&&(d[c]=b[c]);var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){for(var l=Array(f),m=0;m<f;m++)l[m]=arguments[m+2];d.children=l}if(a&&a.defaultProps)for(c in f=a.defaultProps,f)void 0===d[c]&&(d[c]=f[c]);return{$$typeof:t,type:a,key:g,ref:h,props:d,_owner:J.current}}
function N(a){return"object"===typeof a&&null!==a&&a.$$typeof===t}function escape(a){var b={"=":"=0",":":"=2"};return"$"+(""+a).replace(/[=:]/g,function(a){return b[a]})}var O=/\/+/g,P=[];function Q(a,b,e,c){if(P.length){var d=P.pop();d.result=a;d.keyPrefix=b;d.func=e;d.context=c;d.count=0;return d}return{result:a,keyPrefix:b,func:e,context:c,count:0}}function R(a){a.result=null;a.keyPrefix=null;a.func=null;a.context=null;a.count=0;10>P.length&&P.push(a)}
function S(a,b,e,c){var d=typeof a;if("undefined"===d||"boolean"===d)a=null;var g=!1;if(null===a)g=!0;else switch(d){case "string":case "number":g=!0;break;case "object":switch(a.$$typeof){case t:case u:g=!0}}if(g)return e(c,a,""===b?"."+T(a,0):b),1;g=0;b=""===b?".":b+":";if(Array.isArray(a))for(var h=0;h<a.length;h++){d=a[h];var f=b+T(d,h);g+=S(d,f,e,c)}else if(null===a||"undefined"===typeof a?f=null:(f=C&&a[C]||a["@@iterator"],f="function"===typeof f?f:null),"function"===typeof f)for(a=f.call(a),
h=0;!(d=a.next()).done;)d=d.value,f=b+T(d,h++),g+=S(d,f,e,c);else"object"===d&&(e=""+a,D("31","[object Object]"===e?"object with keys {"+Object.keys(a).join(", ")+"}":e,""));return g}function T(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(a.key):b.toString(36)}function U(a,b){a.func.call(a.context,b,a.count++)}
function V(a,b,e){var c=a.result,d=a.keyPrefix;a=a.func.call(a.context,b,a.count++);Array.isArray(a)?W(a,c,e,q.thatReturnsArgument):null!=a&&(N(a)&&(b=d+(!a.key||b&&b.key===a.key?"":(""+a.key).replace(O,"$&/")+"/")+e,a={$$typeof:t,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}),c.push(a))}function W(a,b,e,c,d){var g="";null!=e&&(g=(""+e).replace(O,"$&/")+"/");b=Q(b,g,c,d);null==a||S(a,"",V,b);R(b)}
var X={Children:{map:function(a,b,e){if(null==a)return a;var c=[];W(a,c,null,b,e);return c},forEach:function(a,b,e){if(null==a)return a;b=Q(null,null,b,e);null==a||S(a,"",U,b);R(b)},count:function(a){return null==a?0:S(a,"",q.thatReturnsNull,null)},toArray:function(a){var b=[];W(a,b,null,q.thatReturnsArgument);return b},only:function(a){N(a)?void 0:D("143");return a}},createRef:function(){return{current:null}},Component:F,PureComponent:H,createContext:function(a,b){void 0===b&&(b=null);a={$$typeof:z,
_calculateChangedBits:b,_defaultValue:a,_currentValue:a,_currentValue2:a,_changedBits:0,_changedBits2:0,Provider:null,Consumer:null};a.Provider={$$typeof:y,_context:a};return a.Consumer=a},forwardRef:function(a){return{$$typeof:B,render:a}},Fragment:v,StrictMode:w,unstable_AsyncMode:A,unstable_Profiler:x,createElement:M,cloneElement:function(a,b,e){null===a||void 0===a?D("267",a):void 0;var c=void 0,d=k({},a.props),g=a.key,h=a.ref,f=a._owner;if(null!=b){void 0!==b.ref&&(h=b.ref,f=J.current);void 0!==
b.key&&(g=""+b.key);var l=void 0;a.type&&a.type.defaultProps&&(l=a.type.defaultProps);for(c in b)K.call(b,c)&&!L.hasOwnProperty(c)&&(d[c]=void 0===b[c]&&void 0!==l?l[c]:b[c])}c=arguments.length-2;if(1===c)d.children=e;else if(1<c){l=Array(c);for(var m=0;m<c;m++)l[m]=arguments[m+2];d.children=l}return{$$typeof:t,type:a.type,key:g,ref:h,props:d,_owner:f}},createFactory:function(a){var b=M.bind(null,a);b.type=a;return b},isValidElement:N,version:"16.4.0",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:J,
assign:k}},Y={default:X},Z=Y&&X||Y;module.exports=Z.default?Z.default:Z;


/***/ }),

/***/ "../../node_modules/react/index.js":
/*!****************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react/index.js ***!
  \****************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(/*! ./cjs/react.production.min.js */ "../../node_modules/react/cjs/react.production.min.js");
} else {
  module.exports = require('./cjs/react.development.js');
}


/***/ }),

/***/ "../../node_modules/requires-port/index.js":
/*!************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/requires-port/index.js ***!
  \************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/entry.js":
/*!****************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/entry.js ***!
  \****************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var transportList = __webpack_require__(/*! ./transport-list */ "../../node_modules/sockjs-client/lib/transport-list.js");

module.exports = __webpack_require__(/*! ./main */ "../../node_modules/sockjs-client/lib/main.js")(transportList);

// TODO can't get rid of this until all servers do
if ('_sockjs_onload' in global) {
  setTimeout(global._sockjs_onload, 1);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/event/close.js":
/*!**********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/event/close.js ***!
  \**********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , Event = __webpack_require__(/*! ./event */ "../../node_modules/sockjs-client/lib/event/event.js")
  ;

function CloseEvent() {
  Event.call(this);
  this.initEvent('close', false, false);
  this.wasClean = false;
  this.code = 0;
  this.reason = '';
}

inherits(CloseEvent, Event);

module.exports = CloseEvent;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/event/emitter.js":
/*!************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/event/emitter.js ***!
  \************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , EventTarget = __webpack_require__(/*! ./eventtarget */ "../../node_modules/sockjs-client/lib/event/eventtarget.js")
  ;

function EventEmitter() {
  EventTarget.call(this);
}

inherits(EventEmitter, EventTarget);

EventEmitter.prototype.removeAllListeners = function(type) {
  if (type) {
    delete this._listeners[type];
  } else {
    this._listeners = {};
  }
};

EventEmitter.prototype.once = function(type, listener) {
  var self = this
    , fired = false;

  function g() {
    self.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  this.on(type, g);
};

EventEmitter.prototype.emit = function() {
  var type = arguments[0];
  var listeners = this._listeners[type];
  if (!listeners) {
    return;
  }
  // equivalent of Array.prototype.slice.call(arguments, 1);
  var l = arguments.length;
  var args = new Array(l - 1);
  for (var ai = 1; ai < l; ai++) {
    args[ai - 1] = arguments[ai];
  }
  for (var i = 0; i < listeners.length; i++) {
    listeners[i].apply(this, args);
  }
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;

module.exports.EventEmitter = EventEmitter;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/event/event.js":
/*!**********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/event/event.js ***!
  \**********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Event(eventType) {
  this.type = eventType;
}

Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
  this.type = eventType;
  this.bubbles = canBubble;
  this.cancelable = cancelable;
  this.timeStamp = +new Date();
  return this;
};

Event.prototype.stopPropagation = function() {};
Event.prototype.preventDefault = function() {};

Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

module.exports = Event;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/event/eventtarget.js":
/*!****************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/event/eventtarget.js ***!
  \****************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* Simplified implementation of DOM2 EventTarget.
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */

function EventTarget() {
  this._listeners = {};
}

EventTarget.prototype.addEventListener = function(eventType, listener) {
  if (!(eventType in this._listeners)) {
    this._listeners[eventType] = [];
  }
  var arr = this._listeners[eventType];
  // #4
  if (arr.indexOf(listener) === -1) {
    // Make a copy so as not to interfere with a current dispatchEvent.
    arr = arr.concat([listener]);
  }
  this._listeners[eventType] = arr;
};

EventTarget.prototype.removeEventListener = function(eventType, listener) {
  var arr = this._listeners[eventType];
  if (!arr) {
    return;
  }
  var idx = arr.indexOf(listener);
  if (idx !== -1) {
    if (arr.length > 1) {
      // Make a copy so as not to interfere with a current dispatchEvent.
      this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
    } else {
      delete this._listeners[eventType];
    }
    return;
  }
};

EventTarget.prototype.dispatchEvent = function() {
  var event = arguments[0];
  var t = event.type;
  // equivalent of Array.prototype.slice.call(arguments, 0);
  var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
  // TODO: This doesn't match the real behavior; per spec, onfoo get
  // their place in line from the /first/ time they're set from
  // non-null. Although WebKit bumps it to the end every time it's
  // set.
  if (this['on' + t]) {
    this['on' + t].apply(this, args);
  }
  if (t in this._listeners) {
    // Grab a reference to the listeners list. removeEventListener may alter the list.
    var listeners = this._listeners[t];
    for (var i = 0; i < listeners.length; i++) {
      listeners[i].apply(this, args);
    }
  }
};

module.exports = EventTarget;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/event/trans-message.js":
/*!******************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/event/trans-message.js ***!
  \******************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , Event = __webpack_require__(/*! ./event */ "../../node_modules/sockjs-client/lib/event/event.js")
  ;

function TransportMessageEvent(data) {
  Event.call(this);
  this.initEvent('message', false, false);
  this.data = data;
}

inherits(TransportMessageEvent, Event);

module.exports = TransportMessageEvent;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/facade.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/facade.js ***!
  \*****************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var JSON3 = __webpack_require__(/*! json3 */ "../../node_modules/json3/lib/json3.js")
  , iframeUtils = __webpack_require__(/*! ./utils/iframe */ "../../node_modules/sockjs-client/lib/utils/iframe.js")
  ;

function FacadeJS(transport) {
  this._transport = transport;
  transport.on('message', this._transportMessage.bind(this));
  transport.on('close', this._transportClose.bind(this));
}

FacadeJS.prototype._transportClose = function(code, reason) {
  iframeUtils.postMessage('c', JSON3.stringify([code, reason]));
};
FacadeJS.prototype._transportMessage = function(frame) {
  iframeUtils.postMessage('t', frame);
};
FacadeJS.prototype._send = function(data) {
  this._transport.send(data);
};
FacadeJS.prototype._close = function() {
  this._transport.close();
  this._transport.removeAllListeners();
};

module.exports = FacadeJS;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/iframe-bootstrap.js":
/*!***************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/iframe-bootstrap.js ***!
  \***************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var urlUtils = __webpack_require__(/*! ./utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  , eventUtils = __webpack_require__(/*! ./utils/event */ "../../node_modules/sockjs-client/lib/utils/event.js")
  , JSON3 = __webpack_require__(/*! json3 */ "../../node_modules/json3/lib/json3.js")
  , FacadeJS = __webpack_require__(/*! ./facade */ "../../node_modules/sockjs-client/lib/facade.js")
  , InfoIframeReceiver = __webpack_require__(/*! ./info-iframe-receiver */ "../../node_modules/sockjs-client/lib/info-iframe-receiver.js")
  , iframeUtils = __webpack_require__(/*! ./utils/iframe */ "../../node_modules/sockjs-client/lib/utils/iframe.js")
  , loc = __webpack_require__(/*! ./location */ "../../node_modules/sockjs-client/lib/location.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:iframe-bootstrap');
}

module.exports = function(SockJS, availableTransports) {
  var transportMap = {};
  availableTransports.forEach(function(at) {
    if (at.facadeTransport) {
      transportMap[at.facadeTransport.transportName] = at.facadeTransport;
    }
  });

  // hard-coded for the info iframe
  // TODO see if we can make this more dynamic
  transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
  var parentOrigin;

  /* eslint-disable camelcase */
  SockJS.bootstrap_iframe = function() {
    /* eslint-enable camelcase */
    var facade;
    iframeUtils.currentWindowId = loc.hash.slice(1);
    var onMessage = function(e) {
      if (e.source !== parent) {
        return;
      }
      if (typeof parentOrigin === 'undefined') {
        parentOrigin = e.origin;
      }
      if (e.origin !== parentOrigin) {
        return;
      }

      var iframeMessage;
      try {
        iframeMessage = JSON3.parse(e.data);
      } catch (ignored) {
        debug('bad json', e.data);
        return;
      }

      if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
        return;
      }
      switch (iframeMessage.type) {
      case 's':
        var p;
        try {
          p = JSON3.parse(iframeMessage.data);
        } catch (ignored) {
          debug('bad json', iframeMessage.data);
          break;
        }
        var version = p[0];
        var transport = p[1];
        var transUrl = p[2];
        var baseUrl = p[3];
        debug(version, transport, transUrl, baseUrl);
        // change this to semver logic
        if (version !== SockJS.version) {
          throw new Error('Incompatible SockJS! Main site uses:' +
                    ' "' + version + '", the iframe:' +
                    ' "' + SockJS.version + '".');
        }

        if (!urlUtils.isOriginEqual(transUrl, loc.href) ||
            !urlUtils.isOriginEqual(baseUrl, loc.href)) {
          throw new Error('Can\'t connect to different domain from within an ' +
                    'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
        }
        facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
        break;
      case 'm':
        facade._send(iframeMessage.data);
        break;
      case 'c':
        if (facade) {
          facade._close();
        }
        facade = null;
        break;
      }
    };

    eventUtils.attachEvent('message', onMessage);

    // Start
    iframeUtils.postMessage('s');
  };
};


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/info-ajax.js":
/*!********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/info-ajax.js ***!
  \********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , JSON3 = __webpack_require__(/*! json3 */ "../../node_modules/json3/lib/json3.js")
  , objectUtils = __webpack_require__(/*! ./utils/object */ "../../node_modules/sockjs-client/lib/utils/object.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:info-ajax');
}

function InfoAjax(url, AjaxObject) {
  EventEmitter.call(this);

  var self = this;
  var t0 = +new Date();
  this.xo = new AjaxObject('GET', url);

  this.xo.once('finish', function(status, text) {
    var info, rtt;
    if (status === 200) {
      rtt = (+new Date()) - t0;
      if (text) {
        try {
          info = JSON3.parse(text);
        } catch (e) {
          debug('bad json', text);
        }
      }

      if (!objectUtils.isObject(info)) {
        info = {};
      }
    }
    self.emit('finish', info, rtt);
    self.removeAllListeners();
  });
}

inherits(InfoAjax, EventEmitter);

InfoAjax.prototype.close = function() {
  this.removeAllListeners();
  this.xo.close();
};

module.exports = InfoAjax;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/info-iframe-receiver.js":
/*!*******************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/info-iframe-receiver.js ***!
  \*******************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , JSON3 = __webpack_require__(/*! json3 */ "../../node_modules/json3/lib/json3.js")
  , XHRLocalObject = __webpack_require__(/*! ./transport/sender/xhr-local */ "../../node_modules/sockjs-client/lib/transport/sender/xhr-local.js")
  , InfoAjax = __webpack_require__(/*! ./info-ajax */ "../../node_modules/sockjs-client/lib/info-ajax.js")
  ;

function InfoReceiverIframe(transUrl) {
  var self = this;
  EventEmitter.call(this);

  this.ir = new InfoAjax(transUrl, XHRLocalObject);
  this.ir.once('finish', function(info, rtt) {
    self.ir = null;
    self.emit('message', JSON3.stringify([info, rtt]));
  });
}

inherits(InfoReceiverIframe, EventEmitter);

InfoReceiverIframe.transportName = 'iframe-info-receiver';

InfoReceiverIframe.prototype.close = function() {
  if (this.ir) {
    this.ir.close();
    this.ir = null;
  }
  this.removeAllListeners();
};

module.exports = InfoReceiverIframe;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/info-iframe.js":
/*!**********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/info-iframe.js ***!
  \**********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , JSON3 = __webpack_require__(/*! json3 */ "../../node_modules/json3/lib/json3.js")
  , utils = __webpack_require__(/*! ./utils/event */ "../../node_modules/sockjs-client/lib/utils/event.js")
  , IframeTransport = __webpack_require__(/*! ./transport/iframe */ "../../node_modules/sockjs-client/lib/transport/iframe.js")
  , InfoReceiverIframe = __webpack_require__(/*! ./info-iframe-receiver */ "../../node_modules/sockjs-client/lib/info-iframe-receiver.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:info-iframe');
}

function InfoIframe(baseUrl, url) {
  var self = this;
  EventEmitter.call(this);

  var go = function() {
    var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);

    ifr.once('message', function(msg) {
      if (msg) {
        var d;
        try {
          d = JSON3.parse(msg);
        } catch (e) {
          debug('bad json', msg);
          self.emit('finish');
          self.close();
          return;
        }

        var info = d[0], rtt = d[1];
        self.emit('finish', info, rtt);
      }
      self.close();
    });

    ifr.once('close', function() {
      self.emit('finish');
      self.close();
    });
  };

  // TODO this seems the same as the 'needBody' from transports
  if (!global.document.body) {
    utils.attachEvent('load', go);
  } else {
    go();
  }
}

inherits(InfoIframe, EventEmitter);

InfoIframe.enabled = function() {
  return IframeTransport.enabled();
};

InfoIframe.prototype.close = function() {
  if (this.ifr) {
    this.ifr.close();
  }
  this.removeAllListeners();
  this.ifr = null;
};

module.exports = InfoIframe;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/info-receiver.js":
/*!************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/info-receiver.js ***!
  \************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , urlUtils = __webpack_require__(/*! ./utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  , XDR = __webpack_require__(/*! ./transport/sender/xdr */ "../../node_modules/sockjs-client/lib/transport/sender/xdr.js")
  , XHRCors = __webpack_require__(/*! ./transport/sender/xhr-cors */ "../../node_modules/sockjs-client/lib/transport/sender/xhr-cors.js")
  , XHRLocal = __webpack_require__(/*! ./transport/sender/xhr-local */ "../../node_modules/sockjs-client/lib/transport/sender/xhr-local.js")
  , XHRFake = __webpack_require__(/*! ./transport/sender/xhr-fake */ "../../node_modules/sockjs-client/lib/transport/sender/xhr-fake.js")
  , InfoIframe = __webpack_require__(/*! ./info-iframe */ "../../node_modules/sockjs-client/lib/info-iframe.js")
  , InfoAjax = __webpack_require__(/*! ./info-ajax */ "../../node_modules/sockjs-client/lib/info-ajax.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:info-receiver');
}

function InfoReceiver(baseUrl, urlInfo) {
  debug(baseUrl);
  var self = this;
  EventEmitter.call(this);

  setTimeout(function() {
    self.doXhr(baseUrl, urlInfo);
  }, 0);
}

inherits(InfoReceiver, EventEmitter);

// TODO this is currently ignoring the list of available transports and the whitelist

InfoReceiver._getReceiver = function(baseUrl, url, urlInfo) {
  // determine method of CORS support (if needed)
  if (urlInfo.sameOrigin) {
    return new InfoAjax(url, XHRLocal);
  }
  if (XHRCors.enabled) {
    return new InfoAjax(url, XHRCors);
  }
  if (XDR.enabled && urlInfo.sameScheme) {
    return new InfoAjax(url, XDR);
  }
  if (InfoIframe.enabled()) {
    return new InfoIframe(baseUrl, url);
  }
  return new InfoAjax(url, XHRFake);
};

InfoReceiver.prototype.doXhr = function(baseUrl, urlInfo) {
  var self = this
    , url = urlUtils.addPath(baseUrl, '/info')
    ;
  debug('doXhr', url);

  this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);

  this.timeoutRef = setTimeout(function() {
    debug('timeout');
    self._cleanup(false);
    self.emit('finish');
  }, InfoReceiver.timeout);

  this.xo.once('finish', function(info, rtt) {
    debug('finish', info, rtt);
    self._cleanup(true);
    self.emit('finish', info, rtt);
  });
};

InfoReceiver.prototype._cleanup = function(wasClean) {
  debug('_cleanup');
  clearTimeout(this.timeoutRef);
  this.timeoutRef = null;
  if (!wasClean && this.xo) {
    this.xo.close();
  }
  this.xo = null;
};

InfoReceiver.prototype.close = function() {
  debug('close');
  this.removeAllListeners();
  this._cleanup(false);
};

InfoReceiver.timeout = 8000;

module.exports = InfoReceiver;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/location.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/location.js ***!
  \*******************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

module.exports = global.location || {
  origin: 'http://localhost:80'
, protocol: 'http'
, host: 'localhost'
, port: 80
, href: 'http://localhost/'
, hash: ''
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/main.js":
/*!***************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/main.js ***!
  \***************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

__webpack_require__(/*! ./shims */ "../../node_modules/sockjs-client/lib/shims.js");

var URL = __webpack_require__(/*! url-parse */ "../../node_modules/url-parse/index.js")
  , inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , JSON3 = __webpack_require__(/*! json3 */ "../../node_modules/json3/lib/json3.js")
  , random = __webpack_require__(/*! ./utils/random */ "../../node_modules/sockjs-client/lib/utils/random.js")
  , escape = __webpack_require__(/*! ./utils/escape */ "../../node_modules/sockjs-client/lib/utils/escape.js")
  , urlUtils = __webpack_require__(/*! ./utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  , eventUtils = __webpack_require__(/*! ./utils/event */ "../../node_modules/sockjs-client/lib/utils/event.js")
  , transport = __webpack_require__(/*! ./utils/transport */ "../../node_modules/sockjs-client/lib/utils/transport.js")
  , objectUtils = __webpack_require__(/*! ./utils/object */ "../../node_modules/sockjs-client/lib/utils/object.js")
  , browser = __webpack_require__(/*! ./utils/browser */ "../../node_modules/sockjs-client/lib/utils/browser.js")
  , log = __webpack_require__(/*! ./utils/log */ "../../node_modules/sockjs-client/lib/utils/log.js")
  , Event = __webpack_require__(/*! ./event/event */ "../../node_modules/sockjs-client/lib/event/event.js")
  , EventTarget = __webpack_require__(/*! ./event/eventtarget */ "../../node_modules/sockjs-client/lib/event/eventtarget.js")
  , loc = __webpack_require__(/*! ./location */ "../../node_modules/sockjs-client/lib/location.js")
  , CloseEvent = __webpack_require__(/*! ./event/close */ "../../node_modules/sockjs-client/lib/event/close.js")
  , TransportMessageEvent = __webpack_require__(/*! ./event/trans-message */ "../../node_modules/sockjs-client/lib/event/trans-message.js")
  , InfoReceiver = __webpack_require__(/*! ./info-receiver */ "../../node_modules/sockjs-client/lib/info-receiver.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:main');
}

var transports;

// follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
function SockJS(url, protocols, options) {
  if (!(this instanceof SockJS)) {
    return new SockJS(url, protocols, options);
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
  }
  EventTarget.call(this);

  this.readyState = SockJS.CONNECTING;
  this.extensions = '';
  this.protocol = '';

  // non-standard extension
  options = options || {};
  if (options.protocols_whitelist) {
    log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
  }
  this._transportsWhitelist = options.transports;
  this._transportOptions = options.transportOptions || {};

  var sessionId = options.sessionId || 8;
  if (typeof sessionId === 'function') {
    this._generateSessionId = sessionId;
  } else if (typeof sessionId === 'number') {
    this._generateSessionId = function() {
      return random.string(sessionId);
    };
  } else {
    throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
  }

  this._server = options.server || random.numberString(1000);

  // Step 1 of WS spec - parse and validate the url. Issue #8
  var parsedUrl = new URL(url);
  if (!parsedUrl.host || !parsedUrl.protocol) {
    throw new SyntaxError("The URL '" + url + "' is invalid");
  } else if (parsedUrl.hash) {
    throw new SyntaxError('The URL must not contain a fragment');
  } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
  }

  var secure = parsedUrl.protocol === 'https:';
  // Step 2 - don't allow secure origin with an insecure protocol
  if (loc.protocol === 'https' && !secure) {
    throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
  }

  // Step 3 - check port access - no need here
  // Step 4 - parse protocols argument
  if (!protocols) {
    protocols = [];
  } else if (!Array.isArray(protocols)) {
    protocols = [protocols];
  }

  // Step 5 - check protocols argument
  var sortedProtocols = protocols.sort();
  sortedProtocols.forEach(function(proto, i) {
    if (!proto) {
      throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
    }
    if (i < (sortedProtocols.length - 1) && proto === sortedProtocols[i + 1]) {
      throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
    }
  });

  // Step 6 - convert origin
  var o = urlUtils.getOrigin(loc.href);
  this._origin = o ? o.toLowerCase() : null;

  // remove the trailing slash
  parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

  // store the sanitized url
  this.url = parsedUrl.href;
  debug('using url', this.url);

  // Step 7 - start connection in background
  // obtain server info
  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
  this._urlInfo = {
    nullOrigin: !browser.hasDomain()
  , sameOrigin: urlUtils.isOriginEqual(this.url, loc.href)
  , sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
  };

  this._ir = new InfoReceiver(this.url, this._urlInfo);
  this._ir.once('finish', this._receiveInfo.bind(this));
}

inherits(SockJS, EventTarget);

function userSetCode(code) {
  return code === 1000 || (code >= 3000 && code <= 4999);
}

SockJS.prototype.close = function(code, reason) {
  // Step 1
  if (code && !userSetCode(code)) {
    throw new Error('InvalidAccessError: Invalid code');
  }
  // Step 2.4 states the max is 123 bytes, but we are just checking length
  if (reason && reason.length > 123) {
    throw new SyntaxError('reason argument has an invalid length');
  }

  // Step 3.1
  if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
    return;
  }

  // TODO look at docs to determine how to set this
  var wasClean = true;
  this._close(code || 1000, reason || 'Normal closure', wasClean);
};

SockJS.prototype.send = function(data) {
  // #13 - convert anything non-string to string
  // TODO this currently turns objects into [object Object]
  if (typeof data !== 'string') {
    data = '' + data;
  }
  if (this.readyState === SockJS.CONNECTING) {
    throw new Error('InvalidStateError: The connection has not been established yet');
  }
  if (this.readyState !== SockJS.OPEN) {
    return;
  }
  this._transport.send(escape.quote(data));
};

SockJS.version = __webpack_require__(/*! ./version */ "../../node_modules/sockjs-client/lib/version.js");

SockJS.CONNECTING = 0;
SockJS.OPEN = 1;
SockJS.CLOSING = 2;
SockJS.CLOSED = 3;

SockJS.prototype._receiveInfo = function(info, rtt) {
  debug('_receiveInfo', rtt);
  this._ir = null;
  if (!info) {
    this._close(1002, 'Cannot connect to server');
    return;
  }

  // establish a round-trip timeout (RTO) based on the
  // round-trip time (RTT)
  this._rto = this.countRTO(rtt);
  // allow server to override url used for the actual transport
  this._transUrl = info.base_url ? info.base_url : this.url;
  info = objectUtils.extend(info, this._urlInfo);
  debug('info', info);
  // determine list of desired and supported transports
  var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
  this._transports = enabledTransports.main;
  debug(this._transports.length + ' enabled transports');

  this._connect();
};

SockJS.prototype._connect = function() {
  for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
    debug('attempt', Transport.transportName);
    if (Transport.needBody) {
      if (!global.document.body ||
          (typeof global.document.readyState !== 'undefined' &&
            global.document.readyState !== 'complete' &&
            global.document.readyState !== 'interactive')) {
        debug('waiting for body');
        this._transports.unshift(Transport);
        eventUtils.attachEvent('load', this._connect.bind(this));
        return;
      }
    }

    // calculate timeout based on RTO and round trips. Default to 5s
    var timeoutMs = (this._rto * Transport.roundTrips) || 5000;
    this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
    debug('using timeout', timeoutMs);

    var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
    var options = this._transportOptions[Transport.transportName];
    debug('transport url', transportUrl);
    var transportObj = new Transport(transportUrl, this._transUrl, options);
    transportObj.on('message', this._transportMessage.bind(this));
    transportObj.once('close', this._transportClose.bind(this));
    transportObj.transportName = Transport.transportName;
    this._transport = transportObj;

    return;
  }
  this._close(2000, 'All transports failed', false);
};

SockJS.prototype._transportTimeout = function() {
  debug('_transportTimeout');
  if (this.readyState === SockJS.CONNECTING) {
    this._transportClose(2007, 'Transport timed out');
  }
};

SockJS.prototype._transportMessage = function(msg) {
  debug('_transportMessage', msg);
  var self = this
    , type = msg.slice(0, 1)
    , content = msg.slice(1)
    , payload
    ;

  // first check for messages that don't need a payload
  switch (type) {
    case 'o':
      this._open();
      return;
    case 'h':
      this.dispatchEvent(new Event('heartbeat'));
      debug('heartbeat', this.transport);
      return;
  }

  if (content) {
    try {
      payload = JSON3.parse(content);
    } catch (e) {
      debug('bad json', content);
    }
  }

  if (typeof payload === 'undefined') {
    debug('empty payload', content);
    return;
  }

  switch (type) {
    case 'a':
      if (Array.isArray(payload)) {
        payload.forEach(function(p) {
          debug('message', self.transport, p);
          self.dispatchEvent(new TransportMessageEvent(p));
        });
      }
      break;
    case 'm':
      debug('message', this.transport, payload);
      this.dispatchEvent(new TransportMessageEvent(payload));
      break;
    case 'c':
      if (Array.isArray(payload) && payload.length === 2) {
        this._close(payload[0], payload[1], true);
      }
      break;
  }
};

SockJS.prototype._transportClose = function(code, reason) {
  debug('_transportClose', this.transport, code, reason);
  if (this._transport) {
    this._transport.removeAllListeners();
    this._transport = null;
    this.transport = null;
  }

  if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
    this._connect();
    return;
  }

  this._close(code, reason);
};

SockJS.prototype._open = function() {
  debug('_open', this._transport.transportName, this.readyState);
  if (this.readyState === SockJS.CONNECTING) {
    if (this._transportTimeoutId) {
      clearTimeout(this._transportTimeoutId);
      this._transportTimeoutId = null;
    }
    this.readyState = SockJS.OPEN;
    this.transport = this._transport.transportName;
    this.dispatchEvent(new Event('open'));
    debug('connected', this.transport);
  } else {
    // The server might have been restarted, and lost track of our
    // connection.
    this._close(1006, 'Server lost session');
  }
};

SockJS.prototype._close = function(code, reason, wasClean) {
  debug('_close', this.transport, code, reason, wasClean, this.readyState);
  var forceFail = false;

  if (this._ir) {
    forceFail = true;
    this._ir.close();
    this._ir = null;
  }
  if (this._transport) {
    this._transport.close();
    this._transport = null;
    this.transport = null;
  }

  if (this.readyState === SockJS.CLOSED) {
    throw new Error('InvalidStateError: SockJS has already been closed');
  }

  this.readyState = SockJS.CLOSING;
  setTimeout(function() {
    this.readyState = SockJS.CLOSED;

    if (forceFail) {
      this.dispatchEvent(new Event('error'));
    }

    var e = new CloseEvent('close');
    e.wasClean = wasClean || false;
    e.code = code || 1000;
    e.reason = reason;

    this.dispatchEvent(e);
    this.onmessage = this.onclose = this.onerror = null;
    debug('disconnected');
  }.bind(this), 0);
};

// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
// and RFC 2988.
SockJS.prototype.countRTO = function(rtt) {
  // In a local environment, when using IE8/9 and the `jsonp-polling`
  // transport the time needed to establish a connection (the time that pass
  // from the opening of the transport to the call of `_dispatchOpen`) is
  // around 200msec (the lower bound used in the article above) and this
  // causes spurious timeouts. For this reason we calculate a value slightly
  // larger than that used in the article.
  if (rtt > 100) {
    return 4 * rtt; // rto > 400msec
  }
  return 300 + rtt; // 300msec < rto <= 400msec
};

module.exports = function(availableTransports) {
  transports = transport(availableTransports);
  __webpack_require__(/*! ./iframe-bootstrap */ "../../node_modules/sockjs-client/lib/iframe-bootstrap.js")(SockJS, availableTransports);
  return SockJS;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/shims.js":
/*!****************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/shims.js ***!
  \****************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable */
/* jscs: disable */


// pulled specific shims from https://github.com/es-shims/es5-shim

var ArrayPrototype = Array.prototype;
var ObjectPrototype = Object.prototype;
var FunctionPrototype = Function.prototype;
var StringPrototype = String.prototype;
var array_slice = ArrayPrototype.slice;

var _toString = ObjectPrototype.toString;
var isFunction = function (val) {
    return ObjectPrototype.toString.call(val) === '[object Function]';
};
var isArray = function isArray(obj) {
    return _toString.call(obj) === '[object Array]';
};
var isString = function isString(obj) {
    return _toString.call(obj) === '[object String]';
};

var supportsDescriptors = Object.defineProperty && (function () {
    try {
        Object.defineProperty({}, 'x', {});
        return true;
    } catch (e) { /* this is ES3 */
        return false;
    }
}());

// Define configurable, writable and non-enumerable props
// if they don't exist.
var defineProperty;
if (supportsDescriptors) {
    defineProperty = function (object, name, method, forceAssign) {
        if (!forceAssign && (name in object)) { return; }
        Object.defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: method
        });
    };
} else {
    defineProperty = function (object, name, method, forceAssign) {
        if (!forceAssign && (name in object)) { return; }
        object[name] = method;
    };
}
var defineProperties = function (object, map, forceAssign) {
    for (var name in map) {
        if (ObjectPrototype.hasOwnProperty.call(map, name)) {
          defineProperty(object, name, map[name], forceAssign);
        }
    }
};

var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert " + o + ' to object');
    }
    return Object(o);
};

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

function toInteger(num) {
    var n = +num;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function ToUint32(x) {
    return x >>> 0;
}

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

function Empty() {}

defineProperties(FunctionPrototype, {
    bind: function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (!isFunction(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = array_slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var binder = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    args.concat(array_slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(array_slice.call(arguments))
                );

            }

        };

        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.

        var boundLength = Math.max(0, target.length - args.length);

        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
        }

        // XXX Build a dynamic function with desired amount of arguments is the only
        // way to set the length property of a function.
        // In environments where Content Security Policies enabled (Chrome extensions,
        // for ex.) all use of eval or Function costructor throws an exception.
        // However in all of these environments Function.prototype.bind exists
        // and so this code will never be executed.
        var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    }
});

//
// Array
// =====
//

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
defineProperties(Array, { isArray: isArray });


var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var properlyBoxesContext = function properlyBoxed(method) {
    // Check node 0.6.21 bug where third parameter is not boxed
    var properlyBoxesNonStrict = true;
    var properlyBoxesStrict = true;
    if (method) {
        method.call('foo', function (_, __, context) {
            if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
        });

        method.call([1], function () {
            'use strict';
            properlyBoxesStrict = typeof this === 'string';
        }, 'x');
    }
    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
};

defineProperties(ArrayPrototype, {
    forEach: function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && isString(this) ? this.split('') : object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (!isFunction(fun)) {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                // context
                fun.call(thisp, self[i], i, object);
            }
        }
    }
}, !properlyBoxesContext(ArrayPrototype.forEach));

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
defineProperties(ArrayPrototype, {
    indexOf: function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && isString(this) ? this.split('') : toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    }
}, hasFirefox2IndexOfBug);

//
// String
// ======
//

// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
//       [undefined, "t", undefined, "e", ...]
//    ''.split(/.?/) should be [], not [""]
//    '.'.split(/()()/) should be ["."], not ["", "", "."]

var string_split = StringPrototype.split;
if (
    'ab'.split(/(?:ab)*/).length !== 2 ||
    '.'.split(/(.?)(.?)/).length !== 4 ||
    'tesst'.split(/(s)*/)[1] === 't' ||
    'test'.split(/(?:)/, -1).length !== 4 ||
    ''.split(/.?/).length ||
    '.'.split(/()()/).length > 1
) {
    (function () {
        var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

        StringPrototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0) {
                return [];
            }

            // If `separator` is not a regex, use native split
            if (_toString.call(separator) !== '[object RegExp]') {
                return string_split.call(this, separator, limit);
            }

            var output = [],
                flags = (separator.ignoreCase ? 'i' : '') +
                        (separator.multiline  ? 'm' : '') +
                        (separator.extended   ? 'x' : '') + // Proposed for ES6
                        (separator.sticky     ? 'y' : ''), // Firefox 3+
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator2, match, lastIndex, lastLength;
            separator = new RegExp(separator.source, flags + 'g');
            string += ''; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                ToUint32(limit);
            while (match = separator.exec(string)) {
                // `separator.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(string.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (arguments[i] === void 0) {
                                    match[i] = void 0;
                                }
                            }
                        });
                    }
                    if (match.length > 1 && match.index < string.length) {
                        ArrayPrototype.push.apply(output, match.slice(1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= limit) {
                        break;
                    }
                }
                if (separator.lastIndex === match.index) {
                    separator.lastIndex++; // Avoid an infinite loop
                }
            }
            if (lastLastIndex === string.length) {
                if (lastLength || !separator.test('')) {
                    output.push('');
                }
            } else {
                output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
        };
    }());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
} else if ('0'.split(void 0, 0).length) {
    StringPrototype.split = function split(separator, limit) {
        if (separator === void 0 && limit === 0) { return []; }
        return string_split.call(this, separator, limit);
    };
}

// ECMA-262, 3rd B.2.3
// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
var string_substr = StringPrototype.substr;
var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
defineProperties(StringPrototype, {
    substr: function substr(start, length) {
        return string_substr.call(
            this,
            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
            length
        );
    }
}, hasNegativeSubstrBug);


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport-list.js":
/*!*************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport-list.js ***!
  \*************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = [
  // streaming transports
  __webpack_require__(/*! ./transport/websocket */ "../../node_modules/sockjs-client/lib/transport/websocket.js")
, __webpack_require__(/*! ./transport/xhr-streaming */ "../../node_modules/sockjs-client/lib/transport/xhr-streaming.js")
, __webpack_require__(/*! ./transport/xdr-streaming */ "../../node_modules/sockjs-client/lib/transport/xdr-streaming.js")
, __webpack_require__(/*! ./transport/eventsource */ "../../node_modules/sockjs-client/lib/transport/eventsource.js")
, __webpack_require__(/*! ./transport/lib/iframe-wrap */ "../../node_modules/sockjs-client/lib/transport/lib/iframe-wrap.js")(__webpack_require__(/*! ./transport/eventsource */ "../../node_modules/sockjs-client/lib/transport/eventsource.js"))

  // polling transports
, __webpack_require__(/*! ./transport/htmlfile */ "../../node_modules/sockjs-client/lib/transport/htmlfile.js")
, __webpack_require__(/*! ./transport/lib/iframe-wrap */ "../../node_modules/sockjs-client/lib/transport/lib/iframe-wrap.js")(__webpack_require__(/*! ./transport/htmlfile */ "../../node_modules/sockjs-client/lib/transport/htmlfile.js"))
, __webpack_require__(/*! ./transport/xhr-polling */ "../../node_modules/sockjs-client/lib/transport/xhr-polling.js")
, __webpack_require__(/*! ./transport/xdr-polling */ "../../node_modules/sockjs-client/lib/transport/xdr-polling.js")
, __webpack_require__(/*! ./transport/lib/iframe-wrap */ "../../node_modules/sockjs-client/lib/transport/lib/iframe-wrap.js")(__webpack_require__(/*! ./transport/xhr-polling */ "../../node_modules/sockjs-client/lib/transport/xhr-polling.js"))
, __webpack_require__(/*! ./transport/jsonp-polling */ "../../node_modules/sockjs-client/lib/transport/jsonp-polling.js")
];


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/browser/abstract-xhr.js":
/*!*****************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/browser/abstract-xhr.js ***!
  \*****************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , utils = __webpack_require__(/*! ../../utils/event */ "../../node_modules/sockjs-client/lib/utils/event.js")
  , urlUtils = __webpack_require__(/*! ../../utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  , XHR = global.XMLHttpRequest
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:browser:xhr');
}

function AbstractXHRObject(method, url, payload, opts) {
  debug(method, url);
  var self = this;
  EventEmitter.call(this);

  setTimeout(function () {
    self._start(method, url, payload, opts);
  }, 0);
}

inherits(AbstractXHRObject, EventEmitter);

AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
  var self = this;

  try {
    this.xhr = new XHR();
  } catch (x) {
    // intentionally empty
  }

  if (!this.xhr) {
    debug('no xhr');
    this.emit('finish', 0, 'no xhr support');
    this._cleanup();
    return;
  }

  // several browsers cache POSTs
  url = urlUtils.addQuery(url, 't=' + (+new Date()));

  // Explorer tends to keep connection open, even after the
  // tab gets closed: http://bugs.jquery.com/ticket/5280
  this.unloadRef = utils.unloadAdd(function() {
    debug('unload cleanup');
    self._cleanup(true);
  });
  try {
    this.xhr.open(method, url, true);
    if (this.timeout && 'timeout' in this.xhr) {
      this.xhr.timeout = this.timeout;
      this.xhr.ontimeout = function() {
        debug('xhr timeout');
        self.emit('finish', 0, '');
        self._cleanup(false);
      };
    }
  } catch (e) {
    debug('exception', e);
    // IE raises an exception on wrong port.
    this.emit('finish', 0, '');
    this._cleanup(false);
    return;
  }

  if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
    debug('withCredentials');
    // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
    // "This never affects same-site requests."

    this.xhr.withCredentials = 'true';
  }
  if (opts && opts.headers) {
    for (var key in opts.headers) {
      this.xhr.setRequestHeader(key, opts.headers[key]);
    }
  }

  this.xhr.onreadystatechange = function() {
    if (self.xhr) {
      var x = self.xhr;
      var text, status;
      debug('readyState', x.readyState);
      switch (x.readyState) {
      case 3:
        // IE doesn't like peeking into responseText or status
        // on Microsoft.XMLHTTP and readystate=3
        try {
          status = x.status;
          text = x.responseText;
        } catch (e) {
          // intentionally empty
        }
        debug('status', status);
        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
        if (status === 1223) {
          status = 204;
        }

        // IE does return readystate == 3 for 404 answers.
        if (status === 200 && text && text.length > 0) {
          debug('chunk');
          self.emit('chunk', status, text);
        }
        break;
      case 4:
        status = x.status;
        debug('status', status);
        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
        if (status === 1223) {
          status = 204;
        }
        // IE returns this for a bad port
        // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
        if (status === 12005 || status === 12029) {
          status = 0;
        }

        debug('finish', status, x.responseText);
        self.emit('finish', status, x.responseText);
        self._cleanup(false);
        break;
      }
    }
  };

  try {
    self.xhr.send(payload);
  } catch (e) {
    self.emit('finish', 0, '');
    self._cleanup(false);
  }
};

AbstractXHRObject.prototype._cleanup = function(abort) {
  debug('cleanup');
  if (!this.xhr) {
    return;
  }
  this.removeAllListeners();
  utils.unloadDel(this.unloadRef);

  // IE needs this field to be a function
  this.xhr.onreadystatechange = function() {};
  if (this.xhr.ontimeout) {
    this.xhr.ontimeout = null;
  }

  if (abort) {
    try {
      this.xhr.abort();
    } catch (x) {
      // intentionally empty
    }
  }
  this.unloadRef = this.xhr = null;
};

AbstractXHRObject.prototype.close = function() {
  debug('close');
  this._cleanup(true);
};

AbstractXHRObject.enabled = !!XHR;
// override XMLHttpRequest for IE6/7
// obfuscate to avoid firewalls
var axo = ['Active'].concat('Object').join('X');
if (!AbstractXHRObject.enabled && (axo in global)) {
  debug('overriding xmlhttprequest');
  XHR = function() {
    try {
      return new global[axo]('Microsoft.XMLHTTP');
    } catch (e) {
      return null;
    }
  };
  AbstractXHRObject.enabled = !!new XHR();
}

var cors = false;
try {
  cors = 'withCredentials' in new XHR();
} catch (ignored) {
  // intentionally empty
}

AbstractXHRObject.supportsCORS = cors;

module.exports = AbstractXHRObject;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/browser/eventsource.js":
/*!****************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/browser/eventsource.js ***!
  \****************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global.EventSource;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/browser/websocket.js":
/*!**************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/browser/websocket.js ***!
  \**************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Driver = global.WebSocket || global.MozWebSocket;
if (Driver) {
	module.exports = function WebSocketBrowserDriver(url) {
		return new Driver(url);
	};
} else {
	module.exports = undefined;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/eventsource.js":
/*!********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/eventsource.js ***!
  \********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , AjaxBasedTransport = __webpack_require__(/*! ./lib/ajax-based */ "../../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  , EventSourceReceiver = __webpack_require__(/*! ./receiver/eventsource */ "../../node_modules/sockjs-client/lib/transport/receiver/eventsource.js")
  , XHRCorsObject = __webpack_require__(/*! ./sender/xhr-cors */ "../../node_modules/sockjs-client/lib/transport/sender/xhr-cors.js")
  , EventSourceDriver = __webpack_require__(/*! eventsource */ "../../node_modules/sockjs-client/lib/transport/browser/eventsource.js")
  ;

function EventSourceTransport(transUrl) {
  if (!EventSourceTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }

  AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
}

inherits(EventSourceTransport, AjaxBasedTransport);

EventSourceTransport.enabled = function() {
  return !!EventSourceDriver;
};

EventSourceTransport.transportName = 'eventsource';
EventSourceTransport.roundTrips = 2;

module.exports = EventSourceTransport;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/htmlfile.js":
/*!*****************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/htmlfile.js ***!
  \*****************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , HtmlfileReceiver = __webpack_require__(/*! ./receiver/htmlfile */ "../../node_modules/sockjs-client/lib/transport/receiver/htmlfile.js")
  , XHRLocalObject = __webpack_require__(/*! ./sender/xhr-local */ "../../node_modules/sockjs-client/lib/transport/sender/xhr-local.js")
  , AjaxBasedTransport = __webpack_require__(/*! ./lib/ajax-based */ "../../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  ;

function HtmlFileTransport(transUrl) {
  if (!HtmlfileReceiver.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
}

inherits(HtmlFileTransport, AjaxBasedTransport);

HtmlFileTransport.enabled = function(info) {
  return HtmlfileReceiver.enabled && info.sameOrigin;
};

HtmlFileTransport.transportName = 'htmlfile';
HtmlFileTransport.roundTrips = 2;

module.exports = HtmlFileTransport;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/iframe.js":
/*!***************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/iframe.js ***!
  \***************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Few cool transports do work only for same-origin. In order to make
// them work cross-domain we shall use iframe, served from the
// remote domain. New browsers have capabilities to communicate with
// cross domain iframe using postMessage(). In IE it was implemented
// from IE 8+, but of course, IE got some details wrong:
//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
//    http://stevesouders.com/misc/test-postmessage.php

var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , JSON3 = __webpack_require__(/*! json3 */ "../../node_modules/json3/lib/json3.js")
  , EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , version = __webpack_require__(/*! ../version */ "../../node_modules/sockjs-client/lib/version.js")
  , urlUtils = __webpack_require__(/*! ../utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  , iframeUtils = __webpack_require__(/*! ../utils/iframe */ "../../node_modules/sockjs-client/lib/utils/iframe.js")
  , eventUtils = __webpack_require__(/*! ../utils/event */ "../../node_modules/sockjs-client/lib/utils/event.js")
  , random = __webpack_require__(/*! ../utils/random */ "../../node_modules/sockjs-client/lib/utils/random.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:transport:iframe');
}

function IframeTransport(transport, transUrl, baseUrl) {
  if (!IframeTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }
  EventEmitter.call(this);

  var self = this;
  this.origin = urlUtils.getOrigin(baseUrl);
  this.baseUrl = baseUrl;
  this.transUrl = transUrl;
  this.transport = transport;
  this.windowId = random.string(8);

  var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
  debug(transport, transUrl, iframeUrl);

  this.iframeObj = iframeUtils.createIframe(iframeUrl, function(r) {
    debug('err callback');
    self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
    self.close();
  });

  this.onmessageCallback = this._message.bind(this);
  eventUtils.attachEvent('message', this.onmessageCallback);
}

inherits(IframeTransport, EventEmitter);

IframeTransport.prototype.close = function() {
  debug('close');
  this.removeAllListeners();
  if (this.iframeObj) {
    eventUtils.detachEvent('message', this.onmessageCallback);
    try {
      // When the iframe is not loaded, IE raises an exception
      // on 'contentWindow'.
      this.postMessage('c');
    } catch (x) {
      // intentionally empty
    }
    this.iframeObj.cleanup();
    this.iframeObj = null;
    this.onmessageCallback = this.iframeObj = null;
  }
};

IframeTransport.prototype._message = function(e) {
  debug('message', e.data);
  if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
    debug('not same origin', e.origin, this.origin);
    return;
  }

  var iframeMessage;
  try {
    iframeMessage = JSON3.parse(e.data);
  } catch (ignored) {
    debug('bad json', e.data);
    return;
  }

  if (iframeMessage.windowId !== this.windowId) {
    debug('mismatched window id', iframeMessage.windowId, this.windowId);
    return;
  }

  switch (iframeMessage.type) {
  case 's':
    this.iframeObj.loaded();
    // window global dependency
    this.postMessage('s', JSON3.stringify([
      version
    , this.transport
    , this.transUrl
    , this.baseUrl
    ]));
    break;
  case 't':
    this.emit('message', iframeMessage.data);
    break;
  case 'c':
    var cdata;
    try {
      cdata = JSON3.parse(iframeMessage.data);
    } catch (ignored) {
      debug('bad json', iframeMessage.data);
      return;
    }
    this.emit('close', cdata[0], cdata[1]);
    this.close();
    break;
  }
};

IframeTransport.prototype.postMessage = function(type, data) {
  debug('postMessage', type, data);
  this.iframeObj.post(JSON3.stringify({
    windowId: this.windowId
  , type: type
  , data: data || ''
  }), this.origin);
};

IframeTransport.prototype.send = function(message) {
  debug('send', message);
  this.postMessage('m', message);
};

IframeTransport.enabled = function() {
  return iframeUtils.iframeEnabled;
};

IframeTransport.transportName = 'iframe';
IframeTransport.roundTrips = 2;

module.exports = IframeTransport;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/jsonp-polling.js":
/*!**********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/jsonp-polling.js ***!
  \**********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// The simplest and most robust transport, using the well-know cross
// domain hack - JSONP. This transport is quite inefficient - one
// message could use up to one http request. But at least it works almost
// everywhere.
// Known limitations:
//   o you will get a spinning cursor
//   o for Konqueror a dumb timer is needed to detect errors

var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , SenderReceiver = __webpack_require__(/*! ./lib/sender-receiver */ "../../node_modules/sockjs-client/lib/transport/lib/sender-receiver.js")
  , JsonpReceiver = __webpack_require__(/*! ./receiver/jsonp */ "../../node_modules/sockjs-client/lib/transport/receiver/jsonp.js")
  , jsonpSender = __webpack_require__(/*! ./sender/jsonp */ "../../node_modules/sockjs-client/lib/transport/sender/jsonp.js")
  ;

function JsonPTransport(transUrl) {
  if (!JsonPTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }
  SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
}

inherits(JsonPTransport, SenderReceiver);

JsonPTransport.enabled = function() {
  return !!global.document;
};

JsonPTransport.transportName = 'jsonp-polling';
JsonPTransport.roundTrips = 1;
JsonPTransport.needBody = true;

module.exports = JsonPTransport;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/lib/ajax-based.js":
/*!***********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/lib/ajax-based.js ***!
  \***********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , urlUtils = __webpack_require__(/*! ../../utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  , SenderReceiver = __webpack_require__(/*! ./sender-receiver */ "../../node_modules/sockjs-client/lib/transport/lib/sender-receiver.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:ajax-based');
}

function createAjaxSender(AjaxObject) {
  return function(url, payload, callback) {
    debug('create ajax sender', url, payload);
    var opt = {};
    if (typeof payload === 'string') {
      opt.headers = {'Content-type': 'text/plain'};
    }
    var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
    var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
    xo.once('finish', function(status) {
      debug('finish', status);
      xo = null;

      if (status !== 200 && status !== 204) {
        return callback(new Error('http status ' + status));
      }
      callback();
    });
    return function() {
      debug('abort');
      xo.close();
      xo = null;

      var err = new Error('Aborted');
      err.code = 1000;
      callback(err);
    };
  };
}

function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
  SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
}

inherits(AjaxBasedTransport, SenderReceiver);

module.exports = AjaxBasedTransport;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/lib/buffered-sender.js":
/*!****************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/lib/buffered-sender.js ***!
  \****************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:buffered-sender');
}

function BufferedSender(url, sender) {
  debug(url);
  EventEmitter.call(this);
  this.sendBuffer = [];
  this.sender = sender;
  this.url = url;
}

inherits(BufferedSender, EventEmitter);

BufferedSender.prototype.send = function(message) {
  debug('send', message);
  this.sendBuffer.push(message);
  if (!this.sendStop) {
    this.sendSchedule();
  }
};

// For polling transports in a situation when in the message callback,
// new message is being send. If the sending connection was started
// before receiving one, it is possible to saturate the network and
// timeout due to the lack of receiving socket. To avoid that we delay
// sending messages by some small time, in order to let receiving
// connection be started beforehand. This is only a halfmeasure and
// does not fix the big problem, but it does make the tests go more
// stable on slow networks.
BufferedSender.prototype.sendScheduleWait = function() {
  debug('sendScheduleWait');
  var self = this;
  var tref;
  this.sendStop = function() {
    debug('sendStop');
    self.sendStop = null;
    clearTimeout(tref);
  };
  tref = setTimeout(function() {
    debug('timeout');
    self.sendStop = null;
    self.sendSchedule();
  }, 25);
};

BufferedSender.prototype.sendSchedule = function() {
  debug('sendSchedule', this.sendBuffer.length);
  var self = this;
  if (this.sendBuffer.length > 0) {
    var payload = '[' + this.sendBuffer.join(',') + ']';
    this.sendStop = this.sender(this.url, payload, function(err) {
      self.sendStop = null;
      if (err) {
        debug('error', err);
        self.emit('close', err.code || 1006, 'Sending error: ' + err);
        self.close();
      } else {
        self.sendScheduleWait();
      }
    });
    this.sendBuffer = [];
  }
};

BufferedSender.prototype._cleanup = function() {
  debug('_cleanup');
  this.removeAllListeners();
};

BufferedSender.prototype.close = function() {
  debug('close');
  this._cleanup();
  if (this.sendStop) {
    this.sendStop();
    this.sendStop = null;
  }
};

module.exports = BufferedSender;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/lib/iframe-wrap.js":
/*!************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/lib/iframe-wrap.js ***!
  \************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , IframeTransport = __webpack_require__(/*! ../iframe */ "../../node_modules/sockjs-client/lib/transport/iframe.js")
  , objectUtils = __webpack_require__(/*! ../../utils/object */ "../../node_modules/sockjs-client/lib/utils/object.js")
  ;

module.exports = function(transport) {

  function IframeWrapTransport(transUrl, baseUrl) {
    IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
  }

  inherits(IframeWrapTransport, IframeTransport);

  IframeWrapTransport.enabled = function(url, info) {
    if (!global.document) {
      return false;
    }

    var iframeInfo = objectUtils.extend({}, info);
    iframeInfo.sameOrigin = true;
    return transport.enabled(iframeInfo) && IframeTransport.enabled();
  };

  IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
  IframeWrapTransport.needBody = true;
  IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

  IframeWrapTransport.facadeTransport = transport;

  return IframeWrapTransport;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/lib/polling.js":
/*!********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/lib/polling.js ***!
  \********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:polling');
}

function Polling(Receiver, receiveUrl, AjaxObject) {
  debug(receiveUrl);
  EventEmitter.call(this);
  this.Receiver = Receiver;
  this.receiveUrl = receiveUrl;
  this.AjaxObject = AjaxObject;
  this._scheduleReceiver();
}

inherits(Polling, EventEmitter);

Polling.prototype._scheduleReceiver = function() {
  debug('_scheduleReceiver');
  var self = this;
  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

  poll.on('message', function(msg) {
    debug('message', msg);
    self.emit('message', msg);
  });

  poll.once('close', function(code, reason) {
    debug('close', code, reason, self.pollIsClosing);
    self.poll = poll = null;

    if (!self.pollIsClosing) {
      if (reason === 'network') {
        self._scheduleReceiver();
      } else {
        self.emit('close', code || 1006, reason);
        self.removeAllListeners();
      }
    }
  });
};

Polling.prototype.abort = function() {
  debug('abort');
  this.removeAllListeners();
  this.pollIsClosing = true;
  if (this.poll) {
    this.poll.abort();
  }
};

module.exports = Polling;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/lib/sender-receiver.js":
/*!****************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/lib/sender-receiver.js ***!
  \****************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , urlUtils = __webpack_require__(/*! ../../utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  , BufferedSender = __webpack_require__(/*! ./buffered-sender */ "../../node_modules/sockjs-client/lib/transport/lib/buffered-sender.js")
  , Polling = __webpack_require__(/*! ./polling */ "../../node_modules/sockjs-client/lib/transport/lib/polling.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:sender-receiver');
}

function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
  var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
  debug(pollUrl);
  var self = this;
  BufferedSender.call(this, transUrl, senderFunc);

  this.poll = new Polling(Receiver, pollUrl, AjaxObject);
  this.poll.on('message', function(msg) {
    debug('poll message', msg);
    self.emit('message', msg);
  });
  this.poll.once('close', function(code, reason) {
    debug('poll close', code, reason);
    self.poll = null;
    self.emit('close', code, reason);
    self.close();
  });
}

inherits(SenderReceiver, BufferedSender);

SenderReceiver.prototype.close = function() {
  BufferedSender.prototype.close.call(this);
  debug('close');
  this.removeAllListeners();
  if (this.poll) {
    this.poll.abort();
    this.poll = null;
  }
};

module.exports = SenderReceiver;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/receiver/eventsource.js":
/*!*****************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/receiver/eventsource.js ***!
  \*****************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , EventSourceDriver = __webpack_require__(/*! eventsource */ "../../node_modules/sockjs-client/lib/transport/browser/eventsource.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:receiver:eventsource');
}

function EventSourceReceiver(url) {
  debug(url);
  EventEmitter.call(this);

  var self = this;
  var es = this.es = new EventSourceDriver(url);
  es.onmessage = function(e) {
    debug('message', e.data);
    self.emit('message', decodeURI(e.data));
  };
  es.onerror = function(e) {
    debug('error', es.readyState, e);
    // ES on reconnection has readyState = 0 or 1.
    // on network error it's CLOSED = 2
    var reason = (es.readyState !== 2 ? 'network' : 'permanent');
    self._cleanup();
    self._close(reason);
  };
}

inherits(EventSourceReceiver, EventEmitter);

EventSourceReceiver.prototype.abort = function() {
  debug('abort');
  this._cleanup();
  this._close('user');
};

EventSourceReceiver.prototype._cleanup = function() {
  debug('cleanup');
  var es = this.es;
  if (es) {
    es.onmessage = es.onerror = null;
    es.close();
    this.es = null;
  }
};

EventSourceReceiver.prototype._close = function(reason) {
  debug('close', reason);
  var self = this;
  // Safari and chrome < 15 crash if we close window before
  // waiting for ES cleanup. See:
  // https://code.google.com/p/chromium/issues/detail?id=89155
  setTimeout(function() {
    self.emit('close', null, reason);
    self.removeAllListeners();
  }, 200);
};

module.exports = EventSourceReceiver;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/receiver/htmlfile.js":
/*!**************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/receiver/htmlfile.js ***!
  \**************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , iframeUtils = __webpack_require__(/*! ../../utils/iframe */ "../../node_modules/sockjs-client/lib/utils/iframe.js")
  , urlUtils = __webpack_require__(/*! ../../utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  , EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , random = __webpack_require__(/*! ../../utils/random */ "../../node_modules/sockjs-client/lib/utils/random.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:receiver:htmlfile');
}

function HtmlfileReceiver(url) {
  debug(url);
  EventEmitter.call(this);
  var self = this;
  iframeUtils.polluteGlobalNamespace();

  this.id = 'a' + random.string(6);
  url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));

  debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
  var constructFunc = HtmlfileReceiver.htmlfileEnabled ?
      iframeUtils.createHtmlfile : iframeUtils.createIframe;

  global[iframeUtils.WPrefix][this.id] = {
    start: function() {
      debug('start');
      self.iframeObj.loaded();
    }
  , message: function(data) {
      debug('message', data);
      self.emit('message', data);
    }
  , stop: function() {
      debug('stop');
      self._cleanup();
      self._close('network');
    }
  };
  this.iframeObj = constructFunc(url, function() {
    debug('callback');
    self._cleanup();
    self._close('permanent');
  });
}

inherits(HtmlfileReceiver, EventEmitter);

HtmlfileReceiver.prototype.abort = function() {
  debug('abort');
  this._cleanup();
  this._close('user');
};

HtmlfileReceiver.prototype._cleanup = function() {
  debug('_cleanup');
  if (this.iframeObj) {
    this.iframeObj.cleanup();
    this.iframeObj = null;
  }
  delete global[iframeUtils.WPrefix][this.id];
};

HtmlfileReceiver.prototype._close = function(reason) {
  debug('_close', reason);
  this.emit('close', null, reason);
  this.removeAllListeners();
};

HtmlfileReceiver.htmlfileEnabled = false;

// obfuscate to avoid firewalls
var axo = ['Active'].concat('Object').join('X');
if (axo in global) {
  try {
    HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
  } catch (x) {
    // intentionally empty
  }
}

HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;

module.exports = HtmlfileReceiver;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/receiver/jsonp.js":
/*!***********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/receiver/jsonp.js ***!
  \***********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var utils = __webpack_require__(/*! ../../utils/iframe */ "../../node_modules/sockjs-client/lib/utils/iframe.js")
  , random = __webpack_require__(/*! ../../utils/random */ "../../node_modules/sockjs-client/lib/utils/random.js")
  , browser = __webpack_require__(/*! ../../utils/browser */ "../../node_modules/sockjs-client/lib/utils/browser.js")
  , urlUtils = __webpack_require__(/*! ../../utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  , inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:receiver:jsonp');
}

function JsonpReceiver(url) {
  debug(url);
  var self = this;
  EventEmitter.call(this);

  utils.polluteGlobalNamespace();

  this.id = 'a' + random.string(6);
  var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));

  global[utils.WPrefix][this.id] = this._callback.bind(this);
  this._createScript(urlWithId);

  // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
  this.timeoutId = setTimeout(function() {
    debug('timeout');
    self._abort(new Error('JSONP script loaded abnormally (timeout)'));
  }, JsonpReceiver.timeout);
}

inherits(JsonpReceiver, EventEmitter);

JsonpReceiver.prototype.abort = function() {
  debug('abort');
  if (global[utils.WPrefix][this.id]) {
    var err = new Error('JSONP user aborted read');
    err.code = 1000;
    this._abort(err);
  }
};

JsonpReceiver.timeout = 35000;
JsonpReceiver.scriptErrorTimeout = 1000;

JsonpReceiver.prototype._callback = function(data) {
  debug('_callback', data);
  this._cleanup();

  if (this.aborting) {
    return;
  }

  if (data) {
    debug('message', data);
    this.emit('message', data);
  }
  this.emit('close', null, 'network');
  this.removeAllListeners();
};

JsonpReceiver.prototype._abort = function(err) {
  debug('_abort', err);
  this._cleanup();
  this.aborting = true;
  this.emit('close', err.code, err.message);
  this.removeAllListeners();
};

JsonpReceiver.prototype._cleanup = function() {
  debug('_cleanup');
  clearTimeout(this.timeoutId);
  if (this.script2) {
    this.script2.parentNode.removeChild(this.script2);
    this.script2 = null;
  }
  if (this.script) {
    var script = this.script;
    // Unfortunately, you can't really abort script loading of
    // the script.
    script.parentNode.removeChild(script);
    script.onreadystatechange = script.onerror =
        script.onload = script.onclick = null;
    this.script = null;
  }
  delete global[utils.WPrefix][this.id];
};

JsonpReceiver.prototype._scriptError = function() {
  debug('_scriptError');
  var self = this;
  if (this.errorTimer) {
    return;
  }

  this.errorTimer = setTimeout(function() {
    if (!self.loadedOkay) {
      self._abort(new Error('JSONP script loaded abnormally (onerror)'));
    }
  }, JsonpReceiver.scriptErrorTimeout);
};

JsonpReceiver.prototype._createScript = function(url) {
  debug('_createScript', url);
  var self = this;
  var script = this.script = global.document.createElement('script');
  var script2;  // Opera synchronous load trick.

  script.id = 'a' + random.string(8);
  script.src = url;
  script.type = 'text/javascript';
  script.charset = 'UTF-8';
  script.onerror = this._scriptError.bind(this);
  script.onload = function() {
    debug('onload');
    self._abort(new Error('JSONP script loaded abnormally (onload)'));
  };

  // IE9 fires 'error' event after onreadystatechange or before, in random order.
  // Use loadedOkay to determine if actually errored
  script.onreadystatechange = function() {
    debug('onreadystatechange', script.readyState);
    if (/loaded|closed/.test(script.readyState)) {
      if (script && script.htmlFor && script.onclick) {
        self.loadedOkay = true;
        try {
          // In IE, actually execute the script.
          script.onclick();
        } catch (x) {
          // intentionally empty
        }
      }
      if (script) {
        self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
      }
    }
  };
  // IE: event/htmlFor/onclick trick.
  // One can't rely on proper order for onreadystatechange. In order to
  // make sure, set a 'htmlFor' and 'event' properties, so that
  // script code will be installed as 'onclick' handler for the
  // script object. Later, onreadystatechange, manually execute this
  // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
  // set. For reference see:
  //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
  // Also, read on that about script ordering:
  //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
  if (typeof script.async === 'undefined' && global.document.attachEvent) {
    // According to mozilla docs, in recent browsers script.async defaults
    // to 'true', so we may use it to detect a good browser:
    // https://developer.mozilla.org/en/HTML/Element/script
    if (!browser.isOpera()) {
      // Naively assume we're in IE
      try {
        script.htmlFor = script.id;
        script.event = 'onclick';
      } catch (x) {
        // intentionally empty
      }
      script.async = true;
    } else {
      // Opera, second sync script hack
      script2 = this.script2 = global.document.createElement('script');
      script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
      script.async = script2.async = false;
    }
  }
  if (typeof script.async !== 'undefined') {
    script.async = true;
  }

  var head = global.document.getElementsByTagName('head')[0];
  head.insertBefore(script, head.firstChild);
  if (script2) {
    head.insertBefore(script2, head.firstChild);
  }
};

module.exports = JsonpReceiver;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/receiver/xhr.js":
/*!*********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/receiver/xhr.js ***!
  \*********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:receiver:xhr');
}

function XhrReceiver(url, AjaxObject) {
  debug(url);
  EventEmitter.call(this);
  var self = this;

  this.bufferPosition = 0;

  this.xo = new AjaxObject('POST', url, null);
  this.xo.on('chunk', this._chunkHandler.bind(this));
  this.xo.once('finish', function(status, text) {
    debug('finish', status, text);
    self._chunkHandler(status, text);
    self.xo = null;
    var reason = status === 200 ? 'network' : 'permanent';
    debug('close', reason);
    self.emit('close', null, reason);
    self._cleanup();
  });
}

inherits(XhrReceiver, EventEmitter);

XhrReceiver.prototype._chunkHandler = function(status, text) {
  debug('_chunkHandler', status);
  if (status !== 200 || !text) {
    return;
  }

  for (var idx = -1; ; this.bufferPosition += idx + 1) {
    var buf = text.slice(this.bufferPosition);
    idx = buf.indexOf('\n');
    if (idx === -1) {
      break;
    }
    var msg = buf.slice(0, idx);
    if (msg) {
      debug('message', msg);
      this.emit('message', msg);
    }
  }
};

XhrReceiver.prototype._cleanup = function() {
  debug('_cleanup');
  this.removeAllListeners();
};

XhrReceiver.prototype.abort = function() {
  debug('abort');
  if (this.xo) {
    this.xo.close();
    debug('close');
    this.emit('close', null, 'user');
    this.xo = null;
  }
  this._cleanup();
};

module.exports = XhrReceiver;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/sender/jsonp.js":
/*!*********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/sender/jsonp.js ***!
  \*********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var random = __webpack_require__(/*! ../../utils/random */ "../../node_modules/sockjs-client/lib/utils/random.js")
  , urlUtils = __webpack_require__(/*! ../../utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:sender:jsonp');
}

var form, area;

function createIframe(id) {
  debug('createIframe', id);
  try {
    // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
    return global.document.createElement('<iframe name="' + id + '">');
  } catch (x) {
    var iframe = global.document.createElement('iframe');
    iframe.name = id;
    return iframe;
  }
}

function createForm() {
  debug('createForm');
  form = global.document.createElement('form');
  form.style.display = 'none';
  form.style.position = 'absolute';
  form.method = 'POST';
  form.enctype = 'application/x-www-form-urlencoded';
  form.acceptCharset = 'UTF-8';

  area = global.document.createElement('textarea');
  area.name = 'd';
  form.appendChild(area);

  global.document.body.appendChild(form);
}

module.exports = function(url, payload, callback) {
  debug(url, payload);
  if (!form) {
    createForm();
  }
  var id = 'a' + random.string(8);
  form.target = id;
  form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);

  var iframe = createIframe(id);
  iframe.id = id;
  iframe.style.display = 'none';
  form.appendChild(iframe);

  try {
    area.value = payload;
  } catch (e) {
    // seriously broken browsers get here
  }
  form.submit();

  var completed = function(err) {
    debug('completed', id, err);
    if (!iframe.onerror) {
      return;
    }
    iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
    // Opera mini doesn't like if we GC iframe
    // immediately, thus this timeout.
    setTimeout(function() {
      debug('cleaning up', id);
      iframe.parentNode.removeChild(iframe);
      iframe = null;
    }, 500);
    area.value = '';
    // It is not possible to detect if the iframe succeeded or
    // failed to submit our form.
    callback(err);
  };
  iframe.onerror = function() {
    debug('onerror', id);
    completed();
  };
  iframe.onload = function() {
    debug('onload', id);
    completed();
  };
  iframe.onreadystatechange = function(e) {
    debug('onreadystatechange', id, iframe.readyState, e);
    if (iframe.readyState === 'complete') {
      completed();
    }
  };
  return function() {
    debug('aborted', id);
    completed(new Error('Aborted'));
  };
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/sender/xdr.js":
/*!*******************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/sender/xdr.js ***!
  \*******************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , eventUtils = __webpack_require__(/*! ../../utils/event */ "../../node_modules/sockjs-client/lib/utils/event.js")
  , browser = __webpack_require__(/*! ../../utils/browser */ "../../node_modules/sockjs-client/lib/utils/browser.js")
  , urlUtils = __webpack_require__(/*! ../../utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:sender:xdr');
}

// References:
//   http://ajaxian.com/archives/100-line-ajax-wrapper
//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

function XDRObject(method, url, payload) {
  debug(method, url);
  var self = this;
  EventEmitter.call(this);

  setTimeout(function() {
    self._start(method, url, payload);
  }, 0);
}

inherits(XDRObject, EventEmitter);

XDRObject.prototype._start = function(method, url, payload) {
  debug('_start');
  var self = this;
  var xdr = new global.XDomainRequest();
  // IE caches even POSTs
  url = urlUtils.addQuery(url, 't=' + (+new Date()));

  xdr.onerror = function() {
    debug('onerror');
    self._error();
  };
  xdr.ontimeout = function() {
    debug('ontimeout');
    self._error();
  };
  xdr.onprogress = function() {
    debug('progress', xdr.responseText);
    self.emit('chunk', 200, xdr.responseText);
  };
  xdr.onload = function() {
    debug('load');
    self.emit('finish', 200, xdr.responseText);
    self._cleanup(false);
  };
  this.xdr = xdr;
  this.unloadRef = eventUtils.unloadAdd(function() {
    self._cleanup(true);
  });
  try {
    // Fails with AccessDenied if port number is bogus
    this.xdr.open(method, url);
    if (this.timeout) {
      this.xdr.timeout = this.timeout;
    }
    this.xdr.send(payload);
  } catch (x) {
    this._error();
  }
};

XDRObject.prototype._error = function() {
  this.emit('finish', 0, '');
  this._cleanup(false);
};

XDRObject.prototype._cleanup = function(abort) {
  debug('cleanup', abort);
  if (!this.xdr) {
    return;
  }
  this.removeAllListeners();
  eventUtils.unloadDel(this.unloadRef);

  this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
  if (abort) {
    try {
      this.xdr.abort();
    } catch (x) {
      // intentionally empty
    }
  }
  this.unloadRef = this.xdr = null;
};

XDRObject.prototype.close = function() {
  debug('close');
  this._cleanup(true);
};

// IE 8/9 if the request target uses the same scheme - #79
XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());

module.exports = XDRObject;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/sender/xhr-cors.js":
/*!************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/sender/xhr-cors.js ***!
  \************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , XhrDriver = __webpack_require__(/*! ../driver/xhr */ "../../node_modules/sockjs-client/lib/transport/browser/abstract-xhr.js")
  ;

function XHRCorsObject(method, url, payload, opts) {
  XhrDriver.call(this, method, url, payload, opts);
}

inherits(XHRCorsObject, XhrDriver);

XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;

module.exports = XHRCorsObject;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/sender/xhr-fake.js":
/*!************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/sender/xhr-fake.js ***!
  \************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  ;

function XHRFake(/* method, url, payload, opts */) {
  var self = this;
  EventEmitter.call(this);

  this.to = setTimeout(function() {
    self.emit('finish', 200, '{}');
  }, XHRFake.timeout);
}

inherits(XHRFake, EventEmitter);

XHRFake.prototype.close = function() {
  clearTimeout(this.to);
};

XHRFake.timeout = 2000;

module.exports = XHRFake;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/sender/xhr-local.js":
/*!*************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/sender/xhr-local.js ***!
  \*************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , XhrDriver = __webpack_require__(/*! ../driver/xhr */ "../../node_modules/sockjs-client/lib/transport/browser/abstract-xhr.js")
  ;

function XHRLocalObject(method, url, payload /*, opts */) {
  XhrDriver.call(this, method, url, payload, {
    noCredentials: true
  });
}

inherits(XHRLocalObject, XhrDriver);

XHRLocalObject.enabled = XhrDriver.enabled;

module.exports = XHRLocalObject;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/websocket.js":
/*!******************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/websocket.js ***!
  \******************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils/event */ "../../node_modules/sockjs-client/lib/utils/event.js")
  , urlUtils = __webpack_require__(/*! ../utils/url */ "../../node_modules/sockjs-client/lib/utils/url.js")
  , inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__(/*! events */ "../../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , WebsocketDriver = __webpack_require__(/*! ./driver/websocket */ "../../node_modules/sockjs-client/lib/transport/browser/websocket.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:websocket');
}

function WebSocketTransport(transUrl, ignore, options) {
  if (!WebSocketTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }

  EventEmitter.call(this);
  debug('constructor', transUrl);

  var self = this;
  var url = urlUtils.addPath(transUrl, '/websocket');
  if (url.slice(0, 5) === 'https') {
    url = 'wss' + url.slice(5);
  } else {
    url = 'ws' + url.slice(4);
  }
  this.url = url;

  this.ws = new WebsocketDriver(this.url, [], options);
  this.ws.onmessage = function(e) {
    debug('message event', e.data);
    self.emit('message', e.data);
  };
  // Firefox has an interesting bug. If a websocket connection is
  // created after onunload, it stays alive even when user
  // navigates away from the page. In such situation let's lie -
  // let's not open the ws connection at all. See:
  // https://github.com/sockjs/sockjs-client/issues/28
  // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
  this.unloadRef = utils.unloadAdd(function() {
    debug('unload');
    self.ws.close();
  });
  this.ws.onclose = function(e) {
    debug('close event', e.code, e.reason);
    self.emit('close', e.code, e.reason);
    self._cleanup();
  };
  this.ws.onerror = function(e) {
    debug('error event', e);
    self.emit('close', 1006, 'WebSocket connection broken');
    self._cleanup();
  };
}

inherits(WebSocketTransport, EventEmitter);

WebSocketTransport.prototype.send = function(data) {
  var msg = '[' + data + ']';
  debug('send', msg);
  this.ws.send(msg);
};

WebSocketTransport.prototype.close = function() {
  debug('close');
  var ws = this.ws;
  this._cleanup();
  if (ws) {
    ws.close();
  }
};

WebSocketTransport.prototype._cleanup = function() {
  debug('_cleanup');
  var ws = this.ws;
  if (ws) {
    ws.onmessage = ws.onclose = ws.onerror = null;
  }
  utils.unloadDel(this.unloadRef);
  this.unloadRef = this.ws = null;
  this.removeAllListeners();
};

WebSocketTransport.enabled = function() {
  debug('enabled');
  return !!WebsocketDriver;
};
WebSocketTransport.transportName = 'websocket';

// In theory, ws should require 1 round trip. But in chrome, this is
// not very stable over SSL. Most likely a ws connection requires a
// separate SSL connection, in which case 2 round trips are an
// absolute minumum.
WebSocketTransport.roundTrips = 2;

module.exports = WebSocketTransport;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/xdr-polling.js":
/*!********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/xdr-polling.js ***!
  \********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , AjaxBasedTransport = __webpack_require__(/*! ./lib/ajax-based */ "../../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  , XdrStreamingTransport = __webpack_require__(/*! ./xdr-streaming */ "../../node_modules/sockjs-client/lib/transport/xdr-streaming.js")
  , XhrReceiver = __webpack_require__(/*! ./receiver/xhr */ "../../node_modules/sockjs-client/lib/transport/receiver/xhr.js")
  , XDRObject = __webpack_require__(/*! ./sender/xdr */ "../../node_modules/sockjs-client/lib/transport/sender/xdr.js")
  ;

function XdrPollingTransport(transUrl) {
  if (!XDRObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
}

inherits(XdrPollingTransport, AjaxBasedTransport);

XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
XdrPollingTransport.transportName = 'xdr-polling';
XdrPollingTransport.roundTrips = 2; // preflight, ajax

module.exports = XdrPollingTransport;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/xdr-streaming.js":
/*!**********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/xdr-streaming.js ***!
  \**********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , AjaxBasedTransport = __webpack_require__(/*! ./lib/ajax-based */ "../../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  , XhrReceiver = __webpack_require__(/*! ./receiver/xhr */ "../../node_modules/sockjs-client/lib/transport/receiver/xhr.js")
  , XDRObject = __webpack_require__(/*! ./sender/xdr */ "../../node_modules/sockjs-client/lib/transport/sender/xdr.js")
  ;

// According to:
//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

function XdrStreamingTransport(transUrl) {
  if (!XDRObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
}

inherits(XdrStreamingTransport, AjaxBasedTransport);

XdrStreamingTransport.enabled = function(info) {
  if (info.cookie_needed || info.nullOrigin) {
    return false;
  }
  return XDRObject.enabled && info.sameScheme;
};

XdrStreamingTransport.transportName = 'xdr-streaming';
XdrStreamingTransport.roundTrips = 2; // preflight, ajax

module.exports = XdrStreamingTransport;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/xhr-polling.js":
/*!********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/xhr-polling.js ***!
  \********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , AjaxBasedTransport = __webpack_require__(/*! ./lib/ajax-based */ "../../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  , XhrReceiver = __webpack_require__(/*! ./receiver/xhr */ "../../node_modules/sockjs-client/lib/transport/receiver/xhr.js")
  , XHRCorsObject = __webpack_require__(/*! ./sender/xhr-cors */ "../../node_modules/sockjs-client/lib/transport/sender/xhr-cors.js")
  , XHRLocalObject = __webpack_require__(/*! ./sender/xhr-local */ "../../node_modules/sockjs-client/lib/transport/sender/xhr-local.js")
  ;

function XhrPollingTransport(transUrl) {
  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
}

inherits(XhrPollingTransport, AjaxBasedTransport);

XhrPollingTransport.enabled = function(info) {
  if (info.nullOrigin) {
    return false;
  }

  if (XHRLocalObject.enabled && info.sameOrigin) {
    return true;
  }
  return XHRCorsObject.enabled;
};

XhrPollingTransport.transportName = 'xhr-polling';
XhrPollingTransport.roundTrips = 2; // preflight, ajax

module.exports = XhrPollingTransport;


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/transport/xhr-streaming.js":
/*!**********************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/transport/xhr-streaming.js ***!
  \**********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var inherits = __webpack_require__(/*! inherits */ "../../node_modules/inherits/inherits_browser.js")
  , AjaxBasedTransport = __webpack_require__(/*! ./lib/ajax-based */ "../../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  , XhrReceiver = __webpack_require__(/*! ./receiver/xhr */ "../../node_modules/sockjs-client/lib/transport/receiver/xhr.js")
  , XHRCorsObject = __webpack_require__(/*! ./sender/xhr-cors */ "../../node_modules/sockjs-client/lib/transport/sender/xhr-cors.js")
  , XHRLocalObject = __webpack_require__(/*! ./sender/xhr-local */ "../../node_modules/sockjs-client/lib/transport/sender/xhr-local.js")
  , browser = __webpack_require__(/*! ../utils/browser */ "../../node_modules/sockjs-client/lib/utils/browser.js")
  ;

function XhrStreamingTransport(transUrl) {
  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
}

inherits(XhrStreamingTransport, AjaxBasedTransport);

XhrStreamingTransport.enabled = function(info) {
  if (info.nullOrigin) {
    return false;
  }
  // Opera doesn't support xhr-streaming #60
  // But it might be able to #92
  if (browser.isOpera()) {
    return false;
  }

  return XHRCorsObject.enabled;
};

XhrStreamingTransport.transportName = 'xhr-streaming';
XhrStreamingTransport.roundTrips = 2; // preflight, ajax

// Safari gets confused when a streaming ajax request is started
// before onload. This causes the load indicator to spin indefinetely.
// Only require body when used in a browser
XhrStreamingTransport.needBody = !!global.document;

module.exports = XhrStreamingTransport;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/utils/browser-crypto.js":
/*!*******************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/utils/browser-crypto.js ***!
  \*******************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

if (global.crypto && global.crypto.getRandomValues) {
  module.exports.randomBytes = function(length) {
    var bytes = new Uint8Array(length);
    global.crypto.getRandomValues(bytes);
    return bytes;
  };
} else {
  module.exports.randomBytes = function(length) {
    var bytes = new Array(length);
    for (var i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return bytes;
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/utils/browser.js":
/*!************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/utils/browser.js ***!
  \************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

module.exports = {
  isOpera: function() {
    return global.navigator &&
      /opera/i.test(global.navigator.userAgent);
  }

, isKonqueror: function() {
    return global.navigator &&
      /konqueror/i.test(global.navigator.userAgent);
  }

  // #187 wrap document.domain in try/catch because of WP8 from file:///
, hasDomain: function () {
    // non-browser client always has a domain
    if (!global.document) {
      return true;
    }

    try {
      return !!global.document.domain;
    } catch (e) {
      return false;
    }
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/utils/escape.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/utils/escape.js ***!
  \***********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var JSON3 = __webpack_require__(/*! json3 */ "../../node_modules/json3/lib/json3.js");

// Some extra characters that Chrome gets wrong, and substitutes with
// something else on the wire.
// eslint-disable-next-line no-control-regex
var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g
  , extraLookup;

// This may be quite slow, so let's delay until user actually uses bad
// characters.
var unrollLookup = function(escapable) {
  var i;
  var unrolled = {};
  var c = [];
  for (i = 0; i < 65536; i++) {
    c.push( String.fromCharCode(i) );
  }
  escapable.lastIndex = 0;
  c.join('').replace(escapable, function(a) {
    unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    return '';
  });
  escapable.lastIndex = 0;
  return unrolled;
};

// Quote string, also taking care of unicode characters that browsers
// often break. Especially, take care of unicode surrogates:
// http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
module.exports = {
  quote: function(string) {
    var quoted = JSON3.stringify(string);

    // In most cases this should be very fast and good enough.
    extraEscapable.lastIndex = 0;
    if (!extraEscapable.test(quoted)) {
      return quoted;
    }

    if (!extraLookup) {
      extraLookup = unrollLookup(extraEscapable);
    }

    return quoted.replace(extraEscapable, function(a) {
      return extraLookup[a];
    });
  }
};


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/utils/event.js":
/*!**********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/utils/event.js ***!
  \**********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var random = __webpack_require__(/*! ./random */ "../../node_modules/sockjs-client/lib/utils/random.js");

var onUnload = {}
  , afterUnload = false
    // detect google chrome packaged apps because they don't allow the 'unload' event
  , isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime
  ;

module.exports = {
  attachEvent: function(event, listener) {
    if (typeof global.addEventListener !== 'undefined') {
      global.addEventListener(event, listener, false);
    } else if (global.document && global.attachEvent) {
      // IE quirks.
      // According to: http://stevesouders.com/misc/test-postmessage.php
      // the message gets delivered only to 'document', not 'window'.
      global.document.attachEvent('on' + event, listener);
      // I get 'window' for ie8.
      global.attachEvent('on' + event, listener);
    }
  }

, detachEvent: function(event, listener) {
    if (typeof global.addEventListener !== 'undefined') {
      global.removeEventListener(event, listener, false);
    } else if (global.document && global.detachEvent) {
      global.document.detachEvent('on' + event, listener);
      global.detachEvent('on' + event, listener);
    }
  }

, unloadAdd: function(listener) {
    if (isChromePackagedApp) {
      return null;
    }

    var ref = random.string(8);
    onUnload[ref] = listener;
    if (afterUnload) {
      setTimeout(this.triggerUnloadCallbacks, 0);
    }
    return ref;
  }

, unloadDel: function(ref) {
    if (ref in onUnload) {
      delete onUnload[ref];
    }
  }

, triggerUnloadCallbacks: function() {
    for (var ref in onUnload) {
      onUnload[ref]();
      delete onUnload[ref];
    }
  }
};

var unloadTriggered = function() {
  if (afterUnload) {
    return;
  }
  afterUnload = true;
  module.exports.triggerUnloadCallbacks();
};

// 'unload' alone is not reliable in opera within an iframe, but we
// can't use `beforeunload` as IE fires it on javascript: links.
if (!isChromePackagedApp) {
  module.exports.attachEvent('unload', unloadTriggered);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/utils/iframe.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/utils/iframe.js ***!
  \***********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var eventUtils = __webpack_require__(/*! ./event */ "../../node_modules/sockjs-client/lib/utils/event.js")
  , JSON3 = __webpack_require__(/*! json3 */ "../../node_modules/json3/lib/json3.js")
  , browser = __webpack_require__(/*! ./browser */ "../../node_modules/sockjs-client/lib/utils/browser.js")
  ;

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:utils:iframe');
}

module.exports = {
  WPrefix: '_jp'
, currentWindowId: null

, polluteGlobalNamespace: function() {
    if (!(module.exports.WPrefix in global)) {
      global[module.exports.WPrefix] = {};
    }
  }

, postMessage: function(type, data) {
    if (global.parent !== global) {
      global.parent.postMessage(JSON3.stringify({
        windowId: module.exports.currentWindowId
      , type: type
      , data: data || ''
      }), '*');
    } else {
      debug('Cannot postMessage, no parent window.', type, data);
    }
  }

, createIframe: function(iframeUrl, errorCallback) {
    var iframe = global.document.createElement('iframe');
    var tref, unloadRef;
    var unattach = function() {
      debug('unattach');
      clearTimeout(tref);
      // Explorer had problems with that.
      try {
        iframe.onload = null;
      } catch (x) {
        // intentionally empty
      }
      iframe.onerror = null;
    };
    var cleanup = function() {
      debug('cleanup');
      if (iframe) {
        unattach();
        // This timeout makes chrome fire onbeforeunload event
        // within iframe. Without the timeout it goes straight to
        // onunload.
        setTimeout(function() {
          if (iframe) {
            iframe.parentNode.removeChild(iframe);
          }
          iframe = null;
        }, 0);
        eventUtils.unloadDel(unloadRef);
      }
    };
    var onerror = function(err) {
      debug('onerror', err);
      if (iframe) {
        cleanup();
        errorCallback(err);
      }
    };
    var post = function(msg, origin) {
      debug('post', msg, origin);
      try {
        // When the iframe is not loaded, IE raises an exception
        // on 'contentWindow'.
        setTimeout(function() {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(msg, origin);
          }
        }, 0);
      } catch (x) {
        // intentionally empty
      }
    };

    iframe.src = iframeUrl;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.onerror = function() {
      onerror('onerror');
    };
    iframe.onload = function() {
      debug('onload');
      // `onload` is triggered before scripts on the iframe are
      // executed. Give it few seconds to actually load stuff.
      clearTimeout(tref);
      tref = setTimeout(function() {
        onerror('onload timeout');
      }, 2000);
    };
    global.document.body.appendChild(iframe);
    tref = setTimeout(function() {
      onerror('timeout');
    }, 15000);
    unloadRef = eventUtils.unloadAdd(cleanup);
    return {
      post: post
    , cleanup: cleanup
    , loaded: unattach
    };
  }

/* eslint no-undef: "off", new-cap: "off" */
, createHtmlfile: function(iframeUrl, errorCallback) {
    var axo = ['Active'].concat('Object').join('X');
    var doc = new global[axo]('htmlfile');
    var tref, unloadRef;
    var iframe;
    var unattach = function() {
      clearTimeout(tref);
      iframe.onerror = null;
    };
    var cleanup = function() {
      if (doc) {
        unattach();
        eventUtils.unloadDel(unloadRef);
        iframe.parentNode.removeChild(iframe);
        iframe = doc = null;
        CollectGarbage();
      }
    };
    var onerror = function(r) {
      debug('onerror', r);
      if (doc) {
        cleanup();
        errorCallback(r);
      }
    };
    var post = function(msg, origin) {
      try {
        // When the iframe is not loaded, IE raises an exception
        // on 'contentWindow'.
        setTimeout(function() {
          if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage(msg, origin);
          }
        }, 0);
      } catch (x) {
        // intentionally empty
      }
    };

    doc.open();
    doc.write('<html><s' + 'cript>' +
              'document.domain="' + global.document.domain + '";' +
              '</s' + 'cript></html>');
    doc.close();
    doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
    var c = doc.createElement('div');
    doc.body.appendChild(c);
    iframe = doc.createElement('iframe');
    c.appendChild(iframe);
    iframe.src = iframeUrl;
    iframe.onerror = function() {
      onerror('onerror');
    };
    tref = setTimeout(function() {
      onerror('timeout');
    }, 15000);
    unloadRef = eventUtils.unloadAdd(cleanup);
    return {
      post: post
    , cleanup: cleanup
    , loaded: unattach
    };
  }
};

module.exports.iframeEnabled = false;
if (global.document) {
  // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
  // huge delay, or not at all.
  module.exports.iframeEnabled = (typeof global.postMessage === 'function' ||
    typeof global.postMessage === 'object') && (!browser.isKonqueror());
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/utils/log.js":
/*!********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/utils/log.js ***!
  \********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var logObject = {};
['log', 'debug', 'warn'].forEach(function (level) {
  var levelExists;

  try {
    levelExists = global.console && global.console[level] && global.console[level].apply;
  } catch(e) {
    // do nothing
  }

  logObject[level] = levelExists ? function () {
    return global.console[level].apply(global.console, arguments);
  } : (level === 'log' ? function () {} : logObject.log);
});

module.exports = logObject;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/sockjs-client/lib/utils/object.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/utils/object.js ***!
  \***********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isObject: function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

, extend: function(obj) {
    if (!this.isObject(obj)) {
      return obj;
    }
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }
};


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/utils/random.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/utils/random.js ***!
  \***********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global crypto:true */
var crypto = __webpack_require__(/*! crypto */ "../../node_modules/sockjs-client/lib/utils/browser-crypto.js");

// This string has length 32, a power of 2, so the modulus doesn't introduce a
// bias.
var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
module.exports = {
  string: function(length) {
    var max = _randomStringChars.length;
    var bytes = crypto.randomBytes(length);
    var ret = [];
    for (var i = 0; i < length; i++) {
      ret.push(_randomStringChars.substr(bytes[i] % max, 1));
    }
    return ret.join('');
  }

, number: function(max) {
    return Math.floor(Math.random() * max);
  }

, numberString: function(max) {
    var t = ('' + (max - 1)).length;
    var p = new Array(t + 1).join('0');
    return (p + this.number(max)).slice(-t);
  }
};


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/utils/transport.js":
/*!**************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/utils/transport.js ***!
  \**************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:utils:transport');
}

module.exports = function(availableTransports) {
  return {
    filterToEnabled: function(transportsWhitelist, info) {
      var transports = {
        main: []
      , facade: []
      };
      if (!transportsWhitelist) {
        transportsWhitelist = [];
      } else if (typeof transportsWhitelist === 'string') {
        transportsWhitelist = [transportsWhitelist];
      }

      availableTransports.forEach(function(trans) {
        if (!trans) {
          return;
        }

        if (trans.transportName === 'websocket' && info.websocket === false) {
          debug('disabled from server', 'websocket');
          return;
        }

        if (transportsWhitelist.length &&
            transportsWhitelist.indexOf(trans.transportName) === -1) {
          debug('not in whitelist', trans.transportName);
          return;
        }

        if (trans.enabled(info)) {
          debug('enabled', trans.transportName);
          transports.main.push(trans);
          if (trans.facadeTransport) {
            transports.facade.push(trans.facadeTransport);
          }
        } else {
          debug('disabled', trans.transportName);
        }
      });
      return transports;
    }
  };
};


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/utils/url.js":
/*!********************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/utils/url.js ***!
  \********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var URL = __webpack_require__(/*! url-parse */ "../../node_modules/url-parse/index.js");

var debug = function() {};
if (false) {
  debug = require('debug')('sockjs-client:utils:url');
}

module.exports = {
  getOrigin: function(url) {
    if (!url) {
      return null;
    }

    var p = new URL(url);
    if (p.protocol === 'file:') {
      return null;
    }

    var port = p.port;
    if (!port) {
      port = (p.protocol === 'https:') ? '443' : '80';
    }

    return p.protocol + '//' + p.hostname + ':' + port;
  }

, isOriginEqual: function(a, b) {
    var res = this.getOrigin(a) === this.getOrigin(b);
    debug('same', a, b, res);
    return res;
  }

, isSchemeEqual: function(a, b) {
    return (a.split(':')[0] === b.split(':')[0]);
  }

, addPath: function (url, path) {
    var qs = url.split('?');
    return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
  }

, addQuery: function (url, q) {
    return url + (url.indexOf('?') === -1 ? ('?' + q) : ('&' + q));
  }
};


/***/ }),

/***/ "../../node_modules/sockjs-client/lib/version.js":
/*!******************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/sockjs-client/lib/version.js ***!
  \******************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = '1.1.4';


/***/ }),

/***/ "../../node_modules/strip-ansi/index.js":
/*!*********************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/strip-ansi/index.js ***!
  \*********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ "../../node_modules/ansi-regex/index.js")();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),

/***/ "../../node_modules/url-parse/index.js":
/*!********************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/url-parse/index.js ***!
  \********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var required = __webpack_require__(/*! requires-port */ "../../node_modules/requires-port/index.js")
  , qs = __webpack_require__(/*! querystringify */ "../../node_modules/url-parse/node_modules/querystringify/index.js")
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
function lolcation(loc) {
  loc = loc || global.location || {};

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @api private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @api private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL}
 * @api public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

URL.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = qs;

module.exports = URL;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/url-parse/node_modules/querystringify/index.js":
/*!************************************************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/url-parse/node_modules/querystringify/index.js ***!
  \************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    if (key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),

/***/ "../../node_modules/url/url.js":
/*!************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/url/url.js ***!
  \************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(/*! punycode */ "../../node_modules/node-libs-browser/node_modules/punycode/punycode.js");
var util = __webpack_require__(/*! ./util */ "../../node_modules/url/util.js");

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(/*! querystring */ "../../node_modules/querystring-es3/index.js");

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),

/***/ "../../node_modules/url/util.js":
/*!*************************************************************************************************!*\
  !*** /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/url/util.js ***!
  \*************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),

/***/ "../../node_modules/webpack/buildin/amd-options.js":
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),

/***/ "../../node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "../../node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var App = function (_Component) {
  _inherits(App, _Component);

  function App() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref, [this].concat(args))), _this), _this.state = { clicks: 0 }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'section',
        null,
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'header',
          null,
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'h1',
            null,
            'Hydrating The Client'
          )
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'main',
          null,
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'p',
            null,
            'Clicks ',
            this.state.clicks
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'button',
            {
              onClick: function onClick() {
                return _this2.setState(function (state) {
                  return { clicks: state.clicks + 1 };
                });
              }
            },
            'Click Me'
          )
        )
      );
    }
  }]);

  return App;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (App);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(/*! react-dom */ "../../node_modules/react-dom/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App__ = __webpack_require__(/*! ./App */ "./src/App.js");





Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["hydrate"])(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__App__["a" /* default */], null), document.getElementById('root'));

/***/ }),

/***/ 0:
/*!*****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** multi /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-scripts/config/polyfills.js /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-dev-utils/webpackHotDevClient.js ./src/index.js ***!
  \*****************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-scripts/config/polyfills.js */"../../node_modules/react-scripts/config/polyfills.js");
__webpack_require__(/*! /Users/adamboduch/projects/React-and-React-Native/second-edition/node_modules/react-dev-utils/webpackHotDevClient.js */"../../node_modules/react-dev-utils/webpackHotDevClient.js");
module.exports = __webpack_require__(/*! /Users/adamboduch/projects/React-and-React-Native/second-edition/Chapter10/frontend-reconciliation/src/index.js */"./src/index.js");


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map