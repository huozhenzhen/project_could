/**
 * @author benny.zheng
 * @data 2016-06-06
 * @description 本文件用于方便复制粘贴入口文件之用，请更新这里的说明
 *              另外，考虑到一般是放在js/src/pages/page-name/main.js，因此使用../../
 *              如果不是这个目录，请更改成正确的相对路径
 */
//----------------require--------------
// var viewport = require("lib/dom/viewport"); // viewport
var base = require("lib/comp/base"); // 基础对象
var parsePage = require("lib/dom/parsePage"); // 页面模块自动解析
var scss = require("./main.scss"); // 引入当前页面的scss文件
// 模板
var render = require("./main.ejs"); // 页面总模板
var addEvent = require('lib/evt/add');
var dialog = require('./dialog');
var dialogManager = require('pages/common/dialog/manager');

// var cYear = require("pages/common/components/calendarYear");
// 子模块
// var header = require("./header");

//-----------声明模块全局变量-------------
var nodeList = null; // 存储所有id符合m-xxx的节点
var opts = pageConfig; // 请不要直接使用pageConfig
// var 
// var m_header = null;

//-------------事件响应声明---------------
var evtFuncs = {
    dialog1:function(evt) {
        dialogManager.wait();
        setTimeout(function(){
            dialogManager.closeWait()
            var dialog_1 = dialog();
            dialog_1.show();
        },500) 
    },
    toast: function(){
         dialogManager.toast('TEST',{bottom: 100})
    },
    success: function() {
        dialogManager.success('TEST', function(){console.log('success')});
        // dialogManager.success('TEST', {title: '成功提示'});
    },
    error: function() {
        dialogManager.error('TEST', function(){console.log('error')});
    },
    confirm: function() {
        dialogManager.confirm('TEST',function(){console.log('TEST1')},function(){console.log('TEST2')});
    }
}

//-------------子模块实例化---------------
var initMod = function() {
        
}

//-------------绑定事件------------------
var bindEvents = function() {
    addEvent(nodeList.dialog1, 'click', evtFuncs.dialog1);
    addEvent(nodeList.toast, 'click', evtFuncs.toast);
    addEvent(nodeList.success, 'click', evtFuncs.success);
    addEvent(nodeList.error, 'click', evtFuncs.error);
    addEvent(nodeList.confirm, 'click', evtFuncs.confirm);
}

//-------------自定义函数----------------
var custFuncs = {}

//-------------一切从这开始--------------
!function() {
    // 先将HTML插入body
    document.body.insertAdjacentHTML('AfterBegin', render(opts.modules));

    // 找到所有带有id的节点，并将m-xxx-xxx转化成xxxXxx格式存储到nodeList中
    nodeList = parsePage();
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();
}();





