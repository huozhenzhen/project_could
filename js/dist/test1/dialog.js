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
/******/ 	var hotCurrentHash = "d00f43a7e479a98dec89"; // eslint-disable-line no-unused-vars
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
/******/ 			var chunkId = 1;
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
/******/ 	return hotCreateRequire(109)(__webpack_require__.s = 109);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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

var getType = __webpack_require__(1);
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

/***/ },
/* 1 */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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
 * 	  console.log(evt.type); // 事件的名称，应该为finish
 * 	  console.log(evt.target); // 事件来源对象，应该为myComp对象，由于响应函数可能被指定给多个对象的事件，因此它可以得到触发事件的对象
 * 	  console.log(evt.data); // 事件触发的时候送过来的数据
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
__webpack_require__(13); // 如果使用IE8的话
var console = __webpack_require__(3);
var each = __webpack_require__(0);

var getUniqueId = function () {
    var uniqueID = 0;
    var prefix = "LIVE_COMP_";

    return function () {
        return prefix + uniqueID++;
    };
}();

var getZIndex = function () {
    var zIndex = 10000;

    return function () {
        return zIndex++;
    };
}();

var isLock = false;

var base = function () {
    var that = {};
    var events = {};

    that.bind = function (evtType, handler) {
        if (typeof handler != "function") {
            return;
        }

        if (!(evtType in events)) {
            events[evtType] = [];
        }

        each(events[evtType], function (item, index) {
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

        each(events[evtType], function (item, index) {
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

        each(events[evtType], function (item, index) {
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

base.getUniqueId = getUniqueId;
base.getZIndex = getZIndex;

module.exports = base;

/***/ },
/* 3 */
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
/* 4 */
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

var getType = __webpack_require__(1);
var console = __webpack_require__(3);
var each = __webpack_require__(0);

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var sizzle = __webpack_require__(7);

module.exports = function (node, onlyChild) {
    var list = Array.prototype.slice.call(sizzle((onlyChild === true ? "> " : "") + "[node-name]", node), 0);
    var nodeList = {};

    list.forEach(function (el) {
        var name = el.getAttribute("node-name");

        if (name in nodeList) {
            nodeList[name] = [].concat(nodeList[name], el);
        } else {
            nodeList[name] = el;
        }
    });

    return nodeList;
};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 为一个节点或者节点数组添加事件
 * @2014-10-11 增加了批量处理功能，可以传入一个节点数组绑定事件
 *
 * var addEvent = require("../evt/add");
 * var removeEvent = require("../evt/remove");
 * var stopEvent = require("../evt/stop");
 * var sizzle = require("../dom/sizzle");
 * var handler = function(evt) {
 *     stopEvent(evt); // 阻止事件冒泡以及默认事件行为
 *     removeEvent(nodes, "click", handler); // 将addEvent时的参数原样不动传给removeEvent，可以解除事件
 * }
 *
 * var nodes = sizzle(".nodes", parentNode); // 获取到parentNode中所有class为nodes的节点，返回一个数组
 * addEvent(nodes, "click", handler); // 为数组nodes中所有的节点绑定click事件
 * // 仅绑定一个可以只传入一个节点，而不是数组：addEvent(nodes[0], "click", hanlder);
 *
 *
 */

var getType = __webpack_require__(1);
var each = __webpack_require__(0);

var addEvent = function (el, type, fn, setCapture) {
    if (getType(el) == "array") {
        var fun = addEvent;

        each(el, function (item, key) {
            fun(item, type, fn, setCapture);
        });
    }

    el = getType(el) == "string" ? document.getElementById(el) : el;

    if (el == null || typeof fn != "function") {
        return false;
    }

    if (el.addEventListener) {
        el.addEventListener(type, fn, setCapture === true ? true : false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn);
        //锁定el    setCapture
        if (setCapture && el.setCapture) {
            el.setCapture();
        }
    } else {
        el['on' + type] = fn;
        if (setCapture && el.setCapture) {
            el.setCapture();
        }
    }

    return true;
};

module.exports = addEvent;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 来自jquery的sizzle查询器，注意查询得到的值永远是一个数组
 * 与jquery的用法对比：
 *
 * jquery:
 *    var nodes = $(".class1"); // 返回了一个被jquery包装过的对象
 *
 * sizzle:
 *    var sizzle = require("../dom/sizzle");
 *    var nodes = sizzle(".class1"); // 返回一个数组，每个元素都是获取到的原始的DOM元素。
 *    var nodes = sizzle("#node1"); // 返回一个数组，仅有一个元素，并且这个元素的ID为node1
 *
 */

var getStyle = __webpack_require__(10);
var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
    done = 0,
    toString = Object.prototype.toString,
    hasDuplicate = false,
    baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function () {
    baseHasDuplicate = false;
    return 0;
});

var Sizzle = function (selector, context, results, seed) {
    results = results || [];
    context = context || document;

    var origContext = context;

    if (context.nodeType !== 1 && context.nodeType !== 9) {
        return [];
    }

    if (!selector || typeof selector !== "string") {
        return results;
    }

    var parts = [],
        m,
        set,
        checkSet,
        extra,
        prune = true,
        contextXML = Sizzle.isXML(context),
        soFar = selector,
        ret,
        cur,
        pop,
        i;

    // Reset the position of the chunker regexp (start from head)
    do {
        chunker.exec("");
        m = chunker.exec(soFar);

        if (m) {
            soFar = m[3];

            parts.push(m[1]);

            if (m[2]) {
                extra = m[3];
                break;
            }
        }
    } while (m);

    if (parts.length > 1 && origPOS.exec(selector)) {
        if (parts.length === 2 && Expr.relative[parts[0]]) {
            set = posProcess(parts[0] + parts[1], context);
        } else {
            set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);

            while (parts.length) {
                selector = parts.shift();

                if (Expr.relative[selector]) {
                    selector += parts.shift();
                }

                set = posProcess(selector, set);
            }
        }
    } else {
        // Take a shortcut and set the context if the root selector is an ID
        // (but not if it'll be faster if the inner selector is an ID)
        if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
            ret = Sizzle.find(parts.shift(), context, contextXML);
            context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
        }

        if (context) {
            ret = seed ? {
                expr: parts.pop(),
                set: makeArray(seed)
            } : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
            set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;

            if (parts.length > 0) {
                checkSet = makeArray(set);
            } else {
                prune = false;
            }

            while (parts.length) {
                cur = parts.pop();
                pop = cur;

                if (!Expr.relative[cur]) {
                    cur = "";
                } else {
                    pop = parts.pop();
                }

                if (pop == null) {
                    pop = context;
                }

                Expr.relative[cur](checkSet, pop, contextXML);
            }
        } else {
            checkSet = parts = [];
        }
    }

    if (!checkSet) {
        checkSet = set;
    }

    if (!checkSet) {
        Sizzle.error(cur || selector);
    }

    if (toString.call(checkSet) === "[object Array]") {
        if (!prune) {
            results.push.apply(results, checkSet);
        } else if (context && context.nodeType === 1) {
            for (i = 0; checkSet[i] != null; i++) {
                if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
                    results.push(set[i]);
                }
            }
        } else {
            for (i = 0; checkSet[i] != null; i++) {
                if (checkSet[i] && checkSet[i].nodeType === 1) {
                    results.push(set[i]);
                }
            }
        }
    } else {
        makeArray(checkSet, results);
    }

    if (extra) {
        Sizzle(extra, origContext, results, seed);
        Sizzle.uniqueSort(results);
    }

    return results;
};

Sizzle.uniqueSort = function (results) {
    if (sortOrder) {
        hasDuplicate = baseHasDuplicate;
        results.sort(sortOrder);

        if (hasDuplicate) {
            for (var i = 1; i < results.length; i++) {
                if (results[i] === results[i - 1]) {
                    results.splice(i--, 1);
                }
            }
        }
    }

    return results;
};

Sizzle.matches = function (expr, set) {
    return Sizzle(expr, null, null, set);
};

Sizzle.find = function (expr, context, isXML) {
    var set;

    if (!expr) {
        return [];
    }

    for (var i = 0, l = Expr.order.length; i < l; i++) {
        var type = Expr.order[i],
            match;

        if (match = Expr.leftMatch[type].exec(expr)) {
            var left = match[1];
            match.splice(1, 1);

            if (left.substr(left.length - 1) !== "\\") {
                match[1] = (match[1] || "").replace(/\\/g, "");
                set = Expr.find[type](match, context, isXML);
                if (set != null) {
                    expr = expr.replace(Expr.match[type], "");
                    break;
                }
            }
        }
    }

    if (!set) {
        set = context.getElementsByTagName("*");
    }

    return {
        set: set,
        expr: expr
    };
};

Sizzle.filter = function (expr, set, inplace, not) {
    var old = expr,
        result = [],
        curLoop = set,
        match,
        anyFound,
        isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

    while (expr && set.length) {
        for (var type in Expr.filter) {
            if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
                var filter = Expr.filter[type],
                    found,
                    item,
                    left = match[1];
                anyFound = false;

                match.splice(1, 1);

                if (left.substr(left.length - 1) === "\\") {
                    continue;
                }

                if (curLoop === result) {
                    result = [];
                }

                if (Expr.preFilter[type]) {
                    match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);

                    if (!match) {
                        anyFound = found = true;
                    } else if (match === true) {
                        continue;
                    }
                }

                if (match) {
                    for (var i = 0; (item = curLoop[i]) != null; i++) {
                        if (item) {
                            found = filter(item, match, i, curLoop);
                            var pass = not ^ !!found;

                            if (inplace && found != null) {
                                if (pass) {
                                    anyFound = true;
                                } else {
                                    curLoop[i] = false;
                                }
                            } else if (pass) {
                                result.push(item);
                                anyFound = true;
                            }
                        }
                    }
                }

                if (found !== undefined) {
                    if (!inplace) {
                        curLoop = result;
                    }

                    expr = expr.replace(Expr.match[type], "");

                    if (!anyFound) {
                        return [];
                    }

                    break;
                }
            }
        }

        // Improper expression
        if (expr === old) {
            if (anyFound == null) {
                Sizzle.error(expr);
            } else {
                break;
            }
        }

        old = expr;
    }

    return curLoop;
};

Sizzle.error = function (msg) {
    throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = {
    order: ["ID", "NAME", "TAG"],
    match: {
        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
        CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
    },
    leftMatch: {},
    attrMap: {
        "class": "className",
        "for": "htmlFor"
    },
    attrHandle: {
        href: function (elem) {
            return elem.getAttribute("href");
        }
    },
    relative: {
        "+": function (checkSet, part) {
            var isPartStr = typeof part === "string",
                isTag = isPartStr && !/\W/.test(part),
                isPartStrNotTag = isPartStr && !isTag;

            if (isTag) {
                part = part.toLowerCase();
            }

            for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                if (elem = checkSet[i]) {
                    while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}

                    checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part;
                }
            }

            if (isPartStrNotTag) {
                Sizzle.filter(part, checkSet, true);
            }
        },
        ">": function (checkSet, part) {
            var isPartStr = typeof part === "string",
                elem,
                i = 0,
                l = checkSet.length;

            if (isPartStr && !/\W/.test(part)) {
                part = part.toLowerCase();

                for (; i < l; i++) {
                    elem = checkSet[i];
                    if (elem) {
                        var parent = elem.parentNode;
                        checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                    }
                }
            } else {
                for (; i < l; i++) {
                    elem = checkSet[i];
                    if (elem) {
                        checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
                    }
                }

                if (isPartStr) {
                    Sizzle.filter(part, checkSet, true);
                }
            }
        },
        "": function (checkSet, part, isXML) {
            var doneName = done++,
                checkFn = dirCheck,
                nodeCheck;

            if (typeof part === "string" && !/\W/.test(part)) {
                part = part.toLowerCase();
                nodeCheck = part;
                checkFn = dirNodeCheck;
            }

            checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
        },
        "~": function (checkSet, part, isXML) {
            var doneName = done++,
                checkFn = dirCheck,
                nodeCheck;

            if (typeof part === "string" && !/\W/.test(part)) {
                part = part.toLowerCase();
                nodeCheck = part;
                checkFn = dirNodeCheck;
            }

            checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
        }
    },
    find: {
        ID: function (match, context, isXML) {
            if (typeof context.getElementById !== "undefined" && !isXML) {
                var m = context.getElementById(match[1]);
                return m ? [m] : [];
            }
        },
        NAME: function (match, context) {
            if (typeof context.getElementsByName !== "undefined") {
                var ret = [],
                    results = context.getElementsByName(match[1]);

                for (var i = 0, l = results.length; i < l; i++) {
                    if (results[i].getAttribute("name") === match[1]) {
                        ret.push(results[i]);
                    }
                }

                return ret.length === 0 ? null : ret;
            }
        },
        TAG: function (match, context) {
            return context.getElementsByTagName(match[1]);
        }
    },
    preFilter: {
        CLASS: function (match, curLoop, inplace, result, not, isXML) {
            match = " " + match[1].replace(/\\/g, "") + " ";

            if (isXML) {
                return match;
            }

            for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
                if (elem) {
                    if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0)) {
                        if (!inplace) {
                            result.push(elem);
                        }
                    } else if (inplace) {
                        curLoop[i] = false;
                    }
                }
            }

            return false;
        },
        ID: function (match) {
            return match[1].replace(/\\/g, "");
        },
        TAG: function (match, curLoop) {
            return match[1].toLowerCase();
        },
        CHILD: function (match) {
            if (match[1] === "nth") {
                // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);

                // calculate the numbers (first)n+(last) including if they are negative
                match[2] = test[1] + (test[2] || 1) - 0;
                match[3] = test[3] - 0;
            }

            // TODO: Move to normal caching system
            match[0] = done++;

            return match;
        },
        ATTR: function (match, curLoop, inplace, result, not, isXML) {
            var name = match[1].replace(/\\/g, "");

            if (!isXML && Expr.attrMap[name]) {
                match[1] = Expr.attrMap[name];
            }

            if (match[2] === "~=") {
                match[4] = " " + match[4] + " ";
            }

            return match;
        },
        PSEUDO: function (match, curLoop, inplace, result, not) {
            if (match[1] === "not") {
                // If we're dealing with a complex expression, or a simple one
                if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                    match[3] = Sizzle(match[3], null, null, curLoop);
                } else {
                    var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                    if (!inplace) {
                        result.push.apply(result, ret);
                    }
                    return false;
                }
            } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                return true;
            }

            return match;
        },
        POS: function (match) {
            match.unshift(true);
            return match;
        }
    },
    filters: {
        enabled: function (elem) {
            return elem.disabled === false && elem.type !== "hidden";
        },
        disabled: function (elem) {
            return elem.disabled === true;
        },
        checked: function (elem) {
            return elem.checked === true;
        },
        selected: function (elem) {
            // Accessing this property makes selected-by-default
            // options in Safari work properly
            elem.parentNode.selectedIndex;
            return elem.selected === true;
        },
        parent: function (elem) {
            return !!elem.firstChild;
        },
        empty: function (elem) {
            return !elem.firstChild;
        },
        has: function (elem, i, match) {
            return !!Sizzle(match[3], elem).length;
        },
        header: function (elem) {
            return (/h\d/i.test(elem.nodeName)
            );
        },
        text: function (elem) {
            return "text" === elem.type;
        },
        radio: function (elem) {
            return "radio" === elem.type;
        },
        checkbox: function (elem) {
            return "checkbox" === elem.type;
        },
        file: function (elem) {
            return "file" === elem.type;
        },
        password: function (elem) {
            return "password" === elem.type;
        },
        submit: function (elem) {
            return "submit" === elem.type;
        },
        image: function (elem) {
            return "image" === elem.type;
        },
        reset: function (elem) {
            return "reset" === elem.type;
        },
        button: function (elem) {
            return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
        },
        input: function (elem) {
            return (/input|select|textarea|button/i.test(elem.nodeName)
            );
        }
    },
    setFilters: {
        first: function (elem, i) {
            return i === 0;
        },
        last: function (elem, i, match, array) {
            return i === array.length - 1;
        },
        even: function (elem, i) {
            return i % 2 === 0;
        },
        odd: function (elem, i) {
            return i % 2 === 1;
        },
        lt: function (elem, i, match) {
            return i < match[3] - 0;
        },
        gt: function (elem, i, match) {
            return i > match[3] - 0;
        },
        nth: function (elem, i, match) {
            return match[3] - 0 === i;
        },
        eq: function (elem, i, match) {
            return match[3] - 0 === i;
        }
    },
    filter: {
        PSEUDO: function (elem, match, i, array) {
            var name = match[1],
                filter = Expr.filters[name];

            if (filter) {
                return filter(elem, i, match, array);
            } else if (name === "contains") {
                return (elem.textContent || elem.innerText || Sizzle.getText([elem]) || "").indexOf(match[3]) >= 0;
            } else if (name === "not") {
                var not = match[3];

                for (var j = 0, l = not.length; j < l; j++) {
                    if (not[j] === elem) {
                        return false;
                    }
                }

                return true;
            } else {
                Sizzle.error("Syntax error, unrecognized expression: " + name);
            }
        },
        CHILD: function (elem, match) {
            var type = match[1],
                node = elem;
            switch (type) {
                case 'only':
                case 'first':
                    while (node = node.previousSibling) {
                        if (node.nodeType === 1) {
                            return false;
                        }
                    }
                    if (type === "first") {
                        return true;
                    }
                    node = elem;
                case 'last':
                    while (node = node.nextSibling) {
                        if (node.nodeType === 1) {
                            return false;
                        }
                    }
                    return true;
                case 'nth':
                    var first = match[2],
                        last = match[3];

                    if (first === 1 && last === 0) {
                        return true;
                    }

                    var doneName = match[0],
                        parent = elem.parentNode;

                    if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                        var count = 0;
                        for (node = parent.firstChild; node; node = node.nextSibling) {
                            if (node.nodeType === 1) {
                                node.nodeIndex = ++count;
                            }
                        }
                        parent.sizcache = doneName;
                    }

                    var diff = elem.nodeIndex - last;
                    if (first === 0) {
                        return diff === 0;
                    } else {
                        return diff % first === 0 && diff / first >= 0;
                    }
            }
        },
        ID: function (elem, match) {
            return elem.nodeType === 1 && elem.getAttribute("id") === match;
        },
        TAG: function (elem, match) {
            return match === "*" && elem.nodeType === 1 || elem.nodeName.toLowerCase() === match;
        },
        CLASS: function (elem, match) {
            return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
        },
        ATTR: function (elem, match) {
            var name = match[1],
                result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name),
                value = result + "",
                type = match[2],
                check = match[4];

            return result == null ? type === "!=" : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
        },
        POS: function (elem, match, i, array) {
            var name = match[2],
                filter = Expr.setFilters[name];

            if (filter) {
                return filter(elem, i, match, array);
            }
        }
    }
};
Sizzle.selectors = Expr;

var origPOS = Expr.match.POS,
    fescape = function (all, num) {
    return "\\" + (num - 0 + 1);
};

for (var type in Expr.match) {
    Expr.match[type] = new RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source);
    Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
}

var makeArray = function (array, results) {
    array = Array.prototype.slice.call(array, 0);

    if (results) {
        results.push.apply(results, array);
        return results;
    }

    return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
    Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;

    // Provide a fallback method if it does not work
} catch (e) {
    makeArray = function (array, results) {
        var ret = results || [],
            i = 0;

        if (toString.call(array) === "[object Array]") {
            Array.prototype.push.apply(ret, array);
        } else {
            if (typeof array.length === "number") {
                for (var l = array.length; i < l; i++) {
                    ret.push(array[i]);
                }
            } else {
                for (; array[i]; i++) {
                    ret.push(array[i]);
                }
            }
        }

        return ret;
    };
}

var sortOrder;

if (document.documentElement.compareDocumentPosition) {
    sortOrder = function (a, b) {
        if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
            if (a == b) {
                hasDuplicate = true;
            }
            return a.compareDocumentPosition ? -1 : 1;
        }

        var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
        if (ret === 0) {
            hasDuplicate = true;
        }
        return ret;
    };
} else if ("sourceIndex" in document.documentElement) {
    sortOrder = function (a, b) {
        if (!a.sourceIndex || !b.sourceIndex) {
            if (a == b) {
                hasDuplicate = true;
            }
            return a.sourceIndex ? -1 : 1;
        }

        var ret = a.sourceIndex - b.sourceIndex;
        if (ret === 0) {
            hasDuplicate = true;
        }
        return ret;
    };
} else if (document.createRange) {
    sortOrder = function (a, b) {
        if (!a.ownerDocument || !b.ownerDocument) {
            if (a == b) {
                hasDuplicate = true;
            }
            return a.ownerDocument ? -1 : 1;
        }

        var aRange = a.ownerDocument.createRange(),
            bRange = b.ownerDocument.createRange();
        aRange.setStart(a, 0);
        aRange.setEnd(a, 0);
        bRange.setStart(b, 0);
        bRange.setEnd(b, 0);
        var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
        if (ret === 0) {
            hasDuplicate = true;
        }
        return ret;
    };
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function (elems) {
    var ret = "",
        elem;

    for (var i = 0; elems[i]; i++) {
        elem = elems[i];

        // Get the text from text nodes and CDATA nodes
        if (elem.nodeType === 3 || elem.nodeType === 4) {
            ret += elem.nodeValue;

            // Traverse everything else, except comment nodes
        } else if (elem.nodeType !== 8) {
            ret += Sizzle.getText(elem.childNodes);
        }
    }

    return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function () {
    // We're going to inject a fake input element with a specified name
    var form = document.createElement("div"),
        id = "script" + new Date().getTime();
    form.innerHTML = "<a name='" + id + "'/>";

    // Inject it into the root element, check its status, and remove it quickly
    var root = document.documentElement;
    root.insertBefore(form, root.firstChild);

    // The workaround has to do additional checks after a getElementById
    // Which slows things down for other browsers (hence the branching)
    if (document.getElementById(id)) {
        Expr.find.ID = function (match, context, isXML) {
            if (typeof context.getElementById !== "undefined" && !isXML) {
                var m = context.getElementById(match[1]);
                return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
            }
        };

        Expr.filter.ID = function (elem, match) {
            var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
            return elem.nodeType === 1 && node && node.nodeValue === match;
        };
    }

    root.removeChild(form);
    root = form = null; // release memory in IE
})();

(function () {
    // Check to see if the browser returns only elements
    // when doing getElementsByTagName("*")

    // Create a fake element
    var div = document.createElement("div");
    div.appendChild(document.createComment(""));

    // Make sure no comments are found
    if (div.getElementsByTagName("*").length > 0) {
        Expr.find.TAG = function (match, context) {
            var results = context.getElementsByTagName(match[1]);

            // Filter out possible comments
            if (match[1] === "*") {
                var tmp = [];

                for (var i = 0; results[i]; i++) {
                    if (results[i].nodeType === 1) {
                        tmp.push(results[i]);
                    }
                }

                results = tmp;
            }

            return results;
        };
    }

    // Check to see if an attribute returns normalized href attributes
    div.innerHTML = "<a href='#'></a>";
    if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
        Expr.attrHandle.href = function (elem) {
            return elem.getAttribute("href", 2);
        };
    }

    div = null; // release memory in IE
})();

if (document.querySelectorAll) {
    (function () {
        var oldSizzle = Sizzle,
            div = document.createElement("div");
        div.innerHTML = "<p class='TEST'></p>";

        // Safari can't handle uppercase or unicode characters when
        // in quirks mode.
        if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
            return;
        }
        Sizzle = function (query, context, extra, seed) {
            context = context || document;

            // Only use querySelectorAll on non-XML documents
            // (ID selectors don't work in non-HTML documents)
            if (!seed && context.nodeType === 9 && !Sizzle.isXML(context)) {
                try {
                    return makeArray(context.querySelectorAll(query), extra);
                } catch (e) {}
            }

            return oldSizzle(query, context, extra, seed);
        };

        for (var prop in oldSizzle) {
            Sizzle[prop] = oldSizzle[prop];
        }

        div = null; // release memory in IE
    })();
}

(function () {
    var div = document.createElement("div");

    div.innerHTML = "<div class='test e'></div><div class='test'></div>";

    // Opera can't find a second classname (in 9.6)
    // Also, make sure that getElementsByClassName actually exists
    if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
        return;
    }

    // Safari caches class attributes, doesn't catch changes (in 3.2)
    div.lastChild.className = "e";

    if (div.getElementsByClassName("e").length === 1) {
        return;
    }

    Expr.order.splice(1, 0, "CLASS");
    Expr.find.CLASS = function (match, context, isXML) {
        if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
            return context.getElementsByClassName(match[1]);
        }
    };

    div = null; // release memory in IE
})();

function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
    for (var i = 0, l = checkSet.length; i < l; i++) {
        var elem = checkSet[i];
        if (elem) {
            elem = elem[dir];
            var match = false;

            while (elem) {
                if (elem.sizcache === doneName) {
                    match = checkSet[elem.sizset];
                    break;
                }

                if (elem.nodeType === 1 && !isXML) {
                    elem.sizcache = doneName;
                    elem.sizset = i;
                }

                if (elem.nodeName.toLowerCase() === cur) {
                    match = elem;
                    break;
                }

                elem = elem[dir];
            }

            checkSet[i] = match;
        }
    }
}

function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
    for (var i = 0, l = checkSet.length; i < l; i++) {
        var elem = checkSet[i];
        if (elem) {
            elem = elem[dir];
            var match = false;

            while (elem) {
                if (elem.sizcache === doneName) {
                    match = checkSet[elem.sizset];
                    break;
                }

                if (elem.nodeType === 1) {
                    if (!isXML) {
                        elem.sizcache = doneName;
                        elem.sizset = i;
                    }
                    if (typeof cur !== "string") {
                        if (elem === cur) {
                            match = true;
                            break;
                        }
                    } else if (Sizzle.filter(cur, [elem]).length > 0) {
                        match = elem;
                        break;
                    }
                }

                elem = elem[dir];
            }

            checkSet[i] = match;
        }
    }
}

Sizzle.contains = document.compareDocumentPosition ? function (a, b) {
    return !!(a.compareDocumentPosition(b) & 16);
} : function (a, b) {
    return a !== b && (a.contains ? a.contains(b) : true);
};

Sizzle.isXML = function (elem) {
    // documentElement is verified for cases where it doesn't yet exist
    // (such as loading iframes in IE - #4833)
    var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
    return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function (selector, context) {
    var tmpSet = [],
        later = "",
        match,
        root = context.nodeType ? [context] : context;

    // Position selectors must be done after the filter
    // And so must :not(positional) so we move all PSEUDOs to the end
    while (match = Expr.match.PSEUDO.exec(selector)) {
        later += match[0];
        selector = selector.replace(Expr.match.PSEUDO, "");
    }

    selector = Expr.relative[selector] ? selector + "*" : selector;

    for (var i = 0, l = root.length; i < l; i++) {
        Sizzle(selector, root[i], tmpSet);
    }

    return Sizzle.filter(later, tmpSet);
};
//visible hidden选择

function filters_hidden(elem) {
    return getStyle(elem, "display") === "none";
};

Expr.filters.hidden = filters_hidden;

Expr.filters.visible = function (elem) {
    return !filters_hidden(elem);
};

module.exports = Sizzle;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

var console = __webpack_require__(3);
var sizzle = __webpack_require__(7);
module.exports = function () {
    //类数组的转化
    var list = Array.prototype.slice.call(sizzle("[id]"), 0);
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
/* 9 */
/***/ function(module, exports) {

/**
 * 清除字符串前后空白字符
 * 例子：
 *
 * var trim = require("../str/trim");
 * var str = trim(" text "); // "text"
 *
 */
module.exports = function (str) {
	if (str == null) {
		return "";
	}

	str = str.toString();
	var len = str.length;
	var s = 0;
	var reg = /(\u3000|\s|\t|\u00A0)/;

	while (s < len) {
		if (!reg.test(str.charAt(s))) {
			break;
		}

		s += 1;
	}

	while (len > s) {
		if (!reg.test(str.charAt(len - 1))) {
			break;
		}

		len -= 1;
	}

	return str.slice(s, len);
};

/***/ },
/* 10 */
/***/ function(module, exports) {

/**
 * 获取节点的样式属性 来自STK.js
 * 该API封装了一些需要兼容的属性，比如获取半透明只需要设置opacity值
 * 例子：
 * var getStyle = require("../dom/getStyle");
 * var paddingLeft = getStyle(node, "paddingLeft"); // 获取到padding-left的值
 * var paddingLeft = getStyle(node, "padding-left"); // 获取到padding-left的值
 */

//是否ie盒模型
var isQuirk = document.documentMode ? document.documentMode === 5 : document.compatMode !== "CSS1Compat";

//测试用的 style
var testStyle = document.createElement("DIV").style;
testStyle.cssText = "float:left;opacity:.5";

var color = {
    aqua: '#0ff',
    black: '#000',
    blue: '#00f',
    gray: '#808080',
    purple: '#800080',
    fuchsia: '#f0f',
    green: '#008000',
    lime: '#0f0',
    maroon: '#800000',
    navy: '#000080',
    olive: '#808000',
    orange: '#ffa500',
    red: '#f00',
    silver: '#c0c0c0',
    teal: '#008080',
    transparent: 'rgba(0,0,0,0)',
    white: '#fff',
    yellow: '#ff0'
};

var borderWidth = {
    thin: ["1px", "2px"],
    medium: ["3px", "4px"],
    thick: ["5px", "6px"]
};

var cssHooks = {
    opacity: function (node) {
        if (!_cssSupport().opacity) {
            var val = 100;
            try {
                val = node.filters['DXImageTransform.Microsoft.Alpha'].opacity;
            } catch (e) {
                try {
                    val = node.filters('alpha').opacity;
                } catch (e) {}
            }
            return val / 100;
        }
    }
};

// 对应正确的css属性
// 在执行中会使用 _vendorPropName 动态添加，例如 transform: 'WebkitTransform'
var cssProps = {
    "float": _cssSupport().cssFloat ? "cssFloat" : "styleFloat"
};

/*
 *  检测对css的一些属性的支持程度
 *  @method _cssSupport
 *  @private
 */
function _cssSupport() {
    return _cssSupport.rs || (_cssSupport.rs = {
        opacity: /^0\.5/.test(testStyle.opacity),
        cssFloat: !!testStyle.cssFloat
    });
}

/*
 *  转换驼峰
 *  @method _camelCase
 *  @private
 *  @param {String} 需要转换的字符串
 */
function _camelCase(string) {
    return string.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function (all, letter) {
        return letter.toUpperCase();
    });
}

/*
 *  检测对是否是某种浏览器自有属性
 *  例如: WebkitTransform 一类的
 *  @method _vendorPropName
 *  @private
 */
// moz-border-radius-top-left
function _vendorPropName(name) {
    // 检测如果已经可以用短名的用短名
    if (name in testStyle) {
        return name;
    }

    // 循环检测是否某种浏览器特殊名
    var capName = name.charAt(0).toUpperCase() + name.slice(1);
    var origName = name;
    var cssPrefixes = ["Webkit", "O", "Moz", "ms"];
    var i = cssPrefixes.length;
    while (i--) {
        name = cssPrefixes[i] + capName;
        if (name in testStyle) {
            return name;
        }
    }

    // 啥都不是
    return origName;
}

/*
 *  长度单位转换
 *  @method _convertPixelValue
 *  @private
 *  @param {Node} 对应的dom元素
 */
function _convertPixelValue(el, property, value) {
    var style = el.style;
    var left = style.left;
    var rsLeft = el.runtimeStyle.left;

    el.runtimeStyle.left = el.currentStyle.left;
    style.left = property === "fontSize" ? "1em" : value || 0;
    var px = style.pixelLeft;
    style.left = left; //还原数据
    el.runtimeStyle.left = rsLeft; //还原数据
    return px + "px";
}

/*
 *  颜色单位转换
 *  @method _rgb2hex
 *  @private
 *  @param {String}
 */
function _rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + _tohex(rgb[1]) + tohex(rgb[2]) + tohex(rgb[3]);
}

/*
 *  转换16进制
 *  @method _tohex
 *  @private
 *  @param {String}
 */
function _tohex(x) {
    var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

/*
 *  获取样式集
 *  @method _getStyles
 *  @private
 *  @param {Node} 对应的dom元素
 */
function _getStyles(node) {
    if ('getComputedStyle' in window) {
        return window.getComputedStyle(node, "");
    } else if ('currentStyle' in document.documentElement) {
        return node.currentStyle;
    } else {
        return {};
    }
}

/*
 *  对ie做特殊处理
 *  @method _getStyleIE
 *  @private
 *  @param {Node}   对应的dom元素
 *  @param {String} 属性名
 */
function _getStyleIE(node, property) {
    //特殊处理IE的opacity
    var val;
    if (property in cssHooks) {
        val = cssHooks[property](node);
    }
    if (val !== undefined) {
        return val;
    }
    val = node.currentStyle[property];
    //特殊处理IE的height与width
    if (/^(height|width)$/.test(property)) {
        var values = property == 'width' ? ['left', 'right'] : ['top', 'bottom'],
            size = 0;
        if (isQuirk) {
            return node[_camelCase("offset-" + property)] + "px";
        } else {
            var client = parseFloat(node[_camelCase("client-" + property)]);
            var paddingA = parseFloat(getStyle(node, "padding-" + values[0]));
            var paddingB = parseFloat(getStyle(node, "padding-" + values[1]));
            val = client - paddingA - paddingB;
            val = val > 0 ? val : node[_camelCase("offset-" + property)];
        }
    }
    return val;
}

/*
 *  对返回值做一些处理 http://www.cnblogs.com/rubylouvre/archive/2009/09/08/1562212.html
 *  @method _formatValue
 *  @private
 *  @param {Node}   对应的dom元素
 *  @param {String} 属性名
 */
function _formatValue(el, property, value) {
    if (!/^\d+px$/.test(value)) {
        //转换可度量的值
        if (/(em|pt|mm|cm|pc|in|ex|rem|vw|vh|vm|ch|gr|%)$/.test(value)) {
            return _convertPixelValue(el, property, value);
        }
        //转换border的thin medium thick
        if (/^(border).+(width)$/i.test(property)) {
            var s = property.replace("Width", "Style");
            if (value == "medium" && getStyle(el, s) == "none") {
                return "0px";
            }
            return !!window.XDomainRequest ? borderWidth[value][0] : borderWidth[value][1];
        }
        //转换颜色
        if (property.search(/background|color/i) != -1) {
            if (!!color[value]) {
                value = color[value];
            }
            if (value == "inherit") {
                return getStyle(el.parentNode, property);
            }
            if (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.test(value)) {
                return _rgb2hex(value);
            } else if (/^#/.test(value)) {
                value = value.replace('#', '');
                return "#" + (value.length == 3 ? value.replace(/^(\w)(\w)(\w)$/, '$1$1$2$2$3$3') : value);
            }
            return value;
        }
    }
}

var getStyle = function (node, property) {
    node = typeof node == "string" ? document.getElementById(node) : node;
    var computed = _getStyles(node);
    var val;
    property = _camelCase(property);
    property = cssProps[property] || (cssProps[property] = _vendorPropName(property));

    //区分ie做特殊处理
    if ('getComputedStyle' in window) {
        val = window.getComputedStyle(node, null)[property];
    } else {
        val = _getStyleIE(node, property);
    }
    //处理单位转换。
    try {
        val = _formatValue(node, property, val) || val;
    } catch (e) {}

    return val;
};

module.exports = getStyle;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 删除事件
 * @2014-10-11 增加了批量处理功能，可以传入一个节点数组解绑事件
 * 例子请阅读add函数
 */

var getType = __webpack_require__(1);
var each = __webpack_require__(0);

var removeEvent = function (el, type, fn, releaseCapture) {
    if (getType(el) == "array") {
        var fun = removeEvent;

        each(el, function (item, key) {
            fun(item, type, fn, releaseCapture);
        });
    }

    el = typeof el == "string" ? document.getElementById(el) : el;

    if (el == null || typeof fn != "function") {
        return false;
    }

    if (el.removeEventListener) {
        el.removeEventListener(type, fn, releaseCapture === true ? true : false);
    } else if (el.detachEvent) {
        el.detachEvent("on" + type, fn);
        if (releaseCapture && el.releaseCapture) {
            el.releaseCapture();
        }
    } else {
        el['on' + type] = null;
        if (releaseCapture && el.releaseCapture) {
            el.releaseCapture();
        }
    }

    return true;
};

module.exports = removeEvent;

/***/ },
/* 12 */
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
/* 13 */
/***/ function(module, exports) {

(function () {
    Array.prototype.forEach = function (callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }
        if (thisArg) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                if (callback.call(T, kValue, k, O) === false) {
                    break;
                }
            }
            k++;
        }
    };

    if (!/msie [678]\./i.test(navigator.userAgent)) {
        return;
    }

    var array = "abbr article aside audio canvas datalist details dialog eventsource figure footer header hgroup mark menu meter nav output progress section time video main header template".split(' ');
    for (var i = 0; i < array.length; i++) {
        document.createElement(array[i]);
    }

    Function.prototype.bind = Function.prototype.bind || function (oThis) {
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        // fNOP.prototype = this.prototype;
        // fBound.prototype = new fNOP();

        return fBound;
    };

    Array.prototype.filter = Array.prototype.filter || function (fun) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this)) {
                    res.push(val);
                }
            }
        }
        return res;
    };

    Array.prototype.map = Array.prototype.map || function (callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
})();

/***/ },
/* 14 */
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
/* 15 */
/***/ function(module, exports) {

/**
 * 获取滚动条的位置
 *
 * var scrollPos = require("../util/scrollPos");
 * var pos = scrollPos(); // 也可以传入一个iframe的document对象
 * 得到 { top: 0, left: 0 }
 *
 */
module.exports = function (oDocument) {
  oDocument = oDocument || document;
  var dd = oDocument.documentElement;
  var db = oDocument.body;
  return {
    top: Math.max(window.pageYOffset || 0, dd.scrollTop, db.scrollTop),
    left: Math.max(window.pageXOffset || 0, dd.scrollLeft, db.scrollLeft)
  };
};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 检查是否为一个元素，它是对isNode的一个封装，并且判断node节点的nodeType是否为1，为1则是元素
 * 例子：
 *
 * HTML: <div id="node"></div>
 *
 * var isElement = require("../dom/isElement");
 * var node = document.getElementById("node");
 * console.log(isElement(node)); // true
 *
 */

var isNode = __webpack_require__(27);

module.exports = function (element) {
  return isNode(element) && element.nodeType == 1;
};

/***/ },
/* 17 */
/***/ function(module, exports) {

/**
 * 获取窗口可视范围的大小
 * 例子：
 *
 * var winSize = require("../util/winSize");
 * var size = winSize(); // 可以指明某个window对象
 * size的值为： {width: 1024, height: 768 }
 */
module.exports = function (_target) {
	var w, h;
	var target;
	if (_target) {
		target = _target.document;
	} else {
		target = document;
	}

	if (target.compatMode === "CSS1Compat") {
		w = target.documentElement["clientWidth"];
		h = target.documentElement["clientHeight"];
	} else if (self.innerHeight) {
		// all except Explorer
		if (_target) {
			target = _target.self;
		} else {
			target = self;
		}
		w = target.innerWidth;
		h = target.innerHeight;
	} else if (target.documentElement && target.documentElement.clientHeight) {
		// Explorer 6 Strict Mode
		w = target.documentElement.clientWidth;
		h = target.documentElement.clientHeight;
	} else if (target.body) {
		// other Explorers
		w = target.body.clientWidth;
		h = target.body.clientHeight;
	}
	return {
		width: w,
		height: h
	};
};

/***/ },
/* 18 */
/***/ function(module, exports) {

/**
 * 获取事件对象，一般情况下不需要使用本函数
 * 一般来说绑定事件时，event对象会当成参数传给响应函数，
 * 但在某些特殊情况下，可能event对象在函数调用链中没有传递（代码设计缺陷造成的）
 * 那可以使用本函数去获取。
 *
 * 例子：
 *
 * var getEvent = require("../evt/get");
 * var addEvent = require("../evt/add");
 *
 * var fun1 = function(evt) { // 注意没有事件对象传递
 *   var evt = evt || getEvent(); // 如果没有evt参数，则getEvent()获取
 *   console.log(evt.type);
 * }
 *
 * var handler = function(evt) {
 *   fun1(); // 调用了，可是没有将evt传递给fun1，这就是所谓的代码设计问题
 * }
 *
 * addEvent(node, "click", handler);
 *
 */

var getEvent = function () {
    if (document.addEventListener) {
        var o = getEvent,
            e;
        do {
            e = o.arguments[0];
            if (e && /Event/.test(Object.prototype.toString.call(e))) {
                return e;
            }
        } while (o = o.caller);
        return e;
    } else {
        return window.event;
    }
};

module.exports = getEvent;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 阻止事件默认行为
 *
 * HTML:
 * <a href="http://aq.yy.com" id="node">这是一个连接</a>
 *
 * var queryNode = require("../dom/queryNode");
 * var addEvent = require("../evt/add");
 * var preventDefault = require("../evt/preventDefault");
 * var node = queryNode("#node");
 *
 * var handler = function(evt) {
 *     preventDefault(evt); // 点击连接的时候，并不会将页面跳到http://aq.yy.com
 * }
 *
 * addEvent(node, "click", handler);
 */

var getEvent = __webpack_require__(18);

module.exports = function (event) {
    event = event || getEvent();

    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

module.exports = function (opts) {
	var parseModule = __webpack_require__(5); // 页面模块自动解析
	var addEvent = __webpack_require__(6);
	var merge = __webpack_require__(4);
	var builder = __webpack_require__(26);
	var sizzle = __webpack_require__(7);
	var addEvent = __webpack_require__(6);
	var defaultTMPL = __webpack_require__(40);
	var winSize = __webpack_require__(17);
	var simScroll = __webpack_require__(49);
	var moveLayer = __webpack_require__(48);

	opts = merge({
		keepMiddle: true,
		title: 'Title'
	}, opts || {});

	var defaultTMPL = defaultTMPL({
		html: opts.boxHTML,
		"buttons": opts["buttons"],
		title: opts.title
	});

	var that = builder.createFromHTML(defaultTMPL, opts);
	var node = that.getOuter();
	var nodeList = null;
	var m_simScroll = null;
	var m_moveLayer = null;

	var evtFuncs = {
		hide: function () {
			that.hide('close');
		},
		buttonClick: function (ev) {
			var target = this;
			var data = {
				'type': target.getAttribute('data-button'),
				'button': target,
				'event': ev
			};
			that.fire('buttonClick', data);
		},
		show: function () {
			m_simScroll = simScroll(node, {
				autoChange: true,
				horizontal: {
					top: nodeList.header.offsetHeight
				}
			});
			m_simScroll.init();
			m_simScroll.loadScroll();
		}
	};

	var initMod = function () {
		m_moveLayer = moveLayer(nodeList.header, {
			layer: node
		});
		m_moveLayer.init();
	};

	var bindEvents = function () {
		if (nodeList.close) {
			addEvent(nodeList.close, 'click', evtFuncs.hide);
		}

		if (nodeList.footer) {
			buttons = sizzle("[data-button]", nodeList.footer);
			addEvent(buttons, "click", evtFuncs.buttonClick);
		}
		that.bind("show", evtFuncs.show);
	};

	var custFuncs = {
		initView: function () {
			custFuncs.setTitle(opts["title"]);
			var winHeight = winSize().height;
			nodeList.box.style.maxHeight = winHeight * 0.7 + "px";
			nodeList.box.style.overflowY = "auto";
			nodeList.box.style.overflowX = "hidden";
		},
		setTitle: function (title) {
			opts["title"] = title;
			if (nodeList.title) {
				nodeList.title.innerHTML = title;
			}
		}
	};

	nodeList = parseModule(node);
	initMod();
	bindEvents();
	custFuncs.initView();

	that.setTitle = custFuncs.setTitle;

	return that;
};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 封装了对节点class属性的操作，一般用于DOM节点的className状态切换
 * @2014-10-11 追加批量操作，允许传入节点数组以及className数组
 * 返回一个对象，拥有三个方法：
 * var className = require("../dom/className");
 *
 * if (className.has("node", "myClassName")) {
 *     className.remove(node, "myClassName");
 * } else {
 *     className.add(node, "myClassName");
 * }
 */

var isElement = __webpack_require__(16);
var each = __webpack_require__(0);
var getType = __webpack_require__(1);
var trim = __webpack_require__(9);
var whiteSpace = ' ';
var that = {};

that.has = function (node, className) {
    if (trim(className) == "") {
        return false;
    }

    var arr = node.className.replace(/\s+/g, whiteSpace).split(/\s+/g);

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == className) {
            return true;
        }
    }

    return false;
};

that.add = function (node, className) {
    if (getType(node) == "array") {
        each(node, function (el) {
            that.add(el, className);
        });

        return;
    }

    if (getType(className) == "array") {
        each(className, function (cls) {
            that.add(node, cls);
        });

        return;
    }

    if (!that.has(node, className)) {
        var arr = (node.className.replace(/\s+/g, whiteSpace).split(/\s+/g).join(whiteSpace) + whiteSpace + className).split(/\s+/g);
        var hash = {};
        var result = [];

        each(arr, function (val) {
            if (val in hash) {
                return;
            }

            hash[val] = true;
            result.push(val);
        });

        node.className = trim(result.join(whiteSpace));
    }
};

that.remove = function (node, className) {
    if (getType(node) == "array") {
        each(node, function (el) {
            that.remove(el, className);
        });

        return;
    }

    if (getType(className) == "array") {
        each(className, function (cls) {
            that.remove(node, cls);
        });

        return;
    }

    if (that.has(node, className)) {
        var arr = node.className.replace(/\s+/g, whiteSpace).split(/\s+/g);
        var hash = {};
        var result = [];

        each(arr, function (val) {
            if (val in hash || val == className) {
                return;
            }

            hash[val] = true;
            result.push(val);
        });

        node.className = trim(result.join(whiteSpace));
    }
};

that.toggle = function (node, className1, className2) {
    className1 = className1 == null ? "" : trim(className1);
    className2 = className2 == null ? "" : trim(className2);

    if (className1 == "" && className2 == "") {
        return;
    }

    if (className1 == "") {
        that.toggle(node, className2);
        return;
    }

    if (getType(node) == "array") {
        each(node, function (el) {
            that.toggle(el, className1, className2);
        });

        return;
    }

    var hasCN = that.has(node, className1);

    if (hasCN) {
        that.remove(node, className1);

        if (className2 != "") {
            that.add(node, className2);
        }
    } else {
        that.add(node, className1);

        if (className2 != "") {
            that.remove(node, className2);
        }
    }
};

module.exports = that;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 复制json对象，保证修改后不影响原来的对象
 * 例子：
 *
 * var clone = require("../json/clone");
 * var obj = { id: 1 };
 * var objNew = clone(obj); // 修改objNew不会涉及到obj
 *
 */

var getType = __webpack_require__(1);

var clone = module.exports = function (json) {
    var obj = null;

    if (getType(json) == "array") {
        obj = [];

        for (var i = 0; i < json.length; i++) {
            obj.push(clone(json[i]));
        }
    } else if (getType(json) == "object") {
        obj = {};

        for (var key in json) {
            obj[key] = clone(json[key]);
        }
    } else {
        return json;
    }

    return obj;
};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 获取节点相对于指定的节点的位置
 * 如果没有指定节点，则返回相对于document的位置
 * 例子：
 * var getPosition = require("../dom/getPosition");
 * var pos = getPosition(node);
 * console.log("left:" + pos.left, "top:" + pos.top);
 */

var contains = __webpack_require__(31);
var scrollPos = __webpack_require__(15);

var generalPosition = function (el) {
    var box = el.getBoundingClientRect();
    var scroll = scrollPos();
    var body = el.ownerDocument.body;
    var docElem = el.ownerDocument.documentElement;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    // 这边的parseInt 没有必要

    return {
        left: box.left + scroll['left'] - clientLeft,
        top: box.top + scroll['top'] - clientTop
    };
};

module.exports = function (oElement, parent) {
    oElement = typeof oElement == "string" ? document.getElementById(oElement) : oElement;
    parent = typeof parent == "string" ? document.getElementById(parent) : parent;
    if (!contains(oElement.ownerDocument.body, oElement)) {
        return { top: NaN, left: NaN };
    }

    if (parent === undefined) {
        return generalPosition(oElement);
    } else {
        oElement = generalPosition(oElement);
        parent = generalPosition(parent);
        return {
            'left': oElement.left - parent.left,
            'top': oElement.top - parent.top
        };
    }
};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 封装了HTML的插入操作，与insert.js不同，这里操作的是HTML字符串
 * 例子：
 *
 * HTML: <div id="node">hello world</div>
 *
 * var insertHTML = require("../dom/insertHTML");
 * var node = document.getElementById("node");
 *
 * where:
 * beforebegin 插入到节点开始之前
 *
 * insertHTML(node, '<div id="newNode"></div>', beforebegin);
 * 结果为： <div id="newNode"></div><div id="node">hello world</div>
 *
 * afterbegin 插入到节点内部的最前边
 *
 * insertHTML(node, '<div id="newNode"></div>', afterbegin);
 * 结果为：<div id="node"><div id="newNode"></div>hello world</div>
 *
 * beforeend 相当于appendChild，即插到内部最后
 *
 * insertHTML(node, '<div id="newNode"></div>', beforeend);
 * 结果为：<div id="node">hello world<div id="newNode"></div></div>
 *
 * afterend 插到节点的结束标签后边
 *
 * insertHTML(node, '<div id="newNode"></div>', afterend);
 * 结果为：<div id="node">hello world</div><div id="newNode"></div>
 *
 */

var console = __webpack_require__(3);

module.exports = function (target, html, where) {
    if (typeof target == "string") {
        target = document.getElementById(target);
    }

    where = where ? where.toLowerCase() : "beforeend";

    if ("insertAdjacentHTML" in target) {
        switch (where) {
            case "beforebegin":
                target.insertAdjacentHTML('BeforeBegin', html);
                return target.previousSibling;
            case "afterbegin":
                target.insertAdjacentHTML('AfterBegin', html);
                return target.firstChild;
            case "beforeend":
                target.insertAdjacentHTML('BeforeEnd', html);
                return target.lastChild;
            case "afterend":
                target.insertAdjacentHTML('AfterEnd', html);
                return target.nextSibling;
        }
    } else {

        var range = target.ownerDocument.createRange();
        var frag;
        /*
            createContextualFragment 解决在IE下的bug
         */
        /*
        if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment)
        {
            Range.prototype.createContextualFragment = function(html)
            {
                var frag = document.createDocumentFragment(), 
                div = document.createElement("div");
                frag.appendChild(div);
                div.outerHTML = html;
                return frag;
            };
        }
         */
        switch (where) {
            case "beforebegin":
                range.setStartBefore(target);
                frag = range.createContextualFragment(html);
                target.parentNode.insertBefore(frag, target);
                return target.previousSibling;
            case "afterbegin":
                if (target.firstChild) {
                    range.setStartBefore(target.firstChild);
                    frag = range.createContextualFragment(html);
                    target.insertBefore(frag, target.firstChild);
                    return target.firstChild;
                } else {
                    target.innerHTML = html;
                    return target.firstChild;
                }
                break;
            case "beforeend":
                if (target.lastChild) {
                    range.setStartAfter(target.lastChild);
                    frag = range.createContextualFragment(html);
                    target.appendChild(frag);
                    return target.lastChild;
                } else {
                    target.innerHTML = html;
                    return target.lastChild;
                }
                break;
            case "afterend":
                range.setStartAfter(target);
                frag = range.createContextualFragment(html);
                target.parentNode.insertBefore(frag, target.nextSibling);
                return target.nextSibling;
        }
    }

    console.error("无法将HTML代码插入到节点" + where + "(insertHTML)");
    return false;
};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 封装了一些方便元素关系操作的函数（注意获取到的都是元素节点，而不可能是textNode、注释之类的非元素节点）
 *
 * HTML:
 * <div id="node2"></div>
 * textNode1
 * <div id="node1">
 *   <div id="childNode1"></div>
 *   <div id="childNode2"></div>
 * </div>
 * <div id="node3"></div>
 *
 * var opra = require("../dom/node");
 * var queryNode = require("../dom/queryNode");
 * var node = queryNode("#node1");
 * var childNodes = opra.childNodes(node); // 获取到一个数组，包含childNode1以及childNode2
 * var firstChild = opra.first(node); // 获取到childNode1，也就是node的第一个子元素
 * var lastChild = opra.last(node);  // 获取到childNode2，也就是node的最后一个子元素
 * var nextNode = opra.next(node); // 获取到node3，也就是node的下一个元素
 * var prevNode = orpa.prev(node); // 获取到node2，也就是node的上一个元素，注意中间跳过了textNode1
 *
 */
var isElement = __webpack_require__(16);
var each = __webpack_require__(0);
var that = {};

that.childNodes = function (node) {
    var result = [];

    each(node.childNodes, function (child) {
        if (isElement(child)) {
            result.push(child);
        }
    });

    return result;
};

that.first = function (node) {
    var childs = node.childNodes;
    var len = childs.length;

    for (var i = 0; i < len; i++) {

        if (isElement(childs[i])) {
            return childs[i];
        }
    }

    return null;
};

that.last = function (node) {
    var childs = node.childNodes;
    var len = childs.length;

    for (var i = len - 1; i > -1; i--) {
        if (isElement(childs[i])) {
            return childs[i];
        }
    }

    return null;
};

that.next = function (node) {
    var nextNode = node;

    while ((nextNode = nextNode.nextSibling) != null) {
        if (isElement(nextNode)) {
            return nextNode;
        }
    }

    return null;
};

that.prev = function (node) {
    var prevNode = node;

    while ((prevNode = prevNode.previousSibling) != null) {
        if (isElement(prevNode)) {
            return prevNode;
        }
    }

    return null;
};

module.exports = that;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-06-10
 * @description 浮层的基本对象
 */
//----------------require--------------

var base = __webpack_require__(2); // 基础对象
var parseModule = __webpack_require__(5); // 页面模块自动解析
var getType = __webpack_require__(1);
var merge = __webpack_require__(4);
var insertHTML = __webpack_require__(24);
var clone = __webpack_require__(22);
var nodeOpera = __webpack_require__(25);
var preventDefault = __webpack_require__(19);
var addEvent = __webpack_require__(6);
var removeEvent = __webpack_require__(11);
var winSize = __webpack_require__(17);
var scrollPos = __webpack_require__(15);

var buildHTML = function (html) {
    var panel = document.createElement("div");
    panel.innerHTML = html;
    return nodeOpera.first(panel);
};

var disableEvent = function (ev) {
    preventDefault(ev);
};

if (!window.pop_zIndex) {
    window.pop_zIndex = 10000;
}

var _exports = module.exports = {
    "createFromHTML": function (html, opts) {
        //-----------声明模块全局变量-------------
        var that = base();
        var node = buildHTML(html);
        var mask = null;
        node.style.position = "absolute";
        opts = merge({
            "keepMiddle": false, // 是否在调用show的时候自动居中
            "middleFix": .25, // 设置居中的时候距离顶部的百分比，还可以取值为0表示完全居中
            "mask": true, // 设置是否需要遮罩层
            "maskOpacity": 0.3 // 遮罩层的透明度
        }, opts || {});

        //-------------自定义函数----------------
        var custFuncs = {
            trigger: function (why) {
                //触发按钮
                var ev = {
                    why: why || "trigger",
                    close: custFuncs.hide
                };
                that.fire("trigger", clone(ev));
            },
            /**
             * 显示浮层
             * @param  {object} handlers 允许定义beforeAppend、beforeAnimate、afterAnimate
             *                           beforeAppend: 节点被添加到文档流之前
             *                           beforeAnimate: 节点被添加到文档之后，开始显示动画之前
             *                           afterAnimate: 显示动画之后
             */
            show: function (handlers) {
                if (custFuncs.getStatus()) {
                    return;
                }

                if (opts["mask"]) {
                    mask = mask || _exports.createMask(opts["maskOpacity"]);
                    mask.show();
                }

                handlers = handlers || {};
                that.fire("beforeshow");

                handlers.beforeAppend && handlers.beforeAppend();
                document.body.appendChild(node);
                that.setTop();
                handlers.beforeAnimate && handlers.beforeAnimate();

                var aniHandler = function () {
                    handlers.afterAnimate && handlers.afterAnimate();
                    that.fire("aftershow");

                    if (opts["keepMiddle"]) {
                        that.setMiddle();
                    }

                    if (opts["mask"]) {
                        custFuncs.setTop();
                    }
                };

                if (opts.showAnimate) {
                    opts.showAnimate(that, aniHandler);
                } else {
                    aniHandler();
                }

                // addEvent(window, "touchmove", disableEvent);
                that.fire("show");
            },
            /**
             * 隐藏弹层
             * @param  {string} why     隐藏的原因，默认为hide
             * @param  {object} extra   隐藏时往beforehide/afterhide传递的数据
             * @param  {object} handlers 允许定义beforeAnimate、afterAnimate、afterRemove
             *                           beforeAnimate: 执行隐藏动画之前
             *                           afterAnimate: 执行隐藏动画之后，从文档流移除之前
             *                           afterRemove: 从文档流移除之后
             */
            hide: function (why, extra, handlers) {
                if (!custFuncs.getStatus()) {
                    return;
                }

                handlers = handlers || {};

                var ev = {
                    why: why || "hide",
                    extra: extra || {}
                };

                that.fire("beforehide", clone(ev));
                handlers.beforeAnimate && handlers.beforeAnimate();

                var aniHandler = function () {
                    handlers.afterAnimate && handlers.afterAnimate();
                    document.body.removeChild(node);
                    handlers.afterRemove && handlers.afterRemove();
                    that.fire("afterhide", clone(ev));

                    if (opts["mask"]) {
                        mask.hide();
                    }
                };

                if (opts.hideAnimate) {
                    opts.hideAnimate(that, aniHandler);
                } else {
                    aniHandler();
                }

                // removeEvent(window, "touchmove", disableEvent);
                that.fire("hide", clone(ev));
            },
            /**
             * 获取容器节点
             * @return {element} 节点
             */
            getOuter: function () {
                return node;
            },
            /**
             * 设置弹层为全屏
             */
            fullscreen: function () {
                if (!custFuncs.getStatus()) {
                    return;
                }

                that.fire("beforefullscreen");
                node.style.position = "fixed";
                node.style.top = 0;
                node.style.right = 0;
                node.style.bottom = 0;
                node.style.top = 0;
                that.fire("afterfullscreen");
            },
            /**
             * 设置弹层为居中
             */
            setMiddle: function () {
                if (!custFuncs.getStatus()) {
                    return;
                }

                that.fire("beforemiddle");

                // var de = document.documentElement;
                // var body = document.body;
                var size = winSize();
                var scroll = scrollPos();
                var left = (size.width - node.offsetWidth) / 2 + scroll.left;
                var top = (size.height - node.offsetHeight) / 2 + scroll.top;

                if (opts["middleFix"] != 0) {
                    var testTop = Math.floor(size.height * .25);

                    if (testTop * 2 + node.offsetHeight <= size.height) {
                        top = testTop + scroll.top;
                    }
                }

                left = left < 0 ? 0 : left;
                top = top < 0 ? 0 : top;
                node.style.position = "absolute";
                node.style.top = top + "px";
                node.style.left = left + "px";
                that.fire("aftermiddle");
            },
            /**
             * 设置弹层是否保持居中状态
             * @param  {Boolean} isKeep 弹层是否为居中状态
             */
            keepMiddle: function (isKeep) {
                isKeep = isKeep === false ? false : true;

                if (opts["keepMiddle"] == isKeep) {
                    return;
                }

                opts["keepMiddle"] = isKeep;

                if (that.getStatus() && opts["keepMiddle"]) {
                    that.setMiddle();
                }
            },
            /**
             * 要求弹层马上变成最上层的元素
             */
            setTop: function () {
                if (!custFuncs.getStatus()) return;
                node.style.zIndex = _exports.newZIndex();
            },
            /**
             * 获取弹层是否处于就绪状态
             * @return {boolean} 是否处于就绪状态
             */
            getStatus: function () {
                return node.parentNode === document.body;
            },
            /**
             * 设置浮层的位置
             * @param {number} left 相当原来的x轴，不设置则传null
             * @param {number} top  相当原来的y轴，不设置则传null
             * @param {number} right，不设置则传null
             * @param {number} bottom，不设置则传null
             */
            setPosition: function (left, top, right, bottom) {
                if (left) {
                    node.style.left = left;
                }
                if (top) {
                    node.style.top = top;
                }
                if (right) {
                    node.style.right = right;
                }
                if (bottom) {
                    node.style.bottom = bottom;
                }
            },
            /**
             * 获取遮罩层
             */
            getMask: function () {
                return mask;
            }
        };

        //---------------暴露API----------------
        that.show = custFuncs.show;
        that.hide = custFuncs.hide;
        that.trigger = custFuncs.trigger;
        that.getOuter = custFuncs.getOuter;
        that.fullscreen = custFuncs.fullscreen;
        that.setMiddle = custFuncs.setMiddle;
        that.keepMiddle = custFuncs.keepMiddle;
        that.setTop = custFuncs.setTop;
        that.getStatus = custFuncs.getStatus;
        that.setPosition = custFuncs.setPosition;
        that.getMask = custFuncs.getMask;

        return that;
    },
    "createMask": function (opacity) {
        var that = {};
        opacity = opacity || 0.3;
        var node = document.createElement("div");
        node.style.cssText = "position: fixed; left: 0; right: 0; top: 0; bottom: 0; background-color: black; -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.floor(opacity * 100) + "); filter: alpha(opacity=" + Math.floor(opacity * 100) + "); opacity: " + opacity + ";";

        var custFuncs = {
            "show": function () {
                if (node.parentNode == document.body) return;
                document.body.appendChild(node);
                node.style.zIndex = _exports.newZIndex();
            },
            "hide": function () {
                if (!node) return;
                node.parentNode.removeChild(node);
            },
            "getOuter": function () {
                return node;
            }
        };

        that.show = custFuncs.show;
        that.hide = custFuncs.hide;
        that.getOuter = custFuncs.getOuter;

        return that;
    },
    "newZIndex": function () {
        return window.pop_zIndex++;
    }
};

/***/ },
/* 27 */
/***/ function(module, exports) {

/**
 * 判断对象是否为一个节点，注意：元素、注释、文本内容都是一个node，具体请查阅DOM实现接口文档
 * 例子：
 *
 * HTML: <div id="node"></div>
 *
 * var isNode = require("../dom/isNode");
 * var node = document.getElementById("node");
 * console.log(isNode(node)); // true
 *
 */
module.exports = function (node) {
  return node != undefined && Boolean(node.nodeName) && Boolean(node.nodeType);
};

/***/ },
/* 28 */
/***/ function(module, exports) {

/**
 * 获取滚动条宽高
 */
module.exports = function () {
    var div = document.createElement("DIV");
    var _s = div.style;
    _s.overflow = "scroll";
    _s.width = "100px";
    _s.height = "100px";
    _s.left = "-200px";
    _s.top = "-200px";
    _s.position = "absolute";

    document.body.appendChild(div);

    var size = {
        h: div.offsetHeight - div.clientHeight,
        v: div.offsetWidth - div.clientWidth
    };

    document.body.removeChild(div);

    return size;
};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 设置样式属性 来自STK.js
 * setStyle(node, "paddingTop", "50px");
 * setStyle(node, "padding-top", "50px");
 * setStyle(node, {"paddingTop": "50px", "paddingLeft": "50px"});
 */

var trim = __webpack_require__(9);
//测试用的 style
var testStyle = document.createElement("DIV").style;
testStyle.cssText = "float:left;opacity:.5";

var cssHooks = {
    opacity: function (node, value) {
        if (!_cssSupport().opacity) {
            var ralpha = /alpha\([^)]*\)/i;
            var style = node.style;
            var currentStyle = node.currentStyle;
            var opacity = _isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "";
            var filter = currentStyle && currentStyle.filter || style.filter || "";

            if (!currentStyle || !currentStyle.hasLayout) {
                style.zoom = 1;
            }

            if ((value >= 1 || value === "") && trim(filter.replace(ralpha, "")) === "" && style.removeAttribute) {

                style.removeAttribute("filter");

                if (value === "" || currentStyle && !currentStyle.filter) {
                    return true;
                }
            }

            style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
            return true;
        }
    }
};

// 对应正确的css属性
// 在执行中会使用 _vendorPropName 动态添加，例如 transform: 'WebkitTransform'
var cssProps = {
    "float": _cssSupport().cssFloat ? "cssFloat" : "styleFloat"
};

/*
 *  检测是否数字（字符串数字）且非 NaN 或 Infinity
 *  @method _isNumeric
 *  @private
 *  @param {String/Number} 检测对象
 */
function _isNumeric(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
}

/*
 *  检测对css的一些属性的支持程度
 *  @method _cssSupport
 *  @private
 */
function _cssSupport() {
    return _cssSupport.rs || (_cssSupport.rs = {
        opacity: 'opacity' in testStyle && /^0.5/.test(testStyle.opacity),
        cssFloat: 'cssFloat' in testStyle && !!testStyle.cssFloat
    });
}

/*
 *  转换驼峰
 *  @method _camelCase
 *  @private
 *  @param {String} 需要转换的字符串
 */
function _camelCase(string) {
    return string.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function (all, letter) {
        return letter.toUpperCase();
    });
}

/*
 *  转换中线连接
 *  @method _multiDash
 *  @private
 *  @param {String} 需要转换的字符串
 */
function _multiDash(string) {
    return string.replace(/^ms/, "Ms").replace(/([A-Z])/g, "-$1").toLowerCase();
}

/*
 *  检测对是否是某种浏览器自有属性
 *  例如: WebkitTransform 一类的
 *  @method _vendorPropName
 *  @private
 */
function _vendorPropName(name) {
    // 检测如果已经可以用短名的用短名
    if (name in testStyle) {
        return name;
    }

    // 循环检测是否某种浏览器特殊名
    var capName = name.charAt(0).toUpperCase() + name.slice(1);
    var origName = name;
    var cssPrefixes = ["Webkit", "O", "Moz", "ms"];
    var i = cssPrefixes.length;
    while (i--) {
        name = cssPrefixes[i] + capName;
        if (name in testStyle) {
            return name;
        }
    }

    // 啥都不是
    return origName;
}

/*
 *  格式化属性名
 *  @method _formatProp
 *  @private
 */
function _formatProp(property) {
    property = _camelCase(property);
    return cssProps[property] || (cssProps[property] = _vendorPropName(property));
}

/*
 *  设置属性
 *  @method setStyle
 *  @public
 */
function setStyle(node, property, value) {
    node = typeof node == "string" ? document.getElementById(node) : node;
    var val;
    property = _formatProp(property);
    if (property in cssHooks) {
        val = cssHooks[property](node, value);
    }
    if (val === undefined) {
        node.style[property] = value;
    }
}
/*
 *  设置多个属性
 *  @method multiSetStyle
 *  @public
 */
function multiSetStyle(node, map) {
    var property;
    var value;
    var i;
    var val;
    var rs = [];
    node = typeof node == "string" ? document.getElementById(node) : node;
    for (i in map) {
        val = undefined;
        property = i;
        value = map[i];
        property = _formatProp(property);
        if (property in cssHooks) {
            val = cssHooks[property](node, value);
        }
        if (val === undefined) {
            rs.push([_multiDash(property), value].join(':'));
        }
    }
    node.style.cssText += ';' + rs.join(';') + ';';
}
// setStyle.multi = multiSetStyle;

module.exports = function () {
    if (arguments.length == 2) {
        multiSetStyle(arguments[0], arguments[1]);
    } else {
        setStyle(arguments[0], arguments[1], arguments[2]);
    }
};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(2); // 基础对象

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var node = null;

    var html = '<div class="loading"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>';

    //-------------事件响应声明---------------
    var evtFuncs = {};

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {};

    //-------------自定义函数----------------
    var custFuncs = {
        initView: function () {
            node = document.createElement("DIV");
            node.className = "m-loading";
            node.innerHTML = html;
        },
        show: function () {
            document.body.appendChild(node);
        },
        hide: function () {
            if (node) {
                document.body.removeChild(node);
            }
        }
    };

    //-------------一切从这开始--------------
    // var init = function(_data) {
    //     data = _data;
    //     // 找到所有带有node-name的节点
    //     nodeList = parseModule(node);
    //     // 子模块实例化
    //     initMod();
    //     // 绑定事件
    //     bindEvents();
    // }

    //---------------暴露API----------------
    // that.init = init;
    // 
    custFuncs.initView();

    that.show = custFuncs.show;
    that.hide = custFuncs.hide;

    return that;
}();

/***/ },
/* 31 */
/***/ function(module, exports) {

/**
 * 判断节点是否为另一个节点的父元素（如果两者是同一个元素，返回假）
 * 例子：
 * var contains = require("../dom/contains");
 * console.log(contains(parentNode, node));
 **/
module.exports = function (parent, node) {
    if (parent === node) {
        return false;
    } else if (parent.compareDocumentPosition) {
        return (parent.compareDocumentPosition(node) & 16) === 16;
    } else if (parent.contains && node.nodeType === 1) {
        return parent.contains(node);
    } else {
        while (node = node.parentNode) {
            if (parent === node) {
                return true;
            }
        }
    }

    return false;
};
/*
   compareDocumentPosition 与 contains 这里主要为了做兼容


   compareDocumentPosition 比较强大 如下：
    
   Bits Number  Meaning
   000000   0   元素一致
   000001   1   节点在不同的文档（或者一个在文档之外）
   000010   2   节点 B 在节点 A 之前
   000100   4   节点 A 在节点 B 之前
   001000   8   节点 B 包含节点 A
   010000   16  节点 A 包含节点 B
   100000   32  浏览器的私有使用 


 */

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 停止事件冒泡
 * 例子请阅读add函数
 */

var getEvent = __webpack_require__(18);

module.exports = function (event) {
    event = event || getEvent();

    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.returnValue = false;
    }

    return false;
};

/***/ },
/* 33 */,
/* 34 */
/***/ function(module, exports, __webpack_require__) {

/**
 * popup浮层
 *
 * option:
 *     autoHide: false 当屏幕其它位置获得焦点是否自动显示。当设置为true时，如果是由click触发的弹层，
 *               则需要在click响应函数中调用lib/evt/stop，否则浮层马上又被关闭
 *     autoDirection: false 是否根据基准点决定显示位置，当设置为false的时候，则将基准点当成layer的左上角
 *     direction: "right bottom" 当autoDirection启用时，popup浮层不再将基准点当成左上角，
 *                而是根据设置的方向优先级决定显示区域，如果该区域显示不下，则再根据优先级显示在下一个位置
 *                取left/right以及top/bottom中各一个，如果所有位置都放置不下，则固定放在left top，以防止出滚动条
 */
var _exports = module.exports = function (html, opts) {
    var merge = __webpack_require__(4);
    var builder = __webpack_require__(26);
    var getPosition = __webpack_require__(23);
    var scrollBarSize = __webpack_require__(28);
    var parseModule = __webpack_require__(5);
    var stopPropagation = __webpack_require__(32);
    var winSize = __webpack_require__(17);
    var scrollPos = __webpack_require__(15);
    var addEvent = __webpack_require__(6);
    var removeEvent = __webpack_require__(11);
    var clone = __webpack_require__(22);

    opts = merge({
        autoHide: false,
        autoDirection: false,
        direction: "right bottom",
        mask: false,
        keepMiddle: false
    }, opts || {});

    var that = builder.createFromHTML(html, opts);
    var node = that.getOuter();
    var nodeList = parseModule(node);
    var autoHide = opts.autoHide;
    var autoHideBind = false;
    var direction = { h: "right", v: "bottom" };
    direction.h = opts.direction.toLowerCase().indexOf("left") == -1 ? "right" : "left";
    direction.v = opts.direction.toLowerCase().indexOf("top") == -1 ? "bottom" : "top";
    var superMethod = { show: that.show, hide: that.hide };

    var evtFuncs = {
        "autoHideClick": function () {
            that.hide();
        },
        "stopNodeAutoHide": function (ev) {
            stopPropagation(ev.originEvent || ev);
        }
    };

    var custFuncs = {
        /**
         * 基于x,y为基准点显示浮层
         * @param  {string} x             0px 基准点的x轴座标
         * @param  {string} y             0px 基准点的y轴座标
         * @param  {object} handlers 允许定义beforeAppend、beforeAnimate、afterAnimate
         *                           beforeAppend: 节点被添加到文档流之前
         *                           beforeAnimate: 节点被添加到文档之后，开始显示动画之前
         *                           afterAnimate: 显示动画之后
         */
        "show": function (x, y, handlers) {
            handlers = handlers || {};

            superMethod.show.call(that, {
                beforeAppend: function () {
                    handlers.beforeAppend && handlers.beforeAppend();
                    // 先隐藏掉，准备计算它的显示位置
                    node.style.visibility = "hidden";
                },
                beforeAnimate: function () {
                    if (opts.autoDirection) {
                        that.setPosition("0px", "0px");

                        var nodeSize = {
                            width: node.offsetWidth,
                            height: node.offsetHeight
                        };

                        var clientSize = winSize();
                        var scroll = scrollPos();
                        var dir = clone(direction);
                        that.setPosition(x + "px", y + "px");
                        var barSize = scrollBarSize();
                        var pos = getPosition(node);
                        var params = {
                            x: pos.left,
                            y: pos.top,
                            clientWidth: clientSize.width,
                            clientHeight: clientSize.height,
                            nodeWidth: nodeSize.width,
                            nodeHeight: nodeSize.height,
                            scrollLeft: scroll.left,
                            scrollTop: scroll.top,
                            barH: barSize.h,
                            barV: barSize.v
                        };

                        if (dir.h == "left") {
                            dir.h = custFuncs.checkLeft(params) ? "left" : "right";

                            if (dir.h == "right") {
                                dir.h = custFuncs.checkRight(params) ? "right" : "left";
                            }
                        } else {
                            dir.h = custFuncs.checkRight(params) ? "right" : "left";
                        }

                        if (dir.v == "top") {
                            dir.v = custFuncs.checkTop(params) ? "top" : "bottom";

                            if (dir.v == "bottom") {
                                dir.v = custFuncs.checkBottom(params) ? "bottom" : "top";
                            }
                        } else {
                            dir.v = custFuncs.checkBottom(params) ? "bottom" : "top";
                        }

                        var left = dir.h == "left" ? params.x - params.nodeWidth : params.x;
                        var top = dir.v == "top" ? params.y - params.nodeHeight : params.y;
                        that.setPosition(left + "px", top + "px");
                    } else {
                        that.setPosition(x + "px", y + "px");
                    }

                    node.style.visibility = "visible";
                    handlers.beforeAnimate && handlers.beforeAnimate();
                }
            });

            if (autoHide && !autoHideBind) {
                addEvent(document, "click", evtFuncs.autoHideClick);
                addEvent(window, "blur", evtFuncs.autoHideClick);
                addEvent(node, "click", evtFuncs.stopNodeAutoHide);
                autoHideBind = true;
            } else if (!autoHide && autoHideBind) {
                removeEvent(document, "click", evtFuncs.autoHideClick);
                removeEvent(window, "blur", evtFuncs.autoHideClick);
                removeEvent(node, "click", evtFuncs.stopNodeAutoHide);
                autoHideBind = false;
            }
        },
        hide: function (why, extra, handlers) {
            if (autoHideBind) {
                removeEvent(document, "click", evtFuncs.autoHideClick);
                removeEvent(node, "click", evtFuncs.stopNodeAutoHide);
                autoHideBind = false;
            }

            superMethod.hide.call(that, why, extra, handlers);
        },
        setAutoHide: function (isAutoHide) {
            if (isAutoHide == autoHide) {
                return;
            }

            autoHide = isAutoHide;

            if (that.getStatus() && autoHide) {
                addEvent(document, "click", evtFuncs.autoHideClick);
                addEvent(node, "click", evtFuncs.stopNodeAutoHide);
                autoHideBind = true;
            }
        },
        checkRight: function (params) {
            return params.x + params.nodeWidth <= params.scrollLeft + params.clientWidth - params.barV;
        },
        checkLeft: function (params) {
            return params.x - params.nodeWidth >= params.scrollLeft;
        },
        checkTop: function (params) {
            return params.y - params.nodeHeight >= params.scrollTop;
        },
        checkBottom: function (params) {
            return params.y + params.nodeHeight <= params.scrollTop + params.clientHeight - params.barH;
        }
    };

    that.show = custFuncs.show;
    that.hide = custFuncs.hide;
    that.setAutoHide = custFuncs.setAutoHide;

    return that;
};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
* 异步队列。使用when.js的实现。 https://github.com/cujojs/when
* 更多例子请网上查阅when.js的资料
* 顺序异步执行多个函数的例子：
* 注意：首先执行fun1，如果执行过程中调用了defer.reject则会跳到otherwise，否则调用defer.resolve()继续下一个then指明的fun2。
*
* var when = require("../util/when");
* var ajax = require("../io/ajax");
*
* var fun1 = function() {
*     var defer = when.defer();
*
*     ajax({
*         url: "/a.php",
*         method: "get",
*         onSuccess: function() {
*             defer.resolve();
*         },
*         onError: function() {
*             defer.reject("网络连接失败1");
*         }
*     })
*
*     return defer.promise; // 注意不管如何，函数在return时一定要返回这个对象
* }
*
* var fun2 = function() {
*     var defer = when.defer();
*
*     ajax({
*         url: "/b.php",
*         method: "get",
*         onSuccess: function() {
*             defer.resolve();
*         },
*         onError: function() {
*             defer.reject("网络连接失败2");
*         }
*     })
*
*     return defer.promise; // 注意不管如何，函数在return时一定要返回这个对象
* }
*
* var promise = fun1()
*     .then(fun2)
*     .then(function() {
*         console.log("前边的两个函数都调用了defer.resolve表示它们都执行成功，这里可以做最后的处理了")
*     })
*     .otherwise(function(msg) {
*         // 如果调用过程中没有调用defer.reject是不会走到这的
*         // msg是defer.reject传过来的值，它可以是对象
*         console.log("报错信息：" + msg);
*     });
*
*
*/
var global = window;
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
* A lightweight CommonJS Promises/A and when() implementation
* when is part of the cujo.js family of libraries (http://cujojs.com/)
*
* Licensed under the MIT License at:
* http://www.opensource.org/licenses/mit-license.php
*
* @author Brian Cavalier
* @author John Hann
* @version 2.5.1
*/

// Public API

when.promise = promise; // Create a pending promise
when.resolve = resolve; // Create a resolved promise
when.reject = reject; // Create a rejected promise
when.defer = defer; // Create a {promise, resolver} pair

when.join = join; // Join 2 or more promises

when.all = all; // Resolve a list of promises
when.map = map; // Array.map() for promises
when.reduce = reduce; // Array.reduce() for promises
when.settle = settle; // Settle a list of promises

when.any = any; // One-winner race
when.some = some; // Multi-winner race

when.isPromise = isPromiseLike; // DEPRECATED: use isPromiseLike
when.isPromiseLike = isPromiseLike; // Is something promise-like, aka thenable

/**
 * Register an observer for a promise or immediate value.
 *
 * @param {*} promiseOrValue
 * @param {function?} [onFulfilled] callback to be called when promiseOrValue is
 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
 *   will be invoked immediately.
 * @param {function?} [onRejected] callback to be called when promiseOrValue is
 *   rejected.
 * @param {function?} [onProgress] callback to be called when progress updates
 *   are issued for promiseOrValue.
 * @returns {Promise} a new {@link Promise} that will complete with the return
 *   value of callback or errback or the completion value of promiseOrValue if
 *   callback and/or errback is not supplied.
 */
function when(promiseOrValue, onFulfilled, onRejected, onProgress) {
        // Get a trusted promise for the input promiseOrValue, and then
        // register promise handlers
        return cast(promiseOrValue).then(onFulfilled, onRejected, onProgress);
}

function cast(x) {
        return x instanceof Promise ? x : resolve(x);
}

/**
 * Trusted Promise constructor.  A Promise created from this constructor is
 * a trusted when.js promise.  Any other duck-typed promise is considered
 * untrusted.
 * @constructor
 * @param {function} sendMessage function to deliver messages to the promise's handler
 * @param {function?} inspect function that reports the promise's state
 * @name Promise
 */
function Promise(sendMessage, inspect) {
        this._message = sendMessage;
        this.inspect = inspect;
}

Promise.prototype = {
        /**
         * Register handlers for this promise.
         * @param [onFulfilled] {Function} fulfillment handler
         * @param [onRejected] {Function} rejection handler
         * @param [onProgress] {Function} progress handler
         * @return {Promise} new Promise
         */
        then: function (onFulfilled, onRejected, onProgress) {
                /*jshint unused:false*/
                var args, sendMessage;

                args = arguments;
                sendMessage = this._message;
                return _promise(function (resolve, reject, notify) {
                        sendMessage('when', args, resolve, notify);
                }, this._status && this._status.observed());
        },

        /**
         * Register a rejection handler.  Shortcut for .then(undefined, onRejected)
         * @param {function?} onRejected
         * @return {Promise}
         */
        otherwise: function (onRejected) {
                return this.then(undef, onRejected);
        },

        /**
         * Ensures that onFulfilledOrRejected will be called regardless of whether
         * this promise is fulfilled or rejected.  onFulfilledOrRejected WILL NOT
         * receive the promises' value or reason.  Any returned value will be disregarded.
         * onFulfilledOrRejected may throw or return a rejected promise to signal
         * an additional error.
         * @param {function} onFulfilledOrRejected handler to be called regardless of
         *  fulfillment or rejection
         * @returns {Promise}
         */
        ensure: function (onFulfilledOrRejected) {
                return typeof onFulfilledOrRejected === 'function' ? this.then(injectHandler, injectHandler)['yield'](this) : this;

                function injectHandler() {
                        return resolve(onFulfilledOrRejected());
                }
        },

        /**
         * Shortcut for .then(function() { return value; })
         * @param  {*} value
         * @return {Promise} a promise that:
         *  - is fulfilled if value is not a promise, or
         *  - if value is a promise, will fulfill with its value, or reject
         *    with its reason.
         */
        'yield': function (value) {
                return this.then(function () {
                        return value;
                });
        },

        /**
         * Runs a side effect when this promise fulfills, without changing the
         * fulfillment value.
         * @param {function} onFulfilledSideEffect
         * @returns {Promise}
         */
        tap: function (onFulfilledSideEffect) {
                return this.then(onFulfilledSideEffect)['yield'](this);
        },

        /**
         * Assumes that this promise will fulfill with an array, and arranges
         * for the onFulfilled to be called with the array as its argument list
         * i.e. onFulfilled.apply(undefined, array).
         * @param {function} onFulfilled function to receive spread arguments
         * @return {Promise}
         */
        spread: function (onFulfilled) {
                return this.then(function (array) {
                        // array may contain promises, so resolve its contents.
                        return all(array, function (array) {
                                return onFulfilled.apply(undef, array);
                        });
                });
        },

        /**
         * Shortcut for .then(onFulfilledOrRejected, onFulfilledOrRejected)
         * @deprecated
         */
        always: function (onFulfilledOrRejected, onProgress) {
                return this.then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress);
        }
};

/**
 * Returns a resolved promise. The returned promise will be
 *  - fulfilled with promiseOrValue if it is a value, or
 *  - if promiseOrValue is a promise
 *    - fulfilled with promiseOrValue's value after it is fulfilled
 *    - rejected with promiseOrValue's reason after it is rejected
 * @param  {*} value
 * @return {Promise}
 */
function resolve(value) {
        return promise(function (resolve) {
                resolve(value);
        });
}

/**
 * Returns a rejected promise for the supplied promiseOrValue.  The returned
 * promise will be rejected with:
 * - promiseOrValue, if it is a value, or
 * - if promiseOrValue is a promise
 *   - promiseOrValue's value after it is fulfilled
 *   - promiseOrValue's reason after it is rejected
 * @param {*} promiseOrValue the rejected value of the returned {@link Promise}
 * @return {Promise} rejected {@link Promise}
 */
function reject(promiseOrValue) {
        return when(promiseOrValue, rejected);
}

/**
 * Creates a {promise, resolver} pair, either or both of which
 * may be given out safely to consumers.
 * The resolver has resolve, reject, and progress.  The promise
 * has then plus extended promise API.
 *
 * @return {{
 * promise: Promise,
 * resolve: function:Promise,
 * reject: function:Promise,
 * notify: function:Promise
 * resolver: {
 *        resolve: function:Promise,
 *        reject: function:Promise,
 *        notify: function:Promise
 * }}}
 */
function defer() {
        var deferred, pending, resolved;

        // Optimize object shape
        deferred = {
                promise: undef, resolve: undef, reject: undef, notify: undef,
                resolver: { resolve: undef, reject: undef, notify: undef }
        };

        deferred.promise = pending = promise(makeDeferred);

        return deferred;

        function makeDeferred(resolvePending, rejectPending, notifyPending) {
                deferred.resolve = deferred.resolver.resolve = function (value) {
                        if (resolved) {
                                return resolve(value);
                        }
                        resolved = true;
                        resolvePending(value);
                        return pending;
                };

                deferred.reject = deferred.resolver.reject = function (reason) {
                        if (resolved) {
                                return resolve(rejected(reason));
                        }
                        resolved = true;
                        rejectPending(reason);
                        return pending;
                };

                deferred.notify = deferred.resolver.notify = function (update) {
                        notifyPending(update);
                        return update;
                };
        }
}

/**
 * Creates a new promise whose fate is determined by resolver.
 * @param {function} resolver function(resolve, reject, notify)
 * @returns {Promise} promise whose fate is determine by resolver
 */
function promise(resolver) {
        return _promise(resolver, monitorApi.PromiseStatus && monitorApi.PromiseStatus());
}

/**
 * Creates a new promise, linked to parent, whose fate is determined
 * by resolver.
 * @param {function} resolver function(resolve, reject, notify)
 * @param {Promise?} status promise from which the new promise is begotten
 * @returns {Promise} promise whose fate is determine by resolver
 * @private
 */
function _promise(resolver, status) {
        var self,
            value,
            consumers = [];

        self = new Promise(_message, inspect);
        self._status = status;

        // Call the provider resolver to seal the promise's fate
        try {
                resolver(promiseResolve, promiseReject, promiseNotify);
        } catch (e) {
                promiseReject(e);
        }

        // Return the promise
        return self;

        /**
         * Private message delivery. Queues and delivers messages to
         * the promise's ultimate fulfillment value or rejection reason.
         * @private
         * @param {String} type
         * @param {Array} args
         * @param {Function} resolve
         * @param {Function} notify
         */
        function _message(type, args, resolve, notify) {
                consumers ? consumers.push(deliver) : enqueue(function () {
                        deliver(value);
                });

                function deliver(p) {
                        p._message(type, args, resolve, notify);
                }
        }

        /**
         * Returns a snapshot of the promise's state at the instant inspect()
         * is called. The returned object is not live and will not update as
         * the promise's state changes.
         * @returns {{ state:String, value?:*, reason?:* }} status snapshot
         *  of the promise.
         */
        function inspect() {
                return value ? value.inspect() : toPendingState();
        }

        /**
         * Transition from pre-resolution state to post-resolution state, notifying
         * all listeners of the ultimate fulfillment or rejection
         * @param {*|Promise} val resolution value
         */
        function promiseResolve(val) {
                if (!consumers) {
                        return;
                }

                var queue = consumers;
                consumers = undef;

                enqueue(function () {
                        value = coerce(self, val);
                        if (status) {
                                updateStatus(value, status);
                        }
                        runHandlers(queue, value);
                });
        }

        /**
         * Reject this promise with the supplied reason, which will be used verbatim.
         * @param {*} reason reason for the rejection
         */
        function promiseReject(reason) {
                promiseResolve(rejected(reason));
        }

        /**
         * Issue a progress event, notifying all progress listeners
         * @param {*} update progress event payload to pass to all listeners
         */
        function promiseNotify(update) {
                if (consumers) {
                        var queue = consumers;
                        enqueue(function () {
                                runHandlers(queue, progressed(update));
                        });
                }
        }
}

/**
 * Run a queue of functions as quickly as possible, passing
 * value to each.
 */
function runHandlers(queue, value) {
        for (var i = 0; i < queue.length; i++) {
                queue[i](value);
        }
}

/**
 * Creates a fulfilled, local promise as a proxy for a value
 * NOTE: must never be exposed
 * @param {*} value fulfillment value
 * @returns {Promise}
 */
function fulfilled(value) {
        return near(new NearFulfilledProxy(value), function () {
                return toFulfilledState(value);
        });
}

/**
 * Creates a rejected, local promise with the supplied reason
 * NOTE: must never be exposed
 * @param {*} reason rejection reason
 * @returns {Promise}
 */
function rejected(reason) {
        return near(new NearRejectedProxy(reason), function () {
                return toRejectedState(reason);
        });
}

/**
 * Creates a near promise using the provided proxy
 * NOTE: must never be exposed
 * @param {object} proxy proxy for the promise's ultimate value or reason
 * @param {function} inspect function that returns a snapshot of the
 *  returned near promise's state
 * @returns {Promise}
 */
function near(proxy, inspect) {
        return new Promise(function (type, args, resolve) {
                try {
                        resolve(proxy[type].apply(proxy, args));
                } catch (e) {
                        resolve(rejected(e));
                }
        }, inspect);
}

/**
 * Create a progress promise with the supplied update.
 * @private
 * @param {*} update
 * @return {Promise} progress promise
 */
function progressed(update) {
        return new Promise(function (type, args, _, notify) {
                var onProgress = args[2];
                try {
                        notify(typeof onProgress === 'function' ? onProgress(update) : update);
                } catch (e) {
                        notify(e);
                }
        });
}

/**
 * Coerces x to a trusted Promise
 * @param {*} x thing to coerce
 * @returns {*} Guaranteed to return a trusted Promise.  If x
 *   is trusted, returns x, otherwise, returns a new, trusted, already-resolved
 *   Promise whose resolution value is:
 *   * the resolution value of x if it's a foreign promise, or
 *   * x if it's a value
 */
function coerce(self, x) {
        if (x === self) {
                return rejected(new TypeError());
        }

        if (x instanceof Promise) {
                return x;
        }

        try {
                var untrustedThen = x === Object(x) && x.then;

                return typeof untrustedThen === 'function' ? assimilate(untrustedThen, x) : fulfilled(x);
        } catch (e) {
                return rejected(e);
        }
}

/**
 * Safely assimilates a foreign thenable by wrapping it in a trusted promise
 * @param {function} untrustedThen x's then() method
 * @param {object|function} x thenable
 * @returns {Promise}
 */
function assimilate(untrustedThen, x) {
        return promise(function (resolve, reject) {
                fcall(untrustedThen, x, resolve, reject);
        });
}

/**
 * Proxy for a near, fulfilled value
 * @param {*} value
 * @constructor
 */
function NearFulfilledProxy(value) {
        this.value = value;
}

NearFulfilledProxy.prototype.when = function (onResult) {
        return typeof onResult === 'function' ? onResult(this.value) : this.value;
};

/**
 * Proxy for a near rejection
 * @param {*} reason
 * @constructor
 */
function NearRejectedProxy(reason) {
        this.reason = reason;
}

NearRejectedProxy.prototype.when = function (_, onError) {
        if (typeof onError === 'function') {
                return onError(this.reason);
        } else {
                throw this.reason;
        }
};

function updateStatus(value, status) {
        value.then(statusFulfilled, statusRejected);

        function statusFulfilled() {
                status.fulfilled();
        }
        function statusRejected(r) {
                status.rejected(r);
        }
}

/**
 * Determines if x is promise-like, i.e. a thenable object
 * NOTE: Will return true for *any thenable object*, and isn't truly
 * safe, since it may attempt to access the `then` property of x (i.e.
 *  clever/malicious getters may do weird things)
 * @param {*} x anything
 * @returns {boolean} true if x is promise-like
 */
function isPromiseLike(x) {
        return x && typeof x.then === 'function';
}

/**
 * Initiates a competitive race, returning a promise that will resolve when
 * howMany of the supplied promisesOrValues have resolved, or will reject when
 * it becomes impossible for howMany to resolve, for example, when
 * (promisesOrValues.length - howMany) + 1 input promises reject.
 *
 * @param {Array} promisesOrValues array of anything, may contain a mix
 *      of promises and values
 * @param howMany {number} number of promisesOrValues to resolve
 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
 * @returns {Promise} promise that will resolve to an array of howMany values that
 *  resolved first, or will reject with an array of
 *  (promisesOrValues.length - howMany) + 1 rejection reasons.
 */
function some(promisesOrValues, howMany, onFulfilled, onRejected, onProgress) {

        return when(promisesOrValues, function (promisesOrValues) {

                return promise(resolveSome).then(onFulfilled, onRejected, onProgress);

                function resolveSome(resolve, reject, notify) {
                        var toResolve, toReject, values, reasons, fulfillOne, rejectOne, len, i;

                        len = promisesOrValues.length >>> 0;

                        toResolve = Math.max(0, Math.min(howMany, len));
                        values = [];

                        toReject = len - toResolve + 1;
                        reasons = [];

                        // No items in the input, resolve immediately
                        if (!toResolve) {
                                resolve(values);
                        } else {
                                rejectOne = function (reason) {
                                        reasons.push(reason);
                                        if (! --toReject) {
                                                fulfillOne = rejectOne = identity;
                                                reject(reasons);
                                        }
                                };

                                fulfillOne = function (val) {
                                        // This orders the values based on promise resolution order
                                        values.push(val);
                                        if (! --toResolve) {
                                                fulfillOne = rejectOne = identity;
                                                resolve(values);
                                        }
                                };

                                for (i = 0; i < len; ++i) {
                                        if (i in promisesOrValues) {
                                                when(promisesOrValues[i], fulfiller, rejecter, notify);
                                        }
                                }
                        }

                        function rejecter(reason) {
                                rejectOne(reason);
                        }

                        function fulfiller(val) {
                                fulfillOne(val);
                        }
                }
        });
}

/**
 * Initiates a competitive race, returning a promise that will resolve when
 * any one of the supplied promisesOrValues has resolved or will reject when
 * *all* promisesOrValues have rejected.
 *
 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
 *      of {@link Promise}s and values
 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
 * @returns {Promise} promise that will resolve to the value that resolved first, or
 * will reject with an array of all rejected inputs.
 */
function any(promisesOrValues, onFulfilled, onRejected, onProgress) {

        function unwrapSingleResult(val) {
                return onFulfilled ? onFulfilled(val[0]) : val[0];
        }

        return some(promisesOrValues, 1, unwrapSingleResult, onRejected, onProgress);
}

/**
 * Return a promise that will resolve only once all the supplied promisesOrValues
 * have resolved. The resolution value of the returned promise will be an array
 * containing the resolution values of each of the promisesOrValues.
 * @memberOf when
 *
 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
 *      of {@link Promise}s and values
 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
 * @returns {Promise}
 */
function all(promisesOrValues, onFulfilled, onRejected, onProgress) {
        return _map(promisesOrValues, identity).then(onFulfilled, onRejected, onProgress);
}

/**
 * Joins multiple promises into a single returned promise.
 * @return {Promise} a promise that will fulfill when *all* the input promises
 * have fulfilled, or will reject when *any one* of the input promises rejects.
 */
function join() /* ...promises */{
        return _map(arguments, identity);
}

/**
 * Settles all input promises such that they are guaranteed not to
 * be pending once the returned promise fulfills. The returned promise
 * will always fulfill, except in the case where `array` is a promise
 * that rejects.
 * @param {Array|Promise} array or promise for array of promises to settle
 * @returns {Promise} promise that always fulfills with an array of
 *  outcome snapshots for each input promise.
 */
function settle(array) {
        return _map(array, toFulfilledState, toRejectedState);
}

/**
 * Promise-aware array map function, similar to `Array.prototype.map()`,
 * but input array may contain promises or values.
 * @param {Array|Promise} array array of anything, may contain promises and values
 * @param {function} mapFunc map function which may return a promise or value
 * @returns {Promise} promise that will fulfill with an array of mapped values
 *  or reject if any input promise rejects.
 */
function map(array, mapFunc) {
        return _map(array, mapFunc);
}

/**
 * Internal map that allows a fallback to handle rejections
 * @param {Array|Promise} array array of anything, may contain promises and values
 * @param {function} mapFunc map function which may return a promise or value
 * @param {function?} fallback function to handle rejected promises
 * @returns {Promise} promise that will fulfill with an array of mapped values
 *  or reject if any input promise rejects.
 */
function _map(array, mapFunc, fallback) {
        return when(array, function (array) {

                return _promise(resolveMap);

                function resolveMap(resolve, reject, notify) {
                        var results, len, toResolve, i;

                        // Since we know the resulting length, we can preallocate the results
                        // array to avoid array expansions.
                        toResolve = len = array.length >>> 0;
                        results = [];

                        if (!toResolve) {
                                resolve(results);
                                return;
                        }

                        // Since mapFunc may be async, get all invocations of it into flight
                        for (i = 0; i < len; i++) {
                                if (i in array) {
                                        resolveOne(array[i], i);
                                } else {
                                        --toResolve;
                                }
                        }

                        function resolveOne(item, i) {
                                when(item, mapFunc, fallback).then(function (mapped) {
                                        results[i] = mapped;

                                        if (! --toResolve) {
                                                resolve(results);
                                        }
                                }, reject, notify);
                        }
                }
        });
}

/**
 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
 * input may contain promises and/or values, and reduceFunc
 * may return either a value or a promise, *and* initialValue may
 * be a promise for the starting value.
 *
 * @param {Array|Promise} promise array or promise for an array of anything,
 *      may contain a mix of promises and values.
 * @param {function} reduceFunc reduce function reduce(currentValue, nextValue, index, total),
 *      where total is the total number of items being reduced, and will be the same
 *      in each call to reduceFunc.
 * @returns {Promise} that will resolve to the final reduced value
 */
function reduce(promise, reduceFunc /*, initialValue */) {
        var args = fcall(slice, arguments, 1);

        return when(promise, function (array) {
                var total;

                total = array.length;

                // Wrap the supplied reduceFunc with one that handles promises and then
                // delegates to the supplied.
                args[0] = function (current, val, i) {
                        return when(current, function (c) {
                                return when(val, function (value) {
                                        return reduceFunc(c, value, i, total);
                                });
                        });
                };

                return reduceArray.apply(array, args);
        });
}

// Snapshot states

/**
 * Creates a fulfilled state snapshot
 * @private
 * @param {*} x any value
 * @returns {{state:'fulfilled',value:*}}
 */
function toFulfilledState(x) {
        return { state: 'fulfilled', value: x };
}

/**
 * Creates a rejected state snapshot
 * @private
 * @param {*} x any reason
 * @returns {{state:'rejected',reason:*}}
 */
function toRejectedState(x) {
        return { state: 'rejected', reason: x };
}

/**
 * Creates a pending state snapshot
 * @private
 * @returns {{state:'pending'}}
 */
function toPendingState() {
        return { state: 'pending' };
}

//
// Internals, utilities, etc.
//

var reduceArray, slice, fcall, nextTick, handlerQueue, setTimeout, funcProto, call, arrayProto, monitorApi, cjsRequire, MutationObserver, undef;

// cjsRequire = require;

//
// Shared handler queue processing
//
// Credit to Twisol (https://github.com/Twisol) for suggesting
// this type of extensible queue + trampoline approach for
// next-tick conflation.

handlerQueue = [];

/**
 * Enqueue a task. If the queue is not currently scheduled to be
 * drained, schedule it.
 * @param {function} task
 */
function enqueue(task) {
        if (handlerQueue.push(task) === 1) {
                nextTick(drainQueue);
        }
}

/**
 * Drain the handler queue entirely, being careful to allow the
 * queue to be extended while it is being processed, and to continue
 * processing until it is truly empty.
 */
function drainQueue() {
        runHandlers(handlerQueue);
        handlerQueue = [];
}

// capture setTimeout to avoid being caught by fake timers
// used in time based tests
setTimeout = global.setTimeout;

// Allow attaching the monitor to when() if env has no console
monitorApi = typeof console != 'undefined' ? console : when;

// Sniff "best" async scheduling option
// Prefer process.nextTick or MutationObserver, then check for
// vertx and finally fall back to setTimeout
/*global process*/
if (typeof process === 'object' && process.nextTick) {
        nextTick = process.nextTick;
} else if (MutationObserver = global.MutationObserver || global.WebKitMutationObserver) {
        nextTick = function (document, MutationObserver, drainQueue) {
                var el = document.createElement('div');
                new MutationObserver(drainQueue).observe(el, { attributes: true });

                return function () {
                        el.setAttribute('x', 'x');
                };
        }(document, MutationObserver, drainQueue);
} else {
        // try {
        //         // vert.x 1.x || 2.x
        //         nextTick = cjsRequire('vertx').runOnLoop || cjsRequire('vertx').runOnContext;
        // } catch(ignore) {
        nextTick = function (t) {
                setTimeout(t, 0);
        };
        // }
}

//
// Capture/polyfill function and array utils
//

// Safe function calls
funcProto = Function.prototype;
call = funcProto.call;
fcall = funcProto.bind ? call.bind(call) : function (f, context) {
        return f.apply(context, slice.call(arguments, 2));
};

// Safe array ops
arrayProto = [];
slice = arrayProto.slice;

// ES5 reduce implementation if native not available
// See: http://es5.github.com/#x15.4.4.21 as there are many
// specifics and edge cases.  ES5 dictates that reduce.length === 1
// This implementation deviates from ES5 spec in the following ways:
// 1. It does not check if reduceFunc is a Callable
reduceArray = arrayProto.reduce || function (reduceFunc /*, initialValue */) {
        /*jshint maxcomplexity: 7*/
        var arr, args, reduced, len, i;

        i = 0;
        arr = Object(this);
        len = arr.length >>> 0;
        args = arguments;

        // If no initialValue, use first item of array (we know length !== 0 here)
        // and adjust i to start at second item
        if (args.length <= 1) {
                // Skip to the first real element in the array
                for (;;) {
                        if (i in arr) {
                                reduced = arr[i++];
                                break;
                        }

                        // If we reached the end of the array without finding any real
                        // elements, it's a TypeError
                        if (++i >= len) {
                                throw new TypeError();
                        }
                }
        } else {
                // If initialValue provided, use it
                reduced = args[1];
        }

        // Do the actual reduce
        for (; i < len; ++i) {
                if (i in arr) {
                        reduced = reduceFunc(reduced, arr[i], i, arr);
                }
        }

        return reduced;
};

function identity(x) {
        return x;
}

module.exports = when;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(50)))

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {


var merge = __webpack_require__(4);
var loading = __webpack_require__(30);
var toast = __webpack_require__(47);
var alert = __webpack_require__(45);
var confirm = __webpack_require__(46);
var dialog = __webpack_require__(20);

var manager = {
	wait: function () {
		loading.show();
	},
	closeWait: function () {
		loading.hide();
	},
	toast: function (msg, opts) {
		var m_toast = toast(msg, opts);
		m_toast.show();
	},
	success: function (text, onOkOrOpts) {
		var opts = { 'icon': 'suc' };

		if (typeof onOkOrOpts == 'function') {
			opts = merge(opts, { 'ok': onOkOrOpts });
		} else {
			opts = merge(opts, onOkOrOpts);
		}
		var dialog = alert(text, opts);
		dialog.show();
	},
	error: function (text, onOkOrOpts) {
		var opts = { 'icon': 'err' };

		if (typeof onOkOrOpts == 'function') {
			opts = merge(opts, { 'ok': onOkOrOpts });
		} else {
			opts = merge(opts, onOkOrOpts);
		}
		var dialog = alert(text, opts);
		dialog.show();
	},
	confirm: function (text, onOkOrOpts, onCancel) {
		var opts = null;

		if (typeof onOkOrOpts == 'function' && typeof onCancel == 'function') {
			opts = { 'ok': onOkOrOpts, 'cancel': onCancel };
		}
		if (typeof onOkOrOpts == 'function') {
			opts = { 'ok': onOkOrOpts };
		} else {
			opts = onOkOrOpts;
		}
		var dialog = confirm('text', opts);
		dialog.show();
	},
	dialog: function (opts) {
		var m_dialog = dialog(opts);
		return m_dialog;
	}
};

module.exports = manager;
window.dialogManager = manager;

/***/ },
/* 37 */,
/* 38 */
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class=\'m-dialog-alert\'>\r\n	<div class="main">\r\n			<span class="iconfont ' +
((__t = (icon == 'suc' ? 'icon-selected' : 'icon-close')) == null ? '' : __t) +
'"></span>\r\n			<span>' +
((__t = (text)) == null ? '' : __t) +
'</span>\r\n	</div>\r\n</div>';

}
return __p
}

/***/ },
/* 39 */
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class=\'m-dialog-alert\'>\r\n	<div class="main">\r\n		<span class="iconfont  icon-help"></span>\r\n		<span>' +
((__t = (text)) == null ? '' : __t) +
'</span>\r\n	</div>\r\n</div>';

}
return __p
}

/***/ },
/* 40 */
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="m-dialog-common">\r\n	<div class="header" node-name=\'header\'>\r\n		<h3 node-name=\'title\'>' +
((__t = (title)) == null ? '' : __t) +
'</h3>\r\n		<a href="javascript:void(0)" class=\'close iconfont icon-close\' node-name=\'close\' title="关闭"></a>\r\n	</div>\r\n	<div class="box" node-name=\'box\'>' +
((__t = (html)) == null ? '' : __t) +
'</div>\r\n	<div node-name="footer" class="footer">\r\n	    ';
 buttons.forEach(function(button) { ;
__p += '\r\n	        <a href="javascript:void(0)" class="' +
((__t = ( button.type == 'blue' ? 'm-blue-bg-button' : 'm-white-bg-button' )) == null ? '' : __t) +
'" ';
if(button.node){;
__p += 'node-name="' +
((__t = (button.node)) == null ? '' : __t) +
'"';
};
__p += ' data-button="' +
((__t = (button.id)) == null ? '' : __t) +
'">' +
((__t = (button.text)) == null ? '' : __t) +
'</a>\r\n	    ';
 }) ;
__p += '\r\n\r\n	</div>\r\n</div>';

}
return __p
}

/***/ },
/* 41 */
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<!-- <div class="m-bottom-scroll hide" node-name="bottomSimScroll">\r\n    <div class="scroll-bg" node-name="scrollBottomBg"><div node-name="bottomScrollTool" class="scroll-tool"></div></div>\r\n</div> -->\r\n<div class="m-right-scroll hide" node-name="rightSimScroll">\r\n    <div class="scroll-bg" node-name="scrollRightBg"><div node-name="rightScrollTool" class="scroll-tool"></div></div>\r\n</div>';

}
return __p
}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 传统动画实现 From STK
 *  @node     {Node}     动画节点
 *  @prop     {Object}   结束状态列表 {height:50px, left: 50px}
 *  @duration {Number}   动画过度效果的过程时长，单位毫秒 可缺损 默认 1000
 *  @easing   {String}   动画过度效果名词  可缺损 默认 'linaer'
 *  @callback {Function} 动画结束回调函数
 *  @example
 *  var ani  = animate(node, { height: '500px', width: '+60px' });
	var ani  = animate.chain(node)
	.animate({ height:           '+40px' }, 'ease-in')
	.animate({ width:            '+60px' })
	.animate({ backgroundColor:  'blue'  })
	.animate({ transform:  'rotate(60deg) scale(1,1.5) ', top: '100px', 'left':'100px' }, 'ease-out')
	;
 */

var console = __webpack_require__(3);
var when = __webpack_require__(35);
var color = __webpack_require__(44);
var getStyle = __webpack_require__(10);
var setStyle = __webpack_require__(29);
var arrayMap = __webpack_require__(43);
var getType = __webpack_require__(1);

var defaultEasing = 'linear';
var defaultDuration = 1000;

var rnum = /(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/;
var rfxnum = new RegExp("^([+-]?)(" + rnum.source + ")([a-z%]*)$", "i");
var rmatrix = /([0-9\.\-]+)/ig;

//用于临时节点
var testNode = document.createElement("DIV");
var hideCss = ';height:0;width:0;visibility:hidden;position:absolute;top:-1000px;left:-1000px;';

//动画过度算法
//提供四种简单的方式可以扩展
var AniEsasing = {
    'linear': function (pst) {
        return pst;
    },
    'ease-in': function (pst) {
        return 1 - Math.cos(pst * Math.PI / 2);
    },
    'ease-out': function (pst) {
        return 1 - AniEsasing['ease-in'](1 - pst);
    },
    'ease-in-out': function (pst) {
        return pst < 0.5 ? AniEsasing['ease-in'](pst * 2) / 2 : 1 - AniEsasing['ease-out'](pst * -2 + 2) / 2;
    }
};

/*
 *  添加动画过度效果
 *  @method addEasomg
 *  @public
 */
function addEasing(name, fx) {
    if (name in AniEsasing) {
        console.error('ani.animate: 该效果名已经存在');
    }

    return AniEsasing[name] = fx;
}

//兼容帧频动画
var _requestAnimationFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

/*
 *  转化css transform 值为矩阵值（matrix）
 *  @method _formatMatrix
 *  @private
 *  @param  {String}
 */
function _formatMatrix(value) {
    testNode.style.cssText = '-webkit-transform:' + value + ';-moz-transform:' + value + ';-o-transform:' + value + ';transform:' + value + hideCss;
    document.body.appendChild(testNode);
    value = getStyle(testNode, 'transform');
    testNode.parentNode.removeNode(testNode);
    testNode.style.cssText = '';
    return value;
}

/*
 *  转化css color 值 如果是rgba的是rgba(x,x,x,x) 不然是#xxxxxx
 *  @method _formatColor
 *  @private
 *  @param  {String}
 */
function _formatColor(value) {
    //backgroundColor 在不插入dom流中的情况下是获取不到的
    //ie6 下设置background-color rbg(x,x,x) 是有问题的
    testNode.style.cssText = 'background-color:' + value + ';_background:' + value + hideCss;
    document.body.appendChild(testNode);
    value = getStyle(testNode, 'background-color');
    testNode.parentNode.removeNode(testNode);
    testNode.style.cssText = '';
    return value;
}

/*
 *  计算反计算 matrix 到 rotate, scale, skew
 *  turns a matrix into its rotate, scale and skew components
 *  http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp
 *  @method _unmatrix
 *  @private
 *  @param  {Array} [x,x,x,x,x,x] matrix的六个值
 *  @return [
 *            [ type, [value], unit ]
 *            ...
 *          ]
 */
function _unmatrix(matrix) {
    var scaleX,
        scaleY,
        skew,
        A = matrix[0],
        B = matrix[1],
        C = matrix[2],
        D = matrix[3];

    // Make sure matrix is not singular
    if (A * D - B * C) {
        // step (3)
        scaleX = Math.sqrt(A * A + B * B);
        A /= scaleX;
        B /= scaleX;
        // step (4)
        skew = A * C + B * D;
        C -= A * skew;
        D -= B * skew;
        // step (5)
        scaleY = Math.sqrt(C * C + D * D);
        C /= scaleY;
        D /= scaleY;
        skew /= scaleY;
        // step (6)
        if (A * D < B * C) {
            A = -A;
            B = -B;
            skew = -skew;
            scaleX = -scaleX;
        }

        // matrix is singular and cannot be interpolated
    } else {
        // In this case the elem shouldn't be rendered, hence scale == 0
        scaleX = scaleY = skew = 0;
    }

    // The recomposition order is very important
    // see http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp#l971
    return [['translate', [+matrix[4], +matrix[5]], 'px'], ['rotate', [Math.atan2(B, A)], 'rad'], ['skew' + "X", [Math.atan(skew)], 'rad'], ['scale', [scaleX, scaleY], '']];
}

/*
 *  转换16进制
 *  @method _tohex
 *  @private
 *  @param {String}
 */
function _tohex(x) {
    var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

/*
 *  设置元素每一帧的位置
 *  根据当前的过程的百分比设置当前的值
 *  @method _tween
 *  @private
 */
function _tween(node, easing, timeFramePst, start, end, unit) {
    var value;
    var i;
    var rs = {};
    for (i in start) {
        value = undefined;
        //特殊处理颜色
        if (/color/i.test(i)) {
            var rgba = arrayMap(['R', 'G', 'B', 'A'], function (value) {
                value = 'get' + value;
                var _start = start[i][1][value]() ? start[i][1][value]() : 0 | 0;
                var _end = end[i][1][value]() ? end[i][1][value]() : 0 | 0;
                return _start + (_end - _start) * AniEsasing[easing](timeFramePst);
            });
            //如果支持RGBa的使用RGBa
            //不然的话用#xxxxxx的方式
            if (start[i][1] === 'rgba') {
                value = 'rbga(' + rbga.join(',') + ')';
            } else {
                //rgba[0]要转化成init
                value = "#" + _tohex(rgba[0] | 0) + _tohex(rgba[1] | 0) + _tohex(rgba[2] | 0);
            }
        } else if (/transform/i.test(i)) {
            var transform;
            value = arrayMap(start[i], function (v, index) {
                var name = start[i][index][0];
                var value = arrayMap(start[i][index][1], function (v, _index) {
                    var _start = start[i][index][1][_index];
                    var _end = end[i][index][1][_index];
                    return (_start + (_end - _start) * AniEsasing[easing](timeFramePst)).toFixed(5) + start[i][index][2];
                }).join(',');
                return name + '(' + value + ')';
            });
            value = value.join(' ');
        } else {
            value = start[i] + (end[i] - start[i]) * AniEsasing[easing](timeFramePst) + unit[i];
        }
        rs[i] = value;
    }
    setStyle(node, rs);
}

/*
 *  时钟
 *  @method _tick
 *  @private
 */
function _tick(duration, progressCallback) {
    var pst = 0;
    var startTime = +new Date();
    var endTime = +new Date() + duration;
    var stopTime;
    var isStoped = false;

    _step();
    progressCallback(pst);

    return { stop: _stop, goOn: _goOn };

    //时钟步进
    function _step() {
        if (isStoped === true) {
            return;
        }
        var nowTime = +new Date();
        pst = (nowTime - startTime) / duration;
        if (nowTime >= endTime) {
            isStoped = true;
            return progressCallback(1);
        }
        progressCallback(pst);
        _requestAnimationFrame(_step);
    }

    //时钟暂停
    function _stop() {
        if (isStoped === false) {
            isStoped = true;
            stopTime = +new Date();
        }
    }

    //时钟继续
    function _goOn() {
        var nowTime = +new Date();
        if (isStoped === true) {
            startTime += nowTime - stopTime;
            endTime += nowTime - stopTime;
            isStoped = false;
            _step();
        }
    }
}

/*
 *  对于动画属性值的过滤
 *  @method _formateProp
 *  @private
 */
function _formateProp(node, prop, endValue) {
    var target;
    var start;
    var end;
    var unit;
    var tween = {};
    //特殊处理颜色
    if (/color/i.test(prop)) {
        start = getStyle(node, prop);
        end = _formatColor(endValue);
        unit = /rgba/.test(end) || /rgba/.test(start) ? 'rgba' : '#';
        tween.start = [unit, color(start)];
        tween.end = [unit, color(end)];
        return tween;
    }

    //特殊transform
    if (/transform/i.test(prop)) {
        start = getStyle(node, prop);
        end = _formatMatrix(endValue);
        start = start === 'none' ? 'matrix(1,0,0,1,0,0)' : start;
        end = end === 'none' ? 'matrix(1,0,0,1,0,0)' : end;
        tween.start = _unmatrix(start.match(rmatrix));
        tween.end = _unmatrix(end.match(rmatrix));
        return tween;
    }

    //标准处理
    //处理样式。[,+/-,值,单位]
    target = parseFloat(getStyle(node, prop));
    start = rfxnum.exec(getStyle(node, prop));
    end = rfxnum.exec(endValue);
    unit = end && end[3];

    var scale = 1;
    //下面代码用于转化单位
    //参考jquery操作
    var maxIterations = 20;
    if (start && start[3] !== unit) {
        unit = unit || start[3];
        end = end || [];
        start = +target || 1;

        do {
            // If previous iteration zeroed out, double until we get *something*
            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
            scale = scale || ".5";

            // Adjust and apply
            start = start / scale;
            setStyle(node, prop, start + unit);

            // Update scale, tolerating zero or NaN from tween.cur()
            // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
        } while (scale !== (scale = getStyle(node, prop) / target) && scale !== 1 && --maxIterations);
    }
    if (end) {
        start = tween.start = +start || +target || 0;
        tween.unit = unit;
        //处理 +/- 开头
        tween.end = end[1] ? start + (end[1] + 1) * end[2] : +end[2];
    }
    return tween;
}

/*
 *  对于动画过程监听实现。使用when的notify做过程监听
 *  @method _animate
 *  @private
 */
function _animate(duration) {
    var deferred = when.defer();
    var control = _tick(duration, function (pst) {
        deferred.notify(pst);
        if (pst == 1) {
            deferred.resolve(pst);
        }
    });
    return {
        promise: deferred.promise,
        stop: control.stop,
        goOn: control.goOn
    };
}

/*
 *  @method animate
 *  @public
 *  @node     {Node}     动画节点
 *  @prop     {Object}   结束状态列表 {height:50px, left: 50px}
 *  @duration {Number}   动画过度效果的过程时长，单位毫秒 可缺损 默认 1000
 *  @easing   {String}   动画过度效果名词  可缺损 默认 'linaer'
 *  @callback {Function} 动画结束回调函数
 */
function animate(node, prop, duration, easing, callback) {
    var start = {};
    var end = {};
    var unit = {};
    var i;
    var formatedProp;

    //参数适配
    callback = arguments[arguments.length - 1];
    callback = getType(callback) == "function" ? callback : function () {};
    if (getType(duration) != "number") {
        easing = duration;
        duration = defaultDuration;
    }
    easing = easing in AniEsasing ? easing : defaultEasing;

    for (i in prop) {
        formatedProp = _formateProp(node, i, prop[i]);
        start[i] = formatedProp.start;
        end[i] = formatedProp.end;
        unit[i] = formatedProp.unit;
    }
    var _ani = _animate(duration);
    _ani.promise.then(callback, function () {}, function (pst) {
        _tween(node, easing, pst, start, end, unit);
    });
    return _ani;
}

/*
 *  语法糖。 链式实现动画集合
 */
// chainAniControl需要是个队列
var chainAniControl = {};

function Chain(promise, key) {
    this.promise = promise;
    this.key = key;
}

Chain.prototype.animate = Chain.prototype.then = function (prop, duration, easing, callback) {
    var thisKey = this.key;
    var _deferred = when.defer();
    this.promise.then(function (node) {
        chainAniControl[thisKey] = animate(node, prop, duration, easing, function () {
            callback && callback();
            _deferred.resolve(node);
        });
    });
    return new Chain(_deferred.promise, thisKey);
};
Chain.prototype.stop = function () {
    chainAniControl && chainAniControl[this.key] && chainAniControl[this.key].stop();
};
Chain.prototype.goOn = function () {
    chainAniControl && chainAniControl[this.key] && chainAniControl[this.key].goOn();
};
Chain.prototype.destory = function () {
    delete chainAniControl[this.key];
};
Chain.init = function (node) {
    var deferred = when.defer();
    deferred.resolve(node);
    return new Chain(deferred.promise, new Date().getTime().toString() + Math.floor(Math.random() * 10000));
};

animate.chain = Chain.init;
animate.addEasing = addEasing;
module.exports = animate;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 映射数组
 * 遍历数组中所有元素，将每一个元素应用方法进行转换，并返回转换后的新数组
 * 注意：原数组不会做任何变化
 *
 * 例子：
 *
 * var arrayMap = require("../util/arrayMap");
 * var array = [1, 2, 3];
 * var newArray = arrayMap(array, function(item) {
 *     return item + 1;
 * })
 *
 * console.log(array); // [1, 2, 3]
 * console.log(newArray); // [2, 3, 4]
 *
 */

var each = __webpack_require__(0);

function map(o, callbackfn) {
    var a = [];
    each(o, function (value, index, source) {
        a[index] = callbackfn(value, index, source);
    });
    return a;
}

module.exports = function () {
    var arrMap = [].map;
    return arrMap ? function (o, callbackfn) {
        return arrMap.call(o, callbackfn);
    } : map;
}();

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

/**
 * color 管理对象，来自STK
 * 例子：
 *
 * var color = require("../util/color");
 * var black = color("#000000")
 *
 */

var forEach = __webpack_require__(0);
var analysisHash = /^#([a-fA-F0-9]{3,8})$/;
var testRGBorRGBA = /^rgb[a]?\s*\(/;
var analysisRGBorRGBA = /([0-9\.]+)/ig;
var splitRGBorRGBA = /([a-fA-F0-9]{2})/ig;

var analysis = function (str) {
    var ret = [];
    var list = [];
    if (analysisHash.test(str)) {
        list = str.match(analysisHash);
        if (list[1].length <= 4) {
            ret = [];

            forEach(list[1].split(''), function (value, index) {
                ret.push(parseInt(value + value, 16));
            });
        } else if (list[1].length <= 8) {
            ret = [];

            forEach(list[1].match(splitRGBorRGBA), function (value, index) {
                ret.push(parseInt(value, 16));
            });
        }
        return ret;
    }
    if (testRGBorRGBA.test(str)) {
        list = str.match(analysisRGBorRGBA);
        ret = [];
        forEach(list, function (value, index) {
            ret.push(parseInt(value, 10));
        });
        return ret;
    }
    return false;
};

module.exports = function (colorStr) {
    var ret = analysis(colorStr);
    if (!ret) {
        return false;
    }
    var that = {};
    /**
     * Describe 获取red
     * @method getR
     * @return {Number}
     * @example
     */
    that.getR = function () {
        return ret[0];
    };
    /**
     * Describe 获取green
     * @method getG
     * @return {Number}
     * @example
     */
    that.getG = function () {
        return ret[1];
    };
    /**
     * Describe 获取blue
     * @method getB
     * @return {Number}
     * @example
     */
    that.getB = function () {
        return ret[2];
    };
    /**
     * Describe 获取alpha
     * @method getA
     * @return {Number}
     * @example
     */
    that.getA = function () {
        return ret[3];
    };
    return that;
};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (text, opts) {
    //----------------require--------------
    var parseModule = __webpack_require__(5); // 页面模块自动解析
    var merge = __webpack_require__(4);
    var render = __webpack_require__(38);
    var dialog = __webpack_require__(20);
    //-----------声明模块全局变量-------------
    //
    opts = merge({
        icon: "err", //"suc"
        ok: function () {}
    }, opts || {});

    opts["buttons"] = [{ 'id': 'ok', 'text': opts['okText'] || '确定', type: 'blue' }];

    var boxHTML = render({
        'text': text,
        'icon': opts.icon
    });
    opts.boxHTML = boxHTML;

    var that = dialog(opts);

    //-------------事件响应声明---------------
    var evtFuncs = {
        buttonclick: function (ev) {
            if (ev.data.type == 'ok') {
                try {
                    opts[ev.data.type]();
                    that.hide(ev.data.type);
                } catch (ex) {
                    console.err(ex);
                }
            }
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        that.bind('buttonClick', evtFuncs.buttonclick);
    };

    //-------------自定义函数----------------
    var custFuncs = {};

    //-------------一切从这开始--------------

    // 找到所有带有node-name的节点
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();

    //---------------暴露API----------------

    return that;
};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (text, opts) {
    //----------------require--------------
    var parseModule = __webpack_require__(5); // 页面模块自动解析
    var merge = __webpack_require__(4);
    var render = __webpack_require__(39);
    var dialog = __webpack_require__(20);
    //-----------声明模块全局变量-------------
    //
    opts = merge({
        icon: "suc", //"suc"
        ok: function () {},
        cancel: function () {}
    }, opts || {});

    opts["buttons"] = [{ 'id': 'ok', 'text': opts['okText'] || '确定', type: 'blue' }, { 'id': 'cancel', 'text': opts['cancelText'] || '取消' }];

    var boxHTML = render({
        'text': text
    });
    opts.boxHTML = boxHTML;

    var that = dialog(opts);

    //-------------事件响应声明---------------
    var evtFuncs = {
        buttonclick: function (ev) {
            if (ev.data.type == 'ok' || ev.data.type == 'cancel') {
                try {
                    opts[ev.data.type]();
                    that.hide(ev.data.type);
                } catch (ex) {
                    console.err(ex);
                }
            }
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        that.bind('buttonClick', evtFuncs.buttonclick);
    };

    //-------------自定义函数----------------
    var custFuncs = {};

    //-------------一切从这开始--------------

    // 找到所有带有node-name的节点
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();

    //---------------暴露API----------------

    return that;
};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (msg, opts) {
    //----------------require--------------
    var popup = __webpack_require__(34); // 基础对象
    var animate = __webpack_require__(42); // 基础对象
    var merge = __webpack_require__(4);

    opts = merge({
        bottom: 60
    }, opts || {});

    //-----------声明模块全局变量-------------
    var that = popup('<div class="mg-win-toast">' + msg + '</div>', {
        mask: false,
        keepMiddle: true
    });

    //-------------事件响应声明---------------
    var evtFuncs = {
        show: function () {
            that.setPosition(null, "auto", null, opts.bottom + "px");
            custFuncs.animate();
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        that.bind("show", evtFuncs.show);
    };

    //-------------自定义函数----------------
    var custFuncs = {
        animate: function () {
            var node = that.getOuter();
            var ani = animate.chain(node).animate({ opacity: 0.6 }, 500, 'ease-in').animate({ opacity: 0 }, 1000, 'ease-in', function () {
                node.parentNode.removeChild(node);
            });
        }
    };

    //-------------一切从这开始--------------

    // 找到所有带有node-name的节点
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();

    //---------------暴露API----------------

    return that;
};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @author 璩
 * @data 2016-11-29
 * @description 移动弹层
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(2); // 基础对象
    var addEvent = __webpack_require__(6);
    var removeEvent = __webpack_require__(11);
    var preventDefault = __webpack_require__(19);
    var merge = __webpack_require__(4);
    var getPosition = __webpack_require__(23);

    //-----------声明模块全局变量-------------
    var that = base();
    var defaults = {
        direct: "move", //方向left|right|top|bottom|brc
        cursor: true,
        box: null, //内容节点
        layer: null, //弹层节点
        inner: 0, //内间距
        outside: 0 //外边距
    };
    var data = null;

    opts = merge(defaults, opts);

    var cursorValue = {
        move: "move",
        left: "w-resize",
        right: "e-resize",
        top: "n-resize",
        bottom: "s-resize",
        brc: "nwse-resize"
    };

    //-------------事件响应声明---------------
    var evtFuncs = {
        mouseDown: function (e) {
            preventDefault(e);
            var cursorX = e.pageX || e.clientX + document.body.scrollTop - document.body.clientTop;
            var cursorY = e.pageY || e.clientY + document.body.scrollLeft - document.body.clientLeft;
            var layer = opts.layer == null ? node : opts.layer;
            var box = opts.box == null ? layer : opts.box;
            var pos = getPosition(layer);
            var top = pos.top;
            var left = pos.left;
            var boxWidth = box.offsetWidth;
            var boxHeight = box.offsetHeight;
            var layerWidth = layer.offsetWidth;
            var layerHeight = layer.offsetHeight;
            var iWidth = document.body.offsetWidth;
            var iHeight = document.body.offsetHeight;
            function _onmousemove(e) {
                e = e || window.event;
                var moveX = e.pageX || e.clientX + document.body.scrollTop - document.body.clientTop;
                var moveY = e.pageY || e.clientY + document.body.scrollLeft - document.body.clientLeft;
                var gadX = moveX - cursorX;
                var gadY = moveY - cursorY;
                var x = 0,
                    y = 0,
                    realW = 0,
                    realH = 0;
                switch (opts.direct) {
                    case "move":
                        x = Math.max(0, Math.min(iWidth - opts.outside - layerWidth, left + gadX));
                        y = Math.max(0, Math.min(iHeight - -opts.outside - layerHeight, top + gadY));
                        layer.style.left = x + "px";
                        layer.style.top = y + "px";
                        break;
                    case "left":
                        x = Math.min(left + boxWidth - Math.abs(opts.inner), Math.max(0, left + gadX));
                        realW = Math.max(Math.abs(opts.inner), Math.min(boxWidth + left, boxWidth - gadX));
                        box.style.width = realW + "px";
                        layer.style.left = x + "px";
                        break;
                    case "right":
                        realW = Math.max(Math.abs(opts.inner), Math.min(iWidth - left - opts.outside - (layerWidth - boxWidth), boxWidth + gadX));
                        box.style.width = realW + "px";
                        break;
                    case "top":
                        y = Math.min(top + boxHeight - Math.abs(opts.inner), Math.max(0, top + gadY));
                        realH = Math.max(Math.abs(opts.inner), Math.min(boxHeight + top, boxHeight - gadY));
                        box.style.height = realH + "px";
                        layer.style.top = y + "px";
                        break;
                    case "bottom":
                        realH = Math.max(Math.abs(opts.inner), Math.min(iHeight - top - opts.outside - (layerHeight - boxHeight), boxHeight + gadY));
                        box.style.height = realH + "px";
                        break;
                    case "brc":
                        realW = Math.max(Math.abs(opts.inner), Math.min(iWidth - left - opts.outside - (layerWidth - boxWidth), boxWidth + gadX));
                        realH = Math.max(Math.abs(opts.inner), Math.min(iHeight - top - opts.outside - (layerHeight - boxHeight), boxHeight + gadY));
                        box.style.width = realW + "px";
                        box.style.height = realH + "px";
                        break;
                }
                preventDefault(e);
            }
            function _onmouseup() {
                removeEvent(document, "mousemove", _onmousemove);
                removeEvent(document, "mouseup", _onmouseup);
            }
            addEvent(document, "mousemove", _onmousemove);
            addEvent(document, "mouseup", _onmouseup);
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        addEvent(node, "mousedown", evtFuncs.mouseDown);
    };

    //-------------自定义函数----------------
    var custFuncs = {
        initView: function () {
            opts.cursor && (node.style.cursor = cursorValue[opts.direct]);
        }
    };

    //-------------一切从这开始--------------
    var init = function (_data) {
        data = _data;
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();
        custFuncs.initView();
    };

    //---------------暴露API----------------
    that.init = init;

    return that;
};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(2); // 基础对象
    var parseModule = __webpack_require__(5); // 页面模块自动解析
    var insertHTML = __webpack_require__(24);
    var merge = __webpack_require__(4);
    var render = __webpack_require__(41);
    var setStyle = __webpack_require__(29);
    var className = __webpack_require__(21);
    var addEvent = __webpack_require__(6);
    var preventDefault = __webpack_require__(19);
    var removeEvent = __webpack_require__(11);

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var data = null;
    var p_timer = null;

    var defaults = {
        horizontal: {
            top: 1,
            right: 1,
            bottom: null,
            left: null
        }
    };
    opts = merge(true, defaults, opts);
    //-------------事件响应声明---------------
    var evtFuncs = {
        scroll: function () {
            if (!className.has(nodeList.rightSimScroll, 'hide')) {
                var boxNode = nodeList.box;
                var y = boxNode.scrollTop;
                var h = boxNode.offsetHeight;
                var sh = boxNode.scrollHeight;
                var toolHeight = nodeList.rightScrollTool.offsetHeight;

                nodeList.rightScrollTool.style.top = custFuncs.unit(Math.min(y * h / sh, h - toolHeight - 34));
            }
        },
        scrollRightTool: function (evt) {
            var cursorY = evt.clientY;
            var cTop = parseFloat(nodeList.rightScrollTool.style.top || 0.1);
            var h = nodeList.box.offsetHeight;
            var sh = nodeList.box.scrollHeight;
            var toolHeight = nodeList.rightScrollTool.offsetHeight;

            addEvent(document, 'mousemove', _onmousemove);
            addEvent(document, 'mouseup', _onmouseup);
            function _onmousemove(evt) {
                var moveY = evt.clientY;
                var y = moveY - cursorY + cTop;
                var top = Math.max(0, Math.min(h - toolHeight, y));
                var sTop = Math.max(0, Math.min(h - toolHeight - 34, y));
                nodeList.rightScrollTool.style.top = custFuncs.unit(sTop);
                nodeList.box.scrollTop = top * sh / h;
                preventDefault(evt);
            }
            function _onmouseup() {
                removeEvent(document, "mousemove", _onmousemove);
                removeEvent(document, "mouseup", _onmouseup);
            }
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        addEvent(nodeList.box, 'scroll', evtFuncs.scroll);
        addEvent(nodeList.rightScrollTool, 'mousedown', evtFuncs.scrollRightTool);
    };

    //-------------自定义函数----------------
    var custFuncs = {
        loadScroll: function () {
            p_timer = setTimeout(function () {

                var h = nodeList.box.offsetHeight;
                var sh = nodeList.box.scrollHeight;

                var hStyle = {
                    height: custFuncs.unit(h)
                };

                if (opts.horizontal.left != null) {
                    hStyle.left = custFuncs.unit(opts.horizontal.left);
                } else {
                    hStyle.right = custFuncs.unit(opts.horizontal.right);
                }

                if (opts.horizontal.bottom != null) {
                    hStyle.bottom = custFuncs.unit(opts.horizontal.bottom);
                } else {
                    hStyle.top = custFuncs.unit(opts.horizontal.top);
                }

                setStyle(nodeList.rightSimScroll, hStyle);

                nodeList.scrollRightBg.style.height = custFuncs.unit(h - 34);
                className.remove(nodeList.rightSimScroll, 'hide');
                var toolHright = h * h / sh;

                nodeList.rightScrollTool.style.height = custFuncs.unit(toolHright);
            }, 10);
        },
        initView: function () {
            insertHTML(nodeList.box, render(), 'afterend');
            nodeList = parseModule(node);
        },
        unit: function (v) {
            if (!isNaN(v)) {
                return v + 'px';
            }
            return v;
        }
    };

    //-------------一切从这开始--------------
    var init = function (_data) {
        data = {};
        nodeList = parseModule(node);
        custFuncs.initView();
        // 找到所有带有node-name的节点
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();
    };

    //---------------暴露API----------------
    that.init = init;
    that.loadScroll = custFuncs.loadScroll;

    return that;
};

/***/ },
/* 50 */
/***/ function(module, exports) {

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
function defaultClearTimeout() {
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
})();
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
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
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
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
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
    while (len) {
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

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ },
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/* 图片版本号 在image-path函数中调用 */\n/* 非标注中的序号的颜色，以00开始编号，保证数字编号与设计图标注的标号一致。*/\n/* 背景颜色 */\n/*frame顶部的透明色*/\n/* 字体颜色 */\n/* 字体大小 */\n/* 字体序号数字为rem值的小数，即1.8rem则为$font_size_8 */\n/* 边框颜色 */\n/* 图片地址统一使用本函数生成，同时支持版本号 */\n/**\n * 注意：\n *       关于单位，pcweb使用px，移动端使用rem，使用时注意修改body中的font-size（或者其它位置的相应单位）\n */\n/**\n * Eric Meyer's Reset CSS v2.0 (http://meyerweb.com/eric/tools/css/reset/)\n * http://cssreset.com\n */\nhtml,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font: inherit;\n  font-size: 100%;\n  vertical-align: middle; }\n\n/*去除安卓高亮边框*/\n* {\n  -webkit-tap-highlight-color: transparent; }\n\ndiv:focus,\na:focus,\ninput:focus {\n  -webkit-tap-highlight-color: transparent; }\n\ndiv:active,\na:active,\ninput:active {\n  -webkit-tap-highlight-color: transparent; }\n\n/* HTML5 display-role reset for older browsers */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block; }\n\nhtml {\n  color: #333;\n  height: 100%;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n   -ms-user-select: none;\n       user-select: none; }\n\n/*防止在webkit下出现font boosting*/\n* {\n  max-height: 999999px; }\n\n/*@media only screen and (-webkit-min-device-pixel-ratio: 3) {\n    html { font-size: 15px; }\n}*/\nbody {\n  font-size: 12px;\n  line-height: 1.5;\n  font-family: \"-apple-system\", \"Heiti SC\", \"Helvetica\", \"Helvetica Neue\", \"Droid Sans Fallback\", \"Droid Sans\";\n  height: auto;\n  min-height: 100%; }\n\nol,\nul {\n  list-style: none; }\n\nblockquote,\nq {\n  quotes: none; }\n\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: ''; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\na {\n  text-decoration: none; }\n\na:focus {\n  outline: none; }\n\ninput,\ntextarea,\nbutton,\na {\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0); }\n\nbody {\n  -webkit-text-size-adjust: none;\n  /*-webkit-user-select:none;*/ }\n\na,\nimg {\n  /*-webkit-touch-callout: none;*/\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0); }\n\ninput:focus {\n  outline: none; }\n\n/* ------------- reset end --------------- */\n/* 单行加省略号 */\n.single-line-clamp {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  word-break: break-all; }\n\n.show {\n  display: block !important; }\n\n.hide {\n  display: none !important; }\n\n.clearfix:after, .m-dialog-common > .box:after, .m-grid-page:after {\n  content: \".\";\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden;\n  overflow: hidden; }\n\n.clearfix, .m-dialog-common > .box, .m-grid-page {\n  display: inline-block; }\n\n.clearfix, .m-dialog-common > .box, .m-grid-page {\n  display: block; }\n\n/* .clearfix:before, \n.clearfix:after {\n    display: table;\n    line-height:  0;\n    content: \"\";\n}   \n.clearfix:after {\n    clear: both;\n} */\n/* 图片版本号 在image-path函数中调用 */\n/* 非标注中的序号的颜色，以00开始编号，保证数字编号与设计图标注的标号一致。*/\n/* 背景颜色 */\n/*frame顶部的透明色*/\n/* 字体颜色 */\n/* 字体大小 */\n/* 字体序号数字为rem值的小数，即1.8rem则为$font_size_8 */\n/* 边框颜色 */\n@font-face {\n  font-family: \"iconfont\";\n  src: url(\"/font/iconfont.eot?t=1505787898067\");\n  /* IE9*/\n  src: url(\"/font/iconfont.eot?t=1505787898067#iefix\") format(\"embedded-opentype\"), url(\"/font/iconfont.ttf?t=1505787898067\") format(\"truetype\"), url(\"/font/iconfont.svg?t=1505787898067#iconfont\") format(\"svg\");\n  /* iOS 4.1- */ }\n\n.iconfont {\n  font-family: \"iconfont\" !important;\n  font-size: 16px;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.icon-all:before {\n  content: \"\\E696\"; }\n\n.icon-back:before {\n  content: \"\\E697\"; }\n\n.icon-category:before {\n  content: \"\\E699\"; }\n\n.icon-close:before {\n  content: \"\\E69A\"; }\n\n.icon-comments:before {\n  content: \"\\E69B\"; }\n\n.icon-cry:before {\n  content: \"\\E69C\"; }\n\n.icon-delete:before {\n  content: \"\\E69D\"; }\n\n.icon-edit:before {\n  content: \"\\E69E\"; }\n\n.icon-email:before {\n  content: \"\\E69F\"; }\n\n.icon-favorite:before {\n  content: \"\\E6A0\"; }\n\n.icon-form:before {\n  content: \"\\E6A2\"; }\n\n.icon-help:before {\n  content: \"\\E6A3\"; }\n\n.icon-information:before {\n  content: \"\\E6A4\"; }\n\n.icon-less:before {\n  content: \"\\E6A5\"; }\n\n.icon-moreunfold:before {\n  content: \"\\E6A6\"; }\n\n.icon-more:before {\n  content: \"\\E6A7\"; }\n\n.icon-pic:before {\n  content: \"\\E6A8\"; }\n\n.icon-qrcode:before {\n  content: \"\\E6A9\"; }\n\n.icon-rfq:before {\n  content: \"\\E6AB\"; }\n\n.icon-search:before {\n  content: \"\\E6AC\"; }\n\n.icon-selected:before {\n  content: \"\\E6AD\"; }\n\n.icon-set:before {\n  content: \"\\E6AE\"; }\n\n.icon-smile:before {\n  content: \"\\E6AF\"; }\n\n.icon-success:before {\n  content: \"\\E6B1\"; }\n\n.icon-survey:before {\n  content: \"\\E6B2\"; }\n\n.icon-viewgallery:before {\n  content: \"\\E6B4\"; }\n\n.icon-viewlist:before {\n  content: \"\\E6B5\"; }\n\n.icon-warning:before {\n  content: \"\\E6B6\"; }\n\n.icon-wrong:before {\n  content: \"\\E6B7\"; }\n\n.icon-add:before {\n  content: \"\\E6B9\"; }\n\n.icon-remind:before {\n  content: \"\\E6BC\"; }\n\n.icon-box:before {\n  content: \"\\E6CB\"; }\n\n.icon-process:before {\n  content: \"\\E6CE\"; }\n\n.icon-electrical:before {\n  content: \"\\E6D4\"; }\n\n.icon-electronics:before {\n  content: \"\\E6DA\"; }\n\n.icon-gifts:before {\n  content: \"\\E6DB\"; }\n\n.icon-lights:before {\n  content: \"\\E6DE\"; }\n\n.icon-atmaway:before {\n  content: \"\\E6E9\"; }\n\n.icon-pin:before {\n  content: \"\\E6F2\"; }\n\n.icon-text:before {\n  content: \"\\E6FC\"; }\n\n.icon-move:before {\n  content: \"\\E6FD\"; }\n\n.icon-gerenzhongxin:before {\n  content: \"\\E70B\"; }\n\n.icon-operation:before {\n  content: \"\\E70E\"; }\n\n.icon-remind1:before {\n  content: \"\\E713\"; }\n\n.icon-map:before {\n  content: \"\\E715\"; }\n\n.icon-accountfilling:before {\n  content: \"\\E732\"; }\n\n.icon-libra:before {\n  content: \"\\E74C\"; }\n\n.icon-color:before {\n  content: \"\\E760\"; }\n\n.icon-favorites:before {\n  content: \"\\E7CE\"; }\n\n.icon-Calculator:before {\n  content: \"\\E812\"; }\n\n.icon-earth:before {\n  content: \"\\E828\"; }\n\n.m-blue-bg-button, .m-white-bg-button {\n  box-sizing: border-box;\n  display: inline-block;\n  border: 1px solid #e3e4e9;\n  border-radius: 3px;\n  height: 38px;\n  line-height: 36px;\n  font-size: 14px;\n  text-align: center;\n  padding: 0 25px;\n  cursor: pointer;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none; }\n\n/* 默认按钮，蓝色白字 */\n.m-blue-bg-button {\n  color: #ffffff;\n  background: #2ba0ff;\n  border-color: #2ba0ff; }\n  .m-blue-bg-button:hover {\n    background: #4eaaff; }\n  .m-blue-bg-button:active {\n    background: #2ba0ff; }\n  .m-blue-bg-button.gray {\n    cursor: default; }\n    .m-blue-bg-button.gray:hover {\n      color: #666666;\n      border-color: #e3e4e9; }\n    .m-blue-bg-button.gray:active {\n      background: #ffffff;\n      border-color: #e3e4e9;\n      color: #666666; }\n\n/* 白底 */\n.m-white-bg-button {\n  color: #666666;\n  background: #ffffff; }\n  .m-white-bg-button:hover {\n    color: #2ba0ff;\n    border-color: #2ba0ff; }\n  .m-white-bg-button:active {\n    background: #ffffff;\n    border-color: #e3e4e9;\n    color: #666666; }\n\n.m-dialog-common {\n  position: absolute;\n  border: solid 1px #e3e4e9;\n  border-radius: 3px;\n  background-color: #ffffff; }\n  .m-dialog-common > .header {\n    color: #333333;\n    font-size: 16px;\n    position: relative;\n    background-color: #f4f5f9;\n    padding: 14px 20px 11px 20px; }\n    .m-dialog-common > .header > .close {\n      width: 24px;\n      height: 24px;\n      position: absolute;\n      top: 10px;\n      right: 16px; }\n    .m-dialog-common > .header > .iconfont {\n      font-size: 20px; }\n  .m-dialog-common > .box {\n    border: 1px solid transparent; }\n  .m-dialog-common .footer {\n    text-align: center;\n    padding: 10px 0;\n    background-color: #f4f5f9; }\n    .m-dialog-common .footer a {\n      margin: 0 10px; }\n\n.m-dialog-alert {\n  margin: 60px 40px 90px 40px;\n  font-size: 14px;\n  color: #333333;\n  text-align: center;\n  min-width: 450px; }\n  .m-dialog-alert .iconfont {\n    font-size: 34px; }\n\n.mg-win-toast {\n  padding: 0 20px;\n  height: 50px;\n  background: black;\n  opacity: 0;\n  text-align: center;\n  font-size: 20px;\n  line-height: 50px;\n  color: #ffffff;\n  border-radius: 8px; }\n\n.m-loading {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  background: #ffffff; }\n  .m-loading .loading {\n    width: 100px;\n    height: 100px;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    margin-top: -80px;\n    margin-left: -50px; }\n    .m-loading .loading span {\n      display: inline-block;\n      width: 16px;\n      height: 16px;\n      background: #2ba0ff;\n      position: absolute;\n      opacity: 0.2;\n      border-radius: 50%;\n      -webkit-animation: pageLoading 1s ease infinite;\n              animation: pageLoading 1s ease infinite; }\n    .m-loading .loading span:nth-child(1) {\n      left: 0;\n      top: 50%;\n      margin-top: -8px; }\n    .m-loading .loading span:nth-child(2) {\n      left: 14px;\n      top: 14px;\n      -webkit-animation-delay: 0.125s;\n              animation-delay: 0.125s; }\n    .m-loading .loading span:nth-child(3) {\n      left: 50%;\n      top: 0;\n      margin-left: -8px;\n      -webkit-animation-delay: 0.25s;\n              animation-delay: 0.25s; }\n    .m-loading .loading span:nth-child(4) {\n      right: 14px;\n      top: 14px;\n      -webkit-animation-delay: 0.375s;\n              animation-delay: 0.375s; }\n    .m-loading .loading span:nth-child(5) {\n      right: 0;\n      top: 50%;\n      margin-top: -8px;\n      -webkit-animation-delay: 0.5s;\n              animation-delay: 0.5s; }\n    .m-loading .loading span:nth-child(6) {\n      right: 14px;\n      bottom: 14px;\n      -webkit-animation-delay: 0.625s;\n              animation-delay: 0.625s; }\n    .m-loading .loading span:nth-child(7) {\n      left: 50%;\n      bottom: 0;\n      margin-left: -8px;\n      -webkit-animation-delay: 0.875s;\n              animation-delay: 0.875s; }\n    .m-loading .loading span:nth-child(8) {\n      left: 14px;\n      bottom: 14px;\n      -webkit-animation-delay: s;\n              animation-delay: s; }\n\n@-webkit-keyframes pageLoading {\n  0% {\n    opacity: 0.2;\n    -webkit-transform: scale(0.3);\n            transform: scale(0.3); }\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1.2);\n            transform: scale(1.2); } }\n\n@keyframes pageLoading {\n  0% {\n    opacity: 0.2;\n    -webkit-transform: scale(0.3);\n            transform: scale(0.3); }\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1.2);\n            transform: scale(1.2); } }\n\n.m-bottom-scroll {\n  width: 100%;\n  height: 17px;\n  position: absolute;\n  bottom: 54px;\n  left: 0;\n  background-color: #ffffff; }\n  .m-bottom-scroll .scroll-bg {\n    height: 7px;\n    background-color: #efefef;\n    margin: 5px 17px;\n    position: relative; }\n  .m-bottom-scroll .scroll-tool {\n    position: absolute;\n    height: 7px;\n    width: 200px;\n    left: 0;\n    top: 0;\n    background-color: rgba(199, 199, 199, 0.6);\n    cursor: pointer;\n    border-radius: 3px; }\n    .m-bottom-scroll .scroll-tool:hover {\n      background-color: #c7c7c7; }\n    .m-bottom-scroll .scroll-tool:active {\n      background-color: #b5b5b5; }\n\n.m-right-scroll {\n  width: 17px;\n  height: 80px;\n  position: absolute;\n  top: 40px;\n  right: 0;\n  background-color: #ffffff; }\n  .m-right-scroll .scroll-bg {\n    height: 50px;\n    width: 7px;\n    background-color: #efefef;\n    margin: 17px 5px;\n    position: relative; }\n  .m-right-scroll .scroll-tool {\n    position: absolute;\n    height: 30px;\n    width: 7px;\n    top: 0;\n    right: 0;\n    background-color: rgba(199, 199, 199, 0.6);\n    cursor: pointer;\n    border-radius: 3px; }\n    .m-right-scroll .scroll-tool:hover {\n      background-color: #c7c7c7; }\n    .m-right-scroll .scroll-tool:active {\n      background-color: #b5b5b5; }\n\n.m-grid-page {\n  line-height: 22px;\n  font-size: 14px;\n  min-width: 950px; }\n  .m-grid-page span,\n  .m-grid-page div,\n  .m-grid-page a {\n    float: left;\n    margin: 0 4px;\n    font-size: 14px;\n    color: #666666; }\n  .m-grid-page .select {\n    border: 1px solid #e3e4e9;\n    max-width: 30px;\n    border-radius: 3px; }\n  .m-grid-page .select-group {\n    position: relative; }\n    .m-grid-page .select-group .select {\n      text-indent: 4px;\n      line-height: 20px; }\n    .m-grid-page .select-group .icon {\n      background-position: -44.1rem -33.45rem;\n      width: 0.5rem;\n      height: 0.25rem;\n      background-image: url(\"/images/sprite.png?v=1496632378037\");\n      background-repeat: no-repeat;\n      background-size: 50.85rem 50.65rem;\n      display: inline-block;\n      position: absolute;\n      top: 10px;\n      right: 2px; }\n    .m-grid-page .select-group .items {\n      position: absolute;\n      border: 1px solid #e3e4e9;\n      border-bottom: none;\n      width: 100%;\n      z-index: 5;\n      max-height: 160px;\n      overflow: auto;\n      position: absolute;\n      top: -120px;\n      left: 0; }\n      .m-grid-page .select-group .items li {\n        cursor: pointer;\n        text-align: center; }\n        .m-grid-page .select-group .items li:hover {\n          background: #e2effa; }\n  .m-grid-page .first,\n  .m-grid-page .prev,\n  .m-grid-page .next,\n  .m-grid-page .last,\n  .m-grid-page .goTo {\n    border: 1px solid #e3e4e9;\n    border-radius: 3px;\n    padding: 0 10px; }\n    .m-grid-page .first:hover,\n    .m-grid-page .prev:hover,\n    .m-grid-page .next:hover,\n    .m-grid-page .last:hover,\n    .m-grid-page .goTo:hover {\n      border: 1px solid #2ba0ff;\n      color: #2ba0ff; }\n    .m-grid-page .first.gray,\n    .m-grid-page .prev.gray,\n    .m-grid-page .next.gray,\n    .m-grid-page .last.gray,\n    .m-grid-page .goTo.gray {\n      cursor: not-allowed; }\n      .m-grid-page .first.gray:hover,\n      .m-grid-page .prev.gray:hover,\n      .m-grid-page .next.gray:hover,\n      .m-grid-page .last.gray:hover,\n      .m-grid-page .goTo.gray:hover {\n        color: #666666;\n        border: 1px solid #e3e4e9; }\n  .m-grid-page .page input {\n    border: 1px solid #e3e4e9;\n    text-align: center;\n    margin: 0 4px;\n    line-height: 20px; }\n    .m-grid-page .page input:focus {\n      border: 1px solid #2e96ea; }\n  .m-grid-page .first i {\n    background-position: -44.1rem -25.7rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .first.gray:hover i {\n    background-position: -44.1rem -25.7rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .first:hover i {\n    background-position: -44.1rem -28.05rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .prev i {\n    background-position: -27.95rem -16.15rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .prev.gray:hover i {\n    background-position: -27.95rem -16.15rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .prev:hover i {\n    background-position: -27.95rem -14.05rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .next i {\n    background-position: -27.95rem -18.2rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .next.gray:hover i {\n    background-position: -27.95rem -18.2rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .next:hover i {\n    background-position: -44.15rem -35.1rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .last i {\n    background-position: -44.1rem -24.25rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .last.gray:hover i {\n    background-position: -44.1rem -24.25rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .last:hover i {\n    background-position: -44.1rem -23.35rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .goTo.gray:hover i {\n    background-position: -25.15rem -43.8rem;\n    width: 0.9rem;\n    height: 0.7rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .goTo i {\n    background-position: -25.15rem -43.8rem;\n    width: 0.9rem;\n    height: 0.7rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block;\n    padding-right: 5px; }\n  .m-grid-page .goTo:hover i {\n    background-position: -26.45rem -43.8rem;\n    width: 0.9rem;\n    height: 0.7rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n\n.m-calendar-year {\n  width: 289px;\n  border: 1px solid #e1e1e1;\n  color: #666666; }\n  .m-calendar-year .change {\n    width: 100%;\n    display: table;\n    background: #f3f6f8;\n    line-height: 30px;\n    height: 30px;\n    font-weight: 600; }\n    .m-calendar-year .change span {\n      display: table-cell;\n      text-align: center; }\n      .m-calendar-year .change span i {\n        border: 6px  solid transparent;\n        display: inline-block; }\n      .m-calendar-year .change span .arrow-left {\n        border-right: 6px solid #666666; }\n      .m-calendar-year .change span .arrow-right {\n        border-left: 6px solid #666666; }\n  .m-calendar-year .list ul {\n    width: 100%;\n    display: table;\n    text-align: center;\n    font-size: 14px;\n    font-weight: 600; }\n    .m-calendar-year .list ul li {\n      display: table-cell;\n      height: 73px; }\n      .m-calendar-year .list ul li span {\n        box-sizing: border-box;\n        border-radius: 6px;\n        position: relative;\n        display: inline-block;\n        line-height: 72px;\n        height: 72px;\n        width: 72px; }\n        .m-calendar-year .list ul li span.active {\n          color: #2f95ea;\n          border: 1px solid #2f95ea; }\n          .m-calendar-year .list ul li span.active:after {\n            content: \"\";\n            width: 8px;\n            height: 8px;\n            background: #2f95ea;\n            position: absolute;\n            border-radius: 50%;\n            top: 50px;\n            right: 32px; }\n        .m-calendar-year .list ul li span.gray {\n          color: #999999; }\n        .m-calendar-year .list ul li span:hover {\n          background: #e2effa;\n          cursor: pointer; }\n\n.m-layer {\n  position: absolute;\n  width: 12rem;\n  height: 12rem;\n  background-color: white; }\n", ""]);

// exports


/***/ },
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */
/***/ function(module, exports, __webpack_require__) {


var dialogManager = __webpack_require__(36);

var manager = {
	wait: function () {
		return dialogManager.wait();
	},
	closeWait: function () {
		return dialogManager.closeWait();
	},
	toast: function (msg, opts) {
		return top.dialogManager.toast(msg, opts);
	},
	success: function (text, onOkOrOpts) {
		return top.dialogManager.success(text, onOkOrOpts);
	},
	error: function (text, onOkOrOpts) {
		return top.dialogManager.error(text, onOkOrOpts);
	},
	confirm: function (text, onOkOrOpts, onCancel) {
		return top.dialogManager.confirm(text, onOkOrOpts, onCancel);
	},
	dialog: function (opts) {
		return top.dialogManager.dialog(opts);
	}
};

module.exports = manager;

/***/ },
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(12)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(55, function() {
			var newContent = __webpack_require__(55);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<button id=\'m-dialog1\'> dialog</button> \r\n<button id=\'m-toast\'> toast</button> \r\n<button id=\'m-success\'> success</button> \r\n<button id=\'m-error\'> error</button> \r\n<button id=\'m-confirm\'> confirm</button> ';

}
return __p
}

/***/ },
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var parseModule = __webpack_require__(5); // 页面模块自动解析
    // var dialog = require('pages/common/dialog/dialog');
    var dialogManager = __webpack_require__(63);
    var render = __webpack_require__(99);

    var config = {
        boxHTML: render(),
        buttons: [{ 'id': 'ok', 'text': '保存', 'type': 'blue' }, { 'id': 'cancel', 'text': '关闭' }]
    };
    var that = dialogManager.dialog(config);
    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var data = null;
    //-------------事件响应声明---------------
    var evtFuncs = {
        buttonClick: function (evt) {
            if (evt.data.type == 'cancel') {
                that.hide('close');
            }
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {
        that.bind('buttonClick', evtFuncs.buttonClick);
    };

    //-------------绑定事件------------------
    var bindEvents = function () {};

    //-------------自定义函数----------------
    var custFuncs = {};

    // 找到所有带有node-name的节点
    nodeList = parseModule(node);
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();

    //---------------暴露API----------------

    return that;
};

/***/ },
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div style="width: 400px;height: 900px;">\r\n	test	\r\n</div>';

}
return __p
}

/***/ },
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-06-06
 * @description 本文件用于方便复制粘贴入口文件之用，请更新这里的说明
 *              另外，考虑到一般是放在js/src/pages/page-name/main.js，因此使用../../
 *              如果不是这个目录，请更改成正确的相对路径
 */
//----------------require--------------
// var viewport = require("lib/dom/viewport"); // viewport
var base = __webpack_require__(2); // 基础对象
var parsePage = __webpack_require__(8); // 页面模块自动解析
var scss = __webpack_require__(69); // 引入当前页面的scss文件
// 模板
var render = __webpack_require__(78); // 页面总模板
var addEvent = __webpack_require__(6);
var dialog = __webpack_require__(93);
var dialogManager = __webpack_require__(63);

// var cYear = require("pages/common/components/calendarYear");
// 子模块
// var header = require("./header");

//-----------声明模块全局变量-------------
var nodeList = null; // 存储所有id符合m-xxx的节点
var opts = {}; // 请不要直接使用pageConfig
// var 
// var m_header = null;

//-------------事件响应声明---------------
var evtFuncs = {
    dialog1: function (evt) {
        dialogManager.wait();
        setTimeout(function () {
            dialogManager.closeWait();
            var dialog_1 = dialog();
            dialog_1.show();
        }, 500);
    },
    toast: function () {
        dialogManager.toast('TEST', { bottom: 100 });
    },
    success: function () {
        dialogManager.success('TEST', function () {
            console.log('success');
        });
        // dialogManager.success('TEST', {title: '成功提示'});
    },
    error: function () {
        dialogManager.error('TEST', function () {
            console.log('error');
        });
    },
    confirm: function () {
        dialogManager.confirm('TEST', function () {
            console.log('TEST1');
        }, function () {
            console.log('TEST2');
        });
    }
};

//-------------子模块实例化---------------
var initMod = function () {};

//-------------绑定事件------------------
var bindEvents = function () {
    addEvent(nodeList.dialog1, 'click', evtFuncs.dialog1);
    addEvent(nodeList.toast, 'click', evtFuncs.toast);
    addEvent(nodeList.success, 'click', evtFuncs.success);
    addEvent(nodeList.error, 'click', evtFuncs.error);
    addEvent(nodeList.confirm, 'click', evtFuncs.confirm);
};

//-------------自定义函数----------------
var custFuncs = {};

//-------------一切从这开始--------------
!function () {
    // 先将HTML插入body
    document.body.insertAdjacentHTML('AfterBegin', render(opts.modules));

    // 找到所有带有id的节点，并将m-xxx-xxx转化成xxxXxx格式存储到nodeList中
    nodeList = parsePage();
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();
}();

/***/ }
/******/ ]);