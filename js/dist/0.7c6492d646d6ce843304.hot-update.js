webpackHotUpdate(0,{

/***/ 23:
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

/***/ 25:
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

/***/ 26:
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
                var node = closest(evt.target);

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

/***/ 36:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="m-calendar-year">\r\n	<div class="change">\r\n		<span class="left" node-name = "prev"><i class="arrow-left"></i></span>\r\n		<span class="center">2000-2019</span>\r\n		<span class="right" node-name = "next"><i class="arrow-right"></i></span>\r\n	</div>\r\n	<section class="list" node-name="list">\r\n	\r\n	</section>\r\n</div>';

}
return __p
}

/***/ },

/***/ 40:
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

/***/ },

/***/ 41:
/***/ function(module, exports, __webpack_require__) {

/**
 * 获取节点相对于指定的节点的位置
 * 如果没有指定节点，则返回相对于document的位置
 * 例子：
 * var getPosition = require("../dom/getPosition");
 * var pos = getPosition(node);
 * console.log("left:" + pos.left, "top:" + pos.top);
 */

var contains = __webpack_require__(40);
var scrollPos = __webpack_require__(23);

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

/***/ 42:
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

var console = __webpack_require__(2);

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

/***/ 43:
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

/***/ 44:
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

var getEvent = __webpack_require__(15);

module.exports = function (event) {
    event = event || getEvent();

    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
};

/***/ },

/***/ 46:
/***/ function(module, exports, __webpack_require__) {

/**
 * 停止事件冒泡
 * 例子请阅读add函数
 */

var getEvent = __webpack_require__(15);

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

/***/ 47:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-06-10
 * @description 浮层的基本对象
 */
//----------------require--------------

var base = __webpack_require__(3); // 基础对象
var parseModule = __webpack_require__(11); // 页面模块自动解析
var getType = __webpack_require__(1);
var merge = __webpack_require__(6);
var insertHTML = __webpack_require__(42);
var clone = __webpack_require__(25);
var nodeOpera = __webpack_require__(21);
var preventDefault = __webpack_require__(44);
var addEvent = __webpack_require__(12);
var removeEvent = __webpack_require__(16);
var winSize = __webpack_require__(26);
var scrollPos = __webpack_require__(23);

var buildHTML = function (html) {
    var panel = document.createElement("div");
    panel.innerHTML = html;
    return nodeOpera.first(panel);
};

var disableEvent = function (ev) {
    preventDefault(ev);
};

var zIndex = 10000;

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
        return zIndex++;
    }
};

/***/ },

/***/ 48:
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
    var merge = __webpack_require__(6);
    var builder = __webpack_require__(47);
    var getPosition = __webpack_require__(41);
    var scrollBarSize = __webpack_require__(43);
    var parseModule = __webpack_require__(11);
    var stopPropagation = __webpack_require__(46);
    var winSize = __webpack_require__(26);
    var scrollPos = __webpack_require__(23);
    var addEvent = __webpack_require__(12);
    var removeEvent = __webpack_require__(16);
    var clone = __webpack_require__(25);

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