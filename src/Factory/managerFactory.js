import gatewayFactory from './gatewayFactory.js';
import Manager from '../Service/manager.js';

export default function (config) {
    const manager = new Manager();

    manager.gateway = gatewayFactory(config);
    manager.defaultLanguage = config.defaultLanguage;
    manager.fallbackLanguage = config.fallbackLanguage;
    manager.cacheDuration = config.cacheDuration;
    manager.localStorageKey = config.localStorageKey;
    manager.namespace = config.namespace;
    manager.forceLowerKey = config.forceLowerKey;

    return manager;
}
