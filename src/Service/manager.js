export default class Manager {
    constructor() {
        this.defaultLanguage = '';
        this.fallbackLanguage = '';
        this.cacheDuration = 0;
        this.gateway = null;
        this.translations = localStorage.getItem('translations');
    }

    translate(key) {
        return this.pullIfNeefed().then(() => this.findTranslation(key));
    }

    pullIfNeefed() {
        return new Promise((resolve, reject) => {
            if (this.checkPullNeeded()) {
                this.pull()
                    .then(() => resolve())
                    .catch(() => reject());
            } else {
                resolve();
            }
        });
    }

    checkPullNeeded() {
        if (this.translations === null) {
            return false;
        }

        if (!(this.translations.pulledAt instanceof Date)) {
            return false;
        }

        return this.translations.pulledAt - (new Date()) < this.cacheDuration;
    }

    pull() {
        return new Promise((resolve, reject) => {
            const defaultTranslations = await this.pullDefaultLanguage();
            const fallbackTranslations = await this.pullFallbackLanguage();

            this.save(defaultTranslations, fallbackTranslations);
            resolve();
        });
    }

    pullDefaultLanguage() {
        return this.gateway.pull(this.defaultLanguage);
    }

    pullFallbackLanguage() {
        return this.gateway.pull(this.fallbackLanguage);
    }

    save(defaultTranslations, fallbackTranslations) {
        this.translations = this.merge(defaultTranslations, fallbackTranslations);
        localStorage.setItem('translations', this.translations);
    }

    merge(defaultTranslations, fallbackTranslations) {
        return Object.assign({}, fallbackTranslations, defaultTranslations);
    }

    findTranslation(key) {
        const translation = this.translations[key];

        return translation !== undefined ? translation : key;
    }
}
