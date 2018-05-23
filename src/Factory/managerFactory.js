import gatewayFactory from './gatewayFactory';
import Manager from '../Service/manager';

/**
 * @param {Object} config
 * @returns {Manager}
 */
export default function (config) {
    const manager = new Manager();

    manager.gateway = gatewayFactory(config);
    manager.defaultLanguage = config.defaultLanguage;
    manager.fallbackLanguage = config.fallbackLanguage;
    manager.cacheDuration = config.cacheDuration;
    manager.localStorageKey = config.localStorageKey;

    return manager;
}
