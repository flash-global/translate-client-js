/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./build/bootstrap.js":
/*!****************************!*\
  !*** ./build/bootstrap.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _src_translate_client_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/translate-client.js */ \"./src/translate-client.js\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_src_translate_client_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack://TranslateClient/./build/bootstrap.js?\n}");

/***/ }),

/***/ "./src/Factory/gatewayFactory.js":
/*!***************************************!*\
  !*** ./src/Factory/gatewayFactory.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Service_gateway_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Service/gateway.js */ \"./src/Service/gateway.js\");\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(config) {\n    const gateway = new _Service_gateway_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\n    gateway.baseUrl = config.baseUrl;\n    gateway.namespace = config.namespace;\n\n    return gateway;\n}\n\n\n//# sourceURL=webpack://TranslateClient/./src/Factory/gatewayFactory.js?\n}");

/***/ }),

/***/ "./src/Factory/managerFactory.js":
/*!***************************************!*\
  !*** ./src/Factory/managerFactory.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _gatewayFactory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gatewayFactory.js */ \"./src/Factory/gatewayFactory.js\");\n/* harmony import */ var _Service_manager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Service/manager.js */ \"./src/Service/manager.js\");\n\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(config) {\n    const manager = new _Service_manager_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\n\n    manager.gateway = (0,_gatewayFactory_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(config);\n    manager.defaultLanguage = config.defaultLanguage;\n    manager.fallbackLanguage = config.fallbackLanguage;\n    manager.cacheDuration = config.cacheDuration;\n    manager.localStorageKey = config.localStorageKey;\n    manager.namespace = config.namespace;\n    manager.forceLowerKey = config.forceLowerKey;\n\n    return manager;\n}\n\n\n//# sourceURL=webpack://TranslateClient/./src/Factory/managerFactory.js?\n}");

/***/ }),

/***/ "./src/Service/gateway.js":
/*!********************************!*\
  !*** ./src/Service/gateway.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Gateway)\n/* harmony export */ });\nclass Gateway {\n    constructor() {\n        this.translateBaseUrl = '';\n        this.namespace = '';\n    }\n\n    async pull(lang) {\n        const response = await fetch(this.generateUrl(lang));\n        if (!response.ok) {\n            throw new Error('Response status code not 200');\n        }\n        const contentType = response.headers.get('Content-Type');\n        if (!(contentType && contentType.indexOf('application/json') !== -1)) {\n            throw new Error('Response type not json');\n        }\n        return response.json();\n    }\n\n    /**\n     * @param {String} lang\n     * @returns {String}\n     */\n    generateUrl(lang) {\n        return `${this.translateBaseUrl}/api/i18n-string?namespace=${this.namespace}&perPage=100000&lang=${lang}&forceUtf8=on`;\n    }\n\n    /**\n     * @param {String} translateBaseUrl\n     */\n    set baseUrl(translateBaseUrl) {\n        const lastCharacter = translateBaseUrl.substr(translateBaseUrl.length - 1);\n\n        if (lastCharacter === '/') {\n            translateBaseUrl = translateBaseUrl.substr(0, translateBaseUrl.length - 1);\n        }\n        this.translateBaseUrl = translateBaseUrl;\n    }\n}\n\n\n//# sourceURL=webpack://TranslateClient/./src/Service/gateway.js?\n}");

/***/ }),

/***/ "./src/Service/manager.js":
/*!********************************!*\
  !*** ./src/Service/manager.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Manager)\n/* harmony export */ });\n/* harmony import */ var _parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parser.js */ \"./src/Service/parser.js\");\n\n\nclass Manager {\n    constructor() {\n        this.defaultLanguage = '';\n        this.fallbackLanguage = '';\n        this.cacheDuration = 0;\n        this.localStorageKey = '';\n        this.translations = null;\n        this.namespace = '';\n        this.forceLowerKey = false;\n        this.gateway = null;\n    }\n\n    init() {\n        this.translations = this.getLocalStorageTranslations();\n    }\n\n    reset() {\n        localStorage.removeItem(this.localStorageKey);\n        this.translations = null;\n    }\n\n    /**\n     * @param {String} key\n     * @returns {String}\n     */\n    parseKey(key) {\n        return this.forceLowerKey ? key.toString().toLowerCase() : key;\n    }\n\n    parseKeys(keys) {\n        return this.forceLowerKey ? keys.map(key => key.toString().toLowerCase()) : keys;\n    }\n\n    /**\n     * @param {String} key\n     * @returns {Promise<String,Error>}\n     */\n    translate(key) {\n        return this.pullIfNeeded().then(() => this.findTranslation(this.parseKey(key)));\n    }\n\n    /**\n     * @param {Array} keys\n     * @returns {Promise<Array,Error>}\n     */\n    translateMultiple(keys) {\n        return this.pullIfNeeded().then(() => this.findTranslations(this.parseKeys(keys)));\n    }\n\n    /**\n     *  @returns {Promise<Object,Error>}\n     */\n    getAllTranslations() {\n        return this.pullIfNeeded().then(() => this.createCopy());\n    }\n\n    /**\n     *  @returns {Object}\n     */\n    createCopy() {\n        const copy = structuredClone(this.translations);\n        delete copy.pulledAt;\n        delete copy.defaultLanguage;\n        delete copy.fallbackLanguage;\n        delete copy.namespace;\n        return copy;\n    }\n\n    async pullIfNeeded() {\n        if (this.checkPullNeeded()) {\n            return this.pull();\n        }\n        return;\n    }\n\n    /**\n     * @returns {null|Object}\n     */\n    getLocalStorageTranslations() {\n        const jsonTranslations = localStorage.getItem(this.localStorageKey);\n\n        if (typeof jsonTranslations !== 'string') {\n            return null;\n        }\n\n        return this.parseJsonTranslations(jsonTranslations);\n    }\n\n    /**\n     * @param {String} jsonTranslations\n     * @returns {null|Object}\n     */\n    parseJsonTranslations(jsonTranslations) {\n        try {\n            const translations = JSON.parse(jsonTranslations);\n\n            if (translations === null || typeof translations !== 'object') {\n                return null;\n            }\n\n            if (translations.pulledAt !== undefined) {\n                translations.pulledAt = new Date(translations.pulledAt);\n            }\n\n            return translations;\n        } catch (exception) {\n            return null;\n        }\n    }\n\n    /**\n     * @returns {Boolean}\n     */\n    checkPullNeeded() {\n        if (this.translations === null) {\n            return true;\n        }\n\n        if (!(this.translations.pulledAt instanceof Date)) {\n            return true;\n        }\n\n        if (this.translations.defaultLanguage !== this.defaultLanguage\n            || this.translations.fallbackLanguage !== this.fallbackLanguage\n            || this.translations.namespace !== this.namespace) {\n            return true;\n        }\n\n        return (Date.now() - this.translations.pulledAt) / 1000 >= this.cacheDuration;\n    }\n\n    /**\n     * @returns {Promise<undefined,Error>}\n     */\n    async pull() {\n        let defaultTranslations = {};\n        let fallbackTranslations = {};\n\n        try {\n            defaultTranslations = await this.pullLanguage(this.defaultLanguage);\n        } catch (e) {\n            console.error(e);\n        }\n\n        try {\n            fallbackTranslations = await this.pullLanguage(this.fallbackLanguage);\n        } catch (e) {\n            console.error(e);\n        }\n\n        this.save(defaultTranslations, fallbackTranslations);\n    }\n\n    /**\n     * @param {String} language\n     * @returns {Promise<Array,Error>}\n     */\n    pullLanguage(language) {\n        return this.gateway.pull(language)\n            .then(translations => (0,_parser_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(translations, this.forceLowerKey));\n    }\n\n    /**\n     * @param {Object} defaultTranslations\n     * @param {Object} fallbackTranslations\n     */\n    save(defaultTranslations, fallbackTranslations) {\n        this.translations = this.merge(defaultTranslations, fallbackTranslations);\n\n        localStorage.setItem(this.localStorageKey, JSON.stringify(this.translations));\n    }\n\n    /**\n     * @param {Object} defaultTranslations\n     * @param {Object} fallbackTranslations\n     * @returns {Object}\n     */\n    merge(defaultTranslations, fallbackTranslations) {\n        return {\n            pulledAt: new Date(),\n            defaultLanguage: this.defaultLanguage,\n            fallbackLanguage: this.fallbackLanguage,\n            namespace: this.namespace,\n            ...fallbackTranslations,\n            ...defaultTranslations\n        };\n    }\n\n    /**\n     * @param {String} key\n     * @returns {String}\n     */\n    findTranslation(key) {\n        if (this.defaultLanguage.toLowerCase() === 'key') {\n            return this.translations[key] !== undefined ? `[${key}]` : `[[${key}]]`;\n        }\n\n        const translation = this.translations[key];\n\n        return translation !== undefined ? translation : key;\n    }\n\n    /**\n     * @param {Array} keys\n     * @returns {Array}\n     */\n    findTranslations(keys) {\n        return keys.map(key => this.findTranslation(key));\n    }\n}\n\n\n//# sourceURL=webpack://TranslateClient/./src/Service/manager.js?\n}");

/***/ }),

/***/ "./src/Service/parser.js":
/*!*******************************!*\
  !*** ./src/Service/parser.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(i18nTranslations, forceLowerKey = false) {\n    const translations = {};\n\n    Object.keys(i18nTranslations).forEach((index) => {\n        const translation = i18nTranslations[index];\n        const key = forceLowerKey ? translation.key.toLowerCase() : translation.key;\n\n        translations[key] = translation.content;\n    });\n\n    return translations;\n}\n\n\n//# sourceURL=webpack://TranslateClient/./src/Service/parser.js?\n}");

/***/ }),

/***/ "./src/translate-client.js":
/*!*********************************!*\
  !*** ./src/translate-client.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ TranslateClient)\n/* harmony export */ });\n/* harmony import */ var _Factory_managerFactory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Factory/managerFactory.js */ \"./src/Factory/managerFactory.js\");\n\n\nclass TranslateClient {\n    constructor(config) {\n        this.defaultConfig = {\n            baseUrl: '',\n            defaultLanguage: 'fr_FR',\n            fallbackLanguage: 'en_US',\n            namespace: '',\n            cacheDuration: 86400,\n            localStorageKey: 'translations',\n            forceLowerKey: false,\n        };\n\n        this.config = {};\n\n        this.mergeConfig(config);\n        this.initManager();\n    }\n\n    translate(key) {\n        return this.manager.translate(key);\n    }\n\n    translateMultiple(keys) {\n        return this.manager.translateMultiple(keys);\n    }\n\n    getAllTranslations() {\n        return this.manager.getAllTranslations();\n    }\n\n    mergeConfig(config) {\n        Object.assign(this.config, this.defaultConfig, config);\n    }\n\n    initManager() {\n        this.manager = (0,_Factory_managerFactory_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this.config);\n        this.manager.init();\n    }\n\n    set defaultLanguage(defaultLanguage) {\n        this.config.defaultLanguage = defaultLanguage;\n        this.manager.defaultLanguage = defaultLanguage;\n        this.manager.reset();\n    }\n\n    set fallbackLanguage(fallbackLanguage) {\n        this.config.fallbackLanguage = fallbackLanguage;\n        this.manager.fallbackLanguage = fallbackLanguage;\n        this.manager.reset();\n    }\n}\n\n\n//# sourceURL=webpack://TranslateClient/./src/translate-client.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./build/bootstrap.js");
/******/ 	window.TranslateClient = __webpack_exports__;
/******/ 	
/******/ })()
;