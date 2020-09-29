//////////////////////////////////////////////////////////////////////////////
// IMPORTS
//////////////////////////////////////////////////////////////////////////////

import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';
import * as upBank from '../util/upbank.mjs';
import * as emailer from '../util/emailer.mjs';

//////////////////////////////////////////////////////////////////////////////
// I18N import
//////////////////////////////////////////////////////////////////////////////

const pwd=path.dirname(fileURLToPath(import.meta.url));
const locPath=path.join(pwd, '../../locales');

i18n.configure({
  locales: ['en'],
  directory: locPath
})

//////////////////////////////////////////////////////////////////////////////
// LOGIC
//////////////////////////////////////////////////////////////////////////////

export async function alertLowBalance(config) {

  let id = process.env.UP_ACCOUNT_ID;
  const account = await upBank.getAccount(config, id);
  let balance = account.attributes.balance.value;
  if (balance < config.minimumBalance) {

    let subject = 'Up Bank balance is low';
    let email = config.email; // assume sender and receiver is same for now
    let message = i18n.__('lowBalanceMailBody', { balance: balance });

    await emailer.send(config.aws, subject, message, config.email, config.email);
    console.log('Balance low - sent email');

  } else {

    console.log('Balance OK');

  }

}
