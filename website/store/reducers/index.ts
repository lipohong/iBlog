import { combineReducers } from 'redux';
import global from './globalReducer';
import blog from './blogReducer';

export default combineReducers({
  global,
  // blog
})
