var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.projectInterface = function (id, args) {
	return Promise.all([

		// base
		UI.createComponent(),

	]).then(function (components) {
		var [
			base,
		] = components;

		return Promise.all([
			
		]).then(function () {
			return base.setChildren([]);
		}).then(function () {
			return base;
		});
	});
}
