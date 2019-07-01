/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React from 'react'
import { List, Carousel } from 'antd-mobile'
import { getRecommend, getdiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'

import './index.styl'
import ListItem from 'antd-mobile/lib/list/ListItem'

class Recommend extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recommends: [],
      discList: []
    }
  }
  componentDidMount() {
    this.getRecommend()
    this.getDiscList()
  }

  getRecommend = () => {
    getRecommend().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          recommends: res.data.slider
        })
      }
    })
  }

  getDiscList() {
    getdiscList().then(res => {
      console.log(res)
      if (res.code === ERR_OK) {
        this.setState({
          discList: res.data.list
        })
      }
    })
  }
  render() {
    const listHeader = () => {
      return <h1 className="list-title">热门歌单推荐</h1>
    }
    return (
      <div className="recommend">
        <Carousel infinite>
          {this.state.recommends.map(music => {
            return (
              <a key={music.id} href={music.linkUrl}>
                <img
                  className="recommend-img"
                  alt="recommend "
                  src={music.picUrl}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'))
                    this.setState({ imgHeight: 'auto' })
                  }}
                />
              </a>
            )
          })}
        </Carousel>

        <List renderHeader={listHeader} className="recommend-list">
          {this.state.discList.map(song => {
            return (
              <ListItem className="item" thumb={song.imgurl}>
                <div className="text">
                  <h2 className="name">{song.creator.name}</h2>
                  <p className="desc">{song.dissname}</p>
                </div>
              </ListItem>
            )
          })}
        </List>
      </div>
    )
  }
}

export default Recommend
