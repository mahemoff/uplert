#!/usr/bin/env node

//////////////////////////////////////////////////////////////////////////////
// IMPORTS
//////////////////////////////////////////////////////////////////////////////

import config from 'config';
import yargs from 'yargs'
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

async function runAlert(argv) {
  const account = await upBank.lookupAccount(config, argv.account);
  if (!account) {
    console.error('ERROR: No account');
    return;
  }
  alerter.alertLowBalance(config, account);
}

async function runSummary(argv) {
  const accounts = await upBank.getAccounts(config);
  const summary = new Summary(accounts, argv.format);
  console.log(summary.render());
}

(async() => {

  const {argv} = yargs(hideBin(process.argv))
    .command(
      'alert',
      'send alert if under balance',
      (yargs) =>
        {
          yargs.option(
            'account', {
              description: 'name of account to alert about'
            }
          )
        },
      async (argv) => { runAlert(argv); }
    )
    .command(
        'summary [format]',
        'summary of all accounts',
        (yargs) =>
          {
            yargs.positional(
              'format',
              {
                describe: 'format to render',
                default: 'basic'
              }
            )
          },
        async (argv) => { runSummary(argv); }
      )
    .demandCommand(1).argv

})();
