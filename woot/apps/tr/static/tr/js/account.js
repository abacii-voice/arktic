// LIST OF CHANGES

// ##### version 1:
// 1. App takes a single argument after the html element,
// 		which should be an application, but could easily be an explicit component tree. Can be callable or called.
// 2. Remove render step, which should be implicit in the app function
// 3. Move initialisation to AccountApplication

UI.app('hook', AccountApplication).catch(function (error) {
	console.log(error);
});
