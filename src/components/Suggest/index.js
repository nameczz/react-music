import React from 'react'
import PropTypes from 'prop-types'
import BetterScroll from 'components/BetterScroll'
import Loading from 'components/Loading'
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import Singer from 'common/js/singer'

import './index.styl'

const TYPE_SINGER = 'singer'
const PERPAGE = 20

class Suggest extends React.Component {
  state = {
    page: 1,
    result: [],
    hasMore: true,
    pullup: true,
    beforeScroll: true
  }
  componentDidMount() {
    this.searchResult()
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.query !== prevProps.query)
    if (this.props.query !== prevProps.query) {
      this.searchResult()
    }
  }

  selectItem = () => {}
  getIconCls = item => {
    if (item.type === TYPE_SINGER) {
      return 'icon-mine'
    } else {
      return 'icon-music'
    }
  }
  getDisplayName(item) {
    if (item.type === TYPE_SINGER) {
      return item.singername
    } else {
      return `${item.name}-${item.singer}`
    }
  }
  searchResult = () => {
    this.setState({
      page: 1,
      hasMore: true
    })

    // this.$refs.suggest.scrollTo(0, 0)
    search(this.props.query, this.state.page, this.props.showSinger, PERPAGE)
      .then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data)
          this._genResult(res.data).then(result => {
            console.log(result)
            this.setState({
              result
            })
          })
          this._checkMore(res.data)
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  searchMore = () => {
    if (!this.state.hasMore) {
      return
    }
    this.setState({
      page: this.state.page + 1
    })
    search(
      this.props.query,
      this.state.page,
      this.props.showSinger,
      PERPAGE
    ).then(res => {
      if (res.code === ERR_OK) {
        this._genResult(res.data).then(result => {
          console.log(result)
          this.setState({
            result: this.state.result.concat(result)
          })
        })
        this._checkMore(res.data)
      }
    })
  }

  _genResult = data => {
    let ret = []
    if (data.zhida && data.zhida.singerid) {
      ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
    }
    return processSongsUrl(this._normalizeSongs(data.song.list)).then(songs => {
      ret = ret.concat(songs)
      return ret
    })
  }

  _normalizeSongs = list => {
    let ret = []
    list.forEach(musicData => {
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }

  _checkMore = data => {
    const song = data.song
    if (
      !song.list.length ||
      song.curnum + song.curpage * PERPAGE >= song.totalnum
    ) {
      this.setState({
        hasMore: false
      })
    }
  }

  render() {
    const { result, hasMore } = this.state
    const content = () => {
      return (
        <React.Fragment>
          <ul className="suggest-list">
            {result.map(item => {
              return (
                <li
                  className="suggest-item"
                  key={`${item.id}${item.mid}`}
                  onClick={this.selectItem}
                >
                  <div className="icon">
                    <i className={this.getIconCls(item)} />
                  </div>
                  <div className="name">
                    <p className="text">{this.getDisplayName(item)} </p>
                  </div>
                </li>
              )
            })}
            {hasMore && <Loading title={''} />}
          </ul>
        </React.Fragment>
      )
    }
    return (
      <BetterScroll
        handleScrollToEnd={this.searchMore}
        className="suggest"
        children={content()}
      />
    )
  }
}

Suggest.propTypes = {
  query: PropTypes.string,
  showSinger: PropTypes.bool
}

Suggest.defaultProps = {
  query: '',
  showSinger: true
}
export default Suggest
