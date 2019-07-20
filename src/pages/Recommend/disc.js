import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import MusicList from 'components/MusicList'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import './disc.styl'

import { getSongList } from 'api/recommend'

@withRouter
@connect(state => state)
class RecommendDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      songs: []
    }
  }
  componentWillMount() {
    console.log(this.props)
    if (!this.props.disc.disc.dissid) {
      this.props.history.push('/recommend')
      return
    }
    this.getSongList()
  }

  getSongList() {
    if (!this.props.disc.disc.dissid) {
      this.props.history.push('/recommend')
      return
    }
    getSongList(this.props.disc.disc.dissid)
      .then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(
            songs => {
              console.log(songs)
              this.setState({
                songs
              })
            }
          )
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  _normalizeSongs(list) {
    let ret = []
    list.forEach(musicData => {
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }

  render() {
    let disc = this.props.disc.disc
    return (
      <div className="detail">
        {this.state.songs.length > 0 ? (
          <MusicList
            title={disc.dissname}
            bgImage={disc.imgurl}
            songs={this.state.songs}
          />
        ) : null}
      </div>
    )
  }
}

export default RecommendDetail
