import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'
class SongList extends React.Component {
  render() {
    return (
      <div className="song-list">
        <ul>
          {this.props.songs.map((song, index) => {
            return (
              <li
                className="item"
                key={song.id}
                onClick={() => {
                  this.props.handleSongClick(song, index)
                }}
              >
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
  songs: PropTypes.array.isRequired,
  handleSongClick: PropTypes.func.isRequired
}

export default SongList
