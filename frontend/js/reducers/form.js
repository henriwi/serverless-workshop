import { KEY_CHANGE, TEXT_CHANGE } from '../constants/actionTypes';

export default function form(state = { key: '', text: '' }, action) {
  switch (action.type) {
  case KEY_CHANGE:
    debugger
    return Object.assign({}, state, { key: action.key });
  case TEXT_CHANGE:
    return Object.assign({}, state, { text: action.text });
  default:
    return state;
  }
}
