import React from 'react'
import { prefixStyle } from 'common/js/dom'
import PropTypes from 'prop-types'
import './index.styl'
const transform = prefixStyle('transform')
const progressBtnWidth = 16

class ProgressBar extends React.Component {
  constructor(props) {
    super(props)
    this.touch = {}
  }
  progressTouchStart = e => {
    this.touch.initiated = true
    this.touch.startX = e.touches[0].pageX
    this.touch.left = this.refs.progress.clientWidth
  }

  progressTouchMove = e => {
    if (!this.touch.initiated) {
      return
    }
    const deltaX = e.touches[0].pageX - this.touch.startX
    const offsetWidth = Math.min(
      this.refs.progressBar.clientWidth - progressBtnWidth,
      Math.max(0, this.touch.left + deltaX)
    )
    console.log(deltaX)
    this._offset(offsetWidth)
  }

  progressTouchEnd = e => {
    this.touch.initiated = false
    this._triggerPercent()
  }

  progressClick = e => {
    // 说有bug ， 暂时没重现，不改
    console.log(e.offsetX)
    this._offset(e.offsetX)
    this._triggerPercent()
  }

  handlePercentChange = () => {
    const newPercent = this.props.percent
    if (newPercent >= 0 && !this.touch.initiated && this.refs.progressBar) {
      const barWidth = this.refs.progressBar.clientWidth - progressBtnWidth
      const offsetWidth = newPercent * barWidth
      this._offset(offsetWidth)
    }
  }

  _triggerPercent() {
    const barWidth = this.refs.progressBar.clientWidth - progressBtnWidth
    const percent = this.refs.progress.clientWidth / barWidth
    this.props.percentChanges(percent)
    // this.$emit('percentChanges', percent)
  }
  _offset(offsetWidth) {
    this.refs.progress.style.width = `${offsetWidth}px`
    this.refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
  }

  render() {
    this.handlePercentChange()
    return (
      <div
        className="progress-bar"
        ref="progressBar"
        onClick={this.progressClick}
      >
        <div className="bar-inner">
          <div className="progress" ref="progress" />
          <div
            className="progress-btn-wrapper"
            ref="progressBtn"
            onTouchStart={this.progressTouchStart}
            onTouchMove={this.progressTouchMove}
            onTouchEnd={this.progressTouchEnd}
          >
            <div className="progress-btn" />
          </div>
        </div>
      </div>
    )
  }
}

ProgressBar.propTypes = {
  percent: PropTypes.number.isRequired,
  percentChanges: PropTypes.func.isRequired
}

export default ProgressBar
