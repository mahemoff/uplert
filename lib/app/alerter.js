//////////////////////////////////////////////////////////////////////////////
// IMPORTS
//////////////////////////////////////////////////////////////////////////////

const path = require('path');
const { I18n } = require('i18n');

const upBank = require('../util/upBank');
const emailer = require('../util/emailer');

const i18n = new I18n({
  locales: ['en'],
  directory: path.join(__dirname, 'locales')
})

//////////////////////////////////////////////////////////////////////////////
// LOGIC
//////////////////////////////////////////////////////////////////////////////

const alertLowBalance = async (config) => {

  id = process.env.UP_ACCOUNT_ID;
  const account = await upBank.getAccount(config, id);
  let balance = account.attributes.balance.value;
  if (balance < config.minimumBalance) {

    subject = 'Up Bank balance is low';
    email = config.email; // assume sender and receiver is same for now
    message = i18n.__('lowBalanceMailBody', { balance: balance });

    await emailer.send(config.aws, subject, message, config.email, config.email);
    console.log('Balance low - sent email');

  } else {

    console.log('Balance OK');

  }
}

//////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////

module.exports = { alertLowBalance };
