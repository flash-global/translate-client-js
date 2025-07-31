import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function (env, argv) {
    const config = {
        entry: './build/bootstrap.js',
        output: {
          path: resolve('dist'),
          filename: 'translate-client.js',
          library: {
            name: 'TranslateClient',   // the global variable name
            type: 'window',            // attaches to `window` (for browsers)
          },
        },
        // No module.rules at all
        plugins: [
         
          new CleanWebpackPlugin(),
          // new BundleAnalyzerPlugin()
        ],
    };

    return config;
}
