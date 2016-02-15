var ComponentMixin = {

}


// Define account interface elements with React
var App = React.createClass({
	render: function () {
		return (
			<div className={'wrapper'}>
				{this.props.children}
			</div>
		);
	}
});

var Sidebar = React.createClass({
	getInitialState: function () {
		return {
			data: [],
			hidden: true,
		}
	},
	render: function () {
		return (
			<div className={this.props.className}>
				{this.props.children}
			</div>
		);
	}
});

var Panel = React.createClass({
	render: function () {
		return (
			<div className={'content-panel'}>
				{this.props.children}
			</div>
		);
	}
});

var Button = React.createClass({
	render: function () {
		return (
			<div className={'button'}></div>
		);
	}
});

// Widgets
var StartWidget = React.createClass({
	render: function () {}
});

var MessageWidget = React.createClass({
	render: function () {}
});

var StatsWidget = React.createClass({
	render: function () {}
});

// Render to hook
ReactDOM.render(
	<App>
		{/* Sidebars */}
		<Sidebar id={'back-sidebar'} className={'sidebar mini'}>
			<Button id={'bs-back-button'} />
		</Sidebar>

		<Sidebar id={'client-sidebar'} className={'sidebar'} />
		<Sidebar id={'role-sidebar'} className={'sidebar'} />

		{/* Panels */}
		<Panel id={'main-panel'} />
	</App>,
	document.getElementById('root')
);
