// Components specific to the account app
var AccountComponents = {
	//////////// AUDIO PLAYER
	// Plays audio given a source
	// Has a buffer for storing multiple tracks and cycling between them.
	// Parts:
	// 1. Play button
	// 2. Audio track
	audio: function (id, args) {
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
			playButton.setBindings({
				'mousedown': function (_this) {
					// The play button will always return to the anchor and play from there.
					audioTrack.play();
				},

				// display tooltip in track info field
				'mouseover': function (_this) {

				},

				// remove tooltip
				'mouseout': function (_this) {

				},
			});

			// AUDIO GROUP
			// determines which audio references to create as audio tags
			audioTrack.buffer = {};
			audioTrack.active = 0;
			audioTrack.controller = {};
			audioTrack.canvas = audioTrackCanvas;

			// initialise node and create context
			audioTrack.controller.context = new (window.AudioContext || window.webkitAudioContext)();
			audioTrack.current = function () {
				var _this = audioTrack;
				return new Promise(function(resolve, reject) {
					var storageId = Object.keys(_this.buffer).filter(function (key) {
						return _this.buffer[key].index === _this.active;
					})[0];
					resolve(_this.buffer[storageId]);
				});
			}
			audioTrack.update = function () {
				var _this = audioTrack;
				// 1. if the buffer is completely empty, the audio element must wait before attempting to load the audio.
				// 2. active_transcription_token is not "active". It should change each time it is requested, unless the page is reloaded.

				var remaining = Object.keys(_this.buffer).filter(function (key) {
					return _this.buffer[key].is_available;
				}).length;
				if (remaining === 0) {
					return _this.load().then(function () {
						return _this.pre();
					});
				} else if (remaining < (base.threshold || 4)) {
					return Promise.all([
						_this.load({force: true}),
						_this.pre(),
					]);
				} else {
					return _this.pre();
				}
			}
			audioTrack.load = function (force) {
				force = force !== undefined ? force.force : false;
				var _this = audioTrack;
				var total = Object.keys(_this.buffer).length;
				// load more and process into buffer
				return Promise.all([
					base.path(),
					base.token().then(function (tokenPath) {
						return Context.get(tokenPath, {force: force});
					}),
				]).then(function (options) {
					return Context.get(options[0], {force: force, options: {filter: {token: options[1].id}}});
				}).then(function (result) {
					// Result is a list of transcriptions filtered by active token
					// // console.log(Object.keys(_this.buffer), Object.keys(result));
					Object.keys(result).sort(function (a, b) {
						return result[a].original_caption > result[b].original_caption ? 1 : -1;
					}).forEach(function (key, index) {
						_this.buffer[key] = {
							original_caption: result[key].original_caption,
							is_available: true,
							is_active: true,
							index: index + total,
						}
					});
				}).then(function () {
					return new Promise(function(resolve, reject) {
						resolve(_this.buffer);
					});
				});
			}
			audioTrack.pre = function () {
				var _this = audioTrack;
				// determine which audio elements to load
				// load n either side of active index.
				var lower = _this.active > 1 ? _this.active - (base.threshold || 4) + 2 : 0;
				var upper = _this.active > 1 ? _this.active + (base.threshold || 4) - 1 : (base.threshold || 4) + 1;
				var indices = [];
				for (i=lower; i<upper; i++) {
					indices.push(i);
				}

				// once the indices have been chosen, load the audio file for each one.
				return Promise.all(indices.map(function (index) {
					var transcriptionId = Object.keys(_this.buffer).filter(function (key) {
						return _this.buffer[key].index === index;
					})[0];
					var storage = _this.buffer[transcriptionId];
					if (storage.data === undefined) {
						return Request.load_audio(transcriptionId).then(function (audioData) {
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
				})).then(function () {
					// get current operation
					return _this.current().then(function (current) {
						return new Promise(function(resolve, reject) {
							audioTrackCanvas.data = current.data;
							audioTrackCanvas.duration = current.data.duration;
							if (base.current !== undefined) {
								base.current(current);
							}
							resolve();
						});
					});
				}).then(function () {
					// remove data from all indices not in the chosen array.
					return Promise.all(Object.keys(_this.buffer).filter(function (key) {
						return indices.indexOf(_this.buffer[key].index) === -1;
					}).map(function (key) {
						var removeBuffer = _this.buffer[key];
						if (removeBuffer.source !== undefined) {
							removeBuffer.source.disconnect();
							removeBuffer.has_waveform = false;
							delete removeBuffer.source;
							delete removeBuffer.waveform;
						}
					}));
				});
			}
			audioTrack.play = function (position, duration) {
				var _this = audioTrack;
				return _this.current().then(function (current) {
					return new Promise(function(resolve, reject) {

						// create new source from current data
						current.is_playing = true;
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
						audioTrackCanvas.is_playing = true;
						audioTrackCanvas.startTime = audioTrack.controller.context.currentTime;

						// play
						current.source.start(0, position, duration);
						resolve();
					});
				});
			}
			audioTrack.stop = function () {
				var _this = audioTrack;
				return _this.current().then(function (current) {
					return new Promise(function(resolve, reject) {
						if (current.is_playing) {
							current.is_playing = false;
							current.source.stop();
							current.source.disconnect();
							audioTrackCanvas.is_playing = false;
						}
						resolve();
					});
				});
			}
			audioTrack.reset = function () {
				var _this = audioTrack;
				// reset to beginning of current track
				return _this.current().then(function (current) {
					current.is_playing = false;
					audioTrackCanvas.is_playing = false;
					current.source.stop();
				});
			}
			audioTrack.next = function () {
				var _this = audioTrack;
				return _this.stop().then(function () {
					return _this.current();
				}).then(function (current) {
					return new Promise(function(resolve, reject) {
						current.is_available = false;
						resolve();
					});
				}).then(function () {
					return new Promise(function(resolve, reject) {
						_this.active = _this.active + 1;
						audioTrackCanvas.removeCut();
						resolve();
					});
				}).then(function () {
					return _this.update();
				}).then(function () {
					return _this.play();
				});
			}
			audioTrack.previous = function () {
				var _this = audioTrack;
				return _this.stop().then(function () {
					return new Promise(function(resolve, reject) {
						_this.active = _this.active > 0 ? _this.active - 1 : 0;
						audioTrackCanvas.removeCut();
						resolve();
					});
				}).then(function () {
					return _this.update();
				}).then(function () {
					return _this.play();
				});
			}

			audioTrack.setRegistry(args.registry);
			audioTrack.setState(args.state);

			//// CANVAS
			audioTrackCanvas.is_running = false;
			audioTrackCanvas.barWidth = 2;
			audioTrackCanvas.nowCursorPosition = 0;
			audioTrackCanvas.time = 0;
			audioTrackCanvas.cutStart = 0;
			audioTrackCanvas.start = function () {
				var _this = audioTrackCanvas;
				if (!_this.is_running) {
					_this.is_running = true;

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
			}
			audioTrackCanvas.draw = function () {
				var _this = audioTrackCanvas;
				requestAnimationFrame(_this.draw);
				_this.canvas.height = parseInt(audioTrack.model().css('height'));
				_this.canvas.width = parseInt(audioTrack.model().css('width'));
				_this.time = (audioTrack.controller.context.currentTime - _this.startTime + _this.position) || 0;
				if (_this.duration !== undefined) {
					if (_this.time > _this.duration) {
						_this.time = 0;
						_this.is_playing = false;
					}
				}

				// _this.data;
				if (_this.data === undefined) {
					_this.sample = Array.apply(null, Array(_this.canvas.width)).map(Number.prototype.valueOf, 0);
				} else {
					_this.waveform = _this.data.getChannelData(0);
					_this.sample = Util.arrays.getAbsNormalised(Util.arrays.interpolateArray(_this.waveform, _this.canvas.width / _this.barWidth), _this.canvas.height);
				}
				// ANIMATING https://www.kirupa.com/html5/animating_many_things_on_a_canvas.htm

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
				if (_this.is_playing) {
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
			}
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
				},
			});
			audioTrackWrapper.setChildren([
				audioTrack,
				audioTrackCanvas,
				audioTrackInfo,
			]);
			audioWrapper.setChildren([
				audioTrackWrapper,
			]);

			// resolve list of components to be rendered.
			base.next = function () {
				return audioTrack.next();
			}
			base.previous = function () {
				return audioTrack.previous();
			}
			base.setChildren([
				audioWrapper,
				playButton,
			]);

			return base;
		});
	},

	//////////// COUNTER
	// Counts the number of transcriptions or moderations done in a session
	// Parts:
	// 1. Large number counter with date stamp
	// 2. Counter field
	// 3. Counters
	counter: function (id, args) {
		// styling

		// components
		return Promise.all([
			// base
			UI.createComponent(id, {
				template: UI.template('div', 'ie'),
				appearance: args.appearance,
			}),

			// header wrapper
			UI.createComponent('{id}-header-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie border border-radius'),
				appearance: {
					style: {
						'height': args.appearance.style.width,
						'width': args.appearance.style.width,
						'border-bottom-left-radius': '0px',
						'border-bottom-right-radius': '0px',
						'border-bottom': '0px',
					},
				},
			}),

			// daily header
			UI.createComponent('{id}-daily-header'.format({id: id}), {
				template: UI.template('h2', 'ie'),
			}),

			// cycle header
			UI.createComponent('{id}-cycle-header'.format({id: id}), {
				template: UI.template('h3', 'ie'),
			}),

			// counter wrapper
			UI.createComponent('{id}-counter-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie border'),
				appearance: {
					style: {
						'height': 'calc(100% - {width}px)'.format({width: parseInt(args.appearance.style.width)}),
						'width': args.appearance.style.width,
						'border-bottom-left-radius': '5px',
						'border-bottom-right-radius': '5px',
					},
				},
			}),

			// left column
			UI.createComponent('{id}-left-column'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '50%',
						'float': 'left',
					},
				},
			}),

			// right column
			UI.createComponent('{id}-right-column'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '50%',
						'float': 'left',
					},
				},
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				headerWrapper,
				dailyHeader,
				cycleHeader,
				counterWrapper,
				leftColumn,
				rightColumn,
			] = components;

			// COMBINE

			// header properties
			headerWrapper.counter = counterWrapper;
			headerWrapper.dailyCount = 0;
			headerWrapper.cycleCount = 0;
			headerWrapper.increment = function () {
				// add one to the daily and cycle counts and increment counter wrapper
				var _this = headerWrapper;
				// counterWrapper.increment();
				return Promise.all([
					new Promise(function(resolve, reject) {
						_this.dailyCount += 1;
						_this.cycleCount += 1;
						resolve();
					}),
					counterWrapper.increment(),
				]).then(function () {
					return _this.set();
				});
			}
			headerWrapper.set = function () {
				var _this = headerWrapper;
				return new Promise(function(resolve, reject) {
					dailyHeader.model().html(_this.dailyCount);
					cycleHeader.model().html(_this.cycleCount);
					resolve();
				});
			}
			headerWrapper.load = function () {
				// set value and is_loaded, display value
				var _this = headerWrapper;
				return Promise.all([
					args.options.source.daily(),
					args.options.source.cycle(),
				]).then(function (paths) {
					return Promise.all([
						Context.get(paths[0]),
						Context.get(paths[1]),
					]);
				}).then(function (values) {
					return new Promise(function(resolve, reject) {
						_this.dailyCount = values[0];
						_this.cycleCount = values[1];
						resolve();
					});
				}).then(function () {
					return _this.set();
				});
			}
			headerWrapper.setRegistry(args.registry);
			headerWrapper.setChildren([
				dailyHeader,
				cycleHeader,
			]);

			// counter properties
			counterWrapper.columnMax = 15; // calculate based on height
			counterWrapper.leftColumnCount = 0;
			counterWrapper.rightColumnCount = 0;
			counterWrapper.increment = function () {
				var _this = counterWrapper;
				// if within limit, add another token
				// else reset and clear all tokens and add a new one
				return UI.createComponent('completion-token-{index}'.format({index: (_this.leftColumnCount + _this.rightColumnCount)}), {
					template: UI.template('div', 'ie border'),
					appearance: {
						style: {
							'margin-left': '5px',
							'margin-top': '5px',
							'height': '10px',
							'width': '10px',
						},
					},
				}).then(function (newCompletionToken) {
					if (_this.leftColumnCount == _this.columnMax) {
						if (_this.rightColumnCount == _this.columnMax) {
							// reset both and add to left column
							_this.leftColumnCount = 0;
							_this.rightColumnCount = 0;
							return leftColumn.removeChildren().then(function () {
								return rightColumn.removeChildren();
							}).then(function () {
								_this.leftColumnCount++;
								return leftColumn.setChildren([
									newCompletionToken,
								]);
							});
						} else {
							// add to right column
							_this.rightColumnCount++;
							return rightColumn.setChildren([
								newCompletionToken,
							]);
						}
					} else {
						// add to left column
						_this.leftColumnCount++;
						return leftColumn.setChildren([
							newCompletionToken,
						]);
					}
				})
			}
			counterWrapper.setChildren([
				leftColumn,
				rightColumn,
			]);

			base.head = headerWrapper;
			base.setChildren([
				headerWrapper,
				counterWrapper,
			]);

			return base;
		});
	},

	// RENDERED TEXT FIELD
	// A content panel with bindings for adding and removing tokens.
	// contenteditable is set to 'true' with appropriate bindings.
	captionField: function (id, args) {
		args.appearance = (args.appearance || {
			style: {
				'width': '100%',
				'height': '100%',
			},
		});

		// components
		return Promise.all([
			// base
			UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: args.appearance,
			}),

			// content
			Components.contentPanel('{id}-content'.format({id: id}), {
				appearance: {
					style: {
						'width': '100%',
						'height': '100%',
					},
				},
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				content,
			] = components;

			// methods and properties
			var wrapper = content.components.wrapper;
			wrapper.load = function () {

			}
			wrapper.token = function (options) {
				// console.log('{} caption token'.format(base.id));
				options = (options || {});
				var _this = wrapper;
				if (_this.active !== undefined && !options.swap) {
					return (options.end ? _this.setActive : Util.ep)({index: 'last'}).then(function () {
						return _this.active.focus('end');
					}).then(function () {
						return _this.active;
					});
				} else {
					_this.currentIndex = _this.currentIndex !== undefined ? _this.currentIndex + 1 : 0;
					return base.unit(options.text, options.type).then(function (unit) {
						// methods

						// set after HERE
						if (_this.active) {
							unit.after = options.before ? '' : _this.active.id;
						}
						return _this.setChildren([unit]).then(function () {
							_this.active = unit;
							return _this.active.activate();
						}).then(function () {
							return _this.active.focus('end');
						}).then(function () {
							return _this.active;
						});
					});
				}
			}
			wrapper.isCaretInPosition = function (mode) {
				return wrapper.active.components.autocomplete.search.isCaretInPosition(mode);
			}
			wrapper.isComplete = function () {
				return wrapper.active.components.autocomplete.search.isComplete();
			}
			wrapper.setActive = function (options) {
				// console.log('{} caption setActive'.format(base.id));
				var _this = wrapper;
				// args
				options.index = (options || {}).index !== undefined ? (options.index === 'last' ? _this.children.length - 1 : options.index) : undefined; // allow keyword "last"

				// changes
				var previousIndex = _this.currentIndex ? _this.currentIndex : 0;
				_this.currentIndex = (options.index !== undefined ? options.index : undefined || ((_this.currentIndex || 0) + (options.increment || 0)));

				// boundary conditions
				_this.currentIndex = _this.currentIndex > _this.children.length - 1 ? _this.children.length - 1 : (_this.currentIndex < 0 ? 0 : _this.currentIndex);

				var hasChanged = _this.currentIndex !== previousIndex || options.force;
				if (hasChanged) {
					_this.active = _this.children[_this.currentIndex];
				}
				return new Promise(function(resolve, reject) {
					resolve(hasChanged); // returns whether anything has changed.
				});
			}
			wrapper.next = function () {
				// console.log('{} caption next'.format(base.id));
				return wrapper.setActive({increment: 1}).then(function (indexChanged) {
					return (indexChanged ? wrapper.active.focus : Util.ep)('start');
				});
			}
			wrapper.previous = function () {
				// console.log('{} caption previous'.format(base.id));
				return wrapper.setActive({increment: -1}).then(function (indexChanged) {
					return (indexChanged ? wrapper.active.focus : Util.ep)('end');
				});
			}
			wrapper.delete = function () {
				var content = wrapper.active.getContent();
				var isAtStart = wrapper.active.isAtStart();
				return wrapper.removeChild(wrapper.active.id).then(function () {
					wrapper.active = undefined;
					var forceNext = function () {
						if (wrapper.children.length) {
							return wrapper.setActive({force: true}).then(function () {
								return wrapper.active.focus('start');
							});
						} else {
							return wrapper.token();
						}
					}
					return (wrapper.currentIndex ? wrapper.previous : forceNext)();
				}).then(function () {
					if (content && isAtStart) {
						var activeContent = wrapper.active.getContent();
						return wrapper.active.setContent({content: (activeContent + content), trigger: true}).then(function () {
							// set caret position to active content length
							return wrapper.active.components.autocomplete.search.setCaretPosition(activeContent.length);
						});
					}
				});
			}

			// behaviours
			base.behaviours = {
				up: function () {
					// console.log('{} caption behaviours up'.format(base.id));
					return Promise.all([
						(wrapper.active ? wrapper.active.components.autocomplete.behaviours.up : Util.ep)(),
					]);
				},
				down: function () {
					// console.log('{} caption behaviours down'.format(base.id));
					return Promise.all([
						(wrapper.active ? wrapper.active.components.autocomplete.behaviours.down : Util.ep)(),
					]);
				},
				left: function () {
					// console.log('{} caption behaviours left'.format(base.id));
					// go to previous token if at end
					return ((wrapper.active && wrapper.isCaretInPosition('start')) ? wrapper.previous : Util.ep)();
				},
				altleft: function () {
					// console.log('{} caption behaviours altleft'.format(base.id));
					// go to previous token
					return (wrapper.active ? wrapper.previous : Util.ep)();
				},
				right: function () {
					// console.log('{} caption behaviours right'.format(base.id));
					// complete or go to next token if already complete
					return Promise.all([
						((wrapper.active && wrapper.isCaretInPosition('end') && wrapper.isComplete()) ? wrapper.next : Util.ep)(),
						(wrapper.active && !wrapper.isComplete() ? wrapper.active.components.autocomplete.behaviours.right : Util.ep)(),
					]);
				},
				altright: function () {
					// console.log('{} caption behaviours altright'.format(base.id));
					// go to next token
					var shiftright = function () {
						return wrapper.setActive({increment: 1}).then(function (indexChanged) {
							return (indexChanged ? wrapper.active.focus : Util.ep)('end');
						});
					}
					return Promise.all([
						(wrapper.active ? shiftright : Util.ep)(),
					]);
				},
				enter: function () {
					// console.log('{} caption behaviours enter'.format(base.id));
					// complete and new token
					return Promise.all([
						(wrapper.active ? wrapper.active.components.autocomplete.behaviours.right : Util.ep)().then(function () {
							return (wrapper.active ? wrapper.token : Util.ep)({swap: true});
						}),
					]);
				},
				backspace: function () {
					// console.log('{} caption behaviours backspace'.format(base.id));
					// delete token if at beginning
					return ((wrapper.active && wrapper.active.isAtStart() && wrapper.children.length > 1) ? wrapper.delete : Util.ep)();
				},
				altbackspace: function () {
					// console.log('{} caption behaviours altbackspace'.format(base.id));
					// delete token
					return ((wrapper.active && wrapper.children.length) ? wrapper.delete : Util.ep)();
				},
				space: function () {
					// console.log('{} caption behaviours space'.format(base.id));
					// new token
					return Promise.all([
						// ((wrapper.active && (!wrapper.active.components.autocomplete.virtual.length || wrapper.isComplete())) ? wrapper.token : Util.ep)({swap: true}),
					]);
				},
				number: function (char) {
					// console.log('{} caption behaviours number'.format(base.id));
					return Promise.all([
						(wrapper.active ? wrapper.active.components.autocomplete.behaviours.number : Util.ep)(char),
					]);
				},
			}

			// complete promises
			return Promise.all([
				wrapper.setBindings({
					'click': function (_this) {
						wrapper.token({end: true});
					},
				}),
			]).then(function () {
				base.components['wrapper'] = wrapper;
				return base.setChildren([
					content,
				]);
			}).then(function () {
				return base;
			});
		});;
	},

	testCaptionField: function (id, args) {
		return Promise.all([
			// base
			UI.createComponent(id, {
				template: UI.template('div', 'ie'),
				appearance: args.appearance,
			}),

			// content
			UI.createComponent('{id}-content'.format({id: id}), {

			}),
		]).then(function (components) {
			var [
				base,
				content,
			] = components;

			// unit
			base.unit = function (options) {
				var id = '{base}-{id}'.format({base: base.id, id: Util.makeid()});
				return Promise.all([
					// base
					Components.search(id, {
						// need custom appearance
						appearance: {
							style: {
								'padding-left': '0px',
								'border': '0px',
								'display': 'inline-block',
							},
						},
					}),
				]).then(function (components) {
					var [
						unitBase,
					] = components;

					unitBase.activate = function () {
						return Util.ep();
					}
					unitBase.deactivate = function () {
						return Util.ep();
					}
					unitBase.select = function () {

					}
					unitBase.onInput = function () {
						return unitBase.getContent().then(function (content) {
							return base.searchExternal.start(content).then(function () {
								// return unitBase.setMetadata({query: content});
							});
						});
					}

					return Promise.all([
						unitBase.components.head.setBindings({
							'focus': function (_this) {
								return base.control.setActive({index: unitBase.index}).then(function () {
									return base.searchExternal.onFocus().then(function () {
										return unitBase.focus();
									});
								});
							},
							'blur': function (_this) {
								return base.control.setActive({deactivate: true}).then(function () {
									return base.searchExternal.onBlur().then(function () {
										return unitBase.blur();
									});
								});
							},
						}),
					]).then(function () {

					}).then(function () {
						return unitBase;
					});
				});
			}
			base.defaultUnitStyle = function () {

			}

			// data
			base.data = {

				// variables
				caption: '',
				currentIndex: 0,

				// methods
				token: function (options) {
					options = (options || {});
					if (base.children.length && !options.new) {
						// focus active
						return base.control.setActive('last').then(function () {
							return base.active.focus('end');
						}).then(function () {
							return base.active;
						});
					} else {
						// create new unit
						base.data.currentIndex = base.data.currentIndex !== undefined ? base.data.currentIndex + 1 : 0;
						return base.unit(options.data).then(function (unit) {
							// set after HERE
							if (base.active) {
								unit.after = options.before ? '' : base.active.id;
							}
							return base.setChildren([unit]).then(function () {
								base.active = unit;
								return base.active.activate();
							}).then(function () {
								return base.active.focus('end');
							}).then(function () {
								return base.active;
							});
						});
					}
				},

			}

			// control
			base.control = {
				setActive: function (options) {
					options = (options || {});

					// position: explicit non-index position; "start", "end".
					// index: numerical position of unit to activate
					// increment: add a value to the current index
					// deactivate: deactivate active token

					if (options === 'deactivate') {
						return base.active.deactivate().then(function () {
							base.active = undefined;
							return Util.ep();
						});
					} else {
						options.index = options === 'last' ? base.children.length - 1 : options.index;

						// changes
						var previousIndex = base.currentIndex;
						base.data.currentIndex = (options.index !== undefined ? options.index : undefined || ((base.data.currentIndex || 0) + (base.data.currentIndex !== undefined ? (options.increment || 0) : 0)));

						// boundary conditions
						base.data.currentIndex = base.data.currentIndex > base.children.length - 1 ? base.children.length - 1 : (base.data.currentIndex < 0 ? 0 : base.data.currentIndex);

						if (base.currentIndex !== previousIndex) {
							var newActive = base.children[base.data.currentIndex];
							if (base.active) {
								return base.active.deactivate().then(function () {
									base.active = newActive;
									return base.active.activate();
								}).then(function () {
									return base.active.focus('end');
								});
							} else {
								return Util.ep();
							}
						} else {
							return Util.ep();
						}
					}
				},
				next: function () {
					return base.control.setActive({increment: 1});
				},
				previous: function () {
					return base.control.setActive({increment: -1});
				},
				delete: function (options) {

				},
			}

			// behaviours
			base.behaviours = {
				right: function () {

				},
				left: function () {

				},
				up: function () {

				},
				down: function () {

				},
				shiftright: function () {

				},
				shiftleft: function () {

				},
				altright: function () {

				},
				altleft: function () {

				},
				enter: function () {
					return base.active.complete().then(function () {
						return base.data.token({new: true});
					});
				}
			}

			return Promise.all([
				base.setBindings({
					'click': function (_this) {
						return _this.data.token();
					},
				}),
			]).then(function () {

			}).then(function () {
				return base;
			});
		});
	},

	// ROLE DISPLAY ICON
	roleDisplayIcon: function (id, args) {

	},

}
