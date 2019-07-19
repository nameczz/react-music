import React from 'react'
import SearchList from 'components/SearchList'
class SearchHistory extends React.Component {
  render() {
    return (
      <div className="search-history">
        <h1 className="title">
          <span className="text">搜索历史</span>
          <span className="clear">
            <i className="icon-clear" />
          </span>
        </h1>
        <SearchList />
      </div>
    )
  }
}

export default SearchHistory
