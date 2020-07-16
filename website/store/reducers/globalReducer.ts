import { SET_PALETTETYPE, SET_THEME } from '../../constants/actionTypes';

const initialState = {
  paletteType: 'light',
  theme: 0
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
    default:
      return state;
  }
}

export default globalReducer