const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

let htmlPluginArray = []
let development = false;

function getEntry() {
    const entry = {};
    //读取src目录所有入口文件
    glob.sync('./src/views/*/*.js')
        .forEach(function (filePath) {
            var name = filePath.match(/\/views\/(.+)\/*.js/);
            name = name[1].replace(/\/.+/, '');
            entry[name] = filePath;

            htmlPluginArray.push(new HtmlWebpackPlugin({
                filename: `./${name}/${name}.html`,
                template: './public/index.html',
                title: `${name}`,
                chunks: [name]
            }))
        });
    return entry;
};

let enties = getEntry()

// console.log('entry:', enties)

module.exports = {
    mode: 'production',
    entry: development ? './src/main.js' : enties,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name]-[hash:5].js',
        publicPath: '../'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: "[name]-[hash:5].min.[ext]", // 打包后的图片名
                        limit: 20000, // 小于20kb的图片进行base64编码,大于20kb则需要打包
                        publicPath: '../../', // 打包文件中引用文件的路径前缀
                        outputPath: "image/"   // 输出的图片路径
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },

    devtool: 'inline-source-map',

    devServer: {
        contentBase: "./dist",
        compress: false,
        port: 9000,
        open: true,
        hot: true
    },

    plugins: [
        ...htmlPluginArray,
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(), // 每次清除dist文件夹
        new webpack.HotModuleReplacementPlugin()
    ]
}