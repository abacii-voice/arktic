// LIST OF CHANGES

// ##### version 1:
// 1. App takes a single argument after the html element,
// 		which should be an application, but could easily be an explicit component tree. Can be callable or called.
// 2. Remove render step, which should be implicit in the app function
// 3.

UI.app('hook', AccountApplication).then(function (application) {

	// By this point, the rendering has taken place, but no state has been called.
	return application.initialise();
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
						return roles[key].type === 'admin';
					})[0];
					return Promise.all([
						// active
						Active.set('role', roleId),

						// project
						// Context.get('user.clients.{client}.roles.{role}.project'.format({client: clientId, role: roleId})).then(function (project) {
						// 	return Active.set('project', project);
						// }),
					]);
				}),
			]);
		}),
	]).then(function () {
		// return UI.changeState('client-state');
		// return UI.changeState('control-state');
		// return UI.changeState('transcription-state');
		// return UI.changeState('shortcut-state');
		return UI.changeState('project-state');
	});
}).catch(function (error) {
	console.log(error);
});
