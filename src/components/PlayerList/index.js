import React from 'react'
import { playMode } from 'common/js/config'
import { connect } from 'react-redux'
import BetterScroll from 'components/BetterScroll'
import { CSSTransition } from 'react-transition-group'
import {
  selectPlay,
  savePlayingState,
  saveCurrentIndex,
  clearSongs
} from '@/redux/playList.redux'
import PropTypes from 'prop-types'
import './index.styl'
@connect(
  state => state,
  { selectPlay, savePlayingState, saveCurrentIndex, clearSongs }
)
class PlayerList extends React.Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   show: false
    // }
    this.bsRef = React.createRef()
    this.songRef = React.createRef()
  }

  componentDidUpdate() {
    if (!this.bsRef.current) {
      return
    }
    requestAnimationFrame(() => {
      console.log(this.bsRef)
      this.bsRef.current.refresh()
      // this.scrollToCurrent(this.props.playList.currentSong)
    })
  }

  // show = () => {
  //   this.setState({
  //     show: true
  //   })

  // }

  scrollToCurrent = song => {
    const index = this.props.playList.playList.findIndex(v => song.id === v.id)
    this.bsRef.current.scrollToElement(this.songRef.current[index], 300)
  }

  modeConfig = () => {
    const mode = this.props.playList.mode
    switch (mode) {
      case playMode.sequence:
        return {
          icon: 'icon-sequence',
          name: '顺序播放'
        }
      case playMode.loop:
        return {
          icon: 'icon-loop',
          name: '循环播放'
        }
      default:
        return {
          icon: 'icon-random',
          name: '随机播放'
        }
    }
  }

  getCurrentSong = song => {
    if (this.props.playList.currentSong.id === song.id) {
      return 'icon-play'
    }
  }

  deleteSong = e => {
    // e.preventDefault()
    e.stopPropagation()
    console.log(e)
    let songId = e.target.getAttribute('data-id')
    console.log(songId)
    const { playList, currentIndex, fullScreen, playing } = this.props.playList
    let newPlayList = playList.filter(v => v.id !== +songId)
    let index =
      currentIndex === newPlayList.length ? currentIndex - 1 : currentIndex
    this.props.selectPlay({ playList: newPlayList, index, fullScreen, playing })
  }

  handlePlayingState = index => {
    const { currentIndex, playing } = this.props.playList
    if (currentIndex === index) {
      this.props.savePlayingState(!playing)
      return
    }
    this.props.saveCurrentIndex(index)
    this.props.savePlayingState(true)
  }

  render() {
    const modeConfig = this.modeConfig()
    const sequenceList = () => {
      return (
        <ul>
          {this.props.playList.sequenceList.map((song, index) => {
            return (
              <li
                className="item"
                ref={this.songRef}
                key={song.id}
                onClick={() => {
                  this.handlePlayingState(index)
                }}
              >
                <i className={`${this.getCurrentSong(song)} current`} />
                <span className="text">{song.name}</span>
                <span className="like">
                  <i className="icon-not-favorite" />
                </span>
                <span
                  className="delete"
                  onClick={this.deleteSong}
                  data-id={song.id}
                >
                  <i className="icon-delete" />
                </span>
              </li>
            )
          })}
        </ul>
      )
    }
    return (
      <CSSTransition
        timeout={300}
        unmountOnExit
        classNames="list-fade"
        in={this.props.show}
      >
        <div className="playlist">
          <CSSTransition
            timeout={300}
            dismissible
            classNames="list-translate"
            in={this.props.show}
          >
            <div className="list-wrapper">
              <div className="list-header">
                <h1 className="title">
                  <i className={`${modeConfig.icon} icon`} />
                  <span className="text">{modeConfig.name}</span>
                  <span className="clear" onClick={this.props.clearSongs}>
                    <i className="icon-clear" />
                  </span>
                </h1>
              </div>
              <BetterScroll
                refreshTime={100}
                className="list-content"
                ref={this.bsRef}
                children={sequenceList()}
              />
              <div className="list-operate">
                <div className="add">
                  <i className="icon-add" />
                  <span className="text">添加歌曲到列表</span>
                </div>
              </div>
              <div className="list-close" onClick={this.props.handleCloseList}>
                关闭
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    )
  }
}

PlayerList.propTypes = {
  show: PropTypes.bool
}

PlayerList.defaultProps = {
  show: false
}

export default PlayerList
