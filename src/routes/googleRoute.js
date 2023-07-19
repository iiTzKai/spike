import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URIS = 'http://localhost:5000/oauth2callback';

const oAuthClient = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URIS,
);

let accessToken = null;

export const googleRoute = (app) => {
  app.get('/googleAuth', (req, res) => {
    const authUrl = oAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/gmail.readonly',
      ],
    });

    res.redirect(authUrl);
  });

  app.get('/oauth2callback', (req, res) => {
    const code = req.query.code;
    oAuthClient.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token:', err);
        return res.status(500).send('Error retrieving access token');
      }
      accessToken = token;
      res.redirect('/');
    });
  });

  app.get('/api/getgoogleuserinfo', async (req, res) => {
    try {
      oAuthClient.setCredentials(accessToken);
      const people = google.people({ version: 'v1', auth: oAuthClient });
      const userInfo = await people.people.get({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses,genders,birthdays',
      });

      res.send(userInfo.data);
    } catch (error) {
      res.status(500).send('Error retrieving user information');
    }
  });

  app.get('/api/google/getemails', async (req, res) => {
    const emailContent = [];
    oAuthClient.setCredentials(accessToken);
    try {
      const gmail = google.gmail({ version: 'v1', auth: oAuthClient });
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 15,
      });

      const emails = response.data.messages;

      for (const email of emails) {
        const message = await gmail.users.messages.get({
          userId: 'me',
          id: email.id,
        });

        const headers = message.data.payload.headers;
        const subject = headers.find(
          (header) => header.name === 'Subject',
        ).value;
        const sender = headers.find((header) => header.name === 'From').value;
        const date = headers.find((header) => header.name === 'Date').value;
        const emailRegex = /<([^>]+)>/;
        const matches = sender.match(emailRegex);

        emailContent.push({
          subject: subject,
          sender: matches ? matches[1] : null,
          date: date,
          content: null,
          uid: message.data.id,
        });

        const parts = message.data.payload.parts;
        if (parts && parts.length > 0) {
          const body = parts[0].body;
          const decodedBody = Buffer.from(body.data, 'base64').toString();
          const index = emailContent.length - 1;
          emailContent[index].content = decodedBody;
        }
      }

      res.json(emailContent);
    } catch (error) {
      console.log('🚀 ~ file: googleRoute.js:65 ~ app.get ~ error:', error);
    }
  });
};
