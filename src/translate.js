import 'babel-polyfill';
import 'whatwg-fetch';

import managerFactory from './Factory/managerFactory';

class Translate {
    constructor(config) {
        this._defaultConfig = {
            baseUrl: '',
            defaultLanguage: 'fr_FR',
            fallbackLanguage: 'en_US',
            namespace: '',
            cacheDuration: 86400
        };

        this._config = {};
        this._manager = null;

        this._mergeConfig();
        this._initManager();
    }

    translate(key) {
        return this._manager.translate(key);
    }

    _mergeConfig(config) {
        Object.assign(this._config, this._defaultConfig, config);
    }

    _initManager() {
        this._manager = managerFactory(this._config);
    }
}
