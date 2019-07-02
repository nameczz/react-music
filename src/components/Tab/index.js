import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { Tabs, WhiteSpace } from 'antd-mobile'
import './index.styl'

const tabs = [
  { title: '推荐', key: 'recommend' },
  { title: '歌手', key: 'singer' },
  { title: '排行', key: 'rank' },
  { title: '搜索', key: 'search' }
]
const activeColor = '#ffcd32'
@withRouter
class Tab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: 0
    }
  }
  handleTabChange = (tab, index) => {
    console.log('onChange', index, tab)
    console.log(this)
  }

  activeTab = (match, location) => {
    console.log(match, location)
    if (!match) {
      return false
    }

    return true
  }

  componentWillMount() {
    const pathname = this.props.location.pathname
    const index = tabs.findIndex(t => pathname.includes(t.key))
    this.setState({
      activeIndex: index === -1 ? 0 : index
    })
  }

  render() {
    return (
      <div className="tab-wrapper">
        <Tabs
          tabBarUnderlineStyle={{
            border: `1px ${activeColor} solid`
          }}
          tabBarActiveTextColor={activeColor}
          tabBarBackgroundColor="#222"
          tabs={tabs}
          initialPage={this.state.activeIndex}
          renderTab={tab => (
            <NavLink
              to={`/${tab.key}`}
              activeClassName="active-tab"
              isActive={this.activeTab}
              style={{ width: '100%', textAlign: 'center' }}
            >
              {tab.title}
            </NavLink>
          )}
          onChange={this.handleTabChange}
        />
        <WhiteSpace />
      </div>
    )
  }
}

export default Tab
