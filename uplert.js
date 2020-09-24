const r2 = require("r2");
const aws = require('aws-sdk');
const path = require('path')
const { I18n } = require('i18n')

const i18n = new I18n({
  locales: ['en'],
  directory: path.join(__dirname, 'locales')
})

//////////////////////////////////////////////////////////////////////////////
// GENERIC AWS
//////////////////////////////////////////////////////////////////////////////

const setupAWS = (config) => {
  aws.config.update({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret,
    region: config.aws.region
  });
}

//////////////////////////////////////////////////////////////////////////////
// GENERIC HTTP
//////////////////////////////////////////////////////////////////////////////

const httpGet = async (url, headers) => {
  try {
    const response = await r2(url, {headers}).json;
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//////////////////////////////////////////////////////////////////////////////
// GENERIC UP BANK APIs
//////////////////////////////////////////////////////////////////////////////

const getUp = async (config, path) => {
  const url = `https://api.up.com.au/api/v1/${path}`
  const data = await httpGet(url, {'Authorization': config.upbank.key});
  return data;
};

const getUpAccount = async (config, id) => {
  const account = await getUp(config, `/accounts/${id}`);
  return account;
}

//////////////////////////////////////////////////////////////////////////////
// GENERIC AWS API
//////////////////////////////////////////////////////////////////////////////

const sendEmail = async (subject, message, fromEmail, toEmail) => {

  const ses = new aws.SES({apiVersion: '2010-12-01'});

  const params = {
    Source: `Uplert <${fromEmail}>`,
    Destination: {
      ToAddresses: [toEmail]
    },
    //ConfigurationSetName: <<ConfigurationSetName>>,
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: message,
        }
      },
    },
    Source: fromEmail
  };

  const sesSendEmail = ses.sendEmail(params).promise();

  sesSendEmail
    .then(data => {
      console.log("Email submitted to SES", data);
    })
    .catch(error => {
      console.log(error);
    });

}

//////////////////////////////////////////////////////////////////////////////
// PAYMENTS
//////////////////////////////////////////////////////////////////////////////

const alertLowBalance = async (config) => {

  id = process.env.UP_ACCOUNT_ID;
  const account = await getUpAccount(config, id);
  let balance = account.attributes.balance.value;
  if (balance < config.minimumBalance) {

    subject = 'Up Bank balance is low';
    email = config.email; // assume sender and receiver is same for now
    message = i18n.__('lowBalanceMailBody', { balance: balance });

    await sendEmail(subject, message, config.email, config.email);
    console.log('Balance low - sent email');

  } else {

    console.log('Balance OK');

  }
}

//////////////////////////////////////////////////////////////////////////////
// RUN FROM COMMAND-LINE
//////////////////////////////////////////////////////////////////////////////

(async() => {
  const config = require('config');
  setupAWS(config);
  alertLowBalance(config);
})();
