import React from 'react'
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')
const progressBtnWidth = 16

class ProgressBar extends React.Component {
  constructor(props) {
    super(props)
    this.touch = {}
  }
  progressTouchStart = (e) => {
    this.touch.initiated = true
    this.touch.startX = e.touches[0].pageX
    this.touch.left = this.refs.progress.clientWidth
  }

  progressTouchMove = (e) => {
    if (!this.touch.initiated) {
      return
    }
    const deltaX = e.touches[0].pageX - this.touch.startX
    const offsetWidth = Math.min(this.refs.progressBar.clientWidth -
      progressBtnWidth, Math.max(0, this.touch.left + deltaX))
    console.log(deltaX)
    this._offset(offsetWidth)
  }

  progressTouchEnd = (e) => {
    this.touch.initiated = false
    this._triggerPercent()
  }

  progressClick(e) {
    // 说有bug ， 暂时没重现，不改
    this._offset(e.offsetX)
    this._triggerPercent()
  }
  handlePercentChange = () => {
    const newPercent = this.props.percent
    if (newPercent >= 0 && !this.touch.initiated) {
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
      <div className="progress-bar">
        <div className="bar-inner">
          <div class="progress" ref="progress"></div>
          <div className="progress-btn-wrapper"
            ref="progressBtn"
            onTouchStart="progressTouchStart"
            onTouchMove="progressTouchMove"
            onTouchEnd="progressTouchEnd">
            <div className="progress-btn"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProgressBar