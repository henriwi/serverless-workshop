import { SAVE_TODOS } from '../constants/actionTypes';

export default function counter(state = [1], action) {
  switch (action.type) {
  case SAVE_TODOS:
    return action.todos;
  default:
    return state;
  }
}
