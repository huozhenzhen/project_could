/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function(node, opts) {
    //----------------require--------------
    var base = require("lib/comp/base"); // 基础对象
    var parseModule = require("lib/dom/parseModule"); // 页面模块自动解析
    var proxy = require('lib/evt/proxy');
    var className = require('lib/dom/className');
    var sizzle = require('lib/dom/sizzle');

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var data = null;

    //-------------事件响应声明---------------
    var evtFuncs = {
        selected: function(evt) {
            var moduleId  = evt.data.id;
            custFuncs.selectedById(moduleId);
        }
    }

    //-------------子模块实例化---------------
    var initMod = function() {
        proxy(nodeList.opera).add('send','click',evtFuncs.selected);
    }

    //-------------绑定事件------------------
    var bindEvents = function() {}

    //-------------自定义函数----------------
    var custFuncs = {
        selectedById: function(moduleId) {
            if (moduleId) {
                var node = sizzle("[data-id=" + moduleId + "]", nodeList.opera)[0];
                if (node) {
                    className.remove(nodeList.item, "selected");
                    className.add(node, "selected");
                }
            }
        }
    }

    //-------------一切从这开始--------------
    var init = function(_data) {
        data = _data;
        // 找到所有带有node-name的节点
        nodeList = parseModule(node);
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();
    }

    //---------------暴露API----------------
    that.init = init;
    that.selectedById = custFuncs.selectedById;

    return that;
};