import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'

class SearchBox extends React.Component {
  state = {
    query: ''
  }
  clear = () => {
    this.setState(
      {
        query: ''
      },
      () => {
        this.props.debounceGetSongs(this.state.query)
      }
    )
  }

  handleInputChange = e => {
    const query = e.target.value
    this.setQuery(query)
  }

  setQuery = query => {
    this.setState({
      query
    })
    this.props.debounceGetSongs(query)
  }

  render() {
    return (
      <div className="search-box">
        <i className="icon-search" />
        <input
          ref={this.inputRef}
          className="box"
          onChange={this.handleInputChange}
          value={this.state.query}
          placeholder={this.props.placeholder}
        />
        {this.state.query && (
          <i className="icon-dismiss" onClick={this.clear} />
        )}
      </div>
    )
  }
}

SearchBox.propTypes = {
  placeholder: PropTypes.string,
  debounceGetSongs: PropTypes.func
}

SearchBox.defaultProps = {
  placeholder: '搜索歌手，歌曲'
}

export default SearchBox
