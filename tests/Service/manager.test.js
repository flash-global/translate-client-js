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
    manager.init();

    expect(manager.translations).toEqual(null);
});

it('Test init result no translations because it is not a JSON', () => {
    const manager = new Manager();
    localStorage.setItem('key', 'null');

    manager.localStorageKey = 'key';
    manager.init();

    expect(manager.translations).toEqual(null);
});

it('Test init result no translations because it is not a valid JSON', () => {
    const manager = new Manager();
    localStorage.setItem('key', "{'test': 123");

    manager.localStorageKey = 'key';
    manager.init();

    expect(manager.translations).toEqual(null);
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

    localStorage.setItem('key', JSON.stringify(fixtureTranslations));
    manager.init();

    fixtureTranslations.pulledAt = fixtureDate;
    expect(manager.translations).toEqual(fixtureTranslations);
});

it('Test init result success fetch saved translations without pulledAt', () => {
    const fixtureTranslations = {
        'no': 'Non',
        'yes': 'Oui',
        defaultLanguage: 'fr_FR',
        fallbackLanguage: 'en_US',
    };

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'fr_FR';
    manager.fallbackLanguage = 'en_US';

    localStorage.setItem('key', JSON.stringify(fixtureTranslations));
    manager.init();

    expect(manager.translations).toEqual(fixtureTranslations);
});

it('Test translate will pull because there is not saved translate', () => {
    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.namespace = '/test';
    manager.gateway = gatewayMock;

    const promiseDefaultTranslations = new Promise(resolve => resolve(fixtureDefaultI18nTranslations));
    const promiseFallbackTranslations = new Promise(resolve => resolve(fixtureFallbackI18nTranslations));

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

            const savedTranslations = JSON.parse(localStorage.getItem('key'));
            delete savedTranslations.pulledAt;

            expect(savedTranslations).toEqual(Object.assign(
                {
                    defaultLanguage: 'en_US',
                    fallbackLanguage: 'fr_FR',
                    namespace: '/test',
                },
                fixtureTranslations
            ));
        })
        .catch(error => console.log(error));
});

it('Test translate will pull because saved translations have not any date', () => {
    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;
    manager.cacheDuration = 3600 * 24;
    manager.namespace = '/test';
    manager.translations = Object.assign({}, fixtureTranslations);

    const promiseDefaultTranslations = new Promise(resolve => resolve(fixtureDefaultI18nTranslations));
    const promiseFallbackTranslations = new Promise(resolve => resolve(fixtureFallbackI18nTranslations));

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

            const savedTranslations = JSON.parse(localStorage.getItem('key'));
            delete savedTranslations.pulledAt;

            expect(savedTranslations).toEqual(Object.assign(
                {
                    defaultLanguage: 'en_US',
                    fallbackLanguage: 'fr_FR',
                    namespace: '/test',
                },
                fixtureTranslations
            ));
        })
        .catch(error => console.log(error));
});

it('Test translate will pull because saved translations are outdated', () => {
    const fixturePulledAt = new Date();
    fixturePulledAt.setHours(fixturePulledAt.getHours() + 25);

    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;
    manager.cacheDuration = 3600 * 24;
    manager.namespace = '/test';
    manager.translations = Object.assign({ pulledAt: fixturePulledAt }, fixtureTranslations);

    const promiseDefaultTranslations = new Promise(resolve => resolve(fixtureDefaultI18nTranslations));
    const promiseFallbackTranslations = new Promise(resolve => resolve(fixtureFallbackI18nTranslations));

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

            const savedTranslations = JSON.parse(localStorage.getItem('key'));
            delete savedTranslations.pulledAt;

            expect(savedTranslations).toEqual(Object.assign(
                {
                    defaultLanguage: 'en_US',
                    fallbackLanguage: 'fr_FR',
                    namespace: '/test',
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
    manager.namespace = '/test';
    manager.translations = Object.assign(
        {
            pulledAt: fixturePulledAt,
            defaultLanguage: 'fr_FR',
            fallbackLanguage: 'en_US',
            namespace: '/test',
        },
        fixtureTranslations
    );

    const promiseDefaultTranslations = new Promise(resolve => resolve(fixtureDefaultI18nTranslations));
    const promiseFallbackTranslations = new Promise(resolve => resolve(fixtureFallbackI18nTranslations));

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

            const savedTranslations = JSON.parse(localStorage.getItem('key'));
            delete savedTranslations.pulledAt;

            expect(savedTranslations).toEqual(Object.assign(
                {
                    defaultLanguage: 'en_US',
                    fallbackLanguage: 'fr_FR',
                    namespace: '/test',
                },
                fixtureTranslations
            ));
        })
        .catch(error => console.log(error));
});

it('Test translate will pull new translations because there is not the same namespace', () => {
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
    manager.namespace = '/test';
    manager.translations = Object.assign(
        {
            pulledAt: fixturePulledAt,
            defaultLanguage: 'en_US',
            fallbackLanguage: 'fr_FR',
            namespace: '/test2',
        },
        fixtureTranslations
    );

    const promiseDefaultTranslations = new Promise(resolve => resolve(fixtureDefaultI18nTranslations));
    const promiseFallbackTranslations = new Promise(resolve => resolve(fixtureFallbackI18nTranslations));


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

            const savedTranslations = JSON.parse(localStorage.getItem('key'));
            delete savedTranslations.pulledAt;

            expect(savedTranslations).toEqual(Object.assign(
                {
                    defaultLanguage: 'en_US',
                    fallbackLanguage: 'fr_FR',
                    namespace: '/test',
                },
                fixtureTranslations
            ));
        })
        .catch(error => console.log(error));
});

it('Test translate will not pull new translations', () => {
    const fixturePulledAt = new Date();
    fixturePulledAt.setHours(fixturePulledAt.getHours() - 12);

    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;
    manager.cacheDuration = 3600 * 24;
    manager.namespace = '/test';
    manager.translations = Object.assign(
        {
            pulledAt: fixturePulledAt,
            defaultLanguage: 'en_US',
            fallbackLanguage: 'fr_FR',
            namespace: '/test',
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

it('Test translate will not pull new translations and return key', () => {
    const fixturePulledAt = new Date();
    fixturePulledAt.setHours(fixturePulledAt.getHours() - 12);

    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;
    manager.cacheDuration = 3600 * 24;
    manager.namespace = '/test';
    manager.translations = Object.assign(
        {
            pulledAt: fixturePulledAt,
            defaultLanguage: 'en_US',
            fallbackLanguage: 'fr_FR',
            namespace: '/test',
        },
        fixtureTranslations
    );

    manager.translate('translation5')
        .then(result => {
            expect(result).toEqual("translation5");
            expect(gatewayMock.pull).toHaveBeenCalledTimes(0);
        })
        .catch(error => console.log(error));
});

it('Test translate will not pull new translations and manage key language', () => {
    const fixturePulledAt = new Date();
    fixturePulledAt.setHours(fixturePulledAt.getHours() - 12);

    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'key';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;
    manager.cacheDuration = 3600 * 24;
    manager.namespace = '/test';
    manager.translations = Object.assign(
        {
            pulledAt: fixturePulledAt,
            defaultLanguage: 'key',
            fallbackLanguage: 'fr_FR',
            namespace: '/test',
        },
        fixtureTranslations
    );

    manager.translate('translation5')
        .then(result => {
            expect(result).toEqual('{{translation5}}');
            expect(gatewayMock.pull).toHaveBeenCalledTimes(0);
        })
        .catch(error => console.log(error));
});

it('Test reset', () => {
    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.translations = {};

    localStorage.setItem('key', 'test');

    manager.reset();

    expect(localStorage.getItem('key')).toEqual(null);
    expect(manager.translations).toEqual(null);
});

it('Test translateMultiple will not pull new translations', () => {
    const fixtureKeys = ['translation1', 'translation3'];
    const fixtureResult = ['This is the first translation', "C'est la troisième traduction"];

    const fixturePulledAt = new Date();
    fixturePulledAt.setHours(fixturePulledAt.getHours() - 12);

    const gatewayMock = new Gateway();
    gatewayMock.pull = jest.fn();

    const manager = new Manager();
    manager.localStorageKey = 'key';
    manager.defaultLanguage = 'en_US';
    manager.fallbackLanguage = 'fr_FR';
    manager.gateway = gatewayMock;
    manager.cacheDuration = 3600 * 24;
    manager.namespace = '/test';
    manager.translations = Object.assign(
        {
            pulledAt: fixturePulledAt,
            defaultLanguage: 'en_US',
            fallbackLanguage: 'fr_FR',
            namespace: '/test',
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

it('tests createCopy()', () => {
    const fixturePulledAt = new Date();
    const manager = new Manager();
    manager.translations = Object.assign(
        {
            pulledAt: fixturePulledAt,
            defaultLanguage: 'en_US',
            fallbackLanguage: 'fr_FR'
        },
        fixtureTranslations
    );

    const copy = manager.createCopy();
    expect(copy).toEqual(fixtureTranslations);
});

it('tests getAllTranslations()', () => {
    const fixturePulledAt = new Date();
    fixturePulledAt.setHours(fixturePulledAt.getHours() - 12);

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

    manager.getAllTranslations().then(result => expect(result).toEqual(fixtureTranslations));
});