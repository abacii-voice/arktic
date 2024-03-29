var AccountComponents = (AccountComponents || {});
AccountComponents.uploadController = function () {
	var id = Util.makeid();
	return UI.createComponent('upload-controller-{}'.format({id: id}), {name: 'uploadController'}).then(function (base) {

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
						noRelfile: true, // true until a relfile is added
						noCaption: false,
					},
					final: {
						serverDuplicates: false,
					},
				},
			},
			buffer: {
				id: undefined,
				relfileIndex: 0, // counts relfiles added to upload
				audio: {},
				relfile: {
					entries: {},
				},
				addAudio: function (audioFile) {
					var filename = Util.basename(audioFile.name);
					base.upload.addingAudio = true;
					base.upload.buffer.audio[filename] = audioFile;
					return base.upload.buffer.update();
				},
				addRelfile: function (relfileContent) {
					return Util.ep().then(function () {
						// extract from file and determine if there are duplicates within a single file
						relfileContent.split('\n').forEach(function (line) {
							let [filename, caption] = line.split(',');
							filename = Util.basename(filename);
							if (filename.contains('.wav')) {
								if (filename in base.upload.buffer.relfile.entries) {
									if (base.upload.buffer.relfile.entries[filename].index === base.upload.buffer.relfileIndex) {
										// same file, flag duplicate
										base.upload.buffer.relfile.entries[filename].isDuplicate = true;
									} else {
										// different file, replace caption
										base.upload.buffer.relfile.entries[filename].index = base.upload.buffer.relfileIndex;
										base.upload.buffer.relfile.entries[filename].caption = caption;
									}
								} else {
									base.upload.buffer.relfile.entries[filename] = {
										index: base.upload.buffer.relfileIndex,
										caption: caption,
									}
								}
							}
						})
					}).then(function () {
						base.upload.buffer.relfileIndex++;
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
			addFile: function (file) {
				// can be csv, wav, zip, or other
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
			addDirectory: function (directory, name) {
				var directoryReader = directory.createReader();
				var readerFunction = function (entries) {
					var i, length = entries.length;
					for (i=0; i<length; i++) {
						let entry = entries[i];
						if (entry.isFile) {
							entry.file(function (file) {
								if (file.name.substring(0, 1) !== '.') {
									base.upload.addFile(file);
								}
							});
						} else if (entry.isDirectory) {
							base.upload.addDirectory(entry);
						}
					}
				}
				return new Promise(function(resolve, reject) {
					directoryReader.readEntries(readerFunction)
					resolve();
				});
			},
			accept: function (list) {
				return Promise.all(list.map(function (entry) {
					if (entry.isFile) {
						return base.upload.addFile(entry.file);
					} else {
						return base.upload.addDirectory(entry.directory, entry.name);
					}
				}));
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

// Dropzone.prototype._addFilesFromDirectory = function(directory, path) {
// 	var dirReader, entriesReader,
// 		_this = this;
// 	dirReader = directory.createReader();
// 	entriesReader = function(entries) {
// 		var entry, _i, _len;
// 		for (_i = 0, _len = entries.length; _i < _len; _i++) {
// 			entry = entries[_i];
// 			if (entry.isFile) {
// 				entry.file(function(file) {
// 					if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
// 						return;
// 					}
// 					file.fullPath = "" + path + "/" + file.name;
// 					return _this.addFile(file);
// 				});
// 			} else if (entry.isDirectory) {
// 				_this._addFilesFromDirectory(entry, "" + path + "/" + entry.name);
// 			}
// 		}
// 	};
// 	return dirReader.readEntries(entriesReader, function(error) {
// 		return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
// 	});
// };
