import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'

class ProgressCircle extends React.Component {
  render() {
    const { radius, percent, children } = this.props
    const dashArray = Math.PI * 100
    const dashOffset = (1 - percent) * dashArray
    return (
      <div className="progress-circle">
        <svg
          width={radius}
          height={radius}
          viewBox="0 0 100 100"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="progress-background"
            r="50"
            cx="50"
            cy="50"
            fill="transparent"
          />
          <circle
            className="progress-bar"
            r="50"
            cx="50"
            cy="50"
            fill="transparent"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
          />
        </svg>
        {children}
      </div>
    )
  }
}

ProgressCircle.propTypes = {
  radius: PropTypes.number,
  percent: PropTypes.number
}

ProgressCircle.defaultProps = {
  radius: 32,
  percent: 0
}

export default ProgressCircle
