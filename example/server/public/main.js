var Speech = require('watson-html5-speech-recognition');
var speech = new Speech.SpeechToText({
  watsonTokenUrl: '/api/speech-to-text/token'
});
window.SpeechToText = speech;
