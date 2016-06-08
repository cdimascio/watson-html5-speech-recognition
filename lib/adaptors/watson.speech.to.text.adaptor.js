import fetch from 'isomorphic-fetch'
import {Microphone} from '../microphone';
const watsonSpeechRecognizer = require('watson-speech/speech-to-text/recognize-microphone');
const mic = new Microphone();

export class WatsonSpeechToTextAdaptor {
  constructor(conf) {
    this.tokenUrl = conf.watsonTokenUrl || '/api/speech-to-text/token';
    this.mic = mic;
  }
  get isSupported() {
    return this.mic.isSupported;
  }

  adapt({
    onStart,
    onResult,
    onError,
    onEnd
    }) {
    return {
      start: () => {
        const sub = this._start({
          onStart, onResult, onError, onEnd
        });
        return {
          stop: () => sub.then(r => r.stop())
        };
      }
    };
  }

  _start({
    onStart,
    onResult,
    onError,
    onEnd
    }) {
    return new Promise((resolve) => {
      this._requestToken()
        .then(token => {
          const stream = watsonSpeechRecognizer({
            token: token,
            continuous: false, // false = automatically stop transcription the first time a pause is detected
            objectMode: true // send objects instead of text
          });

          onStart({});

          stream.on('error', err => onError(err));

          stream.on('data', data => {
            const text = data.alternatives[0].transcript;
            const isFinal = data.final;
            onResult({text, isFinal});
          });

          resolve({
            stop() {
              stream.stop();
            }
          });
        })
        .catch(error => {
          onError({ error });
          resolve({ stop() {} });
        });
    });
  }

  _requestToken() {
    return fetch(this.tokenUrl)
      .then(response => {
        console.log('got response');
        return response.text();
      });
  }
}

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
