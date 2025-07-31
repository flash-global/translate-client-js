export default class Gateway {
    constructor() {
        this.translateBaseUrl = '';
        this.namespace = '';
    }

    async pull(lang) {
        const response = await fetch(this.generateUrl(lang));
        if (!response.ok) {
            throw new Error('Response status code not 200');
        }
        const contentType = response.headers.get('Content-Type');
        if (!(contentType && contentType.indexOf('application/json') !== -1)) {
            throw new Error('Response type not json');
        }
        return response.json();
    }

    /**
     * @param {String} lang
     * @returns {String}
     */
    generateUrl(lang) {
        return `${this.translateBaseUrl}/api/i18n-string?namespace=${this.namespace}&perPage=100000&lang=${lang}&forceUtf8=on`;
    }

    /**
     * @param {String} translateBaseUrl
     */
    set baseUrl(translateBaseUrl) {
        const lastCharacter = translateBaseUrl.substr(translateBaseUrl.length - 1);

        if (lastCharacter === '/') {
            translateBaseUrl = translateBaseUrl.substr(0, translateBaseUrl.length - 1);
        }
        this.translateBaseUrl = translateBaseUrl;
    }
}
