import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bookshelf from '../components/Bookshelf'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions'
import _ from 'lodash'

class Books extends Component {

  componentWillReceiveProps(nextProps) {
    const params = nextProps.params
    // if (params !== this.props.params) {
    //   this.setState({mode: 'default'})
    // }
    if (!nextProps.app.isFetchingBookshelf) {
      const mixUid = params.mix_id || false
      const username = params.username
      const bookshelf = this.props.bookshelf
      if (_.isEmpty(bookshelf)) {
        this.props.getBookshelf(username, mixUid)
      } else {
        if ( (bookshelf.user.username !== username) || (bookshelf.mix.uid !== mixUid) ) {
          //this means that we are currently showing the 'all' and should be
          if (!(bookshelf.mix.name === 'All' && mixUid === false)) {
            this.props.getBookshelf(username, mixUid)
          }
        }
      }
    }
  }

  render(){
    return(
      <span>
        {!_.isEmpty(this.props.bookshelf) &&
          <Bookshelf params={this.props.params} bookshelf={this.props.bookshelf} app={this.props.app} deleteMix={this.props.deleteMix} searchBook={this.props.searchBook} addBook={this.props.addBook} createMix={this.props.createMix} updateMix={this.props.updateMix} deleteBook={this.props.deleteBook}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Books)
