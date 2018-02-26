/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function(msg, opts) {
    //----------------require--------------
    var popup = require("lib/layer/popup"); // 基础对象
    var animate = require("lib/ani/animate"); // 基础对象
    var merge = require("lib/json/merge");

    opts = merge({
        bottom: 60
    },opts||{})

    //-----------声明模块全局变量-------------
    var that = popup('<div class="mg-win-toast">' + msg + '</div>', {
        mask: false,
        keepMiddle: true
    });



    //-------------事件响应声明---------------
    var evtFuncs = {
        show: function() {
            that.setPosition(null, "auto", null, opts.bottom+"px");
            custFuncs.animate();
        }
    }

    //-------------子模块实例化---------------
    var initMod = function() {}

    //-------------绑定事件------------------
    var bindEvents = function() {
        that.bind("show", evtFuncs.show);
    }

    //-------------自定义函数----------------
    var custFuncs = {
        animate: function(){
            var node = that.getOuter();
            var ani  = animate.chain(node)
                .animate({ opacity: 0.6 }, 500, 'ease-in')
                .animate({ opacity: 0 }, 1000, 'ease-in', function(){
                    node.parentNode.removeChild(node);
                    
                })
        }
    }

    //-------------一切从这开始--------------

    // 找到所有带有node-name的节点
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();

    //---------------暴露API----------------

    return that;
};