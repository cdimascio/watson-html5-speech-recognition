'use strict';
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const port = process.env.PORT || 3000;
const app = express();

app.use(compression());
app.set('port', port);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/api/speech-to-text/', require('./stt-token.js'));

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

if (!process.env.VCAP_APP_PORT) {
  var fs = require('fs'),
    https = require('https'),
    HTTPS_PORT = 3001;

  var options = {
    key: fs.readFileSync(__dirname + '/keys/localhost.pem'),
    cert: fs.readFileSync(__dirname + '/keys/localhost.cert')
  };
  https.createServer(options, app).listen(HTTPS_PORT, function() {
    console.log('Secure server live at https://localhost:%s/', HTTPS_PORT);
  });
}
