/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function(node, opts) {
    //----------------require--------------
    var base = require("lib/comp/base"); // 基础对象
    var parseModule = require("lib/dom/parseModule"); // 页面模块自动解析
    var render = require("pages/common/tmpl/calendarYear.ejs");
    var className = require("lib/dom/className");
    var popup = require("lib/layer/popup");
    var each = require("lib/util/each");
    var merge = require("lib/json/merge");
    var addEvent = require("lib/evt/add");
    var closest = require("lib/dom/closest");
    var scrollPos = require("lib/util/scrollPos");
    var scrollBarSize = require("lib/dom/scrollBarSize");
    var winSize = require("lib/util/winSize");



    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var m_cal = null;
    var data = null;
    var calendarYearNode = null;
    opts = merge({
        beginYear: 2009 
    }, opts || {});
    //-------------事件响应声明---------------
    var evtFuncs = {
        showCalendar: function(evt){
            debugger
            if(className.has(node, "open")){
                 evtFuncs.hideCalendar(evt);
                 return;
            }
            nodeList.interval.innerHTML = (opts.beginYear+1) + "&nbsp;-&nbsp;" + (opts.beginYear + 10);
            var list = custFuncs.getYearData();
            var html = "";
            each(list, function(item,index){
                if(index%4 == 0) {
                    html =  html +"<ul>";
                }
                if(index == 0 || index == 11) {
                    html = html + "<li><span  class='gray'>"+ item +"</span></li>";
                }else if(index == 7){
                     html = html + "<li><span  class = 'active'>"+ item +"</span></li>";
                }else{
                    html = html + "<li><span>"+ item +"</span></li>";

                }

                if(index%4 == 3) {
                    html = html +"</ul>";
                }
            });

            nodeList.list.innerHTML = html;
            custFuncs.setPosition();
            m_cal.show();
            evt.stopPropagation();
            className.add(node, "open");
            addEvent(document.body, "click", evtFuncs.hideCalendar);
        },
        hideCalendar: function(ev){
            var target= ev.target;
            if (closest(target,".change")) return;
            className.remove(node, "open");
            m_cal.hide();
            return;
        },
        change: function(evt) {
            if( className.has(this, "left")) {
                opts.beginYear = opts.beginYear - 10;
            }
            if( className.has(this, "right")) {
                opts.beginYear = opts.beginYear + 10;
            }
            evtFuncs.showCalendar(evt);
        }        
    }

    //-------------子模块实例化---------------
    var initMod = function() {
        m_cal = popup(render());
        calendarYearNode = m_cal.getOuter()
        nodeList = parseModule(calendarYearNode);
    }

    //-------------绑定事件------------------
    var bindEvents = function() {
        addEvent(nodeList.prev, "click", evtFuncs.change);
        addEvent(nodeList.next, "click", evtFuncs.change);
    }

    //-------------自定义函数----------------
    var custFuncs = {
        getYearData: function() {
            var arr = [];
            var start = opts.beginYear;
            for (var i = 0; i < 12; i++) {
                arr.push(start);
                start += 1;
            }
            return arr;
        },
        setPosition: function() {
            var nodeWidth = node.offsetWidth;
            var nodeHeight = node.offsetHeight;

            var scroll = scrollPos();
            var boundingClientRect = node.getBoundingClientRect();
            var calTop = boundingClientRect.top + scroll.top; //日历在页面中的top
            var calLeft = boundingClientRect.left + scroll.left;
            //向下展开时，日历的下边框距离屏幕顶部的距离
            var calendarMaxBottom = calTop + nodeList.calBody.offsetHeight + nodeHeight;
            var windowSize = winSize();
            var barSize = scrollBarSize();

            var popupY = 0;
            // 默认向下展开；向下展开位置不够时，向上展开；
            if (calendarMaxBottom >= (scroll.top + windowSize.height - barSize.h)) {
                popupY = calTop - nodeList.calBody.offsetHeight;
            } else {
                popupY = calTop + nodeHeight;
            }

            calendarYearNode.style.top = popupY + "px";
            calendarYearNode.style.left = calLeft + "px";
        },
        intiView: function(evt) {
           each([].concat(node), function(item){
                if(!item) return;
                addEvent(item, "click", evtFuncs.showCalendar);
           });
        }

    }

    //-------------一切从这开始--------------
    var init = function(_data) {
        data = _data;
        // 找到所有带有node-name的节点
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();
        custFuncs.intiView();
    }

    //---------------暴露API----------------
    that.init = init;

    return that;
};