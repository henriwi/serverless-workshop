import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CounterActions from '../actions/CounterActions';
import { fetchTodos } from '../actions.js';
import Counter from '../components/Counter';
import Footer from '../components/Footer';


class App extends Component {
    componentWillMount() {
        console.log(this.props);
        this.props.fetchTodos();
    }

    render() {
        // we can use ES6's object destructuring to effectively 'unpack' our props
        const { counter, actions } = this.props;
        return (
            <div className="main-app-container">
                <div className="main-app-nav">Simple Redux Boilerplate</div>
                {/* notice that we then pass those unpacked props into the Counter component */}
                <Counter counter={counter} actions={actions} />
                <Footer />
            </div>
        );
    }
}

App.propTypes = {
    counter: PropTypes.number.isRequired,
    //actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        counter: state.counter
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(CounterActions, dispatch),
        fetchTodos: () => dispatch(fetchTodos)

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps//{ fetchTodos }
)(App);
