// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

export const sendEmail = (message, { host, port, user, pass }) => {
  if (!host || !port || !user || !pass) {
    console.log('The Mailbox Configuration Is Incorrect And The Email Cannot Be Sent');
    return null;
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    // secureConnection: true,
    secure: false,
    auth: {
      user,
      pass,
    },
  });

  return new Promise((resolve, reject) => {
    transport.sendMail(message, function(err, info) {
      if (err) {
        console.log('Failed To Send Email', err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
