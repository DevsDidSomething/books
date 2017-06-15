import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bookshelf from '../components/Bookshelf'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions'
import _ from 'lodash'

class Books extends Component {

  componentWillReceiveProps(nextProps) {
    const params = nextProps.params
    if (!nextProps.app.isFetchingBookshelf) {
      const mixUid = params.mix_id || false
      const username = params.username
      const bookshelf = this.props.bookshelf
      if (_.isEmpty(bookshelf)) {
        this.props.getBookshelf(username, mixUid)
      } else if (bookshelf.user.username !== username) {
        this.props.getBookshelf(username, mixUid)
      } else if ((bookshelf.mix.uid !== mixUid) && !(bookshelf.mix.name === 'All' && mixUid === false)){
        this.props.getBookshelf(username, mixUid)
      }
    }
  }

  componentWillMount(){
    const mixUid = this.props.params.mix_id || false
    const username = this.props.params.username
    this.props.getBookshelf(username, mixUid)
  }

  render(){
    return(
      <span>
        {!_.isEmpty(this.props.bookshelf) &&
          <Bookshelf params={this.props.params} bookshelf={this.props.bookshelf} app={this.props.app} deleteMix={this.props.deleteMix} searchBook={this.props.searchBook} addBook={this.props.addBook} createMix={this.props.createMix} updateMix={this.props.updateMix} deleteBook={this.props.deleteBook} updateMixOrder={this.props.updateMixOrder} />
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
