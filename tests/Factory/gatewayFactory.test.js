import gatewayFactory from '../../src/Factory/gatewayFactory';
import Gateway from '../../src/Service/gateway';

jest.mock('../../src/Service/gateway');

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
