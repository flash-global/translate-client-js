export default function(i18nTranslations) {
    const translations = {};

    for(let [index, translation] of Object.entries(i18nTranslations)) {
        translations[translation.key] = translation.content;
    }

    return translations;
};