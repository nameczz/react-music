import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

const SAVE_PLAY_LIST = 'SAVE_PLAY_LIST'
const SAVE_SEQUENCE_LIST = 'SAVE_SEQUENCE_LIST'
const SAVE_MODE = 'SAVE_MODE'
const SAVE_FULL_SCREEN = 'SAVE_FULL_SCREEN'
const SAVE_CURRENT_INDEX = 'SAVE_CURRENT_INDEX'
const SAVE_PLAYING_STATE = 'SAVE_PLAYING_STATE'

const initState = {
  playList: [], // 播放列表
  sequenceList: [], // 顺序播放的列表，备份 random切换
  fullScreen: false,
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 第几首
  playing: false // 是否播放,
}
export function playList(state = initState, action) {
  switch (action.type) {
    case SAVE_PLAY_LIST:
    case SAVE_SEQUENCE_LIST:
    case SAVE_MODE:
    case SAVE_FULL_SCREEN:
    case SAVE_PLAYING_STATE:
    case SAVE_CURRENT_INDEX:
      const ret = {
        ...state,
        ...action.data
      }
      const currentSong = ret.playList[ret.currentIndex] || {}
      return {
        ...ret,
        currentSong
      }

    default:
      return state
  }
}

export function savePlayList(playList) {
  return {
    type: SAVE_PLAY_LIST,
    data: { playList }
  }
}

export function saveSequenceList(sequenceList) {
  return {
    type: SAVE_SEQUENCE_LIST,
    data: { sequenceList }
  }
}

export function saveMode(mode) {
  return {
    type: SAVE_MODE,
    data: { mode }
  }
}

export function saveCurrentIndex(currentIndex) {
  return {
    type: SAVE_CURRENT_INDEX,
    data: { currentIndex }
  }
}

export function saveFullScreen(fullScreen) {
  return {
    type: SAVE_FULL_SCREEN,
    data: { fullScreen }
  }
}

export function savePlayingState(playing) {
  return {
    type: SAVE_PLAYING_STATE,
    data: { playing }
  }
}

export function selectPlay({
  playList,
  index,
  fullScreen = true,
  playing = true
}) {
  return (dispatch, getState) => {
    const { mode } = getState().playList
    if (mode === playMode.random) {
      let randomList = shuffle(playList)
      dispatch(savePlayList(randomList))
      index = findIndex(randomList, playList[index])
    } else {
      dispatch(savePlayList(playList))
    }
    dispatch(saveSequenceList(playList))
    dispatch(saveCurrentIndex(index))
    dispatch(saveFullScreen(fullScreen))
    dispatch(savePlayingState(playing))
  }
}

export function insertSong(song) {
  return (dispatch, getState) => {
    let {
      playList,
      sequenceList,
      currentIndex,
      currentSong
    } = getState().playList
    let fpIndex = findIndex(playList, song) // 要插入的点位是否已经存在
    currentIndex++
    playList.splice(currentIndex, 0, song)
    if (fpIndex > -1) {
      if (currentIndex > fpIndex) {
        playList.splice(fpIndex, 1)
        currentIndex--
      } else {
        playList.splice(fpIndex + 1, 1)
      }
    }

    let currentSIndex = findIndex(sequenceList, currentSong) + 1
    let fsIndex = findIndex(sequenceList, song)
    sequenceList.splice(currentSIndex, 0, song)

    if (fsIndex > -1) {
      if (currentSIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
      } else {
        sequenceList.splice(fsIndex + 1, 1)
      }
    }
    dispatch(savePlayList(playList))
    dispatch(saveSequenceList(sequenceList))
    dispatch(saveCurrentIndex(currentIndex))
    dispatch(saveFullScreen(true))
    dispatch(savePlayingState(true))
  }
}

export function clearSongs() {
  let playList = []
  return dispatch => {
    dispatch(saveCurrentIndex(-1))
    dispatch(savePlayList(playList))
    dispatch(saveSequenceList(playList))
    dispatch(savePlayingState(false))
  }
}

export function randomPlay({ playList }) {
  return dispatch => {
    dispatch(saveMode(playMode.randomPlay))
    dispatch(saveSequenceList(playList))
    dispatch(savePlayList(shuffle(playList)))
    dispatch(saveCurrentIndex(0))
    dispatch(saveFullScreen(true))
    dispatch(savePlayingState(true))
  }
}

function findIndex(list, song) {
  console.log(list)
  return list.findIndex(item => {
    return item.id === song.id
  })
}
