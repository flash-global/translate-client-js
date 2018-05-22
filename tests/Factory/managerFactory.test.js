import * as gatewayFactoryMock from '../../src/Factory/gatewayFactory';
import managerFactory from '../../src/Factory/managerFactory';
import Manager from '../../src/Service/manager';
import Gateway from '../../src/Service/gateway';

jest.mock('../../src/Service/manager');
jest.mock('../../src/Service/gateway');

let gatewayMock = null;

beforeEach(() => {
    Manager.mockClear();

    gatewayMock = new Gateway();

    gatewayFactoryMock.default = jest.fn();
    gatewayFactoryMock.default.mockReturnValueOnce(gatewayMock);
});


it('Test factory', () => {
    const fixtureConfig = {
        defaultLanguage: 'default-language',
        fallbackLanguage: 'fallback-language',
        cacheDuration: 60,
        localStorageKey: 'translations-key'
    };

    const manager = managerFactory(fixtureConfig);
    manager.gateway = gatewayMock;
    manager.defaultLanguage = fixtureConfig.defaultLanguage;
    manager.fallbackLanguage = fixtureConfig.fallbackLanguage;
    manager.cacheDuration = fixtureConfig.cacheDuration;
    manager.localStorageKey = fixtureConfig.localStorageKey;
});
