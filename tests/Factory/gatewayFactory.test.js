import { vi, beforeEach, it, expect } from 'vitest';
import gatewayFactory from '../../src/Factory/gatewayFactory.js';
import Gateway from '../../src/Service/gateway.js';

vi.mock('../../src/Service/gateway.js');

beforeEach(() => {
    Gateway.mockClear();
});

it('Test factory', () => {
    const fixtureConfig = {
        baseUrl: 'base-url',
        namespace: '/namespace'
    };

    const gateway = gatewayFactory(fixtureConfig);

    expect(gateway.baseUrl).toEqual(fixtureConfig.baseUrl);
    expect(gateway.namespace).toEqual(fixtureConfig.namespace);
});
