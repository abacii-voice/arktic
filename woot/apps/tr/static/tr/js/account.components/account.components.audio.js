
// initialise
var AccountComponents = (AccountComponents || {});

// audio
AccountComponents.audio = function (id, args) {
	//////////// AUDIO PLAYER
	// Plays audio given a source
	// Has a buffer for storing multiple tracks and cycling between them.
	// Parts:
	// 1. Play button
	// 2. Audio track

	// components
	return Promise.all([
		// create the base component and add the children from above.
		UI.createComponent('{id}-audio'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: args.appearance,
		}),

		// play button
		UI.createComponent('{id}-play-button'.format({id: id}), {
			name: 'playButton',
			template: UI.template('div', 'ie button border abs'),
			appearance: {
				style: {
					'height': args.appearance.style.height,
					'width': args.appearance.style.height,
					'top': '0px',
					'left': '0px',
					'border-radius': '5px',
				},
			},
		}),

		// AUDIO GROUP
		// audio wrapper
		UI.createComponent('{id}-audio-wrapper'.format({id: id}), {
			name: 'audioWrapper',
			template: UI.template('div', 'ie abs border'),
			appearance: {
				style: {
					'border-left': '0px',
					'height': '100%',
					'width': 'calc(100% - {height}px)'.format({height: parseInt(args.appearance.style.height) - 5}),
					'left': '{px}px'.format({px: parseInt(args.appearance.style.height) - 5}),
					'border-top-right-radius': '5px',
					'border-bottom-right-radius': '5px',
				},
			},
		}),

		// audio track wrapper
		UI.createComponent('{id}-audio-track-wrapper'.format({id: id}), {
			name: 'audioTrackWrapper',
			template: UI.template('div', 'ie abs'),
			appearance: {
				style: {
					'height': '100%',
					'width': 'calc(100% - 5px)',
					'left': '5px',
				},
			},
		}),

		// audio track
		UI.createComponent('{id}-audio-track'.format({id: id}), {
			template: UI.template('div', 'ie abs'),
			appearance: {
				style: {
					'height': '100%',
					'width': '100%',
				},
			},
		}),

		// audio track canvas
		UI.createComponent('{id}-audio-track-canvas'.format({id: id}), {
			template: UI.template('canvas', 'ie abs'),
		}),

		// audio track info
		UI.createComponent('{id}-audio-track-info'.format({id: id}), {
			template: UI.template('div', 'ie abs hidden'),
			appearance: {
				style: {
					'height': '100%',
					'width': '100%',
				},
			},
		}),

	]).then(function (components) {

		// unpack components
		var [
			base,

			// BUTTON GROUP
			playButton,

			// AUDIO GROUP
			audioWrapper,
			audioTrackWrapper,
			audioTrack,
			audioTrackCanvas,
			audioTrackInfo,
		] = components;

		// modify components and add methods etc.
		// BUTTON GROUP

		// AUDIO GROUP
		// determines which audio references to create as audio tags


		// REMOVE - move logic to master controller
		audioTrack.buffer = {};
		audioTrack.active = 0;


		audioTrack.controller = {};
		audioTrack.canvas = audioTrackCanvas;

		// initialise node and create context
		audioTrack.controller.context = new (window.AudioContext || window.webkitAudioContext)();

		// REMOVE - replace with something simpler
		audioTrack.current = function () {
			var _this = audioTrack;
			return new Promise(function(resolve, reject) {
				var storageId = Object.keys(_this.buffer).filter(function (key) {
					return _this.buffer[key].index === _this.active;
				})[0];
				resolve(_this.buffer[storageId]);
			});
		}

		// REMOVE - move logic to master controller
		audioTrack.update = function () {
			var _this = audioTrack;
			// 1. if the buffer is completely empty, the audio element must wait before attempting to load the audio.
			// 2. active_transcription_token is not "active". It should change each time it is requested, unless the page is reloaded.

			var remaining = Object.keys(_this.buffer).filter(function (key) {
				return _this.buffer[key].is_available;
			}).length;
			if (remaining === 0) {
				// TODO: if this result is negative, there should be an info message.

				return _this.load().then(function () {
					return _this.pre.main();
				});
			} else if (remaining < (base.threshold || 4)) {
				return Promise.all([
					_this.load({force: true}),
					_this.pre.main(),
				]);
			} else {
				return _this.pre.main();
			}
		}
		audioTrack.load = function (force) {
			force = force !== undefined ? force.force : false;
			var _this = audioTrack;
			// load more and process into buffer
			return base.path().then(function (tokenPath) {
				return Context.get(tokenPath, {force: force, overwrite: true});
			}).then(base.process).then(function () {
				return new Promise(function(resolve, reject) {
					resolve(_this.buffer);
				});
			});
		}
		audioTrack.pre = {
			main: function () {
				var _this = audioTrack.pre;
				return _this.load_audio().then(function () {
					return _this.current();
				}).then(function () {
					return _this.remove();
				});
			},
			load_audio: function () {
				var _this = audioTrack;
				// determine which audio elements to load
				// load n either side of active index.
				var lower = _this.active > 1 ? _this.active - (base.threshold || 4) + 2 : 0;
				var upper = _this.active > 1 ? _this.active + (base.threshold || 4) - 1 : (base.threshold || 4) + 1;
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
							return new Promise(function(resolve, reject) {

								// decode the incoming audio data and store it with the metadata.
								_this.controller.context.decodeAudioData(audioData, function (decoded) {
									storage.data = decoded;
									storage.has_waveform = true;
									resolve();
								});
							});
						});
					}
				}));
			},
			current: function () {
				var _this = audioTrack;
				// get current operation
				return _this.current().then(function (current) {
					audioTrackCanvas.data = current.data;
					audioTrackCanvas.duration = current.data.duration;
					return Util.ep();
				});
			},
			remove: function () {
				var _this = audioTrack;
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
		audioTrack.play = function (position, duration) {
			var _this = audioTrack;
			return _this.current().then(function (current) {
				// create new source from current data
				current.isPlaying = true;
				if (current.source !== undefined) {
					current.source.disconnect();
				}
				current.source = _this.controller.context.createBufferSource();
				current.source.buffer = current.data;
				current.source.connect(_this.controller.context.destination);
				current.source.onended = audioTrack.reset;

				// set position and duration
				position = position || 0;
				duration = duration || current.source.buffer.duration;
				if (_this.cut) {
					position = _this.cutStart;
					duration = _this.cutEnd - _this.cutStart;
				}
				if (position === 0) {
					audioTrackCanvas.cutStart = 0;
				}

				// set audioTrackCanvas variables
				audioTrackCanvas.duration = current.source.buffer.duration;
				audioTrackCanvas.position = position;
				audioTrackCanvas.isPlaying = true;
				audioTrackCanvas.startTime = audioTrack.controller.context.currentTime;

				// play
				current.source.start(0, position, duration);

				return audioTrackCanvas.start();
			});
		}
		audioTrack.stop = function () {
			var _this = audioTrack;
			return _this.current().then(function (current) {
				if (current.isPlaying) {
					current.isPlaying = false;
					current.source.stop();
					current.source.disconnect();
					audioTrackCanvas.isPlaying = false;
				}
				return Util.ep();
			});
		}
		audioTrack.reset = function () {
			var _this = audioTrack;
			// reset to beginning of current track
			return _this.current().then(function (current) {
				current.isPlaying = false;
				audioTrackCanvas.isPlaying = false;
				current.source.stop();
				return audioTrackCanvas.stop();
			});
		}

		// REMOVE - move logic to master controller
		audioTrack.next = function () {
			var _this = audioTrack;
			return _this.stop().then(function () {
				return _this.current();
			}).then(function (current) {

				// RECONCILE CURRENT WITH AUDIOTRACK.BUFFER and check is_available
				current.is_available = false;
				_this.active = _this.active + 1;
				return audioTrackCanvas.removeCut();
			}).then(function () {
				return _this.update();
			}).then(function () {
				return _this.play();
			});
		}
		audioTrack.previous = function () {
			var _this = audioTrack;
			return _this.stop().then(function () {
				_this.active = _this.active > 0 ? _this.active - 1 : 0;
				return audioTrackCanvas.removeCut();
			}).then(function () {
				return _this.update();
			}).then(function () {
				return _this.play();
			});
		}

		//// CANVAS
		audioTrackCanvas.isRunning = false;
		audioTrackCanvas.barWidth = 2;
		audioTrackCanvas.nowCursorPosition = 0;
		audioTrackCanvas.time = 0;
		audioTrackCanvas.cutStart = 0;
		audioTrackCanvas.start = function () {
			var _this = audioTrackCanvas;
			if (!_this.isRunning) {
				_this.isRunning = true;

				// create canvas and context
				_this.canvas = document.getElementById(_this.id);
				if (_this.canvas) {
					_this.canvas.height = parseInt(audioTrack.model().css('height'));
					_this.canvas.width = parseInt(audioTrack.model().css('width'));
					_this.context = _this.canvas.getContext('2d');

					// start loop
					_this.draw();
				}
			}
			return Util.ep();
		}
		audioTrackCanvas.stop = function () {
			var _this = audioTrackCanvas;
			setTimeout(function () {
				if (!_this.isPlaying && !_this.isMousedOver) {
					_this.isRunning = false;
					cancelAnimationFrame(_this.animationReference);
				}
			}, 500);
			return Util.ep();
		}
		audioTrackCanvas.draw = function () {
			var _this = audioTrackCanvas;
			_this.animationReference = requestAnimationFrame(_this.draw);

			_this.canvas.height = parseInt(audioTrack.model().css('height'));
			_this.canvas.width = parseInt(audioTrack.model().css('width'));
			_this.time = (audioTrack.controller.context.currentTime - _this.startTime + _this.position) || 0;
			if (_this.duration && _this.time > _this.duration) {
				_this.time = 0;
				_this.isPlaying = false;
			}

			// _this.data;
			if (_this.data === undefined) {
				_this.sample = Array.apply(null, Array(_this.canvas.width)).map(Number.prototype.valueOf, 0);
			} else {
				_this.waveform = _this.data.getChannelData(0);
				_this.sample = Util.arrays.getAbsNormalised(Util.arrays.interpolateArray(_this.waveform, _this.canvas.width / _this.barWidth), _this.canvas.height);
			}

			// 2. draw
			// clear canvas
			_this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

			// data
			for (i=0; i<_this.sample.length; i++) {

				// colour
				if (_this.cut) {
					if (i * _this.barWidth > _this.cutStart && i * _this.barWidth < _this.cutEnd) {
						if (i * _this.barWidth < _this.nowCursorPosition) {
							_this.context.fillStyle = '#fff';
						} else {
							_this.context.fillStyle = '#ccc';
						}
					} else {
						_this.context.fillStyle = '#999';
					}
				} else {
					if (i * _this.barWidth < _this.mousePosition) {
						_this.context.fillStyle = '#ccc';
					} else if (i * _this.barWidth < _this.nowCursorPosition && i * _this.barWidth > _this.cutStart) {
						_this.context.fillStyle = '#fff';
					} else {
						_this.context.fillStyle = '#bbb';
					}
				}

				_this.context.fillRect(i * _this.barWidth, 0.6 * (_this.canvas.height - _this.sample[i]), _this.barWidth, (_this.sample[i] + 1));
			}

			// update now cursor
			if (_this.isPlaying) {
				_this.nowCursorPosition = _this.canvas.width * (_this.time / _this.duration);
			} else {
				_this.nowCursorPosition = _this.cut ? _this.cutStart : 0;
			}
		}
		audioTrackCanvas.getMousePosition = function (event) {
			var _this = audioTrackCanvas;
			if (_this.canvas !== undefined) {
				var rect = _this.canvas.getBoundingClientRect();

				return {
					x: Math.floor((event.clientX - rect.left) / (rect.right - rect.left) * _this.canvas.width),
					y: Math.floor((event.clientY-rect.top) / (rect.bottom - rect.top) * _this.canvas.height),
				}
			} else {
				return {x: 0, y: 0}
			}
		}
		audioTrackCanvas.removeCut = function () {
			audioTrackCanvas.cut = false;
			audioTrack.cut = false;
			audioTrack.cutStart = 0;
			audioTrack.cutEnd = 0;
			return Util.ep();
		}

		// complete promises
		return Promise.all([
			playButton.setBindings({
				'mousedown': function (_this) {
					// The play button will always return to the anchor and play from there.
					return audioTrack.play();
				},

				// display tooltip in track info field
				'mouseover': function (_this) {

				},

				// remove tooltip
				'mouseout': function (_this) {

				},
			}),
			audioTrackCanvas.setBindings({

				// like it says
				'mousedown': function (_this, event) {
					_this.mouseDown = true;
					_this.drag = false;
					_this.cutStart = _this.getMousePosition(event).x;
				},

				// continuous movement
				'mousemove': function (_this, event) {
					_this.mousePosition = _this.getMousePosition(event).x;
					if (_this.mouseDown) {
						_this.cut = true;
						_this.drag = true;
						_this.cutEnd = _this.mousePosition;
					}
				},

				// let mouse up
				'mouseup': function (_this, event) {
					_this.mouseDown = false;
					if (_this.cut) {
						if (_this.drag && (_this.cutEnd - _this.cutStart > 1)) {
							audioTrack.cut = true;
							audioTrack.cutStart = _this.cutStart / _this.canvas.width * _this.duration;
							audioTrack.cutEnd = _this.cutEnd / _this.canvas.width * _this.duration;
							audioTrack.play(audioTrack.cutStart);
						} else {
							_this.cut = false;
							audioTrack.cut = false;
							audioTrack.cutStart = 0;
							audioTrack.cutEnd = 0;
							audioTrack.stop();
						}
					} else {
						_this.time = _this.getMousePosition(event).x / _this.canvas.width * _this.duration;
						audioTrack.play(_this.time);
					}
				},

				'mouseout': function (_this) {
					_this.mousePosition = 0;
					_this.isMousedOver = false;
					return _this.stop();
				},

				'mouseover': function (_this) {
					_this.isMousedOver = true;
					return _this.start();
				}
			}),
			audioTrackWrapper.setChildren([
				audioTrack,
				audioTrackCanvas,
				audioTrackInfo,
			]),
			audioWrapper.setChildren([
				audioTrackWrapper,
			]),
		]).then(function () {
			base.components = {
				track: audioTrack,
				canvas: audioTrackCanvas,
			}
			return base.setChildren([
				audioWrapper,
				playButton,
			]);
		}).then(function () {
			return base;
		});
	});
}
