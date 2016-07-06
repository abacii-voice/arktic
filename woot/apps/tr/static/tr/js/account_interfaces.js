var AccountInterfaces = {
	transcriptionInterface: function (id, args) {
		return Promise.all([
			Components.counter(),
			Components.scroll(),
			UI.createComponent('transcription-panel'),
			Components.audio(),
			Components.renderedTextField(),
			Components.renderedTextField(),
			Components.renderedTextField(),
			UI.createComponent('info-panel'),
			UI.createComponent('control-panel'),
			UI.createComponent('previous-button'),
			UI.createComponent('next-button'),
			UI.createComponent('done-button'),
			UI.createComponent('flags-button'),
		]).then(function (components) {
			// unpack components

		}).then(function () {

		});
	},
}
