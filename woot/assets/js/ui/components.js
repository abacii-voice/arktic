// These components are larger abstractions built on the back of the generalised component system.

var Components = {

	//////////// SCROLL
	// This component is meant to hold related data in a list format.
	// Has several parts:
	// 1. A input field
	// 2. A filter panel that appears when the input is focussed, but disappears when any input is entered.
	// 3. A list where results appear
	// 4. A small info line showing the currently selected command or filter
	// 5. An optional title
	// 6. An optional loading icon
	scroll: function (id, args) {

		// SETUP
		// arg setup and initialisation
		// - if no title is given, leave no room for a title.
		// - if no search is given, leave no room for an input.
		// - looking for final variable 'listHeight'
		var listHeight = '100%', offset = 0, titleText, search;
		if (args.options !== undefined) {
			// title
			if (args.options.title !== undefined) {
				titleText = args.options.title;
				offset += 22;
			}

			// search
			if (args.options.search !== undefined) {
				search = args.options.search;
				offset += 40;
			}

			// listHeight
			listHeight = 'calc(100% - {offset}px)'.format({offset: offset});
		}

		// CREATE ALL COMPONENTS
		// create elements in parallel
		return Promise.all([
			// title
			UI.createComponent('{id}-title'.format({id: id}), {
				template: UI.template('h4', 'ie title'),
				appearance: {
					style: {
						'width': '100%',
						'height': '22px',
						'font-size': '18px',
					},
					html: titleText,
				},
			}),


			// SEARCH GROUP
			// search wrapper
			UI.createComponent('{id}-search-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': '40px',
					},
				},
			}),

			// search input
			UI.createComponent('{id}-search-input'.format({id: id}), {
				template: UI.template('input', 'ie input abs'),
				appearance: {
					style: {
						'width': '100%',
						'height': '100%',
					},
					properties: {
						'autocomplete': 'off',
					},
				},
			}),

			// search button
			UI.createComponent('{id}-search-button'.format({id: id}), {
				template: UI.template('div', 'ie button abs border border-radius'),
				appearance: {
					style: {
						'top': '5px',
						'height': '30px',
						'width': 'auto',
						'right': '5px',
						'padding': '7px',
						'font-size': '12px',
					},
				},
			}),


			// LIST GROUP
			// list wrapper
			UI.createComponent('{id}-list-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': listHeight,
						'overflow': 'hidden',
					},
				},
			}),

			// list
			UI.createComponent('{id}-list'.format({id: id}), {
				// in future, allow this to be bound to another element.
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': 'calc(100% + 20px)',
						'height': listHeight,
						'padding-right': '20px',
						'overflow-y': 'scroll',
					},
				},
				// registry: args.options.target.states.map(function (state) {
				// 	return {state: state, path: args.options.target.path(), args: {}, fn: args.options.target.process};
				// }),
			}),

			// list loading icon
			UI.createComponent('{id}-list-loading-icon'.format({id: id}), {
				template: UI.templates.loadingIcon,
			}),


			// FILTER GROUP
			// filter wrapper
			UI.createComponent('{id}-filter-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': listHeight,
					},
				},
			}),

			// filter list
			UI.createComponent('{id}-filter'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
					},
				},
			}),

			// filter info
			UI.createComponent('{id}-filter-info'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
					},
				},
			}),


		]).then(function (components) {
			// unpack components
			// title
			var title = components[0];

			// SEARCH GROUP
			var searchWrapper = components[1];
			var searchInput = components[2];
			var searchButton = components[3];

			// LIST GROUP
			var listWrapper = components[4];
			var list = components[5];
			var listLoadingIcon =  components[6];

			// FILTER GROUP
			var filterWrapper = components[7];
			var filter = components[8];
			var filterInfo = components[9];

			// SET PROPERTIES AND METHODS
			// set bindings, children, etc.
			return new Promise(function(resolve, reject) {
				// TITLE
				title.defined = titleText !== undefined;

				list.runDisplay = function (details, query) {
					var fltr = details.fltr !== undefined ? {options: {filter: details.fltr()}} : {};
					query = query !== undefined ? query : '';
					if (details.path !== undefined) {
						Context.get(details.path(), fltr).then(details.process).then(function (results) {
							results.filter(function (result) {
								return result.main.indexOf(query) === 0;
							}).forEach(args.options.display.list(list, query));
						});
					}
				}

				// SEARCH
				// If the search option is filled, include a search bar and an optional filter panel
				if (search !== undefined) {
					// search functions engaged. can be in autocomplete mode and include filter panel.

					if (search.filter !== undefined && search.filter) {
						// the filter panel will be displayed
						// autocomplete will decide whether the panel is displayed before the list of data.
						// FILTER: if filter, define filter panel
						filterWrapper.defined = true;
						filter.setChildren(Object.keys(args.options.targets).map(function (key, index) {
							var display = args.options.display.filter(filter.id);
							return display(args.options.targets[key], index);
						}));
						filter.set = function (target) {
							filter.active = target;
							searchInput.model().focus();
							listWrapper.setAppearance({classes: {remove: ['hidden']}});
							searchButton.setAppearance({classes: {remove: ['hidden']}, html: target.filter.button});
							filterWrapper.setAppearance({classes: {add: ['hidden']}});
						}
						filter.defaults = Object.keys(args.options.targets).filter(function (key) {
							return args.options.targets[key].default;
						}).map(function (key) {
							return key;
						});
						filter.keys = Object.keys(args.options.targets).map(function (key) {
							return args.options.targets[key].filter.char;
						});

						// set filterWrapper
						filterWrapper.setChildren([
							filter,
							filterInfo,
						]);

						// INPUT: if search, define input field
						searchInput.setBindings({

							// FOCUS INPUT
							// autocomplete ? show filter : hide filter
							'focus': function (_this) {
								listWrapper.setAppearance({classes: {add: ['hidden']}});
								searchButton.setAppearance({classes: {add: ['hidden']}});
								filterWrapper.setAppearance({classes: {remove: ['hidden']}});
							},

							// BLUR INPUT:
							'blur': function (_this) {
								if (search.autocomplete !== undefined && search.autocomplete) {
									filterWrapper.setAppearance({classes: {remove: ['hidden']}});
									listWrapper.setAppearance({classes: {add: ['hidden']}});
								} else {
									filterWrapper.setAppearance({classes: {add: ['hidden']}});
									listWrapper.setAppearance({classes: {remove: ['hidden']}});
									list.removeChildren().then(function () {
										var targets = Object.keys(args.options.targets);
										for (i=0; i<targets.length; i++) {
											list.runDisplay(args.options.targets[targets[i]]);
										}
									})
								}
								searchButton.setAppearance({classes: {add: ['hidden']}});
							},

							// TYPE INPUT:
							'input': function (_this) {
								// get words
								var query = _this.model().val();
								var tokens = query.split('');

								// show or hide
								if (tokens.length !== 0) {
									listWrapper.setAppearance({classes: {remove: ['hidden']}});
									filterWrapper.setAppearance({classes: {add: ['hidden']}});

									if (filter.keys.indexOf(tokens[0]) !== -1) {
										filter.active = args.options.targets[Object.keys(args.options.targets).filter(function (key) {
											return args.options.targets[key].filter.char === tokens[0];
										})[0]];
										query = tokens.slice(1).join('');
										filter.set(filter.active);
									}

									if (query !== '') {
										// Materials
										// 1. tokens or value -> filters values
										// 2. active filter -> filters rules
										// 3. sources: paths and urls

										// remove all previous results (this is before buffer is implemented)
										list.removeChildren().then(function () {
											// Steps
											// 1. If active filter is set, use only the url/path of that filter.
											if (filter.active !== undefined) {
												list.runDisplay(filter.active, query);
											} else {
												if (filter.defaults.length !== 0) {
													// display only defaults
													for (i=0; i<filter.defaults.length; i++) {
														list.runDisplay(args.options.targets[filter.defaults[i]], query);
													}
												} else {
													// display everything
													var targets = Object.keys(args.options.targets);
													for (i=0; i<targets.length; i++) {
														list.runDisplay(args.options.targets[targets[i]], query);
													}
												}
											}
										});
									}
								} else {
									listWrapper.setAppearance({classes: {add: ['hidden']}});
									filterWrapper.setAppearance({classes: {remove: ['hidden']}});
									list.removeChildren();
								}
							}
						});

						// Search button behaviour
						searchButton.setBindings({
							'mousedown': function (_this) {
								filter.active = undefined;
							},
						});

						// Autocomplete mode only affects present elements, it does not add any.
						searchButton.setAppearance({
							classes: ['hidden'],
						});
						if (search.autocomplete !== undefined && search.autocomplete) {
							// autocomplete mode: display filter first
							listWrapper.setAppearance({
								classes: ['hidden'],
							});

						} else {
							// display data first, display filter panel upon focussing input, hide again on input.
							filterWrapper.setAppearance({
								classes: ['hidden'],
							});
							var targets = Object.keys(args.options.targets);
							for (i=0; i<targets.length; i++) {
								list.runDisplay(args.options.targets[targets[i]]);
							}
						}

						// DEFINE INPUT GROUP
						searchWrapper.defined = true;
						searchWrapper.setChildren([
							searchInput,
							searchButton
						]);

					} else {
						// No filter panel
						filterWrapper.defined = false;

						// display everything
						var targets = Object.keys(args.options.targets);
						for (i=0; i<targets.length; i++) {
							list.runDisplay(args.options.targets[targets[i]]);
						}

						// INPUT: if search, define input field
						searchInput.setBindings({
							// BLUR INPUT:
							'blur': function (_this) {
								if (search.autocomplete !== undefined && search.autocomplete) {
									listWrapper.setAppearance({
										classes: {add: ['hidden']},
									});
								}
							},

							// TYPE INPUT:
							'input': function (_this) {
								// get words
								var query = _this.model().val();
								var tokens = query.split('');

								if (tokens.length !== 0) {
									// show or hide
									listWrapper.setAppearance({
										classes: {remove: ['hidden']},
									});

									// Materials
									// 1. tokens or value -> filters values
									// 2. active filter -> filters rules
									// 3. sources: paths and urls

									// remove all previous results (this is before buffer is implemented)
									list.removeChildren().then(function () {
										// display everything
										var targets = Object.keys(args.options.targets);
										for (i=0; i<targets.length; i++) {
											list.runDisplay(args.options.targets[targets[i]], query);
										}
									});
								} else {
									list.removeChildren().then(function () {
										if (search.autocomplete === undefined || !search.autocomplete) {
											var targets = Object.keys(args.options.targets);
											for (i=0; i<targets.length; i++) {
												list.runDisplay(args.options.targets[targets[i]]);
											}
										}
									});
								}
							}
						});

						// DEFINE INPUT GROUP
						searchWrapper.defined = true;
						searchWrapper.setChildren([
							searchInput,
						]);

						if (search.autocomplete !== undefined && search.autocomplete) {
							// autocomplete mode: show no data until search query is entered.
							listWrapper.setAppearance({
								classes: ['ie', 'hidden'],
							});

						} else {
							// data is displayed first and filtered when search query is entered.

						}

					}

				} else {
					// display immediately, buffer can only be changed by scrolling.
					searchWrapper.defined = false;

					var targets = Object.keys(args.options.targets);
					for (i=0; i<targets.length; i++) {
						list.runDisplay(args.options.targets[targets[i]]);
					}
				}

				// LIST
				listWrapper.defined = true;
				list.display = args.options.display;
				// list.activate = args.options.activate(list);
				// list.up = args.options.up(list);
				// list.down = args.options.down(list);

				listWrapper.setChildren([
					list,
					listLoadingIcon,
				]);

				// return elements as they entered to be added to the base
				resolve([title, searchWrapper, listWrapper, filterWrapper]);
			});
		}).then(function (children) {
			// return base
			return UI.createComponent(id, {
				template: UI.template('div'),
				appearance: args.appearance,
				children: children.filter(function (child) {
					return child.defined;
				}),
			})
		});
	},

	//////////// AUDIO PLAYER
	// Plays audio given a source
	// Has a buffer for storing multiple tracks and cycling between them.
	// Parts:
	// 1. Play button
	// 2. Audio track
	// 3. Back button
	// 4. Forward button
	// 5. Anchor cursor
	// 6. Now cursor
	audio: function (id, args) {

		// any static variables like measurements


		// components
		return Promise.all([
			// BUTTON GROUP
			// button wrapper
			UI.createComponent('{id}-button-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie abs'),
				appearance: {
					style: {
						'height': '50px',
						'width': '100px',
					},
				},
			}),

			// forward button
			UI.createComponent('{id}-forward-button'.format({id: id}), {
				template: UI.template('div', 'ie button border abs'),
				appearance: {
					style: {
						'height': '50px',
						'width': '100px',
						'top': '0px',
						'left': '0px',
						'border-radius': '25px',
					},
				},
			}),

			// back button
			UI.createComponent('{id}-back-button'.format({id: id}), {
				template: UI.template('div', 'ie button border abs'),
				appearance: {
					style: {
						'height': '50px',
						'width': '75px',
						'top': '0px',
						'left': '0px',
						'border-radius': '25px',
					},
				},
			}),

			// play button
			UI.createComponent('{id}-play-button'.format({id: id}), {
				template: UI.template('div', 'ie button border abs'),
				appearance: {
					style: {
						'height': '50px',
						'width': '50px',
						'top': '0px',
						'left': '0px',
						'border-radius': '25px',
					},
				},
			}),


			// AUDIO GROUP
			// audio wrapper
			UI.createComponent('{id}-audio-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie abs border'),
				appearance: {
					style: {
						'border-left': '0px',
						'height': '50px',
						'width': 'calc(100% - 30px)',
						'left': '30px',
						'border-top-right-radius': '5px',
						'border-bottom-right-radius': '5px',
					},
				},
			}),

			// audio track wrapper
			UI.createComponent('{id}-audio-track-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie abs'),
				appearance: {
					style: {
						'height': '100%',
						'width': 'calc(100% - 70px)',
						'left': '70px',
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
				template: UI.template('div', 'ie abs'),
				appearance: {
					style: {
						'height': '100%',
						'width': '100%',
					},
				},
			}),

		]).then(function (components) {
			// unpack components
			// BUTTON GROUP
			var buttonWrapper = components[0];
			var forwardButton = components[1];
			var backButton = components[2];
			var playButton = components[3];

			// AUDIO GROUP
			var audioWrapper = components[4];
			var audioTrackWrapper = components[5];
			var audioTrack = components[6];
			var audioTrackCanvas = components[7];
			var audioTrackInfo = components[8];

			return new Promise(function(resolve, reject) {
				// modify components and add methods etc.
				// BUTTON GROUP
				forwardButton.setBindings({
					'mousedown': function (_this) {
						// the forward button jumps the now cursor forward in time by 2 seconds, or an adjustable amount.
						audioTrack.next();
					},

					// display tooltip in track info field
					'mouseover': function (_this) {

					},

					// remove tooltip
					'mouseout': function (_this) {

					},
				});

				backButton.setBindings({
					'mousedown': function (_this) {
						// the back button has different behaviour based on the position of the anchor cursor.
						// if the anchor cursor is at 0, the anchor will be set 2 seconds before the current time, then play from this point.
						// if the anchor is not at 0, it will be set 2 seconds before the anchors position and play from this point.
						audioTrack.previous();

					},

					// display tooltip in track info field
					'mouseover': function (_this) {

					},

					// remove tooltip
					'mouseout': function (_this) {

					},
				});

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

				buttonWrapper.setChildren([
					forwardButton,
					backButton,
					playButton,
				]);

				// AUDIO GROUP
				// audio track variables
				// audioTrack.trackId = '';
				// audioTrack.trackLength = 0;
				// audioTrack.audioTime = 0;
				// audioTrack.pixelToTimeRatio = 0;

				// determines which audio references to create as audio tags
				audioTrack.buffer = {};
				audioTrack.active = 0;
				audioTrack.controller = {};
				audioTrack.threshold = 4;
				audioTrack.barWidth = 2;
				audioTrack.canvas = audioTrackCanvas;

				// initialise node and create context
				audioTrack.controller.context = new (window.AudioContext || window.webkitAudioContext)();
				audioTrack.controller.analyser = audioTrack.controller.context.createAnalyser();
				audioTrack.controller.analyser.fftSize = 2048;
				audioTrack.controller.bufferLength = audioTrack.controller.analyser.frequencyBinCount;

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
					} else if (remaining < _this.threshold) {
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
						args.options.source.path(),
						args.options.source.token().then(function (tokenPath) {
							return Context.get(tokenPath, {force: force});
						}),
					]).then(function (options) {
						return Context.get(options[0], {force: force, options: {filter: {token: options[1].id}}});
					}).then(function (result) {
						// Result is a list of transcriptions filtered by active token
						// console.log(Object.keys(_this.buffer), Object.keys(result));
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
					var lower = _this.active > 1 ? _this.active - _this.threshold + 2 : 0;
					var upper = _this.active > 1 ? _this.active + _this.threshold - 1 : _this.threshold + 1;
					var indices = [];
					for (i=lower; i<upper; i++) {
						indices.push(i);
					}

					return Promise.all(indices.map(function (index) {
						var transcriptionId = Object.keys(_this.buffer).filter(function (key) {
							return _this.buffer[key].index === index;
						})[0];
						var storage = _this.buffer[transcriptionId];
						if (storage.data === undefined) {
							return Request.load_audio(transcriptionId).then(function (audioData) {
								return new Promise(function(resolve, reject) {
									_this.controller.context.decodeAudioData(audioData, function (decoded) {
										storage.data = decoded;
										storage.has_waveform = false;
										resolve();
									});
								});
							});
						}
					})).then(function () {
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
				audioTrack.play = function (position) {
					position = position !== undefined ? position : 0;
					var _this = audioTrack;
					return _this.current().then(function (current) {
						return new Promise(function(resolve, reject) {
							current.is_playing = true;
							if (current.source !== undefined) {
								current.source.disconnect();
							}
							current.source = _this.controller.context.createBufferSource();
							current.source.buffer = current.data;
							current.source.connect(_this.controller.context.destination);
							current.source.onended = audioTrack.reset;
							current.source.start(position);
							resolve();
						});
					});
				}
				audioTrack.drawWaveform = function () {
					var _this = audioTrack;
					return _this.current().then(function (current) {
						return Promise.all([
							// get waveform
							new Promise(function(resolve, reject) {
								current.waveform = current.data.getChannelData(0);
								var pixelWidth = parseInt(_this.model().css('width'));
								var pixelHeight = parseInt(_this.model().css('height'));
								var sampleValues = getAbsNormalised(interpolateArray(current.waveform, pixelWidth / _this.barWidth), pixelHeight);
								resolve(sampleValues);
							}),
							audioTrackCanvas.getContext(),
						]);
					}).then(function (waveformAndCanvasContext) {
						var waveformData = waveformAndCanvasContext[0];
						var canvasContext = waveformAndCanvasContext[1];
						var pixelHeight = parseInt(_this.model().css('height'));

						return new Promise(function(resolve, reject) {
							for (i=0; i<waveformData.length; i++) {
								canvasContext.fillStyle = '#ccc';
								canvasContext.fillRect(i * _this.barWidth, 0.6 * (pixelHeight - waveformData[i]), _this.barWidth, 0.6 * waveformData[i]);
								canvasContext.fillRect(i * _this.barWidth, 0.6 * pixelHeight, _this.barWidth, 0.4 * waveformData[i]);
							}
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
							}
							resolve();
						});

						// stop now cursor
					});
				}
				audioTrack.reset = function () {
					var _this = audioTrack;
					// reset to beginning of current track
					return _this.current().then(function (current) {
						current.is_playing = false;
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
							resolve();
						});
					}).then(function () {
						return _this.update();
					}).then(function () {
						return _this.play();
					});
				}

				audioTrack.setRegistry(args.registry);

				audioTrack.setBindings({
					// can be used to set cursor position
					'mousedown': function (_this) {
						// get position of click

					},

					// highlights part of the track
					'mouseover': function (_this) {
						// get position of mouse

					},

					// removes highlights
					'mouseout': function (_this) {

					},

					// DRAG?

				});

				//// CANVAS
				audioTrackCanvas.is_running = false;
				audioTrackCanvas.fps = 30;
				audioTrackCanvas.start = function () {
					var _this = audioTrackCanvas;
					if (!_this.is_running) {
						_this.is_running = true;

						// create canvas and context
						_this.canvas = document.getElementById(_this.id);
						_this.canvas.height = parseInt(_this.model().css('height'));
						_this.canvas.width = parseInt(_this.model().css('width'));
						_this.context = _this.canvas.getContext('2d');
						_this.frame = 0;

						// start loop
						_this.draw();
					}
				}
				audioTrackCanvas.draw = function () {
					var _this = audioTrackCanvas;
					setTimeout(function () {
						requestAnimationFrame(_this.draw);

						// 1. determine changes
						var changed = false;

						// _this.data;
						var differenceArray;
						if (_this.previousData !== undefined) {
							differenceArray = getDifferenceArray(_this.previousData, _this.data);
							if (differenceArray.reduce(reduceSum) !== 0) {
								changed = true;
								_this.previousData = _this.data;
							}
						} else {
							if (_this.data === undefined) {
								changed = true;
								differenceArray = Array.apply(null, Array(_this.canvas.width)).map(Number.prototype.valueOf, 0);;
							}
						}

						// from array
						// to array
						// current array
						
						// 1. initialise with

						// _this.nowCursorPosition;
						// _this.anchorCursorPosition;
						// _this.mousePosition;
						// _this.highlightStart;
						// _this.highlightEnd;

						// 2. draw
						if (changed) {
							// clear canvas
							_this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

							// data
							if (_this.data !== undefined) {

							} else {
								_this.data = differenceArray;
							}

							changed = false;
						}

						_this.frame += 1;
					}, 1000 / _this.fps);
				}

				audioTrackWrapper.setChildren([
					audioTrack,
					audioTrackCanvas,
					audioTrackInfo,
				]);
				audioWrapper.setChildren([
					audioTrackWrapper,
				]);

				// resolve list of components to be rendered.
				resolve([audioWrapper, buttonWrapper]);
			});
		}).then(function (components) {
			// create the base component and add the children from above.
			return UI.createComponent('{id}-audio'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '100%',
					},
				},
				children: components,
			});
		});
	},
}
