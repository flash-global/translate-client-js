# translate-client-js

## What is it ?

It's a javascript client to use translate api.

## How does it work ?

![alt text](https://raw.githubusercontent.com/flash-global/translate-client-js/master/documentation/images/chart_translate_client_js.jpeg)

## Technical stack

- ECMAScript 6 to use last functionalities like class, promise, async/await, etc...
- Webpack to manage modules
- Babel to compile the javascript to be compatible with old browsers
- Tools executed with Node.js version 10
- Packages managed with `yarn`

## How to install it and modify it

- Execute command `yarn`
- Generate development file: execute command `yarn dev` (result path: `dist/translate.js`) <br />
It will keep a process to re-generate the file each times you change the sources
- Generate dist file: execute command `yarn dist` (result path: `dist/translate.js`)
- Execute unit tests: execute command `yarn test` (code coverage page path: `coverage/lcov-report/index.html`)
- When you push your changes, don't forget to generate dist file !!

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
