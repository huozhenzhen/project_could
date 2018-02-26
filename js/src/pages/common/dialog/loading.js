/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = (function(node, opts) {
    //----------------require--------------
    var base = require("lib/comp/base"); // 基础对象

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var node = null;

    var html = '<div class="loading"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>';

    //-------------事件响应声明---------------
    var evtFuncs = {}

    //-------------子模块实例化---------------
    var initMod = function() {}

    //-------------绑定事件------------------
    var bindEvents = function() {}

    //-------------自定义函数----------------
    var custFuncs = {
        initView : function() {
            node = document.createElement("DIV");
            node.className = "m-loading";
            node.innerHTML = html;
        },
        show: function() {
            document.body.appendChild(node);
        },
        hide: function() {
            if(node) {
                document.body.removeChild(node);
            }
        }
    }

    //-------------一切从这开始--------------
    // var init = function(_data) {
    //     data = _data;
    //     // 找到所有带有node-name的节点
    //     nodeList = parseModule(node);
    //     // 子模块实例化
    //     initMod();
    //     // 绑定事件
    //     bindEvents();
    // }

    //---------------暴露API----------------
    // that.init = init;
    // 
    custFuncs.initView();

    that.show = custFuncs.show;
    that.hide = custFuncs.hide;

    return that;
})();