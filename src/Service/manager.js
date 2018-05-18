export default class Manager {
    constructor() {
        this._defaultLanguage = '';
        this._fallbackLanguage = '';
        this._cacheDuration = 0;
        this._gateway = null;
    }

    translate(key) {
        return this._pullIfNeefed().then(() => this._findTranslation(key));
    }

    _pullIfNeefed() {
        return new Promise(resolve, reject => {
            if (this._checkPullNeeded()) {
                this._pull()
                    .then(() => resolve())
                    .catch(() => reject());
            } else {
                resolve();
            }
        });
    }

    _checkPullNeeded() {
        const localTranslations = localStorage.getItem('translations');

        if (localTranslations === null) {
            return false;
        }

        if (!(localTranslations.pulledAt instanceof Date)) {
            return false;
        }

        return localTranslations.pulledAt - (new Date()) < 86400;
    }

    _pull() {
        
    }

    _save(defaultTranslations, fallbackTranslations) {

    }

    _merge(defaultTranslations, fallbackTranslations) {

    }

    _findTranslation() {

    }

    set defaultLanguage(defaultLanguage) {
        this._defaultLanguage = defaultLanguage;
    }

    set fallbackLanguage(fallbackLanguage) {
        this._fallbackLanguage = fallbackLanguage;
    }
    
    set cacheDuration(cacheDuration) {
        this._cacheDuration = cacheDuration;
    }

    set gateway(gateway) {
        this._gateway = gateway;
    }
}
