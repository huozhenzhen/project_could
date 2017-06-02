# project_could
##项目中用到的构建工具
###webpack
"use strict";
```
var webpack = require("webpack");
var glob = require("glob");
var path = require('path');
var autoprefixer = require('autoprefixer');

var srcDir = path.resolve(__dirname, '../js/src');
var mainDir = srcDir + "/pages";
var entry = {};
// var htmlWebpackPlugin = require("html-webpack-plugin");
var files = glob.sync(srcDir + "/**/main.js");

files.forEach(function(path) {
    var array = path.substr((srcDir + "/pages").length).split("/");
    var mainName = array.slice(0, array.length - 1).join("/");

    if (mainName.length == 0) {
        return;
    }

    entry[mainName] = path;
});


module.exports = {
    "entry": entry,
    "output": {
        "path":  path.resolve(__dirname, '../js/dist'),
        "filename": '[name].js'
    },
    "module": {
        rules: [{
            test: /\.js$/,
            // include: path.resolve(__dirname, '../js/dist'), //相对立 exclude
            use: {
                loader: "babel-loader"
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader?importantLoaders=1', 'postcss-loader']
        }, {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        }, {
            test: /\.ejs$/,
            use: ['ejs-loader']
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: ['url-loader?limit=2000&name=img/[name]-[hash:5].[ext]']
        }]
    },
    "resolve": {
        "extensions": [".js"],
        "alias": {
            "lib": path.resolve(srcDir + "/lib"),
            "mlib": path.resolve(srcDir + "/mlib"),
            "mopon": path.resolve(srcDir + "/mopon"),
            "pages": path.resolve(srcDir + "/pages")
        }
    },
    "devServer": {
        contentBase: path.resolve(__dirname, '../../myTest'),
        port: 9000
    },
    'plugins': [
        new webpack.HotModuleReplacementPlugin(),
        // 
        new webpack.LoaderOptionsPlugin({
            //wp2应该把自定义的文件的这儿
            options: {
                postcss: function() {
                    return [
                        autoprefixer({
                            broswers: ['last 5 versions']
                        })
                    ];
                }
            }
        }),
    ]
    // "devtool": "source-map"
}
{
    "version": "1.0.0",
    "description": "mopon webpack builder",
    "author": "Benny.zheng",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "build": "webpack --progress --display-modules --colors",
      "dev":"webpack-dev-server --config webpack.config.js --hot --inline"
    },
    "license": "ISC",
    "devDependencies": {
        "babel-core": "^6.18.0",
        "babel-loader": "^6.2.7",
        "babel-preset-es2015": "^6.18.0",
        "css-loader": "^0.25.0",
        "ejs-compiled-loader": "^2.2.0",
        "glob": "^7.1.1",
        "happypack": "^3.0.1",
        "json-loader": "^0.5.4",
        "node-sass": "^3.10.1",
        "sass-loader": "^4.0.2",
        "style-loader": "^0.13.1",
        "webpack": "2.1.0-beta.25",
        "webpack-dev-server": "2.1.0-beta.9",
        "autoprefixer": "^6.7.7",
        "postcss-loader": "^1.3.3"

    }
}
```
###gulp 见gulp文件夹

