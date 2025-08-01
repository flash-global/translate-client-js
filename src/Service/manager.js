import parser from './parser.js';

export default class Manager {
    constructor() {
        this.defaultLanguage = '';
        this.fallbackLanguage = '';
        this.cacheDuration = 0;
        this.localStorageKey = '';
        this.translations = null;
        this.namespace = '';
        this.forceLowerKey = false;
        this.gateway = null;
    }

    init() {
        this.translations = this.getLocalStorageTranslations();
    }

    reset() {
        localStorage.removeItem(this.localStorageKey);
        this.translations = null;
    }

    /**
     * @param {String} key
     * @returns {String}
     */
    parseKey(key) {
        return this.forceLowerKey ? key.toString().toLowerCase() : key;
    }

    parseKeys(keys) {
        return this.forceLowerKey ? keys.map(key => key.toString().toLowerCase()) : keys;
    }

    /**
     * @param {String} key
     * @returns {Promise<String,Error>}
     */
    translate(key) {
        return this.pullIfNeeded().then(() => this.findTranslation(this.parseKey(key)));
    }

    /**
     * @param {Array} keys
     * @returns {Promise<Array,Error>}
     */
    translateMultiple(keys) {
        return this.pullIfNeeded().then(() => this.findTranslations(this.parseKeys(keys)));
    }

    /**
     *  @returns {Promise<Object,Error>}
     */
    getAllTranslations() {
        return this.pullIfNeeded().then(() => this.createCopy());
    }

    /**
     *  @returns {Object}
     */
    createCopy() {
        const copy = structuredClone(this.translations);
        delete copy.pulledAt;
        delete copy.defaultLanguage;
        delete copy.fallbackLanguage;
        delete copy.namespace;
        return copy;
    }

    async pullIfNeeded() {
        if (this.checkPullNeeded()) {
            return this.pull();
        }
        return;
    }

    /**
     * @returns {null|Object}
     */
    getLocalStorageTranslations() {
        const jsonTranslations = localStorage.getItem(this.localStorageKey);

        if (typeof jsonTranslations !== 'string') {
            return null;
        }

        return this.parseJsonTranslations(jsonTranslations);
    }

    /**
     * @param {String} jsonTranslations
     * @returns {null|Object}
     */
    parseJsonTranslations(jsonTranslations) {
        try {
            const translations = JSON.parse(jsonTranslations);

            if (translations === null || typeof translations !== 'object') {
                return null;
            }

            if (translations.pulledAt !== undefined) {
                translations.pulledAt = new Date(translations.pulledAt);
            }

            return translations;
        } catch (exception) {
            return null;
        }
    }

    /**
     * @returns {Boolean}
     */
    checkPullNeeded() {
        if (this.translations === null) {
            return true;
        }

        if (!(this.translations.pulledAt instanceof Date)) {
            return true;
        }

        if (this.translations.defaultLanguage !== this.defaultLanguage
            || this.translations.fallbackLanguage !== this.fallbackLanguage
            || this.translations.namespace !== this.namespace) {
            return true;
        }

        return (Date.now() - this.translations.pulledAt) / 1000 >= this.cacheDuration;
    }

    /**
     * @returns {Promise<undefined,Error>}
     */
    async pull() {
        let defaultTranslations = {};
        let fallbackTranslations = {};

        try {
            defaultTranslations = await this.pullLanguage(this.defaultLanguage);
        } catch (e) {
            console.error(e);
        }

        try {
            fallbackTranslations = await this.pullLanguage(this.fallbackLanguage);
        } catch (e) {
            console.error(e);
        }

        this.save(defaultTranslations, fallbackTranslations);
    }

    /**
     * @param {String} language
     * @returns {Promise<Array,Error>}
     */
    pullLanguage(language) {
        return this.gateway.pull(language)
            .then(translations => parser(translations, this.forceLowerKey));
    }

    /**
     * @param {Object} defaultTranslations
     * @param {Object} fallbackTranslations
     */
    save(defaultTranslations, fallbackTranslations) {
        this.translations = this.merge(defaultTranslations, fallbackTranslations);

        localStorage.setItem(this.localStorageKey, JSON.stringify(this.translations));
    }

    /**
     * @param {Object} defaultTranslations
     * @param {Object} fallbackTranslations
     * @returns {Object}
     */
    merge(defaultTranslations, fallbackTranslations) {
        return {
            pulledAt: new Date(),
            defaultLanguage: this.defaultLanguage,
            fallbackLanguage: this.fallbackLanguage,
            namespace: this.namespace,
            ...fallbackTranslations,
            ...defaultTranslations
        };
    }

    /**
     * @param {String} key
     * @returns {String}
     */
    findTranslation(key) {
        if (this.defaultLanguage.toLowerCase() === 'key') {
            return this.translations[key] !== undefined ? `[${key}]` : `[[${key}]]`;
        }

        const translation = this.translations[key];

        return translation !== undefined ? translation : key;
    }

    /**
     * @param {Array} keys
     * @returns {Array}
     */
    findTranslations(keys) {
        return keys.map(key => this.findTranslation(key));
    }
}
