UI.app('hook', [
	AccountApplication('unified-account-interface', {
		interface: {
			size: 50,
			margin: 10,
			corner: 5,
		},
	}),
]).then (function (app) {
	// styles
	jss.set('.ie.button', {
		'padding-top': '1.0em',
		'width': '100%',
		'height': '50px',
		'-webkit-box-shadow': 'none',
		'box-shadow': 'none',
		'text-shadow': 'none',
		'color': Color.grey.normal,
	});
	jss.set('.ie.button:hover', {
		'color': Color.grey.light,
	});
	jss.set('.ie.border', {
		'border': '1px solid {color}'.format({color: Color.grey.normal}),
	});
	jss.set('.ie.border-radius', {
		'border-radius': '4px',
	});

	// render
	return app.render();
}).then(function () {
	return Promise.all([
		Context.get('clients'),
		Context.get('user'),
	]);
}).then(function () {
	return Promise.all([
		// client
		Context.get('clients').then(function (clients) {
			var clientId = Object.keys(clients).filter(function (key) {
				return clients[key].is_production;
			})[0];
			return Promise.all([
				Active.set('client', clientId),

				// role
				Context.get('user.clients.{client}.roles'.format({client: clientId})).then(function (roles) {
					var roleId = Object.keys(roles).filter(function (key) {
						return roles[key].type === 'worker';
					})[0];
					return Promise.all([
						// active
						Active.set('role', roleId),

						// project
						Context.get('user.clients.{client}.roles.{role}.project'.format({client: clientId, role: roleId})).then(function (project) {
							return Active.set('project', project);
						}),
					]);
				}),
			]);
		}),
	]).then(function () {
		return UI.changeState('client-state');
		// return UI.changeState('role-state');
		// return UI.changeState('transcription-state');
		// return UI.changeState('shortcut-state');
	});
}).catch(function (error) {
	console.log(error);
});
