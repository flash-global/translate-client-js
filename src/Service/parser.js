/**
 * @param {Object} i18nTranslations
 * @return {Object}
 */
export default function (i18nTranslations) {
    const translations = {};

    Object.keys(i18nTranslations).forEach((index) => {
        const translation = i18nTranslations[index];
        translations[translation.key] = translation.content;
    });

    return translations;
}
