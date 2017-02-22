var AccountComponents = (AccountComponents || {});
AccountComponents.uploadController = function () {
	var id = Util.makeid();
	return UI.createComponent('upload-controller-{}'.format({id: id})).then(function (base) {

		// controller logic
		base.upload = {
			error: {
				any: function () {
					return base.upload.error.initial() || base.upload.error.buffered() || base.upload.error.final();
				},
				initial: function () {
					return Object.keys(base.upload.error.categories.initial).reduce(function (condition, error) {
						return condition || base.upload.error.categories.initial[error];
					}, false);
				},
				buffered: function () {
					return Object.keys(base.upload.error.categories.buffered).reduce(function (condition, error) {
						return condition || base.upload.error.categories.buffered[error];
					}, false);
				},
				final: function () {
					return Object.keys(base.upload.error.categories.final).reduce(function (condition, error) {
						return condition || base.upload.error.categories.final[error];
					}, false);
				},
				categories: {
					initial: {
						relfileDuplicates: false,
					},
					buffered: {
						noRelfile: false,
						noCaption: false,
						notEnoughRelfileEntries: false,
					},
					final: {
						serverDuplicates: false,
					},
				},
			},
			buffer: {
				id: undefined,
				audio: {},
				relfile: {
					entries: {},
				},
				addAudio: function (audioFile) {
					base.upload.addingAudio = true;
					base.upload.buffer.audio[audioFile.name] = audioFile;
					return base.upload.buffer.update();
				},
				addRelfile: function (relfileContent) {
					return new Promise(function(resolve, reject) {
						relfileContent.split('\n').forEach(function (line) {
							let [filename, caption] = line.split(',');
							filename = Util.basename(filename);
							if (filename.contains('.wav')) {
								if (filename in base.upload.buffer.relfile.entries) {
									base.upload.buffer.relfile.entries[filename].isDuplicate = true;
									base.upload.error.relfileDuplicates = true;
								} else {
									base.upload.buffer.relfile.entries[filename] = {caption: caption};
								}
							}
						});
						resolve();
					}).then(function () {
						base.upload.addingRelfile = true;
						return base.upload.buffer.updateAudio();
					});
				},
				update: function () {
					return base.triggerState();
				},
				updateAudio: function () {
					return Promise.all(Object.keys(base.upload.buffer.audio).map(function (key) {
						return base.upload.buffer.addAudio(base.upload.buffer.audio[key]);
					})).then(function () {
						return base.upload.buffer.update();
					});
				},
				check: function () {
					// check for errors and accept or reject, then push

				},
				push: function () {
					// reset buffer
					// reset id
					// reset errors
				},
			},
			accept: function (file) {
				// sort by file type
				if (file.type === 'audio/wav') {
					// 1. add to buffer.audio
					base.upload.buffer.addAudio(file);
				} else if (file.type === 'text/csv' || file.name.contains('.csv')) {
					// 2. add to buffer.relfile
					var reader = new FileReader();
					reader.onload = function(e) {
						base.upload.buffer.addRelfile(e.target.result);
					}
					reader.readAsBinaryString(file);

				} else if (file.type === 'application/zip') {
					// 3. create zip object and unzip
					var zipReader = new FileReader();
					var zip = new JSZip();
					zipReader.onload = function (e) {
						// load zip
						zip.load(e.target.result);

						return Util.ep().then(function () {
							// 1. extract relfile
							var relfileData = Object.keys(zip.files).filter(function (key) {
								return key.contains('.csv');
							}).map(function (key) {
								return zip.file(key);
							})[0];
							if (relfileData) {
								base.upload.buffer.addRelfile(zip.file(relfileData.name).asText());
							}
						}).then(function () {
							// 2. extract audio files
							Object.keys(zip.files).filter(function (key) {
								return key.contains('.wav');
							}).forEach(function (key) {
								base.upload.buffer.addAudio(zip.file(key));
							});
						})
					}
					zipReader.readAsBinaryString(file);
				}
			},
			preUpload: function () {
				// send list of files and hash
			},
			start: function () {

			},
		}

		return Promise.all([

		]).then(function () {
			return base;
		});
	});
}
