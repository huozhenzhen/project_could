/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function(text, opts) {
    //----------------require--------------
    var parseModule = require("lib/dom/parseModule"); // 页面模块自动解析
    var merge = require('lib/json/merge');
    var render = require('../tmpl/alert.ejs');
    var dialog = require('./dialog');
    //-----------声明模块全局变量-------------
    //
    opts = merge({
        icon: "err", //"suc"
        ok: function() {}
    }, opts || {})

    opts["buttons"] =  [{'id': 'ok', 'text': (opts['okText']||'确定'), type:'blue'}]

    var boxHTML = render({
        'text': text ,
        'icon': opts.icon
    });
    opts.boxHTML = boxHTML;

    var that = dialog(opts);


    //-------------事件响应声明---------------
    var evtFuncs = {
        buttonclick: function(ev) {
            if(ev.data.type == 'ok') {
                try{ 
                    opts[ev.data.type]();
                    that.hide(ev.data.type);
                }catch(ex){ 
                    console.err(ex)
                }
            }
        }
    }

    //-------------子模块实例化---------------
    var initMod = function() {}

    //-------------绑定事件------------------
    var bindEvents = function() {
        that.bind('buttonClick', evtFuncs.buttonclick);
    }

    //-------------自定义函数----------------
    var custFuncs = {}

    //-------------一切从这开始--------------

        // 找到所有带有node-name的节点
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();

    //---------------暴露API----------------

    return that;
};