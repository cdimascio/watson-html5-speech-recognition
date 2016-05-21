var express = require('express'),
  router = express.Router(),
  vcapServices = require('vcap_services'),
  extend = require('util')._extend,
  watson = require('watson-developer-cloud');

var sttConfig = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: process.env.STT_USERNAME || 'bbcc2ac2-85fa-4e62-93df-4fc245549530', // '<your-username>'
  password: process.env.STT_PASSWORD || '3NLyQ1KOHpqm' //'<your-password>'
}, vcapServices.getCredentials('speech_to_text'));

var sttAuthService = watson.authorization(sttConfig);

router.get('/token', function(req, res) {
  sttAuthService.getToken({url: sttConfig.url}, function(err, token) {
    if (err) {
      console.log('Error retrieving token: ', err);
      res.status(500).send('Error retrieving token');
      return;
    }
    res.send(token);
  });
});

module.exports = router;
