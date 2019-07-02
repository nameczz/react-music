import React from 'react'
import { withRouter } from 'react-router-dom'
import Song from 'components/Song'
import Scroll from 'components/Scroll'
import './index.styl'

@withRouter
class MusicList extends React.Component {
  handleBackClick = () => {
    this.props.history.goBack()
  }
  render() {
    let index = 0
    const { title, bgImage, songs } = this.props
    const row = (rowData, sectionID, rowID) => {
      if (!songs.length) {
        return <div>nothing</div>
      }
      const obj = songs[index++]
      return <Song song={obj} />
    }
    return (
      <div className="music-list">
        <div className="back" onClick={this.handleBackClick}>
          <i className="icon-back" />
        </div>
        <h1 className="title">{title}</h1>
        <div className="bg-image">
          <div className="play-wrapper">
            <div className="play">
              <i className="icon-play" />
              <span className="text">随机播放</span>
            </div>
          </div>
          <div
            className="filter"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        </div>
        <Scroll
          listHeader={() => <div />}
          row={row}
          dataSourceLen={songs.length}
        />
      </div>
    )
  }
}

export default MusicList
