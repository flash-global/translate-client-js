import gatewayFactory from './gatewayFactory';
import Manager from '../Service/manager';

export default function(config) {
    const manager = new Manager();

    manager.gateway = gatewayFactory(config);
    manager.defaultLanguage = config.defaultLanguage;
    manager.fallbackLanguage = config.fallbackLanguage;

    return manager;
}