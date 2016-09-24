UI.app('hook', [
	AccountInterfaces.unifiedInterface('unified-account-interface', {
		interface: {
			size: 50,
			margin: 10,
			corner: 5,
		},
		colour: {

		},
	}),
]).then (function (app) {
	return app.render();
}).then(function () {
	return Promise.all([
		Context.get('clients'),
		Context.get('user'),
		// Active.set('client', '030c6bd1-e37c-4af7-a6d7-89d05bf3bc57'),
		// Active.set('role', '5e84c20d-b52c-4acc-af43-8c1ad7091ea8'),
		// Permission.set('5e84c20d-b52c-4acc-af43-8c1ad7091ea8'),
	]);
}).then(function () {
	return UI.changeState('client-state');
}).catch(function (error) {
	console.log(error);
});
