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
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
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
/******/ 	var hotCurrentHash = "4254c5a3172b5a3a8d26"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotMainModule = true; // eslint-disable-line no-unused-vars
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
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			hotMainModule = false;
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, (function(name) {
/******/ 					return {
/******/ 						configurable: true,
/******/ 						enumerable: true,
/******/ 						get: function() {
/******/ 							return __webpack_require__[name];
/******/ 						},
/******/ 						set: function(value) {
/******/ 							__webpack_require__[name] = value;
/******/ 						}
/******/ 					};
/******/ 				}(name)));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
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
/******/ 			_main: hotMainModule,
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
/******/ 		hotMainModule = true;
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
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 	
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
/******/ 			var chunkId = 6;
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
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
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
/******/ 				}
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
/******/ 					}
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
/******/ 						}
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
/******/ 					appliedUpdate[moduleId] = function() {
/******/ 						console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 					};
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
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					dependency = moduleOutdatedDependencies[j];
/******/ 					idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
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
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
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
/******/ 								orginalError: err
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
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
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
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(110)(__webpack_require__.s = 110);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ },

/***/ 11:
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function () {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for (var i = 0; i < this.length; i++) {
			var item = this[i];
			if (item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

/***/ },

/***/ 110:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-06-06
 * @description 本文件用于方便复制粘贴入口文件之用，请更新这里的说明
 *              另外，考虑到一般是放在js/src/pages/page-name/main.js，因此使用../../
 *              如果不是这个目录，请更改成正确的相对路径
 */
//----------------require--------------
// var viewport = require("mmlib/dom/viewport"); // viewport
var base = __webpack_require__(33); // 基础对象
var URL = __webpack_require__(71); // 基础对象
var parsePage = __webpack_require__(69); // 页面模块自动解析
var scss = __webpack_require__(58); // 引入当前页面的scss文件
// 模板
var render = __webpack_require__(65); // 页面总模板
var viewport = __webpack_require__(70);
// 子模块
// var header = require("./header");

//-----------声明模块全局变量-------------
var nodeList = null; // 存储所有id符合m-xxx的节点
var opts = pageConfig; // 请不要直接使用pageConfig
// var m_header = null;

//-------------事件响应声明---------------
var evtFuncs = {};

//-------------子模块实例化---------------
var initMod = function () {}

// m_header = header(nodeList.header, opts);
// m_header.init();

// 所有模块的模板render应该是由外部传进去，而不是内部直接require，主要是考虑到复用性
// 这里的模板并不是模块的模板，而是内部需要动态生成东西时用的模板，模块的模板在main.ejs已经写进去了
// 以下是示例
// m_header = header(nodeList.header, {
//     render: headerRender
// });

// m_header = header(nodeList.header, {
//     renders: {
//         "main": headerRender
//     }
// });


//-------------绑定事件------------------
;var bindEvents = function () {};

//-------------自定义函数----------------
var custFuncs = {};

//-------------一切从这开始--------------
!function () {
    // 初始化viewport
    viewport.init();
    // 先将HTML插入body
    document.body.insertAdjacentHTML('AfterBegin', render());

    // 找到所有带有id的节点，并将m-xxx-xxx转化成xxxXxx格式存储到nodeList中
    nodeList = parsePage();
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();
}();

/***/ },

/***/ 33:
/***/ function(module, exports) {

/**
 * 定义了组件的基本代码功能
 * 例子：
 * var compBase = require("../comp/base");
 * var uniqueId = compBase.getUniqueId(); // 获取一个组件机制内不重复的数字ID，从0开始递增
 * var zIndex = compBase.getZIndex(); // 获取一个组件机制内不重复的zindex，从10000开始递增
 * var that = compBase(); // 获取一个组件实例，可以对其进行扩展。
 *
 * 全局锁机制的使用：在一些异步操作的按钮响应，经常会限制用户在响应期间只允许点击一次，那么可以使用锁。
 * that.lock(); // 所有组件实例的锁状态都被设置为true
 * if (that.isLock()) { .... } // 检查全局锁的状态是否为锁定，如果锁定则可能返回不做处理，要注意，你可以无视它继续做其它操作。
 * that.unLock(); // 解锁。注意锁定后一定要在所有的流程走向都有解锁操作，以防止死锁。
 *
 * 自定义事件模型： 建立了一个简单的事件模型，拥有绑定、解绑以及触发功能
 * 注意：由于JS的封装机制只有公开和私有，触发事件只能定义为公开方法，否则无法给扩展后的对象使用
 * 因此外部是可以调用，但事实上它只应该在内部被调用用于触发指定的事件
 * var myComp = XXComp(); // 扩展自base的某个组件实例
 *
 * myComp.bind("finish", function(evt) {
 *    console.log(evt.type); // 事件的名称，应该为finish
 *    console.log(evt.target); // 事件来源对象，应该为myComp对象，由于响应函数可能被指定给多个对象的事件，因此它可以得到触发事件的对象
 *    console.log(evt.data); // 事件触发的时候送过来的数据
 * });
 *
 * 在myComp的实现代码中，可以这样触发事件：
 * var that = compBase();
 *
 * that.fire("finish", {
 *     name: "benny",
 *     gender: "M"
 * });
 *
 * 这样子在响应函数中读取到的evt.data的值就是这个{ name: "benny", gender: "M" }，它并不是必须的
 */
var isLock = false;

module.exports = function () {
    var events = {};
    var that = {};

    that.bind = function (evtType, handler) {
        if (typeof handler != "function") {
            return;
        }

        if (!(evtType in events)) {
            events[evtType] = [];
        }

        events[evtType].forEach(function (item) {
            if (item === handler) {
                return;
            }
        });

        events[evtType].push(handler);
    };

    that.unbind = function (evtType, handler) {
        if (!(evtType in events)) {
            return;
        }

        events[evtType].forEach(function (item, index) {
            if (item === handler) {
                events[evtType].splice(index, 1);
                return;
            }
        });
    };

    that.fire = function (evtType, data) {
        if (!(evtType in events)) {
            return;
        }

        events[evtType].forEach(function (item, index) {
            var evt = {
                type: evtType,
                target: that,
                data: data
            };

            item(evt);
        });
    };

    that.isLock = function () {
        return isLock;
    };

    that.lock = function () {
        isLock = true;
    };

    that.unLock = function () {
        isLock = false;
    };

    return that;
};

/***/ },

/***/ 41:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/* 图片版本号 在image-path函数中调用 */\n/* 非标注中的序号的颜色，以00开始编号，保证数字编号与设计图标注的标号一致。*/\n/* 背景颜色 */\n/*frame顶部的透明色*/\n/* 字体颜色 */\n/* 字体大小 */\n/* 字体序号数字为rem值的小数，即1.8rem则为$font_size_8 */\n/* 边框颜色 */\n/* 图片地址统一使用本函数生成，同时支持版本号 */\n/**\n * 注意：\n *       关于单位，pcweb使用px，移动端使用rem，使用时注意修改body中的font-size（或者其它位置的相应单位）\n */\n/**\n * Eric Meyer's Reset CSS v2.0 (http://meyerweb.com/eric/tools/css/reset/)\n * http://cssreset.com\n */\nhtml,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font: inherit;\n  font-size: 100%;\n  vertical-align: middle; }\n\n/*去除安卓高亮边框*/\n* {\n  -webkit-tap-highlight-color: transparent; }\n\ndiv:focus,\na:focus,\ninput:focus {\n  -webkit-tap-highlight-color: transparent; }\n\ndiv:active,\na:active,\ninput:active {\n  -webkit-tap-highlight-color: transparent; }\n\n/* HTML5 display-role reset for older browsers */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block; }\n\nhtml {\n  color: #333;\n  height: 100%;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n   -ms-user-select: none;\n       user-select: none;\n  font-size: 3.125vmin; }\n\n/*防止在webkit下出现font boosting*/\n* {\n  max-height: 999999px; }\n\n/*debuggap太小了，所以给弄大点，好点些*/\n#debuggapRoot .dg-out {\n  width: 5rem !important;\n  height: 5rem !important;\n  border-radius: 50% !important; }\n\n#debuggapRoot .dg-inner {\n  width: 4rem !important;\n  height: 4rem !important;\n  border-radius: 50% !important;\n  margin: 0.5rem !important; }\n\n/*@media only screen and (-webkit-min-device-pixel-ratio: 3) {\n    html { font-size: 15px; }\n}*/\nbody {\n  font-size: 12px;\n  line-height: 1.5;\n  font-family: \"-apple-system\", \"Heiti SC\", \"Helvetica\", \"Helvetica Neue\", \"Droid Sans Fallback\", \"Droid Sans\";\n  height: auto;\n  min-height: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -webkit-user-select: none;\n  /* background: $bg7; */ }\n  body.not-flex {\n    display: block; }\n\nol,\nul {\n  list-style: none; }\n\nblockquote,\nq {\n  quotes: none; }\n\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: ''; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\na {\n  text-decoration: none; }\n\na:focus {\n  outline: none; }\n\ninput,\ntextarea,\nbutton,\na {\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0); }\n\nbody {\n  -webkit-text-size-adjust: none;\n  /*-webkit-user-select:none;*/ }\n\na,\nimg {\n  /*-webkit-touch-callout: none;*/\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0); }\n\ninput:focus {\n  outline: none; }\n\n/* ------------- reset end --------------- */\n/* 滚动不顺时用 */\n.scrolling {\n  -webkit-overflow-scrolling: touch; }\n\n/* 布局继承专用 */\n.flex-row, .flex-column, .m-stretch-swiper {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex; }\n\n.flex-column, .m-stretch-swiper {\n  -webkit-box-orient: vertical;\n  -ms-flex-direction: column;\n      flex-direction: column; }\n\n.flex-item, .m-stretch-swiper > .swiper-wrapper {\n  -webkit-box-flex: 1;\n  -ms-flex: 1;\n      flex: 1; }\n\n.flex-vertical-middle {\n  /* 09版 */\n  -webkit-box-align: center;\n  /* 12版 */\n  -ms-flex-align: center;\n      align-items: center; }\n\n/* 自动伸展高度的swiper，如果不知道怎么使用，可以参考幸福蓝海buyTicket.html */\n/* 由于使用了父级容器使用了flex:1，swiper无法使用height:100%;来让高度起效，导致高度为0，可以用这个解决 */\n.m-stretch-swiper {\n  /*\n    可能需要在这里写：\n    @extend .flex-item;\n    width: 100%;\n    让宽度变成100%，并且高度撑开\n     */ }\n  .m-stretch-swiper > .swiper-wrapper {\n    -webkit-box-align: stretch;\n    -ms-flex-align: stretch;\n        align-items: stretch; }\n    .m-stretch-swiper > .swiper-wrapper > .swiper-slide {\n      height: auto; }\n\n/* 多行加省略号 */\n/* 单行加省略号 */\n.single-line-clamp {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  word-break: break-all; }\n\n/*flex布局下，文字溢出省略*/\n.ellipsis {\n  display: -webkit-box;\n  /*这是一个已经弃用的属性*/\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n\n/* 设置盒子模型为IE盒子模型 */\n.border-box {\n  box-sizing: border-box; }\n\nbody header {\n  height: 80px;\n  border: solid 1px black; }\n\n.m-layer {\n  position: absolute;\n  width: 12rem;\n  height: 12rem;\n  background-color: white; }\n", ""]);

// exports


/***/ },

/***/ 51:
/***/ function(module, exports) {

/**
 * 检查传入的对象
 * 如果是null则返回null(typeof null是返回object)
 * 如果是数组则返回array(typeof []是返回object)
 *
 * var getType = require("../util/getType");
 * var type = getType([]); // array
 */
module.exports = function (obj) {
  var type;
  return ((type = typeof obj) == "object" ? obj == null && "null" || Object.prototype.toString.call(obj).slice(8, -1) : type).toLowerCase();
};

/***/ },

/***/ 58:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(41);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(10)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(41, function() {
			var newContent = __webpack_require__(41);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 65:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<h1 style="font-size: 1rem">133333ss333sssssssddcdaaaaaa6666666666623333</h1>';

}
return __p
}

/***/ },

/***/ 69:
/***/ function(module, exports) {

module.exports = function (node) {
    var list = Array.prototype.slice.call(document.querySelectorAll("[id]"), 0);
    var reg = /^m(\-[a-z][a-z0-9]+)+$/i;
    var nodeList = {};

    list.forEach(function (el) {
        if (!reg.test(el.id)) {
            console.warn("节点#" + el.id + "的id值不符合规范，被忽略!");
            return;
        }

        var id = el.id.substr(2).toLowerCase().replace(/\-([a-z])/g, function (m, n) {
            return n.toUpperCase();
        });

        nodeList[id] = el;
    });

    return nodeList;
};

/***/ },

/***/ 70:
/***/ function(module, exports) {

/**
 * 允许强制将设置倍数为 1
 *
 * 其实就是动态设置meta以及HMTL的font-size
 */

var that = module.exports;
var inited = false;
var win = window;
var doc = document;
var rootEl = doc.documentElement;
var isAndroid = win.navigator.appVersion.match(/android/gi);
var isIPhone = win.navigator.appVersion.match(/iphone/gi);

that.init = function (absDpr) {
    if (inited) return;
    var header = doc.getElementsByTagName("head")[0];
    var viewport = doc.createElement("meta");
    var devicePixelRatio = win.devicePixelRatio;
    var dpr = absDpr || devicePixelRatio;
    var tid = null;
    inited = true;

    if (isIPhone && absDpr !== null) {
        // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
        if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
            dpr = 3;
        } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
            dpr = 2;
        } else {
            dpr = 1;
        }
    } else {
        // 其他设备下，仍旧使用1倍的方案
        // 如果设置了absDpr则使用absDpr
        dpr = absDpr || 1;
    }

    var scale = 1 / dpr;
    rootEl.setAttribute("data-dpr", dpr);
    rootEl.setAttribute("data-device-type", isIPhone ? "iphone" : isAndroid ? "android" : "other");
    viewport.name = "viewport";
    viewport.content = "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no";
    header.appendChild(viewport);

    try {
        var vMin = doc.createElement("div");
        vMin.style.width = "1px";
        vMin.style.width = "1vmin";
        document.body.appendChild(vMin);
        if (vMin.offsetWidth > 1) {
            document.body.removeChild(vMin);
            rootEl.style.fontSize = "3.125vmin";
            //getComputedStyle获取当前元素的各种css值
            rootEl.style.fontSize = window.getComputedStyle(rootEl, null).fontSize;
            if (rootEl.style.fontSize.indexOf("px") != -1) return;
        }
    } catch (e) {}

    function refreshRem() {
        var width = doc.documentElement.clientWidth;
        var height = doc.documentElement.clientHeight;
        if (width == 0 || !width) {
            width = rootEl.getBoundingClientRect().width;
        }
        var rem = Math.min(width, height) / 320 * 10;
        rootEl.style.fontSize = rem + "px";
    }

    win.addEventListener('resize', function () {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    refreshRem();
};

that.px2rem = function (px) {
    return px / that.rem();
};

that.rem2px = function (rem) {
    return rem * that.rem();
};

that.rem = function () {
    return parseFloat(window.getComputedStyle(rootEl, null).fontSize, 10);
};

that.currentDpr = function () {
    return rootEl.hasAttribute("data-dpr") ? parseInt(rootEl.hasAttribute("data-dpr"), 10) : devicePixelRatio;
};

that.isAndroid = function () {
    return isAndroid;
};

that.isIPhone = function () {
    return isIPhone;
};

that.getDeviceType = function () {
    return isIPhone ? "iphone" : isAndroid ? "android" : "other";
};

/***/ },

/***/ 71:
/***/ function(module, exports, __webpack_require__) {

/**
 * URL的解析和合成，注意：该设计有缺陷，不支持username:userpass，不过一般都用不上
 *
 * var URL = require("../util/URL");
 * var urlObj = URL.parse("http://www.baidu.com:8080/index.html?p=1#link1");
 * 得到：
 * {
 *     hash: "link1",
 *     host: "www.baidu.com",
 *     path: "/index.html",
 *     port: "8080",
 *     query: "p=1",
 *     scheme: "http:",
 *     slash: "//",
 *     url: "http://www.baidu.com:8080/index.html?p=1#link1"
 * }
 */
var link = null;
var merge = __webpack_require__(95);
var isEmpty = __webpack_require__(97);
var queryToJson = __webpack_require__(96);
module.exports = {
    parse: function (url) {

        link = link || document.createElement("A");
        link.href = url;

        var result = {
            "url": url,
            "scheme": link.protocol,
            "host": link.host,
            "port": link.port,
            "path": link.pathname,
            "query": isEmpty(link.search) ? "" : link.search.substr(1),
            "hash": isEmpty(link.hash) ? "" : link.hash.substr(1)
        };

        result["queryJson"] = queryToJson(result["query"]);
        result["hashJson"] = queryToJson(result["hash"]);
        return result;

        // var parse_url = /^(?:([A-Za-z]+:)(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:(\.?[\.\/]*\/[^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        // var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
        // var results = parse_url.exec(url);
        // var ret = {};

        // for (var i = 0, len = names.length; i < len; i += 1) {
        //     ret[names[i]] = results[i] || '';
        // }

        // return ret;
    },
    build: function (url) {
        return url.scheme + "//" + url.host + (url.port != "" ? ":" + url.port : "") + url.path + (url.query != "" ? "?" + url.query : "") + (url.hash != "" ? "#" + url.hash : "");
    }
};

/***/ },

/***/ 94:
/***/ function(module, exports) {

/**
 * 对window.console做了封装，防止由于没有删除console语句而报错
 * 如果需要使用到console对象，请引入本文件，而不要直接使用window.console
 *
 */

var methods = ["log", "debug", "info", "warn", "exception", "assert", "dir", "dirxml", "trace", "group", "groupCollapsed", "groupEnd", "profile", "profileEnd", "count", "clear", "time", "timeEnd", "timeStamp", "table", "error", "markTimeline", "timeline", "timelineEnd", "cd", "countReset", "select"];

var console = window.console || {};
var emptyFunc = function () {};

for (var key in methods) {
    if (!(methods[key] in console)) {
        console[methods[key]] = emptyFunc;
    }
}

module.exports = console;

/***/ },

/***/ 95:
/***/ function(module, exports, __webpack_require__) {

/**
 * 合并多个对象，将后面的对象和前面的对象一层一层的合并
 * 支持第一个参数传boolean类型，当传true时，支持深层合并
 * 例子：
 *
 * var merge = require("../json/merge");
 * var opts = { url: "http://www.baidu.com" };
 * var defaultOpts = { url: "", method: "get" };
 * opts = merge(defaultOpts, opts);
 * opts的值为：
 * opts = {
 *     url: "http://www.baidu.com",
 *     method: "get"
 * }
 *
 */

var getType = __webpack_require__(51);
var console = __webpack_require__(94);
var each = __webpack_require__(98);

module.exports = function () {

    var result = [];
    var args = [].slice.call(arguments);
    result.push.apply(result, args);

    var deep = false;

    function mergeObj(r, obj) {
        each(obj, function (v, k) {
            if (deep && (getType(r[k]) == "object" && getType(v) == "object" || getType(r[k]) == "array" && getType(v) == "array")) {
                mergeObj(r[k], v);
            } else {
                r[k] = v;
            }
        });
    }

    var newObj = {};

    each(result, function (item, index) {
        if (index == 0 && item === true) {
            deep = true;
        } else if (getType(item) == "object") {
            mergeObj(newObj, item);
        }
    });

    return newObj;
};

/***/ },

/***/ 96:
/***/ function(module, exports) {

/**
 * 来自STK.js
 * 将查询字符串转化成json对象，是jsonToQuery的反操作
 * 例子：
 *
 * var queryToJson = require("../json/jsonToQuery");
 * var str = "id=1&name=benny";
 * var json = queryToJson(str);
 * json的值将为：
 * json = { id: 1, name: "benny" };
 *
 */
module.exports = function (qs) {
    var qList = qs.toString().trim().split("&"),
        json = {},
        i = 0,
        len = qList.length;

    for (; i < len; i++) {
        if (qList[i]) {
            var hash = qList[i].split("="),
                key = hash[0],
                value = hash[1];
            // 如果只有key没有value, 那么将全部丢入一个$nullName数组中
            if (hash.length < 2) {
                value = key;
                key = '$nullName';
            }
            if (!(key in json)) {
                // 如果缓存堆栈中没有这个数据，则直接存储
                json[key] = decodeURIComponent(value);
            } else {
                // 如果堆栈中已经存在这个数据，则转换成数组存储
                json[key] = [].concat(json[key], decodeURIComponent(value));
            }
        }
    }
    return json;
};

/***/ },

/***/ 97:
/***/ function(module, exports) {

/**
 * 检查字符串是否为空
 *
 * var isEmpty = require("../str/isEmpty");
 * console.log(isEmpty(null)); // true
 * console.log(isEmpty(" ")); // true
 *
 */
module.exports = function (str) {
  str = str || '';
  return str.trim().length == 0;
};

/***/ },

/***/ 98:
/***/ function(module, exports, __webpack_require__) {

/**
 * 遍历对象或者数组的键值并传给回调函数
 * 例子：
 *
 * var each = require("../util/each");
 * var obj = { id: 1, name: "benny" };
 * each(obj, function(val, key, source) {
 *    console.log("值为:" + val, "key为" + key);
 *    console.log("被遍历的源对象是", source); // 即obj
 * });
 */

var getType = __webpack_require__(51);
module.exports = function (obj, fn) {
    if (getType(obj) == "array") {
        if ([].forEach) {
            [].forEach.call(obj, fn);
        } else {
            var len = obj.length;
            for (var i = 0; i < len; i++) {
                if (/msie [678]\./i.test(navigator.userAgent) || obj.hasOwnProperty(i)) {
                    if (fn(obj[i], i, obj) === false) {
                        break;
                    }
                }
            }
        }
    } else {
        for (var k in obj) {
            if (/msie [678]\./i.test(navigator.userAgent) || obj.hasOwnProperty(k)) {
                if (fn(obj[k], k, obj) === false) {
                    break;
                }
            }
        }
    }
};

/***/ }

/******/ });