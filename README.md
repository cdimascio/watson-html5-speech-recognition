# watson-html5-speech-recognition

A Library to provide speech recognition capability in browsers.

## Support
The library enables speech recognition support for any browser that includes support for either:

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) **or**
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) + [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia) support

If the browser does not support either of the above, then currently you're out of luck.


watson-html5-speech-recognition use Web Speech API when present and Watson Speech To Text service for all other (supported) cases.

Currently, the following are supported:

- Webkit speech recognition
	- Chrome (33)
	- FireFox (>=44)
	
- Watson Speech to Text
	- Microsoft Edge
	- Firefox (<44)
	- Opera

## Prequisites

1. An instance of [Watson Speech To Text Service](https://console.ng.bluemix.net/catalog/services/speech-to-text/) (requires a [Bluemix](http://www.bluemix.net) account)
2. Watson Speech to Text Websocket server (provided. see **Example** section below)


## Install

```shell
npm install watson-html5-speech-recognition
```

## Usage
```javascript
var Speech = require('watson-html5-speech-recognition');
var speech = new Speech.SpeechToText();

speech.listen({
    onStart: function() {
        console.log('starting');
    },
    onResult: function(e) {
        console.log(e.text);
    },
    onError: function(e) {
        console.log('error', e);
    },
    onEnd: function(e) {
        console.log('end', e);
    }
});
```

## Customized Usage
If Watson speech services are engaged, the watson-html5-speech-recognition request a token from the server then communicates via websocket. 

By default, watson-html5-speech-recognition assumes the token endpoint exists at `/api/speech-to-text/token`. If you alter the location of that endpoint, you must supply the new location via a configuration parameter upon instantiation. Like so...

```javascript
var Speech = require('watson-html5-speech-recognition');
var speech = new Speech.SpeechToText({
  watsonTokenUrl: `/path/to/my/speech-to-text/token`
});
```

**NOTE:** The example server uses the `watson-developer-cloud` npm package to configure the token endpoint (see `example/server/stt-token.js`).

## Example
The example contains a simple web front end, along with a backend web socket server that communicates with the Watson Speech To Text service

### Setup the example
Clone the example:

```shell
git clone https://github.com/cdimascio/watson-html5-speech-recognition
```

Navigate to the example root:

```shell
cd example/server
```

Install dependencies:

```shell
npm install
```

Build the example:

```shell
npm compile
```

### Run the example:

First, be sure to complete all steps in the section above, "Setup the example"

Then,

Open `stt-token.js` to line 10 

Set `'<your-username>'` and `'<your-username>'` to match your [Watson Speech To Text Service](https://console.ng.bluemix.net/catalog/services/speech-to-text/) credentials.

```shell
npm start
```

Try it:

- Navigate to [http://localhost:3000](http://localhost:3000)
- Click the 'mic' button
- Speak


## License

Apache 2.0
