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
		Active.set('client', 'ebb9e77a-0ed1-412f-9579-83242186d63d'),
		Active.set('role', 'aecca9b9-09c5-4fee-ab40-bcc287142e3e'),
		Active.set('project', 'ee9dc4ca-34ad-4491-89d8-6f86625f60d6'),
		Permission.set('aecca9b9-09c5-4fee-ab40-bcc287142e3e'),
	]).then(function () {
		return UI.changeState('client-state');
		// return UI.changeState('role-state');
		// return UI.changeState('transcription-state');
	});
}).catch(function (error) {
	console.log(error);
});
