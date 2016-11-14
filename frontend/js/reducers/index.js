import { combineReducers } from 'redux';
import counter from './counter';

const rootReducer = combineReducers({
  counter, // you might be used to: counter: counter,
});

export default rootReducer;
