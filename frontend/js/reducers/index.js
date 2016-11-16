import { combineReducers } from 'redux';
import todos from './todos';
import form from './form';

const rootReducer = combineReducers({
  todos, // you might be used to: todos: todos,
  form
});

export default rootReducer;
