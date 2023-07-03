import { ImapFlow } from 'imapflow';
import mongoose from 'mongoose';
import { UserShema } from '../mongoShema/userSchema';
const simpleParser = require('mailparser').simpleParser;

const User = mongoose.model('Users', UserShema);
const FindUser = mongoose.model('Users');

export const imapRoute = (app) => {
  app.route('/api/imap/login').post(async (req, res) => {
    const { host, port, email, password } = req.body;

    const currentUser = {
      email: email,
      name: email,
    };

    let newUser = new User(currentUser);

    const client = new ImapFlow({
      host: host,
      port: port,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    await client.connect().catch((error) => res.send(error));

    try {
      //const lock = await client.getMailboxLock('INBOX');
      // const messageSource = await client.fetchOne(client.mailbox.exists, {
      //   source: true,
      // });

      const userExist = await FindUser.findOne({ email: email });

      if (userExist) {
        req.session.user = {
          id: userExist._id,
          name: userExist.name,
          email: userExist.email,
          host: host,
          port: port,
          tls: true,
          password: password,
        };
        res.json({ email: email, name: email });
      } else {
        req.session.user = {
          name: email,
          email: email,
          host: host,
          port: port,
          tls: true,
          password: password,
        };
        newUser.save().then((user) => {
          res.json({ name: user.name, email: user.email });
        });
      }
    } catch (error) {
      console.log('🚀 ~ file: imapRoute.js:34 ~ app.route ~ error:', error);
    }

    await client.logout();
  });

  app.route('/api/imap/emails').get(async (req, res) => {
    const { email, password, host, port } = req.session.user;
    const emails = [];
    const client = new ImapFlow({
      host: host,
      port: port,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    await client.connect().catch((error) => res.send(error));

    let lock = await client.getMailboxLock('INBOX');

    try {
      for await (let message of client.fetch('1:*', {
        envelope: true,
        source: true,
        uid: true,
      })) {
        let parsed = await simpleParser(message.source);
        emails.push({
          uid: message.uid,
          subject: message.envelope.subject,
          sender: message.envelope.from[0].address,
          date: message.envelope.date,
          content: parsed.text,
        });
      }
    } finally {
      lock.release();
    }
    client.logout();
    res.json(emails);
  });
};
