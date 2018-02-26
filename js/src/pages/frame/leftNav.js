/**
 * @author 璩
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */
module.exports = function(node, opts) {
    //----------------require--------------
    var base = require("lib/comp/base"); // 基础对象
    var parseModule = require("lib/dom/parseModule"); // 页面模块自动解析
    var sizzle = require("lib/dom/sizzle");
    // var closest = require("lib/dom/closest");
    var leftNavRender = require("./leftNav.ejs"); // 模板
    var className = require("lib/dom/className");
    // var nodeOpera = require("lib/dom/node");
    // var each = require("lib/util/each");
    // var addEvent = require('lib/evt/add');

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var data = null;


    //-------------事件响应声明---------------
    var evtFuncs = {

    }

    //-------------子模块实例化---------------
    var initMod = function() {
    
    }

    //-------------绑定事件------------------
    var bindEvents = function() {

    }

    //-------------自定义函数----------------
    var custFuncs = {
        setData: function(menu, uri) {
            node.innerHTML = leftNavRender({menu: menu});
            custFuncs.selectByUri(uri)

        },
        selectByUri: function(uri) {
            try {
                var linkNode = sizzle('[data-path='+uri+']', node)[0];
            }catch(ex) {
                console.log(ex);
            }
            if(linkNode == null) return

            var selectedLink = sizzle(".selected", node)[0];

            if (selectedLink) {
                className.remove(selectedLink, "selected");
            }

            className.add(linkNode, 'selected');

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
    that.setData = custFuncs.setData;


    return that;
};