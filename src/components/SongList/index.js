import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'
class SongList extends React.Component {
  render() {
    return (
      <div className="song-list">
        <ul>
          {this.props.songs.map(song => {
            return (
              <li className="item" key={song.id}>
                <div className="content">
                  <h2 className="name">{song.name}</h2>
                  <p className="desc">{`${song.singer} - ${song.album}`}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

SongList.propType = {
  songs: PropTypes.array.isRequired
}

export default SongList
