import managerFactory from './Factory/managerFactory.js';

export default class TranslateClient {
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

        this.mergeConfig(config);
        this.initManager();
    }

    translate(key) {
        return this.manager.translate(key);
    }

    translateMultiple(keys) {
        return this.manager.translateMultiple(keys);
    }

    getAllTranslations() {
        return this.manager.getAllTranslations();
    }

    mergeConfig(config) {
        Object.assign(this.config, this.defaultConfig, config);
    }

    initManager() {
        this.manager = managerFactory(this.config);
        this.manager.init();
    }

    set defaultLanguage(defaultLanguage) {
        this.config.defaultLanguage = defaultLanguage;
        this.manager.defaultLanguage = defaultLanguage;
        this.manager.reset();
    }

    set fallbackLanguage(fallbackLanguage) {
        this.config.fallbackLanguage = fallbackLanguage;
        this.manager.fallbackLanguage = fallbackLanguage;
        this.manager.reset();
    }
}
