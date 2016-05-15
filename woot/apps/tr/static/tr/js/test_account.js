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
	},

	test: function () {
		Object.keys(Test.tests).forEach(function (test) {
			var fn = Test.tests[test];
			fn();
		});
	},
}
