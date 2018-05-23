import managerFactory from '../src/Factory/managerFactory';
import Translate from '../src/translate';
import Manager from '../src/Service/manager';

jest.mock('../src/Service/manager');
jest.mock('../src/Factory/managerFactory');

let managerMock = null;

beforeEach(() => {
    Manager.mockClear();

    managerMock = new Manager();
    
    managerFactory.mockReturnValueOnce(managerMock);
});

it('Test call constructor', () => {
    const fixtureConfig = {
        baseUrl: 'base-url',
        namespace: '/namespace'
    };
    const expectedConfig = {
        baseUrl: 'base-url',
        defaultLanguage: 'fr_FR',
        fallbackLanguage: 'en_US',
        namespace: '/namespace',
        cacheDuration: 86400,
        localStorageKey: 'translations'
    };

    managerMock.init = jest.fn();

    const translate = new Translate(fixtureConfig);

    expect(managerMock.init).toHaveBeenCalledTimes(1);

    expect(managerFactory).toHaveBeenCalledWith(expectedConfig);
    expect(managerFactory).toHaveBeenCalledTimes(1);

    expect(translate.config).toEqual(expectedConfig);
    expect(translate.manager).toBe(managerMock);
});

it('Test call translate', () => {
    const fixtureKey = 'key';
    const fixturePromise = new Promise(() => {});

    const translate = new Translate({});

    managerMock.translate = jest.fn();
    managerMock.translate.mockReturnValueOnce(fixturePromise);

    expect(translate.translate(fixtureKey)).toBe(fixturePromise);

    expect(managerMock.translate).toHaveBeenCalledWith(fixtureKey);
    expect(managerMock.translate).toHaveBeenCalledTimes(1);
});

it('Test set defaultLanguage', () => {
    const translate = new Translate({});

    managerMock.init = jest.fn();

    translate.defaultLanguage = 'en_GB';

    expect(translate.config.defaultLanguage).toEqual('en_GB');
    expect(managerMock.init).toHaveBeenCalledTimes(1);
});

it('Test set fallbackLanguage', () => {
    const translate = new Translate({});

    managerMock.init = jest.fn();

    translate.fallbackLanguage = 'en_FR';

    expect(translate.config.fallbackLanguage).toEqual('en_FR');
    expect(managerMock.init).toHaveBeenCalledTimes(1);
});
