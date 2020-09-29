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
import getSymbolFromCurrency from 'currency-symbol-map'


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
      yargs.positional('format', { describe: 'format to render', default: 'basic' })
    }, async (argv) => {
      const format = argv.format.toLowerCase();
      const accounts = await upBank.getAccounts(config)
      if (format=='basic') {
        console.log(accounts.map( (account) => {
          const attribs = account.attributes;
          const symbol = getSymbolFromCurrency(attribs.balance.currencyCode);
          return `${attribs.displayName}: ${attribs.balance.currencyCode} ${symbol}${attribs.balance.value} (${attribs.accountType.toLowerCase()})`
        }).join("\n"));
      } else if (format=='json') {
        console.info(JSON.stringify(accounts, null, 2));
      }
    })
    .demandCommand(1).argv

  //console.log(argv);

  //alerter.alertLowBalance(config);

})();
