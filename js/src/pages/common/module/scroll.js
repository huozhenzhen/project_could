/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function(node, opts) {
    //----------------require--------------
    var base = require("lib/comp/base"); // 基础对象
    var parseModule = require("lib/dom/parseModule"); // 页面模块自动解析
    var insertHTML = require("lib/dom/insertHTML");
    var merge = require("lib/json/merge");
    var render = require("pages/common/tmpl/simScroll.ejs");
    var setStyle = require('lib/dom/setStyle')
    var className = require("lib/dom/className")
    var addEvent  = require('lib/evt/add')
    var preventDefault = require("lib/evt/preventDefault");
    var removeEvent = require("lib/evt/remove")

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var data = null;
    var p_timer = null;

    var defaults = {
        horizontal: {
            top: 1,
            right: 1,
            bottom: null,
            left: null
        }
    }
    opts = merge(true ,defaults, opts);
    //-------------事件响应声明---------------
    var evtFuncs = {
        scroll: function() {
            if(!className.has(nodeList.rightSimScroll, 'hide')) {
                var boxNode = nodeList.box;
                var y = boxNode.scrollTop;
                var h = boxNode.offsetHeight;
                var sh = boxNode.scrollHeight;
                var toolHeight = nodeList.rightScrollTool.offsetHeight;

                nodeList.rightScrollTool.style.top = custFuncs.unit(Math.min(y * h/sh, h - toolHeight -34));
            }
        },
        scrollRightTool: function(evt) {
            var cursorY = evt.clientY;
            var cTop = parseFloat(nodeList.rightScrollTool.style.top || 0.1);
            var h = nodeList.box.offsetHeight;
            var sh = nodeList.box.scrollHeight;
            var toolHeight = nodeList.rightScrollTool.offsetHeight;

            addEvent(document, 'mousemove',_onmousemove);
            addEvent(document, 'mouseup',_onmouseup);
            function _onmousemove(evt) {
                var moveY = evt.clientY;
                var y = moveY - cursorY +cTop;
                var top = Math.max(0, Math.min(h - toolHeight, y));
                var sTop = Math.max(0, Math.min(h - toolHeight -34, y));
                nodeList.rightScrollTool.style.top = custFuncs.unit(sTop);
                nodeList.box.scrollTop = top * sh / h;
                preventDefault(evt);
            }
            function _onmouseup () {
                removeEvent(document, "mousemove", _onmousemove);
                removeEvent(document, "mouseup", _onmouseup);
            }
        }
    }

    //-------------子模块实例化---------------
    var initMod = function() {}

    //-------------绑定事件------------------
    var bindEvents = function() {
        addEvent(nodeList.box, 'scroll', evtFuncs.scroll);
        addEvent(nodeList.rightScrollTool, 'mousedown', evtFuncs.scrollRightTool);
    }

    //-------------自定义函数----------------
    var custFuncs = {
        loadScroll: function() {
            p_timer = setTimeout(function(){
                
                var h = nodeList.box.offsetHeight;
                var sh = nodeList.box.scrollHeight;

                var hStyle = {
                    height : custFuncs.unit(h)
                }

                if(opts.horizontal.left != null) {
                    hStyle.left = custFuncs.unit(opts.horizontal.left);
                } else {
                    hStyle.right = custFuncs.unit(opts.horizontal.right);
                }

                if(opts.horizontal.bottom != null) {
                    hStyle.bottom = custFuncs.unit(opts.horizontal.bottom);
                } else {
                    hStyle.top = custFuncs.unit(opts.horizontal.top);
                }

                setStyle(nodeList.rightSimScroll, hStyle);

                nodeList.scrollRightBg.style.height = custFuncs.unit(h -34);
                className.remove(nodeList.rightSimScroll, 'hide');
                var toolHright =  h * h / sh;

                nodeList.rightScrollTool.style.height = custFuncs.unit(toolHright);

            }, 10);
        },
        initView : function() {
            insertHTML(nodeList.box, render(), 'afterend');
            nodeList = parseModule(node);
        },
        unit: function(v) {
            if (!isNaN(v)) {
                return v + 'px';
            }
            return v;
        }
    }

    //-------------一切从这开始--------------
    var init = function(_data) {
        data = {};
        nodeList = parseModule(node);
        custFuncs.initView();
        // 找到所有带有node-name的节点
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();
    }

    //---------------暴露API----------------
    that.init = init;
    that.loadScroll = custFuncs.loadScroll;

    return that;
};