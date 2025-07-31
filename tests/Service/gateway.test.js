import { vi, it, expect } from 'vitest';
import Gateway from '../../src/Service/gateway.js';

it('Test constructor', () => {
    const gateway = new Gateway();

    expect(gateway.translateBaseUrl).toEqual('');
    expect(gateway.namespace).toEqual('');
});

it('Test pull throw error', async () => {
    const fixtureLang = 'fr_FR';
    const gateway = new Gateway();

    const expectedError = new Error('Error for test');
    const promise = new Promise(() => {
        throw expectedError;
    });

    global.fetch = vi.fn();
    global.fetch.mockReturnValueOnce(promise);

    try {
        await gateway.pull(fixtureLang);
    } catch (error) {
        expect(error).toBe(expectedError);
    }
});

it('Test pull error status code', async () => {
    const fixtureLang = 'fr_FR';
    const gateway = new Gateway();
    const responseMock = {
        ok: false
    };

    const expectedError = new Error('Response status code not 200');
    const promise = new Promise(resolve => {
        resolve(responseMock);
    });

    global.fetch = vi.fn();
    global.fetch.mockReturnValueOnce(promise);

    try {
        await gateway.pull(fixtureLang);
    } catch (error) {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(error).toEqual(expectedError);
    }
});

it('Test pull error response type', async () => {
    const fixtureLang = 'fr_FR';
    const gateway = new Gateway();

    const headersMock = {
        get: vi.fn()
    };
    const responseMock = {
        ok: true,
        headers: headersMock
    };

    headersMock.get.mockReturnValueOnce('text/html');

    const expectedError = new Error('Response type not json');
    const promise = new Promise(resolve => {
        resolve(responseMock);
    });

    global.fetch = vi.fn();
    global.fetch.mockReturnValueOnce(promise);

    try {
        await gateway.pull(fixtureLang);
    } catch(error) {
        expect(fetch).toHaveBeenCalledTimes(1);

        expect(error).toEqual(expectedError);

        expect(headersMock.get).toHaveBeenCalledWith('Content-Type');
        expect(headersMock.get).toHaveBeenCalledTimes(1);
    }
});

it('Test pull success', async () => {
    const fixtureLang = 'fr_FR';
    const fixtureResultData = [{plop: 'plop'}, {plip: 'plap'}];
    const gateway = new Gateway();

    gateway.baseUrl = 'base-url';
    gateway.namespace = '/test';

    const promiseJson = new Promise(resolve => {
        resolve(fixtureResultData);
    });

    const headersMock = {
        get: vi.fn()
    };
    const jsonMock = vi.fn();
    const responseMock = {
        ok: true,
        headers: headersMock,
        json: jsonMock
    };

    headersMock.get.mockReturnValueOnce('application/json');
    jsonMock.mockReturnValueOnce(promiseJson);

    const promise = new Promise(resolve => {
        resolve(responseMock);
    });

    global.fetch = vi.fn();
    global.fetch.mockReturnValueOnce(promise);

    const dataResult = await gateway.pull(fixtureLang);

    expect(headersMock.get).toHaveBeenCalledWith('Content-Type');
    expect(headersMock.get).toHaveBeenCalledTimes(1);

    expect(jsonMock).toHaveBeenCalledTimes(1);

    expect(global.fetch).toHaveBeenCalledWith(
        `base-url/api/i18n-string?namespace=/test&perPage=100000&lang=${fixtureLang}&forceUtf8=on`
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);

    expect(dataResult).toBe(fixtureResultData);
});

it('Test set base url', () => {
    const gateway = new Gateway();

    gateway.baseUrl = 'base-url';
    expect(gateway.translateBaseUrl).toEqual('base-url');

    gateway.baseUrl = 'base-url/';
    expect(gateway.translateBaseUrl).toEqual('base-url');
});
