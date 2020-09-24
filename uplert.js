const r2 = require("r2");
const aws = require('aws-sdk');
require('toml');

// const url = `https://api.up.com.au/api/v1/accounts/${process.env.UP_ACCOUNT_ID}`

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

const getUp = async (path) => {
  const url = `https://api.up.com.au/api/v1/${path}`
  const data = await httpGet(url, {'Authorization': process.env.UP_KEY});
  return data;
};

const getUpAccount = async (id) => {
  const account = await getUp(`/accounts/${id}`);
  return account;
}

//////////////////////////////////////////////////////////////////////////////
// GENERIC AWS API
//////////////////////////////////////////////////////////////////////////////

const sendEmail = async (subject, message, fromEmail, toEmail) => {

  const ses = new aws.SES({apiVersion: '2010-12-01'});

  const params = {
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

let minBalance = 2000;
  
const alertLowBalance = async (config) => {
  console.log(aws.config);
  const account = await getUpAccount(process.env.UP_ACCOUNT_ID);
  let balance = account.attributes.balance.value;
  if (balance < minBalance) {
    subject = 'Up Bank balance is low (Uplert)'
    email = process.env.UPLERT_EMAIL; // both sender and receiver
    message = `Hey, this is your friendly Uplert here.
      
      Your Up Bank balance is low: $${balance}.
    
      Take care!`.replace(/  +/g, '');

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
