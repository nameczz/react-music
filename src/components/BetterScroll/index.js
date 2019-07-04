import React from 'react'
import BSroll from 'better-scroll'
import PropTypes from 'prop-types'
class BetterScroll extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  }
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   // 如果我们 snapshot 有值，说明我们刚刚添加了新的 items，
  //   // 调整滚动位置使得这些新 items 不会将旧的 items 推出视图。
  //   //（这里的 snapshot 是 getSnapshotBeforeUpdate 的返回值）
  //   console.log(prevProps, this.props)
  //   this.refresh()
  // }
  initScroll() {
    if (!this.refs.wrapper) {
      return
    }
    console.log(this.refs.wrapper)
    console.log(this.props)
    this.scroll = new BSroll(this.refs.wrapper, {
      probeType: this.props.probeType,
      click: this.props.click
    })
    console.log(this.scroll)
    if (this.props.handleScroll) {
      let me = this
      this.scroll.on('scroll', pos => {
        me.props.handleScroll(pos)
      })
    }
  }

  enable() {
    this.scroll && this.scroll.enable()
  }

  disable() {
    this.scroll && this.scroll.disable()
  }

  refresh() {
    this.scroll && this.scroll.refresh()
  }

  scrollTo() {
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
  }

  scrollToElement() {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
  }

  render() {
    console.log('bs-render')
    return (
      <div
        ref="wrapper"
        style={{ top: this.props.top }}
        className={this.props.className}
      >
        {this.props.children}
      </div>
    )
  }
}

BetterScroll.propTypes = {
  probeType: PropTypes.number,
  data: PropTypes.array,
  click: PropTypes.bool,
  handleScroll: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  pullup: PropTypes.bool,
  beforeScroll: PropTypes.bool,
  refreshTime: PropTypes.number,
  children: PropTypes.element.isRequired,
  top: PropTypes.number
}

BetterScroll.defaultProps = {
  probeType: 1,
  click: true,
  data: null,
  handleScroll: false,
  pullup: false,
  beforeScroll: false,
  refreshTime: 20
}

export default BetterScroll
