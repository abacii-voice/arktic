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
		var listHeight = '100%', offset = 0, titleText, titleCentered, search;
		if (args.options !== undefined) {
			// title
			if (args.options.title !== undefined) {
				titleText = args.options.title.text;
				titleCentered = args.options.title.center;
				offset += 22;
			}

			// search
			if (args.options.search !== undefined) {
				search = args.options.search;
				offset += 40;
			}

			// listHeight
			listHeight = 'calc(100% - {offset}px)'.format({offset: offset});

			// reset
			if (!$.isArray(args.options.reset)) {
				args.options.reset = [args.options.reset];
			}
		}

		// default appearance
		var defaultAppearance = {
			style: {
				'height': '100%',
				'width': '100%',
			},
		}

		// CREATE ALL COMPONENTS
		// create elements in parallel
		return Promise.all([
			// base
			UI.createComponent(id, {
				template: UI.template('div'),
				appearance: (args.appearance || defaultAppearance),
			}),

			// title
			UI.createComponent('{id}-title'.format({id: id}), {
				template: UI.template('h4', 'ie title'),
				appearance: {
					style: {
						'width': '100%',
						'height': '22px',
						'font-size': '18px',
						'text-align': (titleCentered ? 'center' : 'left'),
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

			// FILTER
			// filter wrapper
			UI.createComponent('{id}-filter-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': listHeight,
						'overflow': 'hidden',
					},
				},
			}),

			// filter list
			UI.createComponent('{id}-filter'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': 'calc(100% + 20px)',
						'height': listHeight,
						'padding-right': '20px',
						'overflow-y': 'scroll',
					},
				},
			}),

			// INFO
			UI.createComponent('{id}-info'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': listHeight,
						'overflow': 'hidden',
					},
				},
			}),

		]).then(function (components) {
			// unpack components
			var base = components[0];

			// title
			var title = components[1];

			// SEARCH GROUP
			var searchWrapper = components[2];
			var searchInput = components[3];
			var searchButton = components[4];

			// LIST GROUP
			var listWrapper = components[5];
			var list = components[6];
			var listLoadingIcon =  components[7];

			// FILTER GROUP
			var filterWrapper = components[8];
			var filter = components[9];

			// INFO
			var info = components[10];

			// Basic appearance methods
			searchInput.focus = function () {
				var _this = searchInput;
				_this.model().focus();
			}

			searchButton.show = function (target) {
				var _this = searchButton;
				_this.setAppearance({classes: {remove: ['hidden']}, html: target.filter.button});
			}
			searchButton.hide = function () {
				var _this = searchButton;
				_this.setAppearance({classes: {add: ['hidden']}, html: ''});
			}

			listWrapper.show = function () {
				var _this = listWrapper;
				_this.setAppearance({classes: {remove: ['hidden']}});
			}
			listWrapper.hide = function () {
				var _this = listWrapper;
				_this.setAppearance({classes: {add: ['hidden']}});
			}

			listLoadingIcon.fade = function () {
				var _this = listLoadingIcon;
				_this.model().fade();
			}

			filterWrapper.show = function () {
				var _this = filterWrapper;
				_this.setAppearance({classes: {remove: ['hidden']}});
			}
			filterWrapper.hide = function () {
				var _this = filterWrapper;
				_this.setAppearance({classes: {add: ['hidden']}});
			}

			info.show = function () {
				var _this = info;
				_this.setAppearance({classes: {remove: ['hidden']}});
			}
			info.hide = function () {
				var _this = info;
				_this.setAppearance({classes: {add: ['hidden']}});
			}

			// base methods
			base.clear = function () {
				searchButton.hide();
				searchInput.model().val('');
				searchInput.model().trigger('focus');
			}

			// SET PROPERTIES AND METHODS
			// set bindings, children, etc.
			// TITLE
			title.defined = titleText !== undefined;

			list.runDisplay = function (details, query) {
				var _this = list;
				query = query || '';
				var fltr = details.fltr !== undefined ? {options: {filter: details.fltr()}} : {};
				if (details.path !== undefined) {
					Context.get(details.path(), fltr).then(details.process).then(function (results) {
						return Promise.all(results.filter(function (result) {
							return result.main.indexOf(query) === 0;
						}).map(args.options.display.list(_this, query)));
					}).then(function () {
						listLoadingIcon.fade();
					});
				}
			}

			// SEARCH
			// If the search option is filled, include a search bar and an optional filter panel
			if (search !== undefined) {
				// search functions engaged. can be in autocomplete mode and include filter panel.

				if (search.filter !== undefined && search.filter) {
					if (args.options.info !== undefined) {
						info.setChildren([args.options.info(id)]);
					}

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
						searchInput.focus();
						listWrapper.show();
						searchButton.show(target);
						filterWrapper.hide();
						info.hide();
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
					]);

					// INPUT: if search, define input field
					searchInput.setBindings({

						// FOCUS INPUT
						// autocomplete ? show filter : hide filter
						'focus': function (_this) {
							listWrapper.hide();
							searchButton.hide();
							info.hide();
							filterWrapper.show();
						},

						// BLUR INPUT:
						'blur': function (_this) {
							if (search.autocomplete !== undefined && search.autocomplete) {
								if (args.options.info !== undefined) {
									info.show();
									filterWrapper.hide();
								} else {
									info.hide();
									filterWrapper.show();
								}
								listWrapper.hide();
							} else {
								filterWrapper.hide();
								info.hide();
								listWrapper.show();
								list.removeChildren().then(function () {
									var targets = Object.keys(args.options.targets);
									for (i=0; i<targets.length; i++) {
										list.runDisplay(args.options.targets[targets[i]]);
									}
								})
							}
							searchButton.hide();
						},

						// handle enter key
						'keydown': function (_this, event) {
							// trigger enter function
							if (event.keyCode === 13) {
								(base.enter || function () {})(base);
							}

							// trigger backspace function
							if (event.keyCode === 8) {
								(base.backspace || function () {})(base);
							}

							// trigger space function
							if (event.keyCode === 32) {
								event.preventDefault();
								(base.space || function () {})(base);
							}
						},

						// TYPE INPUT:
						'input': function (_this) {
							// get words
							var query = _this.model().val();
							var tokens = query.split('');
							var type = 'normal';

							// show or hide
							if (tokens.length !== 0) {
								listWrapper.setAppearance({classes: {remove: ['hidden']}});
								filterWrapper.setAppearance({classes: {add: ['hidden']}});

								if (filter.keys.indexOf(tokens[0]) !== -1) {
									filter.active = args.options.targets[Object.keys(args.options.targets).filter(function (key) {
										return args.options.targets[key].filter.char === tokens[0];
									})[0]];
									type = filter.active.filter.rule;
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
								listWrapper.hide();
								filterWrapper.show();
								list.removeChildren();
							}

							if (base.input !== undefined) {
								base.input(base, type, query, query.slice(-1));
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
					searchButton.hide();
					if (search.autocomplete !== undefined && search.autocomplete) {
						// autocomplete mode: display filter first
						listWrapper.hide();

					} else {
						// display data first, display filter panel upon focussing input, hide again on input.
						filterWrapper.hide();
						args.options.reset.forEach(function (state) {
							list.addState({
								name: state,
								args: {
									preFn: function (_this) {
										return function (resolve, reject) {
											_this.removeChildren().then(function () {
												Object.keys(args.options.targets).forEach(function (target) {
													_this.runDisplay(args.options.targets[target]);
												});
											});
										}
									}
								},
							});
						});
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
					args.options.reset.forEach(function (state) {
						list.addState({
							name: state,
							args: {
								preFn: function (_this) {
									return function (resolve, reject) {
										_this.removeChildren().then(function () {
											Object.keys(args.options.targets).forEach(function (target) {
												_this.runDisplay(args.options.targets[target]);
											});
										});
									}
								}
							},
						});
					});

					// INPUT: if search, define input field
					searchInput.setBindings({
						// BLUR INPUT:
						'blur': function (_this) {
							if (search.autocomplete !== undefined && search.autocomplete) {
								listWrapper.hide();
							}
						},

						// TYPE INPUT:
						'input': function (_this) {
							// get words
							var query = _this.model().val();
							var tokens = query.split('');

							if (tokens.length !== 0) {
								// show or hide
								listWrapper.show();

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
						listWrapper.hide();
					} else {
						// data is displayed first and filtered when search query is entered.

					}

				}

			} else {
				// display immediately, buffer can only be changed by scrolling.
				searchWrapper.defined = false;

				if (args.children !== undefined) {
					list.setChildren(args.children);
				} else {
					args.options.reset.forEach(function (state) {
						list.addState({
							name: state,
							args: {
								preFn: function (_this) {
									return function (resolve, reject) {
										_this.removeChildren().then(function () {
											Object.keys(args.options.targets).forEach(function (target) {
												_this.runDisplay(args.options.targets[target]);
											});
										});
									}
								}
							},
						});
					});
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
			if (args.options.info !== undefined) {
				info.show();
				filterWrapper.hide();
				info.defined = true;
			}
			base.setChildren([title, searchWrapper, listWrapper, filterWrapper, info].filter(function (child) {
				return child.defined;
			}));

			return base;
		});
	},

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

			// BUTTON GROUP
			// button wrapper
			UI.createComponent('{id}-button-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie abs'),
				appearance: {
					style: {
						'height': '50px',
						'width': '50px',
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
						'width': 'calc(100% - 25px)',
						'left': '25px',
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
						'width': '100%',
						'left': '25px',
					},
				},
			}),

			// audio track
			UI.createComponent('{id}-audio-track'.format({id: id}), {
				template: UI.template('div', 'ie abs'),
				appearance: {
					style: {
						'height': '100%',
						'width': 'calc(100% - 25px)',
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
			var base = components[0];

			// unpack components
			// BUTTON GROUP
			var buttonWrapper = components[1];
			var playButton = components[2];

			// AUDIO GROUP
			var audioWrapper = components[3];
			var audioTrackWrapper = components[4];
			var audioTrack = components[5];
			var audioTrackCanvas = components[6];
			var audioTrackInfo = components[7];

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

			buttonWrapper.setChildren([
				playButton,
			]);

			// AUDIO GROUP
			// determines which audio references to create as audio tags
			audioTrack.buffer = {};
			audioTrack.active = 0;
			audioTrack.controller = {};
			audioTrack.threshold = args.options.threshold || 4;
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
					_this.canvas.height = parseInt(audioTrack.model().css('height'));
					_this.canvas.width = parseInt(audioTrack.model().css('width'));
					_this.context = _this.canvas.getContext('2d');

					// start loop
					_this.draw();
				}
			}
			audioTrackCanvas.draw = function () {
				var _this = audioTrackCanvas;
				requestAnimationFrame(_this.draw);
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
					_this.sample = getAbsNormalised(interpolateArray(_this.waveform, _this.canvas.width / _this.barWidth), _this.canvas.height);
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
				var rect = _this.canvas.getBoundingClientRect();

				return {
					x: Math.floor((event.clientX - rect.left) / (rect.right - rect.left) * _this.canvas.width),
					y: Math.floor((event.clientY-rect.top) / (rect.bottom - rect.top) * _this.canvas.height),
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
			base.audio = audioTrack;
			base.setChildren([
				audioWrapper,
				buttonWrapper,
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
						'height': '80px',
						'width': '80px',
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
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': 'calc(100% - 80px)',
						'width': '100px',
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
			var base = components[0];
			var headerWrapper = components[1];
			var dailyHeader = components[2];
			var cycleHeader = components[3];
			var counterWrapper = components[4];
			var leftColumn = components[5];
			var rightColumn = components[6];

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

	//////////// TOKEN TEXT FIELD
	// Displays tokens for each word that can react to user input.
	// Features:
	// 1. Tokens can be added or removed
	// 2. Tokens can be selected and deleted.
	// 3. Tokens can be converted into inputs for quick changing
	// 4. Tags are coloured differently
	// 5. A dropdown can add modifiers; best guess, etc.
	// 6. Tokens can be exported.
	tokenTextField: function (id, args) {
		// styling

		// components
		return Promise.all([


		]).then(function (components) {
			// unpack components
			var tokenWrapper = components[0];
			var tokenList = components[1];

			// config and combination
			return new Promise(function(resolve, reject) {

				tokenList.currentIndex = 0;
				tokenList.addToken = function (text, tag) {
					var _this = tokenList;
					return UI.createComponent('{id}-token-{index}'.format({id: id, index: _this.currentIndex}), {
						appearance: {
							style: {
								'box-sizing': 'border-box',
								'display': 'inline-block',
								'float': 'left',
								'height': '100%',
								'padding': '5px',
								'border-right': '1px solid #ccc',
							},
							html: text,
						},
					}).then(function (token) {
						// add methods and properties
						return new Promise(function(resolve, reject) {
							token.tag = tag || false;
							token.focus = function () {

							}
							token.input = function () {

							}

							resolve(token);
						});
					}).then(function (token) {
						_this.currentIndex++;
						return _this.setChildren([
							token,
						]);
					}).then(function () {
						return _this.fitToTokens();
					});
				}
				tokenList.removeToken = function (index) {
					var _this = tokenList;
					return Promise.all(Object.keys(_this.children).map(function (childId) {
						return UI.getComponent(childId).then(function (component) {
							if (component.index === index) {
								return _this.removeChild(component.id);
							}
						});
					})).then(function () {
						return _this.fitToTokens();
					});
				}
				tokenList.fitToTokens = function () {
					var _this = tokenList;
					return new Promise(function(resolve, reject) {
						// fit container to width of all tokens
						var totalWidth = 0;
						_this.model().children().each(function () {
							totalWidth += $(this).outerWidth();
						})
						_this.model().css({'width': '{width}px'.format({width: totalWidth})});
					});
				}
				tokenList.scrollToToken = function (index) {

				}
				tokenList.exportTokens = function () {
					// index
					// value
					// any properties like "best guess", "tag"
				}

				// tokens can have "best guess" and "fragment" properties


				// final
				tokenWrapper.setChildren([
					tokenList,
				]);

				resolve([tokenWrapper]);
			});
		}).then(function (components) {
			// base
			return UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie border'),
				appearance: args.appearance,
				children: components,
			});
		});
	},

	//////////// RENDERED TEXT FIELD
	// Displays the rendered version of a token field
	// Features:
	// 1. Tags are coloured differently
	// 2. Clicking on a word will take you to the token
	renderedTextField: function (id, args) {
		// styling
		var wrapperStyle, listStyle;
		if (args.options.horizontal) {
			wrapperStyle = {
				'height': 'calc(100% + 20px);',
				'width': 'auto',
				'overflow-x': 'scroll',
			}
			listStyle = {
				'width': 'auto',
				'height': '100%',
				'padding-bottom': '20px',
			}
		} else {
			wrapperStyle = {
				'height': '100%',
				'width': '100%',
				'overflow-y': 'hidden',
			}
			listStyle = {
				'width': 'calc(100% + 20px)',
				'padding-right': '20px',
				'overflow-y': 'scroll',
			}
		}

		// components
		return Promise.all([
			// base
			UI.createComponent(id, {
				template: UI.template('div', 'ie'),
				appearance: args.appearance,
			}),

			// wrapper
			UI.createComponent('{id}-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: wrapperStyle,
				},
			}),

			UI.createComponent('{id}-list'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: listStyle,
				},
			}),

		]).then(function (components) {
			// unpack components
			var base = components[0];
			var wrapper = components[1];
			var list = components[2];

			// methods and properties
			base.input = function (type, query, last) {
				var _this = list;
				// if an active token exists, the last char should be added to it.
				// if the last char is a space, The current token should be made inactive.
				// if no token exists, it should be created and made the active token.
				if (last !== ' ' && ['tag', 'normal'].contains(type)) {
					_this.token().then(function (token) {
						return new Promise(function(resolve, reject) {
							token.span.setAppearance({html: query.trim()});
							resolve();
						}).then(function () {
							return _this.fitToTokens();
						});
					});
				} else if (last === ' ') {
					_this.baseWidth += _this.activeWidth;
					_this.activeToken = undefined;
				}
			}
			list.currentIndex = 0;
			list.baseWidth = 0;
			list.width = 0;
			list.token = function () {
				var _this = list;
				if (_this.activeToken === undefined) {
					return Promise.all([
						// token
						UI.createComponent('{id}-token-{index}-wrapper'.format({id: _this.id, index: _this.currentIndex}), {
							template: UI.template('div', 'ie token'),
							appearance: {
								style: {
									'width': 'auto',
									'float': 'left',
									'height': '100%',
									'border-right': '1px solid #ccc',
									'padding': '10px',
								},
							},
						}),

						// span
						UI.createComponent('{id}-token-{index}-span'.format({id: _this.id, index: _this.currentIndex}), {
							template: UI.template('span', 'ie token span'),
						}),
					]).then(function (tokenComponents) {
							// unpack
							var token = tokenComponents[0];
							var span = tokenComponents[1];

							// methods and associations
							return new Promise(function(resolve, reject) {
								token.span = span;
								token.setChildren([span]);
								token.activate = function () {
									_this.activeToken = token;
									token.setAppearance({classes: {add: 'active'}});
								}
								token.deactivate = function () {
									_this.activeToken = undefined;
									token.setAppearance({classes: {remove: 'active'}});
								}

								// return
								resolve(token);
							});
					}).then(function (token) {
						_this.activeToken = token;
						_this.currentIndex++;
						return _this.setChildren([token]);
					}).then(function () {
						return _this.fitToTokens();
					}).then(function () {
						return new Promise(function(resolve, reject) {
							resolve(_this.activeToken);
						});
					});
				} else {
					return new Promise(function(resolve, reject) {
						resolve(_this.activeToken);
					});
				}
			}
			list.scrollToToken = function () {
				var _this = list;
			}
			list.fitToTokens = function () {
				var _this = list;
				return new Promise(function(resolve, reject) {
					_this.activeWidth = parseInt(_this.activeToken.model().css('width'));
					_this.width = _this.baseWidth + _this.activeWidth + 1;
					_this.model().css({'width': '{width}px'.format({width: _this.width})});
					resolve();
				});
			}
			list.exportTokens = function () {
				var _this = list;
			}

			// associate components
			wrapper.setChildren([
				list,
			]);

			base.setChildren([
				wrapper,
			]);

			// final
			return base;
		});;
	},

	sidebar: function (id, args) {
		return Promise.all([

			// main
			UI.createComponent('{id}-main'.format({id: id}), {
				template: UI.template('div', 'ie abs border-right centred-vertically'),
				appearance: {
					style: {
						'height': '70%',
						'width': '200px',
						'left': args.position.main.initial,
					},
				},
				children: args.children,
			}),

			// back
			UI.createComponent('{id}-back'.format({id: id}), {
				template: UI.template('div', 'ie abs border-right centred-vertically'),
				appearance: {
					style: {
						'height': '70%',
						'width': '50px',
						'left': args.position.back.initial,
					},
				},
				children: [
					UI.createComponent('{id}-back-button'.format({id: id}), {
						template: UI.template('div', 'ie button'),
						children: [
							UI.createComponent('{id}-back-button-span'.format({id: id}), {
								template: UI.template('span', 'glyphicon glyphicon-chevron-left'),
							}),
						],
						state: {
							stateMap: args.state.primary,
						},
						bindings: {
							'click': function (_this) {
								_this.triggerState();
							},
						}
					}),
				]
			}),

		]).then(function (components) {
			// unpack components
			var main = components[0];
			var back = components[1];

			return new Promise(function(resolve, reject) {

				// process states
				Object.keys(args.state).forEach(function (category) {
					var stateSet = args.state[category];
					if (!$.isArray(stateSet)) {
						stateSet = [stateSet];
					}

					// This structure sets up the sidebar to have primary, secondary, and deactivate states
					// These can be sets of states. Primary, main is active; secondary, back is active; deactivate, neither is active.
					stateSet.forEach(function (state) {
						if (category === 'primary') {
							main.addState({name: state, args: onOff(args.position.main.on)});
							back.addState({name: state, args: onOff(args.position.back.off)});
						} else if (category === 'secondary') {
							main.addState({name: state, args: onOff(args.position.main.off)});
							back.addState({name: state, args: onOff(args.position.back.on)});
						} else if (category === 'deactivate') {
							main.addState({name: state, args: onOff(args.position.main.off)});
							back.addState({name: state, args: onOff(args.position.back.off)});
						}
					});
				});
				resolve([main, back]);
			});
		}).then(function (components) {
			return UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie abstract'),
				appearance: {
					style: {
						'height': '100%',
					},
				},
				children: components,
			});
		});
	},
}
