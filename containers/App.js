import React, { Component } from 'react'
import { connect } from 'react-redux'
import Books from './Books'
import Header from './Header'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions'

class App extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.app.pushedPath) {
      this.props.history.push(nextProps.app.pushedPath)
      this.props.pushToPath(null)
    }
  }

  render(){
    return(
      <span>
        <Header params={this.props.match.params} />
        {this.props.match.params.username &&
          <Books params={this.props.match.params} />
        }
      </span>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(AppActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
