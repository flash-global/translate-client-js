# translate-client-js

<!-- vscode-markdown-toc -->
* 1. [What is it ?](#Whatisit)
* 2. [How does it work ?](#Howdoesitwork)
* 3. [Technical stack](#Technicalstack)
* 4. [How to install it and modify it](#Howtoinstallitandmodifyit)
* 5. [How to integrate it](#Howtointegrateit)
	* 5.1. [How to get the client](#Howtogettheclient)
		* 5.1.1. [Without ES6 modules](#WithoutES6modules)
		* 5.1.2. [With ES6 modules](#WithES6modules)
	* 5.2. [How to use it](#Howtouseit)
* 6. [Creating a Release](#CreatingaRelease)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

##  1. <a name='Whatisit'></a>What is it ?

It's a javascript client to use translate api.

##  2. <a name='Howdoesitwork'></a>How does it work ?

![alt text](https://raw.githubusercontent.com/flash-global/translate-client-js/master/documentation/images/chart_translate_client_js.jpeg)

##  3. <a name='Technicalstack'></a>Technical stack

- webpack
- vitest
- eslint



##  4. <a name='Howtoinstallitandmodifyit'></a>How to install it and modify it

- Execute command `npm ci`
- Generate development file: execute command `npm run start` (result path: `dist/translate.js`) <br />
It will keep a process to re-generate the file each times you change the sources
- Generate dist file: execute command `npm run build` (result path: `dist/translate.js`)
- Execute unit tests: execute command `npm run test` (code coverage page path: `coverage/lcov-report/index.html`)
- When you push your changes, don't forget to generate dist file !
- Update the npm package: `npm login`(to log with yoctu account) and `npm publish`(don't forget to change version in package.json)

##  5. <a name='Howtointegrateit'></a>How to integrate it
###  5.1. <a name='Howtogettheclient'></a>How to get the client
####  5.1.1. <a name='WithoutES6modules'></a>Without ES6 modules

- Fetch the project files (download, clone, etc...)
- Add a `<script>` to use file in `dist/translate-client.js`

####  5.1.2. <a name='WithES6modules'></a>With ES6 modules

- Fetch the project files (download, clone, etc...)
- Import the client with `import TranslateClient from 'translate-client-js''`

###  5.2. <a name='Howtouseit'></a>How to use it

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


##  6. <a name='CreatingaRelease'></a>Creating a Release

- Never modify the `version` field in the `package.json` manually.
- Make a "draft a release" in github give it a tag using this pattern `v6.6.6`
    - This Tag will be stamped in the `package.json`
  