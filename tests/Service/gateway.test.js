import Gateway from '../../src/Service/gateway';

it('Test constructor', () => {
    const gateway = new Gateway();

    expect(gateway.translateBaseUrl).toEqual('');
    expect(gateway.namespace).toEqual('');
});

it('Test pull throw error', () => {
    const fixtureLang = 'fr_FR';
    const gateway = new Gateway();

    const expectedError = new Error('Error for test');
    const promise = new Promise(() => {
        throw expectedError;
    });

    global.fetch = jest.fn();
    global.fetch.mockReturnValueOnce(promise);

    gateway.pull(fixtureLang).catch(error => {
        expect(error).toBe(expectedError);
    });
});

it('Test pull error status code', () => {
    const fixtureLang = 'fr_FR';
    const gateway = new Gateway();
    const responseMock = {
        ok: false
    };

    const expectedError = new Error('Response status code not 200');
    const promise = new Promise(resolve => {
        resolve(responseMock);
    });

    global.fetch = jest.fn();
    global.fetch.mockReturnValueOnce(promise);

    gateway.pull(fixtureLang).catch(error => {
        expect(fetch).toHaveBeenCalledTimes(1);

        expect(error).toEqual(expectedError);
    });
});

it('Test pull error response type', () => {
    const fixtureLang = 'fr_FR';
    const gateway = new Gateway();

    const headersMock = {
        get: jest.fn()
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

    global.fetch = jest.fn();
    global.fetch.mockReturnValueOnce(promise);

    gateway.pull(fixtureLang).catch(error => {
        expect(fetch).toHaveBeenCalledTimes(1);

        expect(error).toEqual(expectedError);

        expect(headersMock.get).toHaveBeenCalledWith('Content-Type');
        expect(headersMock.get).toHaveBeenCalledTimes(1);
    });
});

it('Test pull success', () => {
    const fixtureLang = 'fr_FR';
    const fixtureResultData = [{plop: 'plop'}, {plip: 'plap'}];
    const gateway = new Gateway();

    gateway.baseUrl = 'base-url';
    gateway.namespace = '/test';

    const promiseJson = new Promise(resolve => {
        resolve(fixtureResultData);
    });

    const headersMock = {
        get: jest.fn()
    };
    const jsonMock = jest.fn();
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

    global.fetch = jest.fn();
    global.fetch.mockReturnValueOnce(promise);

    gateway.pull(fixtureLang).then(dataResult => {
        expect(headersMock.get).toHaveBeenCalledWith('Content-Type');
        expect(headersMock.get).toHaveBeenCalledTimes(1);

        expect(jsonMock).toHaveBeenCalledTimes(1);

        expect(global.fetch).toHaveBeenCalledWith(
            `base-url/api/i18n-string?namespace=/test&perPage=100000&lang=${fixtureLang}&forceUtf8=on`
        );
        expect(global.fetch).toHaveBeenCalledTimes(1);

        expect(dataResult).toBe(fixtureResultData);
    });
});

it('Test set base url', () => {
    const gateway = new Gateway();

    gateway.baseUrl = 'base-url';
    expect(gateway.translateBaseUrl).toEqual('base-url');

    gateway.baseUrl = 'base-url/';
    expect(gateway.translateBaseUrl).toEqual('base-url');
});
