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
		// Active.set('client', '05ff19e5-446f-43cb-ae3e-8b2a3f7d5a40'),
		// Active.set('role', 'a48408d1-81cc-44da-927e-40d081f10e0b'),
		// Permission.set('a48408d1-81cc-44da-927e-40d081f10e0b'),
	]);
}).then(function () {
	return UI.changeState('client-state');
});
