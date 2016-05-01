import React from 'react';
import Todo from './Todo';

export default class TodoList extends React.Component {
	renderList() {
		return this.props.todos.map((todo, index) => {
			return <Todo {...todo} key={index} onClick={() => this.props.onTodoClick(index)} />;
		});
	}

	render() {
		return (
			<ul>
				{this.renderList()}
			</ul>
		);
	}
}

TodoList.propTypes = {
	onTodoClick: React.PropTypes.func.isRequired,
	todos: React.PropTypes.arrayOf(React.PropTypes.shape({
		text: React.PropTypes.string.isRequired,
		completed: React.PropTypes.bool.isRequired
	})).isRequired
};