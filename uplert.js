const r2 = require("r2");
const aws = require('aws-sdk');
require('dotenv').config()

// const url = `https://api.up.com.au/api/v1/accounts/${process.env.UP_ACCOUNT_ID}`

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

aws.config.update({
  accessKeyId: process.env.UPLERT_AWS_KEY,
  secretAccessKey: process.env.UPLERT_AWS_SECRET,
  region: process.env.UPLERT_AWS_REGION
});

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
  
const alertLowBalance = async () => {
  const account = await getUpAccount(process.env.UP_ACCOUNT_ID);
  let balance = account.attributes.balance.value;
  if (balance < minBalance) {
    subject = 'Up Bank balance is low (Uplert)'
    email = process.env.UPLERT_EMAIL; // both sender and receiver
    message = `Hey, this is your friendly Uplert here.
      
      Your Up Bank balance is low: $${balance}.
    
      Take care!`.replace(/  +/g, '');

    await sendEmail(subject, message, email, email);

    console.log('Balance low - sent email');

  } else {

    console.log('Balance OK');

  }
}

//////////////////////////////////////////////////////////////////////////////
// RUN FROM COMMAND-LINE
//////////////////////////////////////////////////////////////////////////////

(async() => {
  alertLowBalance();
})();
