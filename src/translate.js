import 'babel-polyfill';
import 'whatwg-fetch';

import managerFactory from './Factory/managerFactory';

class Translate {
    constructor(config) {
        this.defaultConfig = {
            baseUrl: '',
            defaultLanguage: 'frFR',
            fallbackLanguage: 'enGB',
            namespace: '',
            cacheDuration: 86400
        };

        this.config = {};
        this.manager = null;

        this.mergeConfig();
        this.initManager();
    }

    translate(key) {
        return this.manager.translate(key);
    }

    mergeConfig(config) {
        Object.assign(this.config, this.defaultConfig, config);
    }

    initManager() {
        this.manager = managerFactory(this.config);
    }
}
