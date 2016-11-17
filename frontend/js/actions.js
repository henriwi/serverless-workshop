import { FETCHING, SAVE_TODOS, KEY_CHANGE, TEXT_CHANGE, URL } from './constants';
import uuid from 'uuid';

function saveTodos(todos) {
  return {
    type: SAVE_TODOS,
    todos
  };
}

export function fetchTodos() {
  return dispatch => {
    dispatch({ type: 'FETCHING' })
    fetch(URL, {mode: 'cors'})
    .then(response => {
      return response.json().then(json => dispatch(saveTodos(json.Items)))
    })
  }
}

export function postTodo() {
  return (dispatch, getState) => {
    const text = getState().form.text;
    fetch(URL, {
      mode: 'cors',
      method: 'post',
      body: JSON.stringify({
        key: uuid.v4(),
        text
      })
    })
    .then(response => {
        dispatch(fetchTodos())
    })
  }
}

export function deleteTodo(todo) {
  return dispatch => {
    fetch(URL, {
      mode: 'cors',
      method: 'delete',
      body: JSON.stringify(todo)
    })
    .then(response => {
        dispatch(fetchTodos())
    })
  }
}

export function textChange(event) {
  return {
    type: TEXT_CHANGE,
    text: event.target.value
  };
}
