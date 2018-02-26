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
// var pathMap = require("../common/pathMap.json");


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

/***/ 59:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<header class="mg-header">\r\n	<a href="#/pc.html" class="logo"><i class="iconfont  icon-libra"></i></a>\r\n	<nav class="opera">\r\n		';
 moduleList.forEach(function(item) { ;
__p += '\r\n		    <a node-name="item" data-id="' +
((__t = (item.id)) == null ? '' : __t) +
'" title=\'' +
((__t = (item.description)) == null ? '' : __t) +
'\' data-query="id=' +
((__t = (item.id)) == null ? '' : __t) +
'&text=' +
((__t = (item.text)) == null ? '' : __t) +
'&code=' +
((__t = (item.code)) == null ? '' : __t) +
'&home=' +
((__t = (item.home)) == null ? '' : __t) +
'" href="#/' +
((__t = (item.code)) == null ? '' : __t) +
'' +
((__t = (item.home)) == null ? '' : __t) +
'"><i class="iconfont icon-' +
((__t = (item.flag)) == null ? '' : __t) +
'"></i>' +
((__t = (item.text)) == null ? '' : __t) +
'</a>\r\n		    ';
 }) ;
__p += '\r\n	</nav>\r\n</header>\r\n<main class=\'mg-main\'>\r\n	<div class=\'layout-nav\'>\r\n	</div>\r\n    <div class="layout-content">\r\n        <section class="mg-tab"></section>\r\n        <section class="mg-frames" id=\'m-frames\'></section>\r\n    </div>\r\n</main>';

}
return __p
}

/***/ }

})