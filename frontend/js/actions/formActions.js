import { KEY_CHANGE, TEXT_CHANGE } from '../constants/actionTypes';

const URL = 'https://idzo20hr52.execute-api.eu-central-1.amazonaws.com/prod/TestLambda';

export function keyChange(event) {
  return {
    type: KEY_CHANGE,
    key: event.target.value
  };
}

export function textChange(event) {
  return {
    type: TEXT_CHANGE,
    text: event.target.value
  };
}

