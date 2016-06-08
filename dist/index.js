'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpeechToText = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webkitSpeechToText = require('./adaptors/webkit.speech.to.text.adaptor');

var _watsonSpeechToText = require('./adaptors/watson.speech.to.text.adaptor');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noOp = function noOp() {};

var SpeechToText = exports.SpeechToText = function () {
  function SpeechToText(conf) {
    _classCallCheck(this, SpeechToText);

    this.webkitSpeechAdaptor = new _webkitSpeechToText.WebKitSpeechToTextAdaptor();
    this.watsonSpeechAdaptor = new _watsonSpeechToText.WatsonSpeechToTextAdaptor(conf);
  }

  _createClass(SpeechToText, [{
    key: 'listen',
    value: function listen(_ref) {
      var onStart = _ref.onStart;
      var onResult = _ref.onResult;
      var onError = _ref.onError;
      var onEnd = _ref.onEnd;

      onStart = onStart ? onStart : noOp;
      onResult = onResult ? onResult : noOp;
      onError = onError ? onError : noOp;
      onEnd = onEnd ? onEnd : noOp;

      var stt = void 0;
      if (this.webkitSpeechAdaptor.isSupported) {
        stt = this.webkitSpeechAdaptor.adapt({ onStart: onStart, onResult: onResult, onError: onError, onEnd: onEnd });
      } else {
        stt = this.watsonSpeechAdaptor.adapt({ onStart: onStart, onResult: onResult, onError: onError, onEnd: onEnd });
      }
      return stt.start();
    }
  }, {
    key: 'isSupported',
    get: function get() {
      return this.webkitSpeechAdaptor.isSupported || this.watsonSpeechAdaptor.isSupported;
    }
  }]);

  return SpeechToText;
}();