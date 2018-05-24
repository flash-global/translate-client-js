import Manager from '../../src/Service/manager';
import Gateway from '../../src/Service/gateway';

jest.mock('../../src/Service/gateway');

const fixtureDefaultI18nTranslations = [
    {
        content: "This is the first translation",
        created_at: "2018-01-01 01:01:01",
        id: "1",
        key: "translation1",
        lang: "en_US",
        namespace: "/test"
    },
    {
        content: "This is the second translation",
        created_at: "2018-02-02 02:02:02",
        id: "2",
        key: "translation2",
        lang: "en_US",
        namespace: "/test"
    }
];

const fixtureFallbackI18nTranslations = [
    {
        content: "C'est la première traduction",
        created_at: "2018-01-01 01:01:01",
        id: "3",
        key: "translation1",
        lang: "fr_FR",
        namespace: "/test"
    },
    {
        content: "C'est la seconde traduction",
        created_at: "2018-02-02 02:02:02",
        id: "4",
        key: "translation2",
        lang: "fr_FR",
        namespace: "/test"
    },
    {
        content: "C'est la troisième traduction",
        created_at: "2018-03-03 03:03:03",
        id: "5",
        key: "translation3",
        lang: "fr_FR",
        namespace: "/test"
    }
];

const fixtureTranslations = {
    "translation1": "This is the first translation",
    "translation2": "This is the second translation",
    "translation3": "C'est la troisième traduction"
};

it('Test constructor', () => {
    const manager = new Manager();

    expect(manager.defaultLanguage).toEqual('');
    expect(manager.fallbackLanguage).toEqual('');
    expect(manager.cacheDuration).toEqual(0);
    expect(manager.gateway).toEqual(null);
    expect(manager.localStorageKey).toEqual('');
    expect(manager.translations).toEqual(null);
});

it('Test init result no translations because not stored on localStorage', () => {
    const manager = new Manager();
    manager.localStorageKey = 'key';

    global.localStorage = {
        getItem: jest.fn()
    };

    manager.init();

    expect(manager.translations).toEqual(null);
    expect(global.localStorage.getItem).toHaveBeenCalledWith('key');
    expect(global.localStorage.getItem).toHaveBeenCalledTimes(1);
});

it('Test init result no translations because it is not a valid JSON', () => {
    const manager = new Manager();
    manager.localStorageKey = 'key';

    global.localStorage = {
        getItem: jest.fn()
    };

    global.localStorage.getItem.mockReturnValueOnce('null');

    manager.init();

    expect(manager.translations).toEqual(null);
    expect(global.localStorage.getItem).toHaveBeenCalledWith('key');
    expect(global.localStorage.getItem).toHaveBeenCalledTimes(1);
});

it('Test init result success fetch saved translations', () => {
    const fixtureDate = new Date();
    const fixtureTranslations = {
        'no': 'Non',
        'yes': 'Oui',
        defaultLanguage: 'fr_FR',
        fallbackLanguage: 'en_US',
        pulledAt: fixtureDate.toISOString()
    };

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'fr_FR';
    manager.fallbackLanguage = 'en_US';

    global.localStorage = {
        getItem: jest.fn()
    };

    global.localStorage.getItem.mockReturnValueOnce(JSON.stringify(fixtureTranslations));

    manager.init();

    fixtureTranslations.pulledAt = fixtureDate;

    expect(manager.translations).toEqual(fixtureTranslations);
    expect(global.localStorage.getItem).toHaveBeenCalledWith('key');
    expect(global.localStorage.getItem).toHaveBeenCalledTimes(1);
});

it('Test translate will pull because there is not saved translate', () => {
    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;

    const promiseDefaultTranslations = new Promise(resolve => resolve(fixtureDefaultI18nTranslations));
    const promiseFallbackTranslations = new Promise(resolve => resolve(fixtureFallbackI18nTranslations));

    global.localStorage = {
        setItem: jest.fn()
    };

    gatewayMock.pull
        .mockReturnValueOnce(promiseDefaultTranslations)
        .mockReturnValueOnce(promiseFallbackTranslations);

    manager.translate('translation1')
        .then(result => {
            expect(result).toEqual("This is the first translation");

            expect(gatewayMock.pull.mock.calls).toEqual([
                ['en_US'],
                ['fr_FR']
            ]);
            expect(gatewayMock.pull).toHaveBeenCalledTimes(2);

            const savedTranslations = JSON.parse(global.localStorage.setItem.mock.calls[0][1]);
            delete savedTranslations.pulledAt;

            expect(savedTranslations).toEqual(Object.assign(
                {
                    defaultLanguage: 'en_US',
                    fallbackLanguage: 'fr_FR'
                },
                fixtureTranslations
            ));
        })
        .catch(error => console.log(error));
});

it('Test translate will pull because saved translations are outdated', () => {
    const fixturePulledAt = new Date();
    fixturePulledAt.setDate(fixturePulledAt.getDate() - 1.1);

    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;
    manager.cacheDuration = 3600 * 24;
    manager.translations = Object.assign({pulledAt: fixturePulledAt}, fixtureTranslations);

    const promiseDefaultTranslations = new Promise(resolve => resolve(fixtureDefaultI18nTranslations));
    const promiseFallbackTranslations = new Promise(resolve => resolve(fixtureFallbackI18nTranslations));

    global.localStorage = {
        setItem: jest.fn()
    };

    gatewayMock.pull
        .mockReturnValueOnce(promiseDefaultTranslations)
        .mockReturnValueOnce(promiseFallbackTranslations);

    manager.translate('translation1')
        .then(result => {
            expect(result).toEqual("This is the first translation");

            expect(gatewayMock.pull.mock.calls).toEqual([
                ['en_US'],
                ['fr_FR']
            ]);
            expect(gatewayMock.pull).toHaveBeenCalledTimes(2);

            const savedTranslations = JSON.parse(global.localStorage.setItem.mock.calls[0][1]);
            delete savedTranslations.pulledAt;

            expect(savedTranslations).toEqual(Object.assign(
                {
                    defaultLanguage: 'en_US',
                    fallbackLanguage: 'fr_FR'
                },
                fixtureTranslations
            ));
        })
        .catch(error => console.log(error));
});

it('Test translate will pull new translations because there is not the same languages', () => {
    const fixturePulledAt = new Date();
    fixturePulledAt.setDate(fixturePulledAt.getDate() - 0.5);

    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;
    manager.cacheDuration = 3600 * 24;
    manager.translations = Object.assign(
        {
            pulledAt: fixturePulledAt,
            defaultLanguage: 'fr_FR',
            fallbackLanguage: 'en_US'
        },
        fixtureTranslations
    );

    const promiseDefaultTranslations = new Promise(resolve => resolve(fixtureDefaultI18nTranslations));
    const promiseFallbackTranslations = new Promise(resolve => resolve(fixtureFallbackI18nTranslations));

    global.localStorage = {
        setItem: jest.fn()
    };

    gatewayMock.pull
        .mockReturnValueOnce(promiseDefaultTranslations)
        .mockReturnValueOnce(promiseFallbackTranslations);

    manager.translate('translation1')
        .then(result => {
            expect(result).toEqual("This is the first translation");

            expect(gatewayMock.pull.mock.calls).toEqual([
                ['en_US'],
                ['fr_FR']
            ]);
            expect(gatewayMock.pull).toHaveBeenCalledTimes(2);

            const savedTranslations = JSON.parse(global.localStorage.setItem.mock.calls[0][1]);
            delete savedTranslations.pulledAt;

            expect(savedTranslations).toEqual(Object.assign(
                {
                    defaultLanguage: 'en_US',
                    fallbackLanguage: 'fr_FR'
                },
                fixtureTranslations
            ));
        })
        .catch(error => console.log(error));
});

it('Test translate will not pull new translations', () => {
    const fixturePulledAt = new Date();
    fixturePulledAt.setDate(fixturePulledAt.getDate() - 0.5);

    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;
    manager.cacheDuration = 3600 * 24;
    manager.translations = Object.assign(
        {
            pulledAt: fixturePulledAt,
            defaultLanguage: 'en_US',
            fallbackLanguage: 'fr_FR'
        },
        fixtureTranslations
    );

    manager.translate('translation1')
        .then(result => {
            expect(result).toEqual("This is the first translation");
            expect(gatewayMock.pull).toHaveBeenCalledTimes(0);
        })
        .catch(error => console.log(error));
});

it('Test reset', () => {
    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.translations = {};

    global.localStorage = {
        removeItem: jest.fn()
    };

    manager.reset();

    expect(global.localStorage.removeItem).toHaveBeenCalledWith('key');
    expect(global.localStorage.removeItem).toHaveBeenCalledTimes(1);

    expect(manager.translations).toEqual(null);
});

it('Test translateMultiple will not pull new translations', () => {
    const fixtureKeys = ['translation1', 'translation3'];
    const fixtureResult = ['This is the first translation', "C'est la troisième traduction"];

    const fixturePulledAt = new Date();
    fixturePulledAt.setDate(fixturePulledAt.getDate() - 0.5);

    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;
    manager.cacheDuration = 3600 * 24;
    manager.translations = Object.assign(
        {
            pulledAt: fixturePulledAt,
            defaultLanguage: 'en_US',
            fallbackLanguage: 'fr_FR'
        },
        fixtureTranslations
    );

    manager.translateMultiple(fixtureKeys)
        .then(result => {
            expect(result).toEqual(fixtureResult);
            expect(gatewayMock.pull).toHaveBeenCalledTimes(0);
        })
        .catch(error => console.log(error));
});
