import React from 'react'
import { playMode } from 'common/js/config'
import { connect } from 'react-redux'
import BetterScroll from 'components/BetterScroll'
import './index.styl'
@connect(state => state)
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
    console.log(this.songRef)
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

  render() {
    if (!this.props.show) {
      return null
    }
    const modeConfig = this.modeConfig()
    const sequenceList = () => {
      return (
        <ul>
          {this.props.playList.sequenceList.map(song => {
            return (
              <li className="item" ref={this.songRef} key={song.id}>
                <i className={`${this.getCurrentSong(song)} current`} />
                <span className="text">{song.name}</span>
                <span className="like">
                  <i className="icon-not-favorite" />
                </span>
                <span className="delet">
                  <i className="icon-delete" />
                </span>
              </li>
            )
          })}
        </ul>
      )
    }
    return (
      <div className="playlist">
        <div className="list-wrapper" onClick={e => e.stopPropagation()}>
          <div className="list-header">
            <h1 className="title">
              <i className={`${modeConfig.icon} icon`} />
              <span className="text">{modeConfig.name}</span>
              <span className="clear">
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
        </div>
      </div>
    )
  }
}

export default PlayerList
