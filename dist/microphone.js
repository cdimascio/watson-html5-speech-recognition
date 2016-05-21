'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var Microphone = exports.Microphone = function () {
  function Microphone() {
    _classCallCheck(this, Microphone);
  }

  _createClass(Microphone, [{
    key: 'activate',
    value: function activate() {
      if (!navigator.getUserMedia) {
        return Promise.reject({
          error: 'not supported'
        });
      } else {}
      return new Promise(function (resolve, reject) {
        navigator.getUserMedia({ audio: true }, function (stream) {
          return resolve(stream);
        }, function (error) {
          return reject({ error: error });
        });
      });
    }
  }, {
    key: 'isSupported',
    get: function get() {
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }
  }]);

  return Microphone;
}();