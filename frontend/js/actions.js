import uuid from 'uuid';

const URL = '/todos';
const TOKEN = 'mysecrettoken';

function saveTodos(todos) {
  return {
    type: 'SAVE_TODOS',
    todos
  };
}

export function fetchTodos() {
  return dispatch => {
    dispatch({ type: 'FETCHING' })
    fetch(URL, {
      headers: {
        'Authorization': TOKEN
      }
    })
    .then(response => {
      return response.json().then(json => dispatch(saveTodos(json.Items)))
    })
  }
}

export function postTodo() {
  return (dispatch, getState) => {
    const text = getState().form.text;
    fetch(URL, {
      headers: {
        'Authorization': TOKEN
      },
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
      headers: {
        'Authorization': TOKEN
      },
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
    type: 'TEXT_CHANGE',
    text: event.target.value
  };
}
