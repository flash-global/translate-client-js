# translate-client-js

## What is it ?

It's a javascript client to use translate api.

## How does it work ?

![alt text](https://raw.githubusercontent.com/flash-global/translate-client-js/master/documentation/images/chart_translate_client_js.jpeg)

## Technical stack

- ECMAScript 6 to use last functionalities like class, promise, async/await, etc... [http://es6-features.org](http://es6-features.org)
- Webpack to manage modules [https://webpack.js.org/](https://webpack.js.org/)
- Babel to compile the javascript to be compatible with old browsers [https://babeljs.io/](https://babeljs.io/)
- Tools executed with Node.js version 10 [https://nodejs.org/en/](https://nodejs.org/en/)
- ESLing to linting the code [https://eslint.org/](https://eslint.org/)

## How to install it and modify it

- Execute command `npm ci`
- Generate development file: execute command `npm run start` (result path: `dist/translate.js`) <br />
It will keep a process to re-generate the file each times you change the sources
- Generate dist file: execute command `npm run build` (result path: `dist/translate.js`)
- Execute unit tests: execute command `npm run test` (code coverage page path: `coverage/lcov-report/index.html`)
- When you push your changes, don't forget to generate dist file !
- Update the npm package: `npm login`(to log with yoctu account) and `npm publish`(don't forget to change version in package.json)

## How to integrate it
### How to get the client
#### Without ES6 modules

- Fetch the project files (download, clone, etc...)
- Add a `<script>` to use file in `dist/translate-client.js`

#### With ES6 modules

- Fetch the project files (download, clone, etc...)
- Import the client with `import TranslateClient from 'translate-client-js''`

### How to use it

- Create a new instance of Translate with `var translateClient = new TranslateClient(config)` <br />
Here is the default configuration : <br >
```
{
    baseUrl: '',
    defaultLanguage: 'fr_FR',
    fallbackLanguage: 'en_US',
    namespace: '',
    cacheDuration: 86400,
    localStorageKey: 'translations'
} 
```
- Call translate method `translateClient.translate(key)`<br />
The translate method will return a promise (check [https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise))
- Use the promise<br />
```
translateClient.translate(key)
    .then(function(translation) {
        console.log('Result: ' + translation);
    })
    .catch(function(error) {
        console.log(error);
    });
```
- You can use `translateClient.translateMultiple(keys)` to translate an array of keys. It return the same type of promise as `translateClient.translate(key)`
- You can use `translateClient.getAllTranslations()` to have an object with all the keys and theirs values. It return the same type of promise as `translateClient.translate(key)`
