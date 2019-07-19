import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'
class Loading extends React.Component {
  render() {
    return (
      <div className="loading">
        <img
          width="24"
          height="24"
          src={require('./loading.gif')}
          alt="loading"
        />
        <p className="desc">{this.props.title}</p>
      </div>
    )
  }
}

Loading.propTypes = {
  title: PropTypes.string
}

Loading.defaultProps = {
  title: '正在载入。。。'
}

export default Loading
