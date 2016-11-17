import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchTodos, postTodo, textChange } from '../actions';

const Todos = ({ todos }) =>
  <ul>
    {todos.map(todo => <li key={todo.key}>{todo.text}</li>)}
  </ul>;

const App = ({ todos, form, fetchTodos, postTodo, textChange }) =>
  <div>
    <div className="main-app-nav">Lambda Todo</div>
    <button onClick={fetchTodos}>fetch</button>
    <br/>
    <Todos todos={todos} />
    <label htmlFor="text">Text</label>
    <input name="text" id="text" value={form.text} onChange={textChange} />
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
  { fetchTodos, postTodo, textChange }
)(App);
