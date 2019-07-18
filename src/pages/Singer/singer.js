import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ListView from 'components/ListView/'
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import { saveSinger } from '@/redux/singer.redux'
import './singer.styl'

const HOT_NAME = '热门'
const HOT_LEN = 10

@connect(
  state => state,
  { saveSinger }
)
@withRouter
class SingerPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      singers: []
    }
  }

  componentWillMount() {
    this._getSingerList()
  }

  _normalizeSinger(list) {
    let map = {
      hot: {
        title: HOT_NAME,
        items: []
      }
    }
    list.forEach((item, index) => {
      if (index < HOT_LEN) {
        map.hot.items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        )
      }
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(
        new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        })
      )
    })
    // 为了得到有序列表
    let hot = []
    let ret = []
    for (let key in map) {
      let val = map[key]
      val.title.match(/[a-zA-Z0-9]/) ? ret.push(val) : hot.push(val)
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  }

  handleSelectSinger = singer => {
    this.props.history.push(`/singer/${singer.id}`)
    this.props.saveSinger(singer)
  }

  _getSingerList() {
    getSingerList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          singers: this._normalizeSinger(res.data.list)
        })
      }
    })
  }
  render() {
    return (
      <div className="singer">
        <ListView
          data={this.state.singers}
          selectItem={this.handleSelectSinger}
        />
      </div>
    )
  }
}

export default SingerPage
