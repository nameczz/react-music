import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import SongList from 'components/SongList'
import BetterScroll from 'components/BetterScroll'
import { selectPlay, randomPlay } from '@/redux/playList.redux'
import './index.styl'

const TITLE_HEIGHT = 40

@connect(
  state => state,
  { selectPlay, randomPlay }
)
@withRouter
class MusicList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: null,
      top: 0
    }
    this.bgImageRef = React.createRef()
    this.layerRef = React.createRef()
    this.playRef = React.createRef()
    this.bsRef = React.createRef()
  }
  componentDidMount() {
    this.imageHeight = this.bgImageRef.current.clientHeight
    this.minTranslateY = -this.imageHeight + TITLE_HEIGHT

    this.setState({
      height: document.documentElement.clientHeight - this.imageHeight,
      top: this.imageHeight
    })
  }

  componentDidUpdate() {
    this.handlePlayList()
  }

  handlePlayList = () => {
    if (!this.bsRef.current) return
    const bottom = this.props.playList.playList.length ? '60px' : ''
    this.bsRef.current.refs.wrapper.style.bottom = bottom
  }

  handleScroll = pos => {
    if (!this.layerRef.current) {
      return
    }
    const scrollY = pos.y
    let translateY = Math.max(this.minTranslateY, scrollY)
    let zIndex = 0
    let scale = 1
    const percent = Math.abs(scrollY / this.imageHeight)
    this.layerRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`
    if (scrollY > 0) {
      scale = 1 + percent
      zIndex = 10
      this.bgImageRef.current.style.paddingTop = '80%'
    }

    if (scrollY < this.minTranslateY) {
      zIndex = 10
      this.bgImageRef.current.style.paddingTop = 0
      this.bgImageRef.current.style.height = `${TITLE_HEIGHT}px`
      this.playRef.current.style.display = 'none'
    } else {
      this.bgImageRef.current.style.paddingTop = '70%'
      this.bgImageRef.current.style.height = 0
      this.playRef.current.style.display = ''
    }
    this.bgImageRef.current.style.zIndex = `${zIndex}`
    this.bgImageRef.current.style.transform = `scale(${scale})`
  }

  handleBackClick = () => {
    this.props.history.goBack()
  }

  handleSongClick = (song, index) => {
    console.log('song---click')
    this.props.selectPlay({ playList: this.props.songs, index })
  }

  render() {
    const { title, bgImage, songs } = this.props
    const content = () => {
      return (
        <div className="song-list-wrapper">
          <SongList songs={songs} handleSongClick={this.handleSongClick} />
        </div>
      )
    }
    return (
      <div className="music-list" ref={this.musicListRef}>
        <div className="back" onClick={this.handleBackClick}>
          <i className="icon-back" />
        </div>
        <h1 className="title">{title}</h1>
        <div className="bg-image" ref={this.bgImageRef}>
          <div className="play-wrapper">
            <div
              className="play"
              ref={this.playRef}
              onClick={() => {
                this.props.randomPlay({ playList: songs })
              }}
            >
              <i className="icon-play" />
              <span className="text">随机播放</span>
            </div>
          </div>
          <div
            className="filter"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        </div>
        <div className="bg-layer" ref={this.layerRef} />
        <BetterScroll
          className="list"
          top={this.state.top}
          children={content()}
          ref={this.bsRef}
          probeType={3}
          handleScroll={this.handleScroll}
        />
      </div>
    )
  }
}

MusicList.propTypes = {
  title: PropTypes.string,
  bgImage: PropTypes.string,
  songs: PropTypes.array
}

export default MusicList
