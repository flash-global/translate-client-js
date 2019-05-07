import parser from '../../src/Service/parser';

it('Test parse i18nTranslations', () => {
    const fixtureI18nTranslations = {
        0: {
            content: "This is the first translation",
            created_at: "2018-01-01 01:01:01",
            id: "1",
            key: "Translation1",
            lang: "en_US",
            namespace: "/test"
        },
        1: {
            content: "This is the second translation",
            created_at: "2018-02-02 02:02:02",
            id: "2",
            key: "translation2",
            lang: "en_US",
            namespace: "/test"
        }
    };

    const expectedTranslations = {
        "Translation1": "This is the first translation",
        "translation2": "This is the second translation"
    };

    expect(parser(fixtureI18nTranslations)).toEqual(expectedTranslations);
});

it('Test parse i18nTranslations with force lower key', () => {
    const fixtureI18nTranslations = {
        0: {
            content: "This is the first translation",
            created_at: "2018-01-01 01:01:01",
            id: "1",
            key: "Translation1",
            lang: "en_US",
            namespace: "/test"
        },
        1: {
            content: "This is the second translation",
            created_at: "2018-02-02 02:02:02",
            id: "2",
            key: "translation2",
            lang: "en_US",
            namespace: "/test"
        }
    };

    const expectedTranslations = {
        "translation1": "This is the first translation",
        "translation2": "This is the second translation"
    };

    expect(parser(fixtureI18nTranslations, true)).toEqual(expectedTranslations);
});
