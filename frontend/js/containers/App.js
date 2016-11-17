import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchTodos, postTodo, deleteTodo, textChange } from '../actions';

const Todos = ({ todos, deleteTodo }) =>
  <ul>
    {todos.map(todo =>
      <li key={todo.key}>
        <span>{todo.text}</span> <button onClick={() => deleteTodo(todo) }>Slett</button>
      </li>)}
  </ul>;

const App = ({ todos, form, postTodo, deleteTodo, textChange }) =>
  <div>
    <div>Lambda Todo</div>
    <br/>
    <Todos todos={todos} deleteTodo={deleteTodo} />
    <input placeholder="Din todo" value={form.text} onChange={textChange} on />
    <br/>
    <button onClick={postTodo}>Add</button>
  </div>;

App.propTypes = {
  // counter: PropTypes.number.isRequired,
  // actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    todos: state.todos,
    form: state.form
  };
}

export default connect(
  ({todos, form}) => ({todos, form}),
  { postTodo, deleteTodo, textChange }
)(App);
