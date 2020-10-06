//////////////////////////////////////////////////////////////////////////////
// IMPORTS
//////////////////////////////////////////////////////////////////////////////

import i18n from 'i18n';
import { fileURLToPath } from 'url';
import * as upBank from '../util/upbank.mjs';
import * as emailer from '../util/emailer.mjs';

//////////////////////////////////////////////////////////////////////////////
// LOGIC
//////////////////////////////////////////////////////////////////////////////

export async function alertLowBalance(config) {

  //const account = await upBank.getAccount(config, id);
  const account = await upBank.getTransactionalAccount(config);
  if (!account) {
    console.log('ERROR: Account unknown');
    return;
  }

  let balance = account.attributes.balance.value;
  if (balance < config.minimumBalance) {

    let subject = 'Up Bank balance is low';
    let email = config.email; // assume sender and receiver is same for now
    let message = config.i18n.__('lowBalanceMailBody', { balance: balance });

    await emailer.send(config.aws, subject, message, config.email, config.email);
    console.log('Balance low - sent email');

  } else {

    console.log('Balance OK');

  }

}
