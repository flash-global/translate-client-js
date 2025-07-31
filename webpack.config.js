import { resolve } from 'node:path';

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default function (env, argv) {
    const config = {
        entry: './build/bootstrap.js',
        output: {
            clean: true,
            path: resolve('dist'),
            filename: 'translate-client.js',
            library: {
                name: 'TranslateClient', // the global variable name
                type: 'window', // attaches to `window` (for browsers)
            },
        },
        // No module.rules at all
        plugins: [
            // new BundleAnalyzerPlugin()
        ],
    };

    return config;
}
