
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
	return UI.createComponent(id, {
		name: args.name,
		template: UI.template('div', 'ie'),
		appearance: args.appearance,
		children: [
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
				children: [
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
						children: [
							// audio track
							UI.createComponent('{id}-audio-track'.format({id: id}), {
								name: 'audioTrack',
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
								name: 'canvas',
								template: UI.template('canvas', 'ie abs'),
							}),

							// audio track info
							UI.createComponent('{id}-audio-track-info'.format({id: id}), {
								name: 'info',
								template: UI.template('div', 'ie abs hidden'),
								appearance: {
									style: {
										'height': '100%',
										'width': '100%',
									},
								},
							}),
						],
					}),
				],
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
		],
	}).then(function (base) {

		// unpack components
		base.audioTrack = base.cc.audioWrapper.cc.audioTrackWrapper.cc.audioTrack;
		base.audioTrackCanvas = base.cc.audioWrapper.cc.audioTrackWrapper.cc.canvas;

		// modify components and add methods etc.
		// BUTTON GROUP

		base.controller = {};
		base.controller.context = new (window.AudioContext || window.webkitAudioContext)();
		base.load = function () {
			var _this = base;
			return Util.ep().then(function () {
				if (_this.controller.rawData === undefined) { // external controller just needs to set the _this.controller.data variable to work.
					return base.path().then(function (resolvedPath) {
						base.process(resolvedPath);
					});
				} else {
					return Util.ep();
				}
			}).then(function () {
				if (!_this.controller.isLoaded) {
					// decode the incoming audio data and store it with the metadata.
					return new Promise(function(resolve, reject) {
						_this.controller.context.decodeAudioData(_this.controller.rawData, function (decoded) {
							_this.controller.data = decoded;
							_this.controller.isLoaded = true;
							resolve();
						});
					});
				} else {
					return Util.ep();
				}
			}).then(function () {
				if (_this.controller.source !== undefined) {
					_this.controller.source.disconnect();
				}
				_this.controller.source = _this.controller.context.createBufferSource();
				_this.controller.source.buffer = _this.controller.data;
				_this.controller.source.connect(_this.controller.context.destination);
				_this.controller.source.onended = _this.reset;

				base.audioTrackCanvas.data = _this.controller.data;
				base.audioTrackCanvas.duration = _this.controller.data.duration;
				return Util.ep();
			});
		}
		base.play = function (position, duration) {
			var _this = base;
			return _this.load().then(function () {
				_this.isPlaying = true;

				// set position and duration
				position = position || 0;
				duration = duration || _this.controller.source.buffer.duration;
				if (base.audioTrack.cut) {
					position = base.audioTrack.cutStart;
					duration = base.audioTrack.cutEnd - base.audioTrack.cutStart;
				}
				if (position === 0) {
					base.audioTrackCanvas.cutStart = 0;
				}

				// set audioTrackCanvas variables
				base.audioTrackCanvas.duration = _this.controller.source.buffer.duration;
				base.audioTrackCanvas.position = position;
				base.audioTrackCanvas.isPlaying = true;
				base.audioTrackCanvas.startTime = _this.controller.context.currentTime;

				// play
				_this.controller.source.start(0, position, duration);
				return base.audioTrackCanvas.start();
			});
		}
		base.stop = function () {
			var _this = base;
			if (_this.isPlaying) {
				_this.isPlaying = false;
				_this.controller.source.stop();
				_this.controller.source.disconnect();
				_this.audioTrackCanvas.isPlaying = false;
			}
			return Util.ep();
		}
		base.reset = function () {
			var _this = base;
			// reset to beginning of current track
			return _this.stop().then(function () {
				return _this.load();
			})
		}
		base.display = function (current) {
			var _this = base;
			_this.controller.isLoaded = false;
			_this.controller.rawData = current.data.slice(); // need to copy it now, I guess.
			return _this.audioTrackCanvas.start().then(function () {
				return _this.load();
			}).then(function () {
				return _this.audioTrackCanvas.stop();
			});
		}

		//// CANVAS
		base.audioTrackCanvas.isRunning = false;
		base.audioTrackCanvas.barWidth = 1;
		base.audioTrackCanvas.nowCursorPosition = 0;
		base.audioTrackCanvas.time = 0;
		base.audioTrackCanvas.cutStart = 0;
		base.audioTrackCanvas.fps = 20;
		base.audioTrackCanvas.previousDelta = 0;
		base.audioTrackCanvas.start = function () {
			var _this = base.audioTrackCanvas;
			if (!_this.isRunning) {
				_this.isRunning = true;

				// create canvas and context
				_this.canvas = document.getElementById(_this.id);
				if (_this.canvas) {
					_this.canvas.height = parseInt(base.audioTrack.model().css('height'));
					_this.canvas.width = parseInt(base.audioTrack.model().css('width'));
					_this.context = _this.canvas.getContext('2d');

					// start loop
					_this.draw();
				}
			}
			return Util.ep();
		}
		base.audioTrackCanvas.stop = function () {
			var _this = base.audioTrackCanvas;
			setTimeout(function () {
				if (!_this.isPlaying && !_this.isMousedOver) {
					_this.isRunning = false;
					cancelAnimationFrame(_this.animationReference);
				}
			}, 500);
			return Util.ep();
		}
		base.audioTrackCanvas.draw = function (timeInMsSinceLoad) {
			var _this = base.audioTrackCanvas;
			_this.animationReference = requestAnimationFrame(_this.draw);
			var delta = timeInMsSinceLoad - _this.previousDelta;
			if (_this.fps && delta < 1000 / _this.fps) {
				return;
			}

			_this.canvas.height = parseInt(base.audioTrack.model().css('height'));
			_this.canvas.width = parseInt(base.audioTrack.model().css('width'));
			_this.time = (base.controller.context.currentTime - _this.startTime + _this.position) || 0;
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
							_this.context.fillStyle = Color.grey.light;
						} else {
							_this.context.fillStyle = Color.grey.normal;
						}
					} else {
						_this.context.fillStyle = Color.grey.uberlight;
					}
				} else {
					if (i * _this.barWidth < _this.mousePosition) {
						_this.context.fillStyle = Color.grey.light;
					} else if (i * _this.barWidth < _this.nowCursorPosition && i * _this.barWidth > _this.cutStart) {
						_this.context.fillStyle = Color.grey.lightest;
					} else {
						_this.context.fillStyle = Color.grey.normal;
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
			_this.previousDelta = timeInMsSinceLoad;
		}
		base.audioTrackCanvas.getMousePosition = function (event) {
			var _this = base.audioTrackCanvas;
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
		base.audioTrackCanvas.removeCut = function () {
			base.audioTrackCanvas.cut = false;
			base.audioTrack.cut = false;
			base.audioTrack.cutStart = 0;
			base.audioTrack.cutEnd = 0;
			return Util.ep();
		}

		// complete promises
		return Promise.all([
			base.cc.playButton.setBindings({
				'mousedown': function (_this) {
					// The play button will always return to the anchor and play from there.
					return base.play();
				},

				// display tooltip in track info field
				'mouseover': function (_this) {

				},

				// remove tooltip
				'mouseout': function (_this) {

				},
			}),
			base.audioTrackCanvas.setBindings({

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
							base.audioTrack.cut = true;
							base.audioTrack.cutStart = _this.cutStart / _this.canvas.width * _this.duration;
							base.audioTrack.cutEnd = _this.cutEnd / _this.canvas.width * _this.duration;
							return base.play(base.audioTrack.cutStart);
						} else {
							_this.cut = false;
							base.audioTrack.cut = false;
							base.audioTrack.cutStart = 0;
							base.audioTrack.cutEnd = 0;
							return base.stop();
						}
					} else {
						_this.time = _this.getMousePosition(event).x / _this.canvas.width * _this.duration;
						return base.play(_this.time);
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
		]).then(function () {
			return base;
		});
	});
}
