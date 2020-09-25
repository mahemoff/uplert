const aws = require('aws-sdk');

async function send(awsConfig, subject, message, fromEmail, toEmail) {

  aws.config.update({
    accessKeyId: awsConfig.key,
    secretAccessKey: awsConfig.secret,
    region: awsConfig.region
  });

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

module.exports = { send };
