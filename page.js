/**
 * @author benny.zheng
 * @data 2016-06-06
 * @description 本文件用于方便复制粘贴入口文件之用，请更新这里的说明
 *              另外，考虑到一般是放在js/src/pages/page-name/main.js，因此使用../../
 *              如果不是这个目录，请更改成正确的相对路径
 */
//----------------require--------------

var base = require("lib/comp/base"); // 基础对象
var parsePage = require("lib/dom/parsePage"); // 页面模块自动解析
var scss = require("./main.scss"); // 引入当前页面的scss文件
var runtime = require("pages/common/runtime"); // 运行时相关代码

// 模板
var render = require("./main.ejs"); // 页面总模板

//-----------声明模块全局变量-------------
var nodeList = null; // 存储所有id符合m-xxx的节点
var opts = {};

//-------------事件响应声明---------------
var evtFuncs = {}

//-------------子模块实例化---------------
var initMod = function() {}

//-------------绑定事件------------------
var bindEvents = function() {}

//-------------自定义函数----------------
var custFuncs = {}

//-------------一切从这开始--------------
!function() {
    // 先将HTML插入body
    document.body.insertAdjacentHTML('AfterBegin', render({}));

    // 找到所有带有id的节点，并将m-xxx-xxx转化成xxxXxx格式存储到nodeList中
    nodeList = parsePage();
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();
}();