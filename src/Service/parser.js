/**
 * @param {Array} i18nTranslations
 * @return {Object}
 */
export default function(i18nTranslations)
{
    const translations = {};

    i18nTranslations.forEach(translation => {
        translations[translation.key] = translation.content;
    });

    return translations;
};
