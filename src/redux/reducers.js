import { disc } from './disc.redux'
import { singer } from './singer.redux'
import { playList } from './playList.redux'
import { history } from './history.redux'
import { combineReducers } from 'redux'

export default combineReducers({
  disc,
  playList,
  singer,
  musicHistory:history
})
