import React from 'react'
import BetterScroll from 'components/BetterScroll'
import PropTypes from 'prop-types'
import './index.styl'
class ListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0
    }
    this.touch = {}
    this.listHeight = []
    this.listViewRef = React.createRef()
    this.listGroupRef = React.createRef()
  }

  componentDidUpdate() {
    this._calaculateHeight()
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
    console.log(e)
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
    this._calaculateCurrentIndex(-this.listHeight[index])
    this.listViewRef.current.scrollToElement(list[index], 0)
  }

  // _calaculateDiff = (diff)=>{
  //   let fixedTop = val > 0 && val < TITLE_HEIGHT ? val - TITLE_HEIGHT : 0
  //     if (this.fixedTop === fixedTop) {
  //       return
  //     }
  //     this.fixedTop = fixedTop
  //     this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
  // }

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
        // this.diff = height2 + scrollY
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
    const { data } = this.props
    const { currentIndex } = this.state
    const shortcutList = data.map(v => v.title.substring(0, 1))
    if (!data || !data.length) {
      return null
    }
    console.log(data)
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
                          onClick={() => {}}
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
        </React.Fragment>
      )
    }
    return (
      <BetterScroll
        ref={this.listViewRef}
        className="listview"
        children={content()}
        probeType={3}
      />
    )
  }
}

ListView.propTypes = {
  data: PropTypes.array
}

ListView.defaultProps = {
  data: []
}

export default ListView
