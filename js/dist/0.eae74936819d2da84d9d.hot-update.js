webpackHotUpdate(0,[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
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

var isNode = __webpack_require__(26);

module.exports = function (element) {
  return isNode(element) && element.nodeType == 1;
};

/***/ },
/* 16 */
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

var getType = __webpack_require__(2);
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
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ function(module, exports, __webpack_require__) {

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(4); // 基础对象
    var parseModule = __webpack_require__(28); // 页面模块自动解析
    var merge = __webpack_require__(12);
    var render = __webpack_require__(23);
    var addEvent = __webpack_require__(16);
    var className = __webpack_require__(24);
    var opra = __webpack_require__(27);
    var eventProxy = __webpack_require__(30);

    //-----------声明模块全局变量-------------
    var nodeList = node; // 存储所有关键节点
    var that = base();
    var data = null;

    var ePage = null;
    var page = null;

    opts = merge({
        totalPages: 1, //总页数
        pageSize: 10, //每页显示几条
        curPage: 3, //当前页
        totalRows: 46, //总条数
        pageList: [10, 20, 30, 40, 50] //每页数列表
    }, opts || {});

    //-------------事件响应声明---------------
    var evtFuncs = {
        pageTurn: function (e) {
            var elem = e.target || e.relatedTarget || e.srcElement || e.currentTarget;
        },
        selectPageSize: function (e) {
            var elem = e.target || e.relatedTarget || e.srcElement || e.currentTarget;
            nodeList.pageSize.value = elem.innerHTML;
            className.add(nodeList.select, "hide");
            console.log(elem);
        },
        selectShow: function (e) {
            if (className.has(nodeList.select, "hide")) {
                className.remove(nodeList.select, "hide");
            } else {
                className.add(nodeList.select, "hide");
            }
        },
        next: function () {
            page = parseInt(page) + 1;
            custFuncs.pageChange();
        }

    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        eventProxy(node).add("select", "click", evtFuncs.selectPageSize);
        addEvent(nodeList.pageSize, "click", evtFuncs.selectShow);
        addEvent(nodeList.next, "click", evtFuncs.next);
    };

    //-------------自定义函数----------------
    var custFuncs = {
        pageChange: function () {

            nodeList.total.innerHTML = page + "&nbsp;/&nbsp;" + Math.ceil(opts.totalRows / ePage);
            nodeList.text.innerHTML = "当前" + ePage * page + "到" + (opts.totalRows % ePage == 0 ? ePage * (page + 1) : ePage * page + opts.totalRows % ePage) + "条，总共" + opts.totalRows + "条";
        },
        initView: function () {
            custFuncs.pageChange();
        }
    };

    //-------------一切从这开始--------------
    var init = function (_data) {
        data = _data;

        node.innerHTML = render(opts);
        // 找到所有带有node-name的节点
        nodeList = parseModule(node);

        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();

        ePage = nodeList.pageSize.value;
        page = nodeList.page.value;

        custFuncs.initView();
    };

    //---------------暴露API----------------
    that.init = init;

    return that;
};

/***/ },
/* 23 */
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="m-grid-page" node-name="gridPage">\r\n    <span class="text">每页显示</span>\r\n    \r\n    <div class="select-group" >\r\n        <input type="text" value="' +
((__t = (pageSize)) == null ? '' : __t) +
'" node-name="pageSize" readonly="readonly" class="select"/>\r\n        <ul class="hide" node-name="select">\r\n            ';
pageList.forEach(function(item){;
__p += '\r\n            <li data-action="select">' +
((__t = (item)) == null ? '' : __t) +
'</li>\r\n            ';
});
__p += '\r\n        </ul>\r\n    </div>\r\n\r\n\r\n    <a href="javascript:void(0)" class="first" node-name="first">第一页</a>\r\n    <a href="javascript:void(0)" class="prev" node-name="prev">向前</a>\r\n    <span class="total" node-name="total">1&nbsp;/&nbsp;1</span>\r\n    <a href="javascript:void(0)" class="next" node-name="next">向后</a>\r\n    <a href="javascript:void(0)" class="last" node-name="last">最后一页</a>\r\n\r\n    <div class="page">\r\n        第<input class="select" type="text" value="' +
((__t = (curPage)) == null ? '' : __t) +
'" node-name="page"/>页\r\n    </div>\r\n    <a href="javascript:void(0)" class="goTo" node-name="btn">跳转</a>\r\n\r\n    <span class="total-text" node-name="text">当前0到0条，总共0条</span>\r\n</div>';

}
return __p
}

/***/ },
/* 24 */
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

var isElement = __webpack_require__(15);
var each = __webpack_require__(0);
var getType = __webpack_require__(2);
var trim = __webpack_require__(3);
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
/* 25 */
/***/ function(module, exports) {

/**
 * 封装了node.dataset功能, dataset是标准浏览器新增的功能，这里主要是为了兼容旧浏览器
 * <div id="node" data-node-value="123"></div>
 * var dataset = require("../dom/dataset");
 * dataset.get(node, "nodeValue")将会读取data-node-value，得到123
 * dataset.set(node, "nodeValue", "123")将会设置data-node-value为123
 * 注意传入的KEY是驼峰命名
 */

var that = {};

var keyCase = function (key) {
    return "data-" + key.replace(/([A-Z]|(?:^\d+))/g, function (all, match) {
        return "-" + match.toLowerCase();
    });
};

that.get = function (node, key) {
    if ("dataset" in node) {
        return node.dataset[key];
    } else {
        var dataKey = keyCase(key);
        var attrs = node.attributes;
        var len = attrs.length;

        for (var i = 0; i < len; i++) {
            if (attrs[i].name == dataKey) {
                return attrs[i].value;
            }
        }
    }
};

that.set = function (node, key, val) {
    if ("dataset" in node) {
        node.dataset[key] = val;
    } else {
        var dataKey = keyCase(key);
        node.setAttribute(dataKey, val);
    }
};

that.remove = function (node, key) {
    if ("dataset" in node) {
        delete node.dataset[key];
    } else {
        var dataKey = keyCase(key);
        node.removeAttribute(dataKey);
    }
};

module.exports = that;

/***/ },
/* 26 */
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
/* 27 */
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
var isElement = __webpack_require__(15);
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

var sizzle = __webpack_require__(6);

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
/* 29 */
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 利用事件冒泡实现事件代理（尽量不要用mouseover之类非常耗性能的代理，建议自己实现）
 *
 * HTML:
 * <div id="node">
 *  <a href="javascript:void(0);" onclick="return false;" data-action="send" data-query="id=1&name=a">点击我</a>
 *  <a href="javascript:void(0);" onclick="return false;" data-action="send" data-query="id=2&name=b">点击我</a>
 * </div>
 *
 * var eventProxy = require("../evt/proxy");
 * var node = document.getElementById("node");
 * var proxy = eventProxy(node); // 为node节点建立一个事件代理器
 * var handler = function(evt) {
 *     return 0; // 可以返回： 0 正常执行（默认值），-1 不再执行未执行的事件响应函数，并且不响应上层元素的其它事件代理 其它真值：不再执行未执行的事件响应函数
 *
 *     evt的值是：
 *     evt = {
 *	       target: 触发事件的A连接对象,
 *         proxy: "send",
 *         data: { id: "1", name: "a"}, // 由data-query的值解析而来的json对象,data-query是一个查询字符串
 *         box: node, // 即建立事件代理的容器
 *         event: event对象 // DOM真正的event对象
 *     }
 * }
 *
 * proxy.add("send", "click", handler);
 *
 */

module.exports = function (outerNode) {
    var addEvent = __webpack_require__(16);
    var removeEvent = __webpack_require__(31);
    var getEvent = __webpack_require__(29);
    var dataset = __webpack_require__(25);
    var each = __webpack_require__(0);
    var trim = __webpack_require__(3);
    var queryToJson = __webpack_require__(13);
    var console = __webpack_require__(1);
    var proxyNameKey = "action";
    var proxyDataKey = "query";
    var that = {};
    var bindEvents = {};

    var eventHanlder = function (evt) {
        var node = evt.target || evt.srcElement;
        var evtResult = 0;
        var actionDatas = [];

        // 首先收集所有需要触发事件的节点（防止中途节点remove掉）
        while (node != outerNode) {
            if (node == null) {
                return;
            }

            if (node === outerNode) {
                break;
            }

            var name = dataset.get(node, proxyNameKey);

            if (name == null || (name = trim(name)) == "") {
                node = node.parentNode;
                continue;
            }

            if (bindEvents[evt.type] == null || bindEvents[evt.type][name] == null) {
                node = node.parentNode;
                continue;
            }

            if (node == null) {
                return;
            }

            actionDatas.push({
                target: node,
                proxy: name,
                data: queryToJson(dataset.get(node, proxyDataKey), true) || {}
            });

            node = node.parentNode;
        }

        var fns = bindEvents[evt.type];
        var actionData = null;
        evtResult = 0;

        for (var i = 0; i < actionDatas.length; i++) {
            actionData = actionDatas[i];

            for (var j = 0; j < fns[actionData.proxy].length; j++) {
                evtResult = fns[actionData.proxy][j]({
                    target: actionData.target,
                    proxy: actionData.proxy,
                    box: outerNode,
                    event: evt,
                    data: actionData.data
                });

                if (evtResult == undefined) {
                    evtResult = 0;
                }

                if (evtResult != 0) {
                    break;
                }
            }

            if (evtResult == -1) {
                break;
            }
        }
    };

    that.add = function (name, eventName, fn) {
        if (typeof fn != "function") {
            console.error("参数fn必须是函数");
            return;
        }

        if (bindEvents[eventName] == null) {
            bindEvents[eventName] = {};
            addEvent(outerNode, eventName, eventHanlder);
        }

        if (bindEvents[eventName][name] == null) {
            bindEvents[eventName][name] = [];
        }

        bindEvents[eventName][name].push(fn);
    };

    that.remove = function (name, eventName, fn) {
        if (typeof fn != "function") {
            console.error("参数fn必须是函数");
            return;
        }

        if (bindEvents[eventName] == null) {
            return;
        }

        if (bindEvents[eventName][name] == null) {
            return;
        }

        var fns = bindEvents[eventName][name];
        var newFns = [];
        var len = fns.length;

        for (var i = 0; i < len; i++) {
            if (fns[i] !== fn) {
                newFns.push(fns[i]);
            }
        }

        var isEmpty = true;

        bindEvents[eventName][name] = newFns.length == 0 ? null : newFns;

        // 清除没用的事件
        for (var key in bindEvents[eventName]) {
            if (bindEvents[eventName][key] == null) {
                try {
                    //尽可能地删除它
                    delete bindEvents[eventName][key];
                } catch (ex) {}
            } else {
                isEmpty = false;
                break;
            }
        }

        if (isEmpty) {
            bindEvents[eventName] = null;

            try {
                // 尽可能删除它
                delete bindEvents[eventName];
            } catch (ex) {}

            removeEvent(outerNode, eventName, eventHanlder);
        }
    };

    return that;
};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

/**
 * 删除事件
 * @2014-10-11 增加了批量处理功能，可以传入一个节点数组解绑事件
 * 例子请阅读add函数
 */

var getType = __webpack_require__(2);
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

/***/ }
])