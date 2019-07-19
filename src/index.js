import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk' // 中间件 redux-thunk中间件，改造store.dispatch，使得后者可以接受函数作为参数。
import { Provider } from 'react-redux' // 路由关联redux
import './index.css'
import './common/stylus/index.styl'
import Reducers from './redux/reducers'

import MHeader from './components/MHeader/index'
import Tab from './components/Tab/index'
// router
import Recommend from './pages/Recommend'
import Disc from './pages/Recommend/disc'
import Singer from './pages/Singer/singer'
import SingerDetail from './pages/Singer/detail'
import Rank from './pages/Rank/rank'
import RankList from './pages/Rank/list'
import Search from './pages/Search/search'
import Player from './components/Player'
// import * as serviceWorker from './serviceWorker'

const store = createStore(
  Reducers,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MHeader />
      <Tab />
      <Switch>
        <Route path="/" exact component={Recommend} />
        <Route path="/recommend" exact component={Recommend} />
        <Route path="/recommend/:id" component={Disc} />
        <Route path="/singer" exact component={Singer} />
        <Route path="/singer/:id" component={SingerDetail} />
        <Route path="/rank" exact component={Rank} />
        <Route path="/rank/:id" component={RankList} />
        <Route path="/search" component={Search} />
      </Switch>
      <Player />
    </Router>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
