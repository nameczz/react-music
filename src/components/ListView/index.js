import React from 'react'
import BetterScroll from 'components/BetterScroll'
import PropTypes from 'prop-types'
import './index.styl'

const ANCHOR_HEIGHT = 18 // 右侧字母表单个的高度
const TITLE_HEIGHT = 30
class ListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0
    }
    this.scrollY = 0
    this.touch = {}
    this.listHeight = []
    this.listViewRef = React.createRef()
    this.listGroupRef = React.createRef()
    this.listFixedRef = React.createRef()
  }
  componentDidUpdate() {
    if (!this.listHeight.length) {
      this._calaculateHeight()
    }
  }

  shouldComponentUpdate(prevPros, prevState) {
    // 除去初始状态时，尽量保证不会重复渲染
    if (
      this.listHeight.length &&
      this.state.currentIndex === prevState.currentIndex
    ) {
      return false
    }
    return true
  }

  handleShortcutTouchStart = e => {
    console.log(e)
    let anchorIndex = e.target.getAttribute('data-index')
    let firstTouch = e.touches[0]
    console.log(firstTouch)
    this.touch.y1 = firstTouch.pageY
    this.touch.anchorIndex = anchorIndex
    this._scrollTo(anchorIndex)
  }

  handleShortcutTouchMove = e => {
    let firstTouch = e.touches[0]
    let delta = ((firstTouch.pageY - this.touch.y1) / ANCHOR_HEIGHT) | 0
    let anchorIndex = parseInt(this.touch.anchorIndex) + delta
    this._scrollTo(anchorIndex)
  }

  handleScroll = e => {
    this.scrollY = e.y
    this._calaculateCurrentIndex(e.y)
  }

  _scrollTo = index => {
    if (!index && index !== 0) {
      return
    }
    const list = this.listGroupRef.current.children
    if (index < 0) {
      index = 0
    } else if (index > this.listHeight.length - 2) {
      index = this.listHeight.length - 2
    }
    this.scrollY = -this.listHeight[index]
    this._calaculateCurrentIndex(this.scrollY)
    this.listViewRef.current.scrollToElement(list[index], 0)
  }

  _calaculateDiff = diff => {
    let fixedTop = diff > 0 && diff < TITLE_HEIGHT ? diff - TITLE_HEIGHT : 0
    if (this.fixedTop === fixedTop) {
      return
    }
    this.fixedTop = fixedTop
    this.listFixedRef.current.style.transform = `translate3d(0, ${fixedTop}px, 0)`
  }

  _calaculateCurrentIndex = scrollY => {
    const listHeight = this.listHeight
    if (scrollY > 0) {
      this.setState({
        currentIndex: 0
      })
      return
    }
    // 在中间部分滚动
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (-scrollY >= height1 && -scrollY < height2) {
        this.setState({
          currentIndex: i
        })
        this._calaculateDiff(height2 + scrollY)
        return
      }
    }
    // 当滚动到底部，且-newY大于最后一个元素的上限
    this.setState({
      currentIndex: listHeight.length - 2
    })
  }

  _calaculateHeight = () => {
    // 把所有到高度存储到listgroup
    this.listHeight = []
    const list = this.listGroupRef.current
      ? this.listGroupRef.current.children
      : []
    let height = 0
    this.listHeight.push(height)

    Array.from(list).forEach((item, i) => {
      height += item.clientHeight
      this.listHeight.push(height)
    })
    console.log(this.listHeight)
  }
  render() {
    const { data, selectItem } = this.props
    const { currentIndex } = this.state
    const shortcutList = data.map(v => v.title.substring(0, 1))
    const fixedTitle =
      this.scrollY < 0
        ? data[currentIndex]
          ? data[currentIndex].title
          : ''
        : ''
    console.log(fixedTitle)
    if (!data || !data.length) {
      return null
    }
    const content = () => {
      return (
        <React.Fragment>
          <ul ref={this.listGroupRef}>
            {data.map(group => {
              return (
                <li key={group.title} className="list-group">
                  <h2 className="list-group-title">{group.title}</h2>
                  <ul>
                    {group.items.map(singer => {
                      return (
                        <li
                          key={singer.name}
                          className="list-group-item"
                          onClick={() => {
                            selectItem(singer)
                          }}
                        >
                          <img
                            className="avatar"
                            src={singer.avatar}
                            alt="singer"
                          />
                          <span className="name">{singer.name}</span>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ul>
          <div
            className="list-shortcut"
            onTouchMove={this.handleShortcutTouchMove}
            onTouchStart={this.handleShortcutTouchStart}
          >
            <ul>
              {shortcutList.map((item, index) => {
                return (
                  <li
                    className={`${
                      currentIndex === index ? 'current item' : 'item'
                    }`}
                    data-index={index}
                    key={item}
                  >
                    {item}
                  </li>
                )
              })}
            </ul>
          </div>

          <div
            className="list-fixed"
            ref={this.listFixedRef}
            style={{ display: fixedTitle ? 'inherit' : 'none' }}
          >
            <h1 className="fixed-title">{fixedTitle}</h1>
          </div>
        </React.Fragment>
      )
    }
    return (
      <BetterScroll
        ref={this.listViewRef}
        className="listview"
        children={content()}
        handleScroll={this.handleScroll}
        probeType={3}
      />
    )
  }
}

ListView.propTypes = {
  data: PropTypes.array,
  selectItem: PropTypes.func
}

ListView.defaultProps = {
  data: [],
  selectItem: () => {}
}

export default ListView
