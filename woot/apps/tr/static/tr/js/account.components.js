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
						return new Promise(function(resolve, reject) {
							audioTrackCanvas.data = current.data;
							audioTrackCanvas.duration = current.data.duration;
							resolve();
						});
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

						// RECONCILE CURRENT WITH AUDIOTRACK.BUFFER and check is_available

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

			// base methods
			base.next = function () {
				return audioTrack.next();
			}
			base.previous = function () {
				return audioTrack.previous();
			}

			// complete promises
			return Promise.all([
				playButton.setBindings({
					'mousedown': function (_this) {
						// The play button will always return to the anchor and play from there.
						return audioTrack.next().catch(function (error) {
							console.log(error);
						});
					},

					// display tooltip in track info field
					'mouseover': function (_this) {

					},

					// remove tooltip
					'mouseout': function (_this) {

					},
				}),
				audioTrack.setRegistry(args.registry),
				audioTrack.setState(args.state),
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

			base.defaultUnitStyle = function () {

			}

			// data
			base.data = {

				// variables
				defaultLimit: 10, // how many default tokens to render
				currentId: undefined, // the id of the current transcription

				// datasets
				storage: {
					buffer: {}, // stores all sets that have been entered this session when confirmed. Key is transcription id.
					virtual: [], // stores data in order
				},

				// objects
				objects: {
					phrase: {
						// base
						phrase: function () {
							// methods
							this.update = function (metadata) {
								metadata = (metadata || {
									query: '',
									complete: '',
								});

								// update metadata
								this.tokens = [];
								this.query = metadata.query;
								this.queryTokens = this.query.split(' ');
								this.complete = metadata.complete;
								this.completeTokens = this.complete.split(' ');

								// run process
								var _this = this;
								return Promise.ordered(_this.completeTokens.map(function (complete, index) {
									return function () {
										var tokenMetadata = {
											query: (_this.queryTokens[index] || ''),
											complete: complete,
										}
										return _this.getOrCreateToken(index, tokenMetadata).then(function (tokenOutput) {

										});
									}
								})).then(function () {
									return Util.ep(_this);
								});
							}
							this.getOrCreateToken = function (index, metadata) {
								var _this = this;
								if (index >= _this.tokens.length) { // if there is no token to fetch
									return base.data.objects.token.create(metadata).then(function (token) {
										_this.tokens.splice(index, 0, token);
										return Util.ep(token);
									});
								} else {
									return _this.tokens[index].update(metadata);
								}
							}
						},
						create: function (index, metadata) {
							var phrase = new base.data.objects.phrase.phrase();
							base.data.storage.virtual.splice(index, 0, phrase);
							return phrase.update(metadata);
						},
						remove: function () {

						},
					},
					token: {
						token: function () {
							// methods
							this.update = function (metadata) {

								// update metadata
								this.query = metadata.query;
								this.complete = metadata.complete;
								this.combined = this.query + this.complete.slice(this.query.length);

								// run standard process
								var _this = this;
								return Util.ep(_this);
							}
						},
						create: function (metadata) {
							var token = new base.data.objects.token.token();
							return token.update(metadata);
						},
						remove: function () {

						},
					},
				},

				// methods
				idgen: function () {
					return '{base}-{id}'.format({base: base.id, id: Util.makeid()});
				},
			}

			// control
			base.control = {
				setup: function () {
					// render 10 units
					if (content.children.length === 0) {
						return Promise.ordered(Array.range(base.data.defaultLimit).map(function (index) {
							return function () {
								return base.unit().then(function (unit) {
									return unit.hide().then(function () {
										return content.setChildren([unit]);
									});
								});
							}
						})).then(function () {
							// set styles
							return base.styles();
						});
					} else {
						return Util.ep();
					}
				},
				setActive: function (options) {

				},
				input: {
					newCaption: function (metadata) {
						base.data.currentId = metadata.parent;
						base.data.storage.virtual = [];
						base.data.virtualIndex = 0;

						var complete = (metadata.content || '');
						return Promise.ordered(complete.split(' ').map(function (completeToken, index) {
							return function () {
								return base.data.objects.phrase.create(index, {query: completeToken, complete: completeToken});
							}
						})).then(function () {
							return base.control.input.update.main();
						})
					},
					addPhrase: function (index, metadata) {

					},
					update: {
						main: function () {
							return base.control.input.update.rendered().then(function (virtualPosition) {
								return base.control.input.update.tail(virtualPosition);
							});
						},
						rendered: function () {
							var macro = 0;
							var micro = 0;
							var reachedTokenCount = false;
							return Promise.all(content.children.map(function (unit, index) {
								if (reachedTokenCount) {
									// hide the rest of the units
									return unit.reset();
								} else {
									var phrase = base.data.storage.virtual[macro];
									var token = phrase.tokens[micro];

									// render
									return unit.updateUnitMetadata(token).then(function () {
										return unit.updateBindings(phrase);
									});

									// check token count
									micro = (micro === phrase.tokens.length - 1) ? micro : micro + 1;

								}
							})).then(function () {
								return Util.ep([macro, micro]);
							});
						},
						tail: function (virtualPosition) {
							var [macro, micro] = virtualPosition; // the location in virtual where rendering stopped.
							if (macro < base.data.storage.virtual - 1) {
								return Util.ep();
							} else {
								return Util.ep();
							}
						},
					},
				},
				updateBuffer: function () {
					return Util.ep();
				},
			}

			base.next = function () {
				return base.control.setActive({increment: 1});
			}
			base.previous = function () {
				return base.control.setActive({increment: -1});
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

				}
			}

			return Promise.all([
				base.setBindings({
					'click': function (_this) {
						// return _this.data.objects.phrase.create();
					},
				}),
			]).then(function () {
				return base.setChildren([content]);
			}).then(function () {
				return base;
			});
		});
	},

	// ROLE DISPLAY ICON
	roleDisplayIcon: function (id, args) {

	},

}
