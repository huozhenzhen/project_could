webpackHotUpdate(2,{

/***/ 14:
false,

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-06-06
 * @description 本文件用于方便复制粘贴入口文件之用，请更新这里的说明
 *              另外，考虑到一般是放在js/src/pages/page-name/main.js，因此使用../../
 *              如果不是这个目录，请更改成正确的相对路径
 */
//----------------require--------------

var base = __webpack_require__(3); // 基础对象
var parsePage = __webpack_require__(4); // 页面模块自动解析
var scss = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./main.scss\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // 引入当前页面的scss文件
var runtime = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"pages/common/runtime\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // 运行时相关代码

// 模板
var render = __webpack_require__(29);

//-----------声明模块全局变量-------------
var nodeList = null; // 存储所有id符合m-xxx的节点
var opts = {};

//-------------事件响应声明---------------
var evtFuncs = {};

//-------------子模块实例化---------------
var initMod = function () {};

//-------------绑定事件------------------
var bindEvents = function () {};

//-------------自定义函数----------------
var custFuncs = {};

//-------------一切从这开始--------------
!function () {
    // 先将HTML插入body
    document.body.insertAdjacentHTML('AfterBegin', render({}));

    // 找到所有带有id的节点，并将m-xxx-xxx转化成xxxXxx格式存储到nodeList中
    nodeList = parsePage();
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();
}();

/***/ }

})