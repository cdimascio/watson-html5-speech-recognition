navigator.getUserMedia  = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

export class Microphone {
  get isSupported() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  activate() {
    if (!navigator.getUserMedia) {
      return Promise.reject({
        error: 'not supported'
      });
    } else {

    }
    return new Promise((resolve, reject) => {
      navigator.getUserMedia(
        { audio: true },
        stream => resolve(stream),
        error => reject({error}));
    });
  }
}
