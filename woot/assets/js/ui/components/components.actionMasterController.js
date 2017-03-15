// initialise
var Components = (Components || {});

// action master controller
Components.actionMasterController = function (name) {

	// components
	return UI.createComponent('', {name: name}).then(function (base) {

		// The idea here is that the master controller should point at the list of transcriptions and act on it.
		// The caption and the audio field should only operate on one transcription at a time,
		// and should have no knowledge of the series.
		// The master controller will communicate with the transcription list, confirm, release, and request new
		// transcriptions from the server.
		// The problem is, who decides how to load the audio files. Currently, the audio element does it by keeping a buffer in memory.

		// data
		base.buffer = [];

		// methods
		base.addAction = function (action) {
			var timestamp = new Date();
			action.index = base.buffer.length;
			action.time = timestamp.toString();
			action.millis = timestamp.getMilliseconds().toString();
			action.context = name;
			base.buffer.push(action);
		}
		base.action = {
			period: 10000,
			length: 50,
			id: undefined,
			main: function () {
				Request.submit_actions(base.buffer.slice(Math.max(base.buffer.length-base.action.length, 0)));
			},
			start: function () {
				var _this = base;
				if (_this.action.id === undefined) {
					_this.action.id = setInterval(_this.action.main, _this.action.period);
				}
			},
			stop: function () {
				var _this = base;
				if (_this.action.id !== undefined) {
					clearInterval(_this.action.id);
				}
			},
		}

		return Promise.all([

		]).then(function () {
			return base;
		});
	});
}
