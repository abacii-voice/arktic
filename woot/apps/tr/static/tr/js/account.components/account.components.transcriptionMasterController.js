// initialise
var AccountComponents = (AccountComponents || {});

// counter
AccountComponents.transcriptionMasterController = function () {

	// components
	return Promise.all([
		UI.createComponent('', {}),
	]).then(function (components) {
		// unpack components
		var [
			base,
		] = components;

		// methods

		// The idea here is that the master controller should point at the list of transcriptions and act on it.

		// The caption and the audio field should only operate on one transcription at a time,
		// and should have no knowledge of the series.

		// The master controller will communicate with the transcription list, confirm, release, and request new
		// transcriptions from the server.

		// The problem is, who decides how to load the audio files. Currently, the audio element does it by keeping a buffer in memory.
		

		return Promise.all([

		]).then(function () {
			return base
		});
	});
}
