import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import BetterScroll from 'components/BetterScroll'
import Loading from 'components/Loading'
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { saveTopList } from '@/redux/disc.redux'
import './rank.styl'
@connect(
  state => state,
  { saveTopList }
)
@withRouter
class Rank extends React.Component {
  state = {
    topList: []
  }

  componentWillMount() {
    this._getTopList()
  }

  selectItem(item) {
    this.props.history.push(`/rank/${item.id}`)
    this.props.saveTopList(item)
  }

  _getTopList = () => {
    getTopList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          topList: res.data.topList
        })
        console.log(res.data.topList)
      }
    })
  }

  render() {
    if (!this.state.topList.length) {
      return <Loading />
    }
    const content = () => {
      return (
        <ul>
          {this.state.topList.map(item => {
            return (
              <li
                className="item"
                onClick={() => {
                  this.selectItem(item)
                }}
                key={item.id}
              >
                <div className="icon">
                  <img width="100" height="100" src={item.picUrl} alt="disc" />
                </div>
                <ul className="songlist">
                  {item.songList.map((song, index) => {
                    return (
                      <li className="song" key={song.songname}>
                        <span>{index + 1}</span>
                        <span>
                          {song.songname}-{song.singername}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      )
    }
    return (
      <div className="rank">
        <BetterScroll className="toplist" children={content()} />
      </div>
    )
  }
}

export default Rank
