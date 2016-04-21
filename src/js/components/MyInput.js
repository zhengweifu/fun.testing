import React from 'react';

export default class MyInput extends React.Component {
	constructor() {
		super();
		this.state = {
			defaultValue: 0
		}
	}

	componentWillMount() {
		console.log("componentWillMount");
		this.state.defaultValue = this.props.defaultValue;
	}

	_onchange() {
		// console.log(this);
		this.setState({defaultValue: 100});
	}

	render() {
		console.log("render");
		return <input type="text" value={this.state.defaultValue} onChange={this._onchange.bind(this)} />;
	}
}