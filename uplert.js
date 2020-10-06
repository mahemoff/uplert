//////////////////////////////////////////////////////////////////////////////
// IMPORTS
//////////////////////////////////////////////////////////////////////////////

import config from 'config';
import yargs from 'yargs'
//import currencySymbol from 'currency-symbol';
//import currency from 'currency.js';
//import * as currency from 'currency.js';
import { hideBin } from 'yargs/helpers'
import * as alerter from './lib/app/alerter.mjs';
import Summary from './lib/app/summary.mjs'
import * as upBank from './lib/util/upbank.mjs';

//////////////////////////////////////////////////////////////////////////////
// I18N IMPORT
// We'll load strings and make them part of app config
//////////////////////////////////////////////////////////////////////////////

import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';
const pwd=path.dirname(fileURLToPath(import.meta.url));
const locPath=path.join(pwd, './locales');

i18n.configure({
  locales: ['en'],
  directory: locPath
})
config.i18n = i18n;

//////////////////////////////////////////////////////////////////////////////
// RUN FROM COMMAND-LINE
//////////////////////////////////////////////////////////////////////////////

(async() => {

  const {argv} = yargs(hideBin(process.argv))
    .command('alert', 'send alert if under balance', () => {}, async (argv) => {
      alerter.alertLowBalance(config);
    })
    .command('summary [format]', 'summary of all accounts', (yargs) => {
      yargs.positional('format', { describe: 'format to render', default: 'basic' })}, async (argv) => {
      const accounts = await upBank.getAccounts(config);
      const summary = new Summary(accounts, argv.format);
      console.log(summary.render());
    })
    .demandCommand(1).argv

  //console.log(argv);

  //alerter.alertLowBalance(config);

})();
