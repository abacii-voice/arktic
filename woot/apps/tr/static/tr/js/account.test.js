// http://www.html5rocks.com/en/tutorials/es6/promises/ PROMISES

var Test = {
	tests: {
		test_recursive_promise: function () {

			var gtf = function (message) {
				return function (resolve, reject) {
					setTimeout(function () {
						// console.log(message);
						resolve();
					}, 1000);
				}
			}

			var test_structure = {
				'top1': {
					'bottom': {
						'reg': {
							'b1': gtf('1'),
						},
					},
					'reg': {
						'b2': gtf('2'),
					},
				},
				'top2': {
					'bottom': {
						'reg': {
							'b3': gtf('3'),
						},
					},
					'reg': {
						'b4': gtf('4'),
					},
				},
				'top3': {
					'bottom': {
						'reg': {
							'b5': gtf('5'),
						},
					},
					'reg': {
						'b6': gtf('6'),
					},
				},
			};

			var get = function (structure, path) {
				return new Promise(function (resolve, reject) {
					context_path = path.split('.');
					sub = structure;
					for (i=0; i<context_path.length; i++) {
						sub = sub[context_path[i]];
						if (sub === undefined) {
							break;
						}
					}

					resolve(sub);
				});
			}

			// console.log(get(test_structure, 'top1.bottom.reg'));

			var recursivePromise = function (parent, level) {
				return new Promise(function (resolve, reject) {
					parent = parent !== undefined ? parent : '';
					level = level !== undefined ? level : test_structure;

					if ('reg' in level) {
						return Promise.all(Object.keys(level.reg).map(function (key) {
							return new Promise(level.reg[key]);
						})).then(function () {
							return Promise.all(Object.keys(level).map(function (key) {
								if (key !== 'reg') {
									var get = '{parent}{dot}{path}'.format({parent: parent, dot: (parent !== '' ? '.' : ''), path: key});
									return recursivePromise(get, level[key]);
								}
							}));
						});
					} else {
						return Promise.all(Object.keys(level).map(function (key) {
							var get = '{parent}{dot}{path}'.format({parent: parent, dot: (parent !== '' ? '.' : ''), path: key});
							return recursivePromise(get, level[key]);
						}));
					}

					resolve(parent, level);
				});
			}

			recursivePromise();

		},

		test_registry: function () {
			// set data

			var setData = function () {
				return new Promise(function (resolve, reject) {
					// set stuff
					UI.globalState = 'state';
					UI.components = {
						'id1': {
							'id': 'id1',
						},
						'id2': {
							'id': 'id2',
						}
					};
					Registry.registry = {
						'state': {
							'clients': {
								'registered': {
									'id1': function (component, data) {
										return function (resolve, reject) {
											console.log(component, data);
											resolve('id1');
										}
									}
								},
								'6f56a306-cfa9-4557-bec9-f65bd2de67e0': {
									'registered': {
										'id2': function (component, data) {
											return function (resolve, reject) {
												console.log(component, data);
												resolve('id2');
											}
										}
									},
								}
							},
						},
					};
					resolve({set: 'done'});
				});
			}

			var runPromise = function () {
				return new Promise(function(resolve, reject) {
					return Registry.trigger();
				});
			}

			setData().then(function (status) {
				return runPromise();
			}).then(function (status) {
				console.log(status);
			});
		},

		test_promise_with_normal_stuff_inside: function () {
			new Promise(function(resolve, reject) {
				for (i=0; i<100; i++) {
					console.log(i);
				}
				resolve();
			}).then(function () {
				console.log('done');
			});
		},

		test_state_change: function () {
			new Promise(function(resolve, reject) {
				// set data
				UI.globalState = 'state';
				var c = UI.createComponent('id1', {
					registry: [
						{state: 'state1', path: 'clients', args: {force: false}, fn: function (_this, data) {
							return function (resolve, reject) {
								console.log('executing function for id1, state1, clients');
								resolve();
							}
						}},
					],
				});

				resolve();
			}).then(function () {
				// call state change
				return new Promise(function(resolve, reject) {
					UI.changeState('state1');
					resolve();
				});
			});
		},

		test_components: function () {
			UI.createComponent('a', {
				children: [
					UI.createComponent('b', {
						appearance: {
							style: {
								'height': '300px',
								'width': '300px',
								'border': '1px solid #ccc',
							},
						},
					}),
					UI.createComponent('c'),
					UI.createComponent('d'),
					UI.createComponent('e'),
					UI.createComponent('f'),
					UI.createComponent('g'),
				],
			}).then(function (component) {
				return component.render();
			}).catch(function (error) {
				console.log(error);
			});
		},

		test_app: function () {
			UI.app('hook', [
				UI.createComponent('a', {
					template: UI.template('a'),
					appearance: {
						classes: ['a'],
					},
					children: [
						UI.createComponent('c', {
							template: UI.template('a'),
						}),
						UI.createComponent('d', {
							template: UI.template('a'),
						}),
					],
				}),
				UI.createComponent('b'),
			]).then(function (app) {
				return app.render();
			}).then(function (app) {
				return UI.getComponent('a');
			}).then(function (component) {
				return component.removeChild('c');
			}).catch(function (error) {
				console.log(error);
			});
		},

		test_audio: function () {
			var url = '/media/audio/TestContractClient_p-TestProject_f-20150806082036x10317-uuid-5e3e9029-f863-4ec4-84_QSvgq20.wav';

			if('webkitAudioContext' in window) {
				var myAudioContext = new webkitAudioContext();
			}

			function bufferSound(event) {
				var request = event.target;
				var source = myAudioContext.createBufferSource();
				source.buffer = myAudioContext.createBuffer(request.response, false);
				console.log(request);
				source.connect(myAudioContext.destination);
				source.start(0);
			}

			request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.addEventListener('load', bufferSound, false);
			request.send();


		},

		test_audio_app: function () {

			// 1. define component tree
			UI.app('hook', [

				// COMPONENT TESTING
				// audio test
				UI.createComponent('test-audio-wrapper', {
					template: UI.template('div', 'ie border-radius'),
					appearance: {
						style: {
							'position': 'absolute',
							'height': '50px',
							'width': '500px',
							'left': '65%',
							'top': '17%',
							'transform': 'translate(-50%, -50%)',
						},
					},
					children: [
						Components.audio('test-audio', {
							appearance: {
								style: {

								},
							},
							registry: {
								'client-state': {
									path: 'clients',
									fn: function (_this) {
										_this.canvas.start();
										_this.update();
									}
								},
							},
							options: {

								// number of loads either side of current
								threshold: 4,

								// where to gather references
								source: {

									// adaptive location in Context to fetch audio references
									path: function () {
										return Promise.all([
											Active.get('client'),
											Active.get('project'),
										]).then(function (results) {
											// unpack variables
											var client = results[0];
											var project = results[1];

											// return path
											return 'clients.{client}.projects.{project}.transcriptions'.format({client: client, project: project});
										});
									},

									// fetch active token to filter transcription references
									token: function () {
										return Promise.all([
											Active.get('client'),
											Context.get('user').then(function (user) {
												return user.id;
											}),
											Permission.get(),
										]).then(function (results) {
											// unpack variable
											var client = results[0];
											var user_id = results[1];
											var role_id = results[2];

											return 'user.clients.{client}.roles.{role_id}.active_transcription_token'.format({client: client, role_id: role_id});
										});
									},
								},
							},
						}),
					],
				}),

			]).then (function (app) {
				return app.render();
			}).then(function () {
				return Promise.all([
					Context.get('clients').then(function (clients) {
						var productionClient = Object.keys(clients).filter(function (key) {
							return clients[key].is_production;
						})[0];
						var project = Object.keys(clients[productionClient].projects)[0];
						return Promise.all([
							Active.set('client', productionClient),
							Active.set('project', project),
							Context.get('user').then(function (user) {
								var workerRole = Object.keys(user.clients[productionClient].roles).filter(function (key) {
									return user.clients[productionClient].roles[key].type === 'worker';
								})[0];
								return Permission.set(workerRole);
							}),
						]);
					}),
				]);
			}).then(function () {
				return UI.changeState('client-state');
			}).catch(function (error) {
				console.log(error);
			});
		},

		test_autocomplete_app: function () {

			// 1. define component tree
			UI.app('hook', [

				// COMPONENT TESTING
				// autocomplete field
				UI.createComponent('test-autocomplete-wrapper', {
					template: UI.template('div', ''),
					appearance: {
						style: {
							'position': 'absolute',
							'height': '600px',
							'width': '300px',
							'left': '30%',
							'top': '50%',
							'transform': 'translate(-50%, -50%)',
						},
					},
					children: [
						Components.scroll('test-scroll', {
							appearance: {
								style: {
									'height': '100%',
									'width': '100%',
								}
							},

							// modifiers and features
							options: {

								// Simple text title
								title: 'Title',

								// If the data is to be sorted.
								sort: true,

								// This defines what is being searched for, i.e. paths in context.
								// This is the source of the data for the list.
								targets: {
									'clients': {
										// default targets are always displayed if no filter is applied
										default: false,

										// path in Context
										path: function () {
											return 'clients';
										},

										// filter to apply to request
										fltr: function () {
											return {};
										},

										// process search results from the path.
										process: function (data) {
											// expects structure like:
											// unit: {
											// 	id: 'id',
											// 	main: 'text',
											// 	tag: 'text',
											// 	index: '0',
											// },

											return new Promise(function(resolve, reject) {
												var results = Object.keys(data).map(function (key, index) {
													var client = data[key];
													return {
														id: key,
														main: client.name,
														index: index,
													}
												});

												resolve(results);
											});
										},

										// filter
										filter: {
											char: '/',
											key: 'forwardslash',
											display: 'Clients',
											button: 'Clients',
											rule: 'client',
										},
									},
								},

								// Defines the search bar.
								search: {
									// Autocomplete tells the filter panel (if present) to be shown first, else show nothing until a query is submitted.
									autocomplete: true,

									// Filter tells the element what structure to give to the filter panel, buttons, etc.
									filter: true,
								},

								// Define a way of display individual list items
								display: {
									list: function (_this, query) {
										return function (display) {
											// set main display
											var main = query !== undefined ? '{main}'.format({main: '{head}<span style="color:#fff;">{query}</span>{tail}'.format({
												head: display.main.substring(0, display.main.indexOf(query)),
												query: display.main.substr(display.main.indexOf(query), query.length),
												tail: display.main.substr(display.main.indexOf(query) + query.length),
											})}) : display.main;

											// 'data' is a single unit of the full dataset to be included.
											return UI.createComponent('{id}-{key}'.format({id: _this.id, key: display.id}), {
												root: _this.id,
												template: UI.template('div', 'ie button border-bottom'),
												appearance: {
													style: {
														'width': '100%',
														'height': '80px',
													},
												},
												children: [
													UI.createComponent('{id}-{key}-main'.format({id: _this.id, key: display.id}), {
														template: UI.template('span', 'ie'),
														appearance: {
															style: {

															},
															html: main,
														},
													}),
													UI.createComponent('{id}-{key}-index'.format({id: _this.id, key: display.id}), {
														template: UI.template('span', 'ie'),
														appearance: {
															style: {

															},
															html: '{index}'.format({index: display.index}),
														},
													}),
												],
											}).then(function (unit) {
												return unit.render();
											});
										}
									},
									filter: function (id) {
										return function (target, index) {
											var display = target.filter;
											return UI.createComponent('{id}-{key}'.format({id: id, key: display.key}), {
												index: index,
												root: id,
												template: UI.template('div', 'ie button border-bottom'),
												appearance: {
													style: {
														'width': '100%',
														'height': '60px',
														'padding-top': '20px',
													},
												},
												bindings: {
													// 'click' occurs on mouseup, so any blur will happen before it.
													// 'mousedown' occurs before 'blur'.
													'mousedown': function (_this) {
														_this.parent().then(function (parent) {
															parent.set(target);
														});
													},
												},
												children: [
													UI.createComponent('{id}-{key}-text'.format({id: id, key: display.key}), {
														template: UI.template('span'),
														appearance: {
															html: '"{char}" : {main}'.format({char: display.char, main: display.display}),
														},
													}),
												],
											});
										}
									},
								},
							},
						}),

					],
				}),

			]).then (function (app) {
				return app.render();
			}).then(function () {
				return Promise.all([
					Context.get('clients').then(function (clients) {
						var productionClient = Object.keys(clients).filter(function (key) {
							return clients[key].is_production;
						})[0];
						var project = Object.keys(clients[productionClient].projects)[0];
						return Promise.all([
							Active.set('client', productionClient),
							Active.set('project', project),
							Context.get('user').then(function (user) {
								var workerRole = Object.keys(user.clients[productionClient].roles).filter(function (key) {
									return user.clients[productionClient].roles[key].type === 'worker';
								})[0];
								return Permission.set(workerRole);
							}),
						]);
					}),
				]);
			}).then(function () {
				return UI.changeState('client-state');
			}).catch(function (error) {
				console.log(error);
			});
		},

		test_counter_app: function () {
			// 1. define component tree
			UI.app('hook', [

				// COMPONENT TESTING
				// counter
				UI.createComponent('counter-wrapper', {
					template: UI.template('div', ''),
					appearance: {
						style: {
							'position': 'absolute',
							'height': '600px',
							'width': '300px',
							'left': '60px',
							'top': '100px',
						},
					},
					children: [
						Components.counter('test-counter', {
							appearance: {
								style: {
									'height': '400px',
									'width': '100px',
								},
							},
							registry: {
								'client-state': {
									path: 'clients',
									fn: function (_this) {
										_this.load();
									}
								},
							},
							options: {
								source: {
									daily: function () {
										return Promise.all([
											Active.get('client'),
											Context.get('user').then(function (user) {
												return user.id;
											}),
											Permission.get(),
										]).then(function (results) {
											// unpack variable
											var client = results[0];
											var user_id = results[1];
											var role_id = results[2];

											return 'user.clients.{client}.roles.{role_id}.daily_count'.format({client: client, role_id: role_id});
										});
									},
									cycle: function () {
										return Promise.all([
											Active.get('client'),
											Context.get('user').then(function (user) {
												return user.id;
											}),
											Permission.get(),
										]).then(function (results) {
											// unpack variable
											var client = results[0];
											var user_id = results[1];
											var role_id = results[2];

											return 'user.clients.{client}.roles.{role_id}.cycle_count'.format({client: client, role_id: role_id});
										});
									},
								},
							},
						}),
					],
				}),

			]).then (function (app) {
				return app.render();
			}).then(function () {
				return Promise.all([
					Context.get('clients').then(function (clients) {
						var productionClient = Object.keys(clients).filter(function (key) {
							return clients[key].is_production;
						})[0];
						var project = Object.keys(clients[productionClient].projects)[0];
						return Promise.all([
							Active.set('client', productionClient),
							Active.set('project', project),
							Context.get('user').then(function (user) {
								var workerRole = Object.keys(user.clients[productionClient].roles).filter(function (key) {
									return user.clients[productionClient].roles[key].type === 'worker';
								})[0];
								return Permission.set(workerRole);
							}),
						]);
					}),
				]);
			}).then(function () {
				return UI.changeState('client-state');
			}).catch(function (error) {
				console.log(error);
			});
		},

		test_token_app: function () {
			// 1. define component tree
			UI.app('hook', [

				// COMPONENT TESTING
				// counter
				UI.createComponent('token-wrapper', {
					template: UI.template('div', 'ie'),
					appearance: {
						style: {
							'top': '100px',
							'left': '100px',
						},
					},
					children: [
						Components.textTokenField('test-text-token-field', {
							template: UI.template('div', 'ie border'),
							appearance: {
								style: {
									'height': '30px',
									'width': '400px',
									'overflow': 'hidden',
								},
							},
						}),
					],
				}),

			]).then (function (app) {
				return app.render();
			}).then(function () {
				return Promise.all([
					Context.get('clients').then(function (clients) {
						var productionClient = Object.keys(clients).filter(function (key) {
							return clients[key].is_production;
						})[0];
						var project = Object.keys(clients[productionClient].projects)[0];
						return Promise.all([
							Active.set('client', productionClient),
							Active.set('project', project),
							Context.get('user').then(function (user) {
								var workerRole = Object.keys(user.clients[productionClient].roles).filter(function (key) {
									return user.clients[productionClient].roles[key].type === 'worker';
								})[0];
								return Permission.set(workerRole);
							}),
						]);
					}),
				]);
			}).then(function () {
				return UI.changeState('client-state');
			}).catch(function (error) {
				console.log(error);
			});
		},

		test_when: function () {
			$.when(
				new Promise(function(resolve, reject) {
					resolve('hello1');
				}),
				new Promise(function(resolve, reject) {
					resolve('hello2');
				})
			).done(function (p1, p2) {
				console.log(p1, p2);
			});
		},
	},

	test: function () {

		Test.tests.test_when();

		// all
		// Object.keys(Test.tests).forEach(function (test) {
		// 	var fn = Test.tests[test];
		// 	fn();
		// });
	},
}
