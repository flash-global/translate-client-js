export default class Gateway {
    constructor() {
        this.translateBaseUrl = '';
        this.namespace = '';
    }

    pull(lang) {
        return fetch(this.generateUrl(lang))
            .then(result => result.json());
    }

    generateUrl(lang) {
        return `${this.translateBaseUrl}/api/i18n-string?namespace=${this.namespace}&perPage=100000&lang=${lang}`;
    }

    set baseUrl(translateBaseUrl) {
        const lastCharacter = translateBaseUrl.substr(translateBaseUrl.length - 1);

        if(lastCharacter) {
            translateBaseUrl = translateBaseUrl.substr(0, translateBaseUrl.length - 1);
        }
        
        this.translateBaseUrl = translateBaseUrl;
    }
}
