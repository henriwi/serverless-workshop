import { SAVE_TODOS } from '../constants/actionTypes';

const URL = 'https://idzo20hr52.execute-api.eu-central-1.amazonaws.com/prod/TestLambda';

export function save(todos) {
  return {
    type: SAVE_TODOS,
    todos
  };
}

export function fetchTodos() {
  console.log("lol")
  return dispatch => {
    console.log("lol1")
    fetch(URL,
       {mode: 'no-cors'})
    .then(response => {
        console.log("response", response);
        return dispatch(save([1,2,3,4]));
    })
    .then( stories => console.log(stories) );
  }
}

export function postTodo(key,text) {
  return dispatch => {
    fetch(URL,
       {mode: 'no-cors', method: 'post'})
    .then(response => {
        console.log("response", response);
        return dispatch(save([1,2,3,4,5]));
    })
    .then( stories => console.log(stories) );
  }
}
