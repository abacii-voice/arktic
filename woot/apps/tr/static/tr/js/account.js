UI.app('hook', [
	// AccountInterfaces.unifiedInterface('unified-account-interface', {
	// 	interface: {
	// 		size: 50,
	// 		margin: 10,
	// 		corner: 5,
	// 	}
	// }),
	AccountInterfaces.testInterfaces.captionField('test', {
		appearance: {
			style: {
				'height': '100%',
			},
		},
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
	// return UI.changeState('transcription-state');
}).catch(function (error) {
	console.log(error);
});
