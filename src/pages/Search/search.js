import React from 'react'
import SearchBox from 'components/SearchBox'
import BetterScroll from 'components/BetterScroll'
import Suggest from 'components/Suggest'
import HotKey from './hotKey'
import { debounce } from 'common/js/util'

import './search.styl'
class Search extends React.Component {
  shortCutRef = React.createRef()
  searchBoxRef = React.createRef()
  state = {
    query: ''
  }
  getSongsByQuery = query => {
    this.setState({
      query
    })
  }

  addQuery = query => {
    this.searchBoxRef.current.setQuery(query)
  }

  render() {
    const content = () => {
      return <HotKey addQuery={this.addQuery} />
    }
    return (
      <div className="search">
        <div className="search-box-wrapper">
          <SearchBox
            ref={this.searchBoxRef}
            debounceGetSongs={debounce(this.getSongsByQuery, 200)}
          />
        </div>

        {this.state.query ? (
          <div className="search-result">
            <Suggest query={this.state.query} />
          </div>
        ) : (
          <div className="shortcut-wrapper">
            <BetterScroll
              className="shortcut"
              ref={this.shortCutRef}
              children={content()}
            />
          </div>
        )}
      </div>
    )
  }
}

export default Search
