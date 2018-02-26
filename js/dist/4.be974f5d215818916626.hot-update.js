webpackHotUpdate(4,{

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

var addEvent = __webpack_require__(7);
var base = __webpack_require__(3);
var that = module.exports = base();
var defaultUrl = '/pc.html';

var parseHash = function () {
	var hash = location.hash.substr(1);

	if (hash == '') {
		location.href = defaultUrl;
		return;
	}

	var array = hash.split('?');
	that.fire('change', array);
	// body...
};

that.start = function () {
	parseHash();
	addEvent(window, 'hashchange', parseHash);
};

/***/ }

})