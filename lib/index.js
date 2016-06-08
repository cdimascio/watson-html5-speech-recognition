import {WebKitSpeechToTextAdaptor} from './adaptors/webkit.speech.to.text.adaptor';
import {WatsonSpeechToTextAdaptor} from './adaptors/watson.speech.to.text.adaptor';
const noOp = () => {};

export class SpeechToText {
  constructor(conf) {
    this.webkitSpeechAdaptor = new WebKitSpeechToTextAdaptor();
    this.watsonSpeechAdaptor = new WatsonSpeechToTextAdaptor(conf);
  }

  get isSupported() {
    return this.webkitSpeechAdaptor.isSupported || this.watsonSpeechAdaptor.isSupported
  }
  listen({
    onStart,
    onResult,
    onError,
    onEnd
    }) {
    onStart = onStart ? onStart : noOp;
    onResult = onResult ? onResult : noOp;
    onError = onError ? onError : noOp;
    onEnd = onEnd ? onEnd : noOp;

    let stt;
    if (this.webkitSpeechAdaptor.isSupported) {
      stt = this.webkitSpeechAdaptor.adapt({onStart, onResult, onError, onEnd});
    } else {
      stt = this.watsonSpeechAdaptor.adapt({onStart, onResult, onError, onEnd});
    }
    return stt.start();
  }
}