webpackHotUpdate(4,{

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
    // var runtime = require("pages/common/runtime"); // 运行时相关代码
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
                    if (!load_modules[mod]) {
                        load_modules[mod] = { frame: [] };
                        exist_modules[mod] = mod + "_modules";
                        // var script = document.createElement("script");
                        // script.type = "text/javascript";
                        // script.src = "./js/dist/" + mod + "/common.js?ver=" + new Date().getTime();
                        // document.getElementsByTagName("head")[0].appendChild(script);
                    }
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

/***/ }

})