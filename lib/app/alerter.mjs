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

export async function alertLowBalance(config, account) {

  const attribs = account.attributes;
  const status = { account: attribs.displayName, balance: attribs.balance.value };

  if (status.balance < config.minimumBalance) {

    const email = config.email; // assume sender and receiver is same for now
    const subject = config.i18n.__('lowBalanceMailSubject', status);
    const message = config.i18n.__('lowBalanceMailBody', status);

    await emailer.send(config.aws, subject, message, config.email, config.email);
    console.log('Balance low - sent email');

  } else {

    console.log('Balance OK');

  }

}
