// initialise
var AccountComponents = (AccountComponents || {});

// transcription master controller
AccountComponents.transcriptionMasterController = function () {

	// components
	return UI.createComponent('transcription-master-controller', {name: 'transcriptionMasterController'}).then(function (base) {

		// The idea here is that the master controller should point at the list of transcriptions and act on it.
		// The caption and the audio field should only operate on one transcription at a time,
		// and should have no knowledge of the series.
		// The master controller will communicate with the transcription list, confirm, release, and request new
		// transcriptions from the server.
		// The problem is, who decides how to load the audio files. Currently, the audio element does it by keeping a buffer in memory.

		base.active = 0;
		// methods
		base.data = {
			tokenSize: 0, // number of fragments in a transcription token
			updateThreshold: 4, // default
			releaseThreshold: 20, // if buffer expands beyond this, previous revisions will not be re-sent. The counter will also reset.
			totalRemaining: 0, // number of avaiable transcriptions in the project as of the loading of the latest transcription token.
			buffer: {},
			countRemaining: function () {
				var _this = base;
				return Promise.all([
					Util.ep(Object.keys(_this.data.buffer).filter(function (key) {
						return _this.data.buffer[key].is_available;
					}).length),
					Util.ep(Object.keys(_this.data.buffer).filter(function (key) {
						return _this.data.buffer[key].isPending;
					}).length),
					Util.ep(Object.keys(_this.data.buffer).filter(function (key) {
						return _this.data.buffer[key].isComplete;
					}).length),
				]);
			},
			current: function () {
				var _this = base;
				var storageId = Object.keys(_this.data.buffer).filter(function (key) {
					return _this.data.buffer[key].index === _this.active;
				})[0];
				return Util.ep(_this.data.buffer[storageId]);
			},
			update: function () {
				var _this = base;
				// 1. if the buffer is completely empty, the audio element must wait before attempting to load the audio.
				// 2. active_transcription_token is not "active". It should change each time it is requested, unless the page is reloaded.

				return _this.data.countRemaining().then(function (remaining) {
					var [countAvailable, countPending, countComplete] = remaining;
					if (countAvailable === 0) {
						// this should force a load. If the result is negative, this should be displayed clearly in the interface
						return _this.data.loadFromTranscriptionToken().then(function (transcriptionsAvailable) {
							return _this.pre.main().then(function () {
								if (countPending || transcriptionsAvailable || (Object.keys(_this.data.buffer).length === 1 && _this.active === 0)) {
									return _this.enterActiveState();
								} else {
									return _this.data.loadProjectTotal().then(function () {
										return _this.enterCompletionState();
									});
								}
							});
						});
					} else if (countAvailable < _this.data.updateThreshold) {
						return Promise.all([
							_this.enterActiveState(),
							_this.data.loadFromTranscriptionToken(),
							_this.pre.main(),
						]);
					} else {
						return Promise.all([
							_this.enterActiveState(),
							_this.pre.main(),
						]);
					}
				});
			},
			loadFromTranscriptionToken: function () {
				var _this = base;
				// load more and process into buffer
				return _this.path().then(function (tokenPath) {
					return Context.get(tokenPath, {force: true, overwrite: true});
				}).then(_this.process).then(function (transcriptionsAvailable) {
					return Util.ep(transcriptionsAvailable);
				});
			},
			loadProjectTotal: function () {
				return Promise.all([
					Active.get('client'),
					Active.get('role'),
				]).then(function (results) {
					var [clientId, roleId] = results;
					return Context.get(`user.clients.${clientId}.roles.${roleId}.project_transcriptions`, {force: true});
				});
			},
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
				var lower = _this.active > 1 ? _this.active - _this.data.updateThreshold + 2 : 0;
				var upper = _this.active > 1 ? _this.active + _this.data.updateThreshold - 1 : _this.data.updateThreshold + 1;
				_this.indices = [];
				for (i=lower; i<upper; i++) {
					_this.indices.push(i);
				}

				// once the indices have been chosen, load the audio file for each one.
				return Promise.all(_this.indices.map(function (index) {
					var transcriptionId = Object.keys(_this.data.buffer).filter(function (key) {
						return _this.data.buffer[key].index === index;
					})[0];
					if (transcriptionId) {
						var storage = _this.data.buffer[transcriptionId];
						if (storage.data === undefined) {
							return AccountRequest.load_audio(storage.parent).then(function (audioData) {
								storage.data = audioData;
								return Util.ep();
							});
						}
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
				return Promise.all(Object.keys(_this.data.buffer).filter(function (key) {
					return _this.indices.indexOf(_this.data.buffer[key].index) === -1;
				}).map(function (key) {
					var removeBuffer = _this.data.buffer[key];
					if (removeBuffer.source !== undefined) {
						removeBuffer.source.disconnect();
						removeBuffer.isLoaded = false;
						delete removeBuffer.source;
						delete removeBuffer.waveform;
					}
				}));
			},
		}
		base.setPending = function () {
			return base.data.current().then(function (current) {
				if (current) {
					current.isPending = true;
					current.isComplete = false;
				}
				return Util.ep();
			});
		}
		base.previous = function () {
			return base.setActive({increment: -1});
		}
		base.next = function () {
			return base.setActive({increment: 1});
		}
		base.enterActiveState = function () {
			if (!base.is_active) {
				base.is_active = true;
				return UI.changeState('-transcription-project-active-state', base.id);
			}
		}
		base.enterCompletionState = function () {
			// set project as completed
			base.is_active = false;
			return UI.changeState('-transcription-project-complete-state', base.id);
		}
		base.revision = {
			period: 5000,
			id: undefined,
			main: function () {
				var _this = base;

				var i, transcriptions = [], bufferKeys = Object.keys(_this.data.buffer);
				for (i=0; i<bufferKeys.length; i++) {
					var bufferTranscription = _this.data.buffer[bufferKeys[i]];
					var isBeforeThreshold = bufferTranscription.index < bufferKeys.length - _this.data.releaseThreshold;
					transcriptions.push({
						parent: bufferTranscription.parent,
						id: bufferKeys[i],
						revisions: bufferTranscription.revisions,
						release: isBeforeThreshold,
					});
				}
				AccountRequest.submit_revisions(transcriptions);
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
					clearInterval(_this.revision.id);
					_this.revision.id = undefined;
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
