export default class Gateway {
    constructor() {
        this.baseUrl = '';
        this.namespace = '';
    }

    pull(lang) {
        return fetch(this.generateUrl(lang))
            .then(result => result.json());
    }

    generateUrl(lang) {
        return `${this.baseUrl}/api/i18n-string?namespace=${this.namespace}&perPage=100000?lang=${lang}`;
    }

    set baseUrl(baseUrl) {
        const lastCharacter = baseUrl.substr(baseUrl.length - 1);

        if(lastCharacter) {
            baseUrl = baseUrl.substr(0, baseUrl.length - 1);
        }
        
        this.baseUrl = baseUrl;
    }
}
