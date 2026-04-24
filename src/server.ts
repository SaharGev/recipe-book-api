import initApp from "./app";
import https from 'https';
import http from 'http';
import fs from 'fs';

initApp().then((app) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    http.createServer(app).listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } else {
    console.log('PRODUCTION');
    const options = {
      key: fs.readFileSync('../client-key.pem'),
      cert: fs.readFileSync('../client-cert.pem')
    };
    https.createServer(options, app).listen(process.env.HTTPS_PORT, () => {
      console.log(`HTTPS Server running on port ${process.env.HTTPS_PORT}`);
    });
  }
});