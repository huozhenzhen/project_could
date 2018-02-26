var that = {};
var URL = require("lib/util/URL");
var moduleName = null;
var moduleId = null;
var path = null;
var authority = null;

(function() {
    var url = URL.parse(URL.parse(location.href).hash);
    path = url.path.substr(url.path.charAt(0) == "/" ? 1 : 0);
    var array = path.split("/");
    moduleName = array[0];
    path = "/" + array.slice(1).join("/");
    moduleId = url.queryJson["appid"];
})();

/**
 * 获取模块名，仅用于proxy页面调用
 */
that.getModuleName = function() {
    return moduleName;
}

/**
 * 获取路径名，不包含模块名，仅用于proxy页调用
 */
that.getPath = function() {
    return path;
}

/**
 * 获取appid，仅用于proxy页调用
 */
that.getModuleId = function() {
    return moduleId;
}

/*****
 * 获取authority权限
 */
that.getAuthority = function(){
    return authority;
}

module.exports = that;