import React, { Component } from 'react'
import { connect } from 'react-redux'
import Books from '../components/Books'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    app: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(AppActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Books)
