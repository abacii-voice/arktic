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

	]);
}).then(function () {
	return UI.changeState('client-state');
});
