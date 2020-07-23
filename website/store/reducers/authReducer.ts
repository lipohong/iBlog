import { SET_AUTH } from '../../constants/actionTypes';

const initialState = {
  auth: {
    userId: "",
    jwt: ""
  }
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      
      return {
        ...state,
        auth: action.auth
      }
    default:
      return state;
  }
}

export default authReducer