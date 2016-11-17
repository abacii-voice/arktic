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
	]);
}).then(function () {
	return Promise.all([
		Active.set('client', 'ef10b3e8-d1b4-4f0b-bc42-2e7688088aee'),
		Active.set('role', '465521bd-6760-4964-a5d8-13ff8976046d'),
		Active.set('project', '6bd2a2b4-4799-4a39-b1b9-15114c4460eb'),
		Permission.set('465521bd-6760-4964-a5d8-13ff8976046d'),
	]).then(function () {
		// return UI.changeState('client-state');
		// return UI.changeState('role-state');
		return UI.changeState('transcription-state');
	});
}).catch(function (error) {
	console.log(error);
});
