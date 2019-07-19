import React from 'react'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import Loading from 'components/Loading'
class HotKey extends React.Component {
  state = {
    hotKey: []
  }

  componentWillMount() {
    this._getHotKey()
  }

  _getHotKey = () => {
    getHotKey().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          hotKey: res.data.hotkey.slice(0, 10)
        })
      }
    })
  }

  render() {
    if (!this.state.hotKey.length) {
      return <Loading />
    }
    return (
      <div className="hot-key">
        <h1 className="title">热门搜索</h1>
        <ul>
          {this.state.hotKey.map(v => {
            return (
              <li
                className="item"
                onClick={() => {
                  this.props.addQuery(v.k)
                }}
                key={v.n}
              >
                <span>{v.k}</span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default HotKey
