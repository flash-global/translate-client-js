import { vi, beforeEach, it } from 'vitest';
import gatewayFactory from '../../src/Factory/gatewayFactory.js';
import managerFactory from '../../src/Factory/managerFactory.js';
import Manager from '../../src/Service/manager.js';
import Gateway from '../../src/Service/gateway.js';

vi.mock('../../src/Service/manager.js');
vi.mock('../../src/Service/gateway.js');
vi.mock('../../src/Factory/gatewayFactory.js');

let gatewayMock = null;

beforeEach(() => {
    Manager.mockClear();

    gatewayMock = new Gateway();

    gatewayFactory.mockReturnValueOnce(gatewayMock);
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
