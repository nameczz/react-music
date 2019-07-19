const SAVE_DISC = 'SAVE_DISC'
const SAVE_TOP_LIST = 'SAVE_TOP_LIST'
const initState = {
  disc: {},
  topList: {}
}
export function disc(state = initState, action) {
  switch (action.type) {
    case SAVE_DISC:
    case SAVE_TOP_LIST:
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

export function saveTopList(data) {
  return {
    type: SAVE_TOP_LIST,
    data: { topList: data }
  }
}
