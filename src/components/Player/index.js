import React from 'react'
import { connect } from 'react-redux'
import './index.styl'

@connect(state => state)
class Player extends React.Component {
  render() {
    const { playList, currentIndex, fullScreen, playing } = this.props.playList
    const currentSong = playList[currentIndex] || {}
    console.log(fullScreen, currentSong)
    const normalPlayer = () => {
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
            <div className="back">
              <i className="icon-back" />
            </div>
            <h1 className="title">{currentSong.name}</h1>
            <h2 className="subtitle">{currentSong.singer}</h2>
          </div>
        </div>
      )
    }
    return <div className="player">{fullScreen ? normalPlayer() : null}</div>
  }
}

export default Player
