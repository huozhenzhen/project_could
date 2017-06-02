# project_could
"use strict";

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
