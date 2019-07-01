import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './index.css'
import './common/stylus/index.styl'
import MHeader from './components/MHeader/index'
import Tab from './components/Tab/index'
// router
import Recommend from './pages/Recommend'
// import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <Router>
    <MHeader />
    <Tab />
    <Switch>
      <Route path="/recommend" component={Recommend} />
    </Switch>
  </Router>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
