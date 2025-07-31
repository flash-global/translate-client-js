import { vi, beforeEach, it, expect } from 'vitest';
import managerFactory from '../src/Factory/managerFactory.js';
import TranslateClient from '../src/translate-client.js';
import Manager from '../src/Service/manager.js';

vi.mock('../src/Service/manager.js', () => {
    return {
      __esModule: true,
      default: vi.fn(), // Manager becomes a mock constructor
    };
  }
);

vi.mock('../src/Factory/managerFactory.js', () => {
    return {
      __esModule: true,
      default: vi.fn(), // Manager becomes a mock constructor
    };
  }
);

let managerMock = null;

beforeEach(async () => {
    vi.resetModules();
  
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
        localStorageKey: 'translations',
        forceLowerKey: false,
    };

    managerMock.init = vi.fn();

    const translate = new TranslateClient(fixtureConfig);

    expect(managerMock.init).toHaveBeenCalledTimes(1);

    expect(managerFactory).toHaveBeenCalledWith(expectedConfig);
    expect(managerFactory).toHaveBeenCalledTimes(1);

    expect(translate.config).toEqual(expectedConfig);
    expect(translate.manager).toBe(managerMock);
});

it('Test call translate', () => {
    const fixtureKey = 'key';
    const fixturePromise = new Promise(() => {});

    managerMock.init = vi.fn();

    const translate = new TranslateClient({});

    managerMock.translate = vi.fn();
    managerMock.translate.mockReturnValueOnce(fixturePromise);

    expect(translate.translate(fixtureKey)).toBe(fixturePromise);

    expect(managerMock.translate).toHaveBeenCalledWith(fixtureKey);
    expect(managerMock.translate).toHaveBeenCalledTimes(1);
});

it('Test set defaultLanguage', () => {
    managerMock.init = vi.fn();
    const translate = new TranslateClient({});

    managerMock.reset = vi.fn();

    translate.defaultLanguage = 'en_GB';

    expect(translate.config.defaultLanguage).toEqual('en_GB');
    expect(managerMock.reset).toHaveBeenCalledTimes(1);
});

it('Test set fallbackLanguage', () => {
    managerMock.init = vi.fn();
    const translate = new TranslateClient({});

    managerMock.reset = vi.fn();

    translate.fallbackLanguage = 'en_FR';

    expect(translate.config.fallbackLanguage).toEqual('en_FR');
    expect(managerMock.reset).toHaveBeenCalledTimes(1);
});

it('Test call translateMultiple', () => {
    const fixtureKeys = ['key1', 'key2'];
    const fixturePromise = new Promise(() => {});
    managerMock.init = vi.fn();
    const translate = new TranslateClient({});

    managerMock.translateMultiple = vi.fn();
    managerMock.translateMultiple.mockReturnValueOnce(fixturePromise);

    expect(translate.translateMultiple(fixtureKeys)).toEqual(fixturePromise);
    expect(managerMock.translateMultiple).toHaveBeenCalledWith(fixtureKeys);
    expect(managerMock.translateMultiple).toHaveBeenCalledTimes(1);
});

it('test getAllTranslation() is called', () => {
    const fixturePromise = new Promise(() => {});
    managerMock.init = vi.fn();
    const translate = new TranslateClient({});

    managerMock.getAllTranslations = vi.fn();
    managerMock.getAllTranslations.mockReturnValueOnce(fixturePromise);

    expect(translate.getAllTranslations()).toEqual(fixturePromise);
    expect(managerMock.getAllTranslations).toHaveBeenCalledTimes(1);
});