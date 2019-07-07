import React from 'react'
import { connect } from 'react-redux'
import { saveFullScreen } from '@/redux/playList.redux'
import BetterScroll from 'components/BetterScroll'
import Lyric from 'lyric-parser'

import './index.styl'

@connect(state => state, { saveFullScreen })
class Player extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
    this.touch = {}

  }

  componentDidUpdate(prevProps){
    console.log(prevProps)
    const {playing: playingState} = this.props.playList
    const audio = this.refs.audio
    if(audio && playingState !== prevProps.playList.playing) {
      console.log(audio,playingState)
      playingState ? audio.play() : audio.pause()

    }
  }

  // controlAudio(prevProps){
  //   const prePlayingStatus = prevProps.props
  // }


  middleTouchStart = (e) => {
    console.log(e)
    const touch = e.touches[0]
    console.log(touch)
    this.touch.initiated = true
    this.touch.startX = touch.pageX
    this.touch.startY = touch.pageY
  }

  middleTouchMove = (e) => {
    if (!this.touch.initiated) {
      return
    }
    const lyricListDom = this.refs.lyricList.refs.wrapper
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
    console.log(this.refs.lyricList.refs)
    // vue组件通过$el
    lyricListDom.style.transform = `translate3d(${width}px, 0, 0)`
    lyricListDom.style.transitionDuration = 0
    this.refs.middleL.style.opacity = 1 - this.touch.percent
    this.refs.middleL.style.transitionDuration = 0
  }

  middleTouchEnd = (e) => {
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
    const lyricListDom = this.refs.lyricList.refs.wrapper

    lyricListDom.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
    lyricListDom.style.transitionDuration = `${time}ms`
    this.refs.middleL.style.opacity = opacity
    this.refs.middleL.style.transitionDuration = `${time}ms`
  }

  getLyric = () => {
    const { playing } = this.props.playList
    console.log(this.currentSong)
    this.currentSong
      .getLyric()
      .then(lyric => {
        console.log(lyric)
        this.setState({
          currentLyric: new Lyric(lyric, this.handleLyric)
        }, () => {
          if (playing) {
            this.state.currentLyric.play()
          }
        })

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
    console.log('in')
    this.setState({
      currentLineNum: lineNum,
      playingLyric: txt
    })
    // if (lineNum > 5) {
    //   let lineEl = this.refs.lyricLine[lineNum - 5]
    //   this.$refs.lyricList.scrollToElement(lineEl, 1000)
    // } else {
    //   this.$refs.lyricList.scrollTo(0, 0, 1000)
    // }
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

  format = (interval) => {
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
    console.log('end')
  }

  updateTime = (e) => {
    this.setState({
      currentTime: e.target.currentTime
    })
  }

  render() {
    const { playList, currentIndex, fullScreen, playing } = this.props.playList
    const { currentLyric, currentLineNum, currentShow, currentTime } = this.state
    const newSong = playList[currentIndex] || {}
    if (newSong.id && (!this.currentSong || newSong.id !== this.currentSong.id)) {
      this.currentSong = newSong
      this.getLyric()
      console.log(this.currentSong)
    }

    const lyricList = () => {
      return (
        <div className="lyric-wrapper">
          {
            currentLyric ? <div>
              {
                currentLyric.lines.map((line, index) => {
                  return (
                    <p key={index} className={currentLineNum === index ? 'current text' : 'text'}>
                      {line.txt}
                    </p>
                  )
                })
              }

            </div> : null
          }
        </div>
      )
    }

    const normalPlayer = () => {
      return (
        <div className="normal-player">
          <div className="background">
            <img
              src={this.currentSong.image}
              height="100%"
              width="100%"
              alt="song background"
            />
          </div>
          <div className="top">
            <div className="back" onClick={this.back}>
              <i className="icon-back" />
            </div>
            <h1 className="title">{this.currentSong.name}</h1>
            <h2 className="subtitle">{this.currentSong.singer}</h2>
          </div>
          <div
            onTouchEnd={this.middleTouchEnd}
            onTouchStart={this.middleTouchStart}
            onTouchMove={this.middleTouchMove}
            className="middle"
          >
            <div className="middle-l" ref="middleL">
              <div className="cd-wrapper" ref="cdWrapper">
                <div className="play cd">
                  <img src={this.currentSong.image} alt="currentsong" className="image"></img>
                </div>
              </div>
              <div className="playing-lyric-wrapper">
                <div className="playing-lyric">{this.state.playingLyric}</div>
              </div>
            </div>
            <BetterScroll children={lyricList()} className="middle-r" ref="lyricList">
            </BetterScroll>
          </div>
          <div className="bottom">
            <div className="dot-wrapper">
              <span
                className={currentShow === 'cd' ? 'active dot' : 'dot'}
              ></span>
              <span className={currentShow === 'lyric' ? 'active dot' : 'dot'}></span>
            </div>
            {/* <div className="progress-wrapper">
              <span className="time time-l">{this.format(currentTime)}</span>
              <div className="progress-bar-wrapper"></div>
              <span className="time time-r">{this.format(this.currentSong.duration)}</span>
            </div> */}
          </div>
        </div>
      )
    }
    return (<div className="player">{fullScreen ? normalPlayer() : null}
      {
        this.currentSong ? <audio
          ref="audio"
          onCanPlay={this.ready}
          onEnded={this.end}
          onTimeUpdate={this.updateTime}
          src={this.currentSong.url}></audio> : null
      }

    </div>)
  }
}

export default Player
