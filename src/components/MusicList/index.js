import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SongList from 'components/SongList'
import BetterScroll from 'components/BetterScroll'
import { selectPlay } from '@/redux/playList.redux'

import './index.styl'

const TITLE_HEIGHT = 40

@connect(
  state => state,
  { selectPlay }
)
@withRouter
class MusicList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: null,
      top: 0
    }
  }
  componentDidMount() {
    this.imageHeight = this.refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + TITLE_HEIGHT

    this.setState({
      height: document.documentElement.clientHeight - this.imageHeight,
      top: this.imageHeight
    })
  }

  handleScroll = pos => {
    console.log(pos)
    const scrollY = pos.y
    let translateY = Math.max(this.minTranslateY, scrollY)
    let zIndex = 0
    let scale = 1
    const percent = Math.abs(scrollY / this.imageHeight)
    console.log(scrollY)
    this.refs.layer.style.transform = `translate3d(0, ${translateY}px, 0)`
    if (scrollY > 0) {
      scale = 1 + percent
      zIndex = 10
      this.refs.bgImage.style.paddingTop = '80%'
    }

    if (scrollY < this.minTranslateY) {
      zIndex = 10
      this.refs.bgImage.style.paddingTop = 0
      this.refs.bgImage.style.height = `${TITLE_HEIGHT}px`
      this.refs.play.style.display = 'none'
    } else {
      this.refs.bgImage.style.paddingTop = '70%'
      this.refs.bgImage.style.height = 0
      this.refs.play.style.display = ''
    }
    this.refs.bgImage.style.zIndex = `${zIndex}`
    this.refs.bgImage.style.transform = `scale(${scale})`
  }

  handleBackClick = () => {
    this.props.history.goBack()
  }

  handleSongClick = (song, index) => {
    this.props.selectPlay(this.props.songs, index)
  }

  render() {
    const { title, bgImage, songs } = this.props
    console.log(songs.length)
    const content = () => {
      return (
        <div className="song-list-wrapper">
          <SongList songs={songs} handleSongClick={this.handleSongClick} />
        </div>
      )
    }
    return (
      <div className="music-list">
        <div className="back" onClick={this.handleBackClick}>
          <i className="icon-back" />
        </div>
        <h1 className="title">{title}</h1>
        <div className="bg-image" ref="bgImage">
          <div className="play-wrapper">
            <div className="play" ref="play">
              <i className="icon-play" />
              <span className="text">随机播放</span>
            </div>
          </div>
          <div
            className="filter"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        </div>
        <div className="bg-layer" ref="layer" />
        <BetterScroll
          className="list"
          top={this.state.top}
          children={content()}
          ref="bsScroll"
          probeType={3}
          handleScroll={this.handleScroll}
        />
      </div>
    )
  }
}

export default MusicList
