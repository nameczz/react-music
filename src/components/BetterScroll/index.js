import React from 'react'
import BSroll from 'better-scroll'
import PropTypes from 'prop-types'
class BetterScroll extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 可能又不必要的更新 因为父组件更新
    setTimeout(() => {
      this.refresh()
    }, this.refreshTime)
  }
  initScroll() {
    if (!this.refs.wrapper) {
      return
    }

    this.scroll = new BSroll(this.refs.wrapper, {
      probeType: this.props.probeType,
      click: this.props.click
    })
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
  handleScroll: false,
  pullup: false,
  beforeScroll: false,
  refreshTime: 20
}

export default BetterScroll
