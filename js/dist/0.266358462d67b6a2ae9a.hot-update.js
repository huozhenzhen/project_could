webpackHotUpdate(0,{

/***/ 38:
/***/ function(module, exports, __webpack_require__) {


var merge = __webpack_require__(3);
var loading = __webpack_require__(32);
var toast = __webpack_require__(59);
var alert = __webpack_require__(57);
var confirm = __webpack_require__(58);

var manager = {
	wait: function () {
		loading.show();
	},
	closeWait: function () {
		loading.hide();
	},
	toast: function (msg, opts) {
		var m_toast = toast(msg, opts);
		m_toast.show();
	},
	success: function (text, onOkOrOpts) {
		var opts = { 'icon': 'suc' };

		if (typeof onOkOrOpts == 'function') {
			opts = merge(opts, { 'ok': onOkOrOpts });
		} else {
			opts = merge(opts, onOkOrOpts);
		}
		var dialog = alert(text, opts);
		dialog.show();
	},
	error: function (text, onOkOrOpts) {
		var opts = { 'icon': 'err' };

		if (typeof onOkOrOpts == 'function') {
			opts = merge(opts, { 'ok': onOkOrOpts });
		} else {
			opts = merge(opts, onOkOrOpts);
		}
		var dialog = alert(text, opts);
		dialog.show();
	},
	confirm: function (text, onOkOrOpts, onCancel) {
		var opts = null;

		if (typeof onOkOrOpts == 'function' && typeof onCancel == 'function') {
			opts = { 'ok': onOkOrOpts, 'cancel': onCancel };
		}
		if (typeof onOkOrOpts == 'function') {
			opts = { 'ok': onOkOrOpts };
		} else {
			opts = onOkOrOpts;
		}
		var dialog = confirm('text', opts);
		dialog.show();
	}

};

module.exports = manager;

/***/ }

})