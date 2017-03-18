
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
