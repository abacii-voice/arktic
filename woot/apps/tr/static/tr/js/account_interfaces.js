var AccountInterfaces = {
	transcriptionInterface: function (id, args) {
		return Promise.all([
			UI.createComponent('base'),

			// counter must have the following methods:
			// 1. increment
			// 2. decrement
			// 3. clear
			Components.counter(),

			// scroll must have the following methods:
			// 1. an external method placed inside the on-input function of the search input. DONE
			Components.scroll(),

			UI.createComponent('transcription-panel'),

			// audio requires the following methods:
			// 1.
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
			var base = components[0];
			var counter = components[1];
			var scroll = components[2];
			var transcriptionPanel = components[3];
			var tokens = components[4];
			var audio = components[5];
			var originalCaption = components[6];
			var modifiedCaption = components[7];
			var infoPanel = components[8];
			var controlPanel = components[9];
			var nextButton = components[10];
			var doneButton = components[11];
			var flagsButton = components[12];

			// add methods and properties
			

			// associate components
			transcriptionPanel.setChildren([
				tokens,
				audio,
				originalCaption,
				modifiedCaption,
			]);

			controlPanel.setChildren([
				nextButton,
				doneButton,
				flagsButton,
			]);

			base.setChildren([
				counter,
				scroll,
				transcriptionPanel,
				infoPanel,
				controlPanel,
			]);

			// return base
			return base;
		});
	},
}
