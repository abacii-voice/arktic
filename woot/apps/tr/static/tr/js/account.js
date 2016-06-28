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
						'position': 'relative',
						'height': '30px',
						'width': '400px',
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
