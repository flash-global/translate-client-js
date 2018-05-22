export default class Gateway
{
    constructor()
    {
        this.translateBaseUrl = '';
        this.namespace = '';
    }

    /**
     * @param {String} lang
     * @returns {Promise<Array,Error>}
     */
    pull(lang)
    {
        return fetch(this.generateUrl(lang))
            .then(response => {
                if(response.ok) {
                    return response;
                }

                throw new Error('Response code not 200');
            })
            .then(response => {
                const contentType = response.headers.get("content-type");

                if(contentType && contentType.indexOf('application/json') !== -1) {
                    return response;
                }

                throw new Error('Response type not json');
            })
            .then(response => response.json());
    }

    /**
     * @param {String} lang
     * @returns {String}
     */
    generateUrl(lang)
    {
        return `${this.translateBaseUrl}/api/i18n-string?namespace=${this.namespace}&perPage=100000&lang=${lang}`;
    }

    /**
     * @param {String} translateBaseUrl
     */
    set baseUrl(translateBaseUrl)
    {
        const lastCharacter = translateBaseUrl.substr(translateBaseUrl.length - 1);

        if(lastCharacter) {
            translateBaseUrl = translateBaseUrl.substr(0, translateBaseUrl.length - 1);
        }
        
        this.translateBaseUrl = translateBaseUrl;
    }
}
