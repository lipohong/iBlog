import { SET_PALETTETYPE } from '../../constants/actionTypes';
import { setPaletteTypeAction } from '../../interfaces/actionTypes';

const initialState = {
  paletteType: 'light'
}

const globalReducer = (state = initialState, action: setPaletteTypeAction) => {
  switch (action.type) {
    case SET_PALETTETYPE:
      
      return {
        ...state,
        paletteType: action.paletteType
      }
    default:
      return state;
  }
}

export default globalReducer