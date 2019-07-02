import React from 'react'
import { ListView } from 'antd-mobile'

function genData(pIndex = 0, NUM_ROWS = 0) {
  const dataBlob = {}
  for (let i = 0; i < NUM_ROWS; i++) {
    const ii = pIndex * NUM_ROWS + i
    dataBlob[`${ii}`] = `row - ${ii}`
  }
  return dataBlob
}

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  )
}

// props: 必须: dataSourceLen listHeader row 可选: height  customBodyFunc
class Scroll extends React.Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })

    this.state = {
      dataSource,
      isLoading: true,
      height: document.documentElement.clientHeight - 94,
      width: document.documentElement.clientWidth
    }
  }
  componentDidMount() {
    if (this.props.height) {
      this.setState({
        height: this.props.height
      })
    }
    this.setDataSource()
  }

  // 设置datasource
  setDataSource = () => {
    this.rData = genData(0, this.props.dataSourceLen)
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      isLoading: false
    })
  }

  render() {
    const { listHeader, row, customBodyFunc } = this.props
    return (
      <ListView
        ref={el => (this.lv = el)}
        dataSource={this.state.dataSource}
        renderHeader={listHeader}
        renderBodyComponent={() => {
          if (customBodyFunc) {
            return customBodyFunc()
          }
          return <MyBody />
        }}
        renderRow={row}
        style={{
          height: this.state.height,
          overflow: 'auto'
        }}
        onScroll={() => {
          console.log('scroll')
        }}
        scrollRenderAheadDistance={500}
      />
    )
  }
}

export default Scroll
