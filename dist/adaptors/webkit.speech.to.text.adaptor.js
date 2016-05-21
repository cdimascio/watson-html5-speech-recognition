'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebKitSpeechToTextAdaptor = exports.WebKitSpeechToTextAdaptor = function () {
  function WebKitSpeechToTextAdaptor() {
    _classCallCheck(this, WebKitSpeechToTextAdaptor);
  }

  _createClass(WebKitSpeechToTextAdaptor, [{
    key: 'adapt',
    value: function adapt(_ref) {
      var onStart = _ref.onStart;
      var onResult = _ref.onResult;
      var onError = _ref.onError;
      var onEnd = _ref.onEnd;

      var recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = function (event) {
        onStart(event);
      };
      recognition.onresult = function (event) {
        // TODO should we end close the recogizer if isFinal is true?
        var text = '';
        var isFinal = false;
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
          isFinal = event.results[i].isFinal;
        }
        onResult({
          text: text,
          isFinal: isFinal
        });
      };
      recognition.onerror = function (error) {
        onError({ error: error });
      };
      recognition.onend = function (event) {
        onEnd(event);
      };

      return {
        start: function start() {
          recognition.start();
          return {
            stop: function stop() {
              recognition.stop();
            }
          };
        }
      };
    }
  }, {
    key: 'isSupported',
    get: function get() {
      return window.webkitSpeechRecognition;
    }
  }]);

  return WebKitSpeechToTextAdaptor;
}();