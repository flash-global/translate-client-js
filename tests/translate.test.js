import * as managerFactoryMock from '../src/Factory/managerFactory';
import Translate from '../src/translate';
import Manager from '../src/Service/manager';

jest.mock('../src/Service/manager');

let managerMock = null;

beforeEach(() => {
    Manager.mockClear();

    managerMock = new Manager();

    managerFactoryMock.default = jest.fn();
    managerFactoryMock.default.mockReturnValueOnce(managerMock);
});

it('Test call constructor', () => {
    const fixtureConfig = {
        baseUrl: 'base-url',
        namespace: '/namespace'
    };
    const expectedConfig = {
        baseUrl: 'base-url',
        defaultLanguage: 'fr_FR',
        fallbackLanguage: 'en_GB',
        namespace: '/namespace',
        cacheDuration: 86400,
        localStorageKey: 'translations'
    };

    const translate = new Translate(fixtureConfig);

    expect(managerFactoryMock.default).toHaveBeenCalledWith(expectedConfig);
    expect(managerFactoryMock.default).toHaveBeenCalledTimes(1);

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
