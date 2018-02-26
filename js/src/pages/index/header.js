/**
 * @author benny.zheng
 * @data 2016-06-06
 * @description 本文件用于方便复制粘贴UI模块之用，请更新这里的说明
 *              另外，考虑到一般是放在js/src/pages/page-name/main.js，因此使用../../
 *              如果不是这个目录，请更改成正确的相对路径
 */
//----------------require--------------

// var viewport = require("mlib/dom/viewport"); // viewport
var base = require("lib/comp/base"); // 基础对象
var parseModule = require("lib/dom/parseModule"); // 页面模块自动解析

module.exports = function(node, opts) {
    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var data = null;
    //-------------事件响应声明---------------
    var evtFuncs = {}
    var step1 = function() {
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve("test");
            },1000);
        }); 
    }

    //-------------子模块实例化---------------
    var initMod = function() {}

    //-------------绑定事件------------------
    var bindEvents = function() {}

    //-------------自定义函数----------------
    var custFuncs = {
        //
        step2: function () {
            step1().then(function(res){
                console.log("inner++++++++"+res)
            })
            console.log("outer++++++");
        }

        // step2 : function async() {
        //     var val = await step1();
            
        // }
    }

    //-------------一切从这开始--------------
    var init = function(_data) {
        data = _data;
        custFuncs.step2()
        // 根据数据初始化模块
        // opts["render"]({ "title": data["title"] });

        // 找到所有带有node-name的节点
        nodeList = parseModule(node);
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();
    }

    //---------------暴露API----------------
    that.init = init;

    return that;
};