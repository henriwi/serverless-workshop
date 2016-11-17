import { SAVE_TODOS, KEY_CHANGE, TEXT_CHANGE, URL } from './constants';

function saveTodos(todos) {
  return {
    type: SAVE_TODOS,
    todos
  };
}

export function fetchTodos() {
  return dispatch => {
    fetch(URL, {mode: 'cors'})
    .then(response => {
      return response.json().then(json => dispatch(saveTodos(json.Items)))
    })
  }
}

export function postTodo(key,text) {
  return dispatch => {
    fetch(URL, {mode: 'no-cors', method: 'post'})
    .then(response => {
        //console.log("response", response);
        //return dispatch(saveTodos));
    })
  }
}

export function textChange(event) {
  return {
    type: TEXT_CHANGE,
    text: event.target.value
  };
}
