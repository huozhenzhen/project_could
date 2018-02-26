webpackHotUpdate(4,{

/***/ 104:
/***/ function(module, exports, __webpack_require__) {



/**
 * @author benny.zheng
 * @data 2016-06-06
 * @description 本文件用于方便复制粘贴入口文件之用，请更新这里的说明
 *              另外，考虑到一般是放在js/src/pages/page-name/main.js，因此使用../../
 *              如果不是这个目录，请更改成正确的相对路径
 */
//----------------require--------------

var base = __webpack_require__(3);
var parsePage = __webpack_require__(8);
var ajax = __webpack_require__(68);
var scss = __webpack_require__(52);
var when = __webpack_require__(32);
var moduleListData = __webpack_require__(66);
var pathManager = __webpack_require__(75);
var frames = __webpack_require__(111);

var render = __webpack_require__(59);

// 模板

//-----------声明模块全局变量-------------
var nodeList = null; // 存储所有id符合m-xxx的节点
var moduleId = null;
var moduleList = null;
var moduleName = null;
var path = null;
var hash = null;
var opts = {};
var m_frames = null;

//-------------事件响应声明---------------
var evtFuncs = {
	hasChange: function (evt) {
		path = evt.data[0];
		hash = evt.data[1];
		custFuncs.updateView();
	}
};

//-------------子模块实例化---------------
var initMod = function () {
	m_frames = frames(nodeList.frames);
	m_frames.init();
};

//-------------绑定事件------------------
var bindEvents = function () {};

//-------------自定义函数----------------
var custFuncs = {

	initPage: function () {
		document.body.insertAdjacentHTML('AfterBegin', render({ 'moduleList': moduleList }));
		initMod();
	},
	updateView: function () {
		var moduleArray = path.split("/");
		var newModuleName = moduleArray[1];

		if (moduleList == null) {
			moduleList = moduleListData.data;
			moduleName = newModuleName;
			custFuncs.initPage();
			custFuncs.openPage();
		}
	},
	openPage: function () {
		var url = null;
		url = "/proxy.html#" + path;
		m_frames.addFrame(url, moduleId);
	}
};

//-------------一切从这开始--------------
!function () {
	// 先将HTML插入body

	pathManager.bind('change', evtFuncs.hasChange);
	pathManager.start();

	// 找到所有带有id的节点，并将m-xxx-xxx转化成xxxXxx格式存储到nodeList中
	// nodeList = parsePage();
	// 子模块实例化
	// initMod();
	// 绑定事件
	// bindEvents();
}();

/***/ },

/***/ 111:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-20
 * @description 管理各iframe
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(3); // 基础对象
    var parseModule = __webpack_require__(9); // 页面模块自动解析
    var runtime = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"pages/common/runtime\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // 运行时相关代码
    var render = __webpack_require__(112);
    var nodeOpera = __webpack_require__(21);
    var appendQuery = __webpack_require__(90);
    var each = __webpack_require__(0);
    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var data = null;
    var frames = {};
    var current = null;
    var timer = null;
    var load_modules = {};
    var exist_modules = {};

    //-------------事件响应声明---------------
    var evtFuncs = {};

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {};

    //-------------自定义函数----------------
    var custFuncs = {
        timerDetection: function () {
            timer = setInterval(function () {
                each(exist_modules, function (val, key) {
                    if (window[val]) {
                        load_modules[key].loadJs = true;
                        each(load_modules[key].frame, function (item) {
                            custFuncs.addFrameURL(item.url, item.moduleId);
                        });
                        delete exist_modules[key];
                    }
                });
            }, 50);
        },
        addFrameURL: function (url, moduleId) {
            var html = null;

            if (current != null && current.getAttribute("data-url") == url) {
                return;
            } else if (current != null) {
                current.style.display = "none";
            }

            if (url in frames) {
                current = frames[url];
            } else {
                html = render({
                    url: appendQuery(url, {
                        appid: moduleId,
                        ver: new Date().getTime()
                    }),
                    path: url
                });
                node.insertAdjacentHTML('BeforeEnd', html);
                current = nodeOpera.last(node);
                frames[url] = current;
            }

            current.style.display = "block";
        },
        addFrame: function (url, moduleId) {
            if (/#\/(\w+)\//.test(url)) {
                var mod = RegExp.$1;
                if (load_modules[mod] && load_modules[mod].loadJs) {
                    custFuncs.addFrameURL(url, moduleId);
                } else {
                    // if(!load_modules[mod]){
                    //     load_modules[mod] = {frame: []};
                    //     exist_modules[mod] = mod + "_modules";
                    //     var script = document.createElement("script");
                    //     script.type = "text/javascript";
                    //     script.src = "./js/dist/" + mod + "/common.js?ver=" + new Date().getTime();
                    //     document.getElementsByTagName("head")[0].appendChild(script);
                    // }
                    load_modules[mod].frame.push({ url: url, moduleId: moduleId });
                }
            } else {
                custFuncs.addFrameURL(url, moduleId);
            }
        },
        removeFrame: function (url) {
            if (url in frames) {
                frames[url].parentNode.removeChild(frames[url]);
                delete frames[url];
            }
        },
        hasFrame: function (url) {
            return url in frames;
        },
        reloadFrame: function (url) {
            if (!(url in frames)) {
                return;
            }

            frames[url].contentWindow.location.reload(true);
        }
    };

    //-------------一切从这开始--------------
    var init = function (_data) {
        data = _data;
        // 找到所有带有node-name的节点
        nodeList = parseModule(node);
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();

        custFuncs.timerDetection();
    };

    //---------------暴露API----------------
    that.init = init;
    that.addFrame = custFuncs.addFrame;
    that.hasFrame = custFuncs.hasFrame;
    that.removeFrame = custFuncs.removeFrame;
    that.reloadFrame = custFuncs.reloadFrame;

    return that;
};

/***/ },

/***/ 112:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<iframe src="' +
((__t = (url)) == null ? '' : __t) +
'" class="frame" data-url="' +
((__t = (path)) == null ? '' : __t) +
'" frameborder="0"></iframe>';

}
return __p
}

/***/ }

})