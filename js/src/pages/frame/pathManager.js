var addEvent  =  require('lib/evt/add');
var base = require('lib/comp/base');
var that = module.exports = base();
var defaultUrl = '/pc.html';

var parseHash = function () {
	var hash =  location.hash.substr(1);

	// if(hash == '') {
	// 	location.href = defaultUrl;
	// 	return
	// }

	var array = hash.split('?');
	that.fire('change', array);
	// body...
}

that.start = function() {
	parseHash();
	addEvent(window, 'hashchange', parseHash);
}