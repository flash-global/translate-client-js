import 'babel-polyfill';
import 'whatwg-fetch';

import TranslateClient from '../src/translate-client';

global.TranslateClient = TranslateClient;
