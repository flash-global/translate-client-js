import Manager from '../../src/Service/manager';
import Gateway from '../../src/Service/gateway';
import parser from '../../src/Service/parser';

jest.mock('../../src/Service/gateway');
jest.mock('../../src/Service/parser');

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

it('Test init result success get saved translations', () => {
    const fixtureTranslations = {'no': 'Non', 'yes': 'Oui'};
    const manager = new Manager();
    manager.localStorageKey = 'key';

    global.localStorage = {
        getItem: jest.fn()
    };

    global.localStorage.getItem.mockReturnValueOnce(JSON.stringify(fixtureTranslations));

    manager.init();

    expect(manager.translations).toEqual(fixtureTranslations);
    expect(global.localStorage.getItem).toHaveBeenCalledWith('key');
    expect(global.localStorage.getItem).toHaveBeenCalledTimes(1);
});
