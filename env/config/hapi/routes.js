"use strict";


module.exports = [
    {
        development: true,
        production: false,
        config: {
            module: require('@danielbayerlein/hapi-webpack-middleware'),
            options: {
                webpack: Object.assign(require(process.cwd() + '/env/config/webpack')('app'), {
                    entry: {
                        app: ['./src/js/main','webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true']
                    },
                    output: {
                      path: '/dev/js',
                      filename: '[name].js',
                      publicPath: '/dev/js',
                      library: ['[name]']
                    }
                }),
                webpackDev: require(process.cwd() + '/env/config/hapi/server/dev'),
                webpackHot: require(process.cwd() + '/env/config/hapi/server/hot')
            }
        }
    }, {
        development: true,
        production: false,
        config: {
            module: require('agency-server/lib/hapi/route/debug'),
            options: {}
        }
    }, {
        development: true,
        production: false,
        config: {
            module: require('agency-server/lib/hapi/route/auth/session'),
            options: {
              appId: "1649448378651481",
              appSecret: "f6ef2995e1483b161d013c49e86c0273"
            }
        }
    }, {
        development: true,
        production: true,
        config: {
            module: require('agency-server/lib/hapi/route/static'),
            options: {
              config: {
                state: {
                  parse: false,
                  failAction: "ignore"
                }
              }
            }
        }
    }, {
        development: true,
        production: false,
        config: {
            module: require('agency-server/lib/hapi/route/proxy'),
            options: {}
        }
    }
];