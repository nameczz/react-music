import { loadSearch, loadPlay } from 'common/js/cache'
const SAVE_SEARCH_HISTORY = 'SAVE_SEARCH_HISTORY'
const initState = {
  searchHistory: loadSearch(),
  playHistory: loadPlay()
}
export function history(state = initState, action) {
  switch (action.type) {
    case SAVE_SEARCH_HISTORY:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

export function saveSearchHistory(data) {
  return {
    type: SAVE_SEARCH_HISTORY,
    data
  }
}
