webpackHotUpdate(1,{

/***/ 86:
/***/ function(module, exports, __webpack_require__) {


var dialogManager = __webpack_require__(36);

var manager = {
	wait: function () {
		return dialogManager.wait();
	},
	closeWait: function () {
		return dialogManager.closeWait();
	},
	toast: function (msg, opts) {
		return top.dialogManager.toast(msg, opts);
	},
	success: function (text, onOkOrOpts) {
		return top.dialogManager.success(text, onOkOrOpts);
	},
	error: function (text, onOkOrOpts) {
		return top.dialogManager.error(text, onOkOrOpts);
	},
	confirm: function (text, onOkOrOpts, onCancel) {
		return top.dialogManager.confirm(text, onOkOrOpts, onCancel);
	},
	dialog: function (opts) {
		return top.dialogManager.dialog(opts);
	}
};

module.exports = manager;

/***/ }

})