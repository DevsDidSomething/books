import React, { Component } from 'react'
import { connect } from 'react-redux'
import Mix from '../components/Mix'
import { deleteMix, searchBook, addBook, updateMix, deleteBook, updateMixOrder, saveConfirmation } from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.app.errors,
    searchResults: state.app.searchResults,
    isSearching: state.app.isSearching,
    showSaveConfirmation: state.app.showSaveConfirmation,
    isFetchingBookshelf: state.app.isFetchingBookshelf
  }
}

const mapDispatchToProps = ({
  deleteMix: deleteMix,
  searchBook: searchBook,
  addBook: addBook,
  updateMix: updateMix,
  deleteBook: deleteBook,
  updateMixOrder: updateMixOrder,
  saveConfirmation: saveConfirmation
})

export default connect(mapStateToProps, mapDispatchToProps)(Mix)
