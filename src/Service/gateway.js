export default class Gateway {
    constructor() {
        this._baseUrl = '';
        this._namespace = '';
    }

    pull(lang) {
        return fetch(this._generateUrl(lang))
            .then(result => result.json());
    }

    _generateUrl(lang) {
        return `${this._baseUrl}api/i18n-string?namespace=${this._namespace}&perPage=100000?lang=${lang}`;
    }

    set baseUrl(baseUrl) {
        this._baseUrl = baseUrl;
    }

    set namespace(namespace) {
        this._namespace = namespace;
    }
}
