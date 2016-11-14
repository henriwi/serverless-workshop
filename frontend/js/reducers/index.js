import { combineReducers } from 'redux';
import todos from './todos';

const rootReducer = combineReducers({
  todos, // you might be used to: todos: todos,
});

export default rootReducer;
