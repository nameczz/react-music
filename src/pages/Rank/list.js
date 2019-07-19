import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MusicList from 'components/MusicList/'
import Loading from 'components/Loading'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

@withRouter
@connect(state => state)
class List extends React.Component {
  state = {
    songs: [],
    rank: true
  }
  componentWillMount() {
    this._getMusicList()
  }

  _getMusicList = () => {
    const { disc, history } = this.props
    console.log(this.props)
    if (!disc.topList.id) {
      history.push('/rank')
      return
    }
    getMusicList(disc.topList.id).then(res => {
      if (res.code === ERR_OK) {
        processSongsUrl(this._normalizeSongs(res.songlist)).then(songs => {
          this.setState({
            songs
          })
        })
      }
    })
  }

  _normalizeSongs = list => {
    let ret = []
    list.forEach(item => {
      const musicData = item.data
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }

  render() {
    if (!this.state.songs.length) {
      return <Loading />
    }
    const { picUrl: bgImage, topTitle: title } = this.props.disc.topList
    return (
      <div>
        <MusicList songs={this.state.songs} bgImage={bgImage} title={title} />
      </div>
    )
  }
}

export default List
