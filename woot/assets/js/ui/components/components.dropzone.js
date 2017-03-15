
// initialise
var Components = (Components || {});

Components.dropzone = function (id, args) {
	return UI.createComponent(id, {
		name: args.name,
		template: UI.template('div', 'ie abs centred border border-radius'),
		appearance: {
			style: {
				'height': '100%',
				'width': '100%',
				'border-color': Color.grey.normal,
			},
		},
		children: [
			UI.createComponent('{id}-buttons'.format({id: id}), {
				name: 'buttons',
				template: UI.template('div', 'ie abs'),
				appearance: {
					style: {
						'bottom': '10px',
						'width': 'calc(100% - 20px)',
						'height': '40px',
						'margin-left': '10px',
					},
				},
				children: [
					UI.createComponent('{id}-file-button'.format({id: id}), {
						name: 'fileButton',
						template: UI.template('div', 'ie border border-radius'),
						appearance: {
							style: {
								'border-color': 'transparent',
								'background-color': Color.grey.uberlight,
								'height': '100%',
								'width': 'calc(50% - 5px)',
								'float': 'left',
								'text-align': 'center',
								'padding-top': '9px',
								'cursor': 'pointer',
							},
							html: 'Files',
						},
					}),
					UI.createComponent('{id}-folder-button'.format({id: id}), {
						name: 'folderButton',
						template: UI.template('div', 'ie border border-radius'),
						appearance: {
							style: {
								'border-color': 'transparent',
								'background-color': Color.grey.uberlight,
								'height': '100%',
								'width': 'calc(50% - 5px)',
								'margin-left': '10px',
								'float': 'left',
								'text-align': 'center',
								'padding-top': '9px',
								'cursor': 'pointer',
							},
							html: 'Folders',
						},
					}),
				],
			}),
			UI.createComponent('{id}-file-input'.format({id: id}), {
				name: 'files',
				template: UI.template('input', 'ie hidden'),
				appearance: {
					properties: {
						'type': 'file',
						'multiple': true,
					},
				},
			}),
			UI.createComponent('{id}-folder-input'.format({id: id}), {
				name: 'folders',
				template: UI.template('input', 'ie hidden'),
				appearance: {
					properties: {
						'type': 'file',
						'webkitdirectory': true,
						'directory': true,
					},
				},
			}),
		],
	}).then(function (base) {

		return Promise.all([
			base.setBindings({
				'mouseover': function (_this) {
					// any other effects involving text or whatever
					return _this.setAppearance({style: {'border-color': Color.grey.light}});
				},
				'mouseout': function (_this) {
					return _this.setAppearance({style: {'border-color': Color.grey.normal}});
				},
				'dragover': function (_this, event) {
					event.preventDefault();
					event.stopPropagation();
				},
				'dragleave': function (_this, event) {
					event.preventDefault();
					event.stopPropagation();
				},
				'drop': function (_this, event) {
					event.preventDefault();
					event.stopPropagation();
					var i, items = [], length = event.originalEvent.dataTransfer.items.length;
					for (i=0; i<length; i++) {
						let item = event.originalEvent.dataTransfer.items[i];
						let entry = item.webkitGetAsEntry();
						let entryData = {
							'isFile': entry.isFile,
							'name': entry.name,
						}
						if (entry.isFile) {
							entryData.file = item.getAsFile();
						} else {
							entryData.directory = entry;
						}
						items.push(entryData);
					}
					return base.external(items);
				},
			}),
			base.cc.buttons.cc.fileButton.setBindings({
				'click': function (_this) {
					event.stopPropagation();
					base.cc.files.model().click();
				},
			}),
			base.cc.buttons.cc.folderButton.setBindings({
				'click': function (_this) {
					event.stopPropagation();
					base.cc.folders.model().click();
				},
			}),
			base.cc.files.setBindings({
				'change': function (_this) {
					var Files = _this.element().files;
					var i, files = [], length = Files.length;
					for (i=0; i<length; i++) {
						files.push({
							'isFile': true,
							'file': Files[i],
						});
					}
					return base.external(files);
				},
			}),
			base.cc.folders.setBindings({
				'change': function (_this) {
					var Files = _this.element().files;
					var i, files = [], length = Files.length;
					for (i=0; i<length; i++) {
						files.push({
							'isFile': true,
							'file': Files[i],
						});
					}
					return base.external(files);
				},
			}),
		]).then(function () {
			return base;
		});
	});
}

// Dropzone.prototype._addFilesFromItems = function(items) {
// 	var entry, item, _i, _len, _results;
// 	_results = [];
// 	for (_i = 0, _len = items.length; _i < _len; _i++) {
// 		item = items[_i];
// 		if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
// 			if (entry.isFile) {
// 				_results.push(this.addFile(item.getAsFile()));
// 			} else if (entry.isDirectory) {
// 				_results.push(this._addFilesFromDirectory(entry, entry.name));
// 			} else {
// 				_results.push(void 0);
// 			}
// 		} else if (item.getAsFile != null) {
// 			if ((item.kind == null) || item.kind === "file") {
// 				_results.push(this.addFile(item.getAsFile()));
// 			} else {
// 				_results.push(void 0);
// 			}
// 		} else {
// 			_results.push(void 0);
// 		}
// 	}
// 	return _results;
// };
//
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

// Dropzone.prototype.addFile = function(file) {
// 	var _this = this;
// 	file.upload = {
// 		progress: 0,
// 		total: file.size,
// 		bytesSent: 0
// 	};
// 	this.files.push(file);
// 	file.status = Dropzone.ADDED;
// 	this.emit("addedfile", file);
// 	this._enqueueThumbnail(file);
// 	return this.accept(file, function(error) {
// 		if (error) {
// 			file.accepted = false;
// 			_this._errorProcessing([file], error);
// 		} else {
// 			file.accepted = true;
// 			if (_this.options.autoQueue) {
// 				_this.enqueueFile(file);
// 			}
// 		}
// 		return _this._updateMaxFilesReachedClass();
// 	});
// };

// uploadController.upload.accept
