import React from 'react';
import { connect } from 'react-redux';
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import Footer from '../components/Footer';

class App extends React.Component {
	render() {
		const { dispatch, visibleTodos, visibilityFilter } = this.props;
		return (
			<div>
				<AddTodo 
					onAddClick={(text) => {
						dispatch(addTodo(text));
					}}
				/>
				<TodoList 
					todos={this.props.visibleTodos}
					onTodoClick={(index) => {
						dispatch(completeTodo(index));
					}} 
				/>
				<Footer 
					filter={this.props.visibilityFilter}
					onFilterChange={(filter) => {
						dispatch(setVisibilityFilter(filter));
					}}
				/>
			</div>
		);
	}
}

App.propTypes = {
	visibleTodos: React.PropTypes.arrayOf(React.PropTypes.shape({
		text: React.PropTypes.string.isRequired,
		completed: React.PropTypes.bool.isRequired
	}).isRequired).isRequired,
	visibilityFilter: React.PropTypes.oneOf([
		'SHOW_ALL',
		'SHOW_COMPLETED',
		'SHOW_ACTIVE'
	]).isRequired
};

function selectTodos(todos, filter) {
	switch(filter) {
	case VisibilityFilters.SHOW_ALL:
		return todos;
	case VisibilityFilters.SHOW_COMPLETED:
		return todos.filter((todo) => todo.completed);
	case VisibilityFilters.SHOW_ACTIVE:
		return todos.filter((todo) => !todo.completed);
	}
}

function mapStateToProps(state) {
	console.log(state);
	return {
		visibleTodos: selectTodos(state.todos, state.visibilityFilter),
		visibilityFilter: state.visibilityFilter
	};
}

export default connect(mapStateToProps)(App);