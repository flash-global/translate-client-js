/**
 * @param {Object} i18nTranslations
 * @return {Object}
 */
export default function (i18nTranslations, forceLowerKey = false) {
    const translations = {};

    Object.keys(i18nTranslations).forEach((index) => {
        const translation = i18nTranslations[index];
        const key = forceLowerKey ? translation.key.toLowerCase() : translation.key;

        translations[key] = translation.content;
    });

    return translations;
}
