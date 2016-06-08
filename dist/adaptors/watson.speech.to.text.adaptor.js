'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WatsonSpeechToTextAdaptor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _microphone = require('../microphone');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var watsonSpeechRecognizer = require('watson-speech/speech-to-text/recognize-microphone');
var mic = new _microphone.Microphone();

var WatsonSpeechToTextAdaptor = exports.WatsonSpeechToTextAdaptor = function () {
  function WatsonSpeechToTextAdaptor(conf) {
    _classCallCheck(this, WatsonSpeechToTextAdaptor);

    this.tokenUrl = conf.watsonTokenUrl || '/api/speech-to-text/token';
    this.mic = mic;
  }

  _createClass(WatsonSpeechToTextAdaptor, [{
    key: 'adapt',
    value: function adapt(_ref) {
      var _this = this;

      var onStart = _ref.onStart;
      var onResult = _ref.onResult;
      var onError = _ref.onError;
      var onEnd = _ref.onEnd;

      return {
        start: function start() {
          var sub = _this._start({
            onStart: onStart, onResult: onResult, onError: onError, onEnd: onEnd
          });
          return {
            stop: function stop() {
              return sub.then(function (r) {
                return r.stop();
              });
            }
          };
        }
      };
    }
  }, {
    key: '_start',
    value: function _start(_ref2) {
      var _this2 = this;

      var onStart = _ref2.onStart;
      var onResult = _ref2.onResult;
      var onError = _ref2.onError;
      var onEnd = _ref2.onEnd;

      return new Promise(function (resolve) {
        _this2._requestToken().then(function (token) {
          var stream = watsonSpeechRecognizer({
            token: token,
            continuous: false, // false = automatically stop transcription the first time a pause is detected
            objectMode: true // send objects instead of text
          });

          onStart({});

          stream.on('error', function (err) {
            return onError(err);
          });

          stream.on('data', function (data) {
            var text = data.alternatives[0].transcript;
            var isFinal = data.final;
            onResult({ text: text, isFinal: isFinal });
          });

          resolve({
            stop: function stop() {
              stream.stop();
            }
          });
        }).catch(function (error) {
          onError({ error: error });
          resolve({
            stop: function stop() {}
          });
        });
      });
    }
  }, {
    key: '_requestToken',
    value: function _requestToken() {
      return (0, _isomorphicFetch2.default)(this.tokenUrl).then(function (response) {
        console.log('got response');
        return response.text();
      });
    }
  }, {
    key: 'isSupported',
    get: function get() {
      return this.mic.isSupported;
    }
  }]);

  return WatsonSpeechToTextAdaptor;
}();

//const streamAudioOptions = {
//  inputChannels: 1,
//  outputChannels: 1,
//  bufferSize: 8192,
//  // TODO are these below necessary?
//  // TODO set in configuration
//  currentModel: {
//    "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/en-US_BroadbandModel",
//    "rate": 16000,
//    "name": "en-US_BroadbandModel",
//    "language": "en-US",
//    "description": "US English broadband model."
//  },
//}
//class StreamAudio {
//  constructor({
//    onStart,
//    onResult,
//    onError,
//    onEnd
//    }) {
//    this._onStart = onStart;
//    this._onResult = onResult;
//    this._onError = onError;
//    this._onEnd = onEnd;
//
//    this.samplesAll = new Float32Array(20000000);
//    this.samplesAllOffset = 0;
//  }
//
//  stream(mediaStream) {
//    if (!this.isSupported) throw new Error('AudioContext not available');
//
//    const AudioContext = this._audioContext;
//    const audioContext = new AudioContext();
//
//    const gain = audioContext.createGain();
//    const audioInput = audioContext.createMediaStreamSource(mediaStream);
//    audioInput.connect(gain);
//
//    const micProcessor = audioContext.createScriptProcessor(
//      streamAudioOptions.bufferSize,
//      streamAudioOptions.inputChannels,
//      streamAudioOptions.outputChannels);
//
//    micProcessor.onaudioprocess = null; // TODO audio processing function
//
//    gain.connect(micProcessor);
//
//    this._onStart();
//  }
//
//  get isSupported() {
//    return !!(this.audioContext);
//  }
//
//  get _audioContext() {
//    return window.AudioContext || window.webkitAudioContext;
//  }
//
//  _onProcessAudio(data) {
//    const channel = data.inputBuffer.getChannelData(0);
//
//    // --- saveData
//    const samples = new Float32Array(chan)
//    for (let i = 0; i < samples.length; ++i) {
//      this.samplesAll[this.samplesAllOffset + i] = samples[i];
//    }
//    this.samplesAllOffset += samples.length;
//    console.log('samples: ' + this.samplesAllOffset);
//    // --- end saveData
//  }

//}