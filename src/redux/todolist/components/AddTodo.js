import React, { findDOMNode } from 'react';

export default class AddTodo extends React.Component {
	handleClick(event) {
		const node = this.refs.input;
		const text = node.value.trim();
		this.props.onAddClick(text);
		node.value = '';
	}

	render() {
		return (
			<div>
				<input type='text' ref='input'/>
				<button onClick={this.handleClick.bind(this)}>Add</button>	
			</div>
		);
	}
}

AddTodo.propTypes = {
	onAddClick: React.PropTypes.func.isRequired
};