const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ['./src/translate.js'],
    output:  {
        path: path.resolve(__dirname, 'build'),
        filename: 'translate.js'
    },
    watchOptions: {
        poll: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                targets: {
                                    ie: 6
                                },
                                useBuiltIns: true
                            }]
                        ]
                    }
                }
            }
        ]
    }
};
