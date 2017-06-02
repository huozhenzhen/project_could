/**
 * 允许强制将设置倍数为 1
 */
var that = module.exports;
var inited = false;
var win = window;
var doc = document;
var rootEl = doc.documentElement;
var isAndroid = win.navigator.appVersion.match(/android/gi);
var isIPhone = win.navigator.appVersion.match(/iphone/gi);

that.init = function(absDpr) {
    if (inited) return;
    var header = doc.getElementsByTagName("head")[0];
    var viewport = doc.createElement("meta");
    var devicePixelRatio = win.devicePixelRatio;
    var dpr = absDpr || devicePixelRatio;
    var tid = null;
    inited = true;

    if (isIPhone && (absDpr !== null)) {
        // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
        if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
            dpr = 3;
        } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
            dpr = 2;
        } else {
            dpr = 1;
        }
    } else {
        // 其他设备下，仍旧使用1倍的方案
        // 如果设置了absDpr则使用absDpr
        dpr = absDpr || 1;
    }

    var scale = 1 / dpr;
    rootEl.setAttribute("data-dpr", dpr);
    rootEl.setAttribute("data-device-type", isIPhone ? "iphone" : (isAndroid ? "android" : "other"));
    viewport.name = "viewport";
    viewport.content = "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no";
    header.appendChild(viewport);

    try{
		var vMin = doc.createElement("div");
		vMin.style.width = "1px";
		vMin.style.width = "1vmin";
		document.body.appendChild(vMin);
		if(vMin.offsetWidth > 1){
			document.body.removeChild(vMin);
			rootEl.style.fontSize = "3.125vmin";
			rootEl.style.fontSize = window.getComputedStyle(rootEl, null).fontSize;
			if(rootEl.style.fontSize.indexOf("px") != -1) return;
		}
	}catch(e){}

    function refreshRem(){
        var width = doc.documentElement.clientWidth;
        var height = doc.documentElement.clientHeight;
        if(width == 0 || !width){
            width = rootEl.getBoundingClientRect().width;
        }
        var rem = ((Math.min(width, height) / 320) * 10);
        rootEl.style.fontSize = rem + "px";
    }

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    refreshRem();
};

that.px2rem = function(px) {
    return px / that.rem();
};

that.rem2px = function(rem) {
    return rem * that.rem();
};

that.rem = function() {
    return parseFloat(window.getComputedStyle(rootEl, null).fontSize, 10);
};

that.currentDpr = function() {
    return rootEl.hasAttribute("data-dpr") ? parseInt(rootEl.hasAttribute("data-dpr"), 10) : devicePixelRatio;
};

that.isAndroid = function() {
    return isAndroid;
};

that.isIPhone = function() {
    return isIPhone;
};

that.getDeviceType = function() {
    return isIPhone ? "iphone" : (isAndroid ? "android" : "other");
};