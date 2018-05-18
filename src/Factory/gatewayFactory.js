import Gateway from "../Service/gateway";

export default function(config) {
    const gateway = new Gateway();

    gateway.baseUrl = config._baseUrl;
    gateway.namespace = config.namespace;
}