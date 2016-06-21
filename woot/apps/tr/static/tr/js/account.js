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
				'left': '30%',
				'top': '50%',
				'transform': 'translate(-50%, -50%)',
			},
		},
		children: [
			Components.counter('test-counter', {
				
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
