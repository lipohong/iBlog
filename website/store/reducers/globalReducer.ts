import { SET_PALETTETYPE, SET_THEME, SET_MESSAGE, SET_PROGRESS_BAR_ON } from '../../constants/actionTypes';

const initialState = {
  paletteType: 'light',
  theme: 0,
  message: {
    content: '',
    open: false
  },
  progressBarOn: false
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
    case SET_PROGRESS_BAR_ON:

      return {
        ...state,
        progressBarOn: action.progressBarOn
      }
    default:
      return state;
  }
}

export default globalReducer