import React, { Component } from 'react'
import { connect } from 'react-redux'
import Books from './Books'
import Header from './Header'
import Home from './Home'
import { pushToPath } from '../actions'


class App extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.app.pushedPath) {
      this.props.history.push(nextProps.app.pushedPath)
      this.props.pushToPath(null)
    }
  }

  render(){
    return(
      <div className='app'>
        <Header params={this.props.match.params}  />
        {this.props.match.params.username &&
          <Books params={this.props.match.params} />
        }
        {!this.props.match.params.username &&
          <Home />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return state
}

const mapDispatchToProps = ({
  pushToPath: pushToPath
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
