import 'babel-polyfill';
import 'whatwg-fetch';

import managerFactory from './Factory/managerFactory';

class Translate
{
    /**
     * @param {Object} config
     */
    constructor(config)
    {
        this.defaultConfig = {
            baseUrl: '',
            defaultLanguage: 'fr_FR',
            fallbackLanguage: 'en_GB',
            namespace: '',
            cacheDuration: 86400,
            localStorageKey: 'translations'
        };

        this.config = {};
        this.manager = null;

        this.mergeConfig(config);
        this.initManager();
    }

    /**
     * @param {String} key
     * @returns {String}
     */
    translate(key)
    {
        return this.manager.translate(key);
    }

    /**
     * @param {Object} config
     */
    mergeConfig(config)
    {
        Object.assign(this.config, this.defaultConfig, config);
    }

    initManager()
    {
        this.manager = managerFactory(this.config);
    }
}

global.Translate = Translate;
