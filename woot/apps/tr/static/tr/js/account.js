UI.app('hook', [
	// AccountInterfaces.unifiedInterface('unified-account-interface', {
	// 	interface: {
	// 		size: 50,
	// 		margin: 10,
	// 		corner: 5,
	// 	}
	// }),
	AccountInterfaces.testInterfaces.captionField('caption-test', {
		appearance: {

		},
	}),
]).then (function (app) {
	return app.render();
}).then(function () {
	return Promise.all([

	]);
}).then(function () {
	return UI.changeState('client-state');
}).catch(function (error) {
	console.log(error);
});
