base.input = function (type, query, last) {
	var _this = list;
	// if an active token exists, the last char should be added to it.
	// if the last char is a space, The current token should be made inactive.
	// if no token exists, it should be created and made the active token.
	if (last !== ' ' && ['tag', 'normal'].contains(type)) {
		return _this.token().then(function (token) {
			return new Promise(function(resolve, reject) {
				token.content = query.trim();
				token.span.setAppearance({html: '{query}&nbsp;'.format({query: token.content})});
				resolve();
			}).then(function () {
				return _this.fitToTokens();
			});
		});
	} else if (last === ' ') {
		return new Promise(function(resolve, reject) {
			_this.switch = true;
			resolve();
		});
	}
}
base.load = function (caption) {
	var _this = base;
	list.removeChildren().then(function () {
		return Promise.ordered(caption.split(' ').map(function (word) {
			return function () {
				return _this.input('normal', word, word.slice(-1)).then(function () {
					return _this.input('normal', ' ', ' ');
				});
			}
		}));
	});
}
base.next = function () {
	// get index of active token
	var activeIndexIncrement = list.activeToken.index + 1;

	// find token with this index and activate it.
	var children = list.children.filter(function (child) {
		return child.index == activeIndexIncrement;
	});

	if (children.length > 0) {
		var active = children[0];
		active.activate();
		list.switch = false;
	}
}
base.previous = function () {
	// get index of active token
	var activeIndexIncrement = list.activeToken.index - 1;

	// find token with this index and activate it.
	var children = list.children.filter(function (child) {
		return child.index == activeIndexIncrement;
	});

	if (children.length > 0) {
		var active = children[0];
		active.activate();
		list.switch = false;
	}
}
base.setState(args.state);
list.currentIndex = 0;
list.switch = true;
list.token = function () {
	var _this = list;
	if (_this.switch) {
		_this.switch = false;
		return Promise.all(args.options.token.components(_this)).then(base.tokenModifierFunction(_this)).then(function (token) {
			if (_this.activeToken !== undefined) {
				token.setAfter(_this.activeToken.id);
			}
			token.activate();
			_this.currentIndex++;
			return _this.setChildren([token]);
		}).then(function () {
			return _this.fitToTokens();
		}).then(function () {
			return new Promise(function(resolve, reject) {
				resolve(_this.activeToken);
			});
		});
	} else {
		return new Promise(function(resolve, reject) {
			resolve(_this.activeToken);
		});
	}
}
list.fitToTokens = function () {
	var _this = list;
	return new Promise(function(resolve, reject) {
		resolve();
	});
}
list.exportTokens = function () {
	var _this = list;
}
