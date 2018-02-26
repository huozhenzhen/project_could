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
var dialogManager = __webpack_require__(74);

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
		nodeList = parsePage();
		initMod();
	},
	updateView: function () {
		var moduleArray = path.split("/");
		var newModuleName = moduleArray[1];

		if (moduleList == null) {
			// moduleList  =  moduleListData.data;
			custFuncs.getModuleList().then(custFuncs.checkModule);

			moduleName = newModuleName;
			// 
			// custFuncs.initPage();
			// custFuncs.openPage();
		}
	},
	getModuleList: function () {

		var defer = when.defer();

		ajax({
			'url': 'js/src/pages/frame/arr.json',
			'method': 'get',
			'data': null,
			'onSuccess': function (res) {
				moduleList = res.data;
				dialogManager.success('suc');
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
		debugger;
		if (!hasModule) {
			defer.reject("URL配置出错！");
			return defer.promise;
		}

		defer.resolve();
		return defer.promise;
	}
	// openPage: function() {
	// 	var url = null;
	// 	url = "/proxy.html#" + path;
	// 	m_frames.addFrame(url, moduleId);
	// },
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