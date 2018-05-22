import parser from './parser';

export default class Manager {
    constructor() {
        this.defaultLanguage = '';
        this.fallbackLanguage = '';
        this.cacheDuration = 0;
        this.gateway = null;
        this.localStorageKey = '';
        this.translations = this.getLocalStorageTranslations();
    }

    translate(key) {
        return this.pullIfNeefed().then(() => this.findTranslation(key));
    }

    pullIfNeefed() {
        if (this.checkPullNeeded()) {
            return this.pull();
        }

        return new Promise(resolve => resolve());
    }

    getLocalStorageTranslations() {
        const jsonTranslations = localStorage.getItem(this.localStorageKey);

        if(typeof jsonTranslations !== String) {
            return null;
        }

        return this.parseJsonTranslations(jsonTranslations);
    }

    parseJsonTranslations(jsonTranslations) {
        try {
            const translations = JSON.parse(jsonTranslations);

            if(typeof translations !== Object) {
                return null;
            }

            return translations;
        } catch(exception) {
            return null;
        }
    }

    checkPullNeeded() {
        if (this.translations === null) {
            return true;
        }

        if (!(this.translations.pulledAt instanceof Date)) {
            return true;
        }

        return this.translations.pulledAt - (new Date()) >= this.cacheDuration;
    }

    pull() {
        return new Promise(async (resolve, reject) => {
            const defaultTranslations = await this.pullLanguage(this.defaultLanguage);
            const fallbackTranslations = await this.pullLanguage(this.fallbackLanguage);

            this.save(defaultTranslations, fallbackTranslations);
            resolve();
        });
    }

    pullLanguage(language) {
        return this.gateway.pull(language).then(translations => parser(translations));
    }

    save(defaultTranslations, fallbackTranslations) {
        this.translations = this.merge(defaultTranslations, fallbackTranslations);
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.translations));
    }

    merge(defaultTranslations, fallbackTranslations) {
        return Object.assign({pulledAt: new Date()}, fallbackTranslations, defaultTranslations);
    }

    findTranslation(key) {
        const translation = this.translations[key];

        return translation !== undefined ? translation : key;
    }
}
