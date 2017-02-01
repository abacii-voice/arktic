
var AccountComponents = (AccountComponents || {});

AccountComponents.autocompleteControls = function (id, args) {
	return Promise.all([
		// base
		UI.createComponent(id, {

		}),

		// down arrow

		// magnifying glass

		// filter



		// arrow in the corner
		// filter button displaying current filter on the inside
		// 

	]).then(function (components) {
		var [
			base
		] = components;

		return Promise.all([

		]).then(function () {
			return base.setChildren();
		}).then(function () {
			return base;
		});
	});
}
