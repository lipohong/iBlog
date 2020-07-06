import { SET_MODE } from '../../constants/actionTypes';
import { setModeAction } from '../../interfaces/actionTypes';

const initialState = {
  mode: 'day'
}

const globalReducer = (state = initialState, action: setModeAction) => {
  switch (action.type) {
    case SET_MODE:
      
      return {
        ...state,
        mode: action.mode
      }
    default:
      return state;
  }
}

export default globalReducer