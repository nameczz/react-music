import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'

class SearchList extends React.Component {
  render() {
    return (
      <div className="search-list">
        <ul>
          {this.props.searches.map(v => {
            return (
              <li
                key={v}
                className="search-item"
                onClick={this.props.selectItem}
              >
                <span className="text">{v}</span>
                <span className="icon" onClick={this.deleteOne}>
                  <i className="icon-delete" />
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

SearchList.propTypes = {
  searches: PropTypes.array,
  selectItem: PropTypes.func,
  deleteOne: PropTypes.func
}
export default SearchList
