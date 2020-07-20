import { SET_PALETTETYPE, SET_THEME, SET_MESSAGE } from '../../constants/actionTypes';

const initialState = {
  paletteType: 'light',
  theme: 0,
  message: {
    content: '',
    open: false
  }
}

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PALETTETYPE:
      
      return {
        ...state,
        paletteType: action.paletteType
      }
    case SET_THEME:
    
      return {
        ...state,
        theme: action.theme
      }
    case SET_MESSAGE:
    
        return {
          ...state,
          message: action.message
        }
    default:
      return state;
  }
}

export default globalReducer