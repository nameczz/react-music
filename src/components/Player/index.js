import React from 'react'
import { connect } from 'react-redux'
import {
  saveFullScreen,
  savePlayingState,
  saveCurrentIndex,
  savePlayList,
  saveMode
} from '@/redux/playList.redux'
import BetterScroll from 'components/BetterScroll'
import ProgressBar from 'components/ProgressBar'
import ProgressCircle from 'components/ProgressCircle'
import PlayerList from 'components/PlayerList'
import Lyric from 'lyric-parser'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { CSSTransition } from 'react-transition-group'
import './index.styl'

@connect(
  state => state,
  { saveFullScreen, savePlayingState, saveCurrentIndex, savePlayList, saveMode }
)
class Player extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: '',
      iconMode: playMode.sequence,
      showPlayerList: false
    }
    this.bsRef = React.createRef()
    this.audioRef = React.createRef()
    this.middleLeftRef = React.createRef()
    this.lyricLineRef = React.createRef()
    this.playListRef = React.createRef()
    this.touch = {}
  }

  componentDidMount() {
    this.getLyric()
  }

  shouldComponentUpdate() {
    const {
      playList,
      currentIndex,
      currentSong
    } = this.props.playList
    const {
      currentLyric
    } = this.state
    const newSong = playList[currentIndex] || {}
    if (!playList.length) {
      return null
    }
    if (newSong.id && newSong.id !== currentSong.id) {
      if (currentLyric) {
        currentLyric.stop() // 先停掉旧的歌词
        this.setState({
          currentLineNum: 0,
          playingLyric: '',
          currentTime: 0
        })
        return false
      }
    }
    return true
  }

  getSnapshotBeforeUpdate() {
    const { mode } = this.props.playList
    this.iconMode =
      mode === playMode.sequence
        ? 'icon-sequence'
        : mode === playMode.loop
          ? 'icon-loop'
          : 'icon-random'

    return true
  }

  componentDidUpdate(prevProps) {
    const {
      playing: playingState,
      currentIndex,
      playList
    } = this.props.playList
    const audio = this.audioRef.current
    if (!playList.length) {
      return
    }
    if (!this.state.currentLyric || currentIndex !== prevProps.playList.currentIndex) {
      this.getLyric()
    }
    if (audio) {
      playingState ? audio.play() : audio.pause()
    }
  }

  // controlAudio(prevProps){
  //   const prePlayingStatus = prevProps.props
  // }

  middleTouchStart = e => {
    const touch = e.touches[0]
    this.touch.initiated = true
    this.touch.startX = touch.pageX
    this.touch.startY = touch.pageY
  }

  middleTouchMove = e => {
    if (!this.touch.initiated) {
      return
    }
    const touch = e.touches[0]
    this.touch.deltaX = touch.pageX - this.touch.startX
    this.touch.deltaY = touch.pageY - this.touch.startY
    if (Math.abs(this.touch.deltaY) > Math.abs(this.touch.deltaX)) {
      return
    }
    // middle-r 的left 2种位置
    const left = this.state.currentShow === 'cd' ? 0 : -window.innerWidth
    const width = Math.min(
      0,
      Math.max(-window.innerWidth, left + this.touch.deltaX)
    )
    this.touch.percent = Math.abs(width / window.innerWidth)

    const lyricListDom = this.bsRef.current.refs.wrapper
    // vue组件通过$el
    lyricListDom.style.transform = `translate3d(${width}px, 0, 0)`
    lyricListDom.style.transitionDuration = 0
    this.middleLeftRef.current.style.opacity = 1 - this.touch.percent
    this.middleLeftRef.current.style.transitionDuration = 0
  }

  middleTouchEnd = e => {
    if (Math.abs(this.touch.deltaY) > Math.abs(this.touch.deltaX)) {
      return
    }
    let offsetWidth
    let opacity
    if (this.state.currentShow === 'cd') {
      if (this.touch.percent > 0.1) {
        offsetWidth = -window.innerWidth
        opacity = 0
        this.setState({
          currentShow: 'lyric'
        })
      } else {
        opacity = 1
        offsetWidth = 0
      }
    } else {
      if (this.touch.percent < 0.9) {
        offsetWidth = 0
        opacity = 1
        this.setState({
          currentShow: 'cd'
        })
      } else {
        opacity = 0
        offsetWidth = -window.innerWidth
      }
    }
    const time = 300
    const lyricListDom = this.bsRef.current.refs.wrapper

    lyricListDom.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
    lyricListDom.style.transitionDuration = `${time}ms`
    this.middleLeftRef.current.style.opacity = opacity
    this.middleLeftRef.current.style.transitionDuration = `${time}ms`
  }

  getLyric = () => {
    const { playing, currentSong } = this.props.playList
    if(!currentSong) return
    currentSong
      .getLyric()
      .then(lyric => {
        if (currentSong.lyric !== lyric) return
        this.setState(
          {
            currentLyric: new Lyric(lyric, this.handleLyric)
          },
          () => {
            if (playing) {
              this.state.currentLyric.play()
            }
          }
        )
      })
      .catch(e => {
        this.setState({
          currentLyric: null,
          playingLyric: '',
          currentLineNum: 0
        })
      })
  }

  handleLyric = ({ lineNum, txt }) => {
    if (!this.props.playList.fullScreen) {
      return
    }
    // console.log('in---handleLyric', this.bsRef)
    this.setState({
      currentLineNum: lineNum,
      playingLyric: txt
    })
    if (!this.bsRef.current) {
      return
    }
    if (lineNum > 5) {
      let lineEl =
        this.lyricLineRef.current && this.lyricLineRef.current[lineNum - 5]
      this.bsRef.current.scrollToElement(lineEl, 1000) // bs实例
    } else {
      this.bsRef.current.scrollTo(0, 0, 1000)
    }
  }

  back = () => {
    this.props.saveFullScreen(false)
  }

  _pad = (num, n = 2) => {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  }

  format = interval => {
    interval = interval | 0
    const minute = (interval / 60) | 0
    const second = interval % 60
    return `${minute}:${this._pad(second)}`
  }

  ready = () => {
    this.setState({
      songReady: true
    })
  }

  end = () => {
    if (this.mode === playMode.loop) {
      this.loop()
    } else {
      this.next()
    }
  }

  updateTime = e => {
    this.setState({
      currentTime: e.target.currentTime
    })
  }

  progressBarChange = percent => {
    const currentTime = this.props.playList.currentSong.duration * percent
    this.audioRef.current.currentTime = currentTime
    if (!this.props.playList.playing) {
      this.togglePlaying()
    }
    if (this.state.currentLyric) {
      this.state.currentLyric.seek(currentTime * 1000)
    }
  }

  changeMode = e => {
    const { sequenceList } = this.props.playList
    const mode = (this.props.playList.mode + 1) % 3
    this.props.saveMode(mode)
    let list = null
    list = mode === playMode.random ? shuffle(sequenceList) : sequenceList
    this.resetCurrentIndex(list)
    this.props.savePlayList(list)
  }

  resetCurrentIndex = list => {
    let index = list.findIndex(
      song => song.id === this.props.playList.currentSong.id
    )
    this.props.saveCurrentIndex(index)
  }

  togglePlaying = e => {
    e && e.stopPropagation()
    if (!this.state.songReady) {
      return
    }

    this.props.savePlayingState(!this.props.playList.playing)
    if (this.state.currentLyric) {
      this.state.currentLyric.togglePlay()
    }
  }
  loop() {
    this.audioRef.current.currentTime = 0
    this.audioRef.current.play()
    if (this.state.currentLyric) {
      this.state.currentLyric.seek(0)
    }
  }

  prev = e => {
    e && e.stopPropagation()
    if (!this.state.songReady) {
      return
    }
    const { mode, playList, currentIndex, playing } = this.props.playList
    if (mode === playMode.loop) {
      this.loop()
    } else {
      let index = currentIndex === 0 ? playList - 1 : currentIndex - 1
      this.props.saveCurrentIndex(index)
      if (!playing) {
        this.props.savePlayingState(true)
      }
      this.setState({
        songReady: false
      })
    }
  }

  next = e => {
    e && e.stopPropagation()
    if (!this.state.songReady) {
      return
    }
    const { mode, playList, currentIndex, playing } = this.props.playList
    if (mode === playMode.loop) {
      this.loop()
    } else {
      let index = currentIndex === playList.length - 1 ? 0 : currentIndex + 1
      this.props.saveCurrentIndex(index)
      if (!playing) {
        this.props.savePlayingState(true)
      }
      this.setState({
        songReady: false
      })
    }
  }

  showPlayerList = () => {
    this.setState({
      showPlayerList: true
    })
  }

  handleCloseList = () => {
    this.setState({
      showPlayerList: false
    })
  }

  render() {
    const {
      playList,
      fullScreen,
      playing,
      currentSong
    } = this.props.playList
    const {
      currentLyric,
      currentLineNum,
      currentShow,
      currentTime
    } = this.state
    if (!playList.length) {
      return null
    }


    const percent = currentTime / currentSong.duration

    const lyricList = () => {
      return (
        <div className="lyric-wrapper">
          {currentLyric ? (
            <div>
              {currentLyric.lines.map((line, index) => {
                return (
                  <p
                    ref={this.lyricLineRef}
                    key={index}
                    className={
                      currentLineNum === index ? 'current text' : 'text'
                    }
                  >
                    {line.txt}
                  </p>
                )
              })}
            </div>
          ) : null}
        </div>
      )
    }
    const cdStatus = playing ? 'play' : 'pause'

    const normalPlayer = () => {
      const disableCls = this.state.songReady ? '' : 'ready' // icon status
      const playIcon = playing ? 'icon-pause' : 'icon-play'
      return (
        <div className="normal-player">
          <div className="background">
            <img
              src={currentSong.image}
              height="100%"
              width="100%"
              alt="song background"
            />
          </div>
          <div className="top">
            <div className="back" onClick={this.back}>
              <i className="icon-back" />
            </div>
            <h1 className="title">{currentSong.name}</h1>
            <h2 className="subtitle">{currentSong.singer}</h2>
          </div>
          <div
            onTouchEnd={this.middleTouchEnd}
            onTouchStart={this.middleTouchStart}
            onTouchMove={this.middleTouchMove}
            className="middle"
          >
            <div className="middle-l" ref={this.middleLeftRef}>
              <div className="cd-wrapper" ref="cdWrapper">
                <div className={`${cdStatus} cd`}>
                  <img
                    src={currentSong.image}
                    alt="currentsong"
                    className="image"
                  />
                </div>
              </div>
              <div className="playing-lyric-wrapper">
                <div className="playing-lyric">{this.state.playingLyric}</div>
              </div>
            </div>
            <BetterScroll
              children={lyricList()}
              className="middle-r"
              ref={this.bsRef}
            />
          </div>
          <div className="bottom">
            <div className="dot-wrapper">
              <span className={currentShow === 'cd' ? 'active dot' : 'dot'} />
              <span
                className={currentShow === 'lyric' ? 'active dot' : 'dot'}
              />
            </div>
            <div className="progress-wrapper">
              <span className="time time-l">{this.format(currentTime)}</span>
              <div className="progress-bar-wrapper">
                <ProgressBar
                  percentChanges={this.progressBarChange}
                  percent={percent}
                />
              </div>
              <span className="time time-r">
                {this.format(currentSong.duration)}
              </span>
            </div>
            <div className="operators">
              <div className="icon i-left">
                <i className={this.iconMode} onClick={this.changeMode} />
              </div>
              <div className={`${disableCls} icon i-left`}>
                <i className="icon-prev" onClick={this.prev} />
              </div>
              <div className={`${disableCls} icon i-center`}>
                <i className={playIcon} onClick={this.togglePlaying} />
              </div>
              <div className={`${disableCls} icon i-right`}>
                <i onClick={this.next} className="icon-next" />
              </div>
              <div className="icon i-right">
                <i className="icon icon-not-favorite" />
              </div>
            </div>
          </div>
        </div>
      )
    }
    const miniPlayer = () => {
      const miniIcon = this.props.playList.playing
        ? 'icon-pause-mini'
        : 'icon-play-mini'
      const circleIcon = () => {
        return (
          <i onClick={this.togglePlaying} className={`${miniIcon} icon-mini`} />
        )
      }
      return (
        <div className="mini-player">
          <div className="icon" onClick={() => this.props.saveFullScreen(true)}>
            <img
              className={cdStatus}
              alt="song"
              src={currentSong.image}
              height="40"
              width="40"
            />
          </div>
          <div className="text">
            <h2 className="name">{currentSong.name}</h2>
            <p className="desc">{currentSong.singer}</p>
          </div>
          <div className="control">
            <ProgressCircle children={circleIcon()} />
          </div>
          <div className="control" onClick={this.showPlayerList}>
            <i className="icon-playlist" />
          </div>
        </div>
      )
    }
    return (
      <div className="player">
        <CSSTransition
          timeout={800}
          classNames="my-node"
          in={!fullScreen}
          unmountOnExit
        >
          {miniPlayer()}
        </CSSTransition>
        <CSSTransition
          timeout={800}
          classNames="my-node"
          in={fullScreen}
          unmountOnExit
        >
          {normalPlayer()}
        </CSSTransition>
        {currentSong ? (
          <audio
            ref={this.audioRef}
            onPlay={this.ready}
            onEnded={this.end}
            onTimeUpdate={this.updateTime}
            src={currentSong.url}
          />
        ) : null}
        <PlayerList
          show={this.state.showPlayerList}
          handleCloseList={this.handleCloseList}
        />
      </div>
    )
  }
}

export default Player
