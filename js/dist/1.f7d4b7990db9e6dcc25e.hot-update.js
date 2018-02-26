webpackHotUpdate(1,{

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

/***/ }

})