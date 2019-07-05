const SAVE_DISC = 'SAVE_DISC'
const initState = {
  disc: {}
}
export function disc(state = initState, action) {
  switch (action.type) {
    case SAVE_DISC:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

export function saveDisc(data) {
  return {
    type: SAVE_DISC,
    data
  }
}
