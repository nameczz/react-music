import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import MusicList from 'components/MusicList'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

@connect(state => state)
@withRouter
class SingerDetail extends React.Component {
  state = {
    songs: []
  }
  componentWillMount() {
    this._getDetail()
  }

  _getDetail = () => {
    const { singer, history } = this.props
    if (!singer.id) {
      history.push('/singer')
      return
    }
    getSingerDetail(singer.id).then(res => {
      if (res.code === ERR_OK) {
        processSongsUrl(this._normalizeSongs(res.data.list)).then(songs => {
          this.setState({
            songs
          })
        })
      }
    })
  }

  _normalizeSongs = (list) => {
    let ret = []
    list.forEach(item => {
      let { musicData } = item
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })

    return ret
  }
  render() {
    const { name, avatar } = this.props.singer

    return <div>
      <MusicList
        bgImage={avatar}
        title={name}
        songs={this.state.songs}
      ></MusicList>
    </div>
  }
}

export default SingerDetail
