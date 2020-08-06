import { combineReducers } from 'redux';
import global from './globalReducer';
import auth from './authReducer';
import user from './userReducer';

export default combineReducers({
  global,
  auth,
  user
})
