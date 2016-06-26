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
