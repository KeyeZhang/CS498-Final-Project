import { CHECK_IF_FAV } from '../actions/actionTypes';
//params: initial state
export default function(state = null, action){
  console.log(action.payload);
  switch(action.type){
    case CHECK_IF_FAV:
      return action.payload;
    default:
      return state;
  }
}
