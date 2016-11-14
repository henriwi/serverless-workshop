import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CounterActions from '../actions/CounterActions';
import { fetchTodos } from '../actions/todoActions';


class App extends Component {
  render() {
    // we can use ES6's object destructuring to effectively 'unpack' our props
    const { counter, actions, fetchTodos } = this.props;
    return (
      <div className="main-app-container">
        <div className="main-app-nav">Lambda Todo</div>
        {/* notice that we then pass those unpacked props into the Counter component */}
        <button onClick={fetchTodos}>fetch</button>
      </div>
    );
  }
}

App.propTypes = {
  // counter: PropTypes.number.isRequired,
  //actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(CounterActions, dispatch),
    fetchTodos: () => dispatch(fetchTodos(dispatch))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps//{ fetchTodos }
)(App);
