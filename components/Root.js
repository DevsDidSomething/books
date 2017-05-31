import React, { Component } from 'react'
import Books from './Books'
import { Route } from 'react-router-dom'

if ( process.env.BROWSER ) require('../css/App.scss');

class Root extends Component {

  render() {
    return (
      <div>
        <Route exact path="/" render={ props => (
          <Books {...(Object.assign({}, props, this.props))} /> // TODO why can't i use the spread?
        )}/>
        <Route path="/mixes/:filter" render={ props => (
          <Books {...(Object.assign({}, props, this.props))} /> // TODO why can't i use the spread?
        )}/>
      </div>
    )
  }
}

export default Root
