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
		Active.set('client', '799d79e4-5f55-41e5-b23f-a1566a4a8bff'),
		Active.set('role', 'a5f402bf-25e9-4194-8916-d1cd5b3dec4f'),
		Active.set('project', '3e7644eb-f187-4c02-995d-cf2c51fdb9b6'),
		Permission.set('a5f402bf-25e9-4194-8916-d1cd5b3dec4f'),
	]).then(function () {
		// return UI.changeState('client-state');
		// return UI.changeState('role-state');
		return UI.changeState('transcription-state');
	});
}).catch(function (error) {
	console.log(error);
});
