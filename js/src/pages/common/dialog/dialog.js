module.exports = function (opts) {
    var parseModule = require("lib/dom/parseModule"); // 页面模块自动解析
	var addEvent = require('lib/evt/add');
	var merge = require('lib/json/merge');
    var builder = require("lib/layer/builder");
    var sizzle = require("lib/dom/sizzle");
    var addEvent = require("lib/evt/add");
    var defaultTMPL = require("pages/common/tmpl/dialog.ejs");
    var winSize = require("lib/util/winSize");
    var simScroll = require("pages/common/module/scroll");
    var moveLayer = require('pages/common/module/moveLayer')
    

    opts = merge({
    	keepMiddle: true,
    	title: 'Title'
    },opts||{});
  
    var defaultTMPL = defaultTMPL({
    	html: opts.boxHTML,
    	"buttons": opts["buttons"],
    	title: opts.title
    });

	var that = builder.createFromHTML(defaultTMPL, opts);
    var node = that.getOuter();
	var nodeList = null;
	var m_simScroll = null;
	var m_moveLayer = null;

	var evtFuncs = {
		hide: function() {
			that.hide('close');
		},
		buttonClick: function(ev) {
			var target = this;
			var data = {
				'type': target.getAttribute('data-button'),
				'button': target,
				'event': ev
			}
			that.fire('buttonClick', data)
		},
		show: function() {
			m_simScroll = simScroll(node, {
			    autoChange: true,
			    horizontal: {
			        top: nodeList.header.offsetHeight
			    }
			});
			m_simScroll.init();
			m_simScroll.loadScroll();
		}
	}

	var initMod = function() {
		m_moveLayer =moveLayer(nodeList.header,{
			layer: node
		});
		m_moveLayer.init();	
	} 

	var bindEvents = function() {
		if(nodeList.close) {
			addEvent(nodeList.close, 'click', evtFuncs.hide);
		}

		if (nodeList.footer) {
		    buttons = sizzle("[data-button]", nodeList.footer);
		    addEvent(buttons, "click", evtFuncs.buttonClick);
		}
        that.bind("show", evtFuncs.show);
	}

	var custFuncs = {
		initView: function() {
		    custFuncs.setTitle(opts["title"]);
		    var winHeight = winSize().height;
		    nodeList.box.style.maxHeight = winHeight * 0.7 + "px";
		    nodeList.box.style.overflowY = "auto";
		    nodeList.box.style.overflowX = "hidden";
		},
		setTitle: function(title) {
		    opts["title"] = title;
		    if (nodeList.title) {
		        nodeList.title.innerHTML = title;
		    }
		},
	}


	nodeList = parseModule(node);
	initMod();
	bindEvents();
	custFuncs.initView();

	that.setTitle = custFuncs.setTitle;

	return that;
}