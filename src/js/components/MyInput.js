import React from 'react';

class MyInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultValue: props.defaultValue
		};
	}



	componentWillMount() {
		console.log('componentWillMount');
		// this.state.defaultValue = this.props.defaultValue;
	}

	_onchange() {
		// console.log(this);
		this.setState({defaultValue: 100});
	}

	render() {
		console.log('render');
		return (<input type="text" value={this.state.defaultValue} onChange={this._onchange.bind(this)} />);
	}
}

MyInput.defaultProps = {
	defaultValue: 10
};

export default MyInput;