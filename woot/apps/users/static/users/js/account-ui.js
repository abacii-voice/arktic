// Define account interface elements with React
var App = React.createClass({
	render: function () {

		// define interface elements from structure
		var elements = this.props.structure.elements.map(function (elementPrototype) {
			return (
				<InterfaceElement prototype={elementPrototype} key={elementPrototype.id} />
			);
		});

		return (
			<div className={'app-wrapper'}>
				{elements}
			</div>
		);
	}
});

var InterfaceElement = React.createClass({
	render: function () {
		return (
			<div id={this.props.prototype.id} className={this.props.prototype.className}></div>
		);
	}
});

// Render to root hook
ReactDOM.render(
	<App structure={account_structure} />,
	document.getElementById('root')
);
