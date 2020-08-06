import { SET_USER } from '../../constants/actionTypes';

const initialState = {
  user: {
    _id: '',
    username: '',
    email: '',
    userInfo: {
      avatar: '',
      description: ''
    }
  },
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      
      return {
        ...state,
        user: action.user
      }
    
    default:
      return state;
  }
}

export default userReducer