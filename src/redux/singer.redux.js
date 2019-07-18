const SAVE_SINGER = 'SAVE_SINGER'
const initState = {
  singer: {}
}
export function singer(state = initState, action) {
  switch (action.type) {
    case SAVE_SINGER:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

export function saveSinger(data) {
  return {
    type: SAVE_SINGER,
    data
  }
}
