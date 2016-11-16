import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CounterActions from '../actions/CounterActions';
import * as todoActions from '../actions/todoActions';
import * as formActions from '../actions/formActions';


class App extends Component {
  render() {
    // we can use ES6's object destructuring to effectively 'unpack' our props
    const { todoActions, formActions, form } = this.props;
    console.log(this.props);
    return (
      <div className="main-app-container">
        <div className="main-app-nav">Lambda Todo</div>
        {/* notice that we then pass those unpacked props into the Counter component */}
        <button onClick={todoActions.fetchTodos}>fetch</button>
        <br/>
        <label htmlFor="key">Key</label>
        <input name="key" id="key" value={form.key} onChange={formActions.keyChange} />
        <br/>
        <label htmlFor="text">Text</label>
        <input name="text" id="text" value={form.text} onChange={formActions.textChange} />
        <br/>
        <button onClick={todoActions.postTodo}>Add</button>
      </div>
    );
  }
}

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

function mapDispatchToProps(dispatch) {
  return {
    todoActions: bindActionCreators(todoActions, dispatch),
    formActions: bindActionCreators(formActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
