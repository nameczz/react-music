import React from 'react'
import { connect } from 'react-redux'
import MusicList from 'components/MusicList'

@connect(state => state)
class SingerDetail extends React.Component {
  render() {
    return <div>detail page</div>
  }
}

export default SingerDetail
