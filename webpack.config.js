const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: ['./src/translate.js'],
    output:  {
        path: path.resolve(__dirname, 'dist'),
        filename: 'translate.js'
    },
    watchOptions: {
        poll: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|test)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
    ]
};
