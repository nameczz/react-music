import { disc } from './disc.redux'
import { playList } from './playList.redux'
import { combineReducers } from 'redux'

export default combineReducers({
  disc,
  playList
})
