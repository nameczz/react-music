import React from 'react'
import { Tabs, WhiteSpace } from 'antd-mobile'
import './index.styl'

const tabs = [
  { title: '推荐', key: 'recommend' },
  { title: '歌手', key: 'singer' },
  { title: '排行', key: 'rank' },
  { title: '搜索', key: 'search' }
]
const activeColor = '#ffcd32'
class Tab extends React.Component {
  handleTabChange = (tab, index) => {
    console.log('onChange', index, tab)
    console.log(this)
  }
  render() {
    return (
      <div>
        <Tabs
          tabBarUnderlineStyle={{
            border: `1px ${activeColor} solid`
          }}
          tabBarActiveTextColor={activeColor}
          tabBarBackgroundColor="#222"
          tabs={tabs}
          initialPage={0}
          renderTab={tab => <span>{tab.title}</span>}
          onChange={this.handleTabChange}
        />
        <WhiteSpace />
      </div>
    )
  }
}

export default Tab
