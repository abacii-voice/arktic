UI.app('hook', [
	UserSignupApplication('us-application', {
		interface: {
			size: 50,
			margin: 10,
			corner: 5,
		},
	}),
]).then (function (app) {
	// render
	return app.render();
}).catch(function (error) {
	console.log(error);
});
