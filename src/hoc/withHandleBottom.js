import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
function withHandleBottom(WrapperedComponents, handlePlaylist) {
  const ref = React.createRef()
  return class extends React.Component {
    componentDidMount() {
      console.log(this.props, WrapperedComponents)
      // handlePlaylist(this.props.playList.playList)
    }
    // handlePlaylist = playList => {
    //   throw new Error('组件必须实现handlePlaylist方法')
    // }
    render() {
      return <WrapperedComponents ref={ref} {...this.props} />
    }
  }
}

const composedHoc = compose(
  connect(state => state),
  withHandleBottom
)

export default composedHoc
