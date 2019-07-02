import React from 'react'
import './index.styl'
class Song extends React.Component {
  render() {
    const song = this.props.song
    return (
      <li className="item" key={song.id}>
        <div className="content">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{`${song.singer} - ${song.album}`}</p>
        </div>
      </li>
    )
  }
}

export default Song
