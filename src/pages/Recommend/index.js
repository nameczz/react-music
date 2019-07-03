/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React from 'react'
import { Carousel } from 'antd-mobile'
import { connect } from 'react-redux'
import { saveDisc } from '@/redux/music.redux'
import { getRecommend, getdiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Scroll from 'components/Scroll'
import BetterScroll from 'components/BetterScroll'
import './index.styl'

@connect(
  state => state,
  { saveDisc }
)
class Recommend extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
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

  handleRowClick = row => {
    const disc = JSON.parse(row.currentTarget.dataset.disc)
    this.props.saveDisc({ disc })
    this.props.history.push(`/recommend/${disc.dissid}`)
  }

  render() {
    const content = () => {
      return (
        <div className="recommend-content" style={{ width: this.state.width }}>
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
          <div className="recommend-list">
            <h1 className="list-title">热门歌单推荐</h1>
            <ul>
              {this.state.discList.map(disc => {
                return (
                  <li
                    key={disc.dissid}
                    className="item"
                    onClick={this.handleRowClick}
                    data-disc={JSON.stringify(disc)}
                  >
                    <div className="icon">
                      <img
                        alt="song"
                        width="60"
                        height="60"
                        src={disc.imgurl}
                      />
                    </div>
                    <div className="text">
                      <h2 className="name">{disc.creator.name}</h2>
                      <p className="desc">{disc.dissname}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )
    }

    // let index = 0
    // const row = (rowData, sectionID, rowID) => {
    //   if (!this.state.discList.length) {
    //     return <div>nothing</div>
    //   }
    //   const obj = this.state.discList[index++]
    //   return (
    //     <div
    //       className="item"
    //       key={rowID}
    //       onClick={this.handleRowClick}
    //       data-disc={JSON.stringify(obj)}
    //     >
    //       <div className="icon">
    //         <img alt="song" width="60" height="60" src={obj.imgurl} />
    //       </div>
    //       <div className="text">
    //         <h2 className="name">{obj.creator.name}</h2>
    //         <p className="desc">{obj.dissname}</p>
    //       </div>
    //     </div>
    //   )
    // }
    if (!this.state.discList.length) {
      return null
    }
    return (
      <div className="recommend">
        <BetterScroll children={content} />
      </div>
      // <Scroll
      //   listHeader={listHeader}
      //   row={row}
      //   dataSourceLen={this.state.discList.length}
      // />
    )
  }
}

export default Recommend
