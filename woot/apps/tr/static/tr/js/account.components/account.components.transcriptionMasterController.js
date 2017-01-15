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

		// The idea here is that the master controller should point at the list of transcriptions and act on it.
		// The caption and the audio field should only operate on one transcription at a time,
		// and should have no knowledge of the series.
		// The master controller will communicate with the transcription list, confirm, release, and request new
		// transcriptions from the server.
		// The problem is, who decides how to load the audio files. Currently, the audio element does it by keeping a buffer in memory.

		// data
		base.buffer = {};
		base.active = 0;
		base.updateThreshold = 4; // default
		base.releaseThreshold = 50; // if buffer expands beyond this, previous revisions will not be re-sent.

		// methods
		base.countRemaining = function () {
			var _this = base;
			return Util.ep(Object.keys(_this.buffer).filter(function (key) {
				return _this.buffer[key].is_available;
			}).length);
		}
		base.current = function () {
			var _this = base;
			var storageId = Object.keys(_this.buffer).filter(function (key) {
				return _this.buffer[key].index === _this.active;
			})[0];
			return Util.ep(_this.buffer[storageId]);
		}
		base.update = function () {
			var _this = base;
			// 1. if the buffer is completely empty, the audio element must wait before attempting to load the audio.
			// 2. active_transcription_token is not "active". It should change each time it is requested, unless the page is reloaded.

			return _this.countRemaining().then(function (remaining) {
				if (remaining === 0) {
					// this should force a load. If the result is negative, this should be displayed clearly in the interface
					return _this.loadFromTranscriptionToken().then(function (transcriptionsAvailable) {
						if (transcriptionsAvailable) {
							return _this.pre.main();
						} else {
							return _this.enterCompletionState();
						}
					})
				} else if (remaining < _this.updateThreshold) {
					return Promise.all([
						_this.loadFromTranscriptionToken({force: true}),
						_this.pre.main(),
					]);
				} else {
					return _this.pre.main();
				}
			});
		}
		base.loadFromTranscriptionToken = function (options) {
			options = (options || {});
			var _this = base;
			// load more and process into buffer
			return _this.path().then(function (tokenPath) {
				return Context.get(tokenPath, {force: (options.force || false), overwrite: true});
			}).then(_this.process).then(function () {
				return Util.ep(_this.buffer);
			});
		}
		base.pre = {
			main: function () {
				var _this = base.pre;
				return _this.loadAudio().then(function () {
					return _this.interface();
				}).then(function () {
					return _this.garbageCollect();
				});
			},
			loadAudio: function () {
				// decides a range of transcriptions and their audio to load from the server.
				var _this = base;
				// determine which audio elements to load
				// load n either side of active index.
				var lower = _this.active > 1 ? _this.active - _this.updateThreshold + 2 : 0;
				var upper = _this.active > 1 ? _this.active + _this.updateThreshold - 1 : _this.updateThreshold + 1;
				_this.indices = [];
				for (i=lower; i<upper; i++) {
					_this.indices.push(i);
				}

				// once the indices have been chosen, load the audio file for each one.
				return Promise.all(_this.indices.map(function (index) {
					var transcriptionId = Object.keys(_this.buffer).filter(function (key) {
						return _this.buffer[key].index === index;
					})[0];
					var storage = _this.buffer[transcriptionId];
					if (storage.data === undefined) {
						return Request.load_audio(storage.parent).then(function (audioData) {
							storage.data = audioData;
							return Util.ep();
						});
					}
				}));
			},
			interface: function () {
				// assumed to be external. default pass-through, but delegates data to connected audio field, counter, and caption.
				return Util.ep();
			},
			garbageCollect: function () {
				var _this = base;
				// remove data from all indices not in the chosen array.
				return Promise.all(Object.keys(_this.buffer).filter(function (key) {
					return _this.indices.indexOf(_this.buffer[key].index) === -1;
				}).map(function (key) {
					var removeBuffer = _this.buffer[key];
					if (removeBuffer.source !== undefined) {
						removeBuffer.source.disconnect();
						removeBuffer.has_waveform = false;
						delete removeBuffer.source;
						delete removeBuffer.waveform;
					}
				}));
			},
		}
		base.previous = function () {
			return base.setActive({increment: -1});
		}
		base.next = function () {
			return base.setActive({increment: 1});
		}
		base.revision = {
			period: 5000,
			id: undefined,
			main: function () {
				var _this = base;

				var i, j, transcriptions = [], bufferKeys = Object.keys(_this.buffer);
				for (i=0; i<bufferKeys.length; i++) {
					var bufferTranscription = _this.buffer[bufferKeys[i]];
					var isBeforeThreshold = bufferTranscription.index < bufferKeys.length - _this.releaseThreshold;
					transcriptions.push({
						parent: bufferTranscription.parent,
						id: bufferKeys[i],
						revisions: bufferTranscription.revisions,
						release: isBeforeThreshold,
					});
				}
				Request.submit_revisions(transcriptions);
			},
			start: function () {
				var _this = base;
				if (_this.revision.id === undefined) {
					_this.revision.id = setInterval(_this.revision.main, _this.revision.period);
				}
			},
			stop: function () {
				var _this = base;
				if (_this.revision.id !== undefined) {
					cancelInterval(_this.revision.id);
				}
			},
		}

		// behaviours
		base.behaviours = {
			up: function () {
				return base.previous();
			},
			down: function () {
				return base.next();
			},
		}

		return Promise.all([

		]).then(function () {
			return base
		});
	});
}
