// http://www.html5rocks.com/en/tutorials/es6/promises/ PROMISES

var Test = {
	tests: {
		test_registry: function () {
			// set promise
			function setData () {
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
										console.log('state.clients.id1', data);
									}
								},
								'6f56a306-cfa9-4557-bec9-f65bd2de67e0': {
									'registered': {
										'id2': function (component, data) {
											console.log('state.clients.6f56a306-cfa9-4557-bec9-f65bd2de67e0.id2', data);
										}
									},
								}
							},
						},
					};
					resolve();
				});
			}

			// run promise
			function runPromise () {
				return Registry.trigger();
			}

			// assert promise
			function assertPromise () {
				return new Promise(function (resolve, reject) {
					// assert stuff
					resolve();
				});
			}

			// delete promise
			function deletePromise () {
				return new Promise(function (resolve, reject) {
					// delete stuff
					Context.context = {};
					resolve();
				});
			}

			setData().then(function () {
				return runPromise();
			}).then(function () {
				return assertPromise();
			}).then(function () {
				return deletePromise();
			}).then(function () {
				console.log('done');
			});
		}
	},

	test: function () {
		Object.keys(Test.tests).forEach(function (test) {
			var fn = Test.tests[test];
			fn();
		});
	},
}
