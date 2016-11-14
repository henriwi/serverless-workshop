import { SAVE_TODOS } from '../constants/ActionTypes';

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
    fetch('https://idzo20hr52.execute-api.eu-central-1.amazonaws.com/prod/TestLambda',
       {mode: 'no-cors'})
    .then(response => {
        console.log("response", response);
        return dispatch(save([1,2,3,4]));
    })
    .then( stories => console.log(stories) );
  }
}
