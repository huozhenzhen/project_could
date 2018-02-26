webpackHotUpdate(0,{

/***/ 94:
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
var ajax = __webpack_require__(77);
var scss = __webpack_require__(62);
var when = __webpack_require__(36);
var moduleListData = __webpack_require__(76);
var pathManager = __webpack_require__(82);
var frames = __webpack_require__(81);
var dialogManager = __webpack_require__(37);

var render = __webpack_require__(69);

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
var menuList = null;

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
	// m_leftNav = leftNav(nodeList.leftNav);
	// m_leftNav.init();
	debugger;
	m_frames = frames(nodeList.frames);
	m_frames.init();
};

//-------------绑定事件------------------
var bindEvents = function () {};

//-------------自定义函数----------------
var custFuncs = {

	initPage: function () {
		var defer = when.defer();

		document.body.insertAdjacentHTML('AfterBegin', render({ 'moduleList': moduleList }));
		nodeList = parsePage();
		initMod();

		defer.resolve();
		return defer.promise;
	},

	updateView: function () {
		var moduleArray = path.split("/");
		var newModuleName = moduleArray[1];

		if (moduleList == null) {
			moduleName = newModuleName;
			custFuncs.getModuleList().then(custFuncs.checkModule).then(custFuncs.getMenuList).then(custFuncs.initPage).then(custFuncs.openPage).otherwise(custFuncs.errorHandler);
		} else {
			moduleName = newModuleName;
			custFuncs.checkModule().then(custFuncs.getMenuList).then(custFuncs.openPage).otherwise(custFuncs.errorHandler);
		}
	},
	getMenuList: function () {
		var defer = when.defer();
		//通过moduleId获取左边菜单
		ajax({
			'url': 'js/src/pages/frame/arr1.json',
			'method': 'get',
			'data': null,
			'onSuccess': function (res) {
				menuList = res.data;
				defer.resolve();
			},
			'onError': function (req) {
				defer.reject(req);
			}
		});

		return defer.promise;
	},
	getModuleList: function () {

		var defer = when.defer();

		ajax({
			'url': 'js/src/pages/frame/arr.json',
			'method': 'get',
			'data': null,
			'onSuccess': function (res) {
				moduleList = res.data;
				defer.resolve();
			},
			'onError': function (req) {
				defer.reject(req);
			}
		});

		return defer.promise;
	},
	checkModule: function () {
		var defer = when.defer();
		var hasModule = false;

		for (var i = 0; i < moduleList.length; i++) {
			if (moduleList[i]['code'] == moduleName) {
				hasModule = true;
				moduleId = moduleList[i]["id"];
				moduleHomeURL = "/" + moduleName + "/home";
				moduleHomeText = moduleList[i]["text"];
				break;
			}
		}
		if (!hasModule) {
			defer.reject("URL配置出错！");
			return defer.promise;
		}

		defer.resolve();
		return defer.promise;
	},
	openPage: function () {
		var defer = when.defer();

		var url = null;
		url = "/proxy.html#" + path;
		m_frames.addFrame(url, moduleId);

		defer.resolve();
		return defer.promise;
	},
	errorHandler: function (msg) {
		dialogManager.error(msg);
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

/***/ }

})