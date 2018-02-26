
var merge = require('lib/json/merge');
var loading = require('./loading');
var toast = require('./toast');
var alert = require('./alert');
var confirm = require('./confirm');
var dialog = require('./dialog');

var manager = {
	wait: function () {
		loading.show();
	},
	closeWait: function() {
		loading.hide()
	},
	toast: function(msg, opts) {
		var m_toast = toast(msg, opts);
		m_toast.show();
	},
	success: function(text, onOkOrOpts){
		var opts = {'icon': 'suc'};

		if(typeof onOkOrOpts == 'function') {
			opts = merge(opts,{'ok': onOkOrOpts});
		}else{
			opts = merge(opts, onOkOrOpts);
		}
		var dialog = alert(text, opts);
		dialog.show();
	},
	error: function(text, onOkOrOpts){
		var opts = {'icon': 'err'};

		if(typeof onOkOrOpts == 'function') {
			opts = merge(opts,{'ok': onOkOrOpts});
		}else{
			opts = merge(opts, onOkOrOpts);
		}
		var dialog = alert(text, opts);
		dialog.show();
	},
	confirm: function(text, onOkOrOpts, onCancel){
		var opts = null;

		if(typeof onOkOrOpts == 'function' && typeof onCancel == 'function') {
			opts = {'ok': onOkOrOpts, 'cancel': onCancel};
		}
		if(typeof onOkOrOpts == 'function') {
			opts = {'ok': onOkOrOpts};
		}else{
			opts = onOkOrOpts;
		}
		var dialog = confirm('text', opts);
		dialog.show();
	},
	dialog: function (opts){
		var m_dialog = dialog(opts);
		return m_dialog;
	}
}



module.exports = manager;
window.dialogManager = manager;