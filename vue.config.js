const path = require('path');
function resolve(dir) {
    return path.resolve(__dirname, dir)
}
module.exports = {
    pages: {
        index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html',
        },
    },
    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                '@': resolve('examples'),
            }
        },
    },
    outputDir: 'dist', // 打包的目录
    lintOnSave: true, // 在保存时校验格式
    productionSourceMap: false, // 生产环境是否生成 SourceMap （false避免在生产环境中用F12开发者工具在Sources中看到源码）。
    devServer: {
        //open: true, // 启动服务后是否打开浏览器
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8081, // 服务端口
        https: false,
        hot: true,//开启热更新
        hotOnly: false,
        before: app => {},
        proxy: {
            '/api': {
                target: 'http://localhost:3001/api/',
                changeOrigin:true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
