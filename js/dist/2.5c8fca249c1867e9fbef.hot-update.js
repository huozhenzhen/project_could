webpackHotUpdate(2,{

/***/ 115:
false,

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
    var srtStyle = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"lib/domn/setStyle\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    var className = __webpack_require__(21);
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

    //-------------事件响应声明---------------
    var evtFuncs = {};

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {};

    //-------------自定义函数----------------
    var custFuncs = {
        loadScroll: function () {
            p_timer = setTimeout(function () {
                debugger;
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
            insertHTML(node, render(), 'afterend');
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
        custFuncs.initView();
        // 找到所有带有node-name的节点
        nodeList = parseModule(node);
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

/***/ 20:
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
	var simScroll = __webpack_require__(116);
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

/***/ }

})