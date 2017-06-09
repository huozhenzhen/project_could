webpackHotUpdate(0,{

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(3); // 基础对象
    var parseModule = __webpack_require__(11); // 页面模块自动解析
    var render = __webpack_require__(36);
    var className = __webpack_require__(39);
    var popup = __webpack_require__(48);
    var each = __webpack_require__(0);
    var merge = __webpack_require__(6);
    var addEvent = __webpack_require__(12);
    var closest = __webpack_require__(53);

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var m_popup = null;
    var data = null;
    opts = merge({
        beginYear: 2009
    }, opts || {});
    //-------------事件响应声明---------------
    var evtFuncs = {};

    //-------------子模块实例化---------------
    var initMod = function () {
        m_popup = popup(render());
        m_popup.show();

        nodeList = parseModule(m_popup.getOuter());
    };

    //-------------绑定事件------------------
    var bindEvents = function () {
        addEvent(nodeList.prev, "click", custFuncs.intiView);
        addEvent(nodeList.next, "click", custFuncs.intiView);
    };

    //-------------自定义函数----------------
    var custFuncs = {
        getYearData: function () {
            var arr = [];
            var start = opts.beginYear;
            for (var i = 0; i < 12; i++) {
                arr.push(start);
                start += 1;
            }
            return arr;
        },
        intiView: function (evt) {

            if (evt != undefined) {
                var node = evt.target;

                if (className.has(node, "left")) {
                    opts.beginYear = opts.beginYear + 10;
                }
                if (className.has(node, "right")) {
                    opts.beginYear = opts.beginYear - 10;
                }
            }

            var list = custFuncs.getYearData();
            var html = "";
            each(list, function (item, index) {
                if (index % 4 == 0) {
                    html = html + "<ul>";
                }
                html = html + "<li>" + item + "</li>";
                if (index % 4 == 3) {
                    html = html + "</ul>";
                }
            });

            nodeList.list.innerHTML = html;
        }

    };

    //-------------一切从这开始--------------
    var init = function (_data) {
        data = _data;
        // 找到所有带有node-name的节点
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();
        custFuncs.intiView();
    };

    //---------------暴露API----------------
    that.init = init;

    return that;
};

/***/ },

/***/ 53:
/***/ function(module, exports, __webpack_require__) {

var matches = __webpack_require__(55);
var contains = __webpack_require__(40);

module.exports = function (node, selector, box) {
    var result = null;
    box = box || document.body;

    if (node.closest) {
        result = node.closest(selector);

        if (!contains(box, result)) {
            return null;
        }
    }

    while (node && node != box && node.nodeType == 1) {
        if (matches(node, selector)) {
            return node;
        }

        node = node.parentNode;
    }

    return null;
};

/***/ },

/***/ 54:
/***/ function(module, exports, __webpack_require__) {

/**
 * 获取节点在父节点中的位置（仅限于element）
 */
var isElement = __webpack_require__(14);

module.exports = function (element, nodeList) {
    var at = 0;
    var childNodes = nodeList || element.parentNode.childNodes;

    for (var i = 0; i < childNodes.length; i++) {
        if (element == childNodes[i]) {
            return at;
        }

        if (isElement(childNodes[i])) {
            at++;
        }
    }

    return -1;
};

/***/ },

/***/ 55:
/***/ function(module, exports, __webpack_require__) {

/**
 * 判断当前节点是否匹配查询规则
 */
var sizzle = __webpack_require__(5);
var index = __webpack_require__(54);

module.exports = function (node, selector) {
    if (node.nodeType != 1) {
        return false;
    }

    var p = HTMLElement.prototype;
    var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
        return index(this, sizzle(s)) != -1;
    };

    return f.call(node, selector);
};

/***/ }

})