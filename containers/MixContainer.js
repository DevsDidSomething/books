import React, { Component } from 'react'
import { connect } from 'react-redux'
import Mix from '../components/Mix'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.app.errors,
    searchResults: state.app.searchResults,
    isSearching: state.app.isSearching,
    showSaveConfirmation: state.app.showSaveConfirmation
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(AppActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Mix)
