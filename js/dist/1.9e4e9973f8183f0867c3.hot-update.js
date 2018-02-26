webpackHotUpdate(1,{

/***/ 116:
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
                var headerNode = nodeList.height;
                var y = headerNode.scrollTop;
                var h = headerNode.offsetHeight;
                var sh = headerNode.scrollHeight;
                var toolHright = nodeList.rightScrollTool.offsetHeight;

                nodeList.rightScrollTool.style.top = custFuncs.unit(Math.min(y * h / sh, h - scrollHeight - 34));
            }
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        addEvent(nodeList.box, 'scroll', evtFuncs.scroll);
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

/***/ }

})