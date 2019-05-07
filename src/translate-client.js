import managerFactory from './Factory/managerFactory';

export default class TranslateClient {
    /**
     * @param {Object} config
     */
    constructor(config) {
        this.defaultConfig = {
            baseUrl: '',
            defaultLanguage: 'fr_FR',
            fallbackLanguage: 'en_US',
            namespace: '',
            cacheDuration: 86400,
            localStorageKey: 'translations',
            forceLowerKey: false,
        };

        this.config = {};

        /** @type {Manager} */
        this.manager = null;

        this.mergeConfig(config);
        this.initManager();
    }

    /**
     * @param {String} key
     * @returns {Promise<String, Error>}
     */
    translate(key) {
        return this.manager.translate(key);
    }

    /**
     * @param {Array} keys
     * @returns {Promise<Array, Error>}
     */
    translateMultiple(keys) {
        return this.manager.translateMultiple(keys);
    }

    /**
     * @returns {Promise<Array, Error>}
     */
    getAllTranslations() {
        return this.manager.getAllTranslations();
    }

    /**
     * @param {Object} config
     */
    mergeConfig(config) {
        Object.assign(this.config, this.defaultConfig, config);
    }

    initManager() {
        this.manager = managerFactory(this.config);
        this.manager.init();
    }

    /**
     * @param {string} defaultLanguage
     */
    set defaultLanguage(defaultLanguage) {
        this.config.defaultLanguage = defaultLanguage;
        this.manager.defaultLanguage = defaultLanguage;
        this.manager.reset();
    }

    /**
     * @param {string} fallbackLanguage
     */
    set fallbackLanguage(fallbackLanguage) {
        this.config.fallbackLanguage = fallbackLanguage;
        this.manager.fallbackLanguage = fallbackLanguage;
        this.manager.reset();
    }
}
