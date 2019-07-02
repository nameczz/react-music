/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React from 'react'
import { Carousel, ListView } from 'antd-mobile'
import { getRecommend, getdiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'

import './index.styl'

function genData(pIndex = 0, NUM_ROWS = 0) {
  const dataBlob = {}
  for (let i = 0; i < NUM_ROWS; i++) {
    const ii = pIndex * NUM_ROWS + i
    dataBlob[`${ii}`] = `row - ${ii}`
  }
  return dataBlob
}
function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  )
}

class Recommend extends React.Component {
  constructor(props) {
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })

    this.state = {
      dataSource,
      isLoading: true,
      recommends: [],
      discList: [],
      height: document.documentElement.clientHeight - 94,
      width: document.documentElement.clientWidth
    }
  }
  componentDidMount() {
    this.getRecommend()
    this.getDiscList()
  }

  setDataSource = () => {
    this.rData = genData(0, this.state.discList.length)
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      isLoading: false
    })
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
        this.setState(
          {
            discList: res.data.list
          },
          this.setDataSource
        )
      }
    })
  }
  render() {
    const listHeader = () => {
      return (
        <div style={{ width: this.state.width }}>
          {this.state.recommends.length > 0 ? (
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
          ) : null}

          <h1 className="list-title">热门歌单推荐</h1>
        </div>
      )
    }

    let index = 0
    const row = (rowData, sectionID, rowID) => {
      if (!this.state.discList.length) {
        return <div>nothing</div>
      }
      if (index > this.state.length - 1) {
        index = 0
      }
      const obj = this.state.discList[index++]
      return (
        <div className="item" key={rowID}>
          <div className="icon">
            <img alt="song" width="60" height="60" src={obj.imgurl} />
          </div>
          <div className="text">
            <h2 className="name">{obj.creator.name}</h2>
            <p className="desc">{obj.dissname}</p>
          </div>
        </div>
      )
    }
    return (
      <ListView
        ref={el => (this.lv = el)}
        dataSource={this.state.dataSource}
        renderHeader={listHeader}
        renderBodyComponent={() => <MyBody />}
        renderRow={row}
        style={{
          height: this.state.height,
          overflow: 'auto'
        }}
        onScroll={() => {
          console.log('scroll')
        }}
        scrollRenderAheadDistance={500}
      />
    )
  }
}

export default Recommend
