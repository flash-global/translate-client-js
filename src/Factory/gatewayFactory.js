import Gateway from "../Service/gateway";

export default function(config) {
    const gateway = new Gateway();

    gateway.baseUrl = config.baseUrl;
    gateway.namespace = config.namespace;

    return gateway;
}
